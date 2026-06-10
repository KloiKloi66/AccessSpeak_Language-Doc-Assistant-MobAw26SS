import { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import PageHeader from '../../components/page-header.component';
import PermissionCard from '../../components/permission-card.component';
import Button from '../../components/button.component';

import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CameraPage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  async function takePhoto() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      // check if compression for maximum quality is "too expensive"
      quality: 1,
    });

    setPhotoUri(photo.uri);
  }

  return (
    <View style={styles.mainView}>
      <PageHeader>Kamera</PageHeader>

      {(() => {
      if (permission.granted) {
        return (
          <>
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
              />
            </View>

            <View style={styles.buttonArea}>
              <Button
                style={styles.button}
                size='medium'
              >
                <SimpleLineIcons name="picture" size={24} color="black" />
              </Button>

              <Button 
                onPress={takePhoto}
                style={styles.button}
                size='large'
              >
                <Feather name="camera" size={28} color="black" />
              </Button>

              <Button 
                style={styles.button}
                size='medium'
              >
                <MaterialCommunityIcons name="robot-dead-outline" size={24} color="black" />
              </Button>
            </View>
          </>
        );
      } else {
        return (
        <View style={styles.permissionView}>
          <PermissionCard 
            title='Kamerazugriff aktivieren?'
            description='Kamerazugriff muss gewährt werden, um die Kamera Funktion zu nutzen.'
            grantPermissionOnPress={requestPermission}
          ></PermissionCard>
        </View>
        );
      }
    })()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    marginTop: 20
  },
  camera: {
    flex: 1,
  },
  buttonArea: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionView: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  }
});