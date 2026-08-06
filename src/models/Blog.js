import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  approved: { type: Boolean, default: true } // auto-approved for simplicity, but editable by admin
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  readingTime: { type: String, default: '5 mins' },
  comments: [CommentSchema]
}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
