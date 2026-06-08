import { View, StyleSheet, ScrollView, Text } from 'react-native';

import PageTitle from '../../components/page-title.component';
import Button from '../../components/button.component';

import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

export default function HistoryPage() {
  return (
    <View style={styles.mainView}>
      <View style={styles.titleArea}>
        <Button style={styles.back} onPress={() => router.back()} shape='circle'>
          <Entypo name="chevron-thin-left" size={24} color="black" />
        </Button>
        <PageTitle>Verlauf</PageTitle>
      </View>
      <View style={styles.historyArea}>
        <View style={styles.displayOptions}>

        </View>
        <ScrollView style={styles.documentsList}>
          <Text>elems</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black'
  },
  titleArea: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  back: {
    position: "absolute",
    left: 16,
  },
  historyArea: {
    flex: 1,
    backgroundColor: 'grey',
    marginVertical: 20,
    borderRadius: 20,
    padding: 20
  },
  displayOptions: {
    height: 30
  },
  documentsList: {
    flex: 1
  }
});