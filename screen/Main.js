import React, { Component } from 'react';
import { Platform, 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  TextInput, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      isLoading:true,
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
      <TouchableOpacity style={{flex:1,flexDirection:'row',marginBottom:3}}
      onPress={()=>{
        this.props.navigation.navigate('devuse', {
          shopid: item.ShopID,
          shoptype:item.Type,
          shoptel:item.Tel,
          shopadd:item.Address        
        });
      }}>
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
      </TouchableOpacity>
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
           <View style={{  marginBottom:20,height: this.startHeaderHeight, backgroundColor: 'white', borderBottomWidth: 2, borderBottomColor: '#dddddd' }}>
                        <View style={{
                            flexDirection: 'row', padding: 10,
                            backgroundColor: 'white', marginHorizontal: 20,
                            shadowOffset: { width: 0, height: 0 },
                            shadowColor: 'black',
                            shadowOpacity: 0.2,
                            elevation: 1,
                            marginTop: Platform.OS == 'android' ? 30 : null
                        }}>
                            <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                underlineColorAndroid="transparent"
                                placeholder="Try serach from this!"
                                placeholderTextColor="grey"
                                style={{flex: 1, fontWeight: '700', backgroundColor: 'white' }}
                            />
                        </View>
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
