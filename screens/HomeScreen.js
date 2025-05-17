import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  const handleNavigation = () => {
    if (!username.trim()) return;
    navigation.navigate('Chat', { username: username.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={styles.container}>
        <View style={styles.inset}>
          <Text style={styles.title}>Make new friends with ChatApp</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleNavigation} style={styles.button}>
            <Text style={styles.buttonText}>Enter Chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inset: {
    width: '100%',
    height: '40%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'rgba(13, 8, 9, 0.9)',
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopColor: '#ffe099',
    borderLeftColor: '#ffe099',
    borderRightColor: '#ffe099',
    borderTopWidth: 4,
    borderRightWidth: 0.1,
    borderLeftWidth: 0.1
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 14,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffe099',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#211417',
  },
});
