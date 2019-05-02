import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

export default class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor:"white"
    };
    // this.func1 = this.func1.bind(this);
    // this.func2 = this.func2.bind(this);
    // this.func3 = this.func3.bind(this);
  }

  // func1(){
  //   this.setState({
  //     backgroundColor1:"#238759",
  //   })
  // }
  // func2(){
  //   this.setState({
  //     backgroundColor2:"#238759",
  //   })
  // }
  // func3(){
  //   this.setState({
  //     backgroundColor3:"#238759",
  //   })
  // }

  renderTitlebar() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor:"#1da370",
            borderColor:"2px solid black"
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 30,color:"white"}}>Select Language</Text>
        </View>
      </View>
    );
  }
 
  renderButton() {
    return (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft:150,
            marginTop:100
          }}
        >
        {this.state.backgroundColor=="white" ?
          <TouchableOpacity style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
            <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>English</Text>
          </TouchableOpacity>:
           <TouchableOpacity onPress={()=>{this.setState({backgroundColor:"green"})}} style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
           <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>English</Text>
         </TouchableOpacity>}
         {this.state.backgroundColor=="white"?
          <TouchableOpacity style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
          <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>Hindi</Text>
        </TouchableOpacity>:
         <TouchableOpacity onPress={()=>{this.setState({backgroundColor:"green"})}} style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
         <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>Hindi</Text>
       </TouchableOpacity>}
         {this.state.backgroundColor=="white"?
          <TouchableOpacity style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
          <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>Telugu</Text>
        </TouchableOpacity>:
         <TouchableOpacity onPress={()=>{this.setState({backgroundColor:"green"})}} style={{paddingTop:10,marginTop:10,marginLeft:10,paddingBottom:10,backgroundColor:this.state.backgroundColor,borderWidth:1,borderColor:"green",width:110,height:65,borderRadius:15}} activeOpacity={2}>
         <Text style={{ color: 'black', fontSize: 30,textAlign:"center" }}>Telugu</Text>
       </TouchableOpacity>}
        </View>
     
    );
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        {this.renderTitlebar()}
        {this.renderButton()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    color: 'black'
  }
});
