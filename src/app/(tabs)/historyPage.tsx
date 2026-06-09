import { View, StyleSheet, ScrollView, Text } from 'react-native';

import PageHeader from '../../components/page-header.component';

export default function HistoryPage() {
  return (
    <View style={styles.mainView}>
      <PageHeader>Verlauf</PageHeader>
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