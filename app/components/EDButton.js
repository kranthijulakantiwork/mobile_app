// @flow

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import EDText from 'app/components/EDText';
import PropTypes from 'prop-types';

export default class EDButton extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    textStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    color: PropTypes.string,
    disabled: PropTypes.bool
  };

  render() {
    const textStyle = Object.assign(
      {
        fontSize: 15,
        color: COLORS.WHITE,
        paddingHorizontal: 25,
        fontWeight: 'bold'
      },
      this.props.textStyle || {}
    );
    const buttonStyle = Object.assign(
      {
        height: 45,
        backgroundColor: COLORS.WHITE,
        borderRadius: 45 / 2,
        alignItems: 'center',
        backgroundColor: COLORS.APP_THEME_BLUE,
        justifyContent: 'center'
      },
      this.props.buttonStyle || {}
    );
    return (
      <TouchableOpacity
        onPress={() => this.props.onClick()}
        style={buttonStyle}
        disabled={this.props.disabled}
      >
        <EDText style={textStyle}>{this.props.title}</EDText>
      </TouchableOpacity>
    );
  }
}
