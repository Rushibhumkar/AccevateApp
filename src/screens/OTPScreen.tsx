import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

export default function OTPScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    const wasEmpty = newOtp[index] === '';
    
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    } else if (!text && wasEmpty && index > 0) {
     inputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      setTimeout(() => {
        if (otp[index] === '' && index > 0) {
          inputs.current[index - 1]?.focus();
        }
      }, 10);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit OTP');
      return;
    }

    try {
      const res = await api.post('/verify_otp.php', {
        userid: userId,
        otp: otpValue,
      });

      if (res.data?.status === true && res.data?.token) {
        await AsyncStorage.setItem('token', res.data.token);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Invalid OTP', res.data?.msg || 'Try again');
        setOtp(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

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
          <View style={styles.card}>
            <Text style={styles.title}>OTP Verification 🔐</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your number
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref!)}
                  style={[
                    styles.otpBox,
                    value && styles.otpBoxFilled,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  textAlign="center"
                  selectTextOnFocus={true} 
                  />
              ))}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={verifyOtp}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>VERIFY OTP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 36,
    fontSize: 14,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
    paddingHorizontal: 8,
    gap: 5,
  },
  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#f7f8fa',
    borderWidth: 2,
    borderColor: '#e4e6eb',
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: '#d71920',
    backgroundColor: '#fff',
    shadowOpacity: 0.1,
  },
  button: {
    backgroundColor: '#d71920',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
