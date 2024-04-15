import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';
import PoliciesScreen from './screens/PoliciesScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminScreen from './screens/AdminScreen';
import NotificationsScreen from './screens/NotificationsScreen';

import CustomDrawerContent from './components/CustomDrawerContent';
import CustomHeader from './components/CustomHeader';
import CustomScreenHeader from './components/CustomScreenHeader';

import { useAuth } from './context/AuthContext';

// this is for the drawer navigation of each screen
const Drawer = createDrawerNavigator();

const Navigation = () => {

const { isAuthenticated } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: 'hsl(270, 50%, 60%)',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerTitle: () => <View style={{ height: 0 }} />,
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon name="arrow-back" size={24} color="hsl(270, 50%, 60%)" />
              <Text style={{ color: "hsl(270, 50%, 60%)", fontSize: 20, paddingHorizontal: 20}}>KAY'S CROCHET</Text>
              <View style={{ flex: 1 }}></View>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F7E7F8',
          },
          headerRight: () => <CustomHeader />,
        }}
      />
      <Drawer.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{
          headerTitle: () => <CustomScreenHeader title="KAY'S CROCHET" showBack={true} />, 
          drawerLabel: () => (
            <Text style={{ color: "hsl(270, 50%, 60%)", fontSize: 18 }}>
                CONTACT
            </Text>
          ),
          headerStyle: {
            backgroundColor: '#F8D7DA',
          },
        }}
      />
      <Drawer.Screen 
        name="Policies" 
        component={PoliciesScreen}
        options={{
          headerTitle: () => <CustomScreenHeader title="KAY'S CROCHET" showBack={true}/>, 
          drawerLabel: () => (
            <Text style={{ color: "hsl(270, 50%, 60%)", fontSize: 18 }}>
                POLICY
            </Text>
          ),
          headerStyle: {
            backgroundColor: '#F8D7DA',
          },
        }}
      />
      <Drawer.Screen 
        name="AdminLogin" 
        component={AdminLoginScreen} 
        options={{ 
          headerTitle: () => <CustomScreenHeader title="Kay's Crochet" showBack={true} />,
          drawerItemStyle: { height: 0 },
          headerStyle: {
            backgroundColor: '#F8D7DA',
          },
        }}
      />
      {isAuthenticated && (
        <Drawer.Screen 
          name="AdminScreen" 
          component={AdminScreen} 
          options={{ 
            headerTitle: () => <CustomScreenHeader title="Kay's Crochet" showBack={true} />,
            drawerItemStyle: { height: 0 },
            headerStyle: {
              backgroundColor: '#F8D7DA',
            },
          }}
        />
      )}
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          headerTitle: () => <CustomScreenHeader title="KAY'S CROCHET" showBack={true} />,
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="notifications-active" size={30} color="hsl(270, 50%, 60%)" />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F8D7DA',
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default Navigation;
