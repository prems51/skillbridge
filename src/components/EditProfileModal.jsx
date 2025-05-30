// src/components/EditProfileModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';


export default function EditProfileModal({ isOpen, onClose }) {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        college: user?.college || '',
        bio: user?.bio || '',
        skillsHave: user?.skillsHave?.join(', ') || '',
        skillsWant: user?.skillsWant?.join(', ') || ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (formData.skillsHave && formData.skillsHave.split(',').some(skill => !skill.trim()))
            newErrors.skillsHave = 'Invalid skills format';
        if (formData.skillsWant && formData.skillsWant.split(',').some(skill => !skill.trim()))
            newErrors.skillsWant = 'Invalid skills format';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Prepare updated user data
        const updatedUser = {
            ...user,
            name: formData.name,
            college: formData.college,
            bio: formData.bio,
            skillsHave: formData.skillsHave.split(',').map(skill => skill.trim()).filter(Boolean),
            skillsWant: formData.skillsWant.split(',').map(skill => skill.trim()).filter(Boolean)
        };

        // In real app: await UpdateProfileAPI(updatedUser);
        setUser(updatedUser);
        onClose();
        toast.success("Porfile updated")
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name *
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* College Field */}
                    <div>
                        <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                            College
                        </label>
                        <input
                            id="college"
                            name="college"
                            type="text"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Bio Field */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Skills Sections */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="skillsHave" className="block text-sm font-medium text-gray-700">
                                Skills I Have (comma separated)
                            </label>
                            <input
                                id="skillsHave"
                                name="skillsHave"
                                type="text"
                                value={formData.skillsHave}
                                onChange={(e) => setFormData({ ...formData, skillsHave: e.target.value })}
                                className={`mt-1 block w-full rounded-md border ${errors.skillsHave ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                            />
                            {errors.skillsHave && <p className="mt-1 text-sm text-red-600">{errors.skillsHave}</p>}
                        </div>

                        <div>
                            <label htmlFor="skillsWant" className="block text-sm font-medium text-gray-700">
                                Skills I Want (comma separated)
                            </label>
                            <input
                                id="skillsWant"
                                name="skillsWant"
                                type="text"
                                value={formData.skillsWant}
                                onChange={(e) => setFormData({ ...formData, skillsWant: e.target.value })}
                                className={`mt-1 block w-full rounded-md border ${errors.skillsWant ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                            />
                            {errors.skillsWant && <p className="mt-1 text-sm text-red-600">{errors.skillsWant}</p>}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}