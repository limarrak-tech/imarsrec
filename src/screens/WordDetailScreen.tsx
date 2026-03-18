import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Share,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { getTheme, getWordColor, CATEGORY_COLORS } from '../theme';
import { useWords } from '../hooks/useWords';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'WordDetail'>;

export default function WordDetailScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { words, deleteWord } = useWords();
  const [deleting, setDeleting] = useState(false);

  const word = words.find((w) => w.id === route.params.wordId);

  if (!word) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={{ color: theme.text1, padding: 20 }}>Mot introuvable.</Text>
      </SafeAreaView>
    );
  }

  const color = getWordColor(word.word);
  const catColor = CATEGORY_COLORS[word.category] || CATEGORY_COLORS.autre;
  const dateStr = new Date(word.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  async function handleShare() {
    await Share.share({
      title: word.word,
      message: `📖 ${word.word}${word.phonetic ? ` ${word.phonetic}` : ''}\n\n${word.definition}${word.example ? `\n\n"${word.example}"` : ''}\n\n— via imarsRecord`,
    });
  }

  function handleDelete() {
    Alert.alert(
      'Supprimer ce mot ?',
      `"${word.word}" sera supprimé définitivement.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await deleteWord(word.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surface3 }]}>
          <Ionicons name="chevron-back" size={20} color={theme.text1} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.text1 }]}>Détail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Word hero */}
        <View style={styles.hero}>
          <View style={[styles.initial, { backgroundColor: color.bg }]}>
            <Text style={[styles.initialText, { color: color.text }]}>
              {word.word[0].toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.wordBig, { color: theme.text1 }]}>{word.word}</Text>
            {word.phonetic ? (
              <Text style={[styles.phonetic, { color: theme.text3 }]}>{word.phonetic}</Text>
            ) : null}
            <View style={[styles.catTag, { backgroundColor: catColor.bg }]}>
              <Text style={[styles.catText, { color: catColor.text }]}>{word.category}</Text>
            </View>
          </View>
        </View>

        {/* Definition */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionLabel, { color: theme.text3 }]}>DÉFINITION</Text>
          <Text style={[styles.sectionText, { color: theme.text1 }]}>{word.definition}</Text>
        </View>

        {/* Example */}
        {word.example ? (
          <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
            <Text style={[styles.sectionLabel, { color: theme.text3 }]}>EXEMPLE</Text>
            <Text style={[styles.sectionText, styles.italic, { color: theme.text2 }]}>
              "{word.example}"
            </Text>
          </View>
        ) : null}

        {/* Tags */}
        {word.tags && word.tags.length > 0 ? (
          <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
            <Text style={[styles.sectionLabel, { color: theme.text3 }]}>TAGS</Text>
            <View style={styles.tagsRow}>
              {word.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.tagText, { color: theme.accent }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Date */}
        <View style={[styles.section, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.sectionLabel, { color: theme.text3 }]}>AJOUTÉ LE</Text>
          <Text style={[styles.sectionText, { color: theme.text2, fontSize: 14 }]}>{dateStr}</Text>
        </View>
      </ScrollView>

      {/* Action row */}
      <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.accentLight }]}
          onPress={() => navigation.navigate('AddWord', { wordId: word.id })}
          activeOpacity={0.75}
        >
          <Ionicons name="pencil-outline" size={16} color={theme.accent} />
          <Text style={[styles.actionText, { color: theme.accent }]}>Éditer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.successLight }]}
          onPress={handleShare}
          activeOpacity={0.75}
        >
          <Ionicons name="share-outline" size={16} color={theme.success} />
          <Text style={[styles.actionText, { color: theme.success }]}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.dangerLight }]}
          onPress={handleDelete}
          disabled={deleting}
          activeOpacity={0.75}
        >
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
          <Text style={[styles.actionText, { color: theme.danger }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: { fontSize: 16, fontWeight: '500' },
  body: { padding: 20, gap: 12, paddingBottom: 40 },
  hero: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 8 },
  initial: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: { fontSize: 26, fontWeight: '700' },
  wordBig: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  phonetic: { fontSize: 15, fontStyle: 'italic', marginTop: 2 },
  catTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  catText: { fontSize: 11, fontWeight: '600' },
  section: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sectionText: { fontSize: 15, lineHeight: 22 },
  italic: { fontStyle: 'italic' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '500' },
  actionRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    borderTopWidth: 0.5,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionText: { fontSize: 13, fontWeight: '500' },
});
