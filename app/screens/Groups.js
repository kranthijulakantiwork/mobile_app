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

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
  }

  onGroupSelection(groupDetails) {
    const { dispatch } = this.props.navigation;
    return navigateToScreen({
      routeName: 'Bills',
      params: { ...groupDetails },
      dispatch
    });
  }

  onCreateGroup() {
    const { dispatch } = this.props.navigation;
    return navigateToScreen({ routeName: 'CreateGroup', dispatch });
  }

  renderFooter() {
    return (
      <TouchableOpacity onPress={() => this.onCreateGroup()}>
        <View style={styles.footerContainer}>
          <EDText style={styles.footerText}>{I18n.t('create_group')}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderSingleGroup(groupDetails) {
    const { name, balance, mobile, details, friends } = groupDetails;
    return (
      <StatusCard
        onPress={() => this.onGroupSelection(groupDetails)}
        name={name}
        details={details}
        balance={balance || 0}
        mobile={mobile}
        friends={friends}
        balanceType={'groups'}
      />
    );
  }

  renderGroups() {
    const { groups } = this.props;
    return (
      <FlatList
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => this.renderSingleGroup(item)}
      />
    );
  }

  renderHeader() {
    const { owed, owe } = this.props.balance;
    const toPay = owe ? (Math.round(owe * 10) / 10).toString() : '0';
    const toGet = owed ? (Math.round(owed * 10) / 10).toString() : '0';
    const balance = (toGet - toPay).toString();
    return <Balances to_pay={toPay} to_get={toGet} balance={balance} />;
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderGroups()}
          {this.renderFooter()}
          <View style={{ width, height: 100 }} />
        </ScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

Groups.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    groups: state.groups.groupsData,
    balance: state.groups.balance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
