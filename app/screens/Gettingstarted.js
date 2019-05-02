import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity,Image } from 'react-native';
console.disableYellowBox=true;

export default class Getting_Started extends Component {
    static navigationOptions = {
      header: null
    };

   
      renderBody() {
        return (
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
        
          <Image source={require('../assets/logo.png')} style={{width:62.4, height:60.3,marginTop:81}} />
         
          </View>
        );
      }
      renderText() {
        return (
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          <Text style={{marginTop:5.1}}>
         <Text style={{fontFamily:"Roboto-Regular",fontSize:26.3,width:120.7,height:34.7,textAlign:"left",lineHeight:31.7,color:"#1da370"}}>Settle</Text>
         <Text style={{fontFamily:"Roboto-Bold",fontSize:26.3,width:120.7,height:34.7,textAlign:"left",lineHeight:31.7,color:"#268959"}}>Mint</Text>
        
          </Text>
          </View>
        );
      }
      renderbodytext() {
        return (
          <View>
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
         <Text style={{fontFamily:"Roboto-Light",marginTop:21.3,fontSize:18.3,width:90,height:22,textAlign:"center",lineHeight:22,color:"#979797"}}>Welcome!</Text>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
           <Text style={{fontFamily:"Roboto-Light",marginTop:3.7,fontSize:16.7,width:125,height:20.3,textAlign:"center",lineHeight:20.3,color:"#979797"}}>Let's Get Started</Text>
            </View>
            </View>
        );
      }
      renderButton() {
        return (
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          <TouchableOpacity style={{width:231,marginTop:34.8,height:44,backgroundColor:"#1da370",borderRadius:5.3,shadowRadius:6.7,elevation:1,shadowColor:"#1da370",shadowOpacity:0.8}}>
           <Text style={{width:70,marginLeft:82,marginTop:10.1,height:26.3,color:"#ffffff",fontFamily:"Roboto-Regular",fontSize:20,textAlign:"left",lineHeight:26.3}}>Add Bill</Text>
          </TouchableOpacity>
         
            </View>
           
        );
      }
      renderLowertext() {
        return (
         
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          
           <Text style={{width:210,marginTop:9.9,height:15.3,color:"#707070",fontFamily:"Roboto-Regular",fontSize:11.7,textAlign:"center",lineHeight:15.3}}>Add bill to split expenses among friends</Text>
         
         
            </View>
           
        );
      }
      renderLowerButton() {
        return (
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          <TouchableOpacity style={{width:231,marginTop:24.1,height:44,borderRadius:5.3,backgroundColor:"#ffffff",shadowOffset:{ height: 1, width: 1 },elevation:1,shadowOpacity:0.8,shadowColor:"#e2e2e2"}}>
           <Text style={{width:118.3,marginLeft:57,marginTop:10.1,height:26.3,color:"#5d5d5d",fontFamily:"Roboto-Regular",fontSize:20,textAlign:"left",lineHeight:26.3}}>Create Group</Text>
          </TouchableOpacity>
         
            </View>
           
        );
      }
      rendertext() {
        return (
          <View style={{flexDirection:"row",justifyContent:"space-around"}}>
         
           <Text style={{width:210,marginTop:9.9,height:30.7,color:"#70707",fontFamily:"Roboto-Regular",fontSize:11.7,textAlign:"center",lineHeight:15.3}}>Create group to track expenses among a
group of friends</Text>
         
         
            </View>
           
        );
      }
      renderBelowButton() {
        return (
         
          <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
          <TouchableOpacity style={{width:49.7,marginTop:87.3,height:25.7,borderRadius:3,backgroundColor:"#bbbbbb",marginRight:40}}>
           <Text style={{width:29.7,marginLeft:9,marginBottom:2,height:19.7,color:"#ffffff",fontFamily:"Roboto-Regular",fontSize:15,textAlign:"left",lineHeight:19.7}}>Skip</Text>
          </TouchableOpacity>
         
            </View>
           
        );
      }
      render() {
        return (
          <View style={{width:"100%",backgroundColor:"#fefefe",height:"100%"}}>
          
           {this.renderBody()}
           {this.renderText()}
           {this. renderbodytext()}
           {this.renderButton() }
           {this. renderLowertext()}
           {this.renderLowerButton() }
           {this. rendertext()}
           {this.renderBelowButton()}
          </View>
        );
      }
}

