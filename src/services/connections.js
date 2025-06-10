import {
    collection,
    query,
    where,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    or
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

// Send connection request
export const sendRequest = async (senderId, receiverId) => {
    try {
        await addDoc(collection(db, "connections"), {
            senderId,
            receiverId,
            status: "pending",
            timestamp: serverTimestamp() // Use server timestamp for consistency
        });
        console.log("Connection request sent successfully");
    } catch (error) {
        console.error("Error sending connection request:", error);
        throw error;
    }
};

// Accept/reject request
export const respondToRequest = async (connectionId, response) => {
    try {
        await updateDoc(doc(db, "connections", connectionId), {
            status: response, // "accepted" or "rejected"
            responseTimestamp: serverTimestamp()
        });
        console.log(`Request ${response} successfully`);
    } catch (error) {
        console.error(`Error ${response}ing request:`, error);
        throw error;
    }
};

// Real-time connection status listener for SENT connections
export const listenToConnections = (userId, callback) => {
    const q = query(
        collection(db, "connections"),
        where("senderId", "==", userId),
        where("status", "in", ["pending", "accepted"])
    );

    return onSnapshot(q, (snapshot) => {
        const connections = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(connections);
    }, (error) => {
        console.error("Error listening to connections:", error);
    });
};

// Real-time listener for RECEIVED requests
export const listenToReceivedRequests = (userId, callback) => {
    const q = query(
        collection(db, "connections"),
        where("receiverId", "==", userId),
        where("status", "==", "pending")
    );

    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(requests);
    }, (error) => {
        console.error("Error listening to received requests:", error);
    });
};

// Get all connections for a user (both sent and received)
export const listenToAllUserConnections = (userId, callback) => {
    const q = query(
        collection(db, "connections"),
        or(
            where("senderId", "==", userId),
            where("receiverId", "==", userId)
        ),
        where("status", "in", ["pending", "accepted"])
    );

    return onSnapshot(q, (snapshot) => {
        const connections = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Add helper properties to identify relationship
                isSender: data.senderId === userId,
                isReceiver: data.receiverId === userId,
                otherUserId: data.senderId === userId ? data.receiverId : data.senderId
            };
        });
        callback(connections);
    }, (error) => {
        console.error("Error listening to all connections:", error);
    });
};

// Check if connection exists between two users
export const checkConnectionStatus = async (userId1, userId2) => {
    try {
        const q = query(
            collection(db, "connections"),
            or(
                where("senderId", "==", userId1),
                where("receiverId", "==", userId1)
            )
        );

        return new Promise((resolve, reject) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const connection = snapshot.docs.find(doc => {
                    const data = doc.data();
                    return (
                        (data.senderId === userId1 && data.receiverId === userId2) ||
                        (data.senderId === userId2 && data.receiverId === userId1)
                    );
                });

                unsubscribe(); // Clean up listener
                resolve(connection ? { id: connection.id, ...connection.data() } : null);
            }, reject);
        });
    } catch (error) {
        console.error("Error checking connection status:", error);
        throw error;
    }
};