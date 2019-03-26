// @flow

import React, { Component } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');

export default class AbsoluteView extends Component {
  static propTypes = {
    onDialogClose: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  render() {
    let absoluteViewStyle = Object.assign(
      {
        position: 'absolute',
        top: 0,
        left: 0,
        height,
        width,
        backgroundColor: 'rgba(71,60,140,.7)'
      },
      this.props.style
    );
    let outerContainerStyle = Object.assign(
      { flex: 1, marginVertical: 50 },
      this.props.outerContainerStyle
    );
    return (
      <View style={absoluteViewStyle}>
        <TouchableOpacity
          onPress={() => this.props.onDialogClose()}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height,
            width
          }}
        >
          <View />
        </TouchableOpacity>
        <View style={outerContainerStyle}>{this.props.children}</View>
      </View>
    );
  }
}
