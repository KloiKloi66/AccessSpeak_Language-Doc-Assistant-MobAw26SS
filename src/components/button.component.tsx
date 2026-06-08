import React, { ReactNode } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';

type Properties = {
  children: ReactNode,
  shape: 'circle' | 'square',
  style?: TextStyle,
  onPress?: () => void
};

export default function Button({children, shape='square', style, onPress}: Properties) {
  return <>
    <TouchableOpacity 
      style={[
        styles.mainView, 
        shape === "circle"
          ? { borderRadius: 20 }
          : { borderRadius: 10 },
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
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});