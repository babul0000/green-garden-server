import { z } from 'zod';

// ==========================================
// COMMON VALIDATORS
// ==========================================
const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;

// ==========================================
// SERVICE SCHEMAS
// ==========================================
export const createServiceSchema = z.object({
  label: z.string().min(2, 'Service name must be at least 2 characters'),
  slug: z.string().optional(),
  category: z.string().optional().default('Landscape Design'),
  desc: z.string().optional(),
  icon: z.string().optional(),
  pricing: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
});

export const updateServiceSchema = createServiceSchema.partial();

// ==========================================
// PROJECT SCHEMAS
// ==========================================
export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  slug: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  category: z.string().optional().default('Residential'),
  location: z.string().optional(),
  description: z.string().optional(),
  budget: z.union([z.number(), z.string()]).optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  beforeImage: z.string().url().optional().or(z.literal('')),
  afterImage: z.string().url().optional().or(z.literal('')),
  wipImages: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(['PLANNING', 'RUNNING', 'COMPLETED', 'MAINTENANCE']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

// ==========================================
// BOOKING SCHEMAS
// ==========================================
export const createBookingSchema = z.object({
  clientName: z.string().min(2, 'Name is required'),
  clientEmail: z.string().email('Valid email required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  service: z.string().min(2, 'Service is required'),
  budgetRange: z.string().optional(),
  message: z.string().optional(),
  userId: z.string().optional(),
});

// ==========================================
// EMPLOYEE SCHEMAS
// ==========================================
export const createEmployeeSchema = z.object({
  employeeId: z.string().optional(),
  name: z.string().min(2, 'Employee name is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(2, 'Department is required'),
  responsibility: z.string().optional(),
  joiningDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Valid joining date required'),
  education: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  salary: z.union([z.number(), z.string()]).optional(),
  personalPhone: z.string().optional(),
  personalAddress: z.string().optional(),
  photo: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional(),
});

// ==========================================
// QUOTATION SCHEMAS
// ==========================================
export const quotationItemSchema = z.object({
  category: z.string().optional().default('Landscape Design'),
  itemTitle: z.string().min(1, 'Item title required'),
  quantity: z.union([z.number(), z.string()]).transform((v) => parseFloat(String(v)) || 1),
  unit: z.string().optional().default('pcs'),
  unitPrice: z.union([z.number(), z.string()]).transform((v) => parseFloat(String(v)) || 0),
});

export const createQuotationSchema = z.object({
  projectId: z.string().optional(),
  userId: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  discount: z.union([z.number(), z.string()]).optional().default(0),
  advance: z.union([z.number(), z.string()]).optional().default(0),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

// ==========================================
// BLOG SCHEMAS
// ==========================================
export const createBlogSchema = z.object({
  title: z.string().min(5, 'Blog title must be at least 5 characters'),
  slug: z.string().optional(),
  author: z.string().min(2, 'Author name required'),
  coverImage: z.string().optional(),
  category: z.string().optional().default('Rooftop Gardening'),
  content: z.string().min(50, 'Blog content must be at least 50 characters'),
  readingTime: z.string().optional().default('5 mins'),
});

export const createCommentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  text: z.string().min(5, 'Comment must be at least 5 characters'),
  userId: z.string().optional(),
});

// ==========================================
// REVIEW SCHEMAS
// ==========================================
export const createReviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, 'Review text must be at least 10 characters'),
  service: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().optional(),
  userId: z.string().optional(),
  projectId: z.string().optional(),
});

// ==========================================
// TREE DOCTOR SCHEMAS
// ==========================================
export const createTreeDoctorSchema = z.object({
  clientName: z.string().min(2, 'Client name is required').optional(),
  name: z.string().min(2).optional(),
  clientPhone: z.string().min(8, 'Phone is required').optional(),
  phone: z.string().min(8).optional(),
  location: z.string().min(2, 'Location is required'),
  treeName: z.string().optional().default('গাছ/বৃক্ষ'),
  problem: z.string().min(5, 'Problem description required'),
  problemDesc: z.string().optional(),
  treePhotoUrl: z.string().optional(),
  preferredVisitTime: z.string().optional(),
  isEmergency: z.union([z.boolean(), z.string()]).optional().default(false),
});

// ==========================================
// DESIGN REQUEST SCHEMAS
// ==========================================
export const createDesignRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  spaceType: z.enum(['Rooftop', 'Balcony', 'Yard', 'Office', 'Resort', 'Restaurant']).optional().default('Rooftop'),
  designStyle: z.enum(['Luxury', 'Modern', 'Natural', 'Standard']).optional().default('Modern'),
  features: z.array(z.string()).optional().default([]),
  approxArea: z.string().optional(),
  budgetRange: z.string().optional(),
  sitePhotoUrl: z.string().optional(),
  adminNotes: z.string().optional(),
});

// ==========================================
// ATTENDANCE SCHEMAS
// ==========================================
export const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID required'),
  type: z.enum(['check-in', 'check-out']),
  notes: z.string().optional(),
});

// ==========================================
// MAINTENANCE SCHEMAS
// ==========================================
export const createMaintenanceSchema = z.object({
  projectId: z.string().optional(),
  customerId: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientPhone: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'REGULAR', 'ONE_TIME']).optional().default('MONTHLY'),
  scheduledDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Valid date required'),
  assignedStaffId: z.string().optional(),
  notes: z.string().optional(),
});

// ==========================================
// CAREER SCHEMAS
// ==========================================
export const createCareerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone is required'),
  department: z.string().min(2, 'Department is required'),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url('Valid resume URL required'),
});

// ==========================================
// ASSIGNMENT SCHEMAS
// ==========================================
export const createAssignmentSchema = z.object({
  projectId: z.string().min(1, 'Project ID required'),
  employeeId: z.string().min(1, 'Employee ID required'),
  roleOnTask: z.string().optional().default('Lead Gardener'),
  assignedDate: z.string().optional(),
});

// ==========================================
// INVENTORY SCHEMAS
// ==========================================
export const createInventorySchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  category: z.string().optional().default('Other'),
  stockQuantity: z.number().min(0).optional().default(0),
  minThreshold: z.number().min(0).optional().default(10),
  unit: z.string().optional().default('pcs'),
  unitCost: z.number().min(0).optional().default(0),
  location: z.string().optional().default('Main Nursery'),
  supplier: z.string().optional(),
});

export const updateInventorySchema = createInventorySchema.partial();
