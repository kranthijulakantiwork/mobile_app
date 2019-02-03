// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

export default class EDText extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { style, children } = this.props;
    return <Text style={{ ...style }}>{children}</Text>;
  }
}
