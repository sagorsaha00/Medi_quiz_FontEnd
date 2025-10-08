import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const user = {
    username: 'Sagor Saha',
    email: 'artimas@example.com',
    password: 'mypassword123',
    profilePic: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  return (
<>
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient colors={['#4F46E5', '#6D28D9']} style={styles.header}>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      {/* Info Cards */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={22} color="#4F46E5" />
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#4F46E5" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="lock-closed-outline" size={22} color="#4F46E5" />
          <Text style={styles.label}>Password:</Text>
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

      {/* Action Buttons */}
      <View style={{ marginTop: 20 }}>
        {[
          { icon: 'create-outline', text: 'Edit Profile', color: '#4F46E5' },
          {
            icon: 'stats-chart-outline',
            text: 'My Quiz Results',
            color: '#10B981',
          },
          { icon: 'settings-outline', text: 'Settings', color: '#F59E0B' },
          { icon: 'log-out-outline', text: 'Logout', color: '#EF4444' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
              marginBottom: 12,
              elevation: 3, // for Android shadow
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                backgroundColor: item.color,
                padding: 8,
                borderRadius: 50,
                marginRight: 12,
              }}
            >
              <Ionicons   size={20} color="#fff" />
            </View>

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: '500',
                color: '#111',
              }}
            >
              {item.text}
            </Text>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar barStyle={'light-content'} />
    </View>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  value: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
