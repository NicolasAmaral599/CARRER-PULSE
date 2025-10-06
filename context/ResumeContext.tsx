import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Resume, Skill } from '../types';

const initialResume: Resume = {
  id: `resume-${Date.now()}`,
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
      id: `exp-${Date.now()}`,
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
        id: `edu-${Date.now()}`,
        institution: 'University of Technology',
        degree: 'B.S. in Computer Science',
        startDate: 'Sep 2017',
        endDate: 'May 2021'
    }
  ],
  skills: [
      { id: `skill-${Date.now()}-1`, name: 'React.js' },
      { id: `skill-${Date.now()}-2`, name: 'TypeScript' },
      { id: `skill-${Date.now()}-3`, name: 'Node.js' },
      { id: `skill-${Date.now()}-4`, name: 'Tailwind CSS' },
      { id: `skill-${Date.now()}-5`, name: 'Agile Methodologies' }
  ],
};


interface ResumeContextType {
  resume: Resume;
  handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSummaryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleExperienceChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExperienceDescriptionChange: (expIndex: number, descIndex: number, value: string) => void;
  addExperienceDescriptionItem: (expIndex: number) => void;
  removeExperienceDescriptionItem: (expIndex: number, descIndex: number) => void;
  updateSummary: (summary: string) => void;
  addExperienceDescriptionItemWithValue: (expIndex: number, value: string) => void;
  addSkills: (skills: Skill[]) => void;
  removeSkill: (skillId: string) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<Resume>(initialResume);

  const handlePersonalInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  }, []);
  
  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setResume(prev => ({ ...prev, summary: e.target.value }));
  }, []);

  const handleExperienceChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResume(prev => {
        const newExperience = [...prev.experience];
        newExperience[index] = { ...newExperience[index], [name]: value };
        return { ...prev, experience: newExperience };
    });
  }, []);
  
  const handleExperienceDescriptionChange = useCallback((expIndex: number, descIndex: number, value: string) => {
    setResume(prev => {
        const newExperience = [...prev.experience];
        newExperience[expIndex].description[descIndex] = value;
        return { ...prev, experience: newExperience };
    });
  }, []);

  const addExperienceDescriptionItem = useCallback((expIndex: number) => {
    setResume(prev => {
        const newExperience = [...prev.experience];
        newExperience[expIndex].description.push('');
        return { ...prev, experience: newExperience };
    });
  }, []);
  
  const removeExperienceDescriptionItem = useCallback((expIndex: number, descIndex: number) => {
    setResume(prev => {
        const newExperience = [...prev.experience];
        newExperience[expIndex].description.splice(descIndex, 1);
        return { ...prev, experience: newExperience };
    });
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResume(prev => ({ ...prev, summary }));
  }, []);

  const addExperienceDescriptionItemWithValue = useCallback((expIndex: number, value: string) => {
    setResume(prev => {
        const newExperience = [...prev.experience];
        newExperience[expIndex].description.push(value);
        return { ...prev, experience: newExperience };
    });
  }, []);
  
  const addSkills = useCallback((skills: Skill[]) => {
      setResume(prev => ({ ...prev, skills: [...prev.skills, ...skills] }));
  }, []);

  const removeSkill = useCallback((skillId: string) => {
      setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
  }, []);


  const value = {
    resume,
    handlePersonalInfoChange,
    handleSummaryChange,
    handleExperienceChange,
    handleExperienceDescriptionChange,
    addExperienceDescriptionItem,
    removeExperienceDescriptionItem,
    updateSummary,
    addExperienceDescriptionItemWithValue,
    addSkills,
    removeSkill
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};
