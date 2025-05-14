import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true, unique: true },
  cropVariety: { type: String, required: true },
  cropHarvest: { type: String, required: true }
  }); 

export default mongoose.models.Crop || mongoose.model('Crop', cropSchema);