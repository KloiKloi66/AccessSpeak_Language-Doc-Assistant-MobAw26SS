import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

import { DataProvider } from '../utils/DataProvider';

export default function RootLayout() {
  useEffect(() => {
    const removeNavBar = async () => {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    };

    removeNavBar();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        removeNavBar();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <DataProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1A1929' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pages/instructionsPage"
          options={{
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pages/translationPage"
          options={{
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
      </Stack>
    </DataProvider>
  );
}
