import { BACKENDURL } from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { logout } from "../utils/details";
import { clearTokens, getRefreshToken, saveTokens } from "../utils/tokenTopic";

export const useAutoRefresh = () => {
  const [userExists, setUserExists] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      console.log("⏳ Checking user for token refresh");
      const storedUser = await AsyncStorage.getItem("user");
      setUserExists(!!storedUser);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!userExists) return;

    const interval = setInterval(async () => {
      try {
        const currentUser = await AsyncStorage.getItem("user");
        console.log("⏳ Checking user for token refresh:", currentUser);
        if (!currentUser) {
          console.log("⚠️ User no longer exists, stopping auto-refresh");
          setUserExists(false);
          return;
        }

        const refreshToken = getRefreshToken();
        console.log("refreshToken", refreshToken);

        if (!refreshToken) {
          console.log("⚠️ Refresh token not found.");
          throw new Error("Refresh token missing");
        }

        const res = await axios.post(`${BACKENDURL}/auth/refresh`, {
          refreshToken,
        });
        console.log("🔄 Token refresh response:", refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = res.data.tokens;
        console.log("accessToken", accessToken, "newRefreshToken", newRefreshToken);

        if (!accessToken || !newRefreshToken) {
          throw new Error("Tokens missing in response");
        }

        await saveTokens(accessToken, newRefreshToken);
        console.log("✅ Access token refreshed successfully");
      } catch (err) {
        console.error("❌ Auto token refresh failed:", err?.message);

        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please sign in again.",
        });

        await AsyncStorage.removeItem("user");
        await clearTokens();
        logout();
        setUserExists(false);
      }
    }, 12 * 1000);

    return () => clearInterval(interval);
  }, [userExists]);
};
