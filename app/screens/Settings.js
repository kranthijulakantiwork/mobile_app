import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
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
          backgroundColor: 'grey',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          border: '3px solid black'
        }}
      >
        <TouchableOpacity>
          <Text style={{ fontSize:20, color: 'black' }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: 'black' }}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: 'black' }}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Entypo
              name="camera"
              size={50}
              style={{
                marginTop: 50,
                marginLeft: 20,
                borderColor: 'black',
                alignContent: 'center',
                flexWrap: 'wrap',
                borderRadius: 30,
                width: 60,
                height: 57,
                margin: 6,
                borderWidth: 2
              }}
            />
            <Text style={{ marginTop: 50, marginLeft: 20 }}>UPI</Text>
            <Text style={{ marginTop: 30, marginLeft: 20 }}>Email id</Text>
          </View>
          <View
            style={{
              flexDirection: 'column'
            }}
          >
          <KeyboardAwareScrollView>
            <TextInput
              style={{
               // height: 40,
                width: 200,
                borderColor: 'white',
                borderBottomColor: 'black',
                color: 'black',
                marginLeft: 10,
                marginTop: 40
              }}
              placeholder="Name"
              placeholderTextColor="black"
            /></KeyboardAwareScrollView>
            <KeyboardAwareScrollView>
            <TextInput
              style={{
                //height: 40,
                //width: 200,
                borderColor: 'white',
                borderBottomColor: 'black',
                marginLeft: 10
              }}
              placeholder="Number"
            />
            </KeyboardAwareScrollView>
          <KeyboardAwareScrollView>
            <TextInput
              style={{
               // height: 40,
               // width: 200,
                borderColor: 'white',
                borderBottomColor: 'black',
                marginTop: 10,
                placeholder: 'name',
                marginLeft: 10
              }}
              placeholder="UPI Address"
            /></KeyboardAwareScrollView>
            <KeyboardAwareScrollView>
            <TextInput
              style={{
               // height: 40,
               // width: 200,
                borderColor: 'white',
                borderBottomColor: 'black',
                label: 'name',
                marginTop: 10,
                marginLeft: 10
              }}
              placeholder="Optional"
              placeholderTextColor="black"
            /></KeyboardAwareScrollView>
          </View>
          <View
            style={{
              flexDirection: 'column',
             marginTop:160
            }}
          >
            <Text
              style={{
                color: 'blue',
                textDecorationLine: 'underline'
              }}
            >
              Change
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <Text
            style={{
             
              fontWeight: 'bold',
              fontSize: 50,
              borderColor: 'black',
              borderLeftWidth: 5,
              borderTopWidth: 3,
              borderRightWidth: 5,
              borderBottomWidth: 3,
              borderStyle: 'solid'
            }}
          >
            {'\u20B9'}
          </Text>
          <Text
            style={{
            
              fontWeight: 'bold',
              fontSize: 50,
              borderColor: 'black',
              borderLeftWidth: 5,
              borderTopWidth: 3,
              borderRightWidth: 5,
              borderBottomWidth: 3,
              borderStyle: 'solid'
            }}
          >
            E
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop:20
          }}
        >
          <Text style={{ marginTop: 0, fontWeight: 'bold', fontSize: 15 }}>Currency</Text>
          <Text style={{ marginTop: 0, fontWeight: 'bold', fontSize: 15 }}>Language</Text>
        </View>
      </View>
    );
  }

  renderButton() {
    return (
     
      <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginTop:10
      }}
    >
      <TouchableOpacity>
        <Text style={{ fontSize: 30, color: 'black' }}>Save</Text>
      </TouchableOpacity>
    </View>
    );
  }
renderBottom(){
  return(
  <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:10 }}>
  <Text
    style={{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' }}
  >
    Delete Account
  </Text>
  <Text
    style={{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' }}
  >
    Logout
  </Text>
</View>
  )
}

  render() {
    return (
      <View style={{flexDirection:"column",justifyContent:"space-evenly"}}>
        {this.renderTitlebar()}
        {this.renderBody()}
        {this.renderButton()}
        {this.renderBottom()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    color: 'black'
  }
});
