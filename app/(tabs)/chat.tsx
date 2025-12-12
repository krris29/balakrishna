import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { GradeSelector } from '@/components/feature/GradeSelector';
import { SubjectSelector } from '@/components/feature/SubjectSelector';
import { CameraButton } from '@/components/feature/CameraButton';
import { ChatMessage } from '@/components/feature/ChatMessage';
// import { useVoiceRecording } from '@/hooks/useVoiceRecording'; // Removed as per request
import { askDoubt, translateText } from '@/services/aiService';
import { Message, Grade, Subject } from '@/types';
import { useAlert } from '@/template';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const scrollViewRef = useRef<ScrollView>(null);

  const [grade, setGrade] = useState<Grade>(5);
  const [subject, setSubject] = useState<Subject>('math');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording(); // Removed

  const handleImageSelected = async (uri: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Analyzing this formula...',
      imageUri: uri,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessingImage(true);

    // Mock AI Detection & Response
    setTimeout(() => {
      // Simulate detected content
      const mockAnswer = `**Formula Detected**\n\nI see a quadratic equation in your image!\n\n**Problem:**\nFind the roots of: $$x^2 - 5x + 6 = 0$$\n\n**Step-by-Step Solution:**\n1. **Factorize:**\n   Find two numbers that multiply to 6 and add to -5.\n   These numbers are -2 and -3.\n   $$(x - 2)(x - 3) = 0$$\n\n2. **Solve for x:**\n   - $$x - 2 = 0 \\implies x = 2$$\n   - $$x - 3 = 0 \\implies x = 3$$\n\n**Final Answer:**\nThe roots are **2** and **3**.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockAnswer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessingImage(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2500);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoadingAnswer(true);

    const { answer, error } = await askDoubt(userMessage.content, subject, grade);

    if (error) {
      showAlert('Error', error);
      setIsLoadingAnswer(false);
      return;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
    };

    // Translate to Telugu
    const { translatedText } = await translateText(answer, 'telugu');
    if (translatedText) {
      assistantMessage.translatedContent = translatedText;
    }

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoadingAnswer(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const containerPaddingTop = Math.max(1, insets.top + spacing.lg);
  const containerPaddingBottom = Math.max(1, insets.bottom + spacing.lg);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: containerPaddingTop }]}>
        <View style={styles.headerContent}>
          <MaterialIcons name="school" size={32} color={colors.primary} />
          <Text style={styles.headerTitle}>EduAssist</Text>
        </View>
        <Text style={styles.headerSubtitle}>Your AI Learning Companion</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GradeSelector selectedGrade={grade} onSelectGrade={setGrade} />
        <SubjectSelector selectedSubject={subject} onSelectSubject={setSubject} />

        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.quoteContainer}>
              <MaterialIcons name="format-quote" size={48} color={colors.primary} />
              <Text style={styles.quoteText}>
                <Text style={styles.quoteBold}>Science</Text> is the Curiosity {"\n"}
                <Text style={styles.quoteLight}>(How the world works)</Text>{"\n\n"}
                <Text style={styles.quoteBold}>Math</Text> is the Language {"\n"}
                <Text style={styles.quoteLight}>(How to measure it)</Text>{"\n\n"}
                <Text style={styles.quoteBold}>Computers</Text> are the Tool {"\n"}
                <Text style={styles.quoteLight}>(How to build it)</Text>{"\n\n"}
                Master all three, and you don&apos;t just watch the future—{"\n"}
                <Text style={styles.quoteBold}>you invent it.</Text>
              </Text>
            </View>
            <View style={styles.divider} />
            <MaterialIcons name="wb-incandescent" size={64} color={colors.secondary} />
            <Text style={styles.emptyTitle}>Ask Your Doubts!</Text>
            <Text style={styles.emptyText}>
              Snap a photo of a formula or type your question below. I will explain in simple words!
            </Text>
          </View>
        ) : (
          <View style={styles.messagesContainer}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} showTranslation />
            ))}
            {(isLoadingAnswer || isProcessingImage) && (
              <View style={styles.loadingMessage}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDotDelay1]} />
                <View style={[styles.typingDot, styles.typingDotDelay2]} />
              </View>
            )}
          </View>
        )}

        <View style={[styles.cofounder, { paddingBottom: containerPaddingBottom }]}>
          <Text style={styles.cofounderText}>Co-Founder: B Balakrishna</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: containerPaddingBottom }]}>
        <View style={styles.voiceSection}>
          <CameraButton
            isProcessing={isProcessingImage}
            onImageSelected={handleImageSelected}
          />
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Or type your question here..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoadingAnswer}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={inputText.trim() ? colors.surface : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    ...shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.lg,
  },
  quoteContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quoteText: {
    fontSize: typography.md,
    color: colors.text,
    textAlign: 'center',
    lineHeight: typography.md * 1.6,
    marginTop: spacing.md,
  },
  quoteBold: {
    fontWeight: typography.bold,
    color: colors.primary,
    fontSize: typography.lg,
  },
  quoteLight: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontStyle: 'italic',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: typography.md * 1.5,
  },
  messagesContainer: {
    gap: spacing.sm,
  },
  loadingMessage: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
    ...shadows.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.textSecondary,
  },
  typingDotDelay1: {
    opacity: 0.7,
  },
  typingDotDelay2: {
    opacity: 0.4,
  },
  footer: {
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.md,
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.md,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  cofounder: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cofounderText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
