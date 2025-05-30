// src/pages/UserProfile.jsx
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

// Mock data. to be replaced with API call later
const mockUsers = {
    '1': {
        name: 'Prem',
        college: 'IIT Bombay',
        branch: 'Computer Science',
        course: 'B.Tech',
        bio: 'Passionate about full-stack development and open source contributions.',
        skillsHave: ['React', 'Node.js', 'UI/UX'],
        skillsWant: ['Machine Learning', 'Blockchain'],
        connectionStatus: 'not-connected' // 'not-connected' | 'pending' | 'connected'
    },
    '2': {
        name: 'Raghav',
        college: 'Delhi University',
        branch: 'Electrical Engineering',
        course: 'M.Tech',
        bio: 'IoT enthusiast with 3 years of research experience.',
        skillsHave: ['Python', 'Embedded Systems'],
        skillsWant: ['Cloud Computing'],
        connectionStatus: 'connected'
    }
};

export default function UserProfile() {
    const { userId } = useParams();
    const user = mockUsers[userId];

    if (!user) return <div>User not found</div>;

    const handleConnect = () => {
        toast.success('Request sent')
        // console.log(`Connection request sent to ${user.name}`);
        // In real app: update connectionStatus to 'pending'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to suggestions
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row">
                            {/* Avatar */}
                            <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mr-6 mb-4 sm:mb-0">
                                <span className="text-indigo-600 text-2xl font-medium">
                                    {user.name.charAt(0)}
                                </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <div className="mt-2 space-y-1">
                                    <p className="text-gray-600">{user.college}</p>
                                    <p className="text-gray-600">{user.branch} • {user.course}</p>
                                </div>
                                {user.bio && (
                                    <p className="mt-4 text-gray-700">{user.bio}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 sm:mt-0 flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                                {user.connectionStatus === 'not-connected' && (
                                    <button
                                        onClick={handleConnect}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    >
                                        Connect
                                    </button>
                                )}
                                {user.connectionStatus === 'pending' && (
                                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-default">
                                        Pending
                                    </button>
                                )}
                                {user.connectionStatus === 'connected' && (
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                        Chat
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Skills I Have</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsHave.map(skill => (
                                <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Skills I Want to Learn</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsWant.map(skill => (
                                <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}