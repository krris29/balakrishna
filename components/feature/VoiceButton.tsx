import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onPress: () => void;
}

export function VoiceButton({ isRecording, isProcessing, onPress }: VoiceButtonProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording && styles.recordingButton,
        ]}
        onPress={onPress}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <MaterialIcons
            name={isRecording ? 'stop' : 'mic'}
            size={48}
            color={colors.surface}
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Text style={styles.text}>
        {isProcessing ? 'Processing...' : isRecording ? 'Tap to Stop' : 'Tap to Speak'}
      </Text>
      
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  recordingButton: {
    backgroundColor: colors.recording,
  },
  text: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.textSecondary,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.recordingLight,
    borderRadius: borderRadius.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.recording,
  },
  recordingText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.recording,
  },
});
