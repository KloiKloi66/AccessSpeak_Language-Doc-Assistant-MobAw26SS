import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { COLORS, RADIUS, SPACING } from '../../../theme';
import { useDocuments } from '../../../utils/DataProvider';

import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const AI_URL = `http://${devHost}:8001`;

const BADGE_COLORS: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed, bg: COLORS.badgeRedBg },
  mittel: { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht: { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

type ViewMode = 'original' | 'einfach';

export default function DocumentPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntryById } = useDocuments();

  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const entry = getEntryById(id ?? '');
  const badge = BADGE_COLORS[entry?.difficulty ?? ''] ?? BADGE_COLORS.mittel;

  async function showSimplified() {
    setViewMode('einfach');
    if (simplifiedText !== null || !entry?.originalText || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${AI_URL}/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: entry.originalText }),
      });
      const data = await response.json();
      setSimplifiedText(data.simplified || 'Vereinfachung fehlgeschlagen.');
    } catch (e) {
      console.log('Simplify error:', e);
      setSimplifiedText('Vereinfachung fehlgeschlagen.');
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
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{entry.difficulty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name={entry.type === 'document' ? 'document-text-outline' : 'image-outline'}
                size={18}
                color={COLORS.textMuted}
              />
              <Text style={styles.metaText}>{entry.date}</Text>
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
          </View>

          {/* ── Document text ── */}
          <View style={styles.textCard}>
            {viewMode === 'einfach' && loading ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.placeholderText}>Text wird vereinfacht…</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {viewMode === 'original' ? (
                  entry.originalText ? (
                    <Text style={styles.documentText}>{entry.originalText}</Text>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Für dieses Dokument ist kein Text gespeichert.
                    </Text>
                  )
                ) : (
                  <Text style={styles.documentText}>{simplifiedText ?? ''}</Text>
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

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  badge: {
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
});
