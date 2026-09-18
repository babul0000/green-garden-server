import mongoose, { Schema } from 'mongoose';
const CareerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    coverLetter: { type: String },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewing', 'Shortlisted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });
const Career = mongoose.models.Career || mongoose.model('Career', CareerSchema);
export default Career;
