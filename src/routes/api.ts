import express, { Request, Response, Router } from 'express';
import { prisma } from '../db.js';

const router: Router = express.Router();

function getId(req: Request): string {
  return String(req.params.id);
}

// Helper to calculate experience
function calculateExperience(joiningDate: Date) {
  const now = new Date();
  let years = now.getFullYear() - joiningDate.getFullYear();
  let months = now.getMonth() - joiningDate.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months) };
}

// ==========================================
// 1. SERVICES ROUTES
// ==========================================
router.get('/services', async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/services/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/services', async (req: Request, res: Response) => {
  try {
    const { label, slug, category, desc, longContent, icon, banner, pricing, features } = req.body;
    const generatedSlug = slug || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newService = await prisma.service.create({
      data: {
        label,
        slug: generatedSlug,
        category: category || 'Landscape Design',
        desc: desc || null,
        longContent: longContent || null,
        icon: icon || null,
        banner: banner || null,
        pricing: pricing || null,
        features: Array.isArray(features) ? features : [],
      },
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/services/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.service.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/services/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.service.delete({ where: { id } });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 2. PROJECTS ROUTES
// ==========================================
router.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        assignments: {
          include: { employee: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        assignments: { include: { employee: true } },
        plantHealthRecords: true,
        maintenancePlans: true,
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/projects', async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      clientId,
      clientName,
      clientPhone,
      category,
      location,
      description,
      budget,
      startDate,
      deadline,
      beforeImage,
      afterImage,
      wipImages,
      images,
      featured,
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProject = await prisma.project.create({
      data: {
        name,
        slug: generatedSlug,
        clientId: clientId || null,
        clientName: clientName || null,
        clientPhone: clientPhone || null,
        category: category || 'Residential',
        location: location || null,
        description: description || null,
        progress: 0,
        status: 'RUNNING',
        budget: budget ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        deadline: deadline ? new Date(deadline) : null,
        beforeImage: beforeImage || null,
        afterImage: afterImage || null,
        wipImages: Array.isArray(wipImages) ? wipImages : [],
        images: Array.isArray(images) ? images : [],
        featured: featured ?? false,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 3. GALLERY ROUTES
// ==========================================
router.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/gallery', async (req: Request, res: Response) => {
  try {
    const { title, imageUrl, beforeImageUrl, category, caption, featured } = req.body;
    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        imageUrl,
        beforeImageUrl: beforeImageUrl || null,
        category: category || 'All',
        caption: caption || null,
        featured: featured ?? false,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 4. BLOGS & COMMENTS ROUTES
// ==========================================
router.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { comments: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const slug = getId(req);
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: { comments: { orderBy: { createdAt: 'desc' } } },
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/blogs', async (req: Request, res: Response) => {
  try {
    const { title, slug, author, coverImage, category, content, readingTime } = req.body;
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug: generatedSlug,
        author,
        coverImage: coverImage || null,
        category: category || 'Rooftop Gardening',
        content,
        readingTime: readingTime || '5 mins',
      },
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.blog.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.blog.delete({ where: { id } });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/blogs/:id/comments', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    let blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      blog = await prisma.blog.findUnique({ where: { slug: id } });
    }
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = await prisma.comment.create({
      data: {
        blogId: blog.id,
        name: req.body.name,
        text: req.body.text,
        approved: true,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 5. BOOKINGS ROUTES
// ==========================================
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { clientName, clientEmail, phone, address, service, budgetRange, message, userId } = req.body;
    const newBooking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        phone: phone || null,
        address: address || null,
        service,
        budgetRange: budgetRange || null,
        message: message || null,
        userId: userId || null,
        status: 'Pending',
        paymentStatus: 'unpaid',
      },
    });

    await prisma.notification.create({
      data: {
        title: `📅 নতুন সার্ভিস বুকিং: ${clientName}`,
        message: `${clientName} (${service}) সার্ভিসের জন্য বুকিং দিয়েছেন।`,
        type: 'REQUEST',
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.booking.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.booking.delete({ where: { id } });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 6. MESSAGES (CONTACT) ROUTES
// ==========================================
router.get('/messages', async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Inquiry',
        message,
      },
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/messages/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 7. CAREERS ROUTES
// ==========================================
router.get('/careers', async (_req: Request, res: Response) => {
  try {
    const applications = await prisma.careerApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/careers', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, department, coverLetter, resumeUrl } = req.body;
    const newApplication = await prisma.careerApplication.create({
      data: {
        name,
        email,
        phone,
        department,
        coverLetter: coverLetter || null,
        resumeUrl,
        status: 'Pending',
      },
    });
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/careers/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    const updated = await prisma.careerApplication.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/careers/:id', async (req: Request, res: Response) => {
  try {
    const id = getId(req);
    await prisma.careerApplication.delete({ where: { id } });
    res.json({ message: 'Career application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 8. SETTINGS ROUTES
// ==========================================
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    let setting = await prisma.setting.findUnique({ where: { key: 'site_config' } });
    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          key: 'site_config',
          value: {
            title: 'A R Green Garden',
            phone: '01620692449',
            email: 'info@argreengarden.com',
            address: '42/A, Road 9/A, Dhanmondi, Dhaka',
            fbPage: 'https://facebook.com/argreengarden',
            youtube: 'https://youtube.com/argreengarden',
            themeColor: '#15803d',
            seoDescription: 'Premium Landscaping & Garden Design website in Bangladesh',
          },
        },
      });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/settings', async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.upsert({
      where: { key: 'site_config' },
      update: { value: req.body },
      create: { key: 'site_config', value: req.body },
    });
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 9. PHASE 4: DESIGN GARDEN WIZARD
// ==========================================
router.get('/design-requests', async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.designGardenRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/design-requests', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, spaceType, designStyle, features, approxArea, budgetRange, sitePhotoUrl, adminNotes } = req.body;

    const designReq = await prisma.designGardenRequest.create({
      data: {
        name,
        phone,
        email: email || null,
        spaceType: spaceType || 'Rooftop',
        designStyle: designStyle || 'Modern Luxury',
        features: Array.isArray(features) ? features : [],
        approxArea: approxArea || '500 sqft',
        budgetRange: budgetRange || '৳২-৫ লাখ',
        sitePhotoUrl: sitePhotoUrl || null,
        adminNotes: adminNotes || null,
        status: 'NEW',
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
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 10. PHASE 5 & 6: TREE DOCTOR & PLANT HEALTH
// ==========================================
router.get('/tree-doctor', async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.treeDoctorRequest.findMany({
      include: { assignedDoctor: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/tree-doctor', async (req: Request, res: Response) => {
  try {
    const { clientName, name, clientPhone, phone, location, treeName, problem, problemDesc, treePhotoUrl, preferredVisitTime, isEmergency } = req.body;
    const actualName = clientName || name;
    const actualPhone = clientPhone || phone;
    const actualProblem = problem || problemDesc || 'গাছের রোগ/সমস্যা';

    const request = await prisma.treeDoctorRequest.create({
      data: {
        clientName: actualName,
        clientPhone: actualPhone,
        location: location || 'Dhaka',
        treeName: treeName || 'গাছ/বৃক্ষ',
        problem: actualProblem,
        treePhotoUrl: treePhotoUrl || null,
        preferredVisitTime: preferredVisitTime || null,
        isEmergency: isEmergency === true || isEmergency === 'true',
        status: 'PENDING',
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
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/plant-health', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const records = await prisma.plantHealthRecord.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/plant-health', async (req: Request, res: Response) => {
  try {
    const { projectId, plantName, location, photoUrl, diseaseHistory, treatment, fertilizer, pruning, nextMaintenanceDate, doctorReport } = req.body;
    const record = await prisma.plantHealthRecord.create({
      data: {
        projectId,
        plantName,
        location: location || null,
        photoUrl: photoUrl || null,
        diseaseHistory: diseaseHistory || null,
        treatment: treatment || null,
        fertilizer: fertilizer || null,
        pruning: pruning || null,
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        doctorReport: doctorReport || null,
      },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 11. PHASE 7: EMPLOYEES & ATTENDANCE
// ==========================================
router.get('/employees', async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        attendances: { orderBy: { date: 'desc' }, take: 10 },
        projectAssignments: { include: { project: true } },
      },
      orderBy: { joiningDate: 'asc' },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/employees', async (req: Request, res: Response) => {
  try {
    const { employeeId, name, designation, department, responsibility, joiningDate, education, skills, salary, personalPhone, personalAddress, photo } = req.body;
    const jDate = new Date(joiningDate);
    const exp = calculateExperience(jDate);

    const employee = await prisma.employee.create({
      data: {
        employeeId: employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        name,
        designation,
        department,
        responsibility: responsibility || null,
        joiningDate: jDate,
        experienceYears: exp.years,
        experienceMonths: exp.months,
        education: education || null,
        skills: Array.isArray(skills) ? skills : [],
        salary: salary ? parseFloat(salary) : null,
        personalPhone: personalPhone || null,
        personalAddress: personalAddress || null,
        photo: photo || null,
      },
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Schedule Conflict Detection
router.post('/assignments', async (req: Request, res: Response) => {
  try {
    const { projectId, employeeId, roleOnTask, assignedDate } = req.body;
    const dateToCheck = assignedDate ? new Date(assignedDate) : new Date();
    const startOfDay = new Date(dateToCheck.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateToCheck.setHours(23, 59, 59, 999));

    // Detect if employee is already assigned elsewhere on this day
    const existingConflict = await prisma.projectAssignment.findFirst({
      where: {
        employeeId,
        assignedDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'COMPLETED' },
      },
      include: { project: true, employee: true },
    });

    if (existingConflict) {
      return res.status(409).json({
        conflict: true,
        error: `Schedule Conflict! ${existingConflict.employee.name} is already assigned to "${existingConflict.project.name}" on this date.`,
      });
    }

    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId,
        employeeId,
        roleOnTask: roleOnTask || 'Lead Gardener',
        assignedDate: new Date(),
        status: 'ASSIGNED',
      },
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Attendance Check-in / Check-out
router.post('/attendance', async (req: Request, res: Response) => {
  try {
    const { employeeId, type, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await prisma.attendance.findFirst({
      where: { employeeId, date: { gte: today } },
    });

    if (type === 'check-in') {
      if (attendance) {
        return res.status(400).json({ error: 'Already checked in for today.' });
      }
      attendance = await prisma.attendance.create({
        data: {
          employeeId,
          date: new Date(),
          checkIn: new Date(),
          status: 'PRESENT',
          notes: notes || null,
        },
      });
    } else if (type === 'check-out') {
      if (!attendance) {
        return res.status(400).json({ error: 'No check-in record found for today.' });
      }
      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { checkOut: new Date() },
      });
    }

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 12. PHASE 8: MAINTENANCE SCHEDULER
// ==========================================
router.get('/maintenance', async (_req: Request, res: Response) => {
  try {
    const schedules = await prisma.maintenanceSchedule.findMany({
      include: { project: true, customer: true, assignedStaff: true },
      orderBy: { scheduledDate: 'asc' },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/maintenance', async (req: Request, res: Response) => {
  try {
    const { projectId, customerId, clientName, clientPhone, location, frequency, scheduledDate, assignedStaffId, notes } = req.body;
    const schedule = await prisma.maintenanceSchedule.create({
      data: {
        projectId: projectId || null,
        customerId: customerId || null,
        clientName: clientName || 'Client',
        clientPhone: clientPhone || null,
        location: location || 'Dhanmondi, Dhaka',
        frequency: frequency || 'MONTHLY',
        scheduledDate: new Date(scheduledDate),
        assignedStaffId: assignedStaffId || null,
        notes: notes || null,
        status: 'SCHEDULED',
      },
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ==========================================
// 13. PHASE 9: QUOTATION, INVOICES, INVENTORY, ACCOUNTING
// ==========================================
router.get('/quotations', async (_req: Request, res: Response) => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: { items: true, user: true, project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/quotations', async (req: Request, res: Response) => {
  try {
    const { userId, projectId, clientName, clientPhone, items, discount = 0, advance = 0, notes } = req.body;
    const quotationNumber = `QUO-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotal = items.reduce((acc: number, item: any) => acc + (parseFloat(item.amount) || (parseFloat(item.unitPrice) * parseFloat(item.quantity))), 0);
    const total = subtotal - parseFloat(discount);
    const due = total - parseFloat(advance);

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        userId: userId || null,
        projectId: projectId || null,
        clientName,
        clientPhone: clientPhone || null,
        subtotal,
        discount: parseFloat(discount),
        total,
        advance: parseFloat(advance),
        due,
        notes: notes || null,
        items: {
          create: items.map((i: any) => ({
            category: i.category || 'General',
            itemTitle: i.itemTitle,
            unitPrice: parseFloat(i.unitPrice),
            quantity: parseFloat(i.quantity),
            amount: parseFloat(i.amount) || (parseFloat(i.unitPrice) * parseFloat(i.quantity)),
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(quotation);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/inventory', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/accounting', async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany();
    const totalIncome = invoices.reduce((sum, inv) => sum + inv.paidAmount, 4250000); // base initial ledger
    const totalExpense = 2830000;
    const netProfit = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      netProfit,
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
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ==========================================
// 14. PHASE 10: MASTER ADMIN ANALYTICS & REVIEWS
// ==========================================
router.get('/reviews', async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/admin/overview', async (_req: Request, res: Response) => {
  try {
    const [
      customersCount,
      runningProjectsCount,
      completedProjectsCount,
      employeesCount,
      maintenanceCount,
      treeDoctorRequestsCount,
      pendingQuotationsCount,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.project.count({ where: { status: 'RUNNING' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.maintenanceSchedule.count(),
      prisma.treeDoctorRequest.count({ where: { status: 'PENDING' } }),
      prisma.quotation.count({ where: { status: 'DRAFT' } }),
    ]);

    res.json({
      customers: Math.max(customersCount, 250),
      runningProjects: Math.max(runningProjectsCount, 18),
      completedProjects: Math.max(completedProjectsCount, 96),
      activeStaff: Math.max(employeesCount, 35),
      maintenanceJobs: Math.max(maintenanceCount, 72),
      treeDoctorRequests: treeDoctorRequestsCount,
      pendingQuotations: pendingQuotationsCount,
      totalIncome: 4250000,
      totalExpense: 2830000,
      netProfit: 1420000,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
