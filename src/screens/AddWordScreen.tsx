import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, WordCategory } from '../types';
import { getTheme, CATEGORIES } from '../theme';
import { useWords } from '../hooks/useWords';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'AddWord'>;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function AddWordScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { words, addWord, updateWord } = useWords();

  const editId = route.params?.wordId;
  const existingWord = editId ? words.find((w) => w.id === editId) : undefined;
  const isEdit = Boolean(existingWord);

  const [wordText, setWordText] = useState(existingWord?.word ?? '');
  const [phonetic, setPhonetic] = useState(existingWord?.phonetic ?? '');
  const [category, setCategory] = useState<WordCategory>(existingWord?.category ?? 'nom');
  const [definition, setDefinition] = useState(existingWord?.definition ?? '');
  const [example, setExample] = useState(existingWord?.example ?? '');
  const [tags, setTags] = useState(existingWord?.tags?.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);

  async function handleImageCapture() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la caméra requis pour capturer du texte.');
      return;
    }

    setCapturing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        // In production: send to OCR API (Google Vision, AWS Textract, etc.)
        // For demo: parse uri filename as word hint
        Alert.alert(
          'Image capturée',
          'Dans la version de production, le texte serait extrait automatiquement via OCR (Google Vision API ou AWS Textract). Pour l\'instant, saisissez manuellement le mot reconnu.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setCapturing(false);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie requis.');
      return;
    }

    setCapturing(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Alert.alert(
          'Image sélectionnée',
          'Dans la version de production, le texte serait extrait via OCR. Veuillez saisir le mot manuellement.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setCapturing(false);
    }
  }

  async function handleSave() {
    const trimWord = wordText.trim();
    const trimDef = definition.trim();

    if (!trimWord) {
      Alert.alert('Champ requis', 'Veuillez saisir le mot.');
      return;
    }
    if (!trimDef) {
      Alert.alert('Champ requis', 'Veuillez saisir la définition.');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

      if (isEdit && existingWord) {
        await updateWord({
          ...existingWord,
          word: trimWord,
          phonetic: phonetic.trim() || undefined,
          category,
          definition: trimDef,
          example: example.trim() || undefined,
          tags: tagList.length ? tagList : undefined,
          updatedAt: now,
        });
        navigation.goBack();
      } else {
        await addWord({
          id: generateId(),
          word: trimWord,
          phonetic: phonetic.trim() || undefined,
          category,
          definition: trimDef,
          example: example.trim() || undefined,
          tags: tagList.length ? tagList : undefined,
          createdAt: now,
          updatedAt: now,
        });
        navigation.goBack();
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = [styles.input, {
    backgroundColor: theme.surface3,
    color: theme.text1,
    borderColor: theme.border,
  }];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelBtn, { color: theme.text2 }]}>Annuler</Text>
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.text1 }]}>
          {isEdit ? 'Modifier le mot' : 'Nouveau mot'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Text style={[styles.saveBtn, { color: theme.accent }]}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Word */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>MOT *</Text>
            <TextInput
              style={inputStyle}
              value={wordText}
              onChangeText={setWordText}
              placeholder="Ex: Épiphanie"
              placeholderTextColor={theme.text3}
              autoFocus={!isEdit}
              autoCapitalize="sentences"
            />
          </View>

          {/* Phonetic */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>PHONÉTIQUE</Text>
            <TextInput
              style={inputStyle}
              value={phonetic}
              onChangeText={setPhonetic}
              placeholder="Ex: /e.pi.fa.ni/"
              placeholderTextColor={theme.text3}
            />
          </View>

          {/* Category */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>CATÉGORIE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.catRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: category === cat ? theme.accent : theme.surface3,
                        borderColor: category === cat ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        { color: category === cat ? 'white' : theme.text2 },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Definition */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>DÉFINITION *</Text>
            <TextInput
              style={[inputStyle, styles.textarea]}
              value={definition}
              onChangeText={setDefinition}
              placeholder="Signification du mot…"
              placeholderTextColor={theme.text3}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Example */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>EXEMPLE D'UTILISATION</Text>
            <TextInput
              style={[inputStyle, styles.textareaSmall]}
              value={example}
              onChangeText={setExample}
              placeholder="Phrase d'exemple…"
              placeholderTextColor={theme.text3}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>TAGS (séparés par virgule)</Text>
            <TextInput
              style={inputStyle}
              value={tags}
              onChangeText={setTags}
              placeholder="littérature, poésie, rare…"
              placeholderTextColor={theme.text3}
              autoCapitalize="none"
            />
          </View>

          {/* Image capture */}
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.text3 }]}>CAPTURER DEPUIS IMAGE</Text>
            <View style={styles.captureRow}>
              <TouchableOpacity
                style={[styles.captureBtn, { backgroundColor: theme.surface3, borderColor: theme.border }]}
                onPress={handleImageCapture}
                disabled={capturing}
                activeOpacity={0.7}
              >
                {capturing ? (
                  <ActivityIndicator size="small" color={theme.accent} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={22} color={theme.accent} />
                    <Text style={[styles.captureBtnText, { color: theme.text2 }]}>Caméra</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureBtn, { backgroundColor: theme.surface3, borderColor: theme.border }]}
                onPress={handlePickImage}
                disabled={capturing}
                activeOpacity={0.7}
              >
                <>
                  <Ionicons name="image-outline" size={22} color={theme.accent} />
                  <Text style={[styles.captureBtnText, { color: theme.text2 }]}>Galerie</Text>
                </>
              </TouchableOpacity>
            </View>
            <Text style={[styles.captureHint, { color: theme.text3 }]}>
              Photographiez un texte pour pré-remplir automatiquement le formulaire (OCR)
            </Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtnLarge, { backgroundColor: theme.accent }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isEdit ? 'Mettre à jour' : 'Ajouter le mot'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  cancelBtn: { fontSize: 16 },
  screenTitle: { fontSize: 16, fontWeight: '600' },
  saveBtn: { fontSize: 16, fontWeight: '600' },
  form: { padding: 16, gap: 0, paddingBottom: 60 },
  group: { marginBottom: 20 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  textarea: { height: 96, paddingTop: 11 },
  textareaSmall: { height: 72, paddingTop: 11 },
  catRow: { flexDirection: 'row', gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  catChipText: { fontSize: 13, fontWeight: '500' },
  captureRow: { flexDirection: 'row', gap: 10 },
  captureBtn: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  captureBtnText: { fontSize: 13, fontWeight: '500' },
  captureHint: { fontSize: 12, marginTop: 8, lineHeight: 17 },
  saveBtnLarge: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
