import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

type Props = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function FunctionsCard({
  title,
  subtitle,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.mainView}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Feather 
        name="arrow-up-right" 
        size={24} 
        color="white" 
        style={styles.arrowIcon}
      />

      <View style={styles.iconContainer}>
        <Ionicons name="camera-outline" size={34} color="white" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: 150,
    height: 150,
    backgroundColor: '#666677',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'flex-end',

    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  arrowIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  iconContainer: {
    position: 'absolute',
    top: 20,
    left: 16,

    width: 72,
    height: 72,
    borderRadius: 20,

    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,

    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    color: 'white',
    opacity: 0.75,
    fontSize: 14,
    marginTop: 4,
  },
});