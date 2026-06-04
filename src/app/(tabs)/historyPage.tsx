import { View, StyleSheet, Text } from 'react-native';

export default function HistoryPage() {
  return (
    <View style={styles.mainView}>
      <Text>history</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});