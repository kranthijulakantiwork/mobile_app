import React, { Component } from "react";
import { Text, View, Button, StyleSheet, TextInput } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
console.disableYellowBox=true;
export default class Hello extends Component {
  render() {
    return (
     
      <View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "grey",
            justifyContent: "space-between",
            alignItems: "stretch",
            border: "3px solid black"
          }}
        >
          <Button
            title="back"
            color="grey"
            style={[styles.button, { width: 200, marginLeft: 0 }]}
          />

          <Button container title="settings" color="grey" />
          <Button title="save" color="grey" />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
          
           <Entypo name="camera" size={50} style={{marginTop:50,marginLeft:20,borderColor:"black",alignContent:"center",flexWrap:"wrap",borderRadius:30,width:60,height:57,margin:6,borderWidth:2}}/>
            <Text style={{ marginTop: 60,marginLeft:20 }}>UPI</Text>
            <Text style={{ marginTop: 30,marginLeft:20}}>Email id</Text>
          </View>
          <View
            style={{
              flexDirection: "column"
            }}
          >
            <TextInput
              style={{
                height: 40,
                width: 200,
                borderColor: "white",
                borderBottomColor: "black",
                color: "white",
                marginLeft: 10,
                marginTop:40
              }}  placeholder= "Name" placeholderTextColor="black"
            />
            <TextInput
              style={{
                height: 40,
                width: 200,
                borderColor: "white",
                borderBottomColor: "black",
                marginLeft: 10
              }}  placeholder= "Number"
            />
            <TextInput
              style={{
                height: 40,
                width: 200,
                borderColor: "white",
                borderBottomColor: "black",
                marginTop: 30,
                placeholder: "name",
                marginLeft: 10
              }}  placeholder= "UPI Address"
            />
            <TextInput
              style={{
                height: 40,
                width: 200,
                borderColor: "white",
                borderBottomColor: "black",
                label:"name",
                marginTop: 10,
                marginLeft: 10
              }}  placeholder= "Optional" placeholderTextColor="black"
            />
          </View>
          <View
            style={{
              flexDirection: "column"
            }}
          >
            <Text style={{ color: "blue", marginTop: 165, marginLeft:10,textDecorationLine:"underline"}}>
              Change
            </Text>
          </View>
        </View>
        <View  style={{
              flexDirection: "row",
            }}>
     <Text style={{marginTop:70,marginLeft:125,fontWeight: 'bold',
                fontSize:50, borderColor: 'black',
                borderLeftWidth:5,borderTopWidth:3,borderRightWidth:5,borderBottomWidth:3,borderStyle:"solid"}}>{'\u20B9'}</Text>   
    <Text style={{marginTop:70,marginLeft:120,fontWeight: 'bold',
                fontSize: 50, borderColor: 'black',
                borderLeftWidth:5,borderTopWidth:3,borderRightWidth:5,borderBottomWidth:3,borderStyle:"solid"}}>E</Text>
        </View>
        <View  style={{
              flexDirection: "row",
               
            }}>
     <Text style={{marginTop:0,marginLeft:115,fontWeight: 'bold',
                fontSize:15,
                }}>Currency</Text>   
    <Text style={{marginTop:0,marginLeft:90,fontWeight: 'bold',
                fontSize:15}}>Language</Text>
        </View>
        <View style={{height:100,width:100,marginTop:60,marginLeft:170}}>
          <Button title="Save" color="grey" size={30}  />
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={{color:"blue",fontSize:20,textDecorationLine:"underline",marginTop:20}}>Delete Account</Text>
        <Text style={{color:"blue",fontSize:20,textDecorationLine:"underline",marginTop:20}}>Logout</Text>
        </View>
      </View>
     
    );
  }
}

var styles = StyleSheet.create({
  button: {
    color:"black",
  }
});
