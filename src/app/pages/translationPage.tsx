import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import PageHeader from '../../components/page-header.component';
import Button from '../../components/button.component';

import Octicons from '@expo/vector-icons/Octicons';

export default function TranslationPage() {

  function switchLanguages() {
    console.log('switched languages')
    // functionality needs to be added
  }

  return (
    <View style={styles.mainView}>
      <PageHeader>Übersetzung</PageHeader>

      <View style={styles.languageSelection}>
        <TouchableOpacity style={styles.languageSelector}>
          <Image 
            source={require("../../../assets/temp/deutschland.png")}
            style={styles.img}
          ></Image>
          <Text style={styles.languageTitle}>Deutsch</Text>
        </TouchableOpacity>

        <Button onPress={switchLanguages} shape='circle'>
          <Octicons name="arrow-switch" size={24} color="white" />
        </Button>

        <TouchableOpacity style={styles.languageSelector}>
          <Image 
            source={require("../../../assets/temp/uk.jpg")}
            style={styles.img}
          ></Image>
          <Text style={styles.languageTitle}>Englisch</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.translationArea}>
        <Text style={{color:'red', fontSize: 42, fontWeight: 'bold'}}>coming soon</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingTop: 40,
    paddingBlock: 15,
    paddingHorizontal: 15,
    backgroundColor: 'black'
  },
  languageSelection: {
    height: 160, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'grey',
    marginVertical: 20,
    borderRadius: 20,
    padding: 20
  },
  languageSelector: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    height: 90,
    width: 90,
    borderRadius: 45
  },
  languageTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  translationArea: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey'
  }
});