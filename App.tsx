
import React from 'react';
import { ResumeProvider } from './context/ResumeContext';
import ResumeBuilder from './screens/ResumeBuilder';
import Dashboard from './screens/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-base-200 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume/:resumeId" element={<ResumeBuilder />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ResumeProvider>
  );
};

export default App;