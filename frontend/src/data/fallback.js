// What the site shows before the Spring Boot API answers (or if it is asleep/offline).
// Content comes from github.com/faiyajjarif. Keep in sync with backend DataSeeder.java.
// Once the API is live, edit projects and skills in the admin panel (/#/admin).

export const profile = {
  name: 'Faiyaj Jarif',
  roles: ['Full-stack developer', 'Robotics & embedded builder', 'Database engineer', 'Computer vision tinkerer'],
  title: 'Full-stack engineer · Robotics',
  tagline:
    'Computer Science & Engineering student and Undergraduate Teaching Assistant at United International University. I build full-stack web platforms with Spring Boot and React, and autonomous robots with microprocessors and computer vision.',
  location: 'Dhaka, Bangladesh',
  university: 'United International University',
  cgpa: '3.97',
  email: 'faiyaj.jarif01@gmail.com',
  focus: ['Full-stack development', 'Embedded systems', 'Real-time control', 'Computer vision', 'Database engineering', 'UI/UX'],
  links: {
    github: 'https://github.com/faiyajjarif',
    linkedin: 'https://www.linkedin.com/in/faiyaj-jarif',
    facebook: 'https://www.facebook.com/faiyaj.jarif',
    codeforces: 'https://codeforces.com/profile/faiyaj_j',
  },
};

export const awards = [
  { year: '2026', place: '2nd Runner-Up', event: 'Hardware Project Showcasing, SMUCT CSE Fest v3.0', project: 'RescueBot' },
  { year: '2026', place: '2nd Runner-Up', event: 'UIU CSE Project Show (Spring), System Analysis & Design Lab', project: 'Cha Ghor' },
  { year: '2026', place: '3rd Runner-Up', event: 'UIU CSE Project Show (Spring), Electronics Lab', project: 'RescueBot' },
  { year: '2025', place: '2nd Runner-Up', event: 'UIU CSE Project Show (Fall), Database Management Systems Lab', project: 'DatabaseHub' },
];

export const fallbackProjects = [
  {
    id: 'f1',
    title: 'Cha Ghor',
    summary: 'Tea garden management system with plot tracking, analytics and AI-based leaf analysis.',
    category: 'WEB',
    tags: ['Spring Boot', 'PostgreSQL', 'React', 'FastAPI', 'Figma'],
    highlights: [
      'Map-based tracking of tea garden plots',
      'Analytics dashboards for garden operations',
      'FastAPI service that analyses tea-leaf images',
      'UI designed in Figma',
    ],
    awardText: '2nd Runner-Up, UIU CSE Project Show, System Analysis & Design Lab (2026)',
    awardCount: 1,
    repoUrl: 'https://github.com/faiyajjarif/Cha-Ghor',
    sortOrder: 1,
  },
  {
    id: 'f2',
    title: 'PawHome',
    summary: 'Pet adoption and boarding platform where the database itself enforces the business rules.',
    category: 'WEB',
    tags: ['Spring Boot', 'MySQL', 'Flyway', 'React', 'Tailwind'],
    highlights: [
      '32 tables, 69 foreign keys, 39 CHECK constraints',
      'Business rules enforced at the schema level',
      'Versioned schema migrations with Flyway',
    ],
    awardCount: 0,
    repoUrl: 'https://github.com/PawHome-UIU',
    sortOrder: 2,
  },
  {
    id: 'f3',
    title: 'RescueBot',
    summary: 'Autonomous search-and-rescue robot for locating people trapped in disaster zones.',
    category: 'ROBOTICS',
    tags: ['Microprocessors', 'ESP32', 'Python', 'OpenCV'],
    highlights: [
      'Built to enter collapsed buildings and cross rough terrain',
      'On-board computer vision with Python and OpenCV',
      'Microprocessor control with a four-wheel all-terrain chassis',
    ],
    awardText: '2nd Runner-Up, SMUCT CSE Fest v3.0 · 3rd Runner-Up, UIU CSE Project Show, Electronics Lab (2026)',
    awardCount: 2,
    sortOrder: 3,
  },
  {
    id: 'f4',
    title: 'Hishab-Nikash',
    summary: 'Personal and family finance tracker with real-time updates.',
    category: 'WEB',
    tags: ['Spring Boot', 'PostgreSQL', 'React', 'WebSocket'],
    highlights: ['Real-time updates over WebSocket', 'QR code scanning', 'PDF report generation'],
    awardCount: 0,
    repoUrl: 'https://github.com/faiyajjarif/Hishab-Nikash',
    sortOrder: 4,
  },
  {
    id: 'f5',
    title: 'DatabaseHub',
    summary: 'E-learning platform backend API covering courses, assessments, payments and gamification.',
    category: 'WEB',
    tags: ['ASP.NET Core 8', 'PostgreSQL', 'EF Core'],
    highlights: ['Role-based access control', 'Courses, assessments and payments', 'Gamification layer for learners'],
    awardText: '2nd Runner-Up, UIU CSE Project Show, Database Management Systems Lab (2025)',
    awardCount: 1,
    repoUrl: 'https://github.com/faiyajjarif/DatabaseHub',
    sortOrder: 5,
  },
];

const groups = {
  'Full Stack': ['Spring Boot', 'React', 'ASP.NET Core', 'FastAPI', 'REST APIs', 'JWT'],
  Languages: ['Java', 'C', 'C++', 'C#', 'Python', 'JavaScript'],
  'Frontend & Design': ['Vite', 'Tailwind CSS', 'HTML5', 'CSS3', 'Figma'],
  'Databases & DevOps': ['PostgreSQL', 'MySQL', 'Flyway', 'Docker'],
  'Robotics, IoT & Vision': ['Microprocessors', 'ESP32', 'Arduino', 'OpenCV', 'YOLO'],
  Tools: ['Git', 'VS Code', 'IntelliJ IDEA', 'Linux'],
};

let n = 0;
export const fallbackSkills = Object.entries(groups).flatMap(([category, names]) =>
  names.map((name) => ({ id: `s${++n}`, name, category, sortOrder: n })),
);
