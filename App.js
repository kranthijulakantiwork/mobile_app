/* @flow */

import React from 'react';
import { StatusBar, Platform } from 'react-native';
import store from 'app/helpers/Store';
import { AppNavigation } from 'app/screens/Index';
import { COLORS } from 'app/styles/Colors';
import { Provider } from 'react-redux';
import Orientation from 'react-native-orientation';

export default class App extends React.Component {
  componentDidMount() {
    if(Platform.OS === 'android') {
      Orientation.lockToPortrait();
    }
  }
  render() {
    return (
      <Provider store={store}>
        <StatusBar backgroundColor={COLORS.APP_THEME_GREEN} barStyle="light-content" />
        <AppNavigation />
      </Provider>
    );
  }
}
