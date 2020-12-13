import React, {useEffect, useState} from 'react';
import WifiManager from 'react-native-wifi-reborn';
import {
  Content,
  List,
  ListItem,
  Text,
  Button,
  Icon,
  View,
  Spinner,
} from 'native-base';
import {Alert, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';

const Wifi = (props) => {
  const [wifiList, setWifiList] = useState([]);
  const [nameSSID, setNameSSID] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isScan, setIsScan] = useState(false);

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Button transparent onPress={rescanWifiList}>
          <Icon type="Ionicons" name="refresh" />
        </Button>
      ),
      headerRight: () => (
        <Button transparent onPress={() => props.navigation.navigate('Home')}>
          <Icon type="Ionicons" name="arrow-forward-outline" />
        </Button>
      ),
      headerStyle: {
        backgroundColor: '#3e8aff',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    });
  }, [props.navigation]);

  useEffect(() => {
    const connectWifi = async () => {
      // const currentWifi = await WifiManager.getCurrentWifiSSID();
      const wifis = await WifiManager.loadWifiList();
      // WifiManager.connectToProtectedSSID(
      //   'TuHocArduino',
      //   '123456789',
      //   true,
      // ).then(
      //   (data) => {
      //     console.log('Connected successfully!');
      //     console.log(data);
      //   },
      //   () => {
      //     console.log('Connection failed!');
      //   },
      // );
      // const ipWifi = await WifiManager.getIP();
      setWifiList(wifis);
    };
    connectWifi();
  }, []);

  useEffect(() => {
    if (isEnabled) {
      rescanWifiList();
    }
  }, [isEnabled]);

  useEffect(() => {
    const countCheck = setInterval(async () => {
      const enabled = await WifiManager.isEnabled();
      setIsEnabled(enabled);
    }, 5000);
    return () => {
      clearInterval(countCheck);
    };
  });

  const rescanWifiList = async () => {
    await setIsScan(true);
    const newWifiList = await WifiManager.reScanAndLoadWifiList();
    await Promise.all([setWifiList(newWifiList), setIsScan(false)]);
  };

  const sendApi = async () => {
    console.log(123);
    await axios.get('http://192.168.4.1/?LED=E360_ON');
  };

  const lapsList = wifiList.map((data, i) => {
    return (
      <ListItem
        key={i}
        onPress={
          // () => Alert.alert(data.SSID)
          sendApi
        }>
        <Text>SSID: {data.SSID}</Text>
      </ListItem>
    );
  });

  return (
    <>
      <Modal isVisible={!isEnabled} style={styles.modal}>
        <View style={styles.inside}>
          <Spinner color="#3e8aff" />
          <Text>WIFI DISCONNECT</Text>
        </View>
      </Modal>
      <Modal isVisible={isScan} style={styles.modal}>
        <View style={styles.inside}>
          <Spinner color="#3e8aff" />
          <Text>Scanning...</Text>
        </View>
      </Modal>
      <Content>
        <List>{lapsList}</List>
      </Content>
    </>
  );
};

export default Wifi;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inside: {
    backgroundColor: '#fff',
    height: 120,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

{
  /* <Header
  style={{backgroundColor: '#3e8aff'}}
  androidStatusBarColor="#0a3473d1">
  <Left>
    <Button transparent onPress={rescanWifiList}>
      <Icon type="Ionicons" name="refresh" />
    </Button>
  </Left>
  <Body>
    <Title>Wifi List</Title>
  </Body>
  <Right>
    <Button transparent onPress={() => Actions.home()}>
      <Icon type="Ionicons" name="arrow-forward-outline" />
    </Button>
  </Right>
</Header> */
}
