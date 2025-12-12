import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  onTranslate?: (messageId: string) => void;
  showTranslation?: boolean;
}

export function ChatMessage({ message, onTranslate, showTranslation }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [showOriginal, setShowOriginal] = useState(true);

  const displayContent = showTranslation && message.translatedContent && !showOriginal
    ? message.translatedContent
    : message.content;

  const markdownStyles = {
    body: {
      fontSize: typography.md,
      lineHeight: typography.md * 1.5,
      color: colors.text,
    },
    heading1: {
      fontSize: typography.xl,
      fontWeight: 'bold' as const,
      color: colors.primary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    heading2: {
      fontSize: typography.lg,
      fontWeight: 'bold' as const,
      color: colors.primary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    heading3: {
      fontSize: typography.md,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    paragraph: {
      marginBottom: spacing.sm,
    },
    list_item: {
      marginBottom: spacing.xs,
    },
    bullet_list: {
      marginBottom: spacing.sm,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: colors.text,
    },
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}

        {isUser ? (
          <Text style={[styles.text, styles.userText]}>
            {displayContent}
          </Text>
        ) : (
          <Markdown style={markdownStyles}>
            {displayContent}
          </Markdown>
        )}

        {!isUser && onTranslate && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowOriginal(!showOriginal)}
            >
              <MaterialIcons
                name="translate"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.actionText}>
                {showOriginal ? 'తెలుగు' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.md,
    lineHeight: typography.md * 1.5,
  },
  userText: {
    color: colors.surface,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  actions: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
});
