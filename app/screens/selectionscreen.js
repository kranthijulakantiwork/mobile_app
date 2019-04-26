import React, { Component } from "react";
import { Text, View, Button, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
console.disableYellowBox=true;
export default class Selection extends Component {
    constructor(props){
        super(props);
        this.state = {
          radioSelected: 1
        }
      }
    
      radioClick(id) {
        this.setState({
          radioSelected: id
        })
      }    
   
renderTitlebar(){
  return(
    <View
          style={{
            flexDirection: "row",
            backgroundColor: "grey",
            justifyContent: "space-between",
            alignItems: "stretch",
            border: "3px solid black"
          }}
        >
          <TouchableOpacity
          ><Text style={{fontSize:15,color:"black"}}>Back</Text></TouchableOpacity>

<TouchableOpacity
          ><Text style={{fontSize:15,color:"black"}}>Setting</Text></TouchableOpacity>
         <TouchableOpacity
          ><Text style={{fontSize:15,color:"black"}}>Save</Text></TouchableOpacity>
        </View>
  )
}

renderBody(){
  return(
    <View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop:100
      }}
    >
<Text style={{fontWeight: 'bold',
          fontSize:20}}>Select Language</Text>
  </View>
 </View>
  )
}
renderLanguage(){
    const products = [{
        id: 1,
        Language:"English"
      },
      {
        id: 2,
        Language:"Hindi"
      },
      {
        id: 3,
        Language:"Telugu"
      }];
      return (
          
        products.map((val) => {
          return (
              <View style={{flexDirection:"row",justifyContent:"center",marginTop:30}}>
              <Text style={{fontWeight: 'bold',
          fontSize:15}}>{val.Language}</Text>
            <TouchableOpacity key={val.id} onPress={this.radioClick.bind(this, val.id)}>
              <View style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {
                  val.id == this.state.radioSelected ?
                    <View style={{
                      height: 12,
                      width: 12,
                      borderRadius: 6,
                      backgroundColor: '#000',
                     
                    }} />
                    : null
                    
                }
               
              </View>
            </TouchableOpacity>
            </View>
          )
         
       
        
        
        })
      );
     

   
}
renderButton(){
    return(
      <View>
        <View style={{height:100,width:100,marginTop:60,flexDirection:"row",justifyContent:"center",marginLeft:160}}>
        <TouchableOpacity style={{shadowColor:"blue",shadowOffset:{height:1,width:1}}}
            ><Text style={{color:"black",fontSize:30}}>Next</Text></TouchableOpacity>
    </View>
    </View>
    )}

  render() {
    return (
     
      <View style={{flexDirection:"column",justifyContent:"space-between"}}>
       {this.renderTitlebar()}
       {this.renderBody()}
       {this.renderLanguage()}
       {this.renderButton()}
      </View>
     
    );
  }
}

var styles = StyleSheet.create({
  button: {
    color:"black",
  }
});
