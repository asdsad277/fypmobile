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
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ac: "",
      dataSource: [],
      isLoading: true,
      id:"",
    }
  }
  get initstate(){
    return{
    ac: "",
    dataSource: [],
    isLoading: true,
    id:"",};
  }
  async componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener('focus', async () => {
      await AsyncStorage.getItem("logined").then((value) => {
        if (value != null) {
          this.setState({ ac: value });
        } else {
          this.setState({ ac:"" });
        }
      });
    });
    this.focusSubscription = this.props.navigation.addListener('blur', async () => {
      this.setState(this.initstate);
    });
    const { shopid } =this.props.route.params?this.props.route.params:null;
    this.setState({id:shopid});
    }   
  componentWillUnmount = () => {
    this.focusSubscription && this.focusSubscription.remove();
    this.focusSubscription = null;
  }
  getdata(shopid){
    fetch('http://seantalk.asuscomm.com/mobile/function.php',{
    method:'POST',
    headers:{
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body:JSON.stringify({
      option:"loadshop",
      para:shopid
    })
  }).then((response)=>response.json())
  .then((responseJson)=>{
      this.setState({
        dataSource:responseJson
      })            
  })
  }
  fetchdata() {
    const { ac } = this.state;
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        option: "loadticket",
        para: ac
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          dataSource: responseJson,
          isLoading: false
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}>
        <View style={{ flex: 1, justifyContent: 'center', marginleft: 5 }}>
          <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
            Ticket ID:{item.TicketID}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            Restaurant name:{item.Name}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            No. of :{item.NumOfSeat}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            Date:{item.Date}
          </Text>
        </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
      </View>
    )
  }
  render() {
    var ac = this.state.ac;
    var id = this.state.id;
    if (id != null && id != ""){
      this.getdata(id);
        if (ac == null || ac == "") {
        return (
          <View>   
          <FlatList data={this.state.dataSource}
          renderItem={({item})=>
              <View style={{flex:1}}>
                <Image style={{width:400 ,height:300,margin:5}}
                source={{uri:"http://seantalk.asuscomm.com/fyp/img/shop/R/"+item.ShopID+".jpg"}}/>                   
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
      }else{
        return(
          <View>   
          <FlatList data={this.state.dataSource}
          renderItem={({item})=>
              <View style={{flex:1}}>
                <Image style={{width:400 ,height:300,margin:5}}
                source={{uri:"http://seantalk.asuscomm.com/fyp/img/shop/R/"+item.ShopID+".jpg"}}/>                   
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
      }
    }else if (id == null || id == ""){
      return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Login to use this function!</Text>
        <TouchableOpacity style={styles.loginBtn}
          onPress={() => this.props.navigation.navigate("profile")}>
          <Text style={{ color: "black" }}>
            Login!
        </Text>
        </TouchableOpacity >
      </View>
        
      )
    }else{
        this.fetchdata();
        return (
          this.state.isLading
            ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#330066" animating />
            </View>
            :
            <View>
              <View style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
              </View>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.TicketID}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </View>
        )
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
