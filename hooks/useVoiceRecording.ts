
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface RecordingResult {
  transcript: string;
  error: string | null;
}

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async (): Promise<{ error: string | null }> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        return { error: 'Permission to access microphone was denied' };
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to start recording' };
    }
  };

  const stopRecording = async (): Promise<RecordingResult> => {
    try {
      if (!recordingRef.current) {
        return { transcript: '', error: 'No active recording' };
      }

      setIsRecording(false);
      setIsProcessing(true);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) {
        setIsProcessing(false);
        return { transcript: '', error: 'Failed to get recording URI' };
      }

      // Read file as base64
      const FileSystem = await import('expo-file-system');
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send to speech-to-text service
      const result = await transcribeAudio(base64Audio);
      setIsProcessing(false);
      return result;
    } catch (err) {
      setIsProcessing(false);
      return { transcript: '', error: err instanceof Error ? err.message : 'Failed to stop recording' };
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
}

async function transcribeAudio(base64Audio: string): Promise<RecordingResult> {
  try {
    const { getSupabaseClient } = await import('@/template');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { audio: base64Audio },
    });

    if (error) {
      const { FunctionsHttpError } = await import('@supabase/supabase-js');
      let errorMessage = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const statusCode = error.context?.status ?? 500;
          const textContent = await error.context?.text();
          errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
        } catch {
          errorMessage = `${error.message || 'Failed to read response'}`;
        }
      }
      return { transcript: '', error: errorMessage };
    }

    return { transcript: data.transcript, error: null };
  } catch (err) {
    return { transcript: '', error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}
