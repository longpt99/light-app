import React from 'react';
import {Text, View, Spinner} from 'native-base';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export default ({isEnabled}) => {
  return (
    <Modal isVisible={!isEnabled} style={styles.modal}>
      <View style={styles.inside}>
        <Spinner color="#3e8aff" />
        <Text>WIFI DISCONNECT</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  inside: {
    backgroundColor: '#fff',
    height: 120,
    width: 200,
    alignItems: 'center',
    borderRadius: 10,
  },
});
