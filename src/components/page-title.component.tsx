import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

type Properties = {
  children: ReactNode,
  style?: TextStyle
};

export default function PageTitle({children, style}: Properties) {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold'
  }
});