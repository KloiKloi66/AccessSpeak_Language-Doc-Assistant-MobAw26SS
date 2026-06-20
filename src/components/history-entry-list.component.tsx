import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Properties = {
  title: string,
  difficulty: string,
  type: string,
  style?: TextStyle
};

export default function HistoryEntryList({title, difficulty, type, style}: Properties) {
  return <View style={styles.mainView}>
    <Text style={styles.text}>{title}</Text>
    <View style={styles.difficultyAndIcon}>
      <View style={[
        difficulty === 'schwierig' && styles.hard,
        difficulty === 'mittel' && styles.medium,
        difficulty === 'leicht' && styles.easy,
        styles.difficulty
      ]}>
        <Text style={styles.text}>{difficulty}</Text>
      </View>
      {type === 'document' ?
        <Ionicons name="document-text-outline" size={24} color="white" />
        :
        <MaterialCommunityIcons name="image-outline" size={24} color="white" />
      }
    </View>
  </View>;
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'darkgrey',
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16
  },
  difficultyAndIcon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  difficulty: {
    width: 80,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  easy: {
    backgroundColor: '#44b835',
  },
  medium: {
    backgroundColor: '#e0b412',
  },
  hard: {
    backgroundColor: 'red',
  }
});