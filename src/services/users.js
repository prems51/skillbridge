// src/services/users.js
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Get paginated users excluding current user
export const getPaginatedUsers = async (currentUserId, lastDoc = null, pageSize = 10) => {
  try {
    let q;
    
    if (lastDoc) {
      // For subsequent pages
      q = query(
        collection(db, 'users'),
        where('uid', '!=', currentUserId),
        orderBy('uid'), // Required for != queries
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      // For first page
      q = query(
        collection(db, 'users'),
        where('uid', '!=', currentUserId),
        orderBy('uid'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      users,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    
    // Fallback to simpler query if compound query fails
    if (error.code === 'failed-precondition') {
      return await getPaginatedUsersSimple(currentUserId, lastDoc, pageSize);
    }
    
    throw error;
  }
};

// Fallback method without compound index requirement
export const getPaginatedUsersSimple = async (currentUserId, lastDoc = null, pageSize = 10) => {
  try {
    let q;
    
    if (lastDoc) {
      q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 5) // Get extra to filter out current user
      );
    } else {
      q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(pageSize + 5)
      );
    }

    const snapshot = await getDocs(q);
    const allUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter out current user and limit results
    const filteredUsers = allUsers
      .filter(user => user.uid !== currentUserId)
      .slice(0, pageSize);

    return {
      users: filteredUsers,
      lastDoc: snapshot.docs[Math.min(filteredUsers.length, snapshot.docs.length - 1)],
      hasMore: filteredUsers.length === pageSize
    };
  } catch (error) {
    console.error('Error in simple user fetch:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Search users by name or college (for future search functionality)
export const searchUsers = async (searchTerm, currentUserId, pageSize = 10) => {
  try {
    // Simple search - you might want to implement full-text search later
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', currentUserId),
      orderBy('uid'),
      orderBy('name'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.branch?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get users with specific skills (skill-based matching)
export const getUsersBySkills = async (skills, currentUserId, pageSize = 10) => {
  try {
    // This is a simplified version - for better skill matching,
    // you might want to use array-contains-any or implement more complex logic
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', currentUserId),
      orderBy('uid'),
      limit(pageSize * 2) // Get more to filter by skills
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => {
        // Check if user has skills that match what current user wants
        const hasMatchingSkills = user.skillsHave?.some(skill => 
          skills.some(wantedSkill => 
            skill.toLowerCase().includes(wantedSkill.toLowerCase())
          )
        );
        return hasMatchingSkills;
      })
      .slice(0, pageSize);

    return users;
  } catch (error) {
    console.error('Error fetching users by skills:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};