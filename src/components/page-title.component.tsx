import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { COLORS } from '../theme';

type Properties = {
  children: ReactNode;
  style?: TextStyle;
};

export default function PageTitle({ children, style }: Properties) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
