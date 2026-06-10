import React, { ReactNode } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';

type Properties = {
  children: ReactNode,
  shape?: 'circle' | 'square',
  size?: 'small' | 'medium' | 'large',
  style?: TextStyle,
  onPress?: () => void
};

export default function Button({children, shape='square', size='small', style, onPress}: Properties) {
  let contentStyles;

  switch(size) {
    case 'small':
      contentStyles = styles.small;
      break;
    case 'medium':
      contentStyles = styles.medium;
      break;
    case 'large':
      contentStyles = styles.large;
      break;
    default:
      contentStyles = styles.small
  }

  return <>
    <TouchableOpacity 
      style={[
        styles.mainView, 
        shape === "circle"
          ? { borderRadius: 20 }
          : { borderRadius: 10 },
        contentStyles,
        style
      ]} 
      onPress={onPress} 
      activeOpacity={0.5}
    >
      {children}
    </TouchableOpacity>
  </>;
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'darkgrey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  small: {
    height: 40,
    width: 40,
  },
  medium: {
    height: 50,
    width: 50,
  },
  large: {
    height: 60,
    width: 60,
  }
});