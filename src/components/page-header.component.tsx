import React, { ReactNode } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageTitle from './page-title.component';
import Button from './button.component';

import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, SPACING } from '../theme';

type Properties = {
  children: ReactNode;
  style?: TextStyle;
};

export default function PageHeader({ children, style }: Properties) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }, style]}>
      {/* Left: back button */}
      <Button style={styles.backBtn} onPress={() => router.back()} shape="circle">
        <Entypo name="chevron-thin-left" size={22} color={COLORS.text} />
      </Button>

      {/* Center: title */}
      <View style={styles.titleWrap}>
        <PageTitle>{children}</PageTitle>
      </View>

      {/* Right: spacer so title stays centered */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  backBtn: {
    backgroundColor: COLORS.surface,
    flexShrink: 0,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 42, // same as Button small size
    flexShrink: 0,
  },
});
