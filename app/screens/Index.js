/* @flow */

import React from 'react';
import { AppState, BackHandler, NetInfo, Platform } from 'react-native';
import { AppNavigator } from 'app/helpers/NavigationHelper';
import { connect } from 'react-redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import { askPermissionsAndgetContacts } from 'app/helpers/Contacts';
import { NavigationActions, StackActions } from 'react-navigation';
import Notifications from 'app/helpers/Notifications';
import SplashScreen from 'react-native-splash-screen'

const middleware = createReactNavigationReduxMiddleware('mobile_app', state => state.nav);

const reduxApp = reduxifyNavigator(AppNavigator, 'mobile_app');

const mapStateToPropsApp = state => ({
  state: state.nav
});

const App = connect(mapStateToPropsApp)(reduxApp);

class AppWithNavigationState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app_state: AppState.currentState
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // TODO move to backgroundJob
    askPermissionsAndgetContacts();
    this.unregisterNotification = Notifications.init(dispatch);
    AppState.addEventListener('change', this.handleAppStateChange);
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    this.unregisterNotification();
    AppState.removeEventListener('change', this.handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  handleAppStateChange = nextAppState => {
    const { app_state } = this.state;
    if (
      app_state.match(/inactive|background/) &&
      nextAppState === 'active' &&
      Platform.OS === 'android'
    ) {
      SplashScreen.hide();
    }
    this.setState({ app_state: nextAppState });
  };

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return <App />;
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});

const AppNavigation = connect(mapStateToProps)(AppWithNavigationState);

export { AppNavigation, middleware };
