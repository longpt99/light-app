import React, {useState} from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
} from 'native-base';
import {StyleSheet, Image} from 'react-native';
import {firebase} from '../firebase/config';
import Footer from './Footer';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const clearState = () => {
    setEmail('');
    setPassword('');
  };

  const onFooterLinkPress = () => {
    clearState();
    navigation.navigate('Register');
  };

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const userId = response.user.uid;
        clearState();
        navigation.navigate('Home', {userId});
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <Container>
      <View style={styles.content}>
        <View></View>
        <View>
          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText={(email) => setEmail(email)} value={email} />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                onChangeText={(password) => setPassword(password)}
                value={password}
                secureTextEntry={true}
              />
            </Item>
            <Button style={styles.button} onPress={onLoginPress}>
              <Text>Login</Text>
            </Button>
          </Form>
          <View style={styles.horizonLine} />
          <Text style={styles.text}>
            You don't have account?&nbsp;
            <Text onPress={onFooterLinkPress} style={styles.register}>
              Register
            </Text>
          </Text>
        </View>
        <Footer />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    height: '100%',
    marginLeft: '10%',
    marginRight: '10%',
    justifyContent: 'space-between',
  },
  sd: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#3e8aff',
  },
  image: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor: 'red',
  },
  horizonLine: {
    marginTop: 30,
    marginBottom: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    width: '50%',
    marginLeft: '25%',
    backgroundColor: 'red',
  },
  text: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
  },
  register: {
    color: 'orange',
    textDecorationLine: 'underline',
  },
  textFooter: {
    // flex: 1,
    color: '#888',
    textAlign: 'center',
    // justifyContent: 'space-around',
    // alignContent: 'flex-end',
    // alignItems: 'center',
  },
});
