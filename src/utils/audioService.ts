import { Audio } from "expo-av";

let recording: Audio.Recording | null = null;

console.log("AudioService geladen");

export async function startRecording() {
    console.log("Starte Aufnahme...");

    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
        throw new Error("Keine Mikrofonberechtigung");
    }

    await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();

    await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    await recording.startAsync();

    console.log("Aufnahme gestartet");
}

export async function stopRecording() {

    if (!recording) {
        throw new Error("Keine Aufnahme aktiv");
    }

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();

    recording = null;

    if (!uri) {
        throw new Error("Keine Audio-Datei erstellt");
    }

    console.log("Audio URI:", uri);
    console.log("Aufnahme beendet");

    return uri;
}