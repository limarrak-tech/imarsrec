import { ColorSchemeName } from 'react-native';
import { AppTheme } from './types';

export const lightTheme: AppTheme = {
  accent: '#1A73E8',
  accentLight: '#E8F0FE',
  danger: '#D93025',
  dangerLight: '#FCE8E6',
  success: '#1E8E3E',
  successLight: '#E6F4EA',
  warning: '#F29900',
  warningLight: '#FEF7E0',
  surface: '#FFFFFF',
  surface2: '#F8F9FA',
  surface3: '#F1F3F4',
  border: 'rgba(0,0,0,0.08)',
  text1: '#202124',
  text2: '#5F6368',
  text3: '#9AA0A6',
};

export const darkTheme: AppTheme = {
  accent: '#8AB4F8',
  accentLight: '#1A2744',
  danger: '#F28B82',
  dangerLight: '#3B1A18',
  success: '#81C995',
  successLight: '#1B3022',
  warning: '#FDD663',
  warningLight: '#3A2D00',
  surface: '#1E1E1E',
  surface2: '#2A2A2A',
  surface3: '#333333',
  border: 'rgba(255,255,255,0.10)',
  text1: '#E8EAED',
  text2: '#9AA0A6',
  text3: '#5F6368',
};

export function getTheme(scheme: ColorSchemeName): AppTheme {
  return scheme === 'dark' ? darkTheme : lightTheme;
}

// Category colors
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  nom:        { bg: '#E8F0FE', text: '#1A73E8' },
  verbe:      { bg: '#E6F4EA', text: '#1E8E3E' },
  adjectif:   { bg: '#FEF7E0', text: '#F29900' },
  adverbe:    { bg: '#F3E8FD', text: '#9334EA' },
  expression: { bg: '#FCE8E6', text: '#D93025' },
  autre:      { bg: '#F1F3F4', text: '#5F6368' },
};

export const WORD_COLORS = [
  { bg: '#E8F0FE', text: '#1A73E8' },
  { bg: '#E6F4EA', text: '#1E8E3E' },
  { bg: '#FEF7E0', text: '#F29900' },
  { bg: '#FCE8E6', text: '#D93025' },
  { bg: '#F3E8FD', text: '#9334EA' },
  { bg: '#E8F5E9', text: '#2E7D32' },
];

export function getWordColor(word: string) {
  let h = 0;
  for (let i = 0; i < word.length; i++) {
    h = (h * 31 + word.charCodeAt(i)) % WORD_COLORS.length;
  }
  return WORD_COLORS[Math.abs(h)];
}

export const CATEGORIES = [
  'nom', 'verbe', 'adjectif', 'adverbe', 'expression', 'autre',
] as const;
