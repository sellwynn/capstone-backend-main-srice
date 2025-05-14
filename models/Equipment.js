import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  equipName: { type: String, required: true, unique: true },
  conditionEquip: { type: String, required: true },
  inputLastServicedDate: { type: String, required: true }
  }); 

export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);