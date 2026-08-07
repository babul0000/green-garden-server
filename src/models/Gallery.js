import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  beforeImageUrl: { type: String }, // For before/after comparisons
  category: { type: String, required: true }, // e.g. Rooftop, Vertical, Landscape, Indoor
  title: { type: String, required: true },
  caption: { type: String },
  watermarked: { type: Boolean, default: true }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', GallerySchema);
export default Gallery;
