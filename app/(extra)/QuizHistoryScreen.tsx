import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useMemo } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export type QuizHistoryItem = {
    _id: string
    userId: string
    totalQuestions: number
    correctAnswers: number
    wrongAnswers: number
    percentage?: number // sometimes exists
    createdAt: string
}

// ---------- Helpers ---------- //
const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString()
}

const percent = (part: number, whole: number) =>
    whole > 0 ? Math.round((part / whole) * 100) : 0

const getGrade = (p: number) => {
    if (p >= 90) return { label: 'A+', color: '#16a34a' }
    if (p >= 80) return { label: 'A', color: '#22c55e' }
    if (p >= 70) return { label: 'B', color: '#84cc16' }
    if (p >= 60) return { label: 'C', color: '#eab308' }
    if (p >= 50) return { label: 'D', color: '#f97316' }
    return { label: 'F', color: '#ef4444' }
}

const ProgressBar = ({ value }: { value: number }) => (
    <View style={styles.progressTrack}>
        <View
            style={[
                styles.progressThumb,
                { width: `${Math.min(100, Math.max(0, value))}%` },
            ]}
        />
    </View>
)

async function fetchHistory(): Promise<QuizHistoryItem[]> {
    const res = await fetch(`http://192.168.1.104:3000/quiz/GetResultHistory`)
    console.log('res', res)
    if (!res.ok) throw new Error('Failed to fetch history')
    const json = await res.json()
    return json.history || []
}

// ---------- Main Screen ---------- //
export default function QuizHistoryScreen() {
    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['quiz-history'],
        queryFn: fetchHistory,
    })

    const filtered = useMemo(() => {
        if (!data) return [] as QuizHistoryItem[]
        return data
    }, [data])

    const overall = useMemo(() => {
        const arr = filtered
        if (!arr.length) return { total: 0, correct: 0, questions: 0, avg: 0 }
        const questions = arr.reduce((sum, a) => sum + a.totalQuestions, 0)
        const correct = arr.reduce((sum, a) => sum + a.correctAnswers, 0)
        const avg = percent(correct, questions)
        return { total: arr.length, correct, questions, avg }
    }, [filtered])

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    Loading your quiz history…
                </Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>
                    Could not load history. Pull to retry.
                </Text>
                <FlatList
                    data={[]}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
                    }
                    renderItem={() => null}
                    ListEmptyComponent={<View />}
                />
            </View>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#111827', '#1f2937']}
                    style={styles.header}
                >
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>
                            Your Quiz History
                        </Text>
                        <Ionicons
                            name="time-outline"
                            size={22}
                            color="#cbd5e1"
                        />
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Attempts</Text>
                            <Text style={styles.statValue}>
                                {overall.total}
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Correct</Text>
                            <Text style={styles.statValue}>
                                {overall.correct}
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Questions</Text>
                            <Text style={styles.statValue}>
                                {overall.questions}
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Avg %</Text>
                            <Text style={styles.statValue}>{overall.avg}%</Text>
                        </View>
                    </View>
                </LinearGradient>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
                    }
                    renderItem={({ item }) => {
                        const correctPct =
                            item.percentage ??
                            percent(item.correctAnswers, item.totalQuestions)
                        const wrongPct = percent(
                            item.wrongAnswers,
                            item.totalQuestions
                        )
                        const grade = getGrade(correctPct)

                        return (
                            <>
                                <Pressable style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>
                                            Quiz Attempt
                                        </Text>
                                        <Text style={styles.dateText}>
                                            {formatDate(item.createdAt)}
                                        </Text>
                                    </View>

                                    <View style={styles.metricsRow}>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricLabel}>
                                                Score
                                            </Text>
                                            <Text style={styles.metricValue}>
                                                {item.correctAnswers}/
                                                {item.totalQuestions}
                                            </Text>
                                        </View>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricLabel}>
                                                Wrong %
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.metricValue,
                                                    { color: '#ef4444' },
                                                ]}
                                            >
                                                {wrongPct}%
                                            </Text>
                                        </View>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricLabel}>
                                                Grade
                                            </Text>
                                            <View
                                                style={[
                                                    styles.gradePill,
                                                    {
                                                        borderColor:
                                                            grade.color,
                                                        backgroundColor: `${grade.color}22`,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.gradeText,
                                                        { color: grade.color },
                                                    ]}
                                                >
                                                    {grade.label}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.progressRow}>
                                        <Text style={styles.progressLabel}>
                                            Accuracy
                                        </Text>
                                        <Text style={styles.progressLabel}>
                                            {correctPct}%
                                        </Text>
                                    </View>
                                    <ProgressBar value={correctPct} />
                                </Pressable>
                            </>
                        )
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Ionicons
                                name="document-text-outline"
                                size={28}
                                color="#94a3b8"
                            />
                            <Text style={styles.emptyTitle}>
                                No attempts yet
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                Complete a quiz and history will appear.
                            </Text>
                        </View>
                    }
                />
            </View>
        </>
    )
}

// ---------- Styles (unchanged) ---------- //
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0b1220' },
    center: { alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 8, color: '#cbd5e1' },
    errorText: { color: '#fecaca', fontWeight: '600' },
    header: {
        paddingTop: 56,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { color: '#e2e8f0', fontSize: 22, fontWeight: '700' },
    statsRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
    statCard: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    statLabel: { color: '#94a3b8', fontSize: 12 },
    statValue: {
        color: '#e5e7eb',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#0b1220',
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    cardHeader: { marginBottom: 8 },
    cardTitle: { color: '#e5e7eb', fontSize: 16, fontWeight: '700' },
    dateText: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    metricBox: { flex: 1 },
    metricLabel: { color: '#94a3b8', fontSize: 12 },
    metricValue: {
        color: '#e5e7eb',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    gradePill: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
    },
    gradeText: { fontSize: 12, fontWeight: '700' },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressLabel: { color: '#94a3b8', fontSize: 12 },
    progressTrack: {
        height: 8,
        backgroundColor: '#1f2937',
        borderRadius: 999,
        overflow: 'hidden',
        marginTop: 6,
    },
    progressThumb: { height: 8, backgroundColor: '#22c55e' },
    emptyWrap: { alignItems: 'center', paddingVertical: 48, gap: 8 },
    emptyTitle: { color: '#cbd5e1', fontSize: 16, fontWeight: '700' },
    emptySubtitle: { color: '#94a3b8' },
})
