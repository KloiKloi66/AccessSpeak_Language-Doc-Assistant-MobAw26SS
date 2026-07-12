import { useEffect } from 'react';
import { AppState } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

import { DataProvider } from '@utils/DataProvider';
import { COLORS } from '@theme';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.background,
  },
};

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
      <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pages/instructionsPage"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: 'transparent' },
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
        <Stack.Screen
          name="pages/documentPage/[id]"
          options={{
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
      </Stack>
      </ThemeProvider>
    </DataProvider>
  );
}
