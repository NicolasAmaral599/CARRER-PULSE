import React from 'react';
import { ResumeProvider } from './context/ResumeContext';
import ResumeBuilder from './screens/ResumeBuilder';

const App: React.FC = () => {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-base-200 font-sans">
        <ResumeBuilder />
      </div>
    </ResumeProvider>
  );
};

export default App;
