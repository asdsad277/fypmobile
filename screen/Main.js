import React, { Component } from 'react';
import { Platform, 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      isLoading:true,
      image:require("./img/demon.jpg"),
      images:""
    }
  }
  loaddata(){
    fetch('http://seantalk.asuscomm.com/mobile/function.php',{
      method:'POST',
      headers:{
        Accept: 'application/json',
				'Content-type': 'application/json',
      },
      body:JSON.stringify({
        option:"load"
			})
    }).then((response)=>response.json())
    .then((responseJson)=>{
        this.setState({
          dataSource:responseJson,
          isLoading:false    
        })             
    })
  }
  componentDidMount(){
    this.loaddata();
  }
  renderItem=({item})=>{
    return(
      <View style={{flex:1,flexDirection:'row',marginBottom:3}}>
        <Image style={{width:100,height:100,margin:5}}
            source={{uri:"http://seantalk.asuscomm.com/fyp/img/shop/R/"+item.ShopID+".jpg"}}/>
        <View style={{flex:1,justifyContent:'center',marginleft:5}}>
          <Text style={{fontSize:18,color:'green',marginBottom:10}}>
            {item.Name}
          </Text>
          <Text style={{fontSize:16,color:'black'}}>
            Type:{item.Type}
          </Text>
          <Text style={{fontSize:16,color:'red'}}>
            Tel No:{item.Tel}
          </Text>
          <Text style={{fontSize:16,color:'red'}}>
            Address:{item.Address}
          </Text>
        </View>
      </View>
    )
  }
  renderSeparator=()=>{
      return(
        <View style={{height:1,width:'100%',backgroundColor:'black'}}>
        </View>
      )
  }
  render() {
    return (
        this.state.isLoading
        ?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#330066"animating/>
        </View>
        :
        
        <View>
          <View style={{height:'10%',width:'100%',backgroundColor:'black'}}>
            </View>
            <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item)=>item.ShopID}
                ItemSeparatorComponent={this.renderSeparator}
            />
        </View>
      );
    }
  }
