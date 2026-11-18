import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { AskGuess } from './pages/AskGuess';
import { LabBench } from './pages/LabBench';
import { LookThink } from './pages/LookThink';
import { Check } from './pages/Check';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/ask" element={<AskGuess />} />
        <Route path="/lab" element={<LabBench />} />
        <Route path="/look" element={<LookThink />} />
        <Route path="/check" element={<Check />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
