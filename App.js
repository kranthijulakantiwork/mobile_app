/* @flow */

import React from 'react';
import { StatusBar } from 'react-native';
import store from 'app/helpers/Store';
import { AppNavigation } from 'app/screens/Index';
import { COLORS } from 'app/styles/Colors';
import { Provider } from 'react-redux';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <StatusBar backgroundColor={COLORS.APP_THEME_GREEN} barStyle="light-content" />
        <AppNavigation />
      </Provider>
    );
  }
}
