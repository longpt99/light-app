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
import {firebase} from '../firebase/config';
import {StyleSheet} from 'react-native';
import Footer from './Footer';

export default function RegisterScreen({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const onFooterLinkPress = () => {
    clearState();
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const userId = response.user.uid;
        firebase
          .database()
          .ref(`lights/${userId}`)
          .update({name: fullName, email});
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
              <Label>Name</Label>
              <Input
                onChangeText={(fullName) => setFullName(fullName)}
                value={fullName}
              />
            </Item>
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
            <Item stackedLabel>
              <Label>Confirm Password</Label>
              <Input
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                value={confirmPassword}
                secureTextEntry={true}
              />
            </Item>
            <Button style={styles.button} onPress={onRegisterPress}>
              <Text>Register</Text>
            </Button>
          </Form>
          <View style={styles.horizonLine} />
          <Text style={styles.text}>
            You already have account?&nbsp;
            <Text onPress={onFooterLinkPress} style={styles.register}>
              Login
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
});
