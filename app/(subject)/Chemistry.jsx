import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
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

  // ✅ Memoize to prevent re-creation and key warnings
  const sections = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <SafeAreaView
      style={[
        styles.root,
        { backgroundColor: theme === "dark" ? "#0f1724" : "#F9FAFB" },
      ]}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* HEADER */}
      <Animated.View style={[styles.headerWrap, headerStyle]}>
        <LinearGradient
          colors={
            theme === "dark"
              ? ["#7C3AED", "#4C1D95"]
              : ["#A78BFA", "#C4B5FD"]
          }
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Ionicons name="home-outline" size={22} color="#fff" />
            <Pressable
              onPress={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
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
            <LottieView
              source={{
                uri: "https://lottie.host/3dfe3292-dde3-4a9b-a780-b2f6c5360e35/VzFeB1.json",
              }}
              autoPlay
              loop
              style={{ width: 160, height: 160 }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* MAIN CONTENT */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            backgroundColor: theme === "dark" ? "#111827" : "#fff",
          },
          cardsStyle,
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
      

          {/* Sections */}
          <View style={styles.sectionList}>
            {sections.map((s) => (
              <TouchableOpacity
                key={s.id} // ✅ unique key
                activeOpacity={0.85}
                onPress={() => {
                  if (s.id === "exam") {
                    router.push("/(exam_section)/exam?subject=Chemistry");
                  } else if (s.id === "quiz") {
                    router.push("/(exam_section)/quiz?subject=Chemistry");
                  }
                }}
                style={[
                  styles.sectionCard,
                  {
                    borderLeftColor:
                      s.id === "exam" ? "#00E5FF" : "#FF7AA2",
                    backgroundColor:
                      theme === "dark" ? "#1E293B" : "#F9FAFB",
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor:
                        s.id === "exam" ? "#0BC5EA" : "#FF6B8A",
                    },
                  ]}
                >
                  <Ionicons name={s.icon} size={22} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: theme === "dark" ? "#EDEDED" : "#111827" },
                    ]}
                  >
                    {s.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme === "dark" ? "#9CA3AF" : "#6B7280" },
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerWrap: {
    zIndex: 10,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 240,
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    marginTop: 10,
  },
  sheetContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  searchRow: {
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  searchBox: {
    height: 44,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: {
    fontSize: 14,
    flex: 1,
  },
  sectionList: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  sectionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
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
});
