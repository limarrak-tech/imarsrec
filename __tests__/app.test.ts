import { storage } from '../src/utils/storage';
import { getWordColor, getTheme, CATEGORY_COLORS } from '../src/theme';
import { Word } from '../src/types';

// ─── Mock AsyncStorage ─────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// ─── Helper ────────────────────────────────────────────────────────────────────
function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    id: '1',
    word: 'Test',
    category: 'nom',
    definition: 'Un mot de test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── storage.exportToJSON ──────────────────────────────────────────────────────
describe('storage.exportToJSON', () => {
  it('returns valid JSON string', () => {
    const words = [makeWord()];
    const json = storage.exportToJSON(words);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('contains version and exportDate fields', () => {
    const data = JSON.parse(storage.exportToJSON([]));
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('exportDate');
    expect(data).toHaveProperty('words');
  });

  it('serializes all words', () => {
    const words = [makeWord({ id: '1' }), makeWord({ id: '2', word: 'Autre' })];
    const data = JSON.parse(storage.exportToJSON(words));
    expect(data.words).toHaveLength(2);
  });
});

// ─── storage.importFromJSON ────────────────────────────────────────────────────
describe('storage.importFromJSON', () => {
  it('imports words from valid JSON', () => {
    const words = [makeWord()];
    const json = storage.exportToJSON(words);
    const imported = storage.importFromJSON(json);
    expect(imported).toHaveLength(1);
    expect(imported[0].word).toBe('Test');
  });

  it('throws on invalid JSON', () => {
    expect(() => storage.importFromJSON('not json')).toThrow();
  });

  it('throws when words field is missing', () => {
    expect(() =>
      storage.importFromJSON(JSON.stringify({ version: '1.0.0' }))
    ).toThrow();
  });

  it('round-trips correctly', () => {
    const original = [
      makeWord({ word: 'Épiphanie', phonetic: '/e.pi.fa.ni/', example: 'Un exemple.' }),
    ];
    const imported = storage.importFromJSON(storage.exportToJSON(original));
    expect(imported[0].phonetic).toBe('/e.pi.fa.ni/');
    expect(imported[0].example).toBe('Un exemple.');
  });
});

// ─── getWordColor ──────────────────────────────────────────────────────────────
describe('getWordColor', () => {
  it('returns an object with bg and text', () => {
    const color = getWordColor('Bonjour');
    expect(color).toHaveProperty('bg');
    expect(color).toHaveProperty('text');
  });

  it('is deterministic for same word', () => {
    expect(getWordColor('Épiphanie')).toEqual(getWordColor('Épiphanie'));
  });

  it('returns different colors for clearly different words', () => {
    const colors = ['A', 'B', 'C', 'D', 'E', 'F'].map(getWordColor);
    const unique = new Set(colors.map((c) => c.bg));
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ─── getTheme ──────────────────────────────────────────────────────────────────
describe('getTheme', () => {
  it('returns light theme for light scheme', () => {
    const t = getTheme('light');
    expect(t.accent).toBe('#1A73E8');
    expect(t.surface).toBe('#FFFFFF');
  });

  it('returns dark theme for dark scheme', () => {
    const t = getTheme('dark');
    expect(t.surface).toBe('#1E1E1E');
  });

  it('returns light theme for null scheme', () => {
    const t = getTheme(null);
    expect(t.accent).toBe('#1A73E8');
  });
});

// ─── CATEGORY_COLORS ──────────────────────────────────────────────────────────
describe('CATEGORY_COLORS', () => {
  const expected = ['nom', 'verbe', 'adjectif', 'adverbe', 'expression', 'autre'];

  it('has all categories', () => {
    expected.forEach((cat) => {
      expect(CATEGORY_COLORS).toHaveProperty(cat);
    });
  });

  it('each category has bg and text', () => {
    expected.forEach((cat) => {
      expect(CATEGORY_COLORS[cat]).toHaveProperty('bg');
      expect(CATEGORY_COLORS[cat]).toHaveProperty('text');
    });
  });
});

// ─── Word model ────────────────────────────────────────────────────────────────
describe('Word model', () => {
  it('optional fields can be omitted', () => {
    const w = makeWord();
    expect(w.phonetic).toBeUndefined();
    expect(w.example).toBeUndefined();
    expect(w.tags).toBeUndefined();
  });

  it('createdAt and updatedAt are ISO strings', () => {
    const w = makeWord();
    expect(new Date(w.createdAt).toISOString()).toBe(w.createdAt);
    expect(new Date(w.updatedAt).toISOString()).toBe(w.updatedAt);
  });
});
