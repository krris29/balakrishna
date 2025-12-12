import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    variant === 'danger' && styles.dangerButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    variant === 'danger' && styles.dangerText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.surface} />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    minHeight: 48,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.surface,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.surface,
  },
});
