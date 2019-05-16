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
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import Alerts from 'app/screens/Alerts';
import AuthScreen from 'app/screens/AuthScreen';
import BillDetails from 'app/screens/BillDetails';
import CreateGroup from 'app/screens/CreateGroup';
import DrawerScreen from 'app/screens/DrawerScreen';
import EDText from 'app/components/EDText';
import Friends from 'app/screens/Friends';
import GettingStarted from 'app/screens/GettingStarted';
import Groups from 'app/screens/Groups';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import LanguageSelection from 'app/screens/LanguageSelection';
import NewBill from 'app/screens/NewBill';
import Payment from 'app/screens/Payment';
import SelectFriends from 'app/screens/SelectFriends';
// import Settings from 'app/screens/Settings';
import Settlement from 'app/screens/Settlement';
import SettlementDetailView from 'app/screens/SettlementDetailView';
import SignIn from 'app/screens/SignIn';
import Splash from 'app/screens/Splash';
import Tracker from 'app/screens/Tracker';
import UpiLinking from 'app/screens/UpiLinking';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: FONT_SIZES.H20,
    color: COLORS.TEXT_BLACK
  },
  headerButton: { height: 56, width: 56, alignItems: 'center', justifyContent: 'center' },
  headerLeftTopLine: {
    height: 4,
    width: 25,
    backgroundColor: COLORS.APP_THEME_GREEN,
    borderRadius: 3,
    marginBottom: 3
  },
  headerLeftBottomLine: {
    height: 4,
    width: 19,
    backgroundColor: COLORS.APP_THEME_GREEN,
    borderRadius: 3
  },
  tabBarLabel: {
    color: COLORS.APP_THEME_GREEN,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 0,
    fontSize: FONT_SIZES.H7,
    fontFamily: 'RobotoCondensed-Bold'
  },
  tabBarIcon: { flex: 1, alignSelf: 'center' },
  addButton: { position: 'absolute', bottom: 75, right: 30 },
  addButtonTextContainer: {
    backgroundColor: COLORS.APP_THEME_GREEN,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: COLORS.WHITE,
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

function headerLeft(navigation) {
  return (
    <TouchableOpacity onPress={() => alert('TODO')} style={styles.headerButton}>
      <View>
        <View style={styles.headerLeftTopLine} />
        <View style={styles.headerLeftBottomLine} />
      </View>
    </TouchableOpacity>
  );
}

function headerTitle(children) {
  return (
    <View style={styles.headerTitleContainer}>
      <EDText style={styles.headerTitle}>{children}</EDText>
    </View>
  );
}

function headerRight(navigation) {
  return (
    <TouchableOpacity onPress={() => alert('TODO')} style={styles.headerButton}>
      <Image source={Images.settings} />
    </TouchableOpacity>
  );
}

const navigationOptions = {
  headerMode: 'float',
  defaultNavigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    title: I18n.t('app_name'),
    headerLeft: () => headerLeft(navigation),
    headerBackground: <View style={{ flex: 1, backgroundColor: COLORS.WHITE }} />,
    headerTitle: ({ children }) => headerTitle(children),
    headerRight: headerRight(navigation)
  }),
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
  if (!focused) return null;
  return (
    <View style={{}}>
      <EDText style={styles.tabBarLabel}>{I18n.t(title)}</EDText>
    </View>
  );
};

const tabBarIcon = (focused, imageName) => {
  const image = focused ? `${imageName}_active` : `${imageName}_inactive`;
  return <Image source={Images[image]} style={styles.tabBarIcon} resizeMode={'contain'} />;
};

const tabsNavOptions = title => {
  return {
    tabBarLabel: tab => tabbarLabel(tab.focused, title),
    tabBarIcon: tab => tabBarIcon(tab.focused, title)
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
    },
    Tracker: {
      screen: Tracker,
      navigationOptions: tabsNavOptions('tracker_tab')
    },
    Alerts: {
      screen: Alerts,
      navigationOptions: tabsNavOptions('alerts_tab')
    }
  },
  {
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    lazy: false,
    optimizationsEnabled: true,
    tabBarOptions: {
      showIcon: true,
      // activeBackgroundColor: COLORS.WHITE,
      // inactiveBackgroundColor: COLORS.WHITE,
      indicatorStyle: { backgroundColor: 'transparent' },
      style: { backgroundColor: COLORS.WHITE }
    }
  }
);

class CustomTabs extends Component<Props> {
  static router = Tabs.router;
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onAddClick() {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    const activeRoute = routes[index];
    if (['Tracker', 'Alerts'].includes(activeRoute.routeName)) return alert(I18n.t('coming_soon'));
    if (['Groups'].includes(activeRoute.routeName)) {
      return navigation.navigate('CreateGroup');
    }
    navigation.navigate('NewBill');
  }

  render() {
    const { navigation } = this.props;
    let bottom = (
      <TouchableOpacity onPress={() => this.onAddClick()} style={styles.addButton}>
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
    Splash: { screen: Splash },
    Tabs: { screen: CustomTabs },
    LanguageSelection: { screen: LanguageSelection },
    GettingStarted: { screen: GettingStarted },
    Settlement: { screen: Settlement },
    UpiLinking: { screen: UpiLinking },
    AuthScreen: { screen: AuthScreen },
    CreateGroup: { screen: CreateGroup },
    NewBill: { screen: NewBill },
    BillDetails: { screen: BillDetails },
    SelectFriends: { screen: SelectFriends },
    Payment: { screen: Payment },
    DrawerNavigator: { screen: DrawerNavigator },
    SignIn: { screen: SignIn },
    SettlementDetails: { screen: SettlementDetailView }
    // Settings: { screen: Settings }
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
