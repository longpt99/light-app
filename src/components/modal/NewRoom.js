import {Button, Form, Input, Item, Label, Text, View} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export default ({isVisibaleNewRoom, submitNewRoom, hiddenVisibaleNewRoom}) => {
  const [nameError, setNameError] = useState(null);
  const [ipError, setIpError] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const clearErrorState = () => {
    setNameError(null);
    setIpError(null);
  };

  const handleSubmit = async () => {
    clearErrorState();
    if (roomName.trim() === '' && ipAddress.trim() === '') {
      setNameError('Room name required');
      setIpError('IP address required');
      return;
    }

    if (roomName.trim() === '') {
      setNameError('Room name required');
      return;
    }
    if (ipAddress.trim() === '') {
      setIpError('IP address required');
      return;
    }
    const newRoom = {
      name: roomName,
      value: 0,
      isEnable: false,
      ip: ipAddress,
    };
    submitNewRoom(newRoom);
    setRoomName('');
    setIpAddress('');
  };

  return (
    <Modal isVisible={isVisibaleNewRoom}>
      <Form style={styles.newRoom}>
        <Item floatingLabel>
          <Label>Room name</Label>
          <Input onChangeText={(val) => setRoomName(val)} />
        </Item>
        {nameError && (
          <Text style={[styles.textError, styles.warningColor]}>
            * {nameError}
          </Text>
        )}
        <Item floatingLabel>
          <Label>IP Address</Label>
          <Input onChangeText={(val) => setIpAddress(val)} />
        </Item>
        {ipError && (
          <Text style={[styles.textError, styles.warningColor]}>
            * {ipError}
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          <Button
            warning
            style={[styles.btn, styles.btnLeft]}
            onPress={() => {
              hiddenVisibaleNewRoom();
              clearErrorState();
            }}>
            <Text>Cancel</Text>
          </Button>
          <Button
            info
            onPress={handleSubmit}
            style={[styles.btn, styles.btnRight]}>
            <Text>Add</Text>
          </Button>
        </View>
      </Form>
    </Modal>
  );
};

const styles = StyleSheet.create({
  newRoom: {
    backgroundColor: 'white',
    width: '80%',
    borderColor: '#fff',
    borderRadius: 10,
    margin: '10%',
  },
  btnLeft: {
    borderBottomLeftRadius: 10,
  },
  btnRight: {
    borderBottomRightRadius: 10,
  },
  btn: {
    width: '50%',
    justifyContent: 'center',
  },
  textError: {
    fontStyle: 'italic',
    marginLeft: 15,
    color: '#F65959',
  },
});
