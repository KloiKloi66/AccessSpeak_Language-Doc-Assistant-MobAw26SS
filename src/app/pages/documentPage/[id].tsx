import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SPACING } from '@theme';
import { useDocuments } from '@utils/DataProvider';
import { AI_URL } from '@utils/backendConfig';
import Button from '@components/button.component';

import * as Speech from 'expo-speech';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

type Language = { name: string; flag: any };

const LANG_CODE: Record<string, string> = {
  Englisch:    'en',
  Französisch: 'fr',
  Italienisch: 'it',
  Spanisch:    'es',
  Türkisch:    'tr',
};

// Target languages for translation (documents are German, so no Deutsch here)
const LANGUAGES: Language[] = [
  { name: 'Englisch',     flag: require('@assets/flags/englisch.png') },
  { name: 'Französisch',  flag: require('@assets/flags/franzoesisch.png') },
  { name: 'Italienisch',  flag: require('@assets/flags/italienisch.png') },
  { name: 'Spanisch',     flag: require('@assets/flags/spanisch.png') },
  { name: 'Türkisch',     flag: require('@assets/flags/tuerkisch.png') },
];

const BADGE_COLORS: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed, bg: COLORS.badgeRedBg },
  mittel: { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht: { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

type ViewMode = 'original' | 'einfach' | 'uebersetzt';

export default function DocumentPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntryById, cacheSimplifiedText, cacheTranslation, setDifficulty, removeEntryById } = useDocuments();

  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [simplifyError, setSimplifyError] = useState<string | null>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<Language | null>(null);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const entry = getEntryById(id ?? '');
  const badge = BADGE_COLORS[entry?.difficulty ?? ''] ?? BADGE_COLORS.mittel;

  // The text currently visible in the text card
  const visibleText =
    viewMode === 'original'
      ? entry?.originalText ?? ''
      : viewMode === 'einfach'
        ? entry?.simplifiedText ?? ''
        : (targetLang && entry?.translations[targetLang.name]) || '';

  // Übersetzt view is read in the target language, everything else in German
  const speechLang =
    viewMode === 'uebersetzt' && targetLang ? LANG_CODE[targetLang.name] ?? 'de' : 'de';

  function stopSpeech() {
    Speech.stop();
    setIsSpeaking(false);
  }

  function toggleSpeech() {
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    if (!visibleText) return;
    setIsSpeaking(true);
    Speech.speak(visibleText, {
      language: speechLang,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }

  // Stop reading when the view/language changes (text no longer matches audio)
  useEffect(() => {
    stopSpeech();
  }, [viewMode, targetLang]);

  // Stop reading when leaving the page
  useEffect(() => stopSpeech, []);

  async function showSimplified() {
    setViewMode('einfach');
    // Cache hit (from DB or earlier this session): nothing to do
    if (!entry || entry.simplifiedText || !entry.originalText || loading) return;

    setLoading(true);
    setSimplifyError(null);
    try {
      const response = await fetch(`${AI_URL}/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: entry.originalText }),
      });
      const data = await response.json();
      if (data.simplified) {
        // Persist in MongoDB + update local state (no re-generation next time)
        await cacheSimplifiedText(entry.id, data.simplified);
      } else {
        setSimplifyError('Vereinfachung fehlgeschlagen. Tippe erneut auf „Einfach".');
      }
    } catch (e) {
      console.log('Simplify error:', e);
      setSimplifyError('Vereinfachung fehlgeschlagen. Tippe erneut auf „Einfach".');
    } finally {
      setLoading(false);
    }
  }

  function showTranslated() {
    setViewMode('uebersetzt');
    // First time: no language chosen yet → ask for it
    if (!targetLang) {
      setLangModalOpen(true);
      return;
    }
    ensureTranslation(targetLang);
  }

  function selectLanguage(lang: Language) {
    setTargetLang(lang);
    setLangModalOpen(false);
    ensureTranslation(lang);
  }

  async function ensureTranslation(lang: Language) {
    // Cache hit (from DB or earlier this session): nothing to do
    if (!entry || entry.translations[lang.name] || !entry.originalText || loading) return;

    setLoading(true);
    setTranslateError(null);
    try {
      const response = await fetch(`${AI_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: entry.originalText,
          source_lang: 'Deutsch',
          target_lang: lang.name,
        }),
      });
      const data = await response.json();
      if (data.translation) {
        // Persist in MongoDB + update local state (no re-generation next time)
        await cacheTranslation(entry.id, lang.name, data.translation);
      } else {
        setTranslateError('Übersetzung fehlgeschlagen. Tippe erneut auf „Übersetzt".');
      }
    } catch (e) {
      console.log('Translate error:', e);
      setTranslateError('Übersetzung fehlgeschlagen. Tippe erneut auf „Übersetzt".');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Entypo name="chevron-thin-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {entry ? entry.title : 'Dokument'}
        </Text>
      </View>

      {entry ? (
        <>
          {/* ── Meta row ── */}
          <View style={styles.metaRow}>
            <TouchableOpacity
              style={[styles.badge, { backgroundColor: badge.bg }]}
              onPress={() => setDiffModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.badgeText, { color: badge.text }]}>{entry.difficulty}</Text>
              <Ionicons name="chevron-down" size={14} color={badge.text} />
            </TouchableOpacity>
            <View style={styles.metaItem}>
              <Ionicons
                name={entry.type === 'document' ? 'document-text-outline' : 'image-outline'}
                size={18}
                color={COLORS.textMuted}
              />
              <Text style={styles.metaText}>{entry.date}</Text>
            </View>

            <View style={styles.buttonContainerTopRight}>
              {/* Remove Entry */}
              <Button 
                onPress={() => {
                  removeEntryById(id);
                  router.back();
                }}
                shape="circle"
                size="small"
              >
                <Ionicons name="trash-outline" size={22} color={COLORS.badgeRed} />
              </Button>

              {/* Vorlesen */}
              <Button
                style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
                onPress={toggleSpeech}
                shape="circle"
                size="small"
                disabled={!visibleText}
              >
                <Ionicons
                  name={isSpeaking ? 'stop' : 'volume-medium-outline'}
                  size={22}
                  color={COLORS.text}
                />
              </Button>
            </View>
          </View>

          {/* ── Original/Einfach toggle ── */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewBtn, viewMode === 'original' && styles.viewBtnActive]}
              onPress={() => setViewMode('original')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={viewMode === 'original' ? COLORS.text : COLORS.textMuted}
              />
              <Text style={[styles.viewBtnText, viewMode !== 'original' && styles.viewBtnTextInactive]}>
                Original
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewBtn, viewMode === 'einfach' && styles.viewBtnActive]}
              onPress={showSimplified}
              disabled={!entry.originalText}
              activeOpacity={0.7}
            >
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={viewMode === 'einfach' ? COLORS.text : COLORS.textMuted}
              />
              <Text style={[styles.viewBtnText, viewMode !== 'einfach' && styles.viewBtnTextInactive]}>
                Einfach
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewBtn, viewMode === 'uebersetzt' && styles.viewBtnActive]}
              onPress={showTranslated}
              disabled={!entry.originalText}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="translate"
                size={18}
                color={viewMode === 'uebersetzt' ? COLORS.text : COLORS.textMuted}
              />
              <Text style={[styles.viewBtnText, viewMode !== 'uebersetzt' && styles.viewBtnTextInactive]}>
                Übersetzt
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Language pill (übersetzt mode only) ── */}
          {viewMode === 'uebersetzt' && (
            <TouchableOpacity
              style={styles.langPill}
              onPress={() => setLangModalOpen(true)}
              activeOpacity={0.7}
            >
              {targetLang ? (
                <>
                  <Image source={targetLang.flag} style={styles.flagSmall} />
                  <Text style={styles.langName}>{targetLang.name}</Text>
                </>
              ) : (
                <Text style={styles.langName}>Sprache wählen</Text>
              )}
              <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}

          {/* ── Document text ── */}
          <View style={styles.textCard}>
            {loading && viewMode !== 'original' ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.placeholderText}>
                  {viewMode === 'einfach' ? 'Text wird vereinfacht…' : 'Text wird übersetzt…'}
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
             {viewMode === 'original' ? (
               entry.type === 'image' ? (
                 <Image
                   source={{ uri: entry.originalText }}
                   style={styles.documentImage}
                   resizeMode="contain"
                 />
               ) : entry.originalText ? (
                 <Text style={styles.documentText}>
                   {entry.originalText}
                 </Text>
               ) : (
                 <Text style={styles.placeholderText}>
                   Für dieses Dokument ist kein Text gespeichert.
                 </Text>
               )
) : viewMode === 'einfach' ? (
                  entry.simplifiedText ? (
                    <Text style={styles.documentText}>{entry.simplifiedText}</Text>
                  ) : (
                    <Text style={styles.placeholderText}>{simplifyError ?? ''}</Text>
                  )
                ) : targetLang && entry.translations[targetLang.name] ? (
                  <Text style={styles.documentText}>{entry.translations[targetLang.name]}</Text>
                ) : (
                  <Text style={styles.placeholderText}>
                    {translateError ?? 'Wähle eine Sprache.'}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </>
      ) : (
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.placeholderText}>Dokument nicht gefunden.</Text>
        </View>
      )}

      {/* ── Difficulty selection modal ── */}
      <Modal
        visible={diffModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDiffModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDiffModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Schwierigkeit wählen</Text>
                {(['leicht', 'mittel', 'schwierig'] as const).map((level) => {
                  const levelBadge = BADGE_COLORS[level];
                  const isSelected = entry?.difficulty === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[styles.modalItem, isSelected && styles.modalItemActive]}
                      onPress={() => {
                        if (entry) setDifficulty(entry.id, level);
                        setDiffModalOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.badge, { backgroundColor: levelBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: levelBadge.text }]}>{level}</Text>
                      </View>
                      <View style={{ flex: 1 }} />
                      {isSelected && <Ionicons name="checkmark" size={20} color={COLORS.accent} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Language selection modal ── */}
      <Modal
        visible={langModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLangModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Sprache wählen</Text>
                <FlatList
                  data={LANGUAGES}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => {
                    const isSelected = item.name === targetLang?.name;
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
                        {isSelected && <Ionicons name="checkmark" size={20} color={COLORS.accent} />}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },

  documentImage: {
  width: '100%',
  height: 400,
  borderRadius: RADIUS.md,
},

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  buttonContainerTopRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginLeft: 'auto',
  },
  speakBtn: {
    backgroundColor: COLORS.surface,
  },
  speakBtnActive: {
    backgroundColor: COLORS.accent,
  },

  // View toggle
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    padding: 4,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 44,
    borderRadius: RADIUS.pill,
  },
  viewBtnActive: {
    backgroundColor: COLORS.accent,
  },
  viewBtnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  viewBtnTextInactive: {
    color: COLORS.textMuted,
  },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },

  // Text card
  textCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  documentText: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 28,
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },

  // Language pill
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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

  // Modal (same pattern as translationPage)
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
