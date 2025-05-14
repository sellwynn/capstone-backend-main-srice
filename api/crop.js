const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;


const Crop = mongoose.model('Crop', new mongoose.Schema({
  cropName: { type: String, required: true, unique: true},
  cropVariety: { type: String, required: true},
  cropHarvest: { type: String, required: true }
}));

module.exports = async (req, res) => {
  
  if (req.method === 'POST') {
    const { cropName, cropVariety, cropHarvest} = req.body;

    // Validation
    if (!cropName || !cropVariety || !cropHarvest) {
      return res.status(400).json({ message: 'Crop name, Crop variety, and Crop harvest date are required' });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI);

      // Create a new user and save to the database
      const newCrop = new Crop({
        cropName,
        cropVariety,
        cropHarvest,
      });

      await newCrop.save();

      // Send success response
      return res.status(201).json({ message: 'Crop created successfully' });

    } catch (error) {
      console.error(error); // Useful for debugging
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
