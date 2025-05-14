import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true, unique: true },
  fieldLocation: { type: String, required: true },
  fieldSize: { type: String, required: true }
  }); 

export default mongoose.models.Field || mongoose.model('Field', fieldSchema);