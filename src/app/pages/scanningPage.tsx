import { useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import PageHeader from '@components/page-header.component';
import PermissionCard from '@components/permission-card.component';
import Button from '@components/button.component';
import { useDocuments } from '@utils/DataProvider';
import { AI_URL as API_URL } from '@utils/backendConfig';

import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CameraPage() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { addEntry } = useDocuments();

  if (!permission) {
    return <View />;
  }

  async function takePhoto() {
    try {
      if (!cameraRef.current) return;

      setLoading(true);
      setScanResult("");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo?.uri) {
        setLoading(false);
        return;
      }

      console.log("Photo taken:", photo.uri);

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
        setScanResult(
          data?.detail || data?.message || "Fehler beim Scan"
        );
        return;
      }

      setScanResult(data.text ?? "");

      // Title comes from the agent, originalText is the verbatim OCR text.
      // No manual difficulty: the backend rates the text automatically (LIX).
      await addEntry(
        data.title || "Gescanntes Dokument",
        "document",
        new Date().toLocaleDateString(),
        data.text ?? "",
      );

    } catch (error) {
      console.error("SCAN ERROR:", error);
      setScanResult("Verbindungsfehler beim Scan");
    } finally {
      setLoading(false);
    }
  }


  async function pickImage() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Bitte erlaube den Zugriff auf die Galerie.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const image = result.assets[0];

      console.log("Gallery image selected:", image.uri);

      setLoading(true);
      setScanResult("");

      const formData = new FormData();

      formData.append("file", {
        uri: image.uri,
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
        setScanResult(
          data?.detail || data?.message || "Fehler beim Scan"
        );
        return;
      }

      setScanResult(data.text ?? "");

      // Title comes from the agent, originalText is the verbatim OCR text.
      // No manual difficulty: the backend rates the text automatically (LIX).
      await addEntry(
        data.title || "Gescanntes Dokument",
        "document",
        new Date().toLocaleDateString(),
        data.text ?? "",
      );

    } catch (error) {
      console.error("GALLERY SCAN ERROR:", error);
      setScanResult("Fehler beim Galerie-Scan");
    } finally {
      setLoading(false);
    }
  }


  function openChatbot() {
    router.push({
      pathname: "/(tabs)/chatBotPage",
      params: {
        scanContext: scanResult,
      },
    });
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
            <Button
              onPress={pickImage}
              style={styles.button}
              size="medium"
            >
              <SimpleLineIcons
                name="picture"
                size={24}
                color="black"
              />
            </Button>

            <Button
              onPress={takePhoto}
              style={styles.button}
              size="large"
            >
              <Feather
                name="camera"
                size={28}
                color="black"
              />
            </Button>

            <Button
              onPress={openChatbot}
              style={styles.button}
              size="medium"
            >
              <MaterialCommunityIcons
                name="robot-outline"
                size={24}
                color="black"
              />
            </Button>
          </View>

          {scanResult !== "" && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                {scanResult}
              </Text>
            </View>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color="#ffffff"
              />

              <Text style={styles.loadingText}>
                Dokument wird gescannt...
              </Text>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
});