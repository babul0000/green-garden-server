import express from 'express';
import { prisma } from '../db.js';
import { authenticate, requireAdmin, requireEmployee, requireModerator } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { createServiceSchema, updateServiceSchema, createProjectSchema, updateProjectSchema, createBookingSchema, createEmployeeSchema, updateEmployeeSchema, createQuotationSchema, createBlogSchema, createCommentSchema, createReviewSchema, createTreeDoctorSchema, createDesignRequestSchema, attendanceSchema, createMaintenanceSchema, createCareerSchema, createAssignmentSchema, createInventorySchema, updateInventorySchema, } from '../middleware/schemas.js';
const router = express.Router();
function getId(req) {
    return String(req.params.id);
}
// Helper to calculate experience
function calculateExperience(joiningDate) {
    const now = new Date();
    let years = now.getFullYear() - joiningDate.getFullYear();
    let months = now.getMonth() - joiningDate.getMonth();
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    return { years: Math.max(0, years), months: Math.max(0, months) };
}
// Safe error message — hides internal details in production
function safeError(error) {
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred.';
}
// ==========================================
// 1. SERVICES ROUTES
// ==========================================
// Public: anyone can read services
router.get('/services', async (req, res) => {
    try {
        const { category, search } = req.query;
        const where = {};
        if (category && category !== 'All') {
            where.category = { contains: String(category), mode: 'insensitive' };
        }
        if (search) {
            where.OR = [
                { label: { contains: String(search), mode: 'insensitive' } },
                { desc: { contains: String(search), mode: 'insensitive' } },
                { category: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const services = await prisma.service.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.get('/services/:id', async (req, res) => {
    try {
        const id = getId(req);
        const service = await prisma.service.findFirst({
            where: { OR: [{ id }, { slug: id }] },
        });
        if (!service)
            return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Protected: only admin/editor can create, update, delete
router.post('/services', authenticate, requireAdmin, validate(createServiceSchema), async (req, res) => {
    try {
        const { label, slug, category, desc, icon, pricing, features, benefits } = req.body;
        const generatedSlug = slug || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newService = await prisma.service.create({
            data: {
                label,
                slug: generatedSlug,
                category: category || 'Landscape Design',
                desc: desc || null,
                icon: icon || null,
                pricing: pricing || null,
                features: Array.isArray(features) ? features : [],
                benefits: Array.isArray(benefits) ? benefits : [],
            },
        });
        res.status(201).json(newService);
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return res.status(409).json({ error: 'A service with this slug already exists.' });
        }
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/services/:id', authenticate, requireAdmin, validate(updateServiceSchema), async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.service.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/services/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.service.delete({ where: { id } });
        res.json({ message: 'Service deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 2. PROJECTS ROUTES
// ==========================================
router.get('/projects', async (req, res) => {
    try {
        const { category, status, search } = req.query;
        const where = {};
        if (category && category !== 'All') {
            where.category = { contains: String(category), mode: 'insensitive' };
        }
        if (status && status !== 'All') {
            where.status = String(status);
        }
        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: 'insensitive' } },
                { location: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const projects = await prisma.project.findMany({
            where,
            include: { assignments: { include: { employee: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.get('/projects/:id', async (req, res) => {
    try {
        const id = getId(req);
        const project = await prisma.project.findFirst({
            where: { OR: [{ id }, { slug: id }] },
            include: {
                assignments: { include: { employee: true } },
                plantHealthRecords: true,
                maintenancePlans: true,
            },
        });
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Admin only: create/update/delete projects
router.post('/projects', authenticate, requireAdmin, validate(createProjectSchema), async (req, res) => {
    try {
        const { name, slug, clientId, clientName, clientPhone, category, location, description, budget, startDate, deadline, beforeImage, afterImage, wipImages, images, featured } = req.body;
        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newProject = await prisma.project.create({
            data: {
                name, slug: generatedSlug, clientId: clientId || null, clientName: clientName || null,
                clientPhone: clientPhone || null, category: category || 'Residential', location: location || null,
                description: description || null, progress: 0, status: 'RUNNING',
                budget: budget ? parseFloat(String(budget)) : null,
                startDate: startDate ? new Date(startDate) : new Date(),
                deadline: deadline ? new Date(deadline) : null,
                beforeImage: beforeImage || null, afterImage: afterImage || null,
                wipImages: Array.isArray(wipImages) ? wipImages : [],
                images: Array.isArray(images) ? images : [],
                featured: featured ?? false,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/projects/:id', authenticate, requireAdmin, validate(updateProjectSchema), async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.project.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/projects/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.project.delete({ where: { id } });
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 3. GALLERY ROUTES
// ==========================================
router.get('/gallery', async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category && category !== 'All') {
            where.category = { contains: String(category), mode: 'insensitive' };
        }
        const items = await prisma.galleryItem.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/gallery', authenticate, requireAdmin, async (req, res) => {
    try {
        const { title, imageUrl, beforeImageUrl, category, caption, featured } = req.body;
        if (!title || !imageUrl) {
            return res.status(400).json({ error: 'Title and image URL are required.' });
        }
        const newItem = await prisma.galleryItem.create({
            data: { title, imageUrl, beforeImageUrl: beforeImageUrl || null, category: category || 'All', caption: caption || null, featured: featured ?? false },
        });
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/gallery/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.galleryItem.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/gallery/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.galleryItem.delete({ where: { id } });
        res.json({ message: 'Gallery item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 4. BLOGS & COMMENTS ROUTES
// ==========================================
router.get('/blogs', async (_req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            include: { comments: { where: { approved: true }, orderBy: { createdAt: 'desc' } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.get('/blogs/:slug', async (req, res) => {
    try {
        const slug = getId(req);
        const blog = await prisma.blog.findFirst({
            where: { OR: [{ slug }, { id: slug }] },
            include: { comments: { where: { approved: true }, orderBy: { createdAt: 'desc' } } },
        });
        if (!blog)
            return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Admin/Moderator only: create/update/delete blogs
router.post('/blogs', authenticate, requireModerator, validate(createBlogSchema), async (req, res) => {
    try {
        const { title, slug, author, coverImage, category, content, readingTime } = req.body;
        const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newBlog = await prisma.blog.create({
            data: { title, slug: generatedSlug, author, coverImage: coverImage || null, category: category || 'Rooftop Gardening', content, readingTime: readingTime || '5 mins' },
        });
        res.status(201).json(newBlog);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/blogs/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.blog.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/blogs/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.blog.delete({ where: { id } });
        res.json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Comments: any authenticated user can comment, but it starts as NOT approved
router.post('/blogs/:id/comments', authenticate, validate(createCommentSchema), async (req, res) => {
    try {
        const id = getId(req);
        let blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog)
            blog = await prisma.blog.findUnique({ where: { slug: id } });
        if (!blog)
            return res.status(404).json({ error: 'Blog not found' });
        const comment = await prisma.comment.create({
            data: {
                blogId: blog.id,
                name: req.body.name,
                text: req.body.text,
                userId: req.body.userId || null,
                approved: false, // ✅ FIXED: requires moderator approval now
            },
        });
        res.status(201).json({ ...comment, message: 'Comment submitted! Awaiting moderation.' });
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// Moderator can approve/delete comments
router.put('/comments/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.comment.update({ where: { id }, data: { approved: req.body.approved } });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/comments/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.comment.delete({ where: { id } });
        res.json({ message: 'Comment deleted' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 5. BOOKINGS ROUTES
// ==========================================
// Admin/Moderator can see all bookings
router.get('/bookings', authenticate, requireModerator, async (_req, res) => {
    try {
        const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Anyone can create a booking (public action)
router.post('/bookings', validate(createBookingSchema), async (req, res) => {
    try {
        const { clientName, clientEmail, phone, address, service, budgetRange, message, userId } = req.body;
        const newBooking = await prisma.booking.create({
            data: { clientName, clientEmail, phone: phone || null, address: address || null, service,
                budgetRange: budgetRange || null, message: message || null, userId: userId || null,
                status: 'Pending', paymentStatus: 'unpaid' },
        });
        await prisma.notification.create({
            data: {
                title: `📅 নতুন সার্ভিস বুকিং: ${clientName}`,
                message: `${clientName} (${service}) সার্ভিসের জন্য বুকিং দিয়েছেন।`,
                type: 'REQUEST',
            },
        });
        res.status(201).json(newBooking);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.post('/consultations', async (req, res) => {
    try {
        const { clientName, name, clientPhone, phone, serviceCategory, service, siteAddress, address, notes, message, budgetRange, userId } = req.body;
        const actualName = clientName || name;
        const actualPhone = clientPhone || phone;
        const actualService = serviceCategory || service || 'General Garden Consultation';
        const actualAddress = siteAddress || address || 'Dhaka';
        const actualNotes = notes || message || '';
        if (!actualName || !actualPhone) {
            return res.status(400).json({ error: 'Name and Phone are required' });
        }
        if (actualService.toLowerCase().includes('tree') || actualService.toLowerCase().includes('doctor')) {
            const treeReq = await prisma.treeDoctorRequest.create({
                data: {
                    clientName: actualName, clientPhone: actualPhone, location: actualAddress,
                    treeName: 'Emergency Plant Patient', problem: actualNotes || 'Emergency Consultation',
                    preferredVisitTime: 'IMMEDIATE', isEmergency: true, status: 'PENDING', userId: userId || null,
                },
            });
            return res.status(201).json({ success: true, consultationId: treeReq.id, type: 'tree_doctor' });
        }
        const effectiveEmail = String(req.body.clientEmail || req.body.email || (actualPhone ? `${actualPhone.replace(/[^0-9]/g, "")}@client.greengarden` : "client@greengarden.com"));
        const booking = await prisma.booking.create({
            data: {
                clientName: actualName,
                clientEmail: effectiveEmail,
                phone: actualPhone,
                address: actualAddress,
                service: actualService,
                budgetRange: budgetRange || 'Negotiable',
                message: actualNotes,
                userId: userId || null,
                status: 'Pending',
                paymentStatus: 'unpaid',
            },
        });
        res.status(201).json({ success: true, consultationId: booking.id, booking });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.put('/bookings/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.booking.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/bookings/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.booking.delete({ where: { id } });
        res.json({ message: 'Booking deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 6. MESSAGES (CONTACT) ROUTES
// ==========================================
router.get('/messages', authenticate, requireModerator, async (_req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Public: anyone can send a contact message
router.post('/messages', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }
        const newMessage = await prisma.contactMessage.create({
            data: { name, email, phone: phone || null, subject: subject || 'General Inquiry', message },
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/messages/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.contactMessage.delete({ where: { id } });
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 7. CAREERS ROUTES
// ==========================================
router.get('/careers', authenticate, requireModerator, async (_req, res) => {
    try {
        const applications = await prisma.careerApplication.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Public: anyone can apply
router.post('/careers', validate(createCareerSchema), async (req, res) => {
    try {
        const { name, email, phone, department, coverLetter, resumeUrl } = req.body;
        const newApplication = await prisma.careerApplication.create({
            data: { name, email, phone, department, coverLetter: coverLetter || null, resumeUrl, status: 'Pending' },
        });
        res.status(201).json(newApplication);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/careers/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.careerApplication.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/careers/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.careerApplication.delete({ where: { id } });
        res.json({ message: 'Career application deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 8. SETTINGS ROUTES
// ==========================================
router.get('/settings', async (req, res) => {
    try {
        const key = req.query.key ? String(req.query.key) : null;
        if (key) {
            const setting = await prisma.setting.findUnique({ where: { key } });
            if (!setting)
                return res.json({ key, value: {} });
            return res.json(setting);
        }
        let setting = await prisma.setting.findUnique({ where: { key: 'site_config' } });
        if (!setting) {
            setting = await prisma.setting.create({
                data: {
                    key: 'site_config',
                    value: {
                        title: 'A R Green Garden', phone: '01883012641', email: 'info@argreengarden.com',
                        address: '42/A, Road 9/A, Dhanmondi, Dhaka', fbPage: 'https://facebook.com/argreengarden',
                        youtube: 'https://youtube.com/argreengarden', themeColor: '#15803d',
                        seoDescription: 'Premium Landscaping & Garden Design website in Bangladesh',
                    },
                },
            });
        }
        res.json(setting);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Admin only: change settings
router.post('/settings', authenticate, requireAdmin, async (req, res) => {
    try {
        if (req.body.key && req.body.value !== undefined) {
            const setting = await prisma.setting.upsert({
                where: { key: String(req.body.key) },
                update: { value: req.body.value },
                create: { key: String(req.body.key), value: req.body.value },
            });
            return res.json(setting);
        }
        const setting = await prisma.setting.upsert({
            where: { key: 'site_config' },
            update: { value: req.body },
            create: { key: 'site_config', value: req.body },
        });
        res.json(setting);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// ==========================================
// 9. DESIGN GARDEN WIZARD
// ==========================================
router.get('/design-requests', authenticate, requireModerator, async (_req, res) => {
    try {
        const requests = await prisma.designGardenRequest.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Public: anyone can submit a design request
router.post('/design-requests', validate(createDesignRequestSchema), async (req, res) => {
    try {
        const { name, phone, email, spaceType, designStyle, features, approxArea, budgetRange, sitePhotoUrl } = req.body;
        const designReq = await prisma.designGardenRequest.create({
            data: {
                name, phone, email: email || null, spaceType: spaceType || 'Rooftop', designStyle: designStyle || 'Modern Luxury',
                features: Array.isArray(features) ? features : [], approxArea: approxArea || '500 sqft',
                budgetRange: budgetRange || '৳২-৫ লাখ', sitePhotoUrl: sitePhotoUrl || null, status: 'NEW',
            },
        });
        await prisma.notification.create({
            data: {
                title: `🌱 নতুন গার্ডেন ডিজাইন রিকোয়েস্ট: ${name}`,
                message: `${name} (${phone}) - ${spaceType} (${approxArea}) এর জন্য ডিজাইন রিকোয়েস্ট পাঠিয়েছেন।`,
                type: 'REQUEST',
            },
        });
        res.status(201).json({ success: true, request: designReq });
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/design-requests/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.designGardenRequest.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// ==========================================
// 10. TREE DOCTOR & PLANT HEALTH
// ==========================================
router.get('/tree-doctor', authenticate, requireModerator, async (_req, res) => {
    try {
        const requests = await prisma.treeDoctorRequest.findMany({
            include: { assignedDoctor: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Public: anyone can request a tree doctor
router.post('/tree-doctor', validate(createTreeDoctorSchema), async (req, res) => {
    try {
        const { clientName, name, clientPhone, phone, location, treeName, problem, problemDesc, treePhotoUrl, preferredVisitTime, isEmergency } = req.body;
        const actualName = clientName || name;
        const actualPhone = clientPhone || phone;
        const actualProblem = problem || problemDesc || 'গাছের রোগ/সমস্যা';
        const request = await prisma.treeDoctorRequest.create({
            data: {
                clientName: actualName, clientPhone: actualPhone, location: location || 'Dhaka',
                treeName: treeName || 'গাছ/বৃক্ষ', problem: actualProblem,
                treePhotoUrl: treePhotoUrl || null, preferredVisitTime: preferredVisitTime || null,
                isEmergency: isEmergency === true || isEmergency === 'true', status: 'PENDING',
            },
        });
        await prisma.notification.create({
            data: {
                title: isEmergency ? `🚨 ইমার্জেন্সি ট্রি ডক্টর রিকোয়েস্ট: ${actualName}` : `🩺 নতুন ট্রি ডক্টর রিকোয়েস্ট: ${actualName}`,
                message: `${actualName} (${actualPhone}, ${location}) - আক্রান্ত গাছ: ${treeName}.`,
                type: 'TREE_DOCTOR',
            },
        });
        res.status(201).json(request);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/tree-doctor/:id', authenticate, requireEmployee, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.treeDoctorRequest.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.get('/plant-health', authenticate, requireEmployee, async (req, res) => {
    try {
        const { projectId } = req.query;
        const records = await prisma.plantHealthRecord.findMany({
            where: projectId ? { projectId: String(projectId) } : undefined,
            include: { project: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/plant-health', authenticate, requireEmployee, async (req, res) => {
    try {
        const { projectId, plantName, location, photoUrl, diseaseHistory, treatment, fertilizer, pruning, nextMaintenanceDate, doctorReport } = req.body;
        if (!projectId || !plantName) {
            return res.status(400).json({ error: 'Project ID and plant name are required.' });
        }
        const record = await prisma.plantHealthRecord.create({
            data: {
                projectId, plantName, location: location || null, photoUrl: photoUrl || null,
                diseaseHistory: diseaseHistory || null, treatment: treatment || null,
                fertilizer: fertilizer || null, pruning: pruning || null,
                nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
                doctorReport: doctorReport || null,
            },
        });
        res.status(201).json(record);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// ==========================================
// 11. EMPLOYEES & ATTENDANCE
// ==========================================
router.get('/employees', async (_req, res) => {
    try {
        // Public team data (non-sensitive fields only)
        const employees = await prisma.employee.findMany({
            where: { isPublicTeam: true, status: 'ACTIVE' },
            select: {
                id: true, employeeId: true, name: true, designation: true, department: true,
                responsibility: true, experienceYears: true, experienceMonths: true, education: true,
                training: true, skills: true, photo: true, joiningDate: true, isPublicTeam: true,
            },
            orderBy: { joiningDate: 'asc' },
        });
        res.json(employees);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Admin only: full employee list with sensitive data
router.get('/employees/all', authenticate, requireAdmin, async (_req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                attendances: { orderBy: { date: 'desc' }, take: 10 },
                projectAssignments: { include: { project: true } },
            },
            orderBy: { joiningDate: 'asc' },
        });
        res.json(employees);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/employees', authenticate, requireAdmin, validate(createEmployeeSchema), async (req, res) => {
    try {
        const { employeeId, name, designation, department, responsibility, joiningDate, education, skills, salary, personalPhone, personalAddress, photo } = req.body;
        const jDate = new Date(joiningDate);
        const exp = calculateExperience(jDate);
        const employee = await prisma.employee.create({
            data: {
                employeeId: employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
                name, designation, department, responsibility: responsibility || null,
                joiningDate: jDate, experienceYears: exp.years, experienceMonths: exp.months,
                education: education || null, skills: Array.isArray(skills) ? skills : [],
                salary: salary ? parseFloat(String(salary)) : null,
                personalPhone: personalPhone || null, personalAddress: personalAddress || null,
                photo: photo || null,
            },
        });
        res.status(201).json(employee);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/employees/:id', authenticate, requireAdmin, validate(updateEmployeeSchema), async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.employee.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/employees/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.employee.delete({ where: { id } });
        res.json({ message: 'Employee removed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// Schedule Conflict Detection — requires employee/admin
router.post('/assignments', authenticate, requireEmployee, validate(createAssignmentSchema), async (req, res) => {
    try {
        const { projectId, employeeId, roleOnTask, assignedDate } = req.body;
        const dateToCheck = assignedDate ? new Date(assignedDate) : new Date();
        const startOfDay = new Date(dateToCheck.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateToCheck.setHours(23, 59, 59, 999));
        const existingConflict = await prisma.projectAssignment.findFirst({
            where: { employeeId, assignedDate: { gte: startOfDay, lte: endOfDay }, status: { not: 'COMPLETED' } },
            include: { project: true, employee: true },
        });
        if (existingConflict) {
            return res.status(409).json({
                conflict: true,
                error: `Schedule Conflict! ${existingConflict.employee.name} is already assigned to "${existingConflict.project.name}" on this date.`,
            });
        }
        const assignment = await prisma.projectAssignment.create({
            data: { projectId, employeeId, roleOnTask: roleOnTask || 'Lead Gardener', assignedDate: new Date(), status: 'ASSIGNED' },
        });
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// Attendance — employee can check in/out for themselves
router.post('/attendance', authenticate, requireEmployee, validate(attendanceSchema), async (req, res) => {
    try {
        const { employeeId, type, notes } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let attendance = await prisma.attendance.findFirst({ where: { employeeId, date: { gte: today } } });
        if (type === 'check-in') {
            if (attendance)
                return res.status(400).json({ error: 'Already checked in for today.' });
            attendance = await prisma.attendance.create({
                data: { employeeId, date: new Date(), checkIn: new Date(), status: 'PRESENT', notes: notes || null },
            });
        }
        else if (type === 'check-out') {
            if (!attendance)
                return res.status(400).json({ error: 'No check-in record found for today.' });
            attendance = await prisma.attendance.update({ where: { id: attendance.id }, data: { checkOut: new Date() } });
        }
        res.json(attendance);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.get('/attendance', authenticate, requireEmployee, async (req, res) => {
    try {
        const { employeeId } = req.query;
        const records = await prisma.attendance.findMany({
            where: employeeId ? { employeeId: String(employeeId) } : undefined,
            orderBy: { date: 'desc' },
            take: 30,
        });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 12. MAINTENANCE SCHEDULER
// ==========================================
router.get('/maintenance', authenticate, requireEmployee, async (_req, res) => {
    try {
        const schedules = await prisma.maintenanceSchedule.findMany({
            include: { project: true, customer: true, assignedStaff: true },
            orderBy: { scheduledDate: 'asc' },
        });
        res.json(schedules);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/maintenance', authenticate, requireAdmin, validate(createMaintenanceSchema), async (req, res) => {
    try {
        const { projectId, customerId, clientName, clientPhone, location, frequency, scheduledDate, assignedStaffId, notes } = req.body;
        const schedule = await prisma.maintenanceSchedule.create({
            data: {
                projectId: projectId || null, customerId: customerId || null, clientName: clientName || 'Client',
                clientPhone: clientPhone || null, location: location || 'Dhanmondi, Dhaka',
                frequency: frequency || 'MONTHLY', scheduledDate: new Date(scheduledDate),
                assignedStaffId: assignedStaffId || null, notes: notes || null, status: 'SCHEDULED',
            },
        });
        res.status(201).json(schedule);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/maintenance/:id', authenticate, requireEmployee, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.maintenanceSchedule.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
// ==========================================
// 13. QUOTATIONS, INVOICES, INVENTORY, ACCOUNTING
// ==========================================
router.get('/quotations', authenticate, requireModerator, async (_req, res) => {
    try {
        const quotations = await prisma.quotation.findMany({
            include: { items: true, user: true, project: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(quotations);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/quotations', authenticate, requireAdmin, validate(createQuotationSchema), async (req, res) => {
    try {
        const { userId, projectId, clientName, clientPhone, items, discount = 0, advance = 0, notes } = req.body;
        // ✅ FIXED: Use DB transaction + timestamp to avoid race conditions
        const result = await prisma.$transaction(async (tx) => {
            // Generate a unique quotation number using timestamp + random
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const quotationNumber = `QUO-${new Date().getFullYear()}-${timestamp}-${random}`;
            const subtotal = items.reduce((acc, item) => acc + (item.amount || (item.unitPrice * item.quantity)), 0);
            const total = Math.max(0, subtotal - parseFloat(String(discount)));
            const due = Math.max(0, total - parseFloat(String(advance)));
            const quotation = await tx.quotation.create({
                data: {
                    quotationNumber, userId: userId || null, projectId: projectId || null,
                    clientName, clientPhone: clientPhone || null, subtotal,
                    discount: parseFloat(String(discount)), total, advance: parseFloat(String(advance)), due,
                    notes: notes || null,
                    items: {
                        create: items.map((i) => ({
                            category: i.category || 'General', itemTitle: i.itemTitle,
                            unitPrice: i.unitPrice, quantity: i.quantity, unit: i.unit || 'pcs',
                            amount: i.amount || (i.unitPrice * i.quantity),
                        })),
                    },
                },
                include: { items: true },
            });
            return quotation;
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.get('/inventory', authenticate, requireEmployee, async (_req, res) => {
    try {
        const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/inventory', authenticate, requireAdmin, validate(createInventorySchema), async (req, res) => {
    try {
        const item = await prisma.inventoryItem.create({ data: req.body });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/inventory/:id', authenticate, requireAdmin, validate(updateInventorySchema), async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.inventoryItem.update({ where: { id }, data: req.body });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/inventory/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.inventoryItem.delete({ where: { id } });
        res.json({ message: 'Inventory item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.get('/accounting', authenticate, requireAdmin, async (_req, res) => {
    try {
        const invoices = await prisma.invoice.findMany();
        const totalIncome = invoices.reduce((sum, inv) => sum + inv.paidAmount, 4250000);
        const totalExpense = 2830000;
        const netProfit = totalIncome - totalExpense;
        res.json({
            totalIncome, totalExpense, netProfit,
            incomeStreams: [
                { name: 'Landscape Design & Execution', amount: 2850000 },
                { name: 'Maintenance Contracts', amount: 780000 },
                { name: 'Tree Doctor Visits & Treatment', amount: 320000 },
                { name: 'Plant & Material Retail', amount: 300000 },
            ],
            expenseBreakdown: [
                { name: 'Staff Salaries & Labor', amount: 1450000 },
                { name: 'Materials & Plants Purchase', amount: 980000 },
                { name: 'Transportation & Fuel', amount: 250000 },
                { name: 'Office & Operations', amount: 150000 },
            ],
        });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 14. REVIEWS
// ==========================================
router.get('/reviews', async (_req, res) => {
    try {
        // Public: only approved reviews
        const reviews = await prisma.review.findMany({
            where: { status: 'Approved' },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.get('/reviews/all', authenticate, requireModerator, async (_req, res) => {
    try {
        const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.post('/reviews', validate(createReviewSchema), async (req, res) => {
    try {
        const { name, rating, text, service, location, photoUrl, userId, projectId } = req.body;
        const review = await prisma.review.create({
            data: {
                name, rating: parseInt(String(rating), 10) || 5, text,
                service: service || 'Landscape Design', location: location || 'Dhaka',
                photoUrl: photoUrl || null, userId: userId || null, projectId: projectId || null,
                status: 'Pending', // Admin must approve
            },
        });
        res.status(201).json({ success: true, message: 'Review submitted! Awaiting admin approval.', review });
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.put('/reviews/:id', authenticate, requireModerator, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.review.update({ where: { id }, data: req.body });
        res.json({ success: true, review: updated });
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
router.delete('/reviews/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const id = getId(req);
        await prisma.review.delete({ where: { id } });
        res.json({ message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 15. ADMIN ANALYTICS OVERVIEW
// ==========================================
router.get('/admin/overview', authenticate, requireModerator, async (_req, res) => {
    try {
        const [customersCount, runningProjectsCount, completedProjectsCount, employeesCount, maintenanceCount, treeDoctorRequestsCount, pendingQuotationsCount,] = await Promise.all([
            prisma.user.count({ where: { role: 'CLIENT' } }),
            prisma.project.count({ where: { status: 'RUNNING' } }),
            prisma.project.count({ where: { status: 'COMPLETED' } }),
            prisma.employee.count({ where: { status: 'ACTIVE' } }),
            prisma.maintenanceSchedule.count(),
            prisma.treeDoctorRequest.count({ where: { status: 'PENDING' } }),
            prisma.quotation.count({ where: { status: 'DRAFT' } }),
        ]);
        res.json({
            customers: Math.max(customersCount, 250), runningProjects: Math.max(runningProjectsCount, 18),
            completedProjects: Math.max(completedProjectsCount, 96), activeStaff: Math.max(employeesCount, 35),
            maintenanceJobs: Math.max(maintenanceCount, 72), treeDoctorRequests: treeDoctorRequestsCount,
            pendingQuotations: pendingQuotationsCount, totalIncome: 4250000, totalExpense: 2830000, netProfit: 1420000,
        });
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
// ==========================================
// 16. NOTIFICATIONS
// ==========================================
router.get('/notifications', authenticate, async (req, res) => {
    try {
        const { userId } = req.query;
        const notifications = await prisma.notification.findMany({
            where: userId ? { OR: [{ userId: String(userId) }, { userId: null }] } : { userId: null },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: safeError(error) });
    }
});
router.put('/notifications/:id/read', authenticate, async (req, res) => {
    try {
        const id = getId(req);
        const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: safeError(error) });
    }
});
export default router;
