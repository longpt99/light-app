import {
  Button,
  Content,
  Right,
  Icon,
  Text,
  View,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Image,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  LogBox,
  // Text,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import {firebase} from '../firebase/config';
import {v4 as uuidv4} from 'uuid';
import {
  connectActionSheet,
  useActionSheet,
} from '@expo/react-native-action-sheet';
import axios from 'axios';
LogBox.ignoreLogs(['Setting a timer', 'VirtualizedLists']);

const Home = ({route, navigation}) => {
  const {userId} = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [lightList, setLightList] = useState([]);
  const [isVisibleIp, setIsVisibleIp] = useState(false);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [addLight, setAddLight] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [idRoom, setIdRoom] = useState('');
  const {showActionSheetWithOptions} = useActionSheet();

  const clearState = () => {
    setUserInfo({});
    setLightList([]);
    setIsVisibleIp(false);
    setIsVisibleInfo(false);
    setAddLight(false);
    setRoomName('');
    setIpAddress('');
    setIdRoom('');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button transparent onPress={() => setIsVisibleInfo(true)}>
          <Icon name="person-outline" />
        </Button>
      ),
      headerRight: () => (
        <Button transparent onPress={openActionSheet}>
          <Icon name="ellipsis-horizontal-outline" />
        </Button>
      ),
      headerStyle: {
        backgroundColor: '#3e8aff',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    });
  }, [navigation, isVisibleIp]);

  useEffect(() => {
    firebase
      .database()
      .ref(`lights/${userId}/data`)
      .once('value', function (snapshot) {
        const values = [];
        snapshot.forEach((item) => {
          const data = {...item.val()};
          values.push({id: item.key, ...data});
        });
        setLightList(values);
      });
    firebase
      .database()
      .ref(`lights/${userId}/`)
      .once('value', function (snapshot) {
        const {email, name, data} = snapshot.val();
        setUserInfo({
          email,
          name,
          totalRoom: Object.keys(data).length.toString(),
        });
      });
  }, [userId]);

  const sendApi = async (ip, val) => {
    await axios.get(`http://${ip}/?LED=E360_${val ? 'ON' : 'OFF'}`);
    return;
  };

  const toggleSwitch = async (id) => {
    const newData = [...lightList];
    const len = newData.length;
    for (let i = 0; i < len; i++) {
      if (newData[i].id === id) {
        const val = !newData[i].isEnable;
        sendApi(newData[i].ip, val);
        newData[i].isEnable = val;
        firebase
          .database()
          .ref(`lights/${userId}/data/${id}`)
          .update({isEnable: val});
        break;
      }
    }
    setLightList(newData);
  };

  const deleteRow = (id) => {
    const newData = [...lightList];
    const prevIndex = lightList.findIndex((item) => item.id === id);
    newData.splice(prevIndex, 1);
    firebase.database().ref(`lights/${userId}/data/${id}`).remove();
    setLightList(newData);
  };

  const getId = (id) => {
    setIdRoom(id);
  };

  const setLightValue = async (val) => {
    const newData = [...lightList];
    const len = newData.length;
    for (let i = 0; i < len; i++) {
      if (newData[i].id === idRoom) {
        const lightValue = Math.round(Number(val));
        if (lightValue === 0) {
          newData[i].value = lightValue;
          newData[i].isEnable = false;
          firebase
            .database()
            .ref(`lights/${userId}/data/${idRoom}`)
            .update({value: lightValue, isEnable: false});
          break;
        }
        newData[i].value = lightValue;
        firebase
          .database()
          .ref(`lights/${userId}/data/${idRoom}`)
          .update({value: lightValue});
        break;
      }
    }
    await Promise.all([setLightList(newData), setIdRoom('')]);
  };

  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => console.log('1')}
      style={styles.rowFront}
      underlayColor={'#fff'}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <Icon
            name={data.item.isEnable ? 'bulb' : 'bulb-outline'}
            style={{color: 'orange'}}
          />
          <View style={{marginLeft: 20}}>
            {isVisibleIp ? (
              <Text>
                {data.item.name} -{' '}
                <Text style={styles.textIp}>{data.item.ip}</Text>
              </Text>
            ) : (
              <Text>{data.item.name}</Text>
            )}
            <Text note>Light is {data.item.isEnable ? 'ON' : 'OFF'}</Text>
          </View>
          <Right>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={'#f4f3f4'}
              onValueChange={() => toggleSwitch(data.item.id)}
              value={data.item.isEnable}
            />
          </Right>
        </View>
        <View>
          <Slider
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#3e8aff"
            maximumTrackTintColor="#ddd"
            thumbTintColor="orange"
            value={data.item.value}
            onSlidingStart={() => getId(data.item.id)}
            onSlidingComplete={setLightValue}
          />
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.backRightBtn}
        onPress={() => deleteRow(data.item.id)}>
        <Icon name="trash-outline" style={styles.warningColor} />
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = async () => {
    setAddLight(false);
    const newData = [...lightList];
    const data = {
      name: roomName,
      value: 0,
      isEnable: false,
      key: uuidv4(),
      ip: ipAddress,
    };
    const store = firebase.database().ref(`lights/${userId}/data`).push(data);
    newData.push({id: store.key, ...data});
    await Promise.all([setLightList(newData), setRoomName('')]);
  };

  const openActionSheet = () => {
    // console.log(status);
    const options = [
      'New room',
      isVisibleIp ? 'Hiden IP Room' : 'Show IP Room',
      'About us',
      'Sign out',
      'Cancel',
    ];
    const destructiveButtonIndex = 4;
    const cancelButtonIndex = 4;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          setAddLight(true);
        } else if (buttonIndex === 1) {
          setIsVisibleIp(!isVisibleIp);
        } else if (buttonIndex === 3) {
          clearState();
          navigation.navigate('Login');
        }
      },
    );
  };

  return (
    <>
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
              <Input editable={false} value={userInfo.totalRoom} />
            </Item>
          </Form>
          <Button
            info
            onPress={() => setIsVisibleInfo(false)}
            full
            style={[styles.btnRight, styles.btnLeft]}>
            <Text>Back</Text>
          </Button>
        </View>
      </Modal>
      <Modal isVisible={addLight} style={styles.modelNewRoom}>
        <Form style={styles.newRoom}>
          <Item floatingLabel style={{marginBottom: 1}}>
            <Label>Room name</Label>
            <Input onChangeText={(roomName) => setRoomName(roomName)} />
          </Item>
          <Item floatingLabel style={{marginBottom: 1}}>
            <Label>IP Address</Label>
            <Input onChangeText={(ipAddress) => setIpAddress(ipAddress)} />
          </Item>
          <View style={{flexDirection: 'row'}}>
            <Button
              warning
              style={[styles.btn, styles.btnLeft]}
              onPress={() => setAddLight(false)}>
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
      <Content>
        <Image
          source={require('../assets/img/UET-logo.png')}
          style={styles.image}
        />
        <SwipeListView
          data={lightList}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe={true}
        />
      </Content>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: null,
    flex: 1,
    opacity: 0.5,
  },
  backTextWhite: {
    color: '#FFF',
  },
  warningColor: {
    color: '#F65959',
  },
  rowFront: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowBack: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backRightBtn: {
    width: 50,
  },
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

  modelNewRoom: {
    // textAlign: 'center',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textIp: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 12,
  },
  textProfile: {fontSize: 100, marginBottom: 10, textAlign: 'center'},
});

export default connectActionSheet(Home);

// import React, { Fragment, useState, useRef } from 'react'
// import { Alert, Button, StyleSheet, Text, View } from 'react-native'
// import ActionSheet from '@selcouth-digital/react-native-action-sheet';

// const Example = () => {

//   const [visible, setVisible] = useState(false)

//   const options = [
//     {
//       title: 'Option 1',
//       onPress: (e, callback) => {
//         Alert.alert('ALo')
//         callback()
//       }
//     },
//     {
//       title: 'Option 2',
//       onPress: (e, callback) => {
//         console.log(e)
//         callback()
//       }
//     }
//   ]

//   const CancelButton = callback => <Button onPress={callback} title="Cancel" />

//   return (
//     <Fragment>
//       <View >
//         <Text>React Native - Action Sheet</Text>
//         <Button onPress={() => setVisible(true)} title="Open ActionSheet" />
//       </View>
//       <ActionSheet CancelButton={CancelButton} onDismiss={() => setVisible(false)} options={options} visible={visible} />
//     </Fragment>
//   )
// }
