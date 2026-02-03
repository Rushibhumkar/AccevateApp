import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {api} from '../api/api';

const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const Bubble = ({style, color}: any) => (
  <View style={[styles.bubble, style, {backgroundColor: color}]} />
);

export default function DashboardScreen({navigation}: any) {
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState('#e0e0e0');
  const [message, setMessage] = useState('Welcome');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) return navigation.replace('Login');

      const res = await api.get('/dashboard.php', {
        headers: {Authorization: `Bearer ${token}`},
        params: {t: Date.now()},
      });

      if (res.data?.status) {
        setBgColor(randomColor());
        setMessage(res.data.message || 'Welcome');
      } else {
        Alert.alert('Error', res.data?.msg);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    fetchDashboard(); 
  }, [])
);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  return (
    <View style={[styles.container, {backgroundColor: bgColor + '20'}]}>
      {/* Bubbles */}
      <Bubble style={styles.b1} color={bgColor} />
      <Bubble style={styles.b2} color={bgColor} />
      <Bubble style={styles.b3} color={bgColor} />

      {loading ? (
        <ActivityIndicator size="large" color={bgColor} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.row}>
            <View style={[styles.dot, {backgroundColor: bgColor}]} />
            <Text style={styles.label}>Dynamic Theme</Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, {backgroundColor: bgColor}]}
            onPress={fetchDashboard}>
            <Text style={styles.btnText}>REFRESH COLOR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},

  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  b1: {width: 180, height: 180, top: -40, left: -60},
  b2: {width: 120, height: 120, top: 120, right: -40},
  b3: {width: 220, height: 220, bottom: -80, right: -90},

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },

  welcome: {color: '#888', fontSize: 14},
  title: {fontSize: 26, fontWeight: '800', marginBottom: 10},
  message: {fontSize: 16, color: '#444', marginBottom: 24},

  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 24},
  dot: {width: 16, height: 16, borderRadius: 8, marginRight: 10},
  label: {fontWeight: '600', color: '#444'},

  btn: {padding: 16, borderRadius: 16, alignItems: 'center'},
  btnText: {color: '#fff', fontWeight: '700'},

  logout: {
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  logoutText: {color: '#d71920', fontWeight: '700'},
});
