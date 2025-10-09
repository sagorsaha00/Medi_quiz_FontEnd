import { BACKENDURL } from "@/config/config";
import { saveTokens } from "@/utils/tokenTopic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const UserRegister = () =>
  useMutation({
    mutationKey: ["register"],
    mutationFn: async (userData) => {
      const response = await axios.post(
        `${BACKENDURL}/auth/createUser`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      const { accessToken, refreshToken } = response.data.tokens;

      if (!accessToken || !refreshToken) {
        throw new Error("❌ Tokens missing in response");
      }

      saveTokens(accessToken, refreshToken);

      return response.data.user;
    },
  });

export const useUserLogin = () =>
  useMutation({
    mutationKey: ["login"],
    mutationFn: async (userData: { email: string; password: string }) => {
      const response = await axios.post(
        `${BACKENDURL}/auth/loginUser`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      const { accessToken, refreshToken } = response.data.tokens;
      console.log("accessToken", accessToken, " refreshToken", refreshToken);

      if (!accessToken || !refreshToken) {
        throw new Error("❌ Tokens missing in response");
      }

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      return response.data.user;
    },
  });
