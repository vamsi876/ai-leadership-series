// Mock data for AI Leadership platform

export const mockCourses = [
  {
    id: '1',
    title: 'AI Leadership Series',
    description: 'Master the essential skills and knowledge needed to lead in the age of artificial intelligence.',
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=2670&auto=format&fit=crop',
    progress: 0,
    modules: 4,
  }
];

export const mockLessons = [
  {
    id: '1',
    courseId: '1',
    title: 'Introduction to Generative AI - Part 1',
    description: 'Understanding the fundamental concepts of Generative AI and its applications',
    content: 'This lesson covers the basics of Generative AI, including its core concepts, capabilities, and real-world applications.',
    notes: 'Key points:\n- Understanding AI and Machine Learning basics\n- Introduction to Generative AI\n- Common use cases and applications\n- Impact on business and leadership',
    order: 1,
    duration: '45 min',
    completed: false,
    pdfUrl: 'https://elnzycwsjcgzbllzbvjw.supabase.co/storage/v1/object/sign/pdfs/1-Introduction-to-Generative-AI-Part-1.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I3ZDkwYTI2LWU1NmMtNDc5MC1hMTBjLTU2OTA5NWIwZGViZCJ9.eyJ1cmwiOiJwZGZzLzEtSW50cm9kdWN0aW9uLXRvLUdlbmVyYXRpdmUtQUktUGFydC0xLnBkZiIsImlhdCI6MTc0NzM0NjUzNSwiZXhwIjoxNzQ3OTUxMzM1fQ.My87d9aJYwN9UdnXfcqdpMIE4-23GSPEBDTS8xGHlaU',
    pdfTitle: 'Introduction to Generative AI - Part 1'
  },
  {
    id: '2',
    courseId: '1',
    title: 'Introduction to Generative AI - Part 2',
    description: 'Deep dive into advanced concepts and practical applications of Generative AI',
    content: 'Building upon Part 1, this lesson explores advanced concepts and practical implementations of Generative AI in business contexts.',
    notes: 'Key points:\n- Advanced Generative AI concepts\n- Practical implementation strategies\n- Business use cases\n- Integration considerations',
    order: 2,
    duration: '45 min',
    completed: false,
    pdfUrl: 'https://elnzycwsjcgzbllzbvjw.supabase.co/storage/v1/object/sign/pdfs/2-Introduction-to-Generative-AI-Part-2.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I3ZDkwYTI2LWU1NmMtNDc5MC1hMTBjLTU2OTA5NWIwZGViZCJ9.eyJ1cmwiOiJwZGZzLzItSW50cm9kdWN0aW9uLXRvLUdlbmVyYXRpdmUtQUktUGFydC0yLnBkZiIsImlhdCI6MTc0NzM0NjcxNywiZXhwIjoxNzQ3OTUxNTE3fQ.4PgIJJrQaRnemlWWztin2xBDXxaESX6nuB18TdOtm-8',
    pdfTitle: 'Introduction to Generative AI - Part 2'
  },
  {
    id: '3',
    courseId: '1',
    title: 'Generative AI: Using AI to Build Tools',
    description: 'Learn how to leverage Generative AI to create powerful business tools and solutions',
    content: 'This lesson focuses on practical applications of Generative AI in building business tools and automating processes.',
    notes: 'Key points:\n- Tool development with AI\n- Automation strategies\n- Business process optimization\n- Implementation best practices',
    order: 3,
    duration: '40 min',
    completed: false,
    pdfUrl: 'https://elnzycwsjcgzbllzbvjw.supabase.co/storage/v1/object/sign/pdfs/3-Generative-AI-Using-AI-to-Build-Tools.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I3ZDkwYTI2LWU1NmMtNDc5MC1hMTBjLTU2OTA5NWIwZGViZCJ9.eyJ1cmwiOiJwZGZzLzMtR2VuZXJhdGl2ZS1BSS1Vc2luZy1BSS10by1CdWlsZC1Ub29scy5wZGYiLCJpYXQiOjE3NDczNDY3MjgsImV4cCI6MTc0Nzk1MTUyOH0.HW0iKee7LCagho9cHFpW7hCwOOhfQeFadxD2e4cGyA4',
    pdfTitle: 'Generative AI: Using AI to Build Tools'
  },
  {
    id: '4',
    courseId: '1',
    title: 'Building Your Own Custom LLM',
    description: 'Master the process of creating and customizing Large Language Models for your organization',
    content: 'Advanced lesson covering the development and customization of Large Language Models for specific business needs.',
    notes: 'Key points:\n- LLM architecture and components\n- Customization techniques\n- Training and fine-tuning\n- Deployment and maintenance',
    order: 4,
    duration: '50 min',
    completed: false,
    pdfUrl: 'https://elnzycwsjcgzbllzbvjw.supabase.co/storage/v1/object/sign/pdfs/4-Building-Your-Own-Custom-LLM%20(2).pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I3ZDkwYTI2LWU1NmMtNDc5MC1hMTBjLTU2OTA5NWIwZGViZCJ9.eyJ1cmwiOiJwZGZzLzQtQnVpbGRpbmctWW91ci1Pd24tQ3VzdG9tLUxMTSAoMikucGRmIiwiaWF0IjoxNzQ3MzQ2NzQyLCJleHAiOjE3NDc5NTE1NDJ9.TqTGPTuVMixFYqDfCehOd5U-pmX6QiBcIYCgvzXlC1g',
    pdfTitle: 'Building Your Own Custom LLM'
  }
];

export const mockResources = [
  {
    id: '1',
    title: 'The Future of Leadership in AI-First Organizations',
    type: 'Article',
    date: 'May 10, 2025',
  },
  {
    id: '2',
    title: '10 Essential AI Leadership Skills for 2025',
    type: 'Guide',
    date: 'May 8, 2025',
  },
  {
    id: '3',
    title: 'Ethical AI Implementation Framework',
    type: 'Template',
    date: 'May 5, 2025',
  },
  {
    id: '4',
    title: 'AI Strategy Planning Worksheet',
    type: 'Worksheet',
    date: 'May 2, 2025',
  },
];

export const mockVideos = [
  {
    id: '1',
    title: 'Building AI-Ready Leadership Teams',
    duration: '24 min',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2274&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Leading Through AI Transformation',
    duration: '18 min',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'AI Communication Strategies for Leaders',
    duration: '31 min',
    thumbnail: 'https://images.unsplash.com/photo-1539786774582-301f537aae5f?q=80&w=2574&auto=format&fit=crop',
  },
];

export const mockPrompts = [
  {
    id: '1',
    title: 'Strategic Planning',
    description: 'Prompts for AI-assisted strategic planning and roadmapping',
    count: 12,
  },
  {
    id: '2',
    title: 'Team Development',
    description: 'Prompts for developing AI-ready teams and skills',
    count: 8,
  },
  {
    id: '3',
    title: 'Change Management',
    description: 'Prompts for managing AI-driven organizational changes',
    count: 15,
  },
  {
    id: '4',
    title: 'Decision Making',
    description: 'Prompts for enhancing decision processes with AI',
    count: 10,
  },
];

export const mockProgressStats = [
  {
    title: 'Course Completion',
    progress: 7,
    total: 26,
  },
  {
    title: 'Resources Explored',
    progress: 12,
    total: 45,
  },
  {
    title: 'Videos Watched',
    progress: 8,
    total: 24,
  },
  {
    title: 'Prompts Used',
    progress: 15,
    total: 45,
  },
];

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Executive Leader',
  organization: 'Tech Innovations Inc.',
  joined: 'April 15, 2025',
  avatar: null,
};
