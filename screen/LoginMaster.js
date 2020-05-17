import React, { Component } from 'react';
import {
  Button,
  AsyncStorage,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  Linking,
  FlatList
} from 'react-native';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ac: "",
      pw: "",
      saveac: "",
      dataSource: ""
    }
  }
  async savestate() {
    const { ac } = this.state;
    await AsyncStorage.setItem("logined", ac);
    this.setState({ saveac: ac });
  }
  
  async handlelogout() {
    await AsyncStorage.removeItem('logined');
  }
  logout = () => {
    this.handlelogout();
    alert("logout success!");
    this.setState({ saveac: null });
    this.props.navigation.navigate('Home');
  }
  forgetpw = () => {
    const uri = "http://seantalk.asuscomm.com/fyp/forgetpw.php";
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log("Don't know how to open URI: " + uri);
      }
    });
  }
  registerac = () => {
    const uri = "http://seantalk.asuscomm.com/fyp/Register.php";
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log("Don't know how to open URI: " + uri);
      }
    });
  }
  login = () => {
    const { ac, pw } = this.state;
    //sent data to the php to do the login
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ac: ac,
        pw: pw,
        option: "login"
      })
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData == "true") {
          //redirect to page & save state
          alert("Successfull!");
          this.savestate();
          this.getuser;
          this.props.navigation.navigate('Home');
        } else {
          alert(responseData);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    Keyboard.dismiss();
  }
  getuser(ac) {
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        option: "loaduser",
        para: ac
      })
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({ dataSource: responseData});
      })
      .catch((error) => {
        console.error(error);
      });
  }
  get initstate(){
    return{
      ac: "",
      pw: "",
      saveac: "",
      dataSource: ""
    };
  }
  async componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener('focus', async () => {
      await AsyncStorage.getItem("logined").then((value) => {
        if (value != null) {
          this.setState({ saveac: value });
          this.getuser(value);
        } else {
          this.setState({ saveac: null });
        }
      });
    });
    this.focusSubscription = this.props.navigation.addListener('blur', async () => {
      this.setState(this.initstate);
    });
    }   
  componentWillUnmount = () => {
    this.focusSubscription && this.focusSubscription.remove();
    this.focusSubscription = null;
  }
  render() {
    var saveac = this.state.saveac;
    if (saveac == "" || saveac == null) {
      return (
        <View style={styles.container}>
          <Text style={styles.logo}>Let's Eat</Text>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText}
              placeholder="Account ID..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({ ac: text })} />
          </View>
          <View style={styles.inputView} >
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({ pw: text })} />
          </View>
          <TouchableOpacity
            onPress={this.forgetpw}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}
            onPress={this.login}>
            <Text style={styles.loginText}>
              Login!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signBtn}
            onPress={this.registerac}>
            <Text style={styles.loginText}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      );
    }else{
      return (
        <View style={{flex: 1}}>          
          <FlatList data={this.state.dataSource}
            renderItem={({item}) =>
              <View>
                <Text style={styles.welcome}>Profile</Text>
                  <Text>First Name:{item.FirstName}</Text>
                  <Text>Last Name:{item.LastName}</Text>
                  <Text>Gender:{item.Gender}</Text>
                  <Text>Display name:{item.Username}</Text>
                  <Text>Email:{item.Email}</Text>
                  <Text>Tel No.:{item.Tel}</Text>
              </View>
            }>
          </FlatList>
          <Button title="logout" onPress={this.logout} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "lightgrey",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  forgot: {
    color: "black",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  signBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10
  },
  loginText: {
    color: "black"
  }, welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});