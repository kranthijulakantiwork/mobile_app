/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { navigateToScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';
import StatusCard from 'app/components/StatusCard';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1, backgroundColor: COLORS.BACKGROUND_GRAY },
  footerContainer: {
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: COLORS.WHITE,
    borderRadius: 3
  },
  footerText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 }
});

class SettleUpFriends extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
  }

  onFriendSelection(friendDetails) {
    const { dispatch, state } = this.props.navigation;
    const { balance, mobile } = friendDetails;
    let gets = balance && balance > 0 ? true : false;
    return navigateToScreen({
      routeName: 'Settlement',
      params: {
        amount: balance ? Math.abs(balance).toString() : '0',
        mobile,
        gets,
        key: state.key
      },
      dispatch
    });
  }

  renderSingleFriend(friendDetails) {
    const { id, name, balance } = friendDetails;
    return (
      <StatusCard
        onPress={() => this.onFriendSelection(friendDetails)}
        name={name || id}
        balance={balance}
        mobile={id}
        balanceType={'friends'}
      />
    );
  }

  renderFriends(finalDetails) {
    return (
      <FlatList
        data={finalDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => this.renderSingleFriend(item)}
      />
    );
  }

  renderSettledUp() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <EDText
          style={{ color: COLORS.BALANCE_BLUE, fontSize: FONT_SIZES.H22, textAlign: 'center' }}
        >
          {I18n.t('all_settled_up')}
        </EDText>
      </View>
    );
  }

  renderHeader() {
    return null;
  }

  renderDetails() {
    const { details } = this.props.navigation.state.params;
    const finalDetails = details.filter(detail => detail.balance);
    if (finalDetails.length) {
      return (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderFriends(finalDetails)}
          <View style={{ width, height: 100 }} />
        </ScrollView>
      );
    } else return this.renderSettledUp();
  }

  render() {
    const { spinner } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ToolBar title={I18n.t('settlement')} leftImage="back" onLeft={() => goBack()} />
        {this.renderDetails()}
        {spinner && <Spinner />}
      </View>
    );
  }
}

SettleUpFriends.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettleUpFriends);
