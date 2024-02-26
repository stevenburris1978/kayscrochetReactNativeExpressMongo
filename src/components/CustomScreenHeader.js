import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const CustomScreenHeader = ({ title, showBack }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    
    navigation.navigate('Home');
  };

  return (
      
      <TouchableOpacity onPress={handleBackPress} style={styles.headerContainer}>
        {showBack && (
          <Icon name="arrow-back" size={24} color="hsl(270, 50%, 60%)" />
        )}
        <Text style={styles.headerText}>{title}</Text>

      

      </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7E7F8',
    justifyContent: 'center',
    marginLeft: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'hsl(270, 50%, 60%)',
    marginLeft: 3,
  },

});

export default CustomScreenHeader;



