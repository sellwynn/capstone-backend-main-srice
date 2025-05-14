const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;


const Task = mongoose.model('Task', new mongoose.Schema({
  taskName: { type: String, required: true, unique: true},
  assignedTask: { type: String, required: true},
  inputDueDate: { type: String, required: true }
}));

module.exports = async (req, res) => {
  
  if (req.method === 'POST') {
    const { taskName, assignedTask, inputDueDate} = req.body;

    // Validation
    if (!taskName || !assignedTask || !inputDueDate) {
      return res.status(400).json({ message: 'Task name, assigned task, due date are required' });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI);

      // Create a new user and save to the database
      const newTask = new Task({
        taskName,
        assignedTask,
        inputDueDate,
      });

      await newTask.save();

      // Send success response
      return res.status(201).json({ message: 'Task created successfully' });

    } catch (error) {
      console.error(error); // Useful for debugging
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
