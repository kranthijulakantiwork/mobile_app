/* @flow */

import React from 'react';
import { Animated, Dimensions, Image, Easing } from 'react-native';
// import { COLORS } from 'app/styles/Colors';
import {
  createDrawerNavigator,
  createStackNavigator,
  StackActions,
  NavigationActions,
  DrawerActions
} from 'react-navigation';
import DrawerScreen from 'app/screens/DrawerScreen';
import Splash from 'app/screens/Splash';

const { width } = Dimensions.get('window');

const transitionConfig = () => ({
  transitionSpec: {
    duration: 300,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;

    const height = layout.initHeight;
    const translateX = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [height, 0, 0]
    });

    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index],
      outputRange: [0, 1, 1]
    });

    return { opacity, transform: [{ translateX }] };
  }
});

const navigationOptions = {
  defaultNavigationOptions: {
    gesturesEnabled: false,
    header: null
  },
  transitionConfig
};

const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: Splash }
  },
  {
    initialRouteName: 'Home',
    contentComponent: DrawerScreen,
    drawerWidth: (2 * width) / 3
  }
);

const AppNavigator = createStackNavigator(
  {
    Splash: { screen: DrawerNavigator },
  },
  navigationOptions
);

const resetAndGoToScreen = (routeName, key, params, dispatch) => {
  let resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: routeName,
        params: params,
        key: key
      })
    ]
  });
  return dispatch(resetAction);
};

const replaceScreen = (routeName, current_screen_key, params, dispatch) => {
  let replaceAction = StackActions.replace({
    key: current_screen_key,
    routeName: routeName,
    params: params
  });
  return dispatch(replaceAction);
};

const navigateToScreen = (routeName, key, params, dispatch) => {
  const navigateAction = NavigationActions.navigate({
    routeName: routeName,
    params: params,
    key: key
  });
  dispatch(navigateAction);
  dispatch(DrawerActions.closeDrawer());
};

export { AppNavigator, resetAndGoToScreen, replaceScreen, navigateToScreen };
