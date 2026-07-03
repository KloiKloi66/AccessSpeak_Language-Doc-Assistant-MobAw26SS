import { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import PageHeader from '../../components/page-header.component';
import PermissionCard from '../../components/permission-card.component';
import Button from '../../components/button.component';

import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const API_URL = "http://192.168.178.30:8000";  

export default function CameraPage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState("");

  if (!permission) {
    return <View />;
  }

async function takePhoto() {
  if (!cameraRef.current) {
    return;
  }

  try {
    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    if (!photo?.uri) {
      return;
    }



    const formData = new FormData();

    formData.append(
      "file",
      {
        uri: photo.uri,
        name: "document.jpg",
        type: "image/jpeg",
      } as any
    );

    const response = await fetch(`${API_URL}/scan`, {
      method: "POST",
      body: formData,
    });

const result = await response.json();

console.log(result);

setScanResult(result.result);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <View style={styles.mainView}>
      <PageHeader>Scanner</PageHeader>

      {permission.granted ?
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
          {scanResult !== "" && (
  <View
    style={{
      backgroundColor: "white",
      margin: 20,
      padding: 15,
      borderRadius: 12,
    }}
  >
    <Text
      style={{
        color: "black",
        fontSize: 16,
      }}
    >
      {scanResult}
    </Text>
  </View>
)}
        </>
      :
        <View style={styles.permissionView}>
          <PermissionCard 
            title='Kamerazugriff aktivieren?'
            description='Kamerazugriff muss gewährt werden, um die Kamera Funktion zu nutzen.'
            grantPermissionOnPress={requestPermission}
          ></PermissionCard>
        </View>
      }
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