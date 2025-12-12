export type Subject = 'math' | 'science' | 'computer';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'college';

export type Language = 'english' | 'telugu';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audio?: string; // Base64 audio data
  translatedContent?: string;
  imageUri?: string;
}

export interface UserSettings {
  grade: Grade;
  subject: Subject;
  language: Language;
}
