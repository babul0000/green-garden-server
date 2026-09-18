import { Document, Types } from 'mongoose';

export interface IService extends Document {
  label: string;
  slug: string;
  desc: string;
  longContent?: string;
  icon?: string;
  banner?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonial {
  name?: string;
  text?: string;
  rating?: number;
}

export interface IProject extends Document {
  name: string;
  slug: string;
  client?: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  location?: string;
  duration?: string;
  budgetRange?: string;
  challenges?: string;
  solution?: string;
  clientTestimonial?: ITestimonial;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGallery extends Document {
  imageUrl: string;
  beforeImageUrl?: string;
  category: string;
  title: string;
  caption?: string;
  watermarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id?: Types.ObjectId;
  name: string;
  text: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  category: string;
  content: string;
  readingTime: string;
  comments: Types.DocumentArray<IComment & Document>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  phone: string;
  address?: string;
  service: string;
  budgetRange?: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  assignedStaff: string;
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICareer extends Document {
  name: string;
  email: string;
  phone: string;
  department: string;
  coverLetter?: string;
  resumeUrl: string;
  status: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteConfig {
  title: string;
  phone: string;
  email: string;
  address: string;
  fbPage: string;
  youtube: string;
  themeColor: string;
  seoDescription: string;
  [key: string]: unknown;
}

export interface ISetting extends Document {
  key: string;
  value: ISiteConfig | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
