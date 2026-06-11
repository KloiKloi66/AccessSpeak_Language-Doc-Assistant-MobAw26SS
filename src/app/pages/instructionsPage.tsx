import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function InstructionsPage() {

  return (
    <View style={styles.mainView}>
      <TouchableOpacity style={styles.transparentReturnArea} onPress={() => router.back()} />

      <View style={styles.instructionsPage}>
        <Text style={styles.temp}>wie die anleitung aussieht, folgt noch</Text>
        <Text>vielleicht ein x-button und swipe down funktion zusätzlich zum zurück gehen?</Text>
        <Text>way to add tabBar on StackScreens still missing</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  transparentReturnArea: {
    backgroundColor: 'transparent',
    height: 130
  },
  instructionsPage: {
    flex: 1,
    backgroundColor: 'darkgray',

    justifyContent: 'center',
    alignItems: 'center',
  },
  temp: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold'
  }
});