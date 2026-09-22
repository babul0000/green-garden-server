export interface IService {
  id?: string;
  label: string;
  slug: string;
  category?: string;
  desc?: string;
  longContent?: string;
  icon?: string;
  banner?: string;
  pricing?: string;
  features?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITestimonial {
  name?: string;
  text?: string;
  rating?: number;
}

export interface IProject {
  id?: string;
  name: string;
  slug: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  category: string;
  location?: string;
  description?: string;
  progress?: number;
  status?: string;
  budget?: number;
  totalExpense?: number;
  startDate?: Date;
  deadline?: Date;
  completionDate?: Date;
  beforeImage?: string;
  afterImage?: string;
  wipImages?: string[];
  images?: string[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGallery {
  id?: string;
  imageUrl: string;
  beforeImageUrl?: string;
  category: string;
  title: string;
  caption?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  id?: string;
  name: string;
  text: string;
  approved: boolean;
  createdAt?: Date;
  blogId?: string;
  userId?: string;
}

export interface IBlog {
  id?: string;
  title: string;
  slug: string;
  author: string;
  coverImage?: string;
  category: string;
  content: string;
  readingTime?: string;
  comments?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  id?: string;
  clientName: string;
  clientEmail: string;
  phone?: string;
  address?: string;
  service: string;
  budgetRange?: string;
  message?: string;
  status: string;
  paymentStatus?: string;
  assignedStaff?: string;
  bookingDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface ICareer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  coverLetter?: string;
  resumeUrl: string;
  status?: string;
  createdAt?: Date;
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

export interface ISetting {
  id?: string;
  key: string;
  value: ISiteConfig | Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
