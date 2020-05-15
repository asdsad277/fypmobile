import React, { Component } from 'react';
import { StyleSheet,Animated, Easing, View, TouchableOpacity, Image, Dimensions, Text } from "react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        drawData: [
            { id: 1, title: "放題"},
            { id: 2, title: "fast food"},
            { id: 3, title: "hot pot"},
            { id: 4, title: "bbq"},
            { id: 5, title: "italian"},
            { id: 6, title: "korean bbq"},
            { id: 7, title: "茶記"},
            { id: 8, title: "自助餐"}
        ],
        offOn: true,
        rotateDeg: new Animated.Value(0)
    };
}
rotateImg = () => {
    if (this.state.offOn) {
        this.rotateImg1();
    }
};
rotateImg1 = () => {
    //get won pos
    let number = Math.floor(Math.random() * 8);
    if((number/8)==0.875){
        number=1;
    }
    let oneTimeRotate = number / 8 + 3.0625;
    Animated.timing(this.state.rotateDeg, {
        toValue: oneTimeRotate,
        duration: 5000,
        easing:Easing.out(Easing.quad)
    }).start(() => {
        this.setState({
            offOn: !this.state.offOn,
        });
        //will send toValue to call back end animation
        this.state.rotateDeg.stopAnimation(() => {
            this.changeValue(number);
        })
    });
};
changeValue = (postion) => {
    alert("The system have picked " + this.state.drawData[postion].title+" for you!");
    this.setState({offOn: true});
};

render() {
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.mainImg, {
                transform: [{
                    rotate: this.state.rotateDeg.interpolate({
                        inputRange: [0, 3],
                        outputRange: ['0deg', '1080deg']
                    })
                }]
            }]}>
                <View style={{ height: 360, width: 360, alignItems: "center" }}>
                    <Image style={{position:"absolute", height: 360, width:360, resizeMode: 'stretch' }} source={require('./img/circle_bg.png')} />
                    {this.state.drawData.map((one, index) => {
                        const rotateDeg = 22.5;
                        let translateX = 0;
                        let translateY = 0;
                        const rotateTemp = -rotateDeg - (index * 45);
                        const sinTemp = Math.sin(rotateDeg * Math.PI / 180) * 105;
                        const consTemp = Math.cos(rotateDeg * Math.PI / 180) * 105;
                        switch (index) {
                            case 0:
                                translateX = -sinTemp;
                                translateY = -consTemp;
                                break;
                            case 1:
                                translateX = -consTemp;
                                translateY = -sinTemp;
                                break;
                            case 2:
                                translateX = -consTemp;
                                translateY = sinTemp;
                                break;
                            case 3:
                                translateX = -sinTemp;
                                translateY = consTemp;
                                break;
                            case 4:
                                translateX = sinTemp;
                                translateY = consTemp;
                                break;
                            case 5:
                                translateX = consTemp;
                                translateY = sinTemp;
                                break;
                            case 6:
                                translateX = consTemp;
                                translateY = -sinTemp;
                                break;
                            case 7:
                                translateX = sinTemp;
                                translateY = -consTemp;
                                break;
                            default:
                                break
                        }
                        return (
                            <View key={one.id} style={{justifyContent:"center",alignItems:"center", position: "absolute", zIndex: 99, height: 70, width: 60, top: 145, transform: [{ translateX: translateX }, { translateY: translateY}, { rotateZ: `${rotateTemp}deg` }] }}>
                                <Text style={{fontSize:12, color:"#74340A",marginBottom:10}}>{one.title}</Text>
                                <Image style={{width: 50, height: 50, resizeMode: "contain" }}  />
                            </View>
                        )
                    })}
                </View >
            </Animated.View>
            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.rotateImg() }} style={styles.centerPoint}>
                <Image source={require('./img/point_new.png')} style={{height: 134, width: 107, resizeMode: "stretch", position:"absolute"}} />
                <Text style={{color:"#ffffff", textAlign:"center", fontSize:17, fontWeight:'bold',width:45, marginTop:20}}>{"start game"}</Text>
            </TouchableOpacity>
        </View>
    );
}
}

const styles = StyleSheet.create({
container: {
    width:Dimensions.get('window').width,
    height:360,
    alignItems: 'center',
    backgroundColor:"#ffffff"
},
imgPoint: {
    width: 100,
    height: 100,
},
centerPoint: {
    marginTop:100,
    position: 'absolute',
    left: Dimensions.get('window').width / 2 - 53,
    top: 100,
    zIndex: 100,
    height: 134, 
    width: 107,
    alignItems: 'center',
    justifyContent: 'center',
},
mainImg: {
    marginTop:100,
    width: 360,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}
});