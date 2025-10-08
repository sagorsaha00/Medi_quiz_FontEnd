import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
 
 import { BACKENDURL } from "../config/config";
import {  StatusBar } from "react-native";
import { io, Socket } from "socket.io-client";
export default function RootLayout() {

// useEffect(() => {
//   console.log("🔄 Connecting to:", BACKENDURL);
  
//   const socket: Socket = io(BACKENDURL, {
//     transports: ["websocket", "polling"], // polling fallback যোগ করুন
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     timeout: 20000,
//   });

//   socket.on("connect", () => {
//     console.log("✅ Connected to server:", socket.id);
//   });

//   socket.on("connect_error", (err) => {
//     console.error("❌ Connection error:", err.message);
//     console.error("Error type:", err.type);
//     console.error("Description:", err.description);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("❌ Disconnected. Reason:", reason);
//   });

//   return () => {
//     socket.disconnect();
//   };
// }, []);

 
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
  

  // ✅ সব hooks এর পরে logic/comments
  // const colorScheme = useColorScheme();
  // const { hydrateUser, updateActivity, checkInactivity } = useAuthStore();
  // useAutoRefresh();

  // ⚠️ যদি এই useEffect টা enable করতে চান:
  // useEffect(() => {
  //   hydrateUser();
  //   const interval = setInterval(() => {
  //     checkInactivity();
  //   }, 60 * 1000);
  //   return () => clearInterval(interval);
  // }, []);

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