import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimationProps {
  percentage: number;
  score: number;
  total: number;
}

// Success Animation Component (Good Results)
const SuccessAnimation: React.FC<AnimationProps> = ({
  percentage,
  score,
  total,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSuccessAnimation();
  }, []);

  const startSuccessAnimation = () => {
    // Reset animations
    scaleAnim.setValue(0);
    rotateAnim.setValue(0);
    sparkleAnim.setValue(0);
    bounceAnim.setValue(0);

    // Main animation sequence
    Animated.parallel([
      // Scale and rotate icon
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: 2,
        duration: 1500,
        useNativeDriver: true,
      }),

      // Sparkle effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start(() => {
      // Start continuous pulse
      startPulseAnimation();
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.5, 0],
  });

  return (
 <>
    <View style={styles.successContainer}>
      {/* Sparkle effects */}
      {[...Array(6)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.sparkle,
            {
              transform: [
                { scale: sparkleScale },
                { rotate: `${i * 60}deg` },
                { translateY: -80 },
              ],
              left: width / 2 - 5,
              top: height / 2 - 100,
            },
          ]}
        >
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>
      ))}

      {/* Main success icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: rotateInterpolate },
              { translateY: Animated.multiply(bounceAnim, -10) },
            ],
          },
        ]}
      >
        {/* Spiky background */}
        <View style={styles.spikyCircle}>
          {[...Array(16)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.spike,
                {
                  transform: [
                    { rotate: `${index * 22.5}deg` },
                    { translateY: -50 },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.centerCircle, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="checkmark" size={50} color="#fff" />
        </View>
      </Animated.View>

      {/* Success messages */}
      <View style={styles.messageContainer}>
        <Text style={[styles.mainMessage, { color: '#4CAF50' }]}>
          {percentage === 100
            ? '🎉 নিখুঁত!'
            : percentage >= 80
              ? '🌟 চমৎকার!'
              : '👍 ভালো!'}
        </Text>
        <Text style={styles.encourageMessage}>
          {percentage === 100
            ? 'আপনি একজন প্রকৃত চ্যাম্পিয়ন!'
            : percentage >= 80
              ? 'দারুণ পারফরম্যান্স!'
              : 'চালিয়ে যান, আরো ভালো করতে পারবেন!'}
        </Text>
      </View>
    </View>
 </>
  );
};

// Sad Animation Component (Poor Results)
const SadAnimation: React.FC<AnimationProps> = ({
  percentage,
  score,
  total,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const tearAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSadAnimation();
  }, []);

  const startSadAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0);
    tearAnim.setValue(0);

    Animated.sequence([
      // Fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Shake effect
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),

      // Tear drop effect
      Animated.timing(tearAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const tearTranslate = tearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
  <>
    <Animated.View style={[styles.sadContainer, { opacity: fadeAnim }]}>
      {/* Sad face */}
      <Animated.View
        style={[
          styles.sadIconContainer,
          {
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        <View style={[styles.centerCircle, { backgroundColor: '#FF5722' }]}>
          <Text style={styles.sadEmoji}>😢</Text>
        </View>

        {/* Tear drops */}
        <Animated.View
          style={[
            styles.tearDrop,
            {
              transform: [{ translateY: tearTranslate }],
            },
          ]}
        >
          <Text style={styles.tearText}>💧</Text>
        </Animated.View>
      </Animated.View>

      {/* Sad messages */}
      <View style={styles.messageContainer}>
        <Text style={[styles.mainMessage, { color: '#FF5722' }]}>
          😔 আরো চেষ্টা করুন!
        </Text>
        <Text style={styles.encourageMessage}>
          হতাশ হবেন না! প্রতিটি ভুল আপনাকে শেখায়।{'\n'}
          আবার চেষ্টা করুন - আপনি পারবেন! 💪
        </Text>
      </View>
    </Animated.View>
  </>
  );
};

// Average Animation Component (Medium Results)
const AverageAnimation: React.FC<AnimationProps> = ({}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAverageAnimation();
  }, []);

  const startAverageAnimation = () => {
    scaleAnim.setValue(0);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(wiggleAnim, {
            toValue: 5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: -5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  return (
    <>
    <Animated.View
      style={[
        styles.averageContainer,
        {
          transform: [
            { scale: scaleAnim },
            {
              rotate: wiggleAnim.interpolate({
                inputRange: [-5, 5],
                outputRange: ['-2deg', '2deg'],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.centerCircle, { backgroundColor: '#FF9800' }]}>
        <Text style={styles.averageEmoji}>🤔</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={[styles.mainMessage, { color: '#FF9800' }]}>
          🤔 মোটামুটি ভালো!
        </Text>
        <Text style={styles.encourageMessage}>
          আপনি ভালো করেছেন, কিন্তু আরো ভালো করতে পারেন!{'\n'}
          একটু বেশি অনুশীলন করলেই হবে। 📚
        </Text>
      </View>
    </Animated.View>
    </>
  );
};

export default function ResultPage(): React.ReactElement {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  console.log('score', score);
  const wrong = (params.wrong as string) || 0;

  const total = parseInt(params.total as string) || 20;
  const percentage = Math.round((score / total) * 100);
  console.log('total', { score, wrong, total, percentage });
  const [showRetakeButton, setShowRetakeButton] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(' BackendUrl/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total, score, wrong, percentage }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      return response.json();
    },
  });
  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    // Show retake button after animation
    const timer = setTimeout(() => {
      setShowRetakeButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getAnimationComponent = () => {
    if (percentage >= 70) {
      return (
        <SuccessAnimation percentage={percentage} score={score} total={total} />
      );
    } else if (percentage >= 40) {
      return (
        <AverageAnimation percentage={percentage} score={score} total={total} />
      );
    } else {
      return (
        <SadAnimation percentage={percentage} score={score} total={total} />
      );
    }
  };

  const getBackgroundColor = () => {
    if (percentage >= 70) return '#E8F5E8';
    if (percentage >= 40) return '#FFF8E1';
    return '#FFEBEE';
  };

  const handleRetake = () => {
    router.back();
  };

  const handleHome = () => {
    router.push('/home');
  };

  return (
 <>
    <SafeAreaView
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Quiz ফলাফল</Text>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 14,
            right: 20,
            backgroundColor: '#6c63ff',
            padding: 16,
            borderRadius: 50,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 6,
          }}
          onPress={() => router.push('/(extra)/QuizHistoryScreen')}
        >
          <Ionicons name="time-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {score}/{total}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>

        {/* Animation Container */}
        <View style={styles.animationWrapper}>{getAnimationComponent()}</View>

        {/* Action Buttons */}
        {showRetakeButton && (
          <Animated.View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.retakeButton]}
              onPress={handleRetake}
            >
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.buttonText}>আবার চেষ্টা করুন</Text>
            </TouchableOpacity>

            <TouchableOpacity
              
              style={[styles.button, styles.homeButton]}
              onPress={handleHome}
            >
              <Ionicons name="home" size={24} color="#6c63ff" />
              <Text style={[styles.buttonText, { color: '#6c63ff' }]}>
                হোমে ফিরুন
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
 </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  animationWrapper: {
    height: 300,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Success Animation Styles
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  spikyCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spike: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  centerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 20,
  },

  // Sad Animation Styles
  sadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sadIconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sadEmoji: {
    fontSize: 50,
  },
  tearDrop: {
    position: 'absolute',
    top: 70,
    left: 10,
  },
  tearText: {
    fontSize: 16,
  },

  // Average Animation Styles
  averageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageEmoji: {
    fontSize: 50,
  },

  // Message Styles
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainMessage: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  encourageMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },

  // Button Styles
  buttonContainer: {
    width: '100%',
    paddingTop: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  retakeButton: {
    backgroundColor: '#6c63ff',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});
