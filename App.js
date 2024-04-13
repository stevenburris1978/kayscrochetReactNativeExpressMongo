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

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return;
    }

    try {
        const { status: initialStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = initialStatus;

        if (initialStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push token:', token);

        return sendPushTokenToBackend(token);
    } catch (error) {
        console.error('Error getting a push token', error);
    }
}

async function sendPushTokenToBackend(token) {
    const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/save-push-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        console.error('Failed to send token to backend:', response);
    } else {
        console.log('Token saved to backend successfully.');
    }
}

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