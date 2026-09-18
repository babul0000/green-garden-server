import express, { Request, Response, Router } from 'express';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Gallery from '../models/Gallery.js';
import Blog from '../models/Blog.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import Career from '../models/Career.js';
import Setting from '../models/Setting.js';

const router: Router = express.Router();

// --- SERVICES ROUTES ---
router.get('/services', async (_req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/services', async (req: Request, res: Response) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/services/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/services/:id', async (req: Request, res: Response) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// --- PROJECTS ROUTES ---
router.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/projects', async (req: Request, res: Response) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// --- GALLERY ROUTES ---
router.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/gallery', async (req: Request, res: Response) => {
  try {
    const newItem = await Gallery.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/gallery/:id', async (req: Request, res: Response) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});


// --- BLOGS ROUTES ---
router.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/blogs', async (req: Request, res: Response) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/blogs/:id', async (req: Request, res: Response) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/blogs/:id/comments', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    
    blog.comments.push({
      name: req.body.name,
      text: req.body.text,
      approved: true
    } as any);
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});


// --- BOOKINGS ROUTES ---
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/bookings/:id', async (req: Request, res: Response) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// --- MESSAGES ROUTES ---
router.get('/messages', async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/messages', async (req: Request, res: Response) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/messages/:id', async (req: Request, res: Response) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// --- SETTINGS ROUTES ---
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    let setting = await Setting.findOne({ key: 'site_config' });
    if (!setting) {
      // Create default site configurations
      setting = await Setting.create({
        key: 'site_config',
        value: {
          title: "AR Green Garden",
          phone: "01712345678",
          email: "info@argreengarden.com",
          address: "Dhanmondi, Dhaka",
          fbPage: "https://facebook.com/argreengarden",
          youtube: "https://youtube.com/argreengarden",
          themeColor: "#1a3020",
          seoDescription: "Premium Landscaping & Garden Design website in Bangladesh"
        }
      });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/settings', async (req: Request, res: Response) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: 'site_config' },
      { value: req.body },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});


// --- CAREERS ROUTES ---
router.get('/careers', async (_req: Request, res: Response) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/careers', async (req: Request, res: Response) => {
  try {
    const newApplication = await Career.create(req.body);
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/careers/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/careers/:id', async (req: Request, res: Response) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Career application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
