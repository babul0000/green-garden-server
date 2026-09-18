import mongoose, { Schema } from 'mongoose';
const GallerySchema = new Schema({
    imageUrl: { type: String, required: true },
    beforeImageUrl: { type: String },
    category: { type: String, required: true },
    title: { type: String, required: true },
    caption: { type: String },
    watermarked: { type: Boolean, default: true }
}, { timestamps: true });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
export default Gallery;
