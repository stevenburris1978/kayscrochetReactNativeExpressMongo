import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

// Add A notifications screen link on the home screen navigator header
const CustomHeader = () => {
  const navigation = useNavigation();

  const handleNotificationsPress = () => {
    
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNotificationsPress}>
        <View style={styles.notificationContainer}>
          <Icon name="notifications-active" size={30} color="hsl(270, 50%, 60%)" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomHeader;
