const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  provider: { type: String, required: true }
}));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { tokenId } = req.body;

  try {
    await mongoose.connect(mongoURI);

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = await User.findOneAndUpdate(
      { email: payload.email },
      {
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone || 'N/A',
        password: 'google',
        provider: 'google'
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Google login successful', user });

  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};
