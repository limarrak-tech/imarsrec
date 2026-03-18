import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Word } from '../types';
import { getTheme, getWordColor, CATEGORY_COLORS } from '../theme';

interface Props {
  word: Word;
  onPress: () => void;
  searchTerm?: string;
}

function highlightText(text: string, term: string, baseStyle: object, highlightStyle: object) {
  if (!term) return <Text style={baseStyle}>{text}</Text>;
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <Text style={baseStyle}>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <Text key={i} style={highlightStyle}>{part}</Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}

export default function WordCard({ word, onPress, searchTerm = '' }: Props) {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const color = getWordColor(word.word);
  const catColor = CATEGORY_COLORS[word.category] || CATEGORY_COLORS.autre;
  const shortDef = word.definition.length > 65
    ? word.definition.slice(0, 63) + '…'
    : word.definition;

  const highlightStyle = {
    backgroundColor: theme.accentLight,
    color: theme.accent,
    borderRadius: 3,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={[styles.initial, { backgroundColor: color.bg, borderRadius: 12 }]}>
        <Text style={[styles.initialText, { color: color.text }]}>
          {word.word[0].toUpperCase()}
        </Text>
      </View>

      <View style={styles.content}>
        {highlightText(word.word, searchTerm,
          [styles.wordName, { color: theme.text1 }],
          highlightStyle
        )}
        {highlightText(shortDef, searchTerm,
          [styles.wordDef, { color: theme.text2 }],
          highlightStyle
        )}
        <View style={[styles.catTag, { backgroundColor: catColor.bg }]}>
          <Text style={[styles.catText, { color: catColor.text }]}>{word.category}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={theme.text3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  initial: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  wordName: {
    fontSize: 16,
    fontWeight: '500',
  },
  wordDef: {
    fontSize: 13,
    lineHeight: 18,
  },
  catTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  catText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
