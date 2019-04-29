import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

export default class Settlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRequest: true,
      group: [],
      group1: null,
      display: false
    };
  }
  componentDidMount() {
    if (this.state.isRequest == true) {
      this.setState({
        display: true
      });
    } else {
      this.setState({
        display: true
      });
    }
  }
  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'grey',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            border: '3px solid black'
          }}
        >
          <Button title="Cancel" color="grey" style={styles.button} />

          <Button container title="Settlement" color="grey" style={{ marginLeft: 600 }} />
          <Button color="grey" title="" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Entypo name="emoji-happy" size={50} style={{ marginTop: 50, marginLeft: 100 }} />
          <Entypo name="arrow-long-right" size={50} style={{ marginTop: 50, marginLeft: 25 }} />
          <Entypo name="emoji-happy" size={50} style={{ marginTop: 50, marginLeft: 25 }} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 50, marginLeft: 100 }}>
            You are paying Name2
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Text style={{ marginTop: 70, marginLeft: 90, fontWeight: 'bold', fontSize: 50 }}>
            {'\u20B9'}
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: 'white',
              borderBottomColor: 'black',
              marginTop: 87,
              marginLeft: 20
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 70
          }}
        >
          <Button title="Record Settlement" color="grey" />
          <Button title="Pay Through UPI" color="grey" />
          <Button title="Request" color="grey" style={this.state.display} />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    color: 'black'
  }
});
