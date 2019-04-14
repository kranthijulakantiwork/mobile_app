// @flow

import React, { Component } from 'react';
import { Dimensions, View, TextInput } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import EDText from 'app/components/EDText';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');

export default class EDTextInput extends Component {
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    keyboardType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    textInputStyle: PropTypes.object,
    titleStyle: PropTypes.object
  };

  render() {
    let textInputStyle = Object.assign(
      {
        width: width - 40,
        height: 40,
        fontSize: 15,
        color: COLORS.TEXT_BLACK,
        margin: 0,
        padding: 0,
        borderBottomWidth: 1,
        borderColor: COLORS.TEXT_BLACK
      },
      this.props.textInputStyle || {}
    );
    let containerStyle = Object.assign(
      { marginVertical: 10, marginHorizontal: 20 },
      this.props.containerStyle || {}
    );
    let keyboardType = this.props.keyboardType || 'default';
    let secureTextEntry = this.props.secureTextEntry || false;
    const titleStyle = Object.assign(
      { fontSize: FONT_SIZES.H3, color: COLORS.TEXT_BLACK },
      this.props.titleStyle
    );
    return (
      <View style={containerStyle}>
        {this.props.title && <EDText style={titleStyle}>{this.props.title}</EDText>}
        <TextInput
          style={textInputStyle}
          onChangeText={text => this.props.onChangeText(text)}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          value={this.props.value}
          secureTextEntry={secureTextEntry}
          placeholder={this.props.placeholder || ''}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
}
