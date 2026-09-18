import mongoose, { Schema, Model } from 'mongoose';
import { IBooking } from '../types/index.js';

const BookingSchema = new Schema<IBooking>({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  service: { type: String, required: true },
  budgetRange: { type: String },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' },
  assignedStaff: { type: String, default: 'Unassigned' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
