import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Grade } from '@/types';
import { Button } from '@/components/ui/Button';

interface GradeSelectorProps {
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
}

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'college'];

export function GradeSelector({ selectedGrade, onSelectGrade }: GradeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Class</Text>
      <Text style={styles.subtitle}>Scroll to see all grades →</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
        {grades.map((grade) => (
          <Button
            key={grade}
            title={grade === 'college' ? 'College' : `${grade}`}
            onPress={() => onSelectGrade(grade)}
            variant={selectedGrade === grade ? 'primary' : 'outline'}
            style={styles.gradeButton}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  gradeButton: {
    minWidth: 60,
    paddingHorizontal: spacing.lg,
  },
});
