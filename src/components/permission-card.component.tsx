import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme';

type Props = {
  title: string;
  description: string;
  grantPermissionOnPress: () => void;
  revokePermissionOnPress?: () => void;
};

export default function PermissionCard({
  title,
  description,
  grantPermissionOnPress,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={grantPermissionOnPress}>
          <Text style={[styles.btnLabel, styles.cancel]}>Abbrechen</Text>
        </TouchableOpacity>
        <View style={styles.sep} />
        <TouchableOpacity style={styles.btn} onPress={grantPermissionOnPress}>
          <Text style={[styles.btnLabel, styles.confirm]}>Aktivieren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.border,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 160,
    width: 300,
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sep: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  btn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancel: {
    color: COLORS.textMuted,
  },
  confirm: {
    color: COLORS.text,
  },
});
