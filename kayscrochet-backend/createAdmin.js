const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdminUser() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password1018!', salt);

    const admin = new Admin({
        username: 'kay',
        password: hashedPassword
    });

    await admin.save();
    console.log('Admin user created');
}

createAdminUser().then(() => {
    mongoose.connection.close();
});
