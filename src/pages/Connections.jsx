// src/pages/Connections.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data
const connectionsData = {
    connected: [
        {
            id: '1',
            name: 'Alex Chen',
            college: 'IIT Bombay',
            course: 'B.Tech Computer Science',
            avatar: 'AC'
        },
        {
            id: '2',
            name: 'Priya Sharma',
            college: 'Delhi University',
            course: 'M.Tech Electrical',
            avatar: 'PS'
        }
    ],
    pending: [
        {
            id: '3',
            name: 'Rahul Patel',
            college: 'NIT Surat',
            avatar: 'RP'
        },
        {
            id: '4',
            name: 'Neha Gupta',
            college: 'BITS Pilani',
            avatar: 'NG'
        }
    ],
    requests: [       // NEW: Requests you received
        {
            id: '5',
            name: 'Taylor Swift',
            college: 'NYU',
            avatar: 'TS'
        }
    ]
};

export default function Connections() {
    const [activeTab, setActiveTab] = useState('connected');

    const handleChat = (userId) => {
        console.log(`Initiate chat with user ${userId}`);
    };

    const handleAccept = (userId) => {
        console.log(`Accepted request from ${userId}`);
    };

    const handleDecline = (userId) => {
        console.log(`Declined request from ${userId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    to={"/my-profile"}
                    className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold mb-6">My Connections</h1>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'connected' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('connected')}
                    >
                        ✅ Connected ({connectionsData.connected.length})
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        ⏳ Pending ({connectionsData.pending.length})
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        📩 Requests ({connectionsData.requests.length})
                    </button>
                </div>

                {/* Connected Users Tab */}
                {activeTab === 'connected' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connectionsData.connected.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                                        <span className="text-indigo-600 font-medium">{user.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.college}</p>
                                        <p className="text-sm text-gray-500">{user.course}</p>
                                    </div>
                                    <button
                                        onClick={() => handleChat(user.id)}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                                    >
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pending Requests Tab */}
                {activeTab === 'pending' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connectionsData.pending.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                                        <span className="text-gray-600 font-medium">{user.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.college}</p>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Received Request Tab */}
                {activeTab === 'requests' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connectionsData.requests.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-amber-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                                        <span className="text-amber-600 font-medium">{user.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.college}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={()=> handleAccept(user.id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
                                            Accept
                                        </button>
                                        <button onClick={()=> handleDecline(user.id)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}