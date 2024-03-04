import React from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation';
import { AuthProvider } from './context/AuthContext'; 

const App = () => {

  useEffect(() => {
    registerForPushNotificationsAsync();
    setupNotificationListeners();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('No notification permissions!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);

      // Send the token to your backend for storage
      sendPushTokenToBackend(token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  };

  const sendPushTokenToBackend = async (token) => {
    const response = await fetch('http://<your-backend-url>/save-push-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  
    if (!response.ok) {
      console.error('Failed to send token to backend');
    }
  };

  const setupNotificationListeners = () => {
    Notifications.addNotificationReceivedListener(handleNotificationReceived);
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  };

  const handleNotificationReceived = notification => {
    console.log('Notification Received:', notification);
    // Handle notification received when app is open (foreground)
  };

  const handleNotificationResponse = response => {
    console.log('Notification Response:', response);
    // Handle notification response (user interaction)
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
