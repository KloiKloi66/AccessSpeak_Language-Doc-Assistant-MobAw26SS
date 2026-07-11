import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Clipboard,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';

import { AI_URL as BACKEND_URL } from '@utils/backendConfig';
import { COLORS, RADIUS, SPACING } from '@theme';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

type Language = { name: string; flag: any };

const LANG_CODE: Record<string, string> = {
  Deutsch:     'de',
  Englisch:    'en',
  Französisch: 'fr',
  Italienisch: 'it',
  Spanisch:    'es',
  Türkisch:    'tr',
};

const LANGUAGES: Language[] = [
  { name: 'Deutsch',      flag: require('@assets/flags/deutsch.png') },
  { name: 'Englisch',     flag: require('@assets/flags/englisch.png') },
  { name: 'Französisch',  flag: require('@assets/flags/franzoesisch.png') },
  { name: 'Italienisch',  flag: require('@assets/flags/italienisch.png') },
  { name: 'Spanisch',     flag: require('@assets/flags/spanisch.png') },
  { name: 'Türkisch',     flag: require('@assets/flags/tuerkisch.png') },
];

type Mode = 'translate' | 'simplify';

export default function TranslationPage() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('translate');
  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[1]); // Englisch
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[0]); // Deutsch
  const [inputText,  setInputText]  = useState('');
  const [outputText, setOutputText] = useState('');
  const [dropdown, setDropdown] = useState<'source' | 'target' | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSimplify = mode === 'simplify';

  // Auto-translate / auto-simplify with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputText.trim()) { setOutputText(''); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        if (isSimplify) {
          const response = await fetch(`${BACKEND_URL}/simplify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText }),
          });
          const data = await response.json();
          setOutputText(data.simplified ?? '');
        } else {
          const response = await fetch(`${BACKEND_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: inputText,
              source_lang: sourceLang.name,
              target_lang: targetLang.name,
            }),
          });
          const data = await response.json();
          setOutputText(data.translation ?? '');
        }
      } catch (e) {
        console.log(isSimplify ? 'Simplify error:' : 'Translate error:', e);
        setOutputText(isSimplify ? 'Vereinfachung fehlgeschlagen.' : 'Übersetzung fehlgeschlagen.');
      }
    }, 800);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputText, sourceLang, targetLang, mode]);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setOutputText('');
  }

  function swap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  }

  function selectLanguage(lang: Language) {
    if (dropdown === 'source') setSourceLang(lang);
    else setTargetLang(lang);
    setDropdown(null);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top + 8 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.innerRoot}>

      {/* ── Custom header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Entypo name="chevron-thin-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow} pointerEvents="none">
          <Text style={styles.headerTitle}>{isSimplify ? 'Vereinfachen' : 'Übersetzen'}</Text>
          {isSimplify ? (
            <Ionicons name="sparkles-outline" size={28} color={COLORS.text} />
          ) : (
            <MaterialCommunityIcons name="translate" size={28} color={COLORS.text} />
          )}
        </View>
      </View>

      {/* ── Source card ── */}
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <TouchableOpacity
            style={styles.langPill}
            activeOpacity={0.7}
            disabled={isSimplify}
            onPress={() => setDropdown('source')}
          >
            <Image
              source={isSimplify ? LANGUAGES[0].flag : sourceLang.flag}
              style={styles.flagSmall}
            />
            <Text style={styles.langName}>{isSimplify ? 'Deutsch' : sourceLang.name}</Text>
            {!isSimplify && (
              <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>
          <View style={styles.cardIcons}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                const text = await Clipboard.getString();
                if (text) setInputText(text);
              }}
            >
              <Ionicons name="clipboard-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => inputText && Speech.speak(inputText, { language: isSimplify ? 'de' : LANG_CODE[sourceLang.name] })}
            >
              <Ionicons name="volume-medium-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.cardText}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Text eingeben…"
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* ── Swap button (translate mode only) ── */}
      {!isSimplify && (
        <View style={styles.swapRow}>
          <TouchableOpacity style={styles.swapBtn} onPress={swap} activeOpacity={0.8}>
            <MaterialCommunityIcons name="swap-vertical" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Target card ── */}
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          {isSimplify ? (
            <View style={styles.langPill}>
              <Ionicons name="sparkles-outline" size={18} color={COLORS.text} />
              <Text style={styles.langName}>Einfache Sprache</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.langPill}
              activeOpacity={0.7}
              onPress={() => setDropdown('target')}
            >
              <Image source={targetLang.flag} style={styles.flagSmall} />
              <Text style={styles.langName}>{targetLang.name}</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
          <View style={styles.cardIcons}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => outputText && Clipboard.setString(outputText)}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => outputText && Speech.speak(outputText, { language: isSimplify ? 'de' : LANG_CODE[targetLang.name] })}
            >
              <Ionicons name="volume-medium-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {outputText ? (
            <Text style={styles.cardText}>{outputText}</Text>
          ) : (
            <Text style={[styles.cardText, { color: COLORS.textMuted, fontStyle: 'italic' }]}>
              {isSimplify ? 'Einfacher Text erscheint hier' : 'Übersetzung erscheint hier'}
            </Text>
          )}
        </ScrollView>
      </View>

      {/* ── Mode selector ── */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeBtn, !isSimplify && styles.modeBtnActive]}
          onPress={() => switchMode('translate')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="translate"
            size={20}
            color={!isSimplify ? COLORS.text : COLORS.textMuted}
          />
          <Text style={[styles.modeBtnText, isSimplify && styles.modeBtnTextInactive]}>
            Übersetzen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, isSimplify && styles.modeBtnActive]}
          onPress={() => switchMode('simplify')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sparkles-outline"
            size={20}
            color={isSimplify ? COLORS.text : COLORS.textMuted}
          />
          <Text style={[styles.modeBtnText, !isSimplify && styles.modeBtnTextInactive]}>
            Vereinfachen
          </Text>
        </TouchableOpacity>
      </View>

      </View>
      </TouchableWithoutFeedback>

      {/* ── Language dropdown modal ── */}
      <Modal
        visible={dropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdown(null)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdown(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Sprache wählen</Text>
                <FlatList
                  data={LANGUAGES}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => {
                    const isSelected =
                      dropdown === 'source'
                        ? item.name === sourceLang.name
                        : item.name === targetLang.name;
                    return (
                      <TouchableOpacity
                        style={[styles.modalItem, isSelected && styles.modalItemActive]}
                        onPress={() => selectLanguage(item)}
                        activeOpacity={0.7}
                      >
                        <Image source={item.flag} style={styles.flagModal} />
                        <Text style={[styles.modalItemText, isSelected && { color: COLORS.accent }]}>
                          {item.name}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark" size={20} color={COLORS.accent} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  innerRoot: {
    flex: 1,
    gap: SPACING.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
    position: 'relative',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
  },

  // Cards
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  flagSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  langName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  cardIcons: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 28,
    textAlignVertical: 'top',
    paddingTop: 0,
  },

  // Swap button
  swapRow: {
    alignItems: 'center',
    marginVertical: -20,
    zIndex: 10,
  },
  swapBtn: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mode selector
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    padding: 4,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 48,
    borderRadius: RADIUS.pill,
  },
  modeBtnActive: {
    backgroundColor: COLORS.accent,
  },
  modeBtnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modeBtnTextInactive: {
    color: COLORS.textMuted,
  },

  // Modal dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
  },
  modalItemActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  flagModal: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  modalItemText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
