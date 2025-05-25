import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser({
      name: userData.name || 'User',
      email: userData.email,
      college: userData.college || null, // Optional
      bio: userData.bio || null,         // Optional
      connectionsCount: userData.connectionsCount || 0,
      skillsHave: userData.skillsHave || [],
      skillsWant: userData.skillsWant || []
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}