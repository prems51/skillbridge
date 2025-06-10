import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/firebase.config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isInitialized, setIsInitialized] = useState(false); // Track if auth is initialized

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user");
      
      if (user) {
        console.log("User persisted:", user.uid);
        setUser({
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          // Add other properties if they exist in user profile
          college: user.college || null,
          bio: user.bio || null,
          connectionsCount: user.connectionsCount || 0,
          skillsHave: user.skillsHave || [],
          skillsWant: user.skillsWant || []
        });
      } else {
        console.log("No persisted user");
        setUser(null);
      }
      
      setLoading(false); // Set loading to false after auth state is determined
      setIsInitialized(true); // Mark auth as initialized
    });

    return unsubscribe;
  }, []);

  const login = (userData) => {
    setUser({
      uid: userData.id,
      name: userData.name || 'User',
      email: userData.email,
      college: userData.college || null,
      bio: userData.bio || null,
      connectionsCount: userData.connectionsCount || 0,
      skillsHave: userData.skillsHave || [],
      skillsWant: userData.skillsWant || []
    });
  };

  const logout = async () => {
    try {
      await auth.signOut(); // Use Firebase signOut method
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}