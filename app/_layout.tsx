import { useAuthStore } from '@/utils/details';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar } from "react-native";
import { useAutoRefresh } from '../auth/autoRefreshToken';
export default function RootLayout() {

 

 
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );
  

 
 
  const { hydrateUser, updateActivity, checkInactivity } = useAuthStore();


     useAutoRefresh();
  useEffect(() => {
  
    hydrateUser();
    updateActivity();
    const interval = setInterval(() => {
      checkInactivity();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkInactivity, hydrateUser, updateActivity]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        >
         
         
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />
        </Stack>
      </ThemeProvider>
      
    </QueryClientProvider>
  );
}