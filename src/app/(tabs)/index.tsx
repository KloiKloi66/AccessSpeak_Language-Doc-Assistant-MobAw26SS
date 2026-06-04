import { View, StyleSheet, Text } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.mainView}>
      <Text>home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});