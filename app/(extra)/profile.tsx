import React, { useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../utils/details';

export default function ProfileScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { logout } = useAuthStore();

  const user = {
    username: 'Sagor Saha',
    email: 'artimas@example.com',
    password: 'mypassword123',
    profilePic: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  const handleEditProfile = () => {};
  const handleQuizResult = () => {};
  const handleSettings = () => {};
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED', '#9333EA']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#6366F1" />
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#6366F1" />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="lock-closed-outline" size={22} color="#6366F1" />
          <Text style={styles.label}>Password</Text>
          <Text style={styles.value}>
            {showPassword ? user.password : '••••••••'}
          </Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menuContainer}>
        <MenuButton
          title="Edit Profile"
          icon="create-outline"
          color="#6366F1"
          onPress={handleEditProfile}
        />
        <MenuButton
          title="My Quiz Results"
          icon="stats-chart-outline"
          color="#10B981"
          onPress={handleQuizResult}
        />
        <MenuButton
          title="Settings"
          icon="settings-outline"
          color="#F59E0B"
          onPress={handleSettings}
        />
        <MenuButton
          title="Logout"
          icon="log-out-outline"
          color="#EF4444"
          onPress={handleLogout}
        />
      </View>
    </LinearGradient>
  );
}

/* -------------------- Reusable Menu Button -------------------- */
interface MenuButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

function MenuButton({ title, icon, color, onPress }: MenuButtonProps) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuContainer: {
    marginTop: 5,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
