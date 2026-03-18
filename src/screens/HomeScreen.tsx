import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { getTheme } from '../theme';
import { useWords } from '../hooks/useWords';
import WordCard from '../components/WordCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const { words, loading } = useWords();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const t = search.toLowerCase().trim();
    if (!t) return words;
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(t) ||
        w.definition.toLowerCase().includes(t) ||
        (w.example && w.example.toLowerCase().includes(t))
    );
  }, [words, search]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text1 }]}>
          imars<Text style={{ color: theme.accent }}>Record</Text>
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: theme.surface3 }]}>
        <Ionicons name="search-outline" size={17} color={theme.text3} />
        <TextInput
          style={[styles.searchInput, { color: theme.text1 }]}
          placeholder="Rechercher un mot ou définition…"
          placeholderTextColor={theme.text3}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.chip, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.chipText, { color: theme.accent }]}>
            {filtered.length} mot{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: theme.successLight }]}>
          <Text style={[styles.chipText, { color: theme.success }]}>Synchronisé</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={theme.accent} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={56} color={theme.text3} />
          <Text style={[styles.emptyTitle, { color: theme.text1 }]}>
            {search ? 'Aucun résultat' : 'Commencez votre dictionnaire'}
          </Text>
          <Text style={[styles.emptySub, { color: theme.text2 }]}>
            {search
              ? 'Essayez un autre terme de recherche'
              : 'Appuyez sur + pour ajouter votre premier mot'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(w) => w.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WordCard
              word={item}
              searchTerm={search}
              onPress={() => navigation.navigate('WordDetail', { wordId: item.id })}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate('AddWord', {})}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
