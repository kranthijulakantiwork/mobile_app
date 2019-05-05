/* @flow */

import React from 'react';
import { AppState, BackHandler, NetInfo, Platform } from 'react-native';
import { AppNavigator } from 'app/helpers/NavigationHelper';
import { connect } from 'react-redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
// import { askPermissionsAndgetContacts } from 'app/helpers/Contacts';
import { NavigationActions, StackActions } from 'react-navigation';
import Notifications from 'app/helpers/Notifications';

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
    // askPermissionsAndgetContacts();
    this.unregisterNotification = Notifications.init(dispatch);
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    this.unregisterNotification();
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

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
