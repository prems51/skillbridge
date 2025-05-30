// src/components/Notifications.jsx
import { useState } from 'react';

const mockNotifications = [
    {
        id: 1,
        type: 'Incoming Request',
        message: 'Alex Chen wants to connect',
        timestamp: '5 mins ago',
        userId: '123',
        read: false
    },
    {
        id: 2,
        type: 'Request Accepted',
        message: 'Priya Sharma accepted your connection',
        timestamp: '2 hours ago',
        userId: '456',
        read: true
    },
    {
        id: 3,
        type: 'New Message',
        message: 'New message from Rahul Patel',
        timestamp: '1 day ago',
        userId: '789',
        read: true
    }
];

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const toggleNotifications = () => setIsOpen(!isOpen);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    return (
        <div className="relative">
            {/* Notification Icon */}
            <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500 text-center">No notifications</p>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b border-gray-300 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium text-sm">{notification.type}</span>
                                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                    </div>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                    <div className="mt-2">
                                        <button
                                            className="text-xs text-indigo-600 hover:text-indigo-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`View profile ${notification.userId}`);
                                            }}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}