// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  // save token for use with hashed password for user sign in
  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); 
      setUserToken(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Error during sign-out:', error);
      
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);