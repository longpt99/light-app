import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyBFH_yIVWiTfmiTQYeuY-injOSN-7jQUiI',
  authDomain: 'longdev-demo.firebaseapp.com',
  databaseURL: 'https://longdev-demo.firebaseio.com',
  projectId: 'longdev-demo',
  storageBucket: 'longdev-demo.appspot.com',
  messagingSenderId: '79027965043',
  appId: '1:79027965043:web:9a07c46357fe2721ccae06',
  measurementId: 'G-DHVJZJR4M9',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore().settings({experimentalForceLongPolling: true});
export {firebase};
