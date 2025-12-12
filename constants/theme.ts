export const colors = {
  // Primary colors - vibrant and kid-friendly
  primary: '#FF6B6B',
  primaryDark: '#E85555',
  primaryLight: '#FFB3B3',
  
  secondary: '#4ECDC4',
  secondaryDark: '#3AB8AF',
  secondaryLight: '#7FE0D8',
  
  // Subject colors
  math: '#FFD93D',
  science: '#6BCB77',
  computer: '#9B59B6',
  
  // Background
  background: '#F8F9FA',
  backgroundDark: '#1A1A2E',
  
  // Surface
  surface: '#FFFFFF',
  surfaceDark: '#16213E',
  
  // Text
  text: '#2D3436',
  textDark: '#FFFFFF',
  textSecondary: '#636E72',
  textSecondaryDark: '#B2BEC3',
  
  // Status
  success: '#00B894',
  error: '#D63031',
  warning: '#FDCB6E',
  info: '#74B9FF',
  
  // Borders
  border: '#DFE6E9',
  borderDark: '#2D3436',
  
  // Recording
  recording: '#FF3B3F',
  recordingLight: '#FFE5E6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
