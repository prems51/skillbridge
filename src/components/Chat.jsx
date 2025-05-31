// src/components/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { db, serverTimestamp } from '../firebase';
import { CheckIcon } from '@heroicons/react/24/outline';

const Chat = ({ otherUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = auth.currentUser;
    const messagesEndRef = useRef();

    useEffect(() => {
        const cleanupOldMessages = async () => {
            const cutoff = new Date();
            cutoff.setHours(cutoff.getHours() - 72); // 72-hour retention

            const chatId = [currentUser.uid, otherUser.id].sort().join('_');
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const oldMessagesQuery = query(
                messagesRef,
                where('readAt', '<', cutoff)
            );

            const snapshot = await getDocs(oldMessagesQuery);
            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        };

        // Run cleanup when chat opens
        cleanupOldMessages();
    }, [currentUser?.uid, otherUser?.id]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const chatId = [currentUser.uid, otherUser.id].sort().join('_');
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: newMessage,
            senderId: currentUser.uid,
            receiverId: otherUser.id,
            status: 'sent',
            timestamp: serverTimestamp()
        });
        setNewMessage('');
    };

    const markAsRead = async (messageId) => {
        const chatId = [currentUser.uid, otherUser.id].sort().join('_');
        await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
            status: 'read',
            readAt: serverTimestamp()
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Mark received messages as read
        messages.forEach(msg => {
            if (msg.receiverId === currentUser?.uid && msg.status !== 'read') {
                markAsRead(msg.id);
            }
        });
    }, [messages]);

    return (
        <div className="flex flex-col h-[400px] border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-200 bg-white rounded-t-lg">
                <button onClick={onClose} className="mr-2">
                    ←
                </button>
                <div className="font-medium">{otherUser.name}</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === currentUser?.uid
                                ? 'bg-indigo-100'
                                : 'bg-gray-100'
                            }`}>
                            <p>{msg.text}</p>
                            <div className="flex justify-end items-center mt-1 space-x-1">
                                <span className="text-xs text-gray-500">
                                    {msg.timestamp?.toDate().toLocaleTimeString()}
                                </span>
                                {msg.senderId === currentUser?.uid && (
                                    <CheckIcon
                                        className={`h-3 w-3 ${msg.status === 'read' ? 'text-blue-500' : 'text-gray-400'
                                            }`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;