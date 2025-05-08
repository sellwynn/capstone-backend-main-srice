const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Define the User model
const User = mongoose.model('User', new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  provider: { type: String, required: true }
}));

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method === 'POST') {
    const { fullName, email, phone, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI);

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user and save to the database
      const newUser = new User({
        fullName,
        email,
        phone,
        password,
        provider: 'local'
      });

      await newUser.save();

      // Send success response
      return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
      console.error(error); // Useful for debugging
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
