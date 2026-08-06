import Service from './models/Service.js';
import Project from './models/Project.js';
import Gallery from './models/Gallery.js';
import Blog from './models/Blog.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.create([
        { label: "Rooftop Garden Setup", slug: "rooftop-gardening", desc: "Turnkey concrete-to-paradise solutions. Includes waterproofing, load matching, and auto-drip grids.", icon: "🌇" },
        { label: "Vertical Wall Greenery", slug: "vertical-garden", desc: "High-density breathing wall systems for indoor aesthetics or hot outside facades.", icon: "🍃" },
        { label: "Backyard Landscaping", slug: "backyard-landscaping", desc: "Lawn gardens, courtyard transformations, and customized home botanical layout plans.", icon: "🏡" },
        { label: "Indoor Plant Collection", slug: "indoor-plants", desc: "Professional botanical assessments, air-purifying selections, and interior plant styling.", icon: "🌱" },
        { label: "Garden Maintenance", slug: "garden-maintenance", desc: "Scheduled pruning, organic nutrition mapping, pest control, and irrigation health checks.", icon: "✂️" },
        { label: "Garden Lighting", slug: "garden-lighting", desc: "Weatherproof LED arrays, uplighters, and automated evening mood lighting.", icon: "💡" },
        { label: "Drip Irrigation", slug: "drip-irrigation", desc: "Micro-drippers, Wi-Fi solenoids, moisture detectors, and automated water savers.", icon: "💧" }
      ]);
      console.log('Services seeded successfully.');
    }

    // 2. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          name: "Dhanmondi Sky Haven Rooftop",
          slug: "dhanmondi-sky-haven",
          client: "Tanvir Rahman",
          category: "Residential",
          imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
          location: "Dhanmondi, Dhaka",
          duration: "3 Weeks",
          budgetRange: "BDT 350,000",
          challenges: "The concrete roof slab had micro-fractures causing moisture dampening in the upper apartment. Load-bearing constraints limited deep soil beds.",
          solution: "Applied 3 layers of elastomeric waterproofing membrane. Used lightweight expanded clay aggregate mixed with organic coco-peat substrate and custom built elevated pine-wood planter beds to distribute weight over structural pillars.",
          clientTestimonial: {
            name: "Tanvir Rahman",
            text: "AR Green Garden turned our damp, dusty roof into a breathtaking orchard. The drip irrigation system makes maintenance effortless!",
            rating: 5
          },
          featured: true
        },
        {
          name: "BTI Landmark Facade Vertical Wall",
          slug: "bti-landmark-vertical",
          client: "BTI Developments",
          category: "Commercial",
          imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
          location: "Gulshan, Dhaka",
          duration: "10 Days",
          budgetRange: "BDT 550,000",
          challenges: "Gulshan's heavy direct midday sun heat causes rapid plant dehydration on vertical walls. High wind loads require structural anchoring stability.",
          solution: "Installed custom aluminum mounting brackets holding geo-textile grow pockets. Set up automated zone-divided drip emitters connected to a smart timer. Selected sun-hardy plants like Nephrolepis ferns and Asparagus densiflorus.",
          clientTestimonial: {
            name: "Engr. Faruq Hasan (BTI)",
            text: "A masterpiece of engineering and botany. It reduced our office reception room temperature by almost 3 degrees!",
            rating: 5
          },
          featured: true
        },
        {
          name: "Banani Courtyard Zen Garden",
          slug: "banani-courtyard-zen",
          client: "Sabrina Karim",
          category: "Villa",
          imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
          location: "Banani, Dhaka",
          duration: "2 Weeks",
          budgetRange: "BDT 220,000",
          challenges: "Narrow, damp walkway with less than 2 hours of sunlight per day. Water logging issues during heavy monsoon.",
          solution: "Constructed sub-surface French drainage pipe system. Styled with premium white river gravel, stepping stones, bamboo screens, and shade-loving Philodendrons, ferns, and hostas.",
          clientTestimonial: {
            name: "Sabrina Karim",
            text: "A beautiful, calming space in the middle of busy Banani. They resolved the drainage issue perfectly.",
            rating: 5
          },
          featured: false
        }
      ]);
      console.log('Projects seeded successfully.');
    }

    // 3. Seed Gallery
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: "Gulshan Rooftop Paradise",
          imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
          beforeImageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop", // empty concrete roof
          category: "Rooftop",
          caption: "A 1200 sq. ft concrete rooftop transformed into a lush sanctuary with fruit trees, lawn, and pergolas."
        },
        {
          title: "Corporate Green Facade",
          imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
          beforeImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", // bare wall
          category: "Vertical",
          caption: "Gulshan commercial reception feature wall utilizing automated drip-irrigation geo-fabric pocket grid."
        },
        {
          title: "Banani Patio Oasis",
          imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
          category: "Landscape",
          caption: "Monsoon-resilient pathway garden with stepping stones and custom uplighting arrays."
        }
      ]);
      console.log('Gallery seeded successfully.');
    }

    // 4. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create([
        {
          title: "5 Essential Tips for Rooftop Gardening in Dhaka",
          slug: "5-tips-rooftop-gardening-dhaka",
          author: "Tanvir Ahmed",
          coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
          category: "Rooftop Gardening",
          content: "<p>Rooftop gardening is becoming highly popular in Dhaka due to rapid urbanization. However, maintaining a garden on concrete requires specific knowledge to prevent building damage and ensure plant health.</p><h4>1. Multi-Layer Waterproofing</h4><p>Ensure your concrete roof slab is sealed with high-quality elastomeric waterproofing layers before installing soil. Leaks can damage reinforcement bars and lead to building hazards.</p><h4>2. Choose Lightweight Substrates</h4><p>Avoid using pure red clay or garden soil. It gets extremely heavy when wet. Use a mixture of cocopeat, vermicompost, and expanded clay aggregate to reduce weight load by up to 50%.</p><h4>3. Install Smart Drip Systems</h4><p>Dhaka summers are brutal. Manual watering is often insufficient. An automated drip-irrigation grid saves water and ensures regular watering even when you are out of town.</p>",
          readingTime: "4 mins",
          comments: [
            { name: "Rafiq Chowdhury", text: "Very informative article! The lightweight soil advice is a lifesaver. I was worried about my roof weight limit." }
          ]
        },
        {
          title: "How to Build a Self-Sustaining Vertical Wall Garden",
          slug: "build-self-sustaining-vertical-wall",
          author: "Sultana Yasmin",
          coverImage: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
          category: "Vertical Garden",
          content: "<p>Vertical gardens are the ultimate green space solution for small spaces. Let's look at how to construct one that requires minimal manual upkeep.</p><h4>1. Frame Assembly</h4><p>Mount a rust-proof aluminum frame with a PVC board backing on the wall. This leaves an air gap of 1 inch between the wall and the garden, preventing moisture transfer.</p><h4>2. Felt Pockets</h4><p>Attach two layers of synthetic geotextile felt to the backing. Geotextile does not decay and allows water to distribute evenly while giving plant roots room to grow.</p><h4>3. Automated Nutrients</h4><p>Set up an irrigation line connected to a fertilizer injector. Dosing liquid bio-fertilizer directly through the water system guarantees green walls stay lush all year round.</p>",
          readingTime: "6 mins",
          comments: []
        }
      ]);
      console.log('Blogs seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
