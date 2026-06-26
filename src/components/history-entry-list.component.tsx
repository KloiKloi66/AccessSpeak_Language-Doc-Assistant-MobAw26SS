import React from 'react';
<<<<<<< HEAD
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
=======
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Properties = {
  title: string,
  difficulty: string,
  type: string,
  style?: TextStyle
};

export default function HistoryEntryList({title, difficulty, type, style}: Properties) {
  return <View style={styles.mainView}>
    <Text style={styles.text}>{title}</Text>
    <View style={styles.difficultyAndIcon}>
      <View style={[
        difficulty === 'schwierig' && styles.hard,
        difficulty === 'mittel' && styles.medium,
        difficulty === 'leicht' && styles.easy,
        styles.difficulty
      ]}>
        <Text style={styles.text}>{difficulty}</Text>
      </View>
      {type === 'document' ?
        <Ionicons name="document-text-outline" size={24} color="white" />
        :
        <MaterialCommunityIcons name="image-outline" size={24} color="white" />
      }
    </View>
  </View>;
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'darkgrey',
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16
  },
  difficultyAndIcon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  difficulty: {
    width: 80,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  easy: {
    backgroundColor: '#44b835',
  },
  medium: {
    backgroundColor: '#e0b412',
  },
  hard: {
    backgroundColor: 'red',
  }
});
>>>>>>> origin/master
