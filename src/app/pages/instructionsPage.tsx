import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';

export default function Home() {

  return (
    <View style={styles.mainView}>

    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 20
  }
});