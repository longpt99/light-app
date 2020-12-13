import {Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

export default function Footer() {
  return (
    <Text style={styles.textFooter}>&copy; 2020 UET. All rights reserved.</Text>
  );
}

const styles = StyleSheet.create({
  textFooter: {
    color: '#888',
    textAlign: 'center',
  },
});
