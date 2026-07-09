import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../theme';

type Properties = {
  children: ReactNode;
  shape?: 'circle' | 'square';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
};

export default function Button({
  children,
  shape = 'square',
  size = 'small',
  style,
  disabled,
  onPress,
}: Properties) {
  const sizeStyle =
    size === 'large' ? styles.large : size === 'medium' ? styles.medium : styles.small;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        shape === 'circle' ? styles.circle : styles.square,
        sizeStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: RADIUS.pill,
  },
  square: {
    borderRadius: RADIUS.sm,
  },
  small: {
    height: 42,
    width: 42,
  },
  medium: {
    height: 52,
    width: 52,
  },
  large: {
    height: 64,
    width: 64,
  },
});
