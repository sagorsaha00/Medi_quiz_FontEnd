import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'BackendUrl/quiz/createQuiz';

export default function QuizAddScreen() {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [explanation, setExplanation] = useState('');

  const categories = [
    {
      id: 'Biology',
      label: 'জীববিজ্ঞান',
      icon: 'leaf-outline',
      color: '#4CAF50',
    },
    {
      id: 'Chemistry',
      label: 'রসায়ন',
      icon: 'flask-outline',
      color: '#FF9800',
    },
    {
      id: 'GK',
      label: 'সাধারণ জ্ঞান',
      icon: 'earth-outline',
      color: '#2196F3',
    },
    { id: 'History', label: 'ইতিহাস', icon: 'book-outline', color: '#9C27B0' },
    {
      id: 'Physics',
      label: 'পদার্থবিজ্ঞান',
      icon: 'speedometer-outline',
      color: '#E91E63',
    },
  ];

  const handleCreateQuestion = async () => {
    if (
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !correctAnswer ||
      !category
    ) {
      return Alert.alert('ত্রুটি ⚠️', 'সব ঘর পূরণ করুন');
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
          category,
          explanation,
        }),
      });

      const data = await response.json();
      console.log('data', data);
      if (data.success) {
        Alert.alert('✅ সফল', 'প্রশ্ন সফলভাবে যুক্ত হয়েছে!');
        setQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setCorrectAnswer('');
        setCategory('');
        setExplanation('');
      } else {
        Alert.alert('ত্রুটি', data.message);
      }
    } catch (err) {
      Alert.alert('ত্রুটি', 'প্রশ্ন সংরক্ষণ করা যায়নি');
    }
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#0b1220' }}
      >
      <StatusBar style="light" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, marginTop: 30 }}>
          <Text style={styles.title}>➕ নতুন কুইজ প্রশ্ন যুক্ত করুন</Text>

          {/* ইনপুট ফিল্ডগুলো */}
          <TextInput
            placeholder="প্রশ্ন লিখুন"
            placeholderTextColor="#aaa"
            value={question}
            onChangeText={setQuestion}
            style={styles.input}
          />
          <TextInput
            placeholder="অপশন A"
            placeholderTextColor="#aaa"
            value={optionA}
            onChangeText={setOptionA}
            style={styles.input}
          />
          <TextInput
            placeholder="অপশন B"
            placeholderTextColor="#aaa"
            value={optionB}
            onChangeText={setOptionB}
            style={styles.input}
          />
          <TextInput
            placeholder="অপশন C"
            placeholderTextColor="#aaa"
            value={optionC}
            onChangeText={setOptionC}
            style={styles.input}
          />
          <TextInput
            placeholder="অপশন D"
            placeholderTextColor="#aaa"
            value={optionD}
            onChangeText={setOptionD}
            style={styles.input}
          />

          <TextInput
            placeholder="সঠিক উত্তর (A/B/C/D)"
            placeholderTextColor="#aaa"
            value={correctAnswer}
            onChangeText={(text) => setCorrectAnswer(text.toUpperCase())}
            style={styles.input}
          />

          {/* ✅ ক্যাটাগরি সিলেক্ট (Modern Design) */}
          <Text style={styles.subTitle}>📚 ক্যাটাগরি নির্বাচন করুন</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  category === cat.id && { backgroundColor: cat.color },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={22}
                  color={category === cat.id ? '#fff' : cat.color}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.id && { color: '#fff' },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ব্যাখ্যা */}
          <TextInput
            placeholder="ব্যাখ্যা (ঐচ্ছিক)"
            placeholderTextColor="#aaa"
            value={explanation}
            onChangeText={setExplanation}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          {/* Gradient Button */}
          <TouchableOpacity onPress={handleCreateQuestion} activeOpacity={0.8}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>💾 প্রশ্ন সংরক্ষণ করুন</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider} />
        </ScrollView>
        <StatusBar style="dark" />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ddd',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    width: '48%',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#ccc',
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00f2fe',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
});
