import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Word } from '../types';
import { storage } from '../utils/storage';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface WordsContextValue {
  words: Word[];
  loading: boolean;
  addWord: (word: Word) => Promise<void>;
  updateWord: (word: Word) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  importWords: (incoming: Word[]) => Promise<void>;
  refreshWords: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const WordsContext = createContext<WordsContextValue | null>(null);

export function WordsProvider({ children }: { children: React.ReactNode }) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWords = useCallback(async () => {
    const data = await storage.getWords();
    setWords(data);
  }, []);

  useEffect(() => {
    refreshWords().finally(() => setLoading(false));
  }, [refreshWords]);

  const addWord = useCallback(async (word: Word) => {
    await storage.addWord(word);
    setWords((prev) => [word, ...prev]);
  }, []);

  const updateWord = useCallback(async (word: Word) => {
    await storage.updateWord(word);
    setWords((prev) => prev.map((w) => (w.id === word.id ? word : w)));
  }, []);

  const deleteWord = useCallback(async (id: string) => {
    await storage.deleteWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await storage.clearAll();
    setWords([]);
  }, []);

  const importWords = useCallback(async (incoming: Word[]) => {
    await storage.saveWords(incoming);
    setWords(incoming);
  }, []);

  return (
    <WordsContext.Provider
      value={{ words, loading, addWord, updateWord, deleteWord, clearAll, importWords, refreshWords }}
    >
      {children}
    </WordsContext.Provider>
  );
}

export function useWords() {
  const ctx = useContext(WordsContext);
  if (!ctx) throw new Error('useWords must be used inside WordsProvider');
  return ctx;
}
