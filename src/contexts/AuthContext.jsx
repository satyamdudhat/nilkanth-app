import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.isAuthenticated) {
            setCurrentUser(user);
          } else {
            // Clear invalid data
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Sign in function
  const signIn = (userData) => {
    try {
      console.log('Signing in user:', userData);
      // In a real app, this would make an API call
      // For demo, we'll just store the user in localStorage
      const user = {
        ...userData,
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  // Sign up function
  const signUp = (userData) => {
    try {
      console.log('Signing up user:', userData);
      // In a real app, this would make an API call
      // For demo, we'll just store the user in localStorage
      const user = {
        username: userData.username || '',
        email: userData.email || '',
        isAuthenticated: true,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  // Sign out function
  const signOut = () => {
    try {
      localStorage.removeItem('user');
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 