import { BACKENDURL } from "@/config/config";
import { FormValues } from "@/utils/Schma";
import { saveTokens } from "@/utils/tokenTopic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const UserRegister = () =>
  useMutation({
    mutationKey: ["register"],
    mutationFn: async (userData: FormValues) => {
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

export const GetUserInfo = () => {
  return useMutation({
    mutationKey: ["GetUserInfo"],
    mutationFn: async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("accessToken", accessToken);
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(`${BACKENDURL}/auth/selfData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      console.log("✅ User data fetched:", data.user.firstName);
      return data;
    },
  });
};
