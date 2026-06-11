import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link } from "expo-router";
import FunctionsCard from '../../components/functions-card.component';

export default function HomePage() {
  return (
    <View style={styles.mainView}>
      <View style={styles.acc_and_notifications}>
        <Text>hier kommt account & benachrichtungs zeug hin</Text>
      </View>
      <View style={styles.main}>
        <Link href={{pathname: "/pages/instructionsPage"}} asChild>
          <TouchableOpacity style={styles.instruction}
            activeOpacity={0.5}
          >
            <Text style={styles.instruction_title}>App Anleitung</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.functions}>
          <View style={styles.functionRow}>
            <FunctionsCard
              title="Kamera"
              subtitle="Text aufnehmen"
            />
            <Link href={{pathname: "/pages/translationPage"}} asChild>
              <FunctionsCard
                title="Übersetzen"
                subtitle="Schnell und einfach"
              />
            </Link>
          </View>
          <View style={styles.functionRow}>
            <FunctionsCard
              title="Lesen"
              subtitle="Text vorlesen lassen"
            />
            <FunctionsCard
              title="Scan"
              subtitle="Dokumente verstehen"
            />
          </View>
        </View>
        <View style={styles.recent}>
          <View style={styles.historyTitleBar}>
            <Text style={styles.historyTitle}>Verlauf</Text>
            <Link href={{pathname: "/(tabs)/historyPage"}} asChild>
              <TouchableOpacity activeOpacity={0.5}>
                <Text style={styles.historyText}>alles anzeigen</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.historyList}>

          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black'
  },
  acc_and_notifications: {
    backgroundColor: 'yellow',
    height: 80
  },
  main: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  instruction: {
    marginBottom: 20,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'gray',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instruction_title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  functions: {
    flex: 1,
    backgroundColor: 'lightgray',
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5
  },
  functionRow: {
    justifyContent: 'space-evenly',
    gap: 5
  },
  function: {
  },
  recent: {
    height: 165
  },
  historyTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  historyTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  historyText: {
    paddingRight: 20,
    color: 'white',
    opacity: 0.8
  },
  historyList: {
    flex: 1,
    backgroundColor: 'gray',
    opacity: 0.8,
    borderRadius: 20
  }
});