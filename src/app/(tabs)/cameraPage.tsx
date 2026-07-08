import { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import PageHeader from '../../components/page-header.component';
import PermissionCard from '../../components/permission-card.component';
import Button from '../../components/button.component';
import { COLORS, RADIUS, SPACING } from '../../theme';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function CameraPage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) return <View />;

  async function takePhoto() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    setPhotoUri(photo.uri);
    console.log('Foto aufgenommen:', photo.uri);
  }

  async function pickImage() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Berechtigung benötigt',
        'Bitte erlaube den Zugriff auf deine Galerie.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);

      console.log('Bild ausgewählt:', uri);

    }
  }

  function openChatbot() {
  router.push('/(tabs)/chatBotPage');
 }

  return (
    <View style={styles.root}>
      <PageHeader>Kamera</PageHeader>

      {permission.granted ? (
        <>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
            />
          </View>

          <View style={styles.controls}>
            <Button
              size="medium"
              style={styles.sideBtn}
              onPress={pickImage}
            >
              <SimpleLineIcons
                name="picture"
                size={22}
                color={COLORS.text}
              />
            </Button>

            <Button
              size="large"
              onPress={takePhoto}
              style={styles.shutterBtn}
            >
              <Ionicons
                name="camera-outline"
                size={30}
                color={COLORS.text}
              />
            </Button>

            <Button
              size="medium"
              style={styles.sideBtn}
              onPress={openChatbot}
            >
               <MaterialCommunityIcons
                  name="robot-outline"
                 size={22}
                 color={COLORS.text}
               />
          </Button>
          </View>
        </>
      ) : (
        <View style={styles.permissionView}>
          <PermissionCard
            title="Kamerazugriff aktivieren?"
            description="Kamerazugriff muss gewährt werden, um die Kamera Funktion zu nutzen."
            grantPermissionOnPress={requestPermission}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cameraContainer: {
    flex: 1,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  controls: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
  },
  sideBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
  },
  permissionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});