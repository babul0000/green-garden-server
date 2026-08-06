import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  label: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  longContent: { type: String },
  icon: { type: String, default: '🌱' }
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
