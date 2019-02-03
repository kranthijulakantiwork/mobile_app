import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { navigateToScreen, resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import EDText from 'app/components/EDText';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_THEME_BLEUE,
    paddingTop: 30
  },
  menuItem: {
    height: 50,
    color: 'blue'
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16
  }
});

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'home'
    };
  }

  async onLogout() {
      alert('todo')
  }

  OnClick(title, actionName) {
    const { selected } = this.state;
    if (selected !== title) {
      const { dispatch } = this.props.navigation;
      switch (actionName) {
        case 'Splash':
          navigateToScreen(actionName, actionName, {}, dispatch);
          this.setState({ selected: title });
          break;
        case 'Logout':
          return this.onLogout();
        default:
          break;
      }
    }
  }

  renderDrawerItem(title, actionName) {
    const { selected } = this.state;
    const color = selected === title ? COLORS.GREEN : COLORS.WHITE;
    const imageSource = selected === title ? Images[title + '_selected'] : Images[title];
    const backgroundColor =
      selected === title ? COLORS.GRAY : COLORS.APP_THEME_BLEUE;
    return (
      <TouchableOpacity
        onPress={() => this.OnClick(title, actionName)}
        disabled={selected === title}
      >
        <View style={{ ...styles.drawerItem, backgroundColor }}>
          <Image source={imageSource} />
          <EDText style={{ color, fontSize: FONT_SIZES.H3, marginLeft: 15 }}>
            {actionName}
          </EDText>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderDrawerItem('home', 'Splash')}
        <View style={{ flex: 1, justifyContent: 'flex-end', marginVertical: 20 }}>
          {this.renderDrawerItem('logout', 'Logout')}
        </View>
      </View>
    );
  }
}

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerScreen);
