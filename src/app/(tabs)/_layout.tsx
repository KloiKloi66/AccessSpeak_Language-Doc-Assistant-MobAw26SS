import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
  return (
    <View style={styles.mainView}>
      <Tabs
        screenOptions={
          { 
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIconStyle: {
              marginTop: 5
            },
          }
        }>
        <Tabs.Screen
          name='index'
          options={{
            title: "Home",
            tabBarIcon: ({color}) => (
              <Ionicons 
                name="home-outline" 
                size={24} 
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen
          name='cameraPage'
          options={{
            title: "Kamera",
            tabBarIcon: ({color}) => (
              <Entypo 
                name="camera" 
                size={24} 
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen
          name='historyPage'
          options={{
            title: "History",
            tabBarIcon: ({color}) => (
              <Feather 
              name="list" 
              size={24} 
              color={color} />
            )
          }}
        />
        <Tabs.Screen
          name='chatBotPage'
          options={{
            title: "ChatBot",
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons 
                name="robot-dead-outline" 
                size={24} 
                color={color}
              />
            )
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