import { BACKENDURL } from '@/config/config'
import { FormValues } from '@/utils/Schma'
import { saveTokens } from '@/utils/tokenTopic'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const UserRegister = () =>
    useMutation({
        mutationKey: ['register'],
        mutationFn: async (userData: FormValues) => {
            const response = await axios.post(
                `${BACKENDURL}/auth/createUser`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    timeout: 10000,
                }
            )

            const { accessToken, refreshToken } = response.data.tokens

            if (!accessToken || !refreshToken) {
                throw new Error('❌ Tokens missing in response')
            }

            saveTokens(accessToken, refreshToken)

            return response.data.user
        },
    })

export const useUserLogin = () =>
    useMutation({
        mutationKey: ['login'],
        mutationFn: async (userData: { email: string; password: string }) => {
            const response = await axios.post(
                `${BACKENDURL}/auth/loginUser`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    timeout: 10000,
                }
            )

            const { accessToken, refreshToken } = response.data.tokens
            console.log(
                'accessToken',
                accessToken,
                ' refreshToken',
                refreshToken
            )

            if (!accessToken || !refreshToken) {
                throw new Error('❌ Tokens missing in response')
            }

            await AsyncStorage.setItem('accessToken', accessToken)
            await AsyncStorage.setItem('refreshToken', refreshToken)

            return response.data.user
        },
    })

// export const GetUserInfo = () => {
//   return useMutation({
//     mutationKey: ["GetUserInfo"],
//     mutationFn: async () => {
//       const refreshToken = await getRefreshToken();
//       console.log("profile accessToken", refreshToken);
//       if (!refreshToken) throw new Error("No access token found");

//       const response = await axios.get(`${BACKENDURL}/auth/selfData`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${refreshToken}`,
//         },
//       });

//       const data = response.data;

//       console.log("✅ User data fetched:", data.user.firstName);
//       return data;
//     },
//   });
// };
