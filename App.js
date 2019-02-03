/* @flow */

import { Platform, View, SafeAreaView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from 'app/helpers/Store';
import { AppNavigation } from 'app/screens/Index';
import React from 'react';
// import { COLORS } from 'app/styles/Colors';

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    );
  }
}
