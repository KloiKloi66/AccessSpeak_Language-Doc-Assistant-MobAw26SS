import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '../theme';

type Props = {
  title: string;
  icon: ReactNode;
  onPress?: () => void;
};

export default function FunctionsCard({ title, icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      {/* Icon centered in upper 2/3 */}
      <View style={styles.iconArea}>{icon}</View>

      {/* Title pinned to bottom */}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
