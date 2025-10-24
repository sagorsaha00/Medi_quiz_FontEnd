import { useAuthStore } from '@/utils/details'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import Toast from 'react-native-toast-message'
import { useAutoRefresh } from '../auth/autoRefreshToken'

export default function RootLayout() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: 2, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
                    mutations: { retry: 1 },
                },
            })
    )

    const { hydrateUser, updateActivity, checkInactivity } = useAuthStore()
    useAutoRefresh()

    useEffect(() => {
        hydrateUser()
        updateActivity()
        const interval = setInterval(() => checkInactivity(), 60 * 1000)
        return () => clearInterval(interval)
    }, [hydrateUser, updateActivity, checkInactivity])

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={DarkTheme}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                {/* Slot renders child routes */}
                <Slot />
                <Toast />
            </ThemeProvider>
        </QueryClientProvider>
    )
}
