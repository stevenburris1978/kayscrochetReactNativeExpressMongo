import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to fetch token', e);
      }
    };
  
    initializeAuth();
  }, []);
  

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Saving token failed', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
      setUserToken(null);
    } catch (e) {
      console.error('Removing token failed', e);
    }
  };

  console.log({ isAuthenticated, userToken, signIn, logout });


  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
