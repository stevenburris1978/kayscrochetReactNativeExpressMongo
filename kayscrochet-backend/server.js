const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Item = require('./models/item');
const helmet = require('helmet');
const aws = require('aws-sdk');
const PushToken = require('./models/pushToken');
const cors = require('cors');
const ImagePicker = require('expo-image-picker').ImagePicker;
const Expo = require('expo-server-sdk').Expo

require('dotenv').config();

const app = express();

app.use(cors());

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (itemData) => {
  const tokens = await PushToken.find({});
  const expo = new Expo();
  const messages = tokens.map(pushToken => {
    if (!Expo.isExpoPushToken(pushToken.token)) {
      console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
      return null;
    }
    return {
      to: pushToken.token,
      sound: 'default',
      title: "Kay's Crochet Has New Items!",
      body: itemData.description,
    };
  }).filter(message => !!message);

  const chunks = expo.chunkPushNotifications(messages);
  const sendPromises = [];
  for (const chunk of chunks) {
    sendPromises.push(expo.sendPushNotificationsAsync(chunk));
  }

  try {
    await Promise.all(sendPromises);
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
};

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'us-east-1'
});

const s3 = new aws.S3();

const uploadToS3 = async (image) => {
  const params = {
    Bucket: 'kayscrochetmobilebucket',
    Key: Date.now().toString(),
    Body: image,
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.post('/upload-images', async (req, res) => {
  try {
    const { base64 } = req.body;
    const imageData = base64.split(';base64,').pop();
    const imageBuffer = Buffer.from(imageData, 'base64');
    const imageUrl = await uploadToS3(imageBuffer);
    res.json({ imageUrl });
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
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for saving push tokens
app.post('/save-push-token', async (req, res) => {
  const { token } = req.body;

  try {
    let pushToken = await PushToken.findOne({ token });
    if (!pushToken) {
      pushToken = new PushToken({ token });
      await pushToken.save();
    }
    res.status(200).send('Token saved.');
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).send('Error saving token.');
  }
});

// update an item
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update fields
    item.description = req.body.description || item.description;
    item.date = req.body.date || item.date;

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
