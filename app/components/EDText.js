// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

export default class EDText extends Component {
  static propTypes = {
    style: PropTypes.object,
    numberOfLines: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { style, children, numberOfLines } = this.props;
    if (numberOfLines) {
      return (
        <Text style={{ fontFamily: 'Roboto-Regular', ...style }} numberOfLines={numberOfLines}>
          {children}
        </Text>
      );
    } else {
      return <Text style={{ ...style }}>{children}</Text>;
    }
  }
}
