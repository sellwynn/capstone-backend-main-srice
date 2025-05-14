const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;


const Equipment = mongoose.model('Equipment', new mongoose.Schema({
  equipName: { type: String, required: true, unique: true},
  conditionEquip: { type: String, required: true},
  inputLastServicedDate: { type: String, required: true }
}));

module.exports = async (req, res) => {
  
  if (req.method === 'POST') {
    const { equipName, conditionEquip, inputLastServicedDate} = req.body;

    // Validation
    if (!equipName || !conditionEquip || !inputLastServicedDate) {
      return res.status(400).json({ message: 'Equipment name,Equipment condition, and its service date are required' });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI);

      // Create a new user and save to the database
      const newEquipment = new Equipment({
        equipName,
        conditionEquip,
        inputLastServicedDate,
      });

      await newEquipment.save();

      // Send success response
      return res.status(201).json({ message: 'Equipment created successfully' });

    } catch (error) {
      console.error(error); // Useful for debugging
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
