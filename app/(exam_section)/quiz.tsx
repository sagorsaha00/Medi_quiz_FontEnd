import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { BACKENDURL } from '../../config/config';


interface Question {
  id: string; // Changed from _id to id to match API response
  question: string;
  options: Record<string, string>;
  category: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  questions: Question[];
  count: number;
  category: string;
}

interface SubmitResponse {
  success: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

const PracticeQuiz: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const params = useLocalSearchParams<{ subject: string }>();
  const subject = params.subject;
  console.log("subject",subject);

  console.log("selection",selectedOption);
  const BackendUrl = BACKENDURL;

  // 👉 Random Question Query
  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['quiz'],
    queryFn: async (): Promise<ApiResponse> => {
      try {
        const response = await fetch(
          `${BackendUrl}/quiz?category=${encodeURIComponent(subject)}`
        );
        if (!response || response.status !== 200) {
          throw new Error(`Error fetching quiz: ${response.statusText}`);
        }
        const result = await response.json();
        
        return result;
      } catch (err) {
        console.log('Error fetching question');
        console.error('Fetch error:', err);
        throw err;
      }
    },
    retry: 2,
  });

  
  const submitMutation = useMutation({
    mutationFn: async ({
      questionId,
      selectedOption,
    }: {
      questionId: string;
      selectedOption: string;
    }) => {

      const res = await axios.post<SubmitResponse>(
        `http://192.168.1.104:3000/quiz/submitRandomQuiz`,
        { questionId, selectedOption }
      );
      console.log("res",res.data);
      return res.data;
    },
    retry: 1,
  });

  console.log("submitMutation",submitMutation.data);

  // Get current question from the questions array
  const questionData = apiData?.questions?.[currentQuestionIndex];

  const handleSelect = (optionKey: string) => {
    if (selectedOption || !questionData) return;
    setSelectedOption(optionKey);
    submitMutation.mutate({
      questionId: questionData.id,
      selectedOption: optionKey,
    });
  };

  // 👉 UI
  if (isLoading) {
    return (
    <>
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    </>
    );
  }

  if (isError || !apiData?.success) {
    return (
<>
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading questions</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
</>
    );
  }

  if (!questionData) {
    return (
    <>
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>No questions available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Load Questions</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
    );
  }

  const optionsArray = questionData.options
    ? Object.entries(questionData.options)
    : [];

  return (
   <>
    <SafeAreaView style={styles.container}>
   <StatusBar barStyle="dark-content"></StatusBar>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of{' '}
          {apiData?.questions?.length || 0}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questionData.question}</Text>
        <Text style={styles.categoryText}>📚 {questionData.category}</Text>
      </View>

      {/* Options */}
      <View key={questionData.id} style={styles.optionsContainer}>
        {optionsArray.map(([key, value]) => {
          const isSelected = selectedOption === key;
          const isCorrect =
            submitMutation.data?.correctAnswer === key &&
            submitMutation.data?.isCorrect;
          const isWrong =
            isSelected && submitMutation.data && !submitMutation.data.isCorrect;

          let buttonStyle = styles.optionButton;
          let textStyle = styles.optionText;

          if (isCorrect) {
            buttonStyle = StyleSheet.flatten([
              styles.optionButton,
              styles.correctOption,
            ]);
            textStyle = StyleSheet.flatten([
              styles.optionText,
              styles.whiteText,
            ]);
          } else if (isWrong) {
            buttonStyle = StyleSheet.flatten([
              styles.optionButton,
              styles.wrongOption,
            ]);
            textStyle = StyleSheet.flatten([
              styles.optionText,
              styles.whiteText,
            ]);
          } else if (isSelected) {
            buttonStyle = StyleSheet.flatten([
              styles.optionButton,
              styles.selectedOption,
            ]);
          }

          return (
            <TouchableOpacity
              key={key}
              style={buttonStyle}
              disabled={!!selectedOption || submitMutation.isPending}
              onPress={() => handleSelect(key)}
              activeOpacity={0.8}
            >
              <Text style={textStyle}>
                {String(key)}. {String(value)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Loading state for submission */}
      {submitMutation.isPending && (
        <View style={styles.submissionLoadingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.submissionLoadingText}>Checking answer...</Text>
        </View>
      )}

      {/* Result */}
      {submitMutation.data && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {submitMutation.data.isCorrect ? '✅ Correct!' : '❌ Wrong Answer'}
          </Text>
          <Text style={styles.resultText}>
            Correct Answer: {submitMutation.data.correctAnswer}.{' '}
            {questionData.options[submitMutation.data.correctAnswer]}
          </Text>
          {submitMutation.data.explanation && (
            <Text style={styles.explanationText}>
              💡 {submitMutation.data.explanation}
            </Text>
          )}
        </View>
      )}

      {/* Next Question Button */}
      {submitMutation.data && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            setSelectedOption(null);
            if (
              apiData?.questions &&
              currentQuestionIndex < apiData.questions.length - 1
            ) {
              setCurrentQuestionIndex((prev) => prev + 1);
            } else {
              setCurrentQuestionIndex(0);
              refetch();
            }
            submitMutation.reset();
          }}
        >
          <Text style={styles.nextButtonText}>Next Question</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
   </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
  },
  centerContainer: {
    marginTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressText: {
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#6B7280',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  selectedOption: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
    marginBottom: 12,
  },
  correctOption: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#10B981',
    marginBottom: 12,
  },
  wrongOption: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '500',
  },
  whiteText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
  },
  submissionLoadingContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submissionLoadingText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#4B5563',
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
  },
});

export default PracticeQuiz;
