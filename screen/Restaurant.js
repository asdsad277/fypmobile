import React, { Component } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image
} from 'react-native';
import { Button } from 'react-native-paper';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ac: "",
      shopdata: [],
      id:"",
    }
  }
  get initstate() {
    return {
      ac: "",
      shopdata: [],
      id: "",
    };
  }
  async componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener('focus', async () => {
      this.setState(this.initstate);
      await AsyncStorage.getItem("logined").then((value) => {
        if (value !== null) {
          this.setState({ ac: value });
        } else {
          this.setState({ ac: "" });
        }
      });     
      const { shopid } = this.props.route.params ? this.props.route.params : "";
      if (shopid == "" || shopid == null) { } else {
        this.setState({ id: shopid });
        this.getdata(shopid);
      }
    });
   
  }
  componentWillUnmount = () => {
    this.focusSubscription && this.focusSubscription.remove();
    this.focusSubscription = null;
  }
  getdata(shopid) {
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        option: "loadshop",
        para: shopid
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          shopdata: responseJson
        })
      })
  }
  getticket(){
    alert('get ticket');
  }
  render() {
    var ac = this.state.ac;
    var id = this.state.id;
    if (id != null && id != "") {
      if (ac == null || ac == "") {
        return (
          <View>
            <FlatList data={this.state.shopdata}
              renderItem={({ item }) =>
                <View style={{ flex: 1 }}>
                  <Image style={{ width: 400, height: 300, margin: 5 }}
                    source={{ uri: "http://seantalk.asuscomm.com/fyp/img/shop/R/" + item.ShopID + ".jpg" }} />
                  <View style={{ flex: 2, alignItems: 'stretch' }}>
                    <Text>Name:{item.Name}</Text>
                    <Text>type:{item.Type}</Text>
                    <Text>Phone No.:{item.Tel}</Text>
                    <Text>Email:{item.Email}</Text>
                    <Text>Address:{item.Address}</Text>
                    <Text>Description:{item.Descri}</Text>
                  </View>
                </View>
              }>

            </FlatList>
          </View>
        )
      } else {
        return (
          <View>
            <FlatList data={this.state.shopdata}
              renderItem={({ item }) =>
                <View style={{ flex: 1 }}>
                  <Image style={{ width: 400, height: 300, margin: 5 }}
                    source={{ uri: "http://seantalk.asuscomm.com/fyp/img/shop/R/" + item.ShopID + ".jpg" }} />
                  <View style={{ flex: 2, alignItems: 'stretch' }}>
                    <Text>Name:{item.Name}</Text>
                    <Text>type:{item.Type}</Text>
                    <Text>Phone No.:{item.Tel}</Text>
                    <Text>Email:{item.Email}</Text>
                    <Text>Address:{item.Address}</Text>
                    <Text>Description:{item.Descri}</Text>
                  </View>
                  <TouchableOpacity style={styles.loginBtn}
                    onPress={this.getticket}>
                    <Text style={{ color: "black" }}>
                      get this ticket!
                    </Text>
                  </TouchableOpacity >
                </View>
              }>

            </FlatList>
          </View>
        )
      }
    } else if (id == null || id == "") {
      if (ac == null || ac == "") {
        return (
          <View style={styles.container}>
            <Text style={styles.welcome}>go Home page to select one restaurnt!</Text>
            <TouchableOpacity style={styles.loginBtn}
              onPress={() => this.props.navigation.navigate("profile")}>
              <Text style={{ color: "black" }}>
                go!
              </Text>
            </TouchableOpacity >
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
          <Text style={styles.welcome}>go Home page to select one restaurnt!</Text>
          <TouchableOpacity style={styles.loginBtn}
            onPress={() => this.props.navigation.navigate("Home")}>
            <Text style={{ color: "black" }}>
              go!
          </Text>
          </TouchableOpacity >
        </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
  }
});
