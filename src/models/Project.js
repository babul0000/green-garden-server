import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String },
  category: { type: String, required: true }, // e.g. Residential, Commercial, Villa, Office, Apartment
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

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
