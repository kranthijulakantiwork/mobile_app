/* @flow */

import React, { Component } from 'react';
import { ActivityIndicator, View, PermissionsAndroid, Platform, ImageBackground } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import SmsAndroid from 'react-native-get-sms-android';

class Splash extends Component {
  async componentWillMount() {
    const { dispatch } = this.props.navigation;
    let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS)
      if (granted) {
        SmsAndroid.list(JSON.stringify({}), (fail) => {
          console.log("Failed with this error: " + fail)
        },
          (count, smsList) => {
            console.log('Count: ', count);
            console.log('List: ', smsList);
            var arr = JSON.parse(smsList);
    
            arr.forEach(function (object) {
              console.log("Object: " + object);
              console.log("-->" + object.date);
              console.log("-->" + object.body);
            })
          });
      }
      
    
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
    return <View style={{ flex: 1, backgroundColor: COLORS.APP_THEME_BLUE }} />;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Splash);
