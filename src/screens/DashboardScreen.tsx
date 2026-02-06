import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/api';

const Bubble = ({ style, color }: any) => (
  <View style={[styles.bubble, style, { backgroundColor: color }]} />
);

export default function DashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState('#e0e0e0');
  const [message, setMessage] = useState('Welcome');
  const [user, setUser] = useState<any>(null);
  const [carousel, setCarousel] = useState<string[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [amount, setAmount] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) return navigation.replace('Login');

      const res = await api.get('/dashboard.php', {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() },
      });

      if (res.data?.status) {
        const data = res.data;

        setMessage(data.msg || 'Welcome');
        setUser(data.user);

        const dash = data.dashboard;
        setCarousel(dash?.carousel || []);
        setStudent(dash?.student || null);
        setAmount(dash?.amount || null);

        const apiColor = dash?.color?.dynamic_color;
        if (apiColor) {
          setBgColor(apiColor);
        }
      } else {
        Alert.alert('Error', res.data?.msg || 'Failed to load dashboard');
      }
    } catch (e) {
      console.log(e);
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
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor + '20' }]}>
      {/* Decorative bubbles */}
      <Bubble style={styles.b1} color={bgColor} />
      <Bubble style={styles.b2} color={bgColor} />
      <Bubble style={styles.b3} color={bgColor} />
      {loading ? (
        <ActivityIndicator size="large" color={bgColor} />
      ) : (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Welcome 👋 {user?.name || ''}</Text>
              <Text style={styles.title}>Dashboard</Text>
            </View>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={fetchDashboard}
              activeOpacity={0.7}
            >
              <Text style={[styles.refreshIcon, { color: bgColor }]}>⟳</Text>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View style={styles.infoRow}>
            {student && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Students</Text>
                <Text style={styles.infoValue}>👦 {student.Boy}</Text>
                <Text style={styles.infoValue}>👧 {student.Girl}</Text>
              </View>
            )}

            {amount && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Fees</Text>
                <Text style={styles.infoValue}>💰 ₹{amount.Total}</Text>
                <Text style={styles.infoSub}>Paid: ₹{amount.Paid}</Text>
                <Text style={styles.infoSub}>Due: ₹{amount.due}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },

  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  b1: { width: 180, height: 180, top: -40, left: -60 },
  b2: { width: 120, height: 120, top: 120, right: -40 },
  b3: { width: 220, height: 220, bottom: -80, right: -90 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },

  welcome: { color: '#888', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  message: { fontSize: 16, color: '#444', marginBottom: 16 },

  section: { marginBottom: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 6, color: '#333' },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dot: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  label: { fontWeight: '600', color: '#444' },

  btn: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: { color: '#fff', fontWeight: '700' },

  btnOutline: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  btnOutlineText: { fontWeight: '700' },

  logout: {
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  logoutText: { color: '#d71920', fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    borderRadius: 16,
    padding: 14,
    elevation: 3,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
  },

  infoSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  primaryBtn: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  refreshBtn: {
    padding: 6,
  },

  refreshIcon: {
    fontSize: 26,
    fontWeight: '800',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

});
