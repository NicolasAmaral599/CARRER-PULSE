
import React, { useState } from 'react';
import { AiPromptType } from '../types';
import { generateSummary, generateExperienceBullet, generateSkills } from '../services/geminiService';
import { SparklesIcon } from './icons';
import Spinner from './Spinner';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string | string[]) => void;
  promptType: AiPromptType;
  context?: Record<string, any>;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, onApply, promptType, context }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | string[] | null>(null);

  const getPromptDetails = () => {
    switch (promptType) {
      case AiPromptType.SUMMARY:
        return {
          title: 'AI Summary Assistant',
          label: 'Describe your role and key strengths',
          placeholder: 'e.g., professional de marketing digital com 5 anos de experiência, especializado em SEO e mídias sociais',
        };
      case AiPromptType.EXPERIENCE:
        return {
          title: 'AI Achievement Assistant',
          label: 'What was your main responsibility?',
          placeholder: 'e.g., aumentar o engajamento no Instagram',
        };
      case AiPromptType.SKILLS:
        return {
          title: 'AI Skills Suggester',
          label: 'No input needed, we will use your existing info.',
          placeholder: '',
        };
      default:
        return { title: 'AI Assistant', label: 'Your input', placeholder: '' };
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      let result: string | string[];
      switch (promptType) {
        case AiPromptType.SUMMARY:
          result = await generateSummary(userInput);
          break;
        case AiPromptType.EXPERIENCE:
          result = await generateExperienceBullet(userInput, context?.jobTitle || '');
          break;
        case AiPromptType.SKILLS:
           result = await generateSkills(context?.jobTitle || '', context?.experience || '');
          break;
        default:
          result = 'Invalid prompt type.';
      }
      setGeneratedContent(result);
    } catch (error) {
      setGeneratedContent('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onApply(generatedContent);
      handleClose();
    }
  };
  
  const handleClose = () => {
      setUserInput('');
      setGeneratedContent(null);
      setIsLoading(false);
      onClose();
  }

  if (!isOpen) return null;

  const { title, label, placeholder } = getPromptDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">{title}</h2>
        {promptType !== AiPromptType.SKILLS && (
           <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
        )}
       
        <div className="flex justify-end items-center gap-4 mb-4">
           <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            <SparklesIcon />
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {isLoading && <Spinner />}

        {generatedContent && (
          <div className="mt-4 p-4 bg-base-200 rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">AI Suggestion:</h3>
            {typeof generatedContent === 'string' ? (
                 <p className="text-text-secondary whitespace-pre-wrap">{generatedContent}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {generatedContent.map((item, index) => (
                        <span key={index} className="bg-primary/20 text-primary text-sm font-medium px-2 py-1 rounded-full">{item}</span>
                    ))}
                </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={handleClose} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={handleApply} disabled={!generatedContent} className="py-2 px-4 bg-secondary text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantModal;
