import { useAuthStore } from '@/utils/details'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

export default function App() {
    const [loading, setLoading] = useState(true)
    const rotation = useSharedValue(0)
    const opacity = useSharedValue(1)
    const { user } = useAuthStore()

    let User = user
    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 2000, easing: Easing.linear }),
            -1
        )

        opacity.value = withRepeat(
            withSequence(
                withTiming(0.4, { duration: 700 }),
                withTiming(1, { duration: 700 })
            ),
            -1
        )

        const timer = setTimeout(() => setLoading(false), 3000)
        return () => clearTimeout(timer)
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
        opacity: opacity.value,
    }))

    if (loading) {
        return (
            <>
                <View style={styles.loadingContainer}>
                    <Animated.View style={animatedStyle}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            width={90}
                            height={90}
                            fill="#6C63FF"
                        >
                            <Path d="M64 112C64 85.5 85.5 64 112 64L160 64C177.7 64 192 78.3 192 96C192 113.7 177.7 128 160 128L128 128L128 256C128 309 171 352 224 352C277 352 320 309 320 256L320 128L288 128C270.3 128 256 113.7 256 96C256 78.3 270.3 64 288 64L336 64C362.5 64 384 85.5 384 112L384 256C384 333.4 329 398 256 412.8L256 432C256 493.9 306.1 544 368 544C429.9 544 480 493.9 480 432L480 346.5C442.7 333.3 416 297.8 416 256C416 203 459 160 512 160C565 160 608 203 608 256C608 297.8 581.3 333.4 544 346.5L544 432C544 529.2 465.2 608 368 608C270.8 608 192 529.2 192 432L192 412.8C119 398 64 333.4 64 256L64 112zM512 288C529.7 288 544 273.7 544 256C544 238.3 529.7 224 512 224C494.3 224 480 238.3 480 256C480 273.7 494.3 288 512 288z" />
                        </Svg>
                    </Animated.View>
                    <Text
                        style={{ marginTop: 15, fontSize: 18, color: '#555' }}
                    >
                        Loading...
                    </Text>
                </View>
            </>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Quiz Time!</Text>
                <Image
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
                    }}
                    style={styles.image}
                />
                <Text style={styles.subtitle}>
                    Challenge your mind & have fun
                </Text>

                {User ? (
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/home')}
                        style={styles.signInBtn}
                    >
                        <Text style={styles.signInText}>Home</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => router.push('/(login)/login')}
                        style={styles.signUpBtn}
                    >
                        <Text style={styles.signUpText}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9ff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9ff',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#6C63FF',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    signInBtn: {
        backgroundColor: '#6C63FF',
        paddingVertical: 14,
        paddingHorizontal: 80,
        borderRadius: 30,
        marginBottom: 15,
        elevation: 4,
    },
    signInText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signUpBtn: {
        borderWidth: 2,
        borderColor: '#6C63FF',
        paddingVertical: 14,
        paddingHorizontal: 80,
        borderRadius: 30,
    },
    signUpText: {
        color: '#6C63FF',
        fontSize: 18,
        fontWeight: '600',
    },
})
