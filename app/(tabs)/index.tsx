import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { router } from 'expo-router';
import { useMockAuth } from '@/template/auth/mock/hook';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useMockAuth();

  const userName = (user as any)?.user_metadata?.full_name || 'Student';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}!</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.profileButton}>
          <MaterialIcons name="logout" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Topics Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5hr</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity style={styles.continueCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <MaterialIcons name="functions" size={24} color="#2196F3" />
          </View>
          <View style={styles.continueInfo}>
            <Text style={styles.continueSubject}>Mathematics - Class 5</Text>
            <Text style={styles.continueTopic}>Fractions & Decimals</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>
          <MaterialIcons name="play-circle-filled" size={32} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Curriculum</Text>
        <View style={styles.curriculumGrid}>
          {['CBSE', 'ICSE', 'IB', 'AP State', 'KA State', 'TS State'].map((board) => (
            <TouchableOpacity
              key={board}
              style={styles.boardCard}
              onPress={() => router.push('/(tabs)/syllabus')}
            >
              <Text style={styles.boardText}>{board}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  greeting: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    padding: spacing.sm,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueInfo: {
    flex: 1,
  },
  continueSubject: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  continueTopic: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  curriculumGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap'
  },
  boardCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border
  },
  boardText: {
    color: colors.text,
    fontWeight: '600'
  }
});
