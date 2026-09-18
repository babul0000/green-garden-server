import mongoose, { Schema, Model } from 'mongoose';
import { IService } from '../types/index.js';

const ServiceSchema = new Schema<IService>({
  label: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  longContent: { type: String },
  icon: { type: String, default: '🌱' },
  banner: { type: String },
  seoTitle: { type: String },
  seoKeywords: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;
