import mongoose, { Schema, Model } from 'mongoose';
import { ICareer } from '../types/index.js';

const CareerSchema = new Schema<ICareer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  coverLetter: { type: String },
  resumeUrl: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewing', 'Shortlisted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const Career: Model<ICareer> = mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);
export default Career;
