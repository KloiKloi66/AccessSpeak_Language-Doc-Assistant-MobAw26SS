import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function RootLayout() {
    useEffect(() => {
    const removeNavBar = async () => {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    };
  
    removeNavBar();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        removeNavBar();
      }
    });

    return () => subscription.remove();
  }, []);

  return <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle: "light"
        }}
      >
        <Stack.Screen name='(tabs)' />
        <Stack.Screen 
          name="pages/instructionsPage"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="pages/translationPage"
          options={{
            animation: 'slide_from_bottom',
            headerShown: false
          }}
        />
      </Stack>;
};