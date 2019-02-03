/* @flow */

import React, { Component } from 'react';
import { ActivityIndicator, View, Platform, ImageBackground } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Splash extends Component {

  render() {
    return (
        <View style={{ flex: 1, backgroundColor: 'green' }} />
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Splash);
