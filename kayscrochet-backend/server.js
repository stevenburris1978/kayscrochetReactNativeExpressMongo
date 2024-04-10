const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Item = require('./models/item');
const helmet = require('helmet');
const admin = require('firebase-admin');
const PushToken = require('./models/pushToken');
const cors = require('cors');
const Expo = require('expo-server-sdk').Expo
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_PATH))
});

const app = express();

app.use(cors());

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));


// Admin Schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model('Admin', adminSchema);

// JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (image, key) => {
  const params = {
    Bucket: 'kayscrochetmobilebucket',
    Key: key,
    Body: image,
    ACL: 'public-read',
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params,
    });

    await upload.done();
    return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

app.use(helmet());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);  
    res.status(500).send('An error occurred');
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
        return res.status(401).send('Admin not found');
    }

    if (!await bcrypt.compare(password, admin.password)) {
        return res.status(401).send('Invalid password');
    }

    // Create a token
    const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/admin/check-auth', verifyToken, (req, res) => {
    res.json({ success: true, message: "Authenticated" });
});

// Route to handle image upload
app.post('/api/upload', async (req, res) => {
  try {
    const base64Data = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const imageKey = `${Date.now()}.jpg`;

    // AWS SDK v3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: base64Data,
      ContentType: 'image/jpeg',
      ContentEncoding: 'base64',
      
    };

    const command = new PutObjectCommand(params);

    const uploadResult = await s3Client.send(command);
    res.json({ Location: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});


// GET all items
app.get('/items', async (req, res) => {
    try {
      const items = await Item.find({});
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// POST a new item
app.post('/items', async (req, res) => {
  const newItem = new Item({
    description: req.body.description,
    date: req.body.date,
    images: req.body.images,
  });

  try {
    const savedItem = await newItem.save();
    sendPushNotification(savedItem); 
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an item
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/save-push-token', async (req, res) => {
  const { token } = req.body;
  try {
    const existingToken = await PushToken.findOne({ token });
    if (!existingToken) {
      const newToken = new PushToken({ token });
      await newToken.save();
    }
    res.status(200).json({ message: 'Token saved successfully.' });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ error: 'Error saving token.' });
  }
});

const sendPushNotification = async (itemData) => {
  const tokens = await PushToken.find({});
  const fcmTokens = tokens.map(t => t.token); 

  if (fcmTokens.length > 0) {
    const message = {
      notification: {
        title: "New Item Alert",
        body: itemData.description
      },
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Notifications sent successfully:', response);

      const failedTokens = response.responses
                               .map((resp, idx) => resp.success ? null : fcmTokens[idx])
                               .filter(token => token != null);

      if (failedTokens.length > 0) {
        console.log('Failed tokens:', failedTokens);

      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }
};

// update an item
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) 
    return res.status(404).json({ message: 'Item not found' });

    // Update fields
    item.description = req.body.description || item.description;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
