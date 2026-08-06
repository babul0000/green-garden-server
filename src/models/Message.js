import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
