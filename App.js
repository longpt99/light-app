/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Home from './src/components/Home';
import Login from './src/components/Login';
import Register from './src/components/Register';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}

// const App = () => {
//   useEffect(() => {
//     async function connectWifi() {
//       // You can await here
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location permission is required for WiFi connections',
//           message:
//             'This app needs location permission as this is required  ' +
//             'to scan for wifi networks.',
//           buttonNegative: 'DENY',
//           buttonPositive: 'ALLOW',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         // You can now use react-native-wifi-reborn
//       } else {
//         // Permission denied
//       }
//       // ...
//     }
//     connectWifi();
//   }, []);
