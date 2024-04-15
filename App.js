import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function handleRegistrationError(errorMessage) {
  alert(errorMessage); 
  console.error(errorMessage); 
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Current permission status:', existingStatus); 
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('New permission status after request:', finalStatus); 
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Failed to get push token for push notification!');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log('Push token received:', token.data); 
      return token.data;
    } catch (error) {
      console.error('Error getting a push token:', error);
      handleRegistrationError(`Error getting a push token: ${error}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
};

async function sendPushTokenToBackend(token) {
  try {
    const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/save-push-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const responseBody = await response.text(); 

    if (!response.ok) {
      console.error('Failed to send token to backend:', responseBody); 
      throw new Error(`Failed to save token: ${responseBody}`);
    } else {
      console.log('Token saved to backend successfully:', responseBody);
    }
  } catch (error) {
    console.error('Error sending push token to backend:', error);
  }
}

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      sendPushTokenToBackend(token); 
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
