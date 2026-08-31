// ============================================================
// S.S.R Portfolio — Data Layer (localStorage)
// ============================================================

const SSR_KEY = 'ssr_portfolio_data';

const DEFAULT_DATA = {
  "site": {
    "name": "Saikat Sasmal",
    "logo": "S.S.R",
    "tagline": "Full Stack Developer & UI/UX Designer",
    "metaDesc": "Portfolio of Saikat Sasmal — Full Stack Developer, UI/UX Designer and Creative Coder from West Bengal, India.",
    "roles": [
      "Full Stack Developer",
      "UI/UX Designer",
      "Creative Coder",
      "Problem Solver"
    ],
    "bio1": "Hey! I'm Saikat Sasmal, a passionate Full Stack Developer and UI/UX Designer based in West Bengal, India. I craft digital experiences that are not just functional — they're memorable.",
    "bio2": "With over 3 years of hands-on experience, I specialise in building scalable web applications, intuitive interfaces, and everything in between. From a pixel-perfect landing page to a complex SaaS dashboard — I do it all.",
    "bio3": "When I'm not writing code, I'm exploring design systems, contributing to open source, or chasing the perfect cup of chai ☕",
    "avatar": "",
    "social": {
      "github": "https://github.com/saikatsasmal",
      "linkedin": "https://linkedin.com/in/saikatsasmal",
      "twitter": "https://twitter.com/saikatsasmal",
      "instagram": "https://instagram.com/saikatsasmal",
      "email": "saikatsasmal931@gmail.com"
    },
    "contact": {
      "email": "saikatsasmal931@gmail.com",
      "phone": "+91 98765 43210",
      "location": "West Bengal, India",
      "available": true
    },
    "stats": {
      "experience": "3+",
      "projects": "20+",
      "clients": "11+",
      "rating": "5★"
    }
  },
  "skills": [
    {
      "id": "s1",
      "name": "HTML5 / CSS3",
      "level": 95,
      "category": "Frontend"
    },
    {
      "id": "s2",
      "name": "JavaScript (ES6+)",
      "level": 90,
      "category": "Frontend"
    },
    {
      "id": "s3",
      "name": "React.js",
      "level": 85,
      "category": "Frontend"
    },
    {
      "id": "s4",
      "name": "Next.js",
      "level": 78,
      "category": "Frontend"
    },
    {
      "id": "s5",
      "name": "Node.js",
      "level": 80,
      "category": "Backend"
    },
    {
      "id": "s6",
      "name": "PHP / Laravel",
      "level": 75,
      "category": "Backend"
    },
    {
      "id": "s7",
      "name": "MySQL / MongoDB",
      "level": 82,
      "category": "Database"
    },
    {
      "id": "s8",
      "name": "Git & GitHub",
      "level": 90,
      "category": "Tools"
    },
    {
      "id": "s9",
      "name": "Figma / UI Design",
      "level": 85,
      "category": "Design"
    },
    {
      "id": "s10",
      "name": "REST APIs",
      "level": 88,
      "category": "Backend"
    },
    {
      "id": "s11",
      "name": "Tailwind CSS",
      "level": 87,
      "category": "Frontend"
    },
    {
      "id": "s12",
      "name": "Docker",
      "level": 65,
      "category": "Tools"
    }
  ],
  "projects": [
    {
      "id": "p1",
      "title": "ShopNest — E-Commerce Platform",
      "category": "Web App",
      "status": "Live",
      "year": "2024",
      "color": "#6c63ff",
      "shortDesc": "A full-featured e-commerce platform with real-time inventory, payment gateway, and admin dashboard.",
      "longDesc": "ShopNest is a comprehensive e-commerce solution built for small to mid-size businesses. It features a real-time inventory management system, seamless payment gateway integration via Stripe, an intuitive admin dashboard with analytics, and a blazing-fast storefront built with Next.js and Tailwind CSS. The backend is powered by Node.js and MongoDB, ensuring scalability and speed.",
      "tech": [
        "Next.js",
        "Node.js",
        "MongoDB",
        "Stripe",
        "Tailwind CSS",
        "Redis"
      ],
      "highlights": [
        "Real-time inventory tracking",
        "Stripe payment integration",
        "Admin analytics dashboard",
        "Mobile-first responsive design"
      ],
      "liveUrl": "https://shopnest-demo.vercel.app",
      "githubUrl": "https://github.com/saikatsasmal/shopnest",
      "image": "/images/Shopnest.webp",
      "featured": true
    },
    {
      "id": "p2",
      "title": "TaskFlow — Project Management",
      "shortDesc": "A Kanban-style project management tool with real-time collaboration and drag-and-drop interface.",
      "longDesc": "TaskFlow is a powerful project management application inspired by Trello and Notion. It features real-time collaboration via WebSockets, a drag-and-drop Kanban board, task assignments, due dates, priority flags, and rich text descriptions. Built with React, Socket.io, and a PostgreSQL backend.",
      "tech": [
        "React",
        "Socket.io",
        "PostgreSQL",
        "Express",
        "Docker"
      ],
      "category": "Web App",
      "status": "Live",
      "featured": true,
      "color": "#ff6584",
      "liveUrl": "https://taskflow-demo.vercel.app",
      "githubUrl": "https://github.com/saikatsasmal/taskflow",
      "image": "",
      "highlights": [
        "Real-time WebSocket collaboration",
        "Drag-and-drop Kanban board",
        "Team member management",
        "Activity timeline"
      ],
      "year": "2024"
    },
    {
      "id": "p3",
      "title": "AuraUI — Design System Library",
      "shortDesc": "A comprehensive React component library with 50+ components, dark mode, and full accessibility support.",
      "longDesc": "AuraUI is an open-source React component library built for modern web applications. It ships with 50+ production-ready components, automatic dark/light mode, full WCAG 2.1 accessibility compliance, and detailed Storybook documentation. Published on npm with 1k+ weekly downloads.",
      "tech": [
        "React",
        "TypeScript",
        "Storybook",
        "CSS Variables",
        "npm"
      ],
      "category": "Open Source",
      "status": "Live",
      "featured": true,
      "color": "#43e97b",
      "liveUrl": "https://auraui.dev",
      "githubUrl": "https://github.com/saikatsasmal/aura-ui",
      "image": "",
      "highlights": [
        "50+ accessible components",
        "Built-in dark/light mode",
        "TypeScript support",
        "Storybook documentation"
      ],
      "year": "2023"
    },
    {
      "id": "p4",
      "title": "NexChat — AI Chat Application",
      "shortDesc": "An AI-powered chat app with multiple personas, voice input, and conversation memory.",
      "longDesc": "NexChat is an AI chat application powered by the OpenAI API. It supports multiple AI personas, voice-to-text input, conversation history stored in localStorage, code highlighting in responses, and Markdown rendering. Features a clean, modern chat interface with streaming responses.",
      "tech": [
        "React",
        "OpenAI API",
        "Web Speech API",
        "Markdown",
        "Vite"
      ],
      "category": "AI / ML",
      "status": "Live",
      "featured": false,
      "color": "#f7971e",
      "liveUrl": "https://nexchat-demo.vercel.app",
      "githubUrl": "https://github.com/saikatsasmal/nexchat",
      "image": "",
      "highlights": [
        "OpenAI GPT integration",
        "Voice-to-text input",
        "Conversation memory",
        "Code syntax highlighting"
      ],
      "year": "2024"
    },
    {
      "id": "p5",
      "title": "DevBlog — Headless CMS Blog",
      "shortDesc": "A lightning-fast developer blog built with Next.js and Contentful as headless CMS.",
      "longDesc": "DevBlog is a statically-generated blog platform using Next.js 14 with App Router and Contentful as the headless CMS. It features MDX-powered posts, syntax-highlighted code blocks, SEO optimization, reading time estimates, tag filtering, and a newsletter subscription system. Scores 100/100 on Lighthouse.",
      "tech": [
        "Next.js 14",
        "Contentful",
        "MDX",
        "Tailwind CSS",
        "Vercel"
      ],
      "category": "Web App",
      "status": "Live",
      "featured": false,
      "color": "#6c63ff",
      "liveUrl": "https://devblog-demo.vercel.app",
      "githubUrl": "https://github.com/saikatsasmal/devblog",
      "image": "",
      "highlights": [
        "100/100 Lighthouse score",
        "MDX-powered content",
        "Headless CMS",
        "Static generation"
      ],
      "year": "2023"
    }
  ],
  "experience": [
    {
      "id": "e1",
      "role": "Full Stack Developer",
      "company": "TechCraft Solutions",
      "period": "Jan 2024 – Present",
      "desc": "Leading frontend development for SaaS products. Built reusable component libraries and improved page load performance by 60%."
    },
    {
      "id": "e2",
      "role": "UI/UX Developer",
      "company": "PixelForge Studio",
      "period": "Jun 2022 – Dec 2023",
      "desc": "Designed and developed responsive web applications for 15+ clients. Specialised in design system creation and accessibility."
    },
    {
      "id": "e3",
      "role": "Frontend Developer Intern",
      "company": "StartupHub India",
      "period": "Jan 2022 – May 2022",
      "desc": "Assisted in building the company's main product using React and Redux. Implemented new features and fixed critical UI bugs."
    },
    {
      "id": "e4",
      "role": "Freelance Web Designer",
      "company": "Self-Employed",
      "period": "Aug 2020 – Dec 2021",
      "desc": "Created beautiful, responsive landing pages and WordPress themes for local businesses and independent creators."
    }
  ]
};

// ─── API ──────────────────────────────────────────────────
function getData() {
  const raw = localStorage.getItem(SSR_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      let storedData = parsed;
      if (parsed && parsed.timestamp && parsed.data) {
         const ONE_DAY = 24 * 60 * 60 * 1000;
         if (Date.now() - parsed.timestamp > ONE_DAY) {
            resetData();
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
         }
         storedData = parsed.data;
      }
      // Deep merge to ensure no top-level properties are ever undefined
      return {
        site: { ...DEFAULT_DATA.site, ...(storedData.site || {}) },
        skills: storedData.skills || DEFAULT_DATA.skills,
        projects: storedData.projects || DEFAULT_DATA.projects,
        experience: storedData.experience || DEFAULT_DATA.experience
      };
    } catch (e) {
      console.error("Data parse error", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function setData(data) {
  const payload = { timestamp: Date.now(), data: data };
  localStorage.setItem(SSR_KEY, JSON.stringify(payload));
  if (typeof window.updateDataButtons === 'function') window.updateDataButtons();
}

function resetData() {
  localStorage.removeItem(SSR_KEY);
  if (typeof window.updateDataButtons === 'function') window.updateDataButtons();
}

function initData() {
  // Do not set data immediately so we can detect actual changes.
}

function hasLocalChanges() {
  return !!localStorage.getItem(SSR_KEY);
}

// Helpers
function getProjectById(id) {
  return getData().projects.find(p => p.id === id) || null;
}

function saveProject(project) {
  const data = getData();
  const idx = data.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) data.projects[idx] = project;
  else data.projects.unshift(project);
  setData(data);
}

function deleteProject(id) {
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== id);
  setData(data);
}

function generateId(prefix = 'p') {
  return `${prefix}${Date.now()}`;
}

// Force reset data for this update to take effect immediately
resetData();
initData();
