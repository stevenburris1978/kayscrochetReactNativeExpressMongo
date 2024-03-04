const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Item = require('./models/item');
const router = express.Router();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const PushToken = require('./models/pushToken');

require('dotenv').config();

const app = express();

const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (itemData) => {
  const tokens = await PushToken.find({});
  const messages = tokens.map(pushToken => {
    return {
      token: pushToken.token,
      notification: {
        title: "Kay's Crochet Has New Items!",
        body: itemData.description,
      },
    };
  });

  admin.messaging().sendAll(messages)
    .then((response) => {
      console.log('Successfully sent messages:', response);
    })
    .catch((error) => {
      console.log('Error sending messages:', error);
    });
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
  });

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'your-region'
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-bucket-name',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});
  
app.use(limiter);

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
app.post('/upload-images', upload.array('images', 10), (req, res) => {
  const imageUrls = req.files.map(file => file.location);
  res.send(imageUrls);
});

// GET all items
router.get('/items', async (req, res) => {
    try {
      const items = await Item.find({});
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// POST a new item
router.post('/items', async (req, res) => {
  const newItem = new Item({
    description: req.body.description,
    date: req.body.date,
    images: req.body.images,
  });

  try {
    const savedItem = await newItem.save();
    sendPushNotification(savedItem); // Call the function to send a notification
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an item
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update an item
router.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update fields
    item.description = req.body.description || item.description;
    item.date = req.body.date || item.date;
    // update other fields as necessary

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
  
  // Use the router in your app
  app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
