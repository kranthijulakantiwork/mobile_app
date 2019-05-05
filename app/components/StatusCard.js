/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import Avatar from 'app/components/Avatar';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 90,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: COLORS.WHITE
  },
  statusContainer: { flexDirection: 'row' },
  nameContainer: { flex: 2, paddingTop: 2, paddingHorizontal: 15 },
  name: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    color: COLORS.TEXT_BLACK,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.H20
  },
  detailsContainer: {},
  details: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H6 },
  balanceContainer: { flex: 1 },
  balanceText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4, textAlign: 'right' },
  balanceValue: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H20, textAlign: 'right' },
  memberCountOuterContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  memberCountInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

export default class StatusCard extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.array,
    balance: PropTypes.string,
    balanceType: PropTypes.string,
    mobile: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSummaryDetails(detail, i) {
    let oweText = detail.name + ' ' + I18n.t('owes_you') + ' ';
    let color = COLORS.BALANCE_GREEN;
    if (detail.amount < 0) {
      oweText = I18n.t('you_owe') + ' ' + detail.name + ' ';
      color = COLORS.BALANCE_RED;
    }
    return (
      <EDText style={styles.details} key={i}>
        {oweText}
        <EDText style={{ ...styles.details, color }}>{'₹' + detail.amount}</EDText>
      </EDText>
    );
  }

  renderSummary() {
    const { details, balance } = this.props;
    if (!balance || !details || !details.length) return null;
    let count = 0;
    return (
      <View>
        {details.map((detail, i) => {
          count += 1;
          if (count === 3)
            return (
              <EDText style={styles.details} key={i}>
                {I18n.t('plus_other_balances', { count: details.length - 2 })}
              </EDText>
            );
          if (count > 3) return null;
          return this.renderSummaryDetails(detail, i);
        })}
      </View>
    );
  }

  renderDetails() {
    const { mobile, balanceType } = this.props;
    let summary = mobile;
    return (
      <View style={styles.detailsContainer}>
        {balanceType === 'groups' ? (
          this.renderSummary()
        ) : (
          <EDText style={styles.details}>{summary}</EDText>
        )}
      </View>
    );
  }

  renderMemberCount() {
    const { balanceType, details } = this.props;
    if (balanceType === 'groups') {
      return (
        <View style={styles.memberCountOuterContainer}>
          <View style={styles.memberCountInnerContainer}>
            <Image source={Images.member} />
            <EDText style={{ fontSize: FONT_SIZES.H6, color: COLORS.GRAY, marginLeft: 5 }}>
              {details.length}
            </EDText>
          </View>
        </View>
      );
    }
    return null;
  }

  // TODO Change group icon and customize for only groups
  renderBalance() {
    const { balance, balanceType } = this.props;
    let color = COLORS.BALANCE_GREEN;
    let status = 'you_are_owed';
    if (!balance) {
      status = 'settled_up';
      color = COLORS.BALANCE_BLUE;
    }
    if (balance < 0) {
      color = COLORS.BALANCE_RED;
      status = 'you_owe';
    }
    return (
      <View style={styles.balanceContainer}>
        <EDText style={{ ...styles.balanceValue, color }}>
          {'₹ ' + balance ? balance : '0.00'}
        </EDText>
        <EDText style={{ ...styles.balanceText, color }}>{I18n.t(status)}</EDText>
        {this.renderMemberCount()}
      </View>
    );
  }

  renderName() {
    const { name, balanceType } = this.props;
    const containerStyle = balanceType === 'groups' ? {} : { paddingTop: 9 };
    return (
      <View style={{ ...styles.nameContainer, ...containerStyle }}>
        <EDText style={styles.name} numberOfLines={1}>
          {name}
        </EDText>
        {this.renderDetails()}
      </View>
    );
  }

  renderAvatar() {
    const { name, balanceType } = this.props;
    // TODO get last edited date as Apr 4
    const lastEdited =
      balanceType === 'groups'
        ? I18n.t('edited') + ' ' + 'Apr 4'
        : I18n.t('updated') + ' ' + 'Apr 4';
    return <Avatar name={name} avatarSubText={lastEdited} />;
  }

  render() {
    const { onPress, balanceType } = this.props;
    const buttonStyle = balanceType === 'groups' ? { paddingTop: 12 } : { height: 75 };
    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor={COLORS.BACKGROUND_GRAY}
        style={{ ...styles.container, ...buttonStyle }}
      >
        <View style={styles.statusContainer}>
          {this.renderAvatar()}
          {this.renderName()}
          {this.renderBalance()}
        </View>
      </TouchableHighlight>
    );
  }
}
