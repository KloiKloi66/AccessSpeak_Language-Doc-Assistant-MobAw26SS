import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, RADIUS, SPACING } from '../theme';

type Props = {
  title: string;
  difficulty: string;
  type: string;
};

const BADGE: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed,   bg: COLORS.badgeRedBg },
  mittel:    { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht:    { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

export default function HistoryEntryList({ title, difficulty, type }: Props) {
  const badge = BADGE[difficulty] ?? BADGE.mittel;

  return (
    <View style={styles.row}>
      <Ionicons
        name={type === 'document' ? 'document-text-outline' : 'image-outline'}
        size={22}
        color={COLORS.textMuted}
      />

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{difficulty}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
