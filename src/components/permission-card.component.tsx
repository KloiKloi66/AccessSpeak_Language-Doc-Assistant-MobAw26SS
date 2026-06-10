import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  description: string;
  grantPermissionOnPress: () => void;
  revokePermissionOnPress?: () => void;
};

export default function PermissionCard({title, description, grantPermissionOnPress}: Props) {
  return (
    <View style={styles.mainView}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={grantPermissionOnPress}
        >
          <Text style={styles.buttonlabel}>Abbrechen</Text>
        </TouchableOpacity>

        <View style={styles.separator}></View>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={grantPermissionOnPress}
        >
          <Text style={styles.buttonlabel}>Aktivieren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#1F1A17',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 160,
    width: 300
  },

  permissionView: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  description: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5
  },
  permissionButton: {
    padding: 12
  },
  buttonlabel: {
    color: 'white',
    fontSize: 20
  },
  separator: {
    backgroundColor: 'grey',
    alignSelf: 'center',
    height: '25%',
    width: 1
  }
});