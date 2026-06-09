import React, { ReactNode } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { router } from 'expo-router';

import PageTitle from './page-title.component';
import Button from './button.component';

import Entypo from '@expo/vector-icons/Entypo';

type Properties = {
  children: ReactNode,
  style?: TextStyle
};

export default function PageHeader({children, style}: Properties) {
  return <View style={[styles.titleArea, style]}>
    <Button style={styles.back} onPress={() => router.back()} shape='circle'>
      <Entypo name="chevron-thin-left" size={24} color="black" />
    </Button>
    <PageTitle>{children}</PageTitle>
  </View>;
};

const styles = StyleSheet.create({
  titleArea: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  back: {
    position: "absolute",
    left: 16,
  }
});