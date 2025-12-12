import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

type Curriculum = 'CBSE' | 'ICSE' | 'IB' | 'AP State' | 'KA State' | 'TS State';
type Grade = number;
type Subject = 'Math' | 'Science' | 'Finance';

// Structure: { title: string, subtopics?: string[] }
// Or simple string for backward compatibility/simplicity where no subtopics exist.
// For the updated request, we will normalize everything to objects with subtopics.

const SYLLABUS_DATA = {
    CBSE: {
        5: {
            Math: [
                { title: 'The Fish Tale', subtopics: ['Drawing fish', 'Shapes'] },
                { title: 'Shapes and Angles', subtopics: ['Types of angles', 'Shapes'] },
                // ... map others similarly or keep as strings if strictly needed, but let's conform to object for consistency in rendering
            ],
            // ... (rest of CBSE data)
        }
    },
    ICSE: {
        5: {
            Math: [
                { title: 'Large Numbers' }, { title: 'Operations with Large Numbers' }, //...
            ],
            Science: [
                {
                    title: 'Human Body: The Circulatory System',
                    subtopics: [
                        'Heart - Structure & Function',
                        'Blood Vessels - Arteries, Veins, Capillaries',
                        'Blood - Components (RBC, WBC, Platelets)',
                        'Circulation Process',
                        'Healthy Heart Habits'
                    ]
                },
                { title: 'Human Body: The Skeletal System' },
                { title: 'Food and Health', subtopics: ['Nutrients', 'Balanced Diet', 'Deficiency Diseases'] },
                { title: 'Pollination' },
                // ...
            ]
        }
    },
    // Adding Finance for everyone (example)
    Finance: {
        ALL: [
            { title: 'Money Basics', subtopics: ['What is Money?', 'History of Money', 'Currencies'] },
            { title: 'Needs vs. Wants', subtopics: ['Identifying Needs', 'Identifying Wants', 'Prioritizing Spending'] },
            { title: 'Piggy Bank Savings', subtopics: ['Why Save?', 'Setting Goals', 'Tracking Savings'] },
            { title: 'Budgeting for Kids', subtopics: ['My Weekly Budget', 'Spending Wisely'] },
            { title: 'Earning Money', subtopics: ['Chores & Allowance', 'Small Jobs'] },
        ]
    }
};

// Helper to normalize data since I'm mixing some new structure with potential old data if I had kept it.
// But I'm going to hardcode the "Finance" check to pull from a special key if subject is Finance.

export default function SyllabusScreen() {
    const insets = useSafeAreaInsets();

    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum>('CBSE');
    const [selectedGrade, setSelectedGrade] = useState<Grade>(5);
    const [selectedSubject, setSelectedSubject] = useState<Subject>('Math');

    // completedTopics set will store strings like "Topic Title" or "Topic Title:Subtopic"
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

    // Subtopic Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    // Dynamic Data Retrieval
    let topicsData: any[] = [];
    if (selectedSubject === 'Finance') {
        topicsData = (SYLLABUS_DATA as any).Finance?.ALL || [];
    } else {
        const rawData = (SYLLABUS_DATA as any)[selectedCurriculum]?.[selectedGrade]?.[selectedSubject];
        if (rawData) {
            // Normalize strings to objects if any
            topicsData = rawData.map((item: any) =>
                typeof item === 'string' ? { title: item } : item
            );
        } else {
            topicsData = [{ title: "Topics coming soon for this selection..." }];
        }
    }

    const toggleCompletion = (id: string) => {
        const newSet = new Set(completedTopics);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setCompletedTopics(newSet);
    };

    const handleTopicPress = (topic: any) => {
        if (topic.title.includes("coming soon")) return;

        if (topic.subtopics && topic.subtopics.length > 0) {
            setSelectedTopic(topic);
            setModalVisible(true);
        } else {
            toggleCompletion(topic.title);
        }
    };

    const getProgress = () => {
        if (topicsData.length === 0 || topicsData[0].title.includes("coming soon")) return 0;

        // Count total items (topics + subtopics)
        let totalItems = 0;
        let completedItems = 0;

        topicsData.forEach(topic => {
            if (topic.subtopics) {
                totalItems += topic.subtopics.length;
                topic.subtopics.forEach((sub: string) => {
                    if (completedTopics.has(`${topic.title}:${sub}`)) completedItems++;
                });
            } else {
                totalItems++;
                if (completedTopics.has(topic.title)) completedItems++;
            }
        });

        return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    };

    const renderSubtopicModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedTopic?.title}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalSubtitle}>Study subtopics one by one:</Text>
                    <ScrollView contentContainerStyle={styles.subtopicList}>
                        {selectedTopic?.subtopics?.map((sub: string, index: number) => {
                            const id = `${selectedTopic.title}:${sub}`;
                            const isDone = completedTopics.has(id);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.subtopicCard}
                                    onPress={() => toggleCompletion(id)}
                                >
                                    <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
                                        {isDone && <MaterialIcons name="check" size={16} color="white" />}
                                    </View>
                                    <Text style={[styles.subtopicText, isDone && styles.topicTextDone]}>{sub}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Syllabus</Text>
                <Text style={styles.subtitle}>Track your learning path</Text>
            </View>

            <View style={styles.selectors}>
                {/* Curriculum Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                    {(['CBSE', 'ICSE', 'IB', 'AP State', 'KA State', 'TS State'] as Curriculum[]).map((c) => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.chip, selectedCurriculum === c && styles.chipActive]}
                            onPress={() => setSelectedCurriculum(c)}
                        >
                            <Text style={[styles.chipText, selectedCurriculum === c && styles.chipTextActive]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Grade Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.chip, styles.chipSmall, selectedGrade === g && styles.chipActive]}
                            onPress={() => setSelectedGrade(g)}
                        >
                            <Text style={[styles.chipText, selectedGrade === g && styles.chipTextActive]}>{g}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Subject Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                    {(['Math', 'Science', 'Finance'] as Subject[]).map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.chip, selectedSubject === s && styles.chipActive]}
                            onPress={() => setSelectedSubject(s)}
                        >
                            <Text style={[styles.chipText, selectedSubject === s && styles.chipTextActive]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.progressSection}>
                <Text style={styles.progressText}>Total Progress: {getProgress()}%</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${getProgress()}%` }]} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {topicsData.map((topic: any, index: number) => {
                    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
                    // If no subtopics, check if main topic is done. If subtopics, check if ALL are done for visual cue (optional, simplified here)
                    const isMainDone = !hasSubtopics && completedTopics.has(topic.title);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.topicCard}
                            onPress={() => handleTopicPress(topic)}
                        >
                            <View style={[
                                styles.iconBox,
                                isMainDone ? styles.iconBoxDone : (hasSubtopics ? styles.iconBoxSub : styles.iconBoxPending)
                            ]}>
                                {isMainDone ? (
                                    <MaterialIcons name="check" size={20} color="white" />
                                ) : (
                                    <MaterialIcons name={hasSubtopics ? "list" : "article"} size={20} color={hasSubtopics ? colors.primary : colors.textSecondary} />
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.topicText, isMainDone && styles.topicTextDone]}>
                                    {topic.title}
                                </Text>
                                {hasSubtopics && (
                                    <Text style={styles.subtopicHint}>
                                        {topic.subtopics.length} subtopics - Tap to view
                                    </Text>
                                )}
                            </View>
                            {hasSubtopics && <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />}
                        </TouchableOpacity>
                    );
                })}
                {topicsData[0].title.includes("coming soon") && (
                    <Text style={styles.emptyText}>Tap &apos;ICSE&apos; -&gt; &apos;Science&apos; or &apos;Finance&apos; to see new features.</Text>
                )}
            </ScrollView>

            {renderSubtopicModal()}

            <View style={styles.footer}>
                <Text style={styles.footerText}>Select a topic to start learning.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: typography.xl,
        fontWeight: 'bold',
        color: colors.text,
    },
    subtitle: {
        fontSize: typography.sm,
        color: colors.textSecondary,
    },
    selectors: {
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: spacing.sm,
    },
    selectorRow: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        paddingBottom: spacing.xs
    },
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    chipSmall: {
        minWidth: 40,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: typography.sm,
        color: colors.text,
    },
    chipTextActive: {
        color: colors.surface,
        fontWeight: 'bold',
    },
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
        ...shadows.sm,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    iconBoxPending: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconBoxDone: {
        backgroundColor: colors.primary,
    },
    iconBoxSub: {
        backgroundColor: '#E3F2FD',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        borderColor: colors.textSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    topicText: {
        fontSize: typography.md,
        color: colors.text,
        fontWeight: '500',
    },
    topicTextDone: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    subtopicHint: {
        fontSize: typography.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: spacing.xl,
        fontStyle: 'italic'
    },
    progressSection: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
    },
    progressText: {
        fontSize: typography.sm,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
        color: colors.primary
    },
    progressBarBg: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        width: '100%',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full
    },
    footer: {
        padding: spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    footerText: {
        fontSize: typography.xs,
        color: colors.textSecondary
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        maxHeight: '80%',
        padding: spacing.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    modalTitle: {
        fontSize: typography.xl,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
    },
    modalSubtitle: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    subtopicList: {
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    subtopicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
    },
    subtopicText: {
        fontSize: typography.md,
        color: colors.text,
        flex: 1,
    },
    closeButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    closeButtonText: {
        color: colors.surface,
        fontWeight: 'bold',
        fontSize: typography.md,
    }
});
