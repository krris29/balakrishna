import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { useMockAuth } from '@/template/auth/mock/hook';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { signInWithPassword, signUpWithPassword, loading } = useMockAuth();
    const [error, setError] = useState<{ message: string } | null>(null);

    const handleAuth = async () => {
        setError(null);
        let result;
        if (isLogin) {
            result = await signInWithPassword(email, password);
        } else {
            result = await signUpWithPassword(email, password, { full_name: name });
        }

        if (result?.error) {
            setError({ message: result.error });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialIcons name="school" size={64} color={colors.primary} />
                    <Text style={styles.title}>EduAssist</Text>
                    <Text style={styles.subtitle}>Your Complete Learning Companion</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.formTitle}>{isLogin ? 'Welcome Back!' : 'Start Your Journey'}</Text>

                    {!isLogin && (
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {error && <Text style={styles.errorText}>{error.message}</Text>}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: spacing.sm,
    },
    subtitle: {
        fontSize: typography.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    form: {
        backgroundColor: colors.surface,
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        gap: spacing.lg,
    },
    formTitle: {
        fontSize: typography.xl,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: typography.md,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    buttonText: {
        fontSize: typography.lg,
        fontWeight: 'bold',
        color: colors.surface,
    },
    switchButton: {
        alignItems: 'center',
    },
    switchText: {
        fontSize: typography.sm,
        color: colors.primary,
    },
    errorText: {
        color: '#FF4444',
        fontSize: typography.sm,
        textAlign: 'center',
    },
});
