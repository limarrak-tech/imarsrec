import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

import { getTheme } from '../theme';
import { useWords } from '../hooks/useWords';
import { storage } from '../utils/storage';

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const { words, clearAll, importWords } = useWords();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  // ─── Export ───────────────────────────────────────────────────────────────────
  async function handleExport() {
    setExporting(true);
    try {
      const json = storage.exportToJSON(words);
      const filename = `imarsRecord_export_${new Date().toISOString().slice(0, 10)}.json`;
      const uri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(uri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter imarsRecord',
        });
      } else {
        Alert.alert('Exporté', `Fichier sauvegardé : ${filename}`);
      }
    } catch (err) {
      Alert.alert('Erreur', "Impossible d'exporter les données.");
    } finally {
      setExporting(false);
    }
  }

  // ─── Import ───────────────────────────────────────────────────────────────────
  async function handleImport() {
    setImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const imported = storage.importFromJSON(content);

      Alert.alert(
        'Importer les données ?',
        `${imported.length} mots trouvés dans le fichier. Voulez-vous remplacer ou fusionner avec vos données actuelles ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Fusionner',
            onPress: async () => {
              const existing = new Set(words.map((w) => w.word.toLowerCase()));
              const newOnes = imported.filter((w) => !existing.has(w.word.toLowerCase()));
              await importWords([...words, ...newOnes]);
              Alert.alert('Succès', `${newOnes.length} nouveau(x) mot(s) ajouté(s).`);
            },
          },
          {
            text: 'Remplacer tout',
            style: 'destructive',
            onPress: async () => {
              await importWords(imported);
              Alert.alert('Succès', `${imported.length} mots importés.`);
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Erreur', "Impossible de lire le fichier JSON.");
    } finally {
      setImporting(false);
    }
  }

  // ─── Clear all ────────────────────────────────────────────────────────────────
  function handleClearAll() {
    Alert.alert(
      'Effacer toutes les données ?',
      `${words.length} mot(s) seront supprimés définitivement. Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: () => clearAll(),
        },
      ]
    );
  }

  function SettingsRow({
    icon,
    iconBg,
    iconColor,
    title,
    subtitle,
    onPress,
    loading,
    showChevron = true,
    right,
  }: {
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    loading?: boolean;
    showChevron?: boolean;
    right?: React.ReactNode;
  }) {
    return (
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: theme.border }]}
        onPress={onPress}
        disabled={loading || !onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon as any} size={18} color={iconColor} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, { color: theme.text1 }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.rowSub, { color: theme.text3 }]}>{subtitle}</Text>
          ) : null}
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={theme.accent} />
        ) : right ? (
          right
        ) : showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={16} color={theme.text3} />
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text1 }]}>Paramètres</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Compte */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>Compte</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingsRow
            icon="person-circle-outline"
            iconBg={theme.accentLight}
            iconColor={theme.accent}
            title="Utilisateur imarsRecord"
            subtitle={`${words.length} mot${words.length !== 1 ? 's' : ''} enregistré${words.length !== 1 ? 's' : ''}`}
            showChevron={false}
          />
        </View>

        {/* Données */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>Données</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingsRow
            icon="download-outline"
            iconBg={theme.successLight}
            iconColor={theme.success}
            title="Exporter les données"
            subtitle="Sauvegarder en fichier JSON"
            onPress={handleExport}
            loading={exporting}
          />
          <SettingsRow
            icon="cloud-upload-outline"
            iconBg={theme.warningLight}
            iconColor={theme.warning}
            title="Importer des données"
            subtitle="Restaurer depuis un fichier JSON"
            onPress={handleImport}
            loading={importing}
          />
          <View style={{ borderBottomWidth: 0 }}>
            <SettingsRow
              icon="trash-outline"
              iconBg={theme.dangerLight}
              iconColor={theme.danger}
              title="Effacer toutes les données"
              subtitle={`Supprimer les ${words.length} mots`}
              onPress={handleClearAll}
              showChevron={false}
            />
          </View>
        </View>

        {/* Affichage */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>Affichage</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingsRow
            icon="contrast-outline"
            iconBg={theme.surface3}
            iconColor={theme.text2}
            title="Mode automatique"
            subtitle="Suit le thème du système"
            showChevron={false}
            right={
              <Switch
                value={true}
                disabled
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="white"
              />
            }
          />
        </View>

        {/* Stats */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>Statistiques</Text>
        <View style={[styles.statsGrid]}>
          {[
            { label: 'Total mots', value: words.length.toString() },
            {
              label: 'Cette semaine',
              value: words.filter((w) => {
                const d = new Date(w.createdAt);
                const now = new Date();
                const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
                return diff <= 7;
              }).length.toString(),
            },
            {
              label: 'Catégorie top',
              value: (() => {
                const counts: Record<string, number> = {};
                words.forEach((w) => { counts[w.category] = (counts[w.category] || 0) + 1; });
                return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
              })(),
            },
            {
              label: 'Avec exemple',
              value: words.filter((w) => w.example).length.toString(),
            },
          ].map(({ label, value }) => (
            <View key={label} style={[styles.statCard, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.statValue, { color: theme.text1 }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: theme.text3 }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* À propos */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>À propos</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingsRow
            icon="information-circle-outline"
            iconBg={theme.surface3}
            iconColor={theme.text2}
            title="imarsRecord"
            subtitle="Version 1.0.0 — React Native + Expo"
            showChevron={false}
          />
        </View>

      </ScrollView>
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
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  body: { padding: 16, gap: 0, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15 },
  rowSub: { fontSize: 12, marginTop: 1 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12 },
});
