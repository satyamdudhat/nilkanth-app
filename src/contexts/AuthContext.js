import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.isAuthenticated) {
            setCurrentUser(user);
          } else {
            await AsyncStorage.removeItem('user');
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        await AsyncStorage.removeItem('user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Sign in function
  const signIn = async (userData) => {
    try {
      const user = {
        ...userData,
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    try {
      const user = {
        username: userData.username || '',
        email: userData.email || '',
        isAuthenticated: true,
        createdAt: new Date().toISOString()
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
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