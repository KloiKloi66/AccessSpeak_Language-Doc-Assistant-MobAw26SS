// Central backend configuration.
//
// Resolves the correct host for our two backends automatically,
// so nobody has to switch IP addresses in the code anymore:
//
//   1. Manual override    -> EXPO_PUBLIC_API_HOST is set (e.g. tunnel mode,
//                            or when auto detection picks the wrong interface)
//   2. Android emulator   -> 10.0.2.2 (the emulator's magic IP for the host machine;
//                            "localhost" would point to the emulator itself)
//   3. Everything else    -> IP of the Expo dev server (hostUri), which is the
//                            dev machine's LAN IP. Works for physical devices
//                            with Expo Go AND for the iOS simulator.
//   4. Last resort        -> localhost (e.g. hostUri missing in a production build)

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

function resolveHost(): string {
  // 1. Manual override
  const override = process.env.EXPO_PUBLIC_API_HOST;
  if (override) return override;

  // 2. Android emulator (Device.isDevice is false on emulators/simulators)
  if (Platform.OS === 'android' && !Device.isDevice) {
    return '10.0.2.2';
  }

  // 3. Expo dev server IP (LAN IP of the dev machine)
  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devHost) return devHost;

  // 4. Last resort
  return 'localhost';
}

const HOST = resolveHost();

// Database backend (entries, MongoDB)
export const API_URL = `http://${HOST}:8000`;

// AI agents backend (translate, simplify, chat)
export const AI_URL = `http://${HOST}:8001`;
