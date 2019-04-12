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
    amount: PropTypes.string.isRequired,
    onOkay: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { allocatedAmount, friendsAmount, splitByFriends, splitType } = this.props;
    this.state = {
      splitType,
      allocatedAmount: Object.assign({}, allocatedAmount),
      splitByFriends: Object.assign([], splitByFriends),
      friendsAmount: Object.assign({}, friendsAmount)
    };
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

  validateCompletion() {
    const { amount } = this.props;
    const { splitType, allocatedAmount, friendsAmount, splitByFriends } = this.state;
    if (splitType === 'equally' && splitByFriends.length) return true;
  }

  onOkay() {
    const { onOkay, amount } = this.props;
    const { splitType, allocatedAmount, friendsAmount, splitByFriends } = this.state;
    if (Number(allocatedAmount[splitType]) !== Number(amount))
      return alert(I18n.t('payment_values_do_not_add_up', { amount }));
    onOkay && onOkay(splitType, allocatedAmount, friendsAmount, splitByFriends);
  }

  renderFooter() {
    const { splitType, allocatedAmount } = this.state;
    const { amount } = this.props;
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        {splitType === 'equally' ? null : (
          <EDText style={styles.totalOfAmount}>
            {I18n.t('total_of', {
              allocatedAmount: allocatedAmount[splitType]
                ? allocatedAmount[splitType].toFixed(2)
                : '0.00',
              totalAmount: amount ? amount : '0.00'
            })}
          </EDText>
        )}
        {splitType === 'equally' ? null : (
          <EDText style={styles.amountLeft}>
            {I18n.t('amount_left', {
              amountLeft: (amount - allocatedAmount[splitType]).toFixed(2)
            })}
          </EDText>
        )}
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
    tempFriendsAmount[splitType][id] = Number(splitAmount);
    this.setState({ friendsAmount: tempFriendsAmount, allocatedAmount: tempAllocatedAmount });
  }

  getShareValue(friend) {
    const { splitType, friendsAmount } = this.state;
    const { amount, friends } = this.props;
    let shareValue = '';
    if (splitType === 'equally') return shareValue;
    if (amount) {
      if (
        splitType === 'shares' &&
        Object.values(friendsAmount[splitType]) &&
        Object.values(friendsAmount[splitType]).length
      ) {
        const share = friendsAmount[splitType][friend.id];
        if (!share) return '0.00';
        const totalShares = Object.values(friendsAmount[splitType]).reduce(
          (sum, amount) => sum + amount
        );
        shareValue = (share / totalShares) * amount;
        shareValue = shareValue.toFixed(2);
      }
      if (
        splitType === 'adjustment' &&
        Object.values(friendsAmount[splitType]) &&
        Object.values(friendsAmount[splitType]).length
      ) {
        const totalAdjustments = Object.values(friendsAmount[splitType]).reduce(
          (sum, amount) => sum + amount
        );
        const eachPersonNormalShare = (amount - totalAdjustments) / friends.length;
        const presentPersonAdjustment = friendsAmount[splitType][friend.id] || 0;
        shareValue = eachPersonNormalShare + presentPersonAdjustment;
        shareValue = shareValue.toFixed(2);
      }
    }
    return shareValue;
  }

  renderSingleFriends(friend, index) {
    const { splitType, friendsAmount, splitByFriends, amount } = this.state;
    const { friends } = this.props;
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
