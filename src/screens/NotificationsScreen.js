import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';

function NotificationsScreen() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={[styles.policyContainer, styles.screenBackground]} contentContainerStyle={{ paddingBottom: 30 }}>
          <Text style={styles.screenTitle}>Notifications:</Text>
          
        </ScrollView>
      </SafeAreaView>
    );
  }
  

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
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
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'hsl(270, 50%, 60%)',
    marginBottom: 10,
    marginTop: -7,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'hsl(270, 50%, 60%)'
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
    color: 'hsl(270, 50%, 60%)'
  },

});

export default NotificationsScreen;
