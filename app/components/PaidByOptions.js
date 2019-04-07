/* @flow */

import React, { Component } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import AbsoluteView from 'app/components/AbsoluteView';
import EDText from 'app/components/EDText';
import PaidByFriends from 'app/components/PaidByFriends';
import I18n from 'app/config/i18n';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
  headerMultipleText: {
    textAlign: 'center',
    color: COLORS.LIGHT_GRAY,
    fontSize: FONT_SIZES.H4,
    paddingVertical: 20
  },
  multipleButtonText: {
    fontSize: FONT_SIZES.H3,
    color: COLORS.TEXT_BLACK,
    marginLeft: 10,
    paddingVertical: 15
  },
  totalOfAmount: { textAlign: 'center', color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 },
  amountLeft: { textAlign: 'center', color: COLORS.LIGHT_GRAY, fontSize: FONT_SIZES.H4 }
});

export default class PaidByOptions extends Component {
  static propTypes = {
    onDialogClose: PropTypes.func.isRequired,
    onSelectFriend: PropTypes.func.isRequired,
    friends: PropTypes.array.isRequired,
    amount: PropTypes.string.isRequired,
    showPaidByOptions: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    const { friends } = this.props;
    this.state = {
      multiple: false,
      allocatedAmount: 0,
      friendsAmount: _.fill(Object.keys(friends), '')
    };
  }

  onDialogClose() {
    const { onDialogClose } = this.props;
    this.setState({ multiple: false });
    onDialogClose && onDialogClose();
  }

  onSelectFriend(friend) {
    const { onSelectFriend } = this.props;
    onSelectFriend && onSelectFriend(friend);
  }

  renderMultipleButton() {
    return (
      <TouchableHighlight
        onPress={() => this.setState({ multiple: true })}
        underlayColor={COLORS.LIGHT_GRAY}
      >
        <EDText style={styles.multipleButtonText}>{I18n.t('multiple_people')}</EDText>
      </TouchableHighlight>
    );
  }

  renderMultipleFooter() {
    const { allocatedAmount } = this.state;
    const { amount } = this.props;
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <EDText style={styles.totalOfAmount}>
          {I18n.t('total_of', { allocatedAmount, totalAmount: amount ? amount : '0.00' })}
        </EDText>
        <EDText style={styles.amountLeft}>
          {I18n.t('amount_left', { amountLeft: amount - allocatedAmount })}
        </EDText>
        <TouchableOpacity
          onPress={() => alert('TODO')}
          style={{ alignSelf: 'flex-end', paddingHorizontal: 15, paddingBottom: 10 }}
        >
          <EDText style={{ color: COLORS.APP_THEME_PURPLE, fontSize: FONT_SIZES.H4 }}>
            {I18n.t('ok')}
          </EDText>
        </TouchableOpacity>
      </View>
    );
  }

  renderFooter() {
    const { multiple } = this.state;
    if (multiple) {
      return this.renderMultipleFooter();
    }
    return this.renderMultipleButton();
  }

  getNumericAmount(amount) {
    let tempAmount = amount.replace(',', '.');
    if (tempAmount && Number(tempAmount)) {
      return Number(tempAmount);
    }
    return 0;
  }

  onChangeText(splitAmount, index) {
    const { allocatedAmount } = this.state;
    // if (splitAmount !== '' && !Number(splitAmount)) return;
    const { friendsAmount } = this.state;
    let tempAllocatedAmount = allocatedAmount;
    let tempFriendsAmount = Object.assign([], friendsAmount);

    tempAllocatedAmount =
      tempAllocatedAmount -
      this.getNumericAmount(tempFriendsAmount[index]) +
      this.getNumericAmount(splitAmount);
    tempFriendsAmount[index] = splitAmount;
    this.setState({ friendsAmount: tempFriendsAmount, allocatedAmount: tempAllocatedAmount });
  }

  renderSingleFriends(friend, index) {
    const { friendsAmount, multiple } = this.state;
    return (
      <PaidByFriends
        onPress={() => this.onSelectFriend(friend)}
        hideCheckBox={true}
        onChangeText={amount => this.onChangeText(amount, index)}
        amount={friendsAmount[index]}
        showTextBoxes={multiple}
        name={friend.name}
        key={index}
        mobile={''}
      />
    );
  }

  renderFriends() {
    const { friends } = this.props;
    return friends.map((friend, index) => this.renderSingleFriends(friend, index));
    return (
      <FlatList
        data={friends}
        initialNumToRender={50}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }, index) => this.renderSingleFriends(item, index)}
      />
    );
  }

  renderHeadingText() {
    const { multiple } = this.state;
    const title = multiple ? I18n.t('enter_each_persons_share') : I18n.t('choose_payer');
    const headerStyle = multiple ? styles.headerMultipleText : styles.headingText;
    return <EDText style={headerStyle}>{title}</EDText>;
  }

  render() {
    const { showPaidByOptions } = this.props;
    if (!showPaidByOptions) return null;
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
