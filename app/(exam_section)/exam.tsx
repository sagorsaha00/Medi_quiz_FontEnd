import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';

import { BACKENDURL } from '../../config/config';

import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Types
interface Question {
  id: string;
  question: string;
  options: string[] | { [key: string]: string } | any;
  answer: string;
  category?: string;
}

interface Answers {
  [key: string]: string; // questionId -> selected option
}

interface QuestionCardProps {
  question: Question;
  answers: Answers;
  onSelect: (qId: string, option: string) => void;
  quizEnded: boolean;
  questionNumber: number;
}

// Helper function to normalize options
const normalizeOptions = (options: any): string[] => {
  if (!options) return [];

  if (Array.isArray(options)) {
    return options;
  }

  if (typeof options === 'object') {
    return Object.values(options);
  }

  return [];
};

// Question card component
const QuestionCard = memo<QuestionCardProps>(
  ({ question, answers, onSelect, quizEnded, questionNumber }) => {
    const isAnswered = answers[question.id] !== undefined;
    const normalizedOptions = normalizeOptions(question.options);

    if (normalizedOptions.length === 0) {
      return (
        <View style={styles.card}>
          <Text style={styles.qNumber}>Question {questionNumber}</Text>
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.errorText}>
            No options available for this question
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.qNumber}>Question {questionNumber}</Text>
        <Text style={styles.question}>{question.question}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>
            Category: {question.category || 'General'}
          </Text>
        </View>

        {normalizedOptions.map((opt, idx) => {
          const isSelected = answers[question.id] === opt;
          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionBtn,
                isSelected && styles.selectedOption,
                (isAnswered || quizEnded) &&
                  !isSelected &&
                  styles.disabledOption,
              ]}
              disabled={isAnswered || quizEnded}
              onPress={() => onSelect(question.id, opt)}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLetter,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {optionLetter}
                </Text>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {opt}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

QuestionCard.displayName = 'QuestionCard';

// Main Exam Section
export default function ExamSection() {
  const params = useLocalSearchParams<{ subject: string }>();
  const subject = params.subject;
  const [answers, setAnswers] = useState<Answers>({});
  const [quizEnded, setQuizEnded] = useState(false);
  const [globalTime, setGlobalTime] = useState(600); // 10 minutes
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Use BACKENDURL from .env
  console.log('backendUrl', { BACKENDURL });

  // Fetch quiz questions
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${BACKENDURL}/quiz?category=${encodeURIComponent(subject)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response || response.status !== 200) {
          throw new Error(`Error fetching quiz: ${response.statusText}`);
        }
        const result = response.json();
        console.log('result', result);

        return result;
      } catch (err) {
        console.log('others problem');
        console.error('Fetch error:', err);
        throw err;
      }
    },
    retry: 2,
  });

  const questions: Question[] = data?.questions || [];

  // Timer effect
  useEffect(() => {
    if (globalTime > 0 && !quizEnded) {
      const timer = setTimeout(() => setGlobalTime((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (globalTime === 0 && !quizEnded) {
      handleAutoSubmit();
    }
  }, [globalTime, quizEnded]);

  // Handle option selection
  const handleSelect = useCallback(
    (qId: string, option: string) => {
      if (quizEnded) return;
      if (answers[qId]) return; // prevent changing answer
      setAnswers((prev) => ({ ...prev, [qId]: option }));
    },
    [answers, quizEnded]
  );

  // Auto submit when time runs out
  const handleAutoSubmit = useCallback(() => {
    setQuizEnded(true);
    calculateAndShowScore();
  }, [answers, questions]);

  // Calculate and show score
  const calculateAndShowScore = useCallback(() => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    alert(
      `Quiz Finished! Score: ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%)`
    );

    // Navigate to result page
    router.push({
      pathname: '/result',
      params: {
        score: score.toString(),
        wrong: (questions.length - score).toString(),
        total: questions.length.toString(),
        percentage: Math.round((score / questions.length) * 100).toString(),
      },
    });
  }, [answers, questions]);

  // Submit quiz
  const handleSubmit = useCallback(() => {
    const unansweredQuestions = questions.length - Object.keys(answers).length;

    if (unansweredQuestions > 0) {
      alert(
        `You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`
      );
      setShowSubmitConfirm(true);
      return;
    }

    setQuizEnded(true);
    calculateAndShowScore();
  }, [answers, questions, calculateAndShowScore]);

  // Confirm submit
  const confirmSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    setQuizEnded(true);
    calculateAndShowScore();
  }, [calculateAndShowScore]);

  // Format time display
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progressPercentage = questions.length
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (globalTime <= 60) return '#ff4757'; // Red for last minute
    if (globalTime <= 180) return '#ffa502'; // Orange for last 3 minutes
    return '#6c63ff'; // Default purple
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c63ff" />
          <Text style={styles.loadingText}>Loading quiz questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#ff4757" />
          <Text style={styles.errorTitle}>Error Loading Quiz</Text>
          <Text style={styles.errorMessage}>
            Failed to load quiz questions. Please check your internet connection
            and try again.
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="document-text" size={50} color="#6c63ff" />
          <Text style={styles.errorTitle}>No Questions Available</Text>
          <Text style={styles.errorMessage}>
            No quiz questions were found. Please try again later.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer */}
      <View
        style={[styles.globalTimerBox, { backgroundColor: getTimerColor() }]}
      >
        <Ionicons name="time-outline" size={20} color="#fff" />
        <Text style={styles.globalTimerText}>
          Time Left: {formatTime(globalTime)}
        </Text>
        {globalTime <= 60 && (
          <Ionicons
            name="warning"
            size={16}
            color="#fff"
            style={{ marginLeft: 5 }}
          />
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {Object.keys(answers).length}/{questions.length} (
          {progressPercentage}%)
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>
        {Object.keys(answers).length < questions.length && (
          <Text style={styles.remainingText}>
            {questions.length - Object.keys(answers).length} questions remaining
          </Text>
        )}
      </View>

      {/* Questions */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            answers={answers}
            onSelect={handleSelect}
            quizEnded={quizEnded}
            questionNumber={index + 1}
          />
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            quizEnded && styles.disabledSubmitBtn,
            Object.keys(answers).length === 0 && styles.disabledSubmitBtn,
          ]}
          onPress={handleSubmit}
          disabled={quizEnded}
        >
          <Text style={styles.submitText}>
            {quizEnded ? 'Quiz Ended' : 'Submit Quiz'}
          </Text>
          {!quizEnded && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>

        {/* Confirmation Modal Placeholder */}
        {showSubmitConfirm && (
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmText}>
              Submit quiz with unanswered questions?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowSubmitConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmSubmit}
              >
                <Text style={styles.confirmBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
    marginTop: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4757',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#6c63ff',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  retryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  globalTimerBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  globalTimerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 4,
    
  },
  remainingText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  qNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6c63ff',
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  categoryContainer: {
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6c63ff',
    fontWeight: '500',
  },
  optionBtn: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#6c63ff',
    borderColor: '#5a52ff',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c63ff',
    marginRight: 10,
    minWidth: 20,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#6c63ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#6c63ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledSubmitBtn: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#6c63ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
