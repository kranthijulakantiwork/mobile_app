//@flow

import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { COLORS } from 'app/styles/Colors';

const { width, height } = Dimensions.get('window');

class Spinner extends Component {
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          height: height,
          width: width,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color={COLORS.APP_THEME_PURPLE} size="large" />
      </View>
    );
  }
}

module.exports = {
  Spinner,
  setSpinner: self => self.setState({ spinner: true }),
  removeSpinner: self => self.setState({ spinner: false })
};
