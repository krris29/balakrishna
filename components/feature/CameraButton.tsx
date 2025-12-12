import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, borderRadius, shadows, spacing } from '@/constants/theme';

interface CameraButtonProps {
    onImageSelected: (uri: string) => void;
    isProcessing: boolean;
}

export const CameraButton: React.FC<CameraButtonProps> = ({ onImageSelected, isProcessing }) => {
    const handlePress = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant permission to access your photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onImageSelected(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image.');
        }
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            disabled={isProcessing}
        >
            {isProcessing ? (
                <ActivityIndicator color={colors.surface} size="large" />
            ) : (
                <MaterialIcons name="camera-alt" size={32} color={colors.surface} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
});
