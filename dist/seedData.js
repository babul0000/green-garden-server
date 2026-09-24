import { prisma } from './db.js';
import bcrypt from 'bcryptjs';
export const seedDatabase = async () => {
    try {
        // 1. Seed Services
        const serviceCount = await prisma.service.count();
        if (serviceCount === 0) {
            await prisma.service.createMany({
                data: [
                    {
                        label: "Rooftop Garden Setup",
                        slug: "rooftop-gardening",
                        category: "Garden Services",
                        desc: "Turnkey concrete-to-paradise solutions. Includes 100% waterproofing guarantee, load matching, and auto-drip grids.",
                        icon: "🌇",
                        pricing: "৳১,৫০,০০০ থেকে শুরু",
                        features: ["100% Waterproofing", "Automated Drip Grid", "Organic Soil Prep", "1 Year Plant Replacement Guarantee"],
                    },
                    {
                        label: "Vertical Wall Greenery",
                        slug: "vertical-garden",
                        category: "Garden Services",
                        desc: "High-density breathing wall systems for indoor aesthetics or hot outside facades.",
                        icon: "🍃",
                        pricing: "৳৪৫০/sqft",
                        features: ["Geo-textile Felt System", "Micro Irrigation", "Sun-Hardy Ferns", "Automatic Timer Control"],
                    },
                    {
                        label: "Tree Doctor & Plant Health",
                        slug: "tree-doctor",
                        category: "Plant Health",
                        desc: "Diagnostic visits, fungal treatment, pest eradication, soil pH testing, and surgical pruning.",
                        icon: "🩺",
                        pricing: "৳২,৫০০/ভিজিট",
                        features: ["Senior Plant Pathologist", "Soil Chemical Test", "Eco-friendly Organic Spray", "Digital Health Card"],
                    },
                    {
                        label: "Smart Irrigation Systems",
                        slug: "smart-irrigation",
                        category: "Irrigation",
                        desc: "Micro-drippers, Wi-Fi solenoids, moisture detectors, and automated water savers.",
                        icon: "💧",
                        pricing: "৳২৫,০০০ থেকে শুরু",
                        features: ["Smart Wi-Fi App Control", "Rain Sensor", "Pressure Compensated Emitters", "Zero Water Wastage"],
                    },
                    {
                        label: "Scheduled Garden Maintenance",
                        slug: "garden-maintenance",
                        category: "Maintenance",
                        desc: "Weekly or monthly professional gardener service, weeding, pruning, and bio-fertilizer application.",
                        icon: "✂️",
                        pricing: "৳৪,০০০/মাসিক",
                        features: ["Certified Mali/Gardener", "Weekly Scheduled Visits", "Free Bio-Fertilizer", "Quarterly Health Audit"],
                    },
                    {
                        label: "Garden Lighting & Waterfalls",
                        slug: "garden-lighting-fountain",
                        category: "Additional Services",
                        desc: "IP68 waterproof landscape warm LEDs, stone fountains, and nighttime atmospheric lighting.",
                        icon: "💡",
                        pricing: "৳৩৫,০০০ থেকে শুরু",
                        features: ["IP68 Waterproof Fixtures", "Solar Powered Options", "Natural Stone Waterfalls", "Automatic Sunset Timers"],
                    },
                ],
            });
            console.log('✅ Services seeded successfully in PostgreSQL.');
        }
        // 2. Seed Projects
        const projectCount = await prisma.project.count();
        if (projectCount === 0) {
            await prisma.project.create({
                data: {
                    name: "Dhanmondi Sky Haven Luxury Rooftop",
                    slug: "dhanmondi-sky-haven",
                    clientName: "Tanvir Rahman",
                    clientPhone: "01711223344",
                    category: "Rooftop Garden",
                    location: "Dhanmondi, Dhaka",
                    progress: 100,
                    status: "COMPLETED",
                    budget: 350000,
                    totalExpense: 260000,
                    description: "A luxury rooftop garden with 3-layer elastomeric waterproofing, automated drip irrigation, and seating pergola.",
                    beforeImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
                    afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
                    featured: true,
                },
            });
            await prisma.project.create({
                data: {
                    name: "Gulshan Corporate Eco-Lawn & Vertical Wall",
                    slug: "gulshan-corporate-eco-lawn",
                    clientName: "BTI Landmark Developments",
                    clientPhone: "01819223344",
                    category: "Commercial Landscape",
                    location: "Gulshan-2, Dhaka",
                    progress: 75,
                    status: "RUNNING",
                    budget: 550000,
                    totalExpense: 380000,
                    description: "High density living vertical wall and Bermuda turf installation for corporate headquarters.",
                    beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
                    afterImage: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
                    featured: true,
                },
            });
            console.log('✅ Projects seeded successfully in PostgreSQL.');
        }
        // 3. Seed Gallery
        const galleryCount = await prisma.galleryItem.count();
        if (galleryCount === 0) {
            await prisma.galleryItem.createMany({
                data: [
                    {
                        title: "Dhanmondi Sky Garden Transformation",
                        category: "Rooftop Garden",
                        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
                        beforeImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
                        caption: "Concrete slab transformed into a lush tropical rooftop oasis.",
                        featured: true,
                    },
                    {
                        title: "Gulshan Vertical Living Wall",
                        category: "Vertical Garden",
                        imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
                        beforeImageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
                        caption: "200 sqft breathing wall on commercial building exterior.",
                        featured: true,
                    },
                ],
            });
            console.log('✅ Gallery seeded successfully in PostgreSQL.');
        }
        // 4. Seed Blogs
        const blogCount = await prisma.blog.count();
        if (blogCount === 0) {
            await prisma.blog.create({
                data: {
                    title: "ছাদবাগানের সঠিক ওয়াটারপ্রুফিং ও ড্রেনেজ ব্যবস্থা",
                    slug: "rooftop-waterproofing-drainage-guide",
                    author: "Engr. Rafiqul Islam (Lead Landscape Engineer)",
                    coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
                    category: "Rooftop Gardening",
                    content: "ছাদবাগানের সবচেয়ে গুরুত্বপূর্ণ অংশ হলো ছাদের ওয়াটারপ্রুফিং। ৩-লেয়ার ইলাস্টোমেরিক মেমব্রেন এবং ড্রেনেজ ম্যাট ব্যবহার করলে ছাদের কোনো ক্ষতি হয় না।",
                    readingTime: "5 mins",
                },
            });
            console.log('✅ Blogs seeded successfully in PostgreSQL.');
        }
        // 5. Seed Users & Employees
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash("admin12345", 10);
            const adminUser = await prisma.user.create({
                data: {
                    name: "A R Green Garden Admin",
                    email: "admin@argreengarden.com",
                    password: hashedPassword,
                    role: "ADMIN",
                    phone: "01620692449",
                },
            });
            const doctorUser = await prisma.user.create({
                data: {
                    name: "Dr. Kazi Mahfuzur Rahman",
                    email: "doctor@argreengarden.com",
                    password: hashedPassword,
                    role: "EMPLOYEE",
                    phone: "01712003344",
                },
            });
            await prisma.employee.create({
                data: {
                    employeeId: "EMP-101",
                    userId: doctorUser.id,
                    name: "Dr. Kazi Mahfuzur Rahman",
                    designation: "Senior Tree Doctor & Plant Pathologist",
                    department: "Tree Doctor & Plant Health",
                    responsibility: "Head of plant pathology, diseased tree triage and fungal treatment supervision.",
                    joiningDate: new Date("2021-03-01"),
                    experienceYears: 5,
                    experienceMonths: 4,
                    education: "M.Sc. in Plant Pathology (BAU)",
                    skills: ["Tree Surgery", "Fungal Diagnostics", "Soil pH Optimization", "Organic Pesticides"],
                    salary: 65000,
                    personalPhone: "01712003344",
                    personalAddress: "Dhanmondi 9/A, Dhaka",
                    status: "ACTIVE",
                    isPublicTeam: true,
                },
            });
            console.log('✅ Default Admin & Senior Tree Doctor seeded in PostgreSQL.');
        }
        // 6. Seed Site Settings
        const setting = await prisma.setting.findUnique({ where: { key: "site_config" } });
        if (!setting) {
            await prisma.setting.create({
                data: {
                    key: "site_config",
                    value: {
                        title: "A R Green Garden",
                        phone: "01620692449",
                        email: "info@argreengarden.com",
                        address: "42/A, Road 9/A, Dhanmondi, Dhaka",
                        fbPage: "https://facebook.com/argreengarden",
                        youtube: "https://youtube.com/argreengarden",
                        themeColor: "#15803d",
                        seoDescription: "Premium Landscaping & Garden Design website in Bangladesh",
                    },
                },
            });
            console.log('✅ Site configurations seeded in PostgreSQL.');
        }
    }
    catch (error) {
        console.error('Error during database seeding:', error);
    }
};
