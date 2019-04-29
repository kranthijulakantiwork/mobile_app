/* @flow */

import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutAnimation,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  DrawerActions,
  NavigationActions,
  StackActions
} from 'react-navigation';
import { askPermissionsAndgetContacts } from 'app/helpers/Contacts';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import BillDetails from 'app/screens/BillDetails';
import DrawerScreen from 'app/screens/DrawerScreen';
import EDText from 'app/components/EDText';
import Friends from 'app/screens/Friends';
import Groups from 'app/screens/Groups';
import I18n from 'app/config/i18n';
import NewBill from 'app/screens/NewBill';
import Payment from 'app/screens/Payment';
import SelectFriends from 'app/screens/SelectFriends';
import Settings from 'app/screens/Settings';
import Settlement from 'app/screens/Settlement';
import SettlementDetailView from 'app/screens/SettlementDetailView';
import SignIn from 'app/screens/SignIn';
import Splash from 'app/screens/Splash';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  addButton: { position: 'absolute', bottom: 50, right: 30 },
  addButtonTextContainer: {
    backgroundColor: COLORS.WHITE,
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.TEXT_BLACK,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: COLORS.TEXT_BLACK,
    fontSize: 40,
    includeFontPadding: false
  }
});
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
  headerMode: 'float',
  defaultNavigationOptions: {
    gesturesEnabled: false,
    title: I18n.t('app_name'),
    headerBackground: <View style={{ flex: 1, backgroundColor: COLORS.WHITE }} />,
    headerTitle: ({ children }) => {
      return (
        <View
          style={{
            flex: 1,
            height: 56,
            backgroundColor: COLORS.WHITE,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <EDText
            style={{
              fontSize: FONT_SIZES.H20,
              color: COLORS.TEXT_BLACK
            }}
          >
            {children}
          </EDText>
        </View>
      );
    }
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

const tabbarLabel = (focused, title) => {
  const color = focused ? COLORS.TEXT_BLACK : COLORS.TEXT_BLACK;
  return (
    <View style={{}}>
      <EDText style={{ color, textAlign: 'center', marginBottom: 5, fontSize: FONT_SIZES.H2 }}>
        {I18n.t(title)}
      </EDText>
    </View>
  );
};

const tabsNavOptions = title => {
  return {
    tabBarLabel: tab => tabbarLabel(tab.focused, title)
  };
};

// For customization refer https://reactnavigation.org/docs/en/material-top-tab-navigator.html
const Tabs = createMaterialTopTabNavigator(
  {
    Friends: {
      screen: Friends,
      navigationOptions: tabsNavOptions('friends_tab')
    },
    Groups: {
      screen: Groups,
      navigationOptions: tabsNavOptions('groups_tab')
    }
  },
  {
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    lazy: false,
    optimizationsEnabled: true,
    tabBarOptions: {
      showIcon: false,
      // activeBackgroundColor: COLORS.WHITE,
      // inactiveBackgroundColor: COLORS.WHITE,
      indicatorStyle: { backgroundColor: COLORS.TEXT_BLACK },
      style: { height: 40, backgroundColor: COLORS.WHITE }
    }
  }
);

class CustomTabs extends React.Component<Props> {
  static router = Tabs.router;
  componentWillMount() {
    askPermissionsAndgetContacts();
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  render() {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    const activeRoute = routes[index];
    let bottom = (
      //   <TouchableOpacity onPress={() => navigation.navigate('Payment')} style={styles.addButton}>
      <TouchableOpacity
        onPress={() => navigation.navigate('SelectFriends')}
        style={styles.addButton}
      >
        <View style={styles.addButtonTextContainer}>
          <EDText style={styles.addButtonText}>+</EDText>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="default" />
        <SafeAreaView style={{ flex: 1 }} forceInset={{ horizontal: 'always', top: 'always' }}>
          <Tabs navigation={navigation} />
        </SafeAreaView>
        {bottom}
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Tabs: { screen: CustomTabs },
    NewBill: { screen: NewBill },
    BillDetails: { screen: BillDetails },
    SelectFriends: { screen: SelectFriends },
    Payment: { screen: Payment },
    DrawerNavigator: { screen: DrawerNavigator },
    SignIn: { screen: SignIn },
    SettlementDetails: { screen: SettlementDetailView },
    Settings: { screen: Settings },
    Settlement: { screen: Settlement }
  },
  navigationOptions
);

const resetAndGoToScreen = ({
  routeName,
  key = routeName + Math.random(),
  params = {},
  dispatch
}) => {
  const resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName,
        params,
        key
      })
    ]
  });
  return dispatch(resetAction);
};

const replaceScreen = ({ routeName, currentScreenKey, params = {}, dispatch }) => {
  const replaceAction = StackActions.replace({
    key: currentScreenKey,
    routeName,
    params
  });
  return dispatch(replaceAction);
};

const navigateToScreen = ({ routeName, key = routeName, params = {}, dispatch }) => {
  const navigateAction = NavigationActions.navigate({
    routeName,
    params,
    key
  });
  dispatch(navigateAction);
  dispatch(DrawerActions.closeDrawer());
};

export { AppNavigator, resetAndGoToScreen, replaceScreen, navigateToScreen };
