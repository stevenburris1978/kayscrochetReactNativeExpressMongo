import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AdminLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'kay' && password === 'Password1018!') {
      navigation.navigate('AdminScreen');
    } else {
      setError('Incorrect username or password');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (

    <View style={[styles.screenBackground, styles.adminLoginContainer]}>
      <Text style={styles.screenTitle}>ADMIN</Text>
      <TextInput
        style={styles.textadmin}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
        placeholderTextColor="hsl(270, 50%, 60%)"
        keyboardType="default"
      />
      <TextInput
        style={styles.textadmin}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        placeholderTextColor="hsl(270, 50%, 60%)"
        secureTextEntry
      />
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer}>
        <Text style={styles.textemail}>
          LOGIN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  adminLoginContainer: {
    flex: 1,
    backgroundColor: '#F7E7F8',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  textadmin: {
    fontSize: 16,
    margin: 5,
    color: 'hsl(270, 50%, 60%)',
    backgroundColor: '#FFF0F5',
    borderRadius: 25,
    textAlign: 'center',
    padding: 10
  },
  errorText: {
    fontSize: 14,
    margin: 5,
    color: 'hsl(270, 50%, 60%)'
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'hsl(270, 50%, 60%)',
    textAlign: 'center',
    marginBottom: 40,
  },
  textemail: {
    color: 'hsl(270, 50%, 60%)',
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

export default AdminLoginScreen;
