// src/pages/Connections.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listenToConnections, respondToRequest } from '../services/connections';
import { useAuth } from '../context/AuthContext';
import {
    collection,
    query,
    where,
    doc,
    onSnapshot,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function Connections() {
    const [connections, setConnections] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currUser } = useAuth(); // Fixed: removed () from useAuth
    const [activeTab, setActiveTab] = useState('connected');

    // Fetch user details by ID
    const fetchUserDetails = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return { id: userId, ...userDoc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!currUser?.uid) return;

        let unsubscribeSent, unsubscribeReceived;

        const fetchConnections = async () => {
            try {
                setLoading(true);

                // Listen to sent connections (where current user is sender)
                unsubscribeSent = listenToConnections(currUser.uid, async (sentConnections) => {
                    const connectionsWithUsers = await Promise.all(
                        sentConnections.map(async (conn) => {
                            const userDetails = await fetchUserDetails(conn.receiverId);
                            return {
                                ...conn,
                                userDetails,
                                connectionId: conn.id
                            };
                        })
                    );
                    setConnections(connectionsWithUsers.filter(conn => conn.userDetails));
                });

                // Listen to received requests (where current user is receiver)
                const receivedQuery = query(
                    collection(db, "connections"),
                    where("receiverId", "==", currUser.uid),
                    where("status", "==", "pending")
                );

                unsubscribeReceived = onSnapshot(receivedQuery, async (snapshot) => {
                    const requests = await Promise.all(
                        snapshot.docs.map(async (doc) => {
                            const data = doc.data();
                            const senderDetails = await fetchUserDetails(data.senderId);
                            return {
                                id: doc.id,
                                ...data,
                                userDetails: senderDetails
                            };
                        })
                    );
                    setReceivedRequests(requests.filter(req => req.userDetails));
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching connections:', err);
                setError('Failed to load connections');
                setLoading(false);
            }
        };

        fetchConnections();

        // Cleanup function
        return () => {
            if (unsubscribeSent) unsubscribeSent();
            if (unsubscribeReceived) unsubscribeReceived();
        };
    }, [currUser?.uid]);

    const handleChat = (userId) => {
        console.log(`Initiate chat with user ${userId}`);
        // TODO: Implement chat functionality
    };

    const handleAccept = async (connectionId) => {
        try {
            await respondToRequest(connectionId, 'accepted');
            console.log(`Accepted request ${connectionId}`);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDecline = async (connectionId) => {
        try {
            await respondToRequest(connectionId, 'rejected');
            console.log(`Declined request ${connectionId}`);
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading connections...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const acceptedConnections = connections.filter(conn => conn.status === 'accepted');

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
                        ✅ Connected ({acceptedConnections.length})
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        📩 Requests ({receivedRequests.length})
                    </button>
                </div>

                {/* Connected Users Tab */}
                {activeTab === 'connected' && (
                    <div>
                        {acceptedConnections.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No connections yet.</p>
                                <Link
                                    to="/suggestions"
                                    className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Discover People
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {acceptedConnections.map(connection => {
                                    const user = connection.userDetails;
                                    return (
                                        <div key={connection.id} className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="flex items-start">
                                                <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                                                    <span className="text-indigo-600 font-medium">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{user.name || 'Unknown User'}</h3>
                                                    <p className="text-sm text-gray-600">{user.college || 'College not specified'}</p>
                                                    <p className="text-sm text-gray-500">{user.course || user.bio || 'No additional info'}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleChat(user.id)}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Received Requests Tab */}
                {activeTab === 'requests' && (
                    <div>
                        {receivedRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No pending requests.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {receivedRequests.map(request => {
                                    const user = request.userDetails;
                                    return (
                                        <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="flex items-start">
                                                <div className="bg-amber-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                                                    <span className="text-amber-600 font-medium">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{user.name || 'Unknown User'}</h3>
                                                    <p className="text-sm text-gray-600">{user.college || 'College not specified'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.timestamp?.toDate ?
                                                            `Sent ${request.timestamp.toDate().toLocaleDateString()}` :
                                                            'Recently sent'
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAccept(request.id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecline(request.id)}
                                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}