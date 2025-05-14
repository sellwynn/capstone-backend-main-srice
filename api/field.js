const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;


const Field = mongoose.model('Field', new mongoose.Schema({
  fieldName: { type: String, required: true, unique: true},
  fieldLocation: { type: String, required: true},
  fieldSize: { type: String, required: true }
}));

module.exports = async (req, res) => {
  
  if (req.method === 'POST') {
    const { fieldName, fieldLocation, fieldSize} = req.body;

    // Validation
    if (!fieldName || !fieldLocation || !fieldSize) {
      return res.status(400).json({ message: 'Field name, Field Location, and Field size are required' });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI);

      // Create a new user and save to the database
      const newField = new Field({
        fieldName,
        fieldLocation,
        fieldSize,
      });

      await newField.save();

      // Send success response
      return res.status(201).json({ message: 'Field created successfully' });

    } catch (error) {
      console.error(error); // Useful for debugging
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
