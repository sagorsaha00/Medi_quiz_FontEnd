import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { BACKENDURL } from "../config/config";
import { useAuthStore } from "../utils/details";
import { clearTokens, getRefreshToken, saveTokens } from "../utils/tokenTopic";
export const useAutoRefresh = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!user) return;

        // ✅ Await to get the actual token string
        const refreshToken = await getRefreshToken();
        console.log("🟡 Retrieved refresh token:", refreshToken);

        if (!refreshToken) {
          throw new Error("No refresh token found in storage");
        }

        let res;
        try {
          res = await axios.post(`${BACKENDURL}/auth/refresh`, {
            refreshToken: refreshToken,
          });
        } catch (err) {
          console.log("❌ Token refresh failed:", err.response?.status);
          console.log("Response:", err.response?.data);
          throw new Error("Token refresh failed");
        }

        if (!res?.data) {
          throw new Error("No response data from server");
        }

        const { accessToken, refreshToken: newRefreshToken } = res.data.tokens;
        console.log("✅ Tokens refreshed:", newRefreshToken);

        if (!accessToken || !newRefreshToken) {
          throw new Error("Tokens missing in response");
        }
        await clearTokens();
        await saveTokens(accessToken, newRefreshToken);
        console.log("✅ Tokens saved successfully");
      } catch (err) {
        console.error("❌ Auto token refresh failed:", err?.message);

        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please sign in again.",
        });

        await AsyncStorage.removeItem("user");
        await clearTokens();
        logout(); // ✅ Zustand থেকে নেওয়া logout
      }
    }, 1 * 60 * 1000); // প্রতি ৫ মিনিটে টোকেন রিফ্রেশ

    return () => clearInterval(interval);
  }, [user]);
};
