
import React, { useState, useCallback } from 'react';
import { useResume } from '../hooks/useResume';
import { AiPromptType, Skill } from '../types';
import ResumePreview from '../components/ResumePreview';
import AiAssistantModal from '../components/AiAssistantModal';
import { SparklesIcon, PlusIcon, TrashIcon } from '../components/icons';
import { isAiAvailable } from '../services/geminiService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


const ResumeBuilder: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { resumes, updateResume } = useResume();
  const resume = resumes.find(r => r.id === resumeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: AiPromptType; context?: Record<string, any> }>({ type: AiPromptType.SUMMARY });

  const handleResumeChange = (updatedResume: Partial<typeof resume>) => {
      if(resume) {
          updateResume({ ...resume, ...updatedResume });
      }
  }
  
  // Handlers for updating resume state
  const handlePersonalInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resume) return;
    const { name, value } = e.target;
    const updated = { ...resume, personalInfo: { ...resume.personalInfo, [name]: value } };
    updateResume(updated);
  }, [resume, updateResume]);
  
  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!resume) return;
      updateResume({ ...resume, summary: e.target.value });
  }, [resume, updateResume]);

  const handleExperienceChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resume) return;
    const { name, value } = e.target;
    const newExperience = [...resume.experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    updateResume({ ...resume, experience: newExperience });
  }, [resume, updateResume]);
  
  const handleExperienceDescriptionChange = useCallback((expIndex: number, descIndex: number, value: string) => {
    if (!resume) return;
    const newExperience = [...resume.experience];
    newExperience[expIndex].description[descIndex] = value;
    updateResume({ ...resume, experience: newExperience });
  }, [resume, updateResume]);

  const addExperienceDescriptionItem = useCallback((expIndex: number) => {
    if (!resume) return;
    const newExperience = [...resume.experience];
    newExperience[expIndex].description.push('');
    updateResume({ ...resume, experience: newExperience });
  }, [resume, updateResume]);
  
  const removeExperienceDescriptionItem = useCallback((expIndex: number, descIndex: number) => {
    if (!resume) return;
    const newExperience = [...resume.experience];
    newExperience[expIndex].description.splice(descIndex, 1);
    updateResume({ ...resume, experience: newExperience });
  }, [resume, updateResume]);

  const updateSummary = useCallback((summary: string) => {
    if (!resume) return;
    updateResume({ ...resume, summary });
  }, [resume, updateResume]);

  const addExperienceDescriptionItemWithValue = useCallback((expIndex: number, value: string) => {
    if (!resume) return;
    const newExperience = [...resume.experience];
    newExperience[expIndex].description.push(value);
    updateResume({ ...resume, experience: newExperience });
  }, [resume, updateResume]);
  
  const addSkills = useCallback((skills: Skill[]) => {
      if (!resume) return;
      updateResume({ ...resume, skills: [...resume.skills, ...skills] });
  }, [resume, updateResume]);

  const removeSkill = useCallback((skillId: string) => {
      if (!resume) return;
      updateResume({ ...resume, skills: resume.skills.filter(s => s.id !== skillId) });
  }, [resume, updateResume]);

  // AI Modal Logic
  const openAiModal = (type: AiPromptType, context?: Record<string, any>) => {
    setModalConfig({ type, context });
    setIsModalOpen(true);
  };
  
  const handleApplyAiContent = (content: string | string[]) => {
      if (modalConfig.type === AiPromptType.SUMMARY && typeof content === 'string') {
          updateSummary(content);
      }
      if (modalConfig.type === AiPromptType.EXPERIENCE && typeof content === 'string' && modalConfig.context?.expIndex !== undefined) {
          const { expIndex } = modalConfig.context;
          addExperienceDescriptionItemWithValue(expIndex, content);
      }
      if (modalConfig.type === AiPromptType.SKILLS && Array.isArray(content)) {
          const newSkills = content.map(skillName => ({id: uuidv4(), name: skillName }));
          addSkills(newSkills);
      }
  };
  
  if (!resume) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Resume not found</h2>
            <Link to="/" className="text-primary hover:underline">Return to Dashboard</Link>
        </div>
    )
  }

  return (
    <>
      <header className="bg-primary shadow-md p-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-white tracking-wider">
              Career <span className="text-secondary">Pulse</span>
          </Link>
          <button className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              Export PDF
          </button>
      </header>
      
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <div className="mb-6">
                <label className="text-sm font-semibold text-text-secondary">Resume Title</label>
                <input 
                    name="name" 
                    value={resume.name} 
                    onChange={e => handleResumeChange({ name: e.target.value })} 
                    placeholder="e.g. Resume for Google" 
                    className="w-full text-2xl font-bold text-primary p-2 border-b-2 focus:outline-none focus:border-primary"
                />
            </div>
            
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
                     <button 
                        onClick={() => openAiModal(AiPromptType.SUMMARY)} 
                        disabled={!isAiAvailable}
                        title={!isAiAvailable ? "API Key not configured. AI features are unavailable." : "Generate summary with AI"}
                        className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-4 h-4" /> Generate with AI
                    </button>
                </div>
                <textarea value={resume.summary} onChange={handleSummaryChange} placeholder="Write a brief summary..." rows={5} className="w-full p-2 border rounded"/>
            </div>

            {/* Skills */}
            <div className="mb-6">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">Skills</h3>
                     <button 
                        onClick={() => openAiModal(AiPromptType.SKILLS, { jobTitle: resume.personalInfo.title, experience: resume.experience.map(e => e.description.join(' ')).join(' ') })}
                        disabled={!isAiAvailable}
                        title={!isAiAvailable ? "API Key not configured. AI features are unavailable." : "Suggest skills with AI"}
                        className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-4 h-4" /> Suggest Skills
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill) => (
                        <div key={skill.id} className="bg-base-200 rounded-full px-3 py-1 flex items-center gap-2">
                            <span className="text-sm">{skill.name}</span>
                            <button onClick={() => removeSkill(skill.id)} className="text-red-500 hover:text-red-700">
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
                            <button 
                                onClick={() => openAiModal(AiPromptType.EXPERIENCE, { expIndex, jobTitle: exp.jobTitle })} 
                                disabled={!isAiAvailable}
                                title={!isAiAvailable ? "API Key not configured. AI features are unavailable." : "Enhance responsibility with AI"}
                                className="flex items-center gap-1 text-sm text-primary font-semibold hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed">
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
    </>
  );
};

export default ResumeBuilder;