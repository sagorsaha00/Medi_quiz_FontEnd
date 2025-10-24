import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

import { useAuthStore } from '../../utils/details'
import { getRefreshToken } from '@/utils/tokenTopic'
import axios from 'axios'
import { BACKENDURL } from '@/config/config'
import { useMutation } from '@tanstack/react-query'

// ✅ GetUserInfo Hook
export const GetUserInfo = () => {
    return useMutation({
        mutationKey: ['GetUserInfo'],
        mutationFn: async () => {
            const accessToken = await getRefreshToken()
            console.log('profile accessToken', accessToken)

            if (!accessToken) throw new Error('No access token found')

            // ✅ axios.get() এ method লাগবে না
            const response = await axios.get(`${BACKENDURL}/auth/selfData`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            const data = response.data
             
            return data
        },
    })
}

export default function ProfileScreen() {
    const { logout } = useAuthStore()

    
    const { mutate, data, isPending, isError, error } = GetUserInfo()
 
    useEffect(() => {
        mutate()  
    }, [])

     

    // ✅ Loading State
    if (isPending) {
        return (
            <LinearGradient
                colors={['#4F46E5', '#7C3AED', '#9333EA']}
                style={styles.centered}
            >
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 10 }}>
                    Loading user info...
                </Text>
            </LinearGradient>
        )
    }

    // ✅ Error State
    if (isError) {
        return (
            <LinearGradient
                colors={['#4F46E5', '#7C3AED', '#9333EA']}
                style={styles.centered}
            >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 16,
                        textAlign: 'center',
                        paddingHorizontal: 20,
                    }}
                >
                    ⚠️ {error?.message || 'Failed to load user info'}
                </Text>
                <TouchableOpacity
                    onPress={() => mutate()} // ✅ mutate() call করুন
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 15,
                    }}
                >
                    <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }

    // ✅ Check if data exists
    if (!data || !data.user) {
        return (
            <LinearGradient
                colors={['#4F46E5', '#7C3AED', '#9333EA']}
                style={styles.centered}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>
                    No user data available
                </Text>
                <TouchableOpacity
                    onPress={() => mutate()} // ✅ mutate() call করুন
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 15,
                    }}
                >
                    <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }

   const user = data.user
  

    // ✅ Logout Confirmation
    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    logout()
                    router.replace('/login')
                },
            },
        ])
    }

    return (
        <LinearGradient
            colors={['#4F46E5', '#7C3AED', '#9333EA']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{
                        uri: user.avatar || 'https://via.placeholder.com/120',
                    }}
                    style={styles.profilePic}
                />
                <Text style={styles.name}>
                    {user.firstName || 'User'} {user.lastName || ''}
                </Text>
                <Text style={styles.email}>{user.email || 'No email'}</Text>
            </View>

            {/* Info Card */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <Ionicons name="person-outline" size={22} color="#6366F1" />
                    <Text style={styles.label}>Username</Text>
                    <Text style={styles.value}>{user.username || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Ionicons name="mail-outline" size={22} color="#6366F1" />
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#6366F1"
                    />
                    <Text style={styles.label}>Joined</Text>
                    <Text style={styles.value}>
                        {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Menu Buttons */}
            <View style={styles.menuContainer}>
                <MenuButton
                    title="My Quiz Results"
                    icon="stats-chart-outline"
                    color="#10B981"
                    onPress={() => router.push('/(extra)/QuizHistoryScreen')}
                />
                <MenuButton
                    title="Logout"
                    icon="log-out-outline"
                    color="#EF4444"
                    onPress={handleLogout}
                />
            </View>
        </LinearGradient>
    )
}

// ✅ Menu Button Component
function MenuButton({ title, icon, color, onPress }: any) {
    return (
        <TouchableOpacity
            style={styles.menuButton}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <Ionicons name={icon} size={22} color="#fff" />
            </View>
            <Text style={styles.menuText}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    )
}

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
})
