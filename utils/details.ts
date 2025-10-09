import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
// import { AppState } from 'react-native';
import { create } from 'zustand';
import { clearTokens } from './tokenTopic';
interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  lastActive: number;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  hydrateUser: () => Promise<void>;
  updateActivity: () => void;
  checkInactivity: () => void;
}
const INACTIVITY_LIMIT = 3 * 60 * 1000; // 5 min
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  lastActive: Date.now(),
  setUser: async (user: User) => {
    console.log('user data set in store UserAuthStore', user);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (e) {
      console.log('❌ AsyncStorage set error:', e);
    }
  },
  hydrateUser: async () => {
    const raw = await AsyncStorage.getItem('user');
    console.log("details file user data from async storage",raw);
    if (raw) {
      set({ user: JSON.parse(raw), lastActive: Date.now() });
    }
    if(!raw){
      Toast.show({
        type: 'error',
        text1: 'Session Expired! Please login again.',
        position: 'bottom',
      });
      router.replace('/(login)/login');
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      clearTokens()
      set({ user: null });
      router.replace('/(login)/login');
    } catch (e) {
      console.log('❌ AsyncStorage remove error:', e);
    }
  },
  updateActivity: () => {
    set({ lastActive: Date.now() });
  },

  checkInactivity: () => {
    const { lastActive, logout, user } = get();
    console.log('actyvity call');
    if (user && Date.now() - lastActive > INACTIVITY_LIMIT) {
      logout();
    }
  },
}));
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     useAuthStore.getState().checkInactivity();
//   }
// });
