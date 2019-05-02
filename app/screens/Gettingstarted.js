import React, { Component } from 'react';
import { Dimensions, Text, View, TouchableOpacity, Image } from 'react-native';
const { height, width } = Dimensions.get('window');

export default class Getting_Started extends Component {
  static navigationOptions = {
    header: null
  };

  renderGroupButtonAndText() {
    return (
      <View>
        <TouchableOpacity
          style={{
            marginTop: 30,
            paddingHorizontal: 60,
            paddingVertical: 8,
            borderRadius: 5.3,
            backgroundColor: '#ffffff',
            shadowOffset: { height: 1, width: 1 },
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 1,
            shadowOpacity: 0.8,
            shadowColor: '#e2e2e2'
          }}
        >
          <Text
            style={{
              color: '#5d5d5d',
              fontFamily: 'Roboto-Regular',
              fontSize: 20
            }}
          >
            Create Group
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 9.9,
            color: '#707070',
            fontFamily: 'Roboto-Regular',
            fontSize: 11.7
          }}
        >
          Create group to track expenses among a group of friends
        </Text>
      </View>
    );
  }

  renderFriendButtonAndText() {
    return (
      <View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 80,
            paddingVertical: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1da370',
            borderRadius: 5.3,
            shadowRadius: 6.7,
            elevation: 1,
            shadowColor: '#1da370',
            shadowOpacity: 0.8
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Roboto-Regular',
              fontSize: 20
            }}
          >
            Add Bill
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 9.9,
            color: '#707070',
            fontFamily: 'Roboto-Regular',
            fontSize: 11.7
          }}
        >
          Add bill to split expenses among friends
        </Text>
      </View>
    );
  }

  renderAddFriendAndGroupButtons() {
    return (
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {this.renderFriendButtonAndText()}
        {this.renderGroupButtonAndText()}
      </View>
    );
  }

  renderletsGetStartedText() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 18.3,
            color: '#979797'
          }}
        >
          Welcome!
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 16.7,
            color: '#979797'
          }}
        >
          Let's Get Started
        </Text>
      </View>
    );
  }

  renderAppIconAndAppName() {
    return (
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Image source={require('../assets/logo.png')} style={{ width: 62.4, height: 60.3 }} />
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: 26.3,
            color: '#1da370'
          }}
        >
          Settle
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              color: '#268959'
            }}
          >
            Mint
          </Text>
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {this.renderAppIconAndAppName()}
          {this.renderletsGetStartedText()}
          {this.renderAddFriendAndGroupButtons()}
          <View
            style={{ flex: 1, width: width - 50, alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 3,
                backgroundColor: '#bbbbbb'
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontFamily: 'Roboto-Regular',
                  fontSize: 15
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderX() {
    return (
      <View style={{ width: '100%', backgroundColor: '#fefefe', height: '100%' }}>
        {this.renderBody()}
        {this.renderText()}
        {this.renderbodytext()}
        {this.renderButton()}
        {this.renderLowertext()}
        {this.renderLowerButton()}
        {this.rendertext()}
        {this.renderBelowButton()}
      </View>
    );
  }
}
