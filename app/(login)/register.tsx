import { useAuthStore } from '@/utils/details'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import * as Yup from 'yup'
import { UserRegister } from '../../auth/signup'

// ✅ Validation Schema
const RegisterSchema = Yup.object().shape({
    FirstName: Yup.string().required('First name required'),
    LastName: Yup.string().required('Last name required'),
    Username: Yup.string().required('Username required'),
    Email: Yup.string().email('Invalid email').required('Email required'),
    Password: Yup.string()
        .min(6, 'At least 6 characters')
        .required('Password required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('Password')], 'Passwords must match')
        .required('Confirm your password'),
})

export default function RegisterScreen() {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)
    const { mutate: RegisterMutate, isPending } = UserRegister()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    // ✅ Handle Submit
    const handleSubmitForm = useCallback(
        (values: any) => {
            console.log('values', values)
            if (!agreeToTerms) {
                Toast.show({
                    type: 'error',
                    text1: 'Please agree to Terms & Conditions',
                    position: 'top',
                })
                return
            }

            RegisterMutate(values, {
                onSuccess: (data) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Registration Successful 🎉',
                        position: 'top',
                    })
                    setUser(data)
                    setTimeout(() => {
                        router.replace('/home')
                    }, 400)
                },
                onError: (error: any) => {
                    console.log('Registration Error:', error)
                    Toast.show({
                        type: 'error',
                        text1: 'Registration Failed ❌',
                        text2:
                            error?.response?.data?.message ||
                            'Something went wrong. Please try again.',
                        position: 'top',
                    })
                },
            })
        },
        [RegisterMutate, agreeToTerms]
    )

    return (
        <>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.backgroundGradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.rightContainer}>
                            <View style={styles.registerCard}>
                                <View style={styles.registerHeader}>
                                    <Text style={styles.registerTitle}>
                                        Create Account
                                    </Text>
                                    <Text style={styles.registerSubtitle}>
                                        Join MEDIGRAPH today
                                    </Text>
                                </View>

                                {/* ✅ Formik Form */}
                                <Formik
                                    initialValues={{
                                        FirstName: '',
                                        LastName: '',
                                        Username: '',
                                        Email: '',
                                        Password: '',
                                        confirmPassword: '',
                                    }}
                                    validationSchema={RegisterSchema}
                                    onSubmit={(values) =>
                                        handleSubmitForm(values)
                                    }
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
                                            {/* Name Fields */}
                                            <View style={styles.nameRow}>
                                                <View
                                                    style={[
                                                        styles.inputWrapper,
                                                        styles.halfWidth,
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name="person-outline"
                                                        size={20}
                                                        color="#666"
                                                        style={styles.inputIcon}
                                                    />
                                                    <TextInput
                                                        placeholder="First Name"
                                                        value={values.FirstName}
                                                        onChangeText={handleChange(
                                                            'FirstName'
                                                        )}
                                                        onBlur={handleBlur(
                                                            'FirstName'
                                                        )}
                                                        style={styles.input}
                                                        placeholderTextColor="#999"
                                                    />
                                                </View>
                                                <View
                                                    style={[
                                                        styles.inputWrapper,
                                                        styles.halfWidth,
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name="person-outline"
                                                        size={20}
                                                        color="#666"
                                                        style={styles.inputIcon}
                                                    />
                                                    <TextInput
                                                        placeholder="Last Name"
                                                        value={values.LastName}
                                                        onChangeText={handleChange(
                                                            'LastName'
                                                        )}
                                                        onBlur={handleBlur(
                                                            'LastName'
                                                        )}
                                                        style={styles.input}
                                                        placeholderTextColor="#999"
                                                    />
                                                </View>
                                            </View>
                                            {touched.FirstName &&
                                                errors.FirstName && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.FirstName}
                                                    </Text>
                                                )}
                                            {touched.LastName &&
                                                errors.LastName && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.LastName}
                                                    </Text>
                                                )}

                                            {/* Username */}
                                            <View style={styles.inputWrapper}>
                                                <Ionicons
                                                    name="at-outline"
                                                    size={20}
                                                    color="#666"
                                                    style={styles.inputIcon}
                                                />
                                                <TextInput
                                                    placeholder="Username"
                                                    value={values.Username}
                                                    onChangeText={handleChange(
                                                        'Username'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'Username'
                                                    )}
                                                    style={styles.input}
                                                    placeholderTextColor="#999"
                                                />
                                            </View>
                                            {touched.Username &&
                                                errors.Username && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.Username}
                                                    </Text>
                                                )}

                                            {/* Email */}
                                            <View style={styles.inputWrapper}>
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={20}
                                                    color="#666"
                                                    style={styles.inputIcon}
                                                />
                                                <TextInput
                                                    placeholder="Email Address"
                                                    value={values.Email}
                                                    onChangeText={handleChange(
                                                        'Email'
                                                    )}
                                                    onBlur={handleBlur('Email')}
                                                    style={styles.input}
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    placeholderTextColor="#999"
                                                />
                                            </View>
                                            {touched.Email && errors.Email && (
                                                <Text style={styles.errorText}>
                                                    {errors.Email}
                                                </Text>
                                            )}

                                            {/* Password */}
                                            <View style={styles.inputWrapper}>
                                                <Ionicons
                                                    name="lock-closed-outline"
                                                    size={20}
                                                    color="#666"
                                                    style={styles.inputIcon}
                                                />
                                                <TextInput
                                                    placeholder="Password"
                                                    value={values.Password}
                                                    onChangeText={handleChange(
                                                        'Password'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'Password'
                                                    )}
                                                    secureTextEntry={
                                                        !showPassword
                                                    }
                                                    style={styles.input}
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
                                            {touched.Password &&
                                                errors.Password && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.Password}
                                                    </Text>
                                                )}

                                            {/* Confirm Password */}
                                            <View style={styles.inputWrapper}>
                                                <Ionicons
                                                    name="lock-closed-outline"
                                                    size={20}
                                                    color="#666"
                                                    style={styles.inputIcon}
                                                />
                                                <TextInput
                                                    placeholder="Confirm Password"
                                                    value={
                                                        values.confirmPassword
                                                    }
                                                    onChangeText={handleChange(
                                                        'confirmPassword'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'confirmPassword'
                                                    )}
                                                    secureTextEntry={
                                                        !showConfirmPassword
                                                    }
                                                    style={styles.input}
                                                    placeholderTextColor="#999"
                                                />
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    style={styles.eyeIcon}
                                                >
                                                    <Ionicons
                                                        name={
                                                            showConfirmPassword
                                                                ? 'eye-outline'
                                                                : 'eye-off-outline'
                                                        }
                                                        size={20}
                                                        color="#666"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {touched.confirmPassword &&
                                                errors.confirmPassword && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.confirmPassword}
                                                    </Text>
                                                )}

                                            {/* Terms */}
                                            <TouchableOpacity
                                                style={styles.termsContainer}
                                                onPress={() =>
                                                    setAgreeToTerms(
                                                        !agreeToTerms
                                                    )
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.checkbox,
                                                        agreeToTerms &&
                                                            styles.checkboxChecked,
                                                    ]}
                                                >
                                                    {agreeToTerms && (
                                                        <Ionicons
                                                            name="checkmark"
                                                            size={14}
                                                            color="#fff"
                                                        />
                                                    )}
                                                </View>
                                                <Text style={styles.termsText}>
                                                    I agree to the{' '}
                                                    <Text
                                                        style={styles.termsLink}
                                                    >
                                                        Terms & Conditions
                                                    </Text>{' '}
                                                    and{' '}
                                                    <Text
                                                        style={styles.termsLink}
                                                    >
                                                        Privacy Policy
                                                    </Text>
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Submit Button */}
                                            <TouchableOpacity
                                                disabled={isPending}
                                                style={styles.registerBtn}
                                                onPress={() => handleSubmit()}
                                            >
                                                <LinearGradient
                                                    colors={[
                                                        '#667eea',
                                                        '#764ba2',
                                                    ]}
                                                    style={
                                                        styles.registerBtnGradient
                                                    }
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                >
                                                    <Text
                                                        style={
                                                            styles.registerText
                                                        }
                                                    >
                                                        {isPending
                                                            ? 'Creating...'
                                                            : 'Create Account'}
                                                    </Text>
                                                    <Ionicons
                                                        name="arrow-forward"
                                                        size={20}
                                                        color="#fff"
                                                        style={
                                                            styles.registerArrow
                                                        }
                                                    />
                                                </LinearGradient>
                                            </TouchableOpacity>

                                            {/* Login Link */}
                                            <Text
                                                onPress={() =>
                                                    router.push('/login')
                                                }
                                                style={styles.loginText}
                                            >
                                                Already have an account?{' '}
                                                <Text style={styles.loginLink}>
                                                    Log In
                                                </Text>
                                            </Text>
                                        </>
                                    )}
                                </Formik>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
    )
}

// ✅ Styles (same as before)
const styles = StyleSheet.create({
    errorText: {
        color: '#e11d48',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 8,
    },
    backgroundGradient: { flex: 1 },
    scrollContainer: { flexGrow: 1, paddingVertical: 40 },
    container: { flex: 1, flexDirection: 'row', paddingHorizontal: 20 },
    rightContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    registerCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 40,
        width: '100%',
        maxWidth: 450,
        elevation: 10,
    },
    registerHeader: { alignItems: 'center', marginBottom: 30 },
    registerTitle: { fontSize: 32, fontWeight: '800', color: '#333' },
    registerSubtitle: { fontSize: 16, color: '#666' },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
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
    halfWidth: { width: '48%' },
    input: { flex: 1, height: 56, fontSize: 16, color: '#333' },
    inputIcon: { marginRight: 12 },
    eyeIcon: { padding: 4 },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: '#667eea', borderColor: '#667eea' },
    termsText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
    termsLink: { color: '#667eea', fontWeight: '600' },
    registerBtn: { width: '100%', borderRadius: 16, marginBottom: 20 },
    registerBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
    },
    registerText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    registerArrow: { marginLeft: 8 },
    loginText: { fontSize: 14, color: '#666', textAlign: 'center' },
    loginLink: { color: '#667eea', fontWeight: '700' },
})
