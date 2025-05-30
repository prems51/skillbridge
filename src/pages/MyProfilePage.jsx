import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EditProfileModal from '../components/EditProfileModal';
import { useState } from 'react';


export default function MyProfilePage() {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <Link
                        to="/dashboard"
                        className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                </div>

                {/* User Info Card */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            {/* Avatar */}
                            <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mr-6 mb-4 sm:mb-0">
                                <span className="text-indigo-600 text-2xl font-medium">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>

                            {/* User Details */}
                            <div className="flex-1">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {user?.name || 'User'}
                                    </h2>
                                    {user?.college && (
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">College:</span> {user.college}
                                        </p>
                                    )}
                                </div>

                                {/* Bio */}
                                {user?.bio && (
                                    <div className="p-3 rounded-lg">
                                        <p className="text-gray-500 italic">{user.bio}</p>
                                    </div>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button onClick={() => setIsEditModalOpen(true)} className="mt-4 sm:mt-0 bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics (Simplified) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <Link to={"/connections"} className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Connections</p>
                        <p className="text-2xl font-bold text-indigo-600">
                            {user?.connectionsCount || 0}
                        </p>
                    </Link>
                    {/* Optional: Uncomment when ready */}
                    <Link to={"/connections"} className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Requests Sent</p>
                        <p className="text-2xl font-bold text-amber-600">5</p>
                    </Link>
                    <Link to={"/connections"} className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm">Requests Received</p>
                        <p className="text-2xl font-bold text-emerald-600">3</p>
                    </Link>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Skills I Have
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {user?.skillsHave?.map((skill) => (
                                <span
                                    key={`have-${skill}`}
                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Skills I Want to Learn
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {user?.skillsWant?.map((skill) => (
                                <span
                                    key={`want-${skill}`}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>

    );
}