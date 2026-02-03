import React, { createRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard, 
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Logo from '../assets/Logo.svg';
import { api } from '../api/api';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
       }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {

      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

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
    <LinearGradient colors={['#f9fafc', '#eef1f7']} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false} 
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
              style={styles.input}
              placeholder="User ID"
              placeholderTextColor="#605d5dff"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()} 
              blurOnSubmit={false}
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                ref={passwordInputRef}  
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#070707ff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={onLogin}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeText}>
                  {showPassword ? '🙈' : '👁'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const passwordInputRef = createRef<TextInput>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40, 
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e4e6eb',
    marginBottom: 18,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 18,
    fontSize: 15,
    color:'black'
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  eyeText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#d71920',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
