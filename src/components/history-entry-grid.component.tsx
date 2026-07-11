import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, RADIUS, SPACING } from '@theme';

import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  title: string;
  difficulty: string;
  type: string;
  date: string;
};

const BADGE: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed,   bg: COLORS.badgeRedBg },
  mittel:    { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht:    { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

export default function HistoryEntryGrid({ title, difficulty, type, date }: Props) {
  const badge = BADGE[difficulty] ?? BADGE.mittel;

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{difficulty}</Text>
      </View>

      <View style={styles.footer}>
        <Ionicons
          name={type === 'document' ? 'document-text-outline' : 'image-outline'}
          size={18}
          color={COLORS.textMuted}
        />
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minHeight: 120,
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
