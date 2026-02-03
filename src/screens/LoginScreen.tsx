import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../assets/Logo.svg';
import { api } from '../api/api';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter UserID and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/login.php', {
        userid: username,
        password,
      });

      if (res.data?.status === true && res.data?.userid) {
        navigation.navigate('OTP', { userId: res.data.userid });
      } else {
        Alert.alert('Login failed', res.data?.msg || 'Invalid credentials');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f9fafc', '#eef1f7']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Logo width={160} height={70} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          Login to your Accevate account
        </Text>

        <TextInput
          placeholder="User ID"
          placeholderTextColor="#999"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 26,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
    marginBottom: 6,
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 28,
    fontSize: 14,
  },

  input: {
    backgroundColor: '#f7f8fa',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e4e6eb',
  },

  button: {
    backgroundColor: '#d71920',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
