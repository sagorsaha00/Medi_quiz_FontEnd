import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken)
    await AsyncStorage.setItem('refreshToken', refreshToken)
}

export const getAccessToken = async () => {
    const token = await AsyncStorage.getItem('accessToken')

    return token
}

export const getRefreshToken = async () => {
    const token = await AsyncStorage.getItem('refreshToken')

    return token
}

export const clearTokens = async () => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
}
