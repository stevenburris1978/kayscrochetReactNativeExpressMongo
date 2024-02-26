import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';

const AdminScreen = () => {
  const [notification, setNotification] = useState('');

  const handleSubmitNotification = () => {
    // handle submitting notification
    Alert.alert('Notification Submitted', notification);
    setNotification('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[styles.policyContainer, styles.screenBackground]} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={[styles.screenBackground, styles.adminContainer]}>
          <Text style={styles.screenTitle}>ADMIN</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setNotification}
            value={notification}
            placeholder="Enter Notification"
            placeholderTextColor="hsl(270, 50%, 60%)"
            keyboardType="default"
          />
          <TouchableOpacity onPress={handleSubmitNotification} style={styles.buttonContainer}>
            <Text style={styles.submitButton}>SEND</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  adminContainer: {
    flex: 1,
    backgroundColor: '#F7E7F8',
    justifyContent: 'top',
    paddingHorizontal: 10,
  },
  textInput: {
    fontSize: 16,
    margin: 5,
    color: 'hsl(270, 50%, 60%)',
    backgroundColor: '#FFF0F5',
    borderRadius: 25,
    textAlign: 'center',
    padding: 10,
  },
  submitButton: {
    color: 'hsl(270, 50%, 60%)',
    
  },
  screenBackground: {
    backgroundColor: '#F7E7F8',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'hsl(270, 50%, 60%)',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  policyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    paddingBottom: 30,
  },
  screenBackground: {
    backgroundColor: '#F7E7F8',
  },
  buttonContainer: {
    borderRadius: 25,
    backgroundColor: '#FFF0F5',
    alignSelf: 'center',
    margin: 5,
    padding: 10,
  },
});

export default AdminScreen;
