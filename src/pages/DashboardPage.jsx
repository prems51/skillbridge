import { useState } from 'react';
import Navbar from '../components/Navbar';
import SkillSection from '../components/SkillSection';

export default function DashboardPage() {
  const [skillsHave, setSkillsHave] = useState(['JavaScript', 'React', 'Public Speaking']);
  const [skillsWant, setSkillsWant] = useState(['Graphic Design', 'Machine Learning']);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your skills and find peers to learn from or teach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillSection
            title="Skills I Have"
            skills={skillsHave}
            setSkills={setSkillsHave}
          />
          <SkillSection
            title="Skills I Want to Learn"
            skills={skillsWant}
            setSkills={setSkillsWant}
          />
        </div>
      </div>
    </div>
  );
}