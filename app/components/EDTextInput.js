// @flow

import React, { Component } from 'react';
import { Dimensions, View, TextInput } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');

class EDTextInput extends Component {
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    keyboardType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    textInputStyle: PropTypes.object
  };

  render() {
    let textInputStyle = Object.assign(
      {
        width: width - 40,
        height: 40,
        fontSize: 15,
        color: COLORS.GRAY,
        margin: 0,
        padding: 0,
        paddingLeft: 25,
        borderRadius: 20,
        borderBottomWidth: 1,
        borderColor: COLORS.APP_THEME_PURPLE
      },
      this.props.textInputStyle || {}
    );
    let keyboardType = this.props.keyboardType || 'default';
    let secureTextEntry = this.props.secureTextEntry || false;
    return (
      <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
        <TextInput
          style={textInputStyle}
          onChangeText={text => this.props.onChangeText(text)}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          value={this.props.value}
          secureTextEntry={secureTextEntry}
          placeholder={this.props.placeholder}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
}

module.exports = EDTextInput;
