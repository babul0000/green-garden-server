import mongoose, { Schema, Model } from 'mongoose';
import { IProject } from '../types/index.js';

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  videoUrl: { type: String },
  location: { type: String },
  duration: { type: String },
  budgetRange: { type: String },
  challenges: { type: String },
  solution: { type: String },
  clientTestimonial: {
    name: { type: String },
    text: { type: String },
    rating: { type: Number, default: 5 }
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
