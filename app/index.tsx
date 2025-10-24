import { useAuthStore } from '@/utils/details'
import * as Font from 'expo-font'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

// Prevent auto hide splash screen immediately
SplashScreen.preventAutoHideAsync()

// Animated character component
const AnimatedChar = ({ char, delay }: { char: string; delay: number }) => {
    const opacity = useSharedValue(0)
    const translateY = useSharedValue(20)

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 400 }))
        translateY.value = withDelay(delay, withSpring(0, { damping: 12 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }))

    return (
        <Animated.Text style={[styles.helloChar, animatedStyle]}>
            {char}
        </Animated.Text>
    )
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)
    const [showHello, setShowHello] = useState(false)
    const [showMain, setShowMain] = useState(false)
    const { user } = useAuthStore()

    // Load fonts
    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
                    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
                })
                setFontsLoaded(true)
            } catch (e) {
                console.warn(e)
            }
        }
        loadFonts()
    }, [])

    // Control the flow: splash -> hello -> main
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync()
            setShowHello(true)

            // Show main screen after hello animation completes
            const timer = setTimeout(() => {
                setShowHello(false)
                setShowMain(true)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [fontsLoaded])

    // Show nothing while fonts are loading (splash screen is visible)
    if (!fontsLoaded) {
        return null
    }

    // Show Hello screen with character-by-character animation
    if (showHello) {
        const helloText = 'Hello'
        return (
            <View style={styles.loadingContainer}>
                <Animated.View
                    exiting={FadeOut.duration(600)}
                    style={styles.helloContainer}
                >
                    {helloText.split('').map((char, index) => (
                        <AnimatedChar
                            key={index}
                            char={char}
                            delay={index * 150}
                        />
                    ))}
                </Animated.View>
            </View>
        )
    }

    // Show main content
    if (!showMain) {
        return null
    }

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
                <Text style={[styles.greeting, { fontFamily: 'Poppins-Bold' }]}>Hello</Text>
                <Text style={[styles.mainTitle, { fontFamily: 'Poppins-SemiBold' }]}>
                    Challenge
                </Text>
                <Text style={[styles.mainTitle, { fontFamily: 'Poppins-SemiBold' }]}>
                    Yourself for
                </Text>
                <Text style={[styles.highlightTitle, { fontFamily: 'Poppins-Bold' }]}>Medical</Text>

                <Text style={styles.description}>
                    Test your medical knowledge with{'\n'}
                    expert-level quiz questions
                </Text>

                <View style={styles.buttonContainer}>
                    {user ? (
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/home')}
                            style={styles.primaryBtn}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.primaryBtnText}>Continue</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => router.push('/(login)/login')}
                                style={styles.primaryBtn}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryBtnText}>Get Started</Text>
                            </TouchableOpacity>

                          
                        </>
                    )}
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    helloContainer: {
        flexDirection: 'row',
    },
    helloChar: {
        fontSize: 72,
        color: '#000000',
        letterSpacing: -2,
        fontWeight: '300',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 60,
    },
    greeting: {
        fontSize: 48,
        color: '#000000',
        marginBottom: 8,
        letterSpacing: -1,
    },
    mainTitle: {
        fontSize: 48,
        color: '#000000',
        letterSpacing: -1,
        lineHeight: 52,
    },
    highlightTitle: {
        fontSize: 48,
        color: '#007AFF',
        letterSpacing: -1,
        lineHeight: 52,
        marginBottom: 24,
    },
    description: {
        fontSize: 17,
        color: '#86868b',
        lineHeight: 24,
        marginBottom: 60,
    },
    buttonContainer: {
        gap: 14,
    },
    primaryBtn: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#ffffff',
    },
    secondaryBtn: {
        backgroundColor: '#f5f5f7',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    secondaryBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#007AFF',
    },
})