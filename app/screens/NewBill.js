/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import GroupsList from 'app/components/GroupsList';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PaidByOptions from 'app/components/PaidByOptions';
import PropTypes from 'prop-types';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  selectedGroup: { flexDirection: 'row', alignItems: 'center', width: width - 70 },
  selectedGroupText: {
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H3,
    maxWidth: (2 * width) / 3,
    marginTop: 5,
    marginLeft: 15,
    padding: 5,
    borderColor: COLORS.APP_THEME_PURPLE,
    borderWidth: 1
  },
  paidByAndSplitText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 },
  paidByAndSplitButton: {
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H3,
    maxWidth: width / 4,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderColor: COLORS.APP_THEME_PURPLE,
    borderWidth: 1
  }
});

const FRIENDS_DETAILS = {
  name: 'Harshaknkvdkkndnf',
  mobile: '9491267523'
};
const FRIENDS = [
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS,
  FRIENDS_DETAILS
];

export default class NewBill extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      bill_name: '',
      amount: '',
      group: null,
      paid_by: null,
      split: null,
      friends: FRIENDS,
      groups: [...FRIENDS, { name: '' }],
      selectedFriends: ['you'],
      showGroups: false,
      showPaidByOptions: false,
      showSplit: false,
      spinner: false
    };
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onSelectGroup(group) {
    this.setState({ group, showGroups: false });
  }

  onSelectPaidByFriend(friend) {
    const { amount } = this.state;
    this.setState({ showPaidByOptions: false, paid_by: [{ name: friend.name, amount }] });
  }

  renderPaidByOptions() {
    const { friends, amount, showPaidByOptions } = this.state;
    return (
      <PaidByOptions
        friends={friends}
        amount={amount}
        showPaidByOptions={showPaidByOptions}
        onDialogClose={() => this.setState({ showPaidByOptions: false })}
        onSelectFriend={friend => this.onSelectPaidByFriend(friend)}
      />
    );
  }

  renderGroups() {
    const { groups, showGroups } = this.state;
    return (
      <GroupsList
        groups={groups}
        showGroups={showGroups}
        onDialogClose={() => this.setState({ showGroups: false })}
        onSelectGroup={group => this.onSelectGroup(group)}
      />
    );
  }

  renderPaidByAndSplitButton(title, stateKey) {
    return (
      <TouchableOpacity onPress={() => this.setState({ [stateKey]: true })}>
        <EDText style={styles.paidByAndSplitButton} numberOfLines={1}>
          {title}
        </EDText>
      </TouchableOpacity>
    );
  }

  renderPaidByAndSplit() {
    const { paid_by, split } = this.state;
    let paidByButtonTitle = I18n.t('you');
    if (paid_by) {
      if (paid_by.length === 1) {
        const words = paid_by[0].name.split(' ');
        paidByButtonTitle = words.length > 1 ? words[0] + ' ' + words[1] + '.' : words[0];
      } else {
        paidByButtonTitle = `2 + ${I18n.t('people')}`;
      }
    }
    const splitButtonTitle = split ? split : I18n.t('equally');
    return (
      <View style={{ flexDirection: 'row', marginTop: 15, width: width - 70 }}>
        <EDText style={styles.paidByAndSplitText}>{I18n.t('paid_by')}</EDText>
        {this.renderPaidByAndSplitButton(paidByButtonTitle, 'showPaidByOptions')}
        <EDText style={styles.paidByAndSplitText}>{I18n.t('and_split')}</EDText>
        {this.renderPaidByAndSplitButton(splitButtonTitle, 'showSplit')}
      </View>
    );
  }

  renderSelectedGroup() {
    const { group } = this.state;
    const title = group && group.name ? ` ${group.name}` : ` ${I18n.t('group')}: ${I18n.t('none')}`;
    return (
      <View style={styles.selectedGroup}>
        <Image source={Images['group']} style={{ height: 30, width: 30 }} />
        <TouchableOpacity onPress={() => this.setState({ showGroups: true })} style={{}}>
          <EDText style={styles.selectedGroupText} numberOfLines={1}>
            {title}
          </EDText>
        </TouchableOpacity>
      </View>
    );
  }

  renderTextInputField({
    title,
    placeholder = title,
    stateKey,
    keyboardType = 'default',
    secureTextEntry = false
  }) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={Images[stateKey]} style={{ height: 30, width: 30 }} />
        <EDTextInput
          title={title}
          textInputStyle={{ width: width - 100, paddingLeft: 15 }}
          containerStyle={{ marginHorizontal: 0 }}
          placeholder={placeholder}
          value={this.state[stateKey]}
          onChangeText={text => this.onChangeText(stateKey, text)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    );
  }

  renderAmount() {
    return this.renderTextInputField({
      title: I18n.t('amount'),
      stateKey: 'amount',
      keyboardType: 'number-pad'
    });
  }

  renderBillName() {
    return this.renderTextInputField({
      title: I18n.t('bill_name'),
      stateKey: 'bill_name'
    });
  }

  render() {
    const { spinner } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ToolBar
          title={I18n.t('new_bill')}
          leftImage="back"
          onLeft={() => goBack()}
          onRight={() => alert('TODO')}
          rightImage="tick"
        />
        <View style={styles.container}>
          <View style={styles.subContainer}>
            {this.renderBillName()}
            {this.renderAmount()}
            {this.renderSelectedGroup()}
            {this.renderPaidByAndSplit()}
          </View>
        </View>
        {this.renderGroups()}
        {this.renderPaidByOptions()}
      </View>
    );
  }
}
