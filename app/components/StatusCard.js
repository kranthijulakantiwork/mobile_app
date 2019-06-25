/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { realm } from 'app/models/schema';
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
  memberCountInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

class StatusCard extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.array,
    balance: PropTypes.number,
    balanceType: PropTypes.string,
    mobile: PropTypes.string,
    friends: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getBalanceText(balance) {
    let amount = Math.abs(balance);
    amount = Math.round(amount * 10) / 10;
    return amount;
  }

  renderSummaryDetails(detail, i) {
    let friendName = detail.id;
    if (!friendName) {
      const { contacts } = this.props;
      const friendObject = contacts.filter(contact => contact.mobile == detail.id)[0];
      friendName = friendObject && friendObject.name ? friendObject.name : detail.id;
    }
    let oweText = friendName + ' ' + I18n.t('owes_you') + ' ';
    let color = COLORS.BALANCE_GREEN;
    if (detail.balance < 0) {
      oweText = I18n.t('you_owe') + ' ' + friendName + ' ';
      color = COLORS.BALANCE_RED;
    }
    return (
      <EDText style={styles.details} key={i}>
        {oweText}
        <EDText style={{ ...styles.details, color }}>
          {'₹' + this.getBalanceText(detail.balance)}
        </EDText>
      </EDText>
    );
  }

  renderSummary() {
    const { details, balance } = this.props;
    if (!balance || !details || !details.length) return null;
    let count = 0;
    const finalDetails = details.filter(detail => detail.balance);
    return (
      <View>
        {finalDetails.map((detail, i) => {
          count += 1;
          if (count === 3)
            return (
              <EDText style={styles.details} key={i}>
                {I18n.t('plus_other_balances', { count: finalDetails.length - 2 })}
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
    const { balanceType, friends } = this.props;
    if (balanceType === 'groups') {
      return (
        <View style={styles.memberCountInnerContainer}>
          <Image source={Images.member} />
          <EDText style={{ fontSize: FONT_SIZES.H6, color: COLORS.GRAY, marginLeft: 5 }}>
            {friends.length}
          </EDText>
        </View>
      );
    }
    return null;
  }

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
          {'₹ ' + balance ? this.getBalanceText(balance) : '0.00'}
        </EDText>
        <EDText style={{ ...styles.balanceText, color }}>{I18n.t(status)}</EDText>
        {this.renderMemberCount()}
      </View>
    );
  }

  renderName() {
    const { name, balanceType, mobile } = this.props;
    const containerStyle = balanceType === 'groups' ? {} : { paddingTop: 9 };
    return (
      <View style={{ ...styles.nameContainer, ...containerStyle }}>
        <EDText style={styles.name} numberOfLines={1}>
          {name || mobile}
        </EDText>
        {this.renderDetails()}
      </View>
    );
  }

  renderAvatar() {
    const { name, balanceType, mobile } = this.props;
    // TODO get last edited date as Apr 4
    // const lastEdited =
    // balanceType === 'groups'
    //   ? I18n.t('edited') + ' ' + 'Apr 4'
    //   : I18n.t('updated') + ' ' + 'Apr 4';
    // avatarSubText={lastEdited}
    return <Avatar name={name || mobile} />;
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

function mapStateToProps(state) {
  return {
    contacts: state.common.contacts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusCard);
