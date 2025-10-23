import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BACKENDURL } from '../../config/config'

const AllQuestionsScreen = () => {
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    )
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingQuestions, setLoadingQuestions] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${BACKENDURL}/quiz/categories`)
                const data = await res.json()
                setCategories(data.categories || [])
            } catch (err) {
                console.log('Fetch categories error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const handleSelectCategory = async (category: string) => {
        setSelectedCategory(category)
        setLoadingQuestions(true)
        try {
            const res = await fetch(
                `${BACKENDURL}/quiz/QuestionByCategory?category=${category}`
            )
            const data = await res.json()
            setQuestions(data.data || [])
        } catch (err) {
            console.log('Fetch questions error:', err)
        } finally {
            setLoadingQuestions(false)
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 100 }}
            bounces={true}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar
                barStyle={
                    Platform.OS === 'ios' ? 'dark-content' : 'light-content'
                }
                backgroundColor="#EEF2FF"
            />

            {/* 🧠 Header */}
            <LinearGradient
                colors={['#EEF2FF', '#E0E7FF']}
                style={styles.headerContainer}
            >
                <Text style={styles.header}>🧠 Quiz Explorer</Text>
                <Text style={styles.subHeader}>
                    Browse questions by category below
                </Text>
            </LinearGradient>

            {/* 🧩 Categories */}
            <View style={styles.categoryWrapper}>
                {loading ? (
                    <ActivityIndicator size="large" color="#6366F1" />
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        bounces
                        style={styles.categoryScroll}
                    >
                        {categories.map((cat) => {
                            const selected = selectedCategory === cat.category
                            return (
                                <TouchableOpacity
                                    key={cat.category}
                                    style={[
                                        styles.categoryCard,
                                        selected && styles.categorySelected,
                                    ]}
                                    onPress={() =>
                                        handleSelectCategory(cat.category)
                                    }
                                    activeOpacity={0.85}
                                >
                                    <Ionicons
                                        name="book-outline"
                                        size={18}
                                        color={selected ? '#fff' : '#4B5563'}
                                    />
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selected && { color: '#fff' },
                                        ]}
                                    >
                                        {cat.category}
                                    </Text>
                                    <View style={styles.badge}>
                                        <Text
                                            style={[
                                                styles.badgeText,
                                                selected && {
                                                    backgroundColor: '#A5B4FC',
                                                    color: '#1E3A8A',
                                                },
                                            ]}
                                        >
                                            {cat.questionCount}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                )}
                <StatusBar barStyle={'dark-content'} />
            </View>

            {/* 📘 Selected Category Header */}
            {selectedCategory && (
                <View style={styles.selectedHeader}>
                    <Ionicons name="school-outline" size={20} color="#4F46E5" />
                    <Text style={styles.selectedHeaderText}>
                        {selectedCategory} ({questions.length})
                    </Text>
                </View>
            )}

            {/* ❓ Questions */}
            {loadingQuestions ? (
                <ActivityIndicator
                    size="large"
                    color="#6366F1"
                    style={{ marginTop: 40 }}
                />
            ) : selectedCategory ? (
                questions.map((q, i) => (
                    <View key={q._id} style={styles.questionCard}>
                        <Text style={styles.questionTitle}>
                            {i + 1}. {q.question}
                        </Text>

                        {Object.entries(q.options).map(([key, value]) => (
                            <Text
                                key={key}
                                style={[
                                    styles.optionText,
                                    key === q.correctAnswer &&
                                        styles.correctOption,
                                ]}
                            >
                                {key}. {value}
                            </Text>
                        ))}

                        <View style={styles.explanationBox}>
                            <Ionicons
                                name="bulb-outline"
                                size={16}
                                color="#0284C7"
                            />
                            <Text style={styles.explanationText}>
                                {q.explanation || 'No explanation provided'}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.placeholder}>
                    Select a category to explore questions 👆
                </Text>
            )}
        </ScrollView>
    )
}

export default AllQuestionsScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', position: 'static' },
    headerContainer: {
        position: 'static',
        paddingTop: 70,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E3A8A',
        textAlign: 'center',
    },
    subHeader: {
        textAlign: 'center',
        color: '#475569',
        fontSize: 14,
        marginTop: 4,
    },
    categoryWrapper: { marginTop: 15 },
    categoryScroll: { paddingHorizontal: 10 },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        marginRight: 10,
    },
    categorySelected: {
        backgroundColor: '#4F46E5',
        shadowColor: '#6366F1',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        transform: [{ scale: 1.05 }],
    },
    categoryText: { fontSize: 15, fontWeight: '600', marginLeft: 6 },
    badge: { marginLeft: 8 },
    badgeText: {
        fontSize: 12,
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        borderRadius: 8,
        paddingHorizontal: 6,
        overflow: 'hidden',
    },
    selectedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    selectedHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E3A8A',
        marginLeft: 8,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 15,
        marginHorizontal: 15,
        marginTop: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    optionText: { fontSize: 15, color: '#475569', marginVertical: 2 },
    correctOption: { color: '#16A34A', fontWeight: '700' },
    explanationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#E0F2FE',
        padding: 8,
        borderRadius: 10,
    },
    explanationText: {
        color: '#0369A1',
        fontSize: 13,
        marginLeft: 6,
        flexShrink: 1,
    },
    placeholder: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 16,
        marginTop: 40,
    },
})
