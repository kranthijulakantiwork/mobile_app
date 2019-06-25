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
import { realm } from 'app/models/schema';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import Balances from 'app/components/Balances';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';
import StatusCard from 'app/components/StatusCard';

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

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
  }

  onFriendSelection(friendDetails) {
    const { dispatch } = this.props.navigation;
    return navigateToScreen({
      routeName: 'Bills',
      params: { ...friendDetails, isFriend: true },
      dispatch
    });
  }

  onAddMoreFriends() {
    alert('TODO');
  }

  renderFooter() {
    return (
      <TouchableOpacity onPress={this.onAddMoreFriends}>
        <View style={styles.footerContainer}>
          <EDText style={styles.footerText}>{I18n.t('add_more_friends')}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderSingleFriend(friendDetails) {
    const { balance, mobile } = friendDetails;
    const { contacts } = this.props;
    let name = friendDetails.name;
    if (!name) {
      const friendObject = contacts.filter(contact => contact.mobile == mobile)[0];
      name = friendObject && friendObject.name ? friendObject.name : mobile;
    }
    return (
      <StatusCard
        onPress={() => this.onFriendSelection(friendDetails)}
        name={name}
        balance={balance}
        mobile={mobile}
        balanceType={'friends'}
      />
    );
  }

  renderFriends() {
    const { friends } = this.props;
    return (
      <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => this.renderSingleFriend(item)}
      />
    );
  }

  renderHeader() {
    const { owed, owe } = this.props.balance;
    const toPay = owe ? (Math.round(owe * 10) / 10).toString() : '0';
    const toGet = owed ? (Math.round(owed * 10) / 10).toString() : '0';
    let balance = Math.abs(toGet) - Math.abs(toPay);
    balance = balance ? (Math.round(balance * 10) / 10).toString() : '0';
    return <Balances to_pay={toPay} to_get={toGet} balance={balance} />;
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderFriends()}
          {/* {this.renderFooter()} */}
          <View style={{ width, height: 100 }} />
        </ScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

Friends.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    friends: state.groups.friendsData,
    balance: state.groups.balance,
    contacts: state.common.contacts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
