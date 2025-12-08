export const projects = [
  {
    title: "Dreami Images",
    subtitle: "AI Image Generator",
    tech: ["React", "OpenAI API", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    description: "AI-powered image generation platform using DALL-E API with user authentication, image storage, and real-time generation. Features include prompt suggestions, image history, and community gallery.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Wavify",
    subtitle: "Modern Music Player",
    tech: ["HTML", "CSS", "JavaScript", "Web Audio API", "LocalStorage"],
    description: "Feature-rich music player with playlist management, audio visualization, equalizer controls, and responsive design. Supports multiple audio formats and offers offline playback capabilities.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Pizza Recipe Hub",
    subtitle: "Recipe Discovery Platform",
    tech: ["React", "Redux", "Spoonacular API", "Tailwind CSS", "Framer Motion"],
    description: "Interactive recipe platform with search, filtering, and favorites functionality. Features include step-by-step instructions, ingredient lists, and nutritional information with responsive design.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "SmartCook UI",
    subtitle: "UI/UX Design System",
    tech: ["Figma", "Design Systems", "Prototyping", "User Testing"],
    description: "Complete UI/UX design system for a recipe app with component library, wireframes, and interactive prototypes. Focus on accessibility, responsive layouts, and intuitive navigation.",
    gradient: "from-green-500 to-teal-500"
  }
];

export const experiences = [
  {
    role: "Frontend Developer Intern",
    company: "Creativity Ventures",
    period: "Mar 2025 – Sep 2025",
    type: "Hybrid",
    points: [
      "Worked on live cricket-based web application projects, contributing to real product features.",
      "Designed clean and user-friendly UI screens using Figma for sports-focused interfaces.",
      "Developed responsive front-end components using React, Tailwind CSS, and JavaScript.",
      "Improved overall mobile and desktop responsiveness, ensuring smooth experience across all devices.",
      "Gained hands-on experience collaborating with design and development teams to deliver high-quality UI."
    ]
  },
  {
    role: "Web Developer Intern",
    company: "Next24Technologies",
    period: "Apr 2024 – Jun 2024",
    type: "Virtual",
    points: [
      "Built frontend features using HTML, CSS, JavaScript",
      "Created interactive components for client websites",
      "Improved UI consistency and reduced load time"
    ]
  }
];

export const skills = {
  "Frontend": ["HTML", "CSS", "JavaScript", "ReactJS","Redux", "Tailwind CSS", "Bootstrap"],
  "Backend": ["Node.js", "Express.js", "MongoDB"],
  "Programming": ["Python", "JavaScript"],
  "UI/UX": ["Figma", "Canva", "Blender (Basic)", ],
  "Tools": ["VS Code", "Postman"],
  "Version Control": ["Git", "GitHub"]
};

export const certifications = [
  "Fullstack Development (Imarticus)",
  "Data Analytics and Data science using Python (Inlustro)",
  "Cyber Security Experts Level 1 (Future Calls)",
  "NPTEL Online Certifications on Cloud Computing"
];

export const navItems = ['home', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact'];
// Add these exports
export const navItemsWithIcons = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
  { id: 'skills', label: 'Skills', icon: 'Code' },
  { id: 'certifications', label: 'Certifications', icon: 'Award' },                         
  { id: 'contact', label: 'Contact', icon: 'Mail' }
];