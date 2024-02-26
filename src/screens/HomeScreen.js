import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F7E7F8" barStyle="dark-content" />
      <WebView 
        source={{ uri: 'https://www.kayscrochet.us' }} 
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff'
    },
    webview: {
      flex: 1,
      width: '100%',
      height: '100%',
      marginTop: -3,
    },
  });
  

export default HomeScreen;
