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
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { COLORS, RADIUS, SPACING } from '../../theme';

// Automatically uses the same IP as the Expo dev server — no manual changes needed
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const BACKEND_URL = `http://${devHost}:8001`; // for use with physical device on same network
// const BACKEND_URL = `http://10.0.2.2:8001`; // for android emulator

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

type Language = { name: string; flag: any };

const LANGUAGES: Language[] = [
  { name: 'Englisch', flag: require('../../../assets/temp/uk.jpg') },
  { name: 'Deutsch',  flag: require('../../../assets/temp/deutschland.png') },
];

export default function TranslationPage() {
  const insets = useSafeAreaInsets();
  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[1]);
  const [inputText,  setInputText]  = useState('');
  const [outputText, setOutputText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-translate with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputText.trim()) { setOutputText(''); return; }

    debounceRef.current = setTimeout(async () => {
      try {
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
      } catch (e) {
        console.log('Translate error:', e);
        setOutputText('Übersetzung fehlgeschlagen.');
      }
    }, 800);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputText, sourceLang, targetLang]);

  function swap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
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
        {/* Title absolutely centered, doesn't affect flex siblings */}
        <View style={styles.headerTitleRow} pointerEvents="none">
          <Text style={styles.headerTitle}>Übersetzen</Text>
          <MaterialCommunityIcons name="translate" size={28} color={COLORS.text} />
        </View>
      </View>

      {/* ── Source card ── */}
      <View style={styles.card}>
        {/* Language pill */}
        <View style={styles.cardTopRow}>
          <TouchableOpacity style={styles.langPill} activeOpacity={0.7}>
            <Image source={sourceLang.flag} style={styles.flagSmall} />
            <Text style={styles.langName}>{sourceLang.name}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View style={styles.cardIcons}>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="mic" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
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

      {/* ── Swap button (overlaps both cards) ── */}
      <View style={styles.swapRow}>
        <TouchableOpacity style={styles.swapBtn} onPress={swap} activeOpacity={0.8}>
          <MaterialCommunityIcons name="swap-vertical" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* ── Target card ── */}
      <View style={styles.card}>
        {/* Language pill */}
        <View style={styles.cardTopRow}>
          <TouchableOpacity style={styles.langPill} activeOpacity={0.7}>
            <Image source={targetLang.flag} style={styles.flagSmall} />
            <Text style={styles.langName}>{targetLang.name}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View style={styles.cardIcons}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => outputText && Clipboard.setString(outputText)}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="volume-medium-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {outputText ? (
            <Text style={styles.cardText}>{outputText}</Text>
          ) : (
            <Text style={[styles.cardText, { color: COLORS.textMuted, fontStyle: 'italic' }]}>
              Übersetzung erscheint hier
            </Text>
          )}
        </ScrollView>
      </View>

      {/* ── Bottom action buttons ── */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={30} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.7}>
          <Feather name="mic" size={32} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={30} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      </View>
      </TouchableWithoutFeedback>
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

  // Cards – equal flex so both same height
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

  // Bottom actions
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.accent,
  },
});
