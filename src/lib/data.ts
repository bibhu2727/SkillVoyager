export type Skill = {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type UserProfile = {
  name: string;
  age: number;
  educationLevel: string;
  fieldOfInterest: string;
  currentSkills: Skill[];
  careerAspirations: string;
  experience: string;
  projects: string[];
  awards: string[];
};

export const userProfile: UserProfile = {
  name: 'Alex Doe',
  age: 24,
  educationLevel: 'Bachelors in Computer Science',
  fieldOfInterest: 'Artificial Intelligence',
  currentSkills: [
    { name: 'Python', proficiency: 'Advanced' },
    { name: 'JavaScript', proficiency: 'Intermediate' },
    { name: 'SQL', proficiency: 'Intermediate' },
    { name: 'React', proficiency: 'Intermediate' },
    { name: 'Node.js', proficiency: 'Beginner' },
    { name: 'Machine Learning', proficiency: 'Intermediate' },
  ],
  careerAspirations: 'AI Engineer',
  experience: "Software Engineer at TechCorp (2022-Present)\n- Developed and maintained web applications using React and Node.js.\n- Collaborated with cross-functional teams to deliver new features.",
  projects: ["Personal portfolio website", "AI-powered chatbot for customer service"],
  awards: ["Dean's List 2021", "Hackathon Winner 2022"],
};

export const skillChartData = [
  { skill: 'Python', level: 80, fullMark: 100 },
  { skill: 'Machine Learning', level: 60, fullMark: 100 },
  { skill: 'Data Analysis', level: 75, fullMark: 100 },
  { skill: 'Cloud (AWS/GCP)', level: 40, fullMark: 100 },
  { skill: 'SQL', level: 70, fullMark: 100 },
  { skill: 'Communication', level: 90, fullMark: 100 },
];
