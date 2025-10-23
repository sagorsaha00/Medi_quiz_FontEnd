import { useUserLogin } from '@/auth/signup'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import * as Yup from 'yup'
import { useAuthStore } from '../../utils/details'
// ✅ Yup validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
})

export default function LoginScreen() {
    // ✅ Hooks always at the top
    const [showPassword, setShowPassword] = useState(false)
    const { mutate: loginMutate, isPending } = useUserLogin()
    const setUser = useAuthStore((state) => state.setUser)
    const user = useAuthStore((state) => state.user)

    const router = useRouter()
    if (user) {
        router.replace('/home')
    }
    // ✅ Memoized submit handler
    const handleLogin = useCallback(
        (values: { email: string; password: string }) => {
            loginMutate(values, {
                onSuccess: (data) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Login Successful',
                        position: 'top',
                    })
                    console.log('Login data', data)
                    setUser(data)
                    console.log('router', router)
                    setTimeout(() => {
                        router.replace('/home')
                    }, 100)
                },
                onError: (error: any) => {
                    console.log('Login error:', error)
                    Toast.show({
                        type: 'error',
                        text1: 'Login Failed',
                        text2:
                            error?.response?.data?.message ||
                            'An error occurred. Please try again.',
                        position: 'top',
                    })
                },
            })
        },
        [loginMutate]
    )

    return (
        <>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.backgroundGradient}
            >
                <View style={styles.rightContainer}>
                    <View style={styles.loginCard}>
                        {/* Header */}
                        <View style={styles.loginHeader}>
                            <Text style={styles.loginTitle}>Welcome Back</Text>
                            <Text style={styles.loginSubtitle}>
                                Sign in to your account
                            </Text>
                        </View>

                        {/* ✅ Formik Form */}
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={handleLogin}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                            }) => (
                                <>
                                    <View style={styles.inputContainer}>
                                        {/* Email Field */}
                                        <View style={styles.inputWrapper}>
                                            <Ionicons
                                                name="mail-outline"
                                                size={20}
                                                color="#666"
                                                style={styles.inputIcon}
                                            />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your email"
                                                value={values.email}
                                                onChangeText={handleChange(
                                                    'email'
                                                )}
                                                onBlur={handleBlur('email')}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                placeholderTextColor="#999"
                                            />
                                        </View>
                                        {touched.email && errors.email && (
                                            <Text style={styles.errorText}>
                                                {errors.email}
                                            </Text>
                                        )}

                                        {/* Password Field */}
                                        <View style={styles.inputWrapper}>
                                            <Ionicons
                                                name="lock-closed-outline"
                                                size={20}
                                                color="#666"
                                                style={styles.inputIcon}
                                            />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your password"
                                                value={values.password}
                                                onChangeText={handleChange(
                                                    'password'
                                                )}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={!showPassword}
                                                placeholderTextColor="#999"
                                            />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                style={styles.eyeIcon}
                                            >
                                                <Ionicons
                                                    name={
                                                        showPassword
                                                            ? 'eye-outline'
                                                            : 'eye-off-outline'
                                                    }
                                                    size={20}
                                                    color="#666"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {touched.password &&
                                            errors.password && (
                                                <Text style={styles.errorText}>
                                                    {errors.password}
                                                </Text>
                                            )}
                                    </View>

                                    {/* Forgot Password */}
                                    <TouchableOpacity
                                        onPress={() =>
                                            Alert.alert('Forgot Password?')
                                        }
                                    >
                                        <Text style={styles.forgot}>
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Login Button */}
                                    <TouchableOpacity
                                        disabled={isPending}
                                        style={styles.loginBtn}
                                        onPress={() => handleSubmit()}
                                    >
                                        <LinearGradient
                                            colors={['#667eea', '#764ba2']}
                                            style={styles.loginBtnGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.loginText}>
                                                {isPending
                                                    ? 'Logging in...'
                                                    : 'Log In'}
                                            </Text>
                                            <Ionicons
                                                name="arrow-forward"
                                                size={20}
                                                color="#fff"
                                                style={styles.loginArrow}
                                            />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Formik>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                        </View>

                        {/* Sign Up Link */}
                        <Text
                            onPress={() => router.push('/register')}
                            style={styles.signupText}
                        >
                            Don’t have an account?{' '}
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    backgroundGradient: { flex: 1 },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
    },
    loginCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 40,
        width: '95%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    loginHeader: { alignItems: 'center', marginBottom: 30 },
    loginTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#333',
        marginBottom: 8,
    },
    loginSubtitle: { fontSize: 16, color: '#666', fontWeight: '400' },
    inputContainer: { marginBottom: 20 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: 56, fontSize: 16, color: '#333' },
    eyeIcon: { padding: 4 },
    errorText: {
        color: '#e11d48',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 8,
    },
    forgot: {
        alignSelf: 'flex-end',
        color: '#667eea',
        marginBottom: 24,
        fontSize: 14,
        fontWeight: '500',
    },
    loginBtn: {
        width: '100%',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
    },
    loginText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    loginArrow: { marginLeft: 8 },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: { flex: 1, height: 1, backgroundColor: '#e9ecef' },
    signupText: { fontSize: 14, color: '#666', textAlign: 'center' },
    signupLink: { color: '#667eea', fontWeight: '700' },
})
