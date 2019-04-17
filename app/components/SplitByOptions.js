/* @flow */

import React, { Component } from 'react';
import { Dimensions, Picker, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import AbsoluteView from 'app/components/AbsoluteView';
import EDText from 'app/components/EDText';
import SplitByFriends from 'app/components/SplitByFriends';
import I18n from 'app/config/i18n';
import PropTypes from 'prop-types';
import _ from 'lodash';

const { height, width } = Dimensions.get('window');
const SPLIT_TYPES = ['equally', 'shares', 'percentages', 'unequally', 'adjustment'];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginVertical: 50,
    marginHorizontal: 20
  },
  headingText: {
    marginLeft: 10,
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H2,
    paddingVertical: 20,
    fontWeight: 'bold'
  },
  totalOfAmount: { textAlign: 'center', color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 },
  amountLeft: { textAlign: 'center', color: COLORS.LIGHT_GRAY, fontSize: FONT_SIZES.H4 }
});

export default class SplitByOptions extends Component {
  static propTypes = {
    onDialogClose: PropTypes.func.isRequired,
    splitByFriends: PropTypes.array.isRequired,
    splitType: PropTypes.string.isRequired,
    allocatedAmount: PropTypes.object.isRequired,
    friendsAmount: PropTypes.object.isRequired,
    friends: PropTypes.array.isRequired,
    amount: PropTypes.number.isRequired,
    onOkay: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { allocatedAmount, friendsAmount, splitByFriends, splitType } = this.props;
    this.state = {
      splitType,
      allocatedAmount: Object.assign({}, allocatedAmount),
      splitByFriends: Object.assign([], splitByFriends),
      friendsAmount: this.getFriendsAmount()
    };
  }

  getFriendsAmount() {
    const { friendsAmount } = this.props;
    let amount = {};
    Object.keys(friendsAmount).map(key => (amount[key] = Object.assign({}, friendsAmount[key])));
    return amount;
  }

  onDialogClose() {
    const { onDialogClose } = this.props;
    onDialogClose && onDialogClose();
  }

  onSelectFriend(friend) {
    const { splitByFriends } = this.state;
    const tempSplitByFriends = Object.assign([], splitByFriends);
    if (splitByFriends.includes(friend.id)) {
      const index = tempSplitByFriends.indexOf(friend.id);
      tempSplitByFriends.splice(index, 1);
      this.setState({ splitByFriends: tempSplitByFriends });
    } else {
      this.setState({ splitByFriends: [...splitByFriends, friend.id] });
    }
  }

  getCompletionError() {
    const { amount } = this.props;
    const { splitType, allocatedAmount, splitByFriends } = this.state;
    const allocatedAmountSplitBy =
      splitType === 'equally' ? splitByFriends.length : allocatedAmount[splitType];
    const errorMessage =
      I18n.t('the_payment_value_doesnt_addup', { amount }) ||
      I18n.t('the_math_for_this_expense_doesnt_add_up');
    if (!allocatedAmountSplitBy) return errorMessage;
    switch (splitType) {
      case 'unequally':
      case 'adjustment':
        if (allocatedAmountSplitBy > amount) return errorMessage;
        break;
      case 'percentages':
        if (allocatedAmountSplitBy > 100) return errorMessage;
      default:
        break;
    }
    return '';
  }

  onOkay() {
    const errorMessage = this.getCompletionError();
    if (errorMessage) return alert(errorMessage);
    const { onOkay, amount } = this.props;
    const { splitType, allocatedAmount, friendsAmount, splitByFriends } = this.state;
    onOkay && onOkay(splitType, allocatedAmount, friendsAmount, splitByFriends);
  }

  getFooterText() {
    const { splitType, allocatedAmount, splitByFriends } = this.state;
    const { amount } = this.props;
    let footerText = '';
    let footerSubText = '';
    let amountExceeded = false;
    const totalAmount = amount.toFixed(2);
    const amountLeft = (amount - Number(allocatedAmount[splitType])).toFixed(2);
    switch (splitType) {
      case 'equally':
        const amount_per_person = (amount / splitByFriends.length).toFixed(2);
        footerText = I18n.t('amount_per_person', {
          amount: amount_per_person
        });
        break;
      case 'unequally':
        const allocatedAmountUnequally = allocatedAmount[splitType].toFixed(2);
        footerText = I18n.t('total_allocated_of_total', {
          allocatedAmount: allocatedAmountUnequally,
          totalAmount
        });
        footerSubText = I18n.t('amount_left', {
          amountLeft
        });
        amountExceeded = allocatedAmount[splitType] > amount;
        break;
      case 'percentages':
        const allocatedAmountPercentages = allocatedAmount[splitType].toFixed(2);
        footerText = I18n.t('total_allocated_of_total_percent', {
          allocatedAmount: allocatedAmountPercentages
        });
        footerSubText = I18n.t('percent_left', {
          percentLeft: (100 - Number(allocatedAmount[splitType])).toFixed(2)
        });
        amountExceeded = allocatedAmount[splitType] > 100;
        break;
      case 'shares':
        const perShareValue = Number(allocatedAmount[splitType])
          ? Number(amount) / Number(allocatedAmount[splitType])
          : '';
        footerText = perShareValue
          ? I18n.t('total_per_share_amount', { shareValue: perShareValue.toFixed(2) })
          : I18n.t('you_must_select_atleast_one');
        amountExceeded = !perShareValue;
        break;
      case 'adjustment':
        amountExceeded = allocatedAmount[splitType] > amount;
        break;
      default:
        break;
    }
    return { footerText, footerSubText, amountExceeded };
  }

  renderFooter() {
    const { footerText, footerSubText, amountExceeded } = this.getFooterText();
    const footerTextStyle = amountExceeded ? { color: COLORS.BALANCE_RED } : {};
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        {footerText ? (
          <EDText style={{ ...styles.totalOfAmount, ...footerTextStyle }}>{footerText}</EDText>
        ) : null}
        {footerSubText ? <EDText style={styles.amountLeft}>{footerSubText}</EDText> : null}
        <TouchableOpacity
          onPress={() => this.onOkay()}
          style={{ alignSelf: 'flex-end', paddingHorizontal: 15, paddingBottom: 10 }}
        >
          <EDText style={{ color: COLORS.APP_THEME_PURPLE, fontSize: FONT_SIZES.H4 }}>
            {I18n.t('ok')}
          </EDText>
        </TouchableOpacity>
      </View>
    );
  }

  getNumericAmount(amount) {
    let tempAmount = amount.replace(',', '.');
    if (tempAmount && Number(tempAmount)) {
      return Number(tempAmount);
    }
    return 0;
  }

  validateAmount(amount) {
    if (
      amount.includes('..') ||
      amount.includes(',,') ||
      amount.includes('.,') ||
      amount.includes(',.')
    ) {
      return false;
    } else if (amount.includes('.') && amount.indexOf('.') < amount.length - 3) {
      return false;
    } else if (amount.includes(',') && amount.indexOf(',') < amount.length - 3) {
      return false;
    }
    return true;
  }

  onChangeText(splitAmount, id) {
    const { allocatedAmount, splitType } = this.state;
    if (!this.validateAmount(splitAmount)) return;
    const { friendsAmount } = this.state;
    let tempAllocatedAmount = allocatedAmount;
    let tempFriendsAmount = Object.assign({}, friendsAmount);

    tempAllocatedAmount[splitType] =
      tempAllocatedAmount[splitType] -
      this.getNumericAmount(
        tempFriendsAmount[splitType][id] ? tempFriendsAmount[splitType][id].toString() : ''
      ) +
      this.getNumericAmount(splitAmount);
    tempFriendsAmount[splitType][id] = splitAmount;
    this.setState({ friendsAmount: tempFriendsAmount, allocatedAmount: tempAllocatedAmount });
  }

  getShareValue(friend) {
    const { splitType, friendsAmount, allocatedAmount } = this.state;
    const { amount, friends } = this.props;
    let shareValue = '';
    if (splitType === 'equally') return shareValue;
    if (amount) {
      if (splitType === 'shares' && allocatedAmount[splitType]) {
        const share = friendsAmount[splitType][friend.id]
          ? Number(friendsAmount[splitType][friend.id])
          : 0;
        if (!share) return '0.00';
        const totalShares = allocatedAmount[splitType];
        shareValue = (share / totalShares) * amount;
        shareValue = shareValue.toFixed(2);
      }
      if (splitType === 'adjustment' && allocatedAmount[splitType]) {
        const totalAdjustments = allocatedAmount[splitType];
        const eachPersonNormalShare = (amount - totalAdjustments) / friends.length;
        const presentPersonAdjustment = friendsAmount[splitType][friend.id]
          ? Number(friendsAmount[splitType][friend.id])
          : 0;
        shareValue = eachPersonNormalShare + presentPersonAdjustment;
        shareValue = shareValue.toFixed(2);
      }
    }
    return shareValue;
  }

  renderSingleFriends(friend, index) {
    const { splitType, friendsAmount, splitByFriends } = this.state;
    let amount_received = '';
    if (splitType !== 'equally') {
      amount_received = friendsAmount[splitType][friend.id]
        ? friendsAmount[splitType][friend.id].toString()
        : '';
    }
    return (
      <SplitByFriends
        onPress={() => this.onSelectFriend(friend)}
        splitBy={splitType}
        isSelected={splitByFriends.includes(friend.id)}
        onChangeText={amount => this.onChangeText(amount, friend.id)}
        amount={amount_received}
        shareValue={this.getShareValue(friend)}
        name={friend.name}
        key={index}
        mobile={''}
      />
    );
  }

  renderFriends() {
    const { friends } = this.props;
    return friends.map((friend, index) => this.renderSingleFriends(friend, index));
  }

  renderHeadingText() {
    return (
      <Picker
        selectedValue={this.state.splitType}
        style={{ height: 50, width: width - 70, alignSelf: 'center' }}
        mode="dropdown"
        onValueChange={(itemValue, itemIndex) => this.setState({ splitType: itemValue })}
      >
        {SPLIT_TYPES.map(splitType => (
          <Picker.Item label={I18n.t(splitType)} value={splitType} key={splitType} />
        ))}
      </Picker>
    );
  }

  render() {
    return (
      <AbsoluteView onDialogClose={() => this.onDialogClose()}>
        <View style={styles.container}>
          {this.renderHeadingText()}
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {this.renderFriends()}
          </ScrollView>
          {this.renderFooter()}
        </View>
      </AbsoluteView>
    );
  }
}
