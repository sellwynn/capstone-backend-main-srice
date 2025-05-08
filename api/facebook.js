const mongoose = require('mongoose');
const fetch = require('node-fetch');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: false }, // optional, not all Facebook users expose email
  facebookId: { type: String, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  provider: { type: String, required: true }
}));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { userID, accessToken } = req.body;
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  try {
    await mongoose.connect(mongoURI);

    // Validate the token
    const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`);
    const debugData = await debugRes.json();

    if (!(debugData.data && debugData.data.is_valid)) {
      return res.status(401).json({ message: 'Invalid Facebook access token' });
    }

    // Get user info
    const userRes = await fetch(`https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`);
    const payload = await userRes.json();

    if (!payload.id || payload.error) {
      return res.status(400).json({ message: 'Failed to fetch Facebook user data', error: payload.error });
    }

    const user = await User.findOneAndUpdate(
      { facebookId: payload.id },
      {
        fullName: payload.name,
        email: 'facebook', // email might not be present
        facebookId: payload.id,
        password: payload.password,
        provider: 'facebook'
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Facebook login successful', user });

  } catch (err) {
    console.error('Facebook login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
