import mongoose, { Schema, Model } from 'mongoose';
import { IBlog, IComment } from '../types/index.js';

const CommentSchema = new Schema<IComment>({
  name: { type: String, required: true },
  text: { type: String, required: true },
  approved: { type: Boolean, default: true }
}, { timestamps: true });

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  readingTime: { type: String, default: '5 mins' },
  comments: [CommentSchema]
}, { timestamps: true });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
