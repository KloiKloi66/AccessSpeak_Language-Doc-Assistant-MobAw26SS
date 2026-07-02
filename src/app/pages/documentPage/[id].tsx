import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SPACING } from '../../../theme';
import { useDocuments } from '../../../utils/DataProvider';

import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

const BADGE_COLORS: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed, bg: COLORS.badgeRedBg },
  mittel: { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht: { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

export default function DocumentPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntryById } = useDocuments();

  const entry = getEntryById(id ?? '');
  const badge = BADGE_COLORS[entry?.difficulty ?? ''] ?? BADGE_COLORS.mittel;

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

          {/* ── Document text ── */}
          <View style={styles.textCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {entry.originalText ? (
                <Text style={styles.documentText}>{entry.originalText}</Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Für dieses Dokument ist kein Text gespeichert.
                </Text>
              )}
            </ScrollView>
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
