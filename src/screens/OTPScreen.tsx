import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../api/api';

export default function OTPScreen({route, navigation}: any) {
  const {userId} = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
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
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient
      colors={['#f9fafc', '#eef1f7']}
      style={styles.container}
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
              ref={ref => (inputs.current[index] = ref!)}
              style={[
                styles.otpBox,
                value && styles.otpBoxFilled,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={text => handleChange(text, index)}
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
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },

  title: {
    fontSize: 22,
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

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },

  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f7f8fa',
    borderWidth: 1,
    borderColor: '#e4e6eb',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },

  otpBoxFilled: {
    borderColor: '#d71920',
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#d71920',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
