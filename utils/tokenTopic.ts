import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  console.log('Tokens saved successfully token.ts utils', accessToken, refreshToken);
};

export const getAccessToken = async () =>
  await AsyncStorage.getItem('accessToken');
export const getRefreshToken = async () =>
  await AsyncStorage.getItem('refreshToken');

export const clearTokens = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};
