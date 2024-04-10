import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation';
import { AuthProvider } from './src/context/AuthContext'; 
import { TaskProvider } from './src/context/TaskContext';
import * as Device from 'expo-device';

// Define isPortrait for orientation
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const App = () => {

  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape');

  const handleOrientationChange = () => {
    setOrientation(isPortrait() ? 'portrait' : 'landscape');
  };

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

      sendPushTokenToBackend(token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  };

  const sendPushTokenToBackend = async (token) => {
    const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/save-push-token', {
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

  useEffect(() => {

    (async () => {
      await registerForPushNotificationsAsync();
      setupNotificationListeners();
    })();

    const subscription = Dimensions.addEventListener('change', () => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape');
    });

    return () => subscription?.remove();

  }, []);

  return (
    <AuthProvider>
      <TaskProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;