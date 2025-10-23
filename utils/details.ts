import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import { create } from 'zustand'
import { clearTokens } from './tokenTopic'

interface User {
    email: string
}

interface AuthState {
    user: User | null
    lastActive: number
    setUser: (user: User) => Promise<void>
    logout: () => Promise<void>
    hydrateUser: () => Promise<void>
    updateActivity: () => void
    checkInactivity: () => void
}

const INACTIVITY_LIMIT = 5 * 60 * 1000

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    lastActive: Date.now(),

    setUser: async (user: User) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            console.log('user saved to AsyncStorage', user)
            set({ user, lastActive: Date.now() })
            console.log('user save in store', user)
        } catch (e) {
            console.log('❌ AsyncStorage set error:', e)
        }
    },

    hydrateUser: async () => {
        try {
            const raw = await AsyncStorage.getItem('user')
            if (raw) {
                const parsedUser = JSON.parse(raw)
                set({ user: parsedUser, lastActive: Date.now() })
                console.log('✅ Hydrated user:', parsedUser)
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Session expired. Please login again.',
                    position: 'bottom',
                })
            }
        } catch (e) {
            console.log('❌ Hydration error:', e)
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('user')
            clearTokens()
            set({ user: null })
            Toast.show({
                type: 'success',
                text1: 'Logged out successfully!',
                position: 'bottom',
            })
            router.replace('/(login)/login')
        } catch (e) {
            console.log('❌ Logout error:', e)
        }
    },

    updateActivity: () => {
        set({ lastActive: Date.now() })
    },

    checkInactivity: () => {
        const { lastActive, logout, user } = get()
        if (user && Date.now() - lastActive > INACTIVITY_LIMIT) {
            console.log('⏰ User inactive for too long — logging out...')
            logout()
        }
    },
}))
