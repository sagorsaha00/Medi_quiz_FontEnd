import { useAuthStore } from '@/utils/details'
import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

export default function QuizHomeScreen() {
    const categories = [
        {
            name: 'Chemistry',
            icon: 'flask-outline',
            color: '#00CED1',
            questions: 30,
            lib: Ionicons,
        },
        {
            name: 'GK',
            icon: 'calculator',
            color: '#FFD700',
            questions: 95,
            lib: FontAwesome5,
        },
        {
            name: 'History',
            icon: 'calendar-outline',
            color: '#1E90FF',
            questions: 128,
            lib: Ionicons,
        },
        {
            name: 'Biology',
            icon: 'dna',
            color: '#FF4500',
            questions: 30,
            lib: FontAwesome5,
        },
        {
            name: 'Physics',
            icon: 'map-outline',
            color: '#32CD32',
            questions: 24,
            lib: Ionicons,
        },
    ]

    const router = useRouter()

    // Animation values
    const headerOpacity = useSharedValue(0)
    const headerTranslateY = useSharedValue(-20)

    const cardAnimations = categories.map(() => ({
        opacity: useSharedValue(0),
        scale: useSharedValue(0.8),
    }))

    const user = useAuthStore((state) => state.user)
    console.log('cheak user home', user)

    useEffect(() => {
        if (!user) {
            router.replace('/(login)/login')
        }
        headerOpacity.value = withTiming(1, { duration: 500 })
        headerTranslateY.value = withSpring(0)

        cardAnimations.forEach((anim, index) => {
            anim.opacity.value = withDelay(
                index * 150,
                withTiming(1, { duration: 500 })
            )
            anim.scale.value = withDelay(
                index * 150,
                withSpring(1, { damping: 8 })
            )
        })
    }, [])

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#0d0d0d' }}>
                {/* Header */}
                <StatusBar barStyle={'light-content'} />
                <Animated.View>
                    <LinearGradient
                        colors={['#1c1c1e', '#121212']}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 20,
                            paddingTop: 50,
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 26,
                                    fontWeight: 'bold',
                                }}
                            >
                                Hi, Sagor 👋
                            </Text>
                            <Text style={{ color: '#aaa', fontSize: 14 }}>
                                Let’s make this day productive
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/(extra)/profile')}
                        >
                            <Image
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png',
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                }}
                            />
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>

                {/* Categories */}
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginLeft: 20,
                        marginTop: 20,
                    }}
                >
                    Let's Play
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        padding: 20,
                    }}
                >
                    {categories.map((cat, index) => {
                        const IconComp = cat.lib

                        // Animation styles for each card
                        const animatedStyle = useAnimatedStyle(() => ({
                            opacity: cardAnimations[index].opacity.value,
                            transform: [
                                { scale: cardAnimations[index].scale.value },
                            ],
                        }))

                        return (
                            <Animated.View
                                key={cat.name} // ✅ unique key এখানে দিন
                                style={[
                                    {
                                        backgroundColor: '#1c1c1e',
                                        borderRadius: 15,
                                        padding: 15,
                                        width: '47%',
                                        marginBottom: 15,
                                        alignItems: 'center',
                                        shadowColor: '#000',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 5,
                                        elevation: 4,
                                    },
                                    animatedStyle,
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push(`/(subject)/${cat.name}`)
                                    }
                                    style={{ alignItems: 'center' }}
                                >
                                    <View
                                        style={{
                                            padding: 15,
                                            borderRadius: 50,
                                            marginBottom: 10,
                                            backgroundColor: cat.color + '33',
                                        }}
                                    >
                                        <IconComp
                                            name={cat.icon}
                                            size={40}
                                            color={cat.color}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {cat.name}
                                    </Text>
                                    <Text
                                        style={{ color: '#aaa', fontSize: 12 }}
                                    >
                                        {cat.questions} questions
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )
                    })}
                </View>

                {/* Add Quiz Button */}
                <TouchableOpacity
                    onPress={() => router.push(`/(extra)/quizAdd`)}
                    style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: 15,
                        padding: 15,
                        width: '45%',
                        height: 140,
                        marginBottom: 15,
                        alignItems: 'center',
                        marginLeft: '50%',
                        marginTop: -179,
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 4,
                    }}
                >
                    <MaterialCommunityIcons
                        name="plus-box-outline"
                        size={42}
                        color="#00BFFF"
                    />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',
                        }}
                    >
                        Add Quiz
                    </Text>
                </TouchableOpacity>

                {/* GroupChat */}
                {/* <TouchableOpacity 
        onPress={() => router.push(`/GroupChat`)}
          style={{
            backgroundColor: '#1c1c1e',
            borderRadius: 15,
            padding: 15,
            width: '43%',
            height: 150,
            alignItems: 'center',
            marginLeft: 20,
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 4,
          }}
          
        >
          <Ionicons
    name="chatbubbles-outline"   // icon name
    size={42}                    // icon size
    color="#00BFFF"              // icon color
    style={{ marginBottom: 10 }} // নিচে একটু gap
  />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
            GroupChat
          </Text>
        </TouchableOpacity> */}

                {/* PDF Section */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: 15,
                        padding: 15,
                        width: '45%',
                        height: 150,
                        alignItems: 'center',
                        marginLeft: '50%',
                        marginTop: -150,
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 4,
                    }}
                    onPress={() => router.push(`/(extra)/AllQuestionsScreen`)}
                >
                    <Ionicons name="book-outline" size={42} color="#32CD32" />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',
                        }}
                    >
                        All Question
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}
