import { View, StyleSheet, Text } from 'react-native';

export default function ChatBotPage() {
  return (
    <View style={styles.mainView}>
      <Text>chatBot</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});