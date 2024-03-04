const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
});

const PushToken = mongoose.model('PushToken', pushTokenSchema);

router.post('/save-push-token', async (req, res) => {
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

module.exports = PushToken;
