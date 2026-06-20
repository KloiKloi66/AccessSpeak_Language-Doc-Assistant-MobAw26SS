import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Properties = {
  title: string,
  difficulty: string,
  type: string,
  date: string,
  style?: TextStyle
};

export default function HistoryEntryGrid({title, difficulty, type, date, style}: Properties) {
  return <View style={[styles.mainView, style]}>
    <Text style={styles.text}>{title}</Text>
    <Text 
      style={[
        styles.text,
        difficulty === 'schwierig' && styles.hard,
        difficulty === 'mittel' && styles.medium,
        difficulty === 'leicht' && styles.easy,
      ]}
    >{difficulty}</Text>
    <View style={styles.iconAndDateArea}>
      {type === 'document' ?
        <Ionicons name="document-text-outline" size={24} color="white" />
        :
        <MaterialCommunityIcons name="image-outline" size={24} color="white" />
      }
      <Text style={styles.text}>{date}</Text>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'darkgrey',
    height: 150,
    width: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 20
  },
  iconAndDateArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  easy: {
    backgroundColor: '#44b835',
  },
  medium: {
    backgroundColor: '#e0b412',
  },
  hard: {
    backgroundColor: 'red',
  },
});