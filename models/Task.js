import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true, unique: true },
  assignedTask: { type: String, required: true },
  inputDueDate: { type: String, required: true }
  }); 

export default mongoose.models.Task || mongoose.model('Task', taskSchema);