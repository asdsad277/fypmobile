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
  Image,
  TextInput,
  Linking
} from 'react-native';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ac: "",
      shopdata: [],
      shopid:"",
      numppl:"1",
    }
    this.getticket=this.getticket.bind(this);
  }
  get initstate() {
    return {
      ac: "",
      shopdata: [],
      shopid: "",
      numppl:"1",
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
        this.setState({ shopid: shopid });
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
        this.setState({
          shopdata: responseJson
        })
      }).catch((error) => {
        console.log(body);
        console.error(error);
      });
  }
  getticket=()=>{  
    const{shopid,ac,numppl}=this.state; 
      const uri = "http://seantalk.asuscomm.com/fyp/Controllers/getTicketMoblie.php?AccountID="+ac+"&SID="+shopid+"&nos="+numppl;
      Linking.canOpenURL(uri).then(supported => {
        if (supported) {
          Linking.openURL(uri);
        } else {
          console.log("Don't know how to open URI: " + uri);
        }
      });
    }
  
  render() {
    const ac = this.state.ac;
    const shopid = this.state.shopid;
    const numppl= this.state.numppl;
    if (shopid != null && shopid != "") {
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
              keyExtractor={(item) => item.ShopID}
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
                  <Text>Enter:</Text>
                  <View style={styles.inputView} >
                  <TextInput
              style={styles.inputText}
              placeholder="number of people"
              placeholderTextColor="#003f5c"
              onChangeText={text=>this.setState({numppl:text})}
              value={numppl}/>
                  </View>
                  <TouchableOpacity style={styles.loginBtn}
                    onPress={this.getticket.bind()}>
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
    } else if (shopid == null || shopid == "") {
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
  },
  inputText: {
    height: 50,
    color: "black"
  },
  inputView: {
    width: "80%",
    backgroundColor: "lightgrey",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  }
});
