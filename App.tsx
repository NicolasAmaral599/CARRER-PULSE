
import React, { useState, useCallback } from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill, AiPromptType } from './types';
import ResumePreview from './components/ResumePreview';
import AiAssistantModal from './components/AiAssistantModal';
import { SparklesIcon, PlusIcon, TrashIcon } from './components/icons';

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


const App: React.FC = () => {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: AiPromptType; context?: Record<string, any> }>({ type: AiPromptType.SUMMARY });

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

  const openAiModal = (type: AiPromptType, context?: Record<string, any>) => {
    setModalConfig({ type, context });
    setIsModalOpen(true);
  };
  
  const handleApplyAiContent = (content: string | string[]) => {
      if (modalConfig.type === AiPromptType.SUMMARY && typeof content === 'string') {
          setResume(prev => ({ ...prev, summary: content }));
      }
      if (modalConfig.type === AiPromptType.EXPERIENCE && typeof content === 'string' && modalConfig.context?.expIndex !== undefined) {
          const { expIndex } = modalConfig.context;
          addExperienceDescriptionItem(expIndex);
          setResume(prev => {
              const newExperience = [...prev.experience];
              const desc = newExperience[expIndex].description;
              desc[desc.length - 1] = content;
              return { ...prev, experience: newExperience };
          });
      }
      if (modalConfig.type === AiPromptType.SKILLS && Array.isArray(content)) {
          const newSkills = content.map(skillName => ({id: `skill-${Date.now()}-${Math.random()}`, name: skillName }));
          setResume(prev => ({...prev, skills: [...prev.skills, ...newSkills]}));
      }
  };

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      <header className="bg-primary shadow-md p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
              Career <span className="text-secondary">Pulse</span>
          </h1>
          <button className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              Export PDF
          </button>
      </header>
      
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <h2 className="text-2xl font-bold text-primary mb-6">Edit Your Resume</h2>
            
            {/* Personal Info */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={resume.personalInfo.name} onChange={handlePersonalInfoChange} placeholder="Full Name" className="p-2 border rounded"/>
                    <input name="title" value={resume.personalInfo.title} onChange={handlePersonalInfoChange} placeholder="Professional Title" className="p-2 border rounded"/>
                    <input name="email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" className="p-2 border rounded"/>
                    <input name="phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Phone" className="p-2 border rounded"/>
                    <input name="location" value={resume.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="Location" className="p-2 border rounded"/>
                    <input name="linkedin" value={resume.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="LinkedIn URL" className="p-2 border rounded"/>
                    <input name="portfolio" value={resume.personalInfo.portfolio} onChange={handlePersonalInfoChange} placeholder="Portfolio/GitHub URL" className="p-2 border rounded"/>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">Professional Summary</h3>
                     <button onClick={() => openAiModal(AiPromptType.SUMMARY)} className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800">
                        <SparklesIcon className="w-4 h-4" /> Generate with AI
                    </button>
                </div>
                <textarea value={resume.summary} onChange={handleSummaryChange} placeholder="Write a brief summary..." rows={5} className="w-full p-2 border rounded"/>
            </div>

            {/* Skills */}
            <div className="mb-6">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">Skills</h3>
                     <button onClick={() => openAiModal(AiPromptType.SKILLS, { jobTitle: resume.personalInfo.title, experience: resume.experience.map(e => e.description.join(' ')).join(' ') })} className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800">
                        <SparklesIcon className="w-4 h-4" /> Suggest Skills
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                        <div key={skill.id} className="bg-base-200 rounded-full px-3 py-1 flex items-center gap-2">
                            <span className="text-sm">{skill.name}</span>
                            <button className="text-red-500 hover:text-red-700">
                                <TrashIcon className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            {/* Experience */}
            <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Experience</h3>
                {resume.experience.map((exp, expIndex) => (
                    <div key={exp.id} className="p-4 border rounded-lg mb-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <input name="jobTitle" value={exp.jobTitle} onChange={e => handleExperienceChange(expIndex, e)} placeholder="Job Title" className="p-2 border rounded"/>
                            <input name="company" value={exp.company} onChange={e => handleExperienceChange(expIndex, e)} placeholder="Company" className="p-2 border rounded"/>
                            <input name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(expIndex, e)} placeholder="Start Date" className="p-2 border rounded"/>
                            <input name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(expIndex, e)} placeholder="End Date" className="p-2 border rounded"/>
                        </div>
                         <div className="flex justify-end mb-2">
                            <button onClick={() => openAiModal(AiPromptType.EXPERIENCE, { expIndex, jobTitle: exp.jobTitle })} className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800">
                                <SparklesIcon className="w-4 h-4" /> Enhance a responsibility
                            </button>
                        </div>
                        {exp.description.map((desc, descIndex) => (
                            <div key={descIndex} className="flex items-center gap-2 mb-2">
                                <textarea
                                    value={desc}
                                    onChange={e => handleExperienceDescriptionChange(expIndex, descIndex, e.target.value)}
                                    placeholder="Responsibility or achievement"
                                    rows={2}
                                    className="w-full p-2 border rounded"
                                />
                                <button onClick={() => removeExperienceDescriptionItem(expIndex, descIndex)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon /></button>
                            </div>
                        ))}
                        <button onClick={() => addExperienceDescriptionItem(expIndex)} className="text-sm font-semibold text-primary hover:text-purple-800 flex items-center gap-1 mt-2">
                            <PlusIcon className="w-4 h-4"/> Add Description
                        </button>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Preview Column */}
        <div className="hidden lg:block max-h-[calc(100vh-120px)]">
          <ResumePreview resume={resume} />
        </div>
      </main>
      
      <AiAssistantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyAiContent}
        promptType={modalConfig.type}
        context={modalConfig.context}
      />
    </div>
  );
};

export default App;
