import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function App() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");

  const themeAnim = useSharedValue(theme === "dark" ? 0 : 1);
  const headerEntrance = useSharedValue(0);
  const cardsEntrance = useSharedValue(0);

  useEffect(() => {
    headerEntrance.value = withDelay(
      200,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    cardsEntrance.value = withDelay(
      800,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  useEffect(() => {
    themeAnim.value = withTiming(theme === "dark" ? 0 : 1, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
  }, [theme]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerEntrance.value,
    transform: [
      { translateY: interpolate(headerEntrance.value, [0, 1], [30, 0]) },
      { scale: interpolate(headerEntrance.value, [0, 1], [0.98, 1]) },
    ],
  }));

  const cardsStyle = useAnimatedStyle(() => ({
    opacity: cardsEntrance.value,
    transform: [
      { translateY: interpolate(cardsEntrance.value, [0, 1], [20, 0]) },
    ],
  }));

  const sections = [
    {
      id: "exam",
      title: "Exam Section",
      subtitle: "Mock tests & schedules",
      icon: "clipboard",
    },
    {
      id: "quiz",
      title: "Quiz Practice",
      subtitle: "Daily practice questions",
      icon: "help-circle",
    },
  ];

  return (
    <>
      <View style={styles.root}>
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
        />

        <Animated.View style={[styles.headerWrap, headerStyle]}>
          <LinearGradient colors={["#7C3AED", "#4C1D95"]} style={styles.header}>
            <View style={styles.headerTop}>
              <Ionicons name="home-outline" size={22} color="#fff" />
              <Pressable
                onPress={() =>
                  setTheme((p) => (p === "dark" ? "light" : "dark"))
                }
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Toggle theme"
              >
                <View style={styles.themeToggle}>
                  <Ionicons
                    name={theme === "dark" ? "moon" : "sunny"}
                    size={18}
                    color="#fff"
                  />
                </View>
              </Pressable>
            </View>

            <View style={styles.hero}>
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={{
                    uri: "https://lottie.host/3dfe3292-dde3-4a9b-a780-b2f6c5360e35/VzFeB1.json",
                  }}
                  autoPlay
                  loop
                  style={{ width: 180, height: 180 }}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.sheetContainer, cardsStyle]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            

            <View style={styles.sectionList}>
              {sections.map((s, i) => (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (s.id === "exam") {
                      router.push("/(exam_section)/exam?subject=physics");
                    } else if (s.id === "quiz") {
                      router.push("/(exam_section)/quiz?subject=physics");
                    } else if (s.id === "video") {
                      router.push("/(exam_section)/video?subject=physics");
                    }
                  }}
                  style={[
                    styles.sectionCard,
                    {
                      borderLeftColor:
                        i === 0 ? "#00E5FF" : i === 1 ? "#FF7AA2" : "#4EE6B8",
                    },
                    theme === "dark" ? styles.cardDark : styles.cardLight,
                  ]}
                >
                  <View
                    style={[
                      styles.cardIcon,
                      {
                        backgroundColor:
                          i === 0 ? "#0BC5EA" : i === 1 ? "#FF6B8A" : "#32D5A8",
                      },
                    ]}
                  >
                    <Ionicons name={s.icon} size={22} color="#fff" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.cardTitle,
                        theme === "dark"
                          ? { color: "#EDEDED" }
                          : { color: "#111827" },
                      ]}
                    >
                      {s.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        theme === "dark"
                          ? { color: "#9CA3AF" }
                          : { color: "#6B7280" },
                      ]}
                    >
                      {s.subtitle}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme === "dark" ? "#9CA3AF" : "#374151"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f1724" },
  headerWrap: { zIndex: 10 },
  header: {
    paddingTop: 44,
    paddingBottom: 10,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    height: 300,
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeToggle: {
    width: 42,
    height: 30,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: { alignItems: "center", marginTop: 8 },
  lottieWrapper: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContainer: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  searchRow: { marginTop: 26, paddingHorizontal: 18, paddingTop: 18 },
  searchBox: {
    height: 44,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: { fontSize: 14 },
  searchLight: { backgroundColor: "#F3F4F6" },
  searchDark: { backgroundColor: "#0B1220" },
  sectionList: { paddingHorizontal: 18, paddingTop: 18 },
  sectionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 6,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
  cardLight: { backgroundColor: "#fff" },
  cardDark: {
    backgroundColor: "#0B1220",
    borderColor: "rgba(255,255,255,0.03)",
  },
});
