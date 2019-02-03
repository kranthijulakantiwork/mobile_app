/* @flow */

import React, { Component } from 'react';
import { ActivityIndicator, View, Platform, ImageBackground } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

class Splash extends Component {
  componentWillMount() {
    const { dispatch } = this.props.navigation;

    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // Get information about the notification that was opened
          const notif = notificationOpen.notification;
          // TODO app closed Notifications are handled here.
        } else {
          // TODO Handle navigation here
        }
      });
  }

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
