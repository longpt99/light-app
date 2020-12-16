import {Button, Form, Input, Item, Label, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export default ({userInfo, isVisibleInfo, hiddenInfo}) => {
  // const {userInfo, isVisibleInfo} = props;
  return (
    <Modal isVisible={isVisibleInfo}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <Text style={styles.textProfile}>Profile</Text>
        <Form>
          <Item floatingLabel>
            <Label>Name</Label>
            <Input editable={false} value={userInfo.name} />
          </Item>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input editable={false} value={userInfo.email} />
          </Item>
          <Item floatingLabel>
            <Label>Total Room</Label>
            <Input
              editable={false}
              value={userInfo.totalRoom ? userInfo.totalRoom.toString() : '0'}
            />
          </Item>
        </Form>
        <Button info onPress={hiddenInfo} full style={styles.btn}>
          <Text>Back</Text>
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textProfile: {fontSize: 100, marginBottom: 10, textAlign: 'center'},
  btn: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
