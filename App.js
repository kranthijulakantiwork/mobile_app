/* @flow */

import { Platform, View, SafeAreaView, StatusBar } from 'react-native';
//import {} from 'react-native';
import { Provider } from 'react-redux';
import store from 'app/helpers/Store';
import { AppNavigation } from 'app/screens/Index';
import React from 'react';
//import { settings } from 'cluster';
import Settings from './app/screens/Settings';

export default class App extends React.Component {
  render() {
    return (
     <View>
       <Settings/>
     </View>
    );
  }
}
