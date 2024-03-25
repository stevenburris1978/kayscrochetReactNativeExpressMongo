// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token); // Saving token to local storage
      setUserToken(token);
      setIsAuthenticated(true);
      // Additional logic for handling successful sign in (if needed)
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle errors (like showing an alert or a message to the user)
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Removing token from local storage
      setUserToken(null);
      setIsAuthenticated(false);
      // Additional logic for handling sign out (if needed)
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors (like showing an alert or a message to the user)
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);