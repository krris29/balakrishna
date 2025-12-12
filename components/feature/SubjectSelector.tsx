import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { Subject } from '@/types';

interface SubjectSelectorProps {
  selectedSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
}

export function SubjectSelector({ selectedSubject, onSelectSubject }: SubjectSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Subject</Text>
      <View style={styles.subjects}>
        <TouchableOpacity
          style={[
            styles.subjectCard,
            selectedSubject === 'math' && styles.selectedCard,
            { backgroundColor: selectedSubject === 'math' ? colors.math : colors.surface },
          ]}
          onPress={() => onSelectSubject('math')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="calculator"
            size={48}
            color={selectedSubject === 'math' ? colors.surface : colors.math}
          />
          <Text style={[styles.subjectText, selectedSubject === 'math' && styles.selectedText]}>
            Math
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subjectCard,
            selectedSubject === 'science' && styles.selectedCard,
            { backgroundColor: selectedSubject === 'science' ? colors.science : colors.surface },
          ]}
          onPress={() => onSelectSubject('science')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="flask"
            size={48}
            color={selectedSubject === 'science' ? colors.surface : colors.science}
          />
          <Text style={[styles.subjectText, selectedSubject === 'science' && styles.selectedText]}>
            Science
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subjectCard,
            selectedSubject === 'computer' && styles.selectedCard,
            { backgroundColor: selectedSubject === 'computer' ? colors.computer : colors.surface },
          ]}
          onPress={() => onSelectSubject('computer')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="laptop"
            size={48}
            color={selectedSubject === 'computer' ? colors.surface : colors.computer}
          />
          <Text style={[styles.subjectText, selectedSubject === 'computer' && styles.selectedText]}>
            Computer
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  subjects: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  subjectCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  selectedCard: {
    ...shadows.lg,
  },
  subjectText: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  selectedText: {
    color: colors.surface,
  },
});
