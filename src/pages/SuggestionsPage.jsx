import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';

// Mock data - in a real app this would come from an API
const mockUsers = [
  {
    id: 1,
    name: 'Prem',
    skillsHave: ['React', 'UI Design', 'Public Speaking'],
    skillsWant: ['Python', 'Data Analysis']
  },
  {
    id: 2,
    name: 'Raghav',
    skillsHave: ['Machine Learning', 'Python'],
    skillsWant: ['Web Development', 'Communication']
  },
  {
    id: 3,
    name: 'Paras',
    skillsHave: ['Graphic Design', 'Photography'],
    skillsWant: ['Digital Marketing', 'React']
  },
  {
    id: 4,
    name: 'Anuj',
    skillsHave: ['Data Analysis', 'Statistics'],
    skillsWant: ['Public Speaking', 'Leadership']
  }
];

export default function SuggestionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Suggested Connections</h1>
          <p className="mt-1 text-sm text-gray-600">
            Find peers who match your skills and learning goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}