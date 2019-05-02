import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity,Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
console.disableYellowBox=true;
export default class Settings extends Component {
  static navigationOptions = {
    header: null
  };

  renderTitlebar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          borderWidth:1,
          borderColor:"black",
          height:"88.6dp",
          width:"360dp"
        }}
      > <TouchableOpacity>
      <Image source={require('../assets/ic_arrow_back_48_px.png')} style={{width:40, height: 40}} /> </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontSize: 30, color: 'black' }}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:"#1da370",borderWidth:1,width:90,height:45,borderRadius:15}} activeOpacity={2}>
          <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderupperbody() {
    return (
      <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginTop:30
      }}
    >
     <TouchableOpacity style={{backgroundColor:"#bbbbbb",paddingTop:5,borderWidth:1,width:90,height:45,borderRadius:15}} activeOpacity={2}>
        <Text style={{ color: 'black', fontSize:20,textAlign:"center" }}>Logout</Text>
      </TouchableOpacity>
      <View style={{
       width: 120,
       height:120,
       borderRadius: 120/2,
      // backgroundColor: 'white',
       borderWidth:2,
       borderColor:"black"
         
}}   

 >
  <View style={{
      
       marginLeft:60,
       marginTop:60,
       borderRadius: 50/2,
       borderWidth:2,
       height:50,
       width:50,
       borderColor:"black",
       backgroundColor:"white"
}}>
 <TouchableOpacity>
 <Image source={require('../assets/camera_20.png')} style={{width:35, height: 35,alignSelf:"center"}} />
 </TouchableOpacity>

</View>
 </View>
           <TouchableOpacity>
        <Text style={{ fontSize: 30, color: 'black' }}>Contact us</Text>
      </TouchableOpacity>
     
    </View>

    )}
     
    renderbody() {
      return (
        <View
        style={{
          flexDirection: 'column',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          marginTop:20
        }}
      >
      <TouchableOpacity> <Image source={require('../assets/single.png')} style={{width:40, height: 40}} /></TouchableOpacity>
      
       
       <KeyboardAwareScrollView>
            <TextInput
              style={{
                borderColor: 'white',
                borderBottomColor: 'black',
                marginLeft:20
              }}
              placeholder="Name"
              placeholderTextColor="black"
            /></KeyboardAwareScrollView>
            <Image source={require('../assets/pencil.png')} style={{width:20, height: 20}} />
       
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          marginTop:20
        }}
      >
        <Image source={require('../assets/phone_2.png')} style={{width:40, height: 40}} />
       
       <KeyboardAwareScrollView>
            <TextInput
              style={{
                borderColor: 'white',
                borderBottomColor: 'black',
                marginLeft:20,
                fontFamily:"Roboto-Regular"
              }}
              placeholder="Phone Number"
              placeholderTextColor="black"
              
            /></KeyboardAwareScrollView>
            <Image source={require('../assets/pencil.png')} style={{width:20, height: 20}} />
       
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          marginTop:20
        }}
      >
       <Image source={require('../assets/wallet_43.png')} style={{width: 40, height: 40}} />
       
       <KeyboardAwareScrollView>
            <TextInput
              style={{
                borderColor: 'white',
                borderBottomColor: 'black',
                marginLeft:20
              }}
              placeholder="UPI Address"
              placeholderTextColor="black"
            /></KeyboardAwareScrollView>
            <Image source={require('../assets/pencil.png')} style={{width:20, height: 20}} />
       
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          marginTop:20
        }}
      >
       <Image source={require('../assets/email_84.png')} style={{width:40, height: 40}} />
       
       <KeyboardAwareScrollView>
            <TextInput
              style={{
                borderColor: 'white',
                borderBottomColor: 'black',
                marginLeft:20
              }}
              placeholder="Email ID"
              placeholderTextColor="black"
            /></KeyboardAwareScrollView>
           <Image source={require('../assets/pencil.png')} style={{width:20, height: 20}} />
       
      </View>
      </View>
  
      )}
      renderlowerbody() {
        return (
          <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            marginTop:30
          }}
        >
        <View style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
        
        <Image source={require('../assets/translate.png')} style={{width: 40, height: 40}} />
        <Text style={{ color: 'black', fontSize:20,textAlign:"center" }}>Language</Text>
        </View>
         
        <View style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
        
        <Image source={require('../assets/money.png')} style={{width: 40, height: 40}} />
        <Text style={{ color: 'black', fontSize:20,textAlign:"center" }}>Currency</Text>
        </View>
         
         
        </View>
    
        )}   

  

  render() {
    return (
      <View style={{flexDirection:"column",justifyContent:"space-evenly"}}>
        {this.renderTitlebar()}
        {this. renderupperbody()}
        {this. renderbody()}
        {this. renderlowerbody()}
      </View>
    );
  }
}

