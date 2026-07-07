import { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import PageHeader from '../../components/page-header.component';
import PermissionCard from '../../components/permission-card.component';
import Button from '../../components/button.component';

import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//const API_URL = `http://${devHost}:8001`; // for use with physical device on same network
//const API_URL = `http://:127.0.0.18001`;
const API_URL = `http://10.0.2.2:8001`; // for android emulator

export default function CameraPage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<string>("");

  if (!permission) {
    return <View />;
  }

  async function takePhoto() {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo?.uri) return;

      console.log("📸 Photo taken:", photo.uri);

      const formData = new FormData();

      formData.append("file", {
        uri: photo.uri,
        name: "document.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        body: formData,
      });

      console.log("STATUS:", response.status);

      const data = await response.json();
      console.log("DATA:", data);

      if (!response.ok) {
        console.log("Backend Error:", data);
        setScanResult(data?.detail || data?.message || "Fehler beim Scan");
        return;
      }

      setScanResult(data.result ?? "");

    } catch (error) {
      console.error("SCAN ERROR:", error);
      setScanResult("Verbindungsfehler beim Scan");
    }
  }

  return (
    <View style={styles.mainView}>
      <PageHeader>Scanner</PageHeader>

      {permission.granted ? (
        <>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
            />
          </View>

          <View style={styles.buttonArea}>
            <Button style={styles.button} size="medium">
              <SimpleLineIcons name="picture" size={24} color="black" />
            </Button>

            <Button
              onPress={takePhoto}
              style={styles.button}
              size="large"
            >
              <Feather name="camera" size={28} color="black" />
            </Button>

            <Button style={styles.button} size="medium">
              <MaterialCommunityIcons
                name="robot-dead-outline"
                size={24}
                color="black"
              />
            </Button>
          </View>

          {scanResult !== "" && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{scanResult}</Text>
            </View>
          )}
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
  mainView: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    marginTop: 20,
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
  },
  resultBox: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  resultText: {
    color: 'black',
    fontSize: 16,
  },
});