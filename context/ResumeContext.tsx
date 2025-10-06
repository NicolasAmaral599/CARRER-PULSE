
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Resume } from '../types';
import { v4 as uuidv4 } from 'uuid';

const createNewResume = (): Resume => ({
  id: uuidv4(),
  name: 'Untitled Resume',
  personalInfo: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
});

const createInitialResume = (): Resume => ({
  id: uuidv4(),
  name: 'My First Resume',
  personalInfo: {
    name: 'Alex Doe',
    title: 'Software Engineer',
    email: 'alex.doe@email.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexdoe',
    portfolio: 'https://github.com/alexdoe',
  },
  summary: 'A vibrant and passionate software engineer with 5 years of experience in developing user-centric web applications. Expert in React, TypeScript, and Node.js, with a strong focus on performance and creating seamless user experiences. Eager to bring technical skills and creative energy to a dynamic team.',
  experience: [
    {
      id: uuidv4(),
      jobTitle: 'Frontend Developer',
      company: 'WebCreators',
      startDate: 'Jun 2021',
      endDate: 'Present',
      description: [
        'Developed responsive user interfaces using React.js and Next.js, boosting user experience by 20%.',
        'Integrated RESTful APIs for dynamic data functionality, ensuring application fluidity.',
        'Optimized web application performance, reducing page load time by 1.5 seconds with a focus on excellence.',
      ],
    },
  ],
  education: [
    {
      id: uuidv4(),
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      startDate: 'Sep 2017',
      endDate: 'May 2021',
    },
  ],
  skills: [
    { id: uuidv4(), name: 'React.js' },
    { id: uuidv4(), name: 'TypeScript' },
    { id: uuidv4(), name: 'Node.js' },
    { id: uuidv4(), name: 'Tailwind CSS' },
    { id: uuidv4(), name: 'Agile Methodologies' },
  ],
});

interface ResumeContextType {
  resumes: Resume[];
  addResume: () => string;
  updateResume: (updatedResume: Resume) => void;
  deleteResume: (id: string) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const RESUMES_STORAGE_KEY = 'career-pulse-resumes';

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>(() => {
    try {
      const storedResumes = localStorage.getItem(RESUMES_STORAGE_KEY);
      if (storedResumes) {
        return JSON.parse(storedResumes);
      }
    } catch (error) {
      console.error("Failed to parse resumes from localStorage", error);
    }
    return [createInitialResume()];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
    } catch (error) {
      console.error("Failed to save resumes to localStorage", error);
    }
  }, [resumes]);

  const addResume = useCallback((): string => {
    const newResume = createNewResume();
    setResumes(prev => [...prev, newResume]);
    return newResume.id;
  }, []);

  const updateResume = useCallback((updatedResume: Resume) => {
    setResumes(prev => prev.map(r => r.id === updatedResume.id ? updatedResume : r));
  }, []);
  
  const deleteResume = useCallback((id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  }, []);

  const value = {
    resumes,
    addResume,
    updateResume,
    deleteResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};