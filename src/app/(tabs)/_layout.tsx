import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <View style={styles.mainView}>
      <Tabs
        screenOptions={
          { 
            headerShown: false,
          }
        }>
        <Tabs.Screen
          name='index'
          options={{
            title: "Home"
          }}
        />
        <Tabs.Screen
          name='uploadPage'
          options={{
            title: "Upload"
          }}
        />
        <Tabs.Screen
          name='historyPage'
          options={{
            title: "History"
          }}
        />
        <Tabs.Screen
          name='chatBotPage'
          options={{
            title: "ChatBot"
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingTop: 40,
    paddingBlock: 15,
    paddingHorizontal: 15,
    backgroundColor: 'black'
  }
});