import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, StorageData } from '../types';

const STORAGE_KEY = '@imarsRecord_words';
const VERSION = '1.0.0';

export const storage = {
  async getWords(): Promise<Word[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return getDefaultWords();
      return JSON.parse(json) as Word[];
    } catch {
      return getDefaultWords();
    }
  },

  async saveWords(words: Word[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  },

  async addWord(word: Word): Promise<void> {
    const words = await this.getWords();
    words.unshift(word);
    await this.saveWords(words);
  },

  async updateWord(updated: Word): Promise<void> {
    const words = await this.getWords();
    const idx = words.findIndex((w) => w.id === updated.id);
    if (idx !== -1) {
      words[idx] = updated;
      await this.saveWords(words);
    }
  },

  async deleteWord(id: string): Promise<void> {
    const words = await this.getWords();
    await this.saveWords(words.filter((w) => w.id !== id));
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  exportToJSON(words: Word[]): string {
    const data: StorageData = {
      version: VERSION,
      exportDate: new Date().toISOString(),
      words,
    };
    return JSON.stringify(data, null, 2);
  },

  importFromJSON(json: string): Word[] {
    const data = JSON.parse(json) as StorageData;
    if (!data.words || !Array.isArray(data.words)) {
      throw new Error('Format JSON invalide : champ "words" manquant.');
    }
    return data.words;
  },
};

// ─── Default seed data ─────────────────────────────────────────────────────────
function getDefaultWords(): Word[] {
  return [
    {
      id: '1',
      word: 'Épiphanie',
      phonetic: '/e.pi.fa.ni/',
      category: 'nom',
      definition: 'Manifestation soudaine d\'une réalité essentielle ; fête chrétienne célébrant l\'adoration des Rois Mages.',
      example: 'Cette lecture fut une véritable épiphanie pour moi.',
      createdAt: '2024-01-15T08:00:00.000Z',
      updatedAt: '2024-01-15T08:00:00.000Z',
    },
    {
      id: '2',
      word: 'Sérénité',
      phonetic: '/se.ʁe.ni.te/',
      category: 'nom',
      definition: 'État de calme, de tranquillité profonde ; absence d\'agitation ou d\'inquiétude.',
      example: 'Il trouva la sérénité en contemplant l\'océan au coucher du soleil.',
      createdAt: '2024-01-20T09:30:00.000Z',
      updatedAt: '2024-01-20T09:30:00.000Z',
    },
    {
      id: '3',
      word: 'Éphémère',
      phonetic: '/e.fe.mɛʁ/',
      category: 'adjectif',
      definition: 'Qui est de courte durée ; qui ne dure qu\'un jour ou très peu de temps.',
      example: 'Les fleurs de cerisier sont éphémères mais d\'une beauté incomparable.',
      createdAt: '2024-02-03T11:00:00.000Z',
      updatedAt: '2024-02-03T11:00:00.000Z',
    },
    {
      id: '4',
      word: 'Méandre',
      phonetic: '/me.ɑ̃dʁ/',
      category: 'nom',
      definition: 'Sinuosité d\'un cours d\'eau ; détour, divagation dans un discours ou un raisonnement.',
      example: 'La rivière formait d\'élégants méandres à travers la plaine verdoyante.',
      createdAt: '2024-02-10T14:00:00.000Z',
      updatedAt: '2024-02-10T14:00:00.000Z',
    },
  ];
}
