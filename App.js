/* @flow */

import { Platform, View, SafeAreaView, StatusBar } from 'react-native';
//import {} from 'react-native';
import { Provider } from 'react-redux';
import store from 'app/helpers/Store';
import { AppNavigation } from 'app/screens/Index';
import React from 'react';
//import { settings } from 'cluster';
import Settings from './app/screens/Settings';
import Selection from './app/screens/selectionscreen';
import Getting_Started from './app/screens/Gettingstarted';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Selection />
      </View>
    );
  }
}
