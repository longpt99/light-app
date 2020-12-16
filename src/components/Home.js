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
} from 'react-native';
import Slider from '@react-native-community/slider';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import {firebase} from '../firebase/config';
import {
  connectActionSheet,
  useActionSheet,
} from '@expo/react-native-action-sheet';
import axios from 'axios';
import Profile from './modal/Profile';
import NewRoom from './modal/NewRoom';
LogBox.ignoreLogs(['Setting a timer', 'VirtualizedLists']);

const Home = ({route, navigation}) => {
  const {userId} = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [lightList, setLightList] = useState([]);
  const [isVisibleIp, setIsVisibleIp] = useState(false);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [isVisibaleNewRoom, setIsVisibaleNewRoom] = useState(false);

  const [idRoom, setIdRoom] = useState('');

  const {showActionSheetWithOptions} = useActionSheet();

  const clearState = () => {
    setUserInfo({});
    setLightList([]);
    setIsVisibleIp(false);
    setIsVisibleInfo(false);
    setIsVisibaleNewRoom(false);
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
      .ref(`lights/${userId}/`)
      .once('value', function (snapshot) {
        const {email, name, data} = snapshot.val();
        const values = [];
        Object.entries(data).forEach((entry) => {
          const [key, value] = entry;
          values.push({key, id: key, ...value});
        });
        setLightList(values);
        setUserInfo({
          email,
          name,
          totalRoom: data ? Object.keys(data).length : 0,
        });
      });
  }, [userId]);

  const sendApi = async (ip, val) => {
    console.log(ip, val);
    await axios.get(`http://${ip}/?LED=E360_${val ? 'ON' : 'OFF'}`);
    return;
  };

  const toggleSwitch = async (id) => {
    const newData = [...lightList];
    const len = newData.length;
    for (let i = 0; i < len; i++) {
      if (newData[i].id === id) {
        const val = !newData[i].isEnable;
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
    setUserInfo({...userInfo, totalRoom: userInfo.totalRoom - 1});
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

  const renderItem = (data) => {
    const {ip, isEnable, id, name, value} = data.item;
    return (
      <TouchableHighlight
        onPress={() => console.log('1')}
        style={styles.rowFront}
        underlayColor={'#fff'}>
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              name={isEnable ? 'bulb' : 'bulb-outline'}
              style={{color: 'orange'}}
            />
            <View style={{marginLeft: 20}}>
              <Text>
                {name}
                {isVisibleIp && (
                  <Text style={styles.textIp}>&nbsp;-&nbsp;{ip}</Text>
                )}
              </Text>
              <Text note>Light is {isEnable ? 'ON' : 'OFF'}</Text>
            </View>
            <Right>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={'#f4f3f4'}
                onValueChange={() => toggleSwitch(id)}
                value={isEnable}
              />
            </Right>
          </View>
          <View>
            <Slider
              style={{
                marginTop: 15,
              }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#3e8aff"
              maximumTrackTintColor="#ddd"
              thumbTintColor="orange"
              value={value}
              onSlidingStart={() => getId(id)}
              onSlidingComplete={setLightValue}
            />
          </View>
        </>
      </TouchableHighlight>
    );
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.backRightBtn}
        onPress={() => deleteRow(data.item.id)}>
        <Icon name="trash-outline" style={styles.warningColor} />
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = (data) => {
    setIsVisibaleNewRoom(false);
    const newData = [...lightList];
    const store = firebase.database().ref(`lights/${userId}/data`).push(data);
    newData.push({key: store.key, id: store.key, ...data});
    setLightList(newData);
    setUserInfo({...userInfo, totalRoom: userInfo.totalRoom + 1});
  };

  const openActionSheet = () => {
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
          setIsVisibaleNewRoom(true);
        } else if (buttonIndex === 1) {
          setIsVisibleIp(!isVisibleIp);
        } else if (buttonIndex === 3) {
          clearState();
          navigation.navigate('Login');
        }
      },
    );
  };

  const hiddenInfo = () => {
    setIsVisibleInfo(false);
  };

  return (
    <>
      <Profile
        isVisibleInfo={isVisibleInfo}
        userInfo={userInfo}
        hiddenInfo={hiddenInfo}
      />
      <NewRoom
        isVisibaleNewRoom={isVisibaleNewRoom}
        hiddenVisibaleNewRoom={() => setIsVisibaleNewRoom(false)}
        submitNewRoom={handleSubmit}
      />
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
    padding: 25,
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
  textIp: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 12,
  },
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
