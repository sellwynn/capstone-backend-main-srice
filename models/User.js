import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, default: 'N/A' },
  password: { type: String },
  provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  facebookId: { type: String }
}); this is my User.js 

export default mongoose.models.User || mongoose.model('User', userSchema);