
import React from 'react';
import { Resume } from '../types';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills } = resume;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 h-full overflow-y-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-xl text-text-secondary mt-1">{personalInfo.title || 'Your Professional Title'}</p>
        <div className="flex justify-center gap-4 text-sm text-text-secondary mt-4">
          <span>{personalInfo.email || 'your.email@example.com'}</span>
          <span>{personalInfo.phone || '(123) 456-7890'}</span>
          <span>{personalInfo.location || 'City, State'}</span>
        </div>
         <div className="flex justify-center gap-4 text-sm text-primary mt-2">
            {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {personalInfo.portfolio && <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">Summary</h2>
          <p className="text-text-secondary">{summary}</p>
        </section>
      )}

      {skills.length > 0 && (
          <section className="mb-6">
              <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                      <span key={skill.id} className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">{skill.name}</span>
                  ))}
              </div>
          </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">Professional Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="text-lg font-bold text-text-primary">{exp.jobTitle}</h3>
              <div className="flex justify-between text-md font-semibold text-text-secondary">
                <span>{exp.company}</span>
                <span>{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside mt-2 text-text-secondary space-y-1">
                {exp.description.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      {education.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">Education</h2>
          {education.map((edu) => (
             <div key={edu.id} className="mb-4">
              <h3 className="text-lg font-bold text-text-primary">{edu.institution}</h3>
              <div className="flex justify-between text-md font-semibold text-text-secondary">
                <span>{edu.degree}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
