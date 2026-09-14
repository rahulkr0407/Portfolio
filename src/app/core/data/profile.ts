import type { IconName } from '../../shared/icon/icon';

export type SocialIcon = 'github' | 'linkedin';

export interface SocialLink {
  icon: SocialIcon;
  label: string;
  href: string;
}

export interface NavLink {
  id: string;
  label: string;
}

export interface SkillCategory {
  icon: IconName;
  category: string;
  items: string[];
  highlight?: boolean;
}

export interface EducationEntry {
  level: string;
  school: string;
  year: string;
  detail: string;
  grade?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  duration: string;
  technologies: string[];
  bullets: string[];
}

export interface CaseStudy {
  overview: string;
  solution: string;
  keyFeatures: string[];
  technology: string[];
  development: string[];
}

export interface Project {
  title: string;
  tagline: string;
  bullets: string[];
  tags: string[];
  featured?: boolean;
  caseStudy?: CaseStudy;
  github?: string;
  live?: string;
}

export interface QuickFact {
  label: string;
  value: string;
}

export const profile = {
  name: 'Rahul Kumar',
  title: 'Frontend Developer',
  greeting: "Hi, I'm",
  intro:
    'Frontend developer with enterprise experience building web applications at TCS. ' +
    'Currently building cloud-deployed, AI-integrated platforms using Angular, Python, and Docker.',
  roles: ['Angular & TypeScript', 'Python & FastAPI', 'Full-Stack Development', 'Docker & CI/CD'],
  availability: 'Open to opportunities',
  email: 'mrahul2572002@gmail.com',
  phone: '+91 62995 66895',
  location: 'Noida, Uttar Pradesh, India',
  address: 'Noida, India · Open to Relocation',
  socials: [
    { icon: 'github', label: 'GitHub', href: 'https://github.com/rahulkr0407' },
    { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahulkr0407/' },
  ] as SocialLink[],
  photo: {
    src: 'animated_portfolio_image.png',
    alt: 'Portrait of Rahul Kumar',
    width: 1008,
    height: 1044,
  },
  navLinks: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ] as NavLink[],
  about: {
    paragraphs: [
      'Software Engineer at Tata Consultancy Services, working on enterprise applications with Angular, TypeScript, and REST API integration. Experienced with production debugging, Git-based collaboration, and delivering features in an Agile environment.',
      'Building full-stack applications with Python/FastAPI, MongoDB, Docker, and AI integrations. Currently focused on cloud deployment, automation, and DevOps practices through projects like CivicLens AI.',
    ],
    coreTech: ['Angular', 'TypeScript', 'Python', 'FastAPI', 'Docker', 'MongoDB'],
    facts: [
      { label: 'Name', value: 'Rahul Kumar' },
      { label: 'Location', value: 'Noida, UP' },
      { label: 'Degree', value: 'B.Tech CSE' },
      { label: 'Email', value: 'mrahul2572002@gmail.com' },
    ] as QuickFact[],
  },
  experience: [
    {
      role: 'Systems Engineer',
      company: 'Tata Consultancy Services (TCS)',
      location: 'Noida',
      duration: 'April 2025 — Present',
      technologies: ['Angular', 'TypeScript', 'REST APIs', 'Git'],
      bullets: [
        'Develop and maintain enterprise application features using Angular and TypeScript.',
        'Integrate frontend modules with backend REST APIs and manage API responses, authentication flows, and error handling.',
        'Debug and resolve production issues, contributing to application stability and reliable releases.',
        'Use Git for version control and collaborate with backend developers and product teams in an Agile/Scrum environment.',
      ],
    },
  ] as Experience[],
  skills: [
    { icon: 'layout', category: 'Frontend', items: ['Angular 20', 'React', 'HTML5', 'CSS', 'Tailwind CSS', 'RxJS'], highlight: true },
    { icon: 'terminal', category: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'Java'] },
    { icon: 'database', category: 'Backend & APIs', items: ['FastAPI', 'REST APIs', 'Pydantic', 'Node.js', 'Swagger/OpenAPI'] },
    { icon: 'cloud', category: 'Cloud / DevOps', items: ['Docker', 'Git/GitHub', 'Vercel', 'Render', 'CI/CD'] },
    { icon: 'shield', category: 'Security', items: ['JWT', 'OAuth 2.0', 'Argon2', 'SHA-256'] },
    { icon: 'brain', category: 'AI', items: ['Google Gemini', 'Prompt Engineering', 'AI Verification'] },
  ] as SkillCategory[],
  education: [
    {
      level: 'Matriculation',
      school: 'Jawahar Navodaya Vidyalaya',
      year: '2018',
      detail: 'Completed 10th standard',
      grade: '85%',
    },
    {
      level: 'Intermediate',
      school: 'Vj Sachdeva Int School',
      year: '2020',
      detail: 'Completed 12th standard',
      grade: '65%',
    },
    {
      level: 'Bachelor of Technology',
      school: 'Lovely Professional University',
      year: '2020 — 2024',
      detail: 'Computer Science & Engineering',
      grade: 'CGPA 7.32',
    },
  ] as EducationEntry[],
  projects: [
    {
      title: 'CivicLens AI',
      tagline: 'Full-Stack AI Civic Information Platform',
      featured: true,
      bullets: [
        'Building a platform that provides neutral, age-appropriate explanations of Indian civic topics using Angular, FastAPI, MongoDB, and Google Gemini.',
        'Designed a FastAPI REST API with 18+ endpoints, Pydantic validation, Swagger docs, JWT/OAuth authentication, Argon2 hashing, rotating refresh tokens, and Google JWKS verification.',
        'Implemented an AI verification layer validating generated source URLs with retry/backoff and in-memory caching.',
        'Built an Angular 20 SPA with 12+ routed pages, RxJS reactive authentication, token-refresh interceptor, route guards, dashboards, AI chat, and civic trackers.',
        'Containerized with Docker and deployed backend on Render, frontend on Vercel, database on MongoDB Atlas with automatic GitHub deployment.',
      ],
      tags: ['Angular 20', 'FastAPI', 'MongoDB', 'Google Gemini', 'Docker', 'Vercel', 'Render'],
      caseStudy: {
        overview:
          'An AI-powered civic education platform providing neutral explanations of Indian bills, policies, protests, elections, and civic topics. Built to make civic information accessible and understandable for all age groups.',
        solution:
          'Designed a full-stack architecture with an Angular 20 frontend communicating with a Python/FastAPI backend. Implemented secure authentication (JWT + OAuth 2.0 + Google Sign-In), AI-powered content generation with verification, and containerized deployment across multiple cloud services.',
        keyFeatures: [
          '18+ REST API endpoints with Pydantic validation and Swagger documentation',
          'JWT/OAuth 2.0 authentication with Argon2 hashing and rotating refresh tokens',
          'Google JWKS verification for secure Google Sign-In integration',
          'AI verification layer validating source URLs with retry/backoff and caching',
          'Angular 20 SPA with 12+ routed pages, RxJS reactive auth, and route guards',
          'AI chat interface with structured JSON output and response verification',
          'Bookmark and civic tracker features for saved topics',
          'Full Docker containerization with automatic deployment pipeline',
        ],
        technology: [
          'Angular 20',
          'TypeScript',
          'RxJS',
          'FastAPI',
          'Python',
          'Pydantic',
          'MongoDB',
          'MongoDB Atlas',
          'Google Gemini',
          'JWT',
          'OAuth 2.0',
          'Argon2',
          'Docker',
          'Vercel',
          'Render',
          'GitHub Actions',
        ],
        development: [
          'Designed the REST API architecture with 18+ endpoints and comprehensive Pydantic validation.',
          'Implemented a multi-layer authentication system with JWT access/refresh tokens, OAuth 2.0, and Google JWKS verification.',
          'Built an AI content generation pipeline with source URL verification and resilient error handling.',
          'Developed the Angular 20 frontend with RxJS-powered reactive authentication and route protection.',
          'Containerized the entire application stack with Docker for consistent development and deployment.',
        ],
      },
    },
    {
      title: 'Shrtx',
      tagline: 'Frontend URL Shortener & Analytics Platform',
      bullets: [
        'Developed a modular URL-shortening and analytics platform using Angular and TypeScript.',
        'Implemented JWT-based authentication with access/refresh token handling and integrated backend APIs.',
        'Built analytics dashboards and subscription features with secure API communication and error handling.',
      ],
      tags: ['Angular', 'TypeScript', 'JWT'],
    },
    {
      title: 'COVID-19 Vaccine Slot Finder',
      tagline: 'Real-Time Vaccine Availability Web App',
      bullets: [
        'Developed a web application to check COVID-19 vaccine slot availability in real time by integrating a public REST API.',
        'Built a user-friendly, interactive interface using HTML, CSS, and JavaScript that dynamically updates slot data.',
        'Presented availability details like date, dose, and location clearly, with a clean and responsive layout.',
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    },
    {
      title: 'Market Segmentation for McDonald\'s',
      tagline: 'Data-Driven Consumer Segmentation',
      bullets: [
        'Led a data-driven market segmentation project for McDonald\'s using K-Means clustering to identify customer segments based on purchasing behavior and demographics.',
        'Cleaned and transformed data, handling missing values and encoding categorical variables to prepare for analysis.',
        'Visualized key insights using PCA and created targeted marketing strategies for segments like loyal customers and families.',
      ],
      tags: ['Python', 'Pandas', 'K-Means', 'PCA'],
    },
  ] as Project[],
};
