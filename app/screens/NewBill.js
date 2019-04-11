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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import CalendarView from 'app/components/CalendarView';
import dismissKeyboard from 'dismissKeyboard';
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
  subContainer: { flex: 1, width, alignItems: 'center', paddingVertical: 20 },
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
  paidByAndSplitContainer: {
    flexDirection: 'row',
    marginTop: 15,
    width: width - 40,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  paidByAndSplitText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H1 },
  paidByAndSplitButton: {
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H1,
    maxWidth: width / 4,
    marginHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 5,
    borderColor: '#707070',
    borderWidth: 1
  }
});

const FRIENDS_DETAILS = {
  name: 'Harshaknkvdkkndnf',
  mobile: '9491267523'
};
const FRIENDS = [];
for (let index = 0; index < 25; index++) {
  FRIENDS.push({ ...FRIENDS_DETAILS, id: index });
}

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
      paidBy: {},
      split: null,
      friends: FRIENDS,
      groups: [...FRIENDS, { name: '' }],
      selectedFriends: ['you'],
      showGroups: false,
      showPaidByOptions: false,
      showSplit: false,
      spinner: false,
      addNote1: '',
      addNote2: '',
      addNote3: '',
      selectedDay: '',
      showCalendar: false
    };
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onFooterCalendarClick() {
    dismissKeyboard();
    this.setState({ showCalendar: true });
  }

  onFooterGroupClick() {
    dismissKeyboard();
    this.setState({ showGroups: true });
  }

  onSelectGroup(group) {
    dismissKeyboard();
    this.setState({ group, showGroups: false });
  }

  onSelectDate(day) {
    this.setState({ selectedDay: day.dateString, showCalendar: false });
  }

  onSelectPaidByFriend(friend) {
    dismissKeyboard();
    const { amount } = this.state;
    this.setState({ showPaidByOptions: false, paidBy: { [friend.id]: amount } });
  }

  onMultiplePeoplePaid(friendsAmount) {
    dismissKeyboard();
    this.setState({
      showPaidByOptions: false,
      paidBy: friendsAmount
    });
  }

  renderCalender() {
    const { selectedDay, showCalendar } = this.state;
    if (!showCalendar) return null;
    return (
      <CalendarView
        onSelectDate={day => this.onSelectDate(day)}
        showCalendar={showCalendar}
        selectedDay={selectedDay}
        onDialogClose={() => this.setState({ showCalendar: false })}
      />
    );
  }

  renderPaidByOptions() {
    const { friends, amount, showPaidByOptions, paidBy } = this.state;
    if (!showPaidByOptions) return null;
    return (
      <PaidByOptions
        friends={friends}
        amount={amount}
        showPaidByOptions={showPaidByOptions}
        onDialogClose={() => this.setState({ showPaidByOptions: false })}
        onSelectFriend={friend => this.onSelectPaidByFriend(friend)}
        onOkay={friendsAmount => this.onMultiplePeoplePaid(friendsAmount)}
        paidBy={paidBy}
      />
    );
  }

  renderGroups() {
    const { groups, showGroups } = this.state;
    if (!showGroups) return null;
    return (
      <GroupsList
        groups={groups}
        showGroups={showGroups}
        onDialogClose={() => this.setState({ showGroups: false })}
        onSelectGroup={group => this.onSelectGroup(group)}
      />
    );
  }

  renderFooterButton(title, imageSource, onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <View
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image source={Images[imageSource]} />
          <EDText
            style={{
              fontSize: FONT_SIZES.H2,
              color: COLORS.TEXT_BLACK,
              marginLeft: 5,
              maxWidth: width / 3 - 50
            }}
            numberOfLines={1}
          >
            {title}
          </EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    const { group, selectedDay } = this.state;
    const groupName = group && group.name ? group.name : I18n.t('none');
    const dateValue = selectedDay ? selectedDay : I18n.t('date');
    return (
      <View
        style={{
          flexDirection: 'row',
          width: width,
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0,
          justifyContent: 'space-evenly',
          height: 50,
          borderColor: COLORS.TEXT_BLACK,
          borderTopWidth: 1
        }}
      >
        {this.renderFooterButton(dateValue, 'calendar', () => this.onFooterCalendarClick())}
        <View style={{ height: 48, width: 1, backgroundColor: COLORS.TEXT_BLACK }} />
        {this.renderFooterButton(groupName, 'multiple_people', () => this.onFooterGroupClick())}
        <View style={{ height: 50, width: 1, backgroundColor: COLORS.TEXT_BLACK }} />
        {this.renderFooterButton('Image', 'camera', () => {})}
      </View>
    );
  }

  renderAddNote() {
    return (
      <View style={{}}>
        <EDTextInput
          textInputStyle={{ width: (2 * width) / 3 }}
          placeholder={I18n.t('add_notes')}
          containerStyle={{ marginVertical: 0, marginTop: 15 }}
          value={this.state.addNote1}
          onChangeText={text => this.onChangeText('addNote1', text)}
        />
        <EDTextInput
          textInputStyle={{ width: (2 * width) / 3 }}
          containerStyle={{ marginVertical: 0 }}
          value={this.state.addNote2}
          onChangeText={text => this.onChangeText('addNote2', text)}
        />
        <EDTextInput
          textInputStyle={{ width: (2 * width) / 3 }}
          containerStyle={{ marginVertical: 0 }}
          value={this.state.addNote3}
          onChangeText={text => this.onChangeText('addNote3', text)}
        />
      </View>
    );
  }

  renderPaidByAndSplitButton(title, stateKey) {
    return (
      <TouchableOpacity
        onPress={() => {
          dismissKeyboard();
          this.setState({ [stateKey]: true });
        }}
      >
        <EDText style={styles.paidByAndSplitButton} numberOfLines={1}>
          {title}
        </EDText>
      </TouchableOpacity>
    );
  }

  renderPaidByAndSplit() {
    const { paidBy, split, friends } = this.state;
    let paidByButtonTitle = I18n.t('you');
    if (Object.keys(paidBy).length === 1) {
      const paidByFriend = friends.filter(friend => friend.id == Object.keys(paidBy)[0])[0];
      const words = paidByFriend.name.split(' ');
      paidByButtonTitle = words.length > 1 ? words[0] + ' ' + words[1] + '.' : words[0];
    } else if (Object.keys(paidBy).length > 1) {
      paidByButtonTitle = `2 + ${I18n.t('people')}`;
    }
    const splitButtonTitle = split ? split : I18n.t('equally');
    return (
      <View style={styles.paidByAndSplitContainer}>
        <EDText style={styles.paidByAndSplitText}>{I18n.t('paid_by')}</EDText>
        {this.renderPaidByAndSplitButton(paidByButtonTitle, 'showPaidByOptions')}
        <EDText style={styles.paidByAndSplitText}>{I18n.t('and_split')}</EDText>
        {this.renderPaidByAndSplitButton(splitButtonTitle, 'showSplit')}
      </View>
    );
  }

  renderTextInputField({
    title,
    stateKey,
    keyboardType = 'default',
    secureTextEntry = false,
    titleText
  }) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {titleText ? (
          <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: 60 }}>{titleText}</EDText>
        ) : (
          <Image source={Images[stateKey]} style={{ height: 30, width: 30 }} />
        )}
        <EDTextInput
          title={title}
          textInputStyle={{ width: width - 100, marginLeft: 15 }}
          titleStyle={{ marginLeft: 15 }}
          containerStyle={{ marginHorizontal: 0 }}
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
      keyboardType: 'number-pad',
      titleText: '₹'
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
          <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.WHITE }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'always'}
          >
            <View style={styles.subContainer}>
              {this.renderBillName()}
              {this.renderAmount()}
              {this.renderPaidByAndSplit()}
              {/*this.renderAddNote()*/}
            </View>
          </KeyboardAwareScrollView>
          {this.renderFooter()}
        </View>
        {this.renderGroups()}
        {this.renderPaidByOptions()}
        {this.renderCalender()}
      </View>
    );
  }
}
