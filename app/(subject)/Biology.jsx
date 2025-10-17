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
  View,
  SafeAreaView,
} from "react-native";
import Animated,
{
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
        barStyle="light-content"
        backgroundColor={theme === "dark" ? "#0f1724" : "#F9FAFB"}
      />

      {/* HEADER */}
      <Animated.View style={[styles.headerWrap, headerStyle]}>
        <LinearGradient
          colors={["#7C3AED", "#4C1D95"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Chemistry</Text>
            <Pressable
              onPress={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
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
              style={styles.lottieAnimation}
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Sections */}
          <View style={styles.sectionList}>
            {sections.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => {
                    if (s.id === "exam") {
                      router.push("/(exam_section)/exam?subject=Biology");
                    } else if (s.id === "quiz") {
                      router.push("/(exam_section)/quiz?subject=Biology");
                    } 
                  }}
                style={({ pressed }) => [
                  styles.sectionCard,
                  {
                    backgroundColor: theme === "dark" ? "#1E293B" : "#F9FAFB",
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor: s.id === "exam" ? "#0BC5EA" : "#FF6B8A",
                    },
                  ]}
                >
                  <Ionicons name={s.icon} size={24} color="#fff" />
                </View>

                <View style={styles.cardContent}>
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
              </Pressable>
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
    elevation: 3,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 260,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  sheetContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    elevation: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  sectionList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
});
