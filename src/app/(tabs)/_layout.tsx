import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useDocuments } from '../../utils/DataProvider';
import * as DocumentPicker from "expo-document-picker";

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { COLORS } from '@theme';

export default function TabsLayout() {
  const { addEntry } = useDocuments();

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.text,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
          tabBarItemStyle: styles.tabItem,
          sceneStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
           name="cameraPage"
          listeners={{
            tabPress: async (e) => {
               e.preventDefault();  //verhindert, dass er tatsächlich zur cameraPage navigiert.

              const result = await DocumentPicker.getDocumentAsync({
                type: [
                  "application/pdf",
                  "image/*",
                ],
                multiple: false,
                copyToCacheDirectory: true,
              });

              if (!result.canceled) {
                const file = result.assets[0];

                 console.log(file);

                const isImage = file.mimeType?.startsWith("image/");
                const isPdf = file.mimeType === "application/pdf";

                await addEntry(
                  file.name,
                  isImage ? "image" : isPdf ? "pdf" : "unknown",
                  new Date().toLocaleDateString(),
                  file.uri,
                  "leicht"
                );
              }
            },
          }}
          options={{
            title: "Upload",
            tabBarIcon: ({ color }) => (
              <Feather name="upload" size={24} color={color} />
             ),
           }}
          />
        <Tabs.Screen
          name="historyPage"
          options={{
            title: 'Verlauf',
            tabBarIcon: ({ color }) => (
              <Feather name="list" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatBotPage"
          options={{
            title: 'ChatBot',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="robot-outline" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 70,
    paddingHorizontal: 10,
  },
  tabItem: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
