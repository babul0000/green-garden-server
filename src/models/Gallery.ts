import mongoose, { Schema, Model } from 'mongoose';
import { IGallery } from '../types/index.js';

const GallerySchema = new Schema<IGallery>({
  imageUrl: { type: String, required: true },
  beforeImageUrl: { type: String },
  category: { type: String, required: true },
  title: { type: String, required: true },
  caption: { type: String },
  watermarked: { type: Boolean, default: true }
}, { timestamps: true });

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
export default Gallery;
