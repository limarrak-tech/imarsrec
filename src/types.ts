// ─── Word Model ────────────────────────────────────────────────────────────────
export type WordCategory =
  | 'nom'
  | 'verbe'
  | 'adjectif'
  | 'adverbe'
  | 'expression'
  | 'autre';

export interface Word {
  id: string;
  word: string;
  phonetic?: string;
  category: WordCategory;
  definition: string;
  example?: string;
  tags?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ─── Navigation ────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  MainTabs: undefined;
  WordDetail: { wordId: string };
  AddWord: { wordId?: string }; // optional = edit mode
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

// ─── Storage ───────────────────────────────────────────────────────────────────
export interface StorageData {
  version: string;
  exportDate: string;
  words: Word[];
}

// ─── Theme ─────────────────────────────────────────────────────────────────────
export interface AppTheme {
  accent: string;
  accentLight: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  text1: string;
  text2: string;
  text3: string;
}
