/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
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
import { navigateToScreen, replaceScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import Avatar from 'app/components/Avatar';
import CalendarView from 'app/components/CalendarView';
import Categories from 'app/components/Categories';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import GroupsList from 'app/components/GroupsList';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PaidByOptions from 'app/components/PaidByOptions';
import PropTypes from 'prop-types';
import SelectFriends from 'app/screens/SelectFriends';
import SplitByOptions from 'app/components/SplitByOptions';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: { flex: 1, width, alignItems: 'center', paddingVertical: 20 },
  selectFriendAvatarContainer: { width: 65, alignItems: 'center', paddingVertical: 10 },
  plusButtonView: {
    height: 45,
    width: 45,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#bbbbbb',
    alignItems: 'center',
    justifyContent: 'center'
  },
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
for (let index = 0; index < 8; index++) {
  FRIENDS.push({ ...FRIENDS_DETAILS, id: index, mobile: '949126752' + index });
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
      ...this.getState(),
      showCategory: false,
      showGroups: false,
      showPaidByOptions: false,
      showCalendar: false,
      showSplitByOptions: false,
      showFriendsList: false
    };
  }

  getState() {
    const { state, getParam } = this.props.navigation;
    const { params = {} } = state;
    const friendsList = getParam('friends') || FRIENDS;
    const {
      bill_name = '',
      amount = '',
      group = null,
      paidBy = {},
      friends = friendsList,
      added_on = new Date().toDateString().substr(4),
      category = 'others',
      splitType = 'equally',
      splitByFriends = friendsList.map(friend => friend.mobile),
      allocatedSplitAmount = { shares: 0, percentages: 0, unequally: 0, adjustment: 0 },
      friendsSplitAmount = { shares: {}, percentages: {}, unequally: {}, adjustment: {} }
    } = params;
    return {
      bill_name,
      amount,
      group,
      paidBy,
      friends,
      added_on,
      category,
      splitType,
      splitByFriends,
      allocatedSplitAmount,
      friendsSplitAmount
    };
  }

  onAddFriend(friend) {
    const { friends } = this.state;
    // TODO handle split
    this.setState({ showFriendsList: false, friends: [...friends, friend] });
  }

  unSelectFriend(friend) {
    alert('TODO');
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
    this.setState({ added_on: day.dateString, showCalendar: false });
  }

  onSelectPaidByFriend(friend) {
    dismissKeyboard();
    const { amount } = this.state;
    this.setState({ showPaidByOptions: false, paidBy: { [friend.mobile]: amount } });
  }

  onMultiplePeoplePaid(friendsAmount) {
    dismissKeyboard();
    console.log('friendsAmount', friendsAmount);
    this.setState({
      showPaidByOptions: false,
      paidBy: friendsAmount
    });
  }

  onSplitByCompleted(splitType, allocatedAmount, friendsAmount, splitByFriends) {
    this.setState({
      splitType,
      allocatedSplitAmount: allocatedAmount,
      friendsSplitAmount: friendsAmount,
      splitByFriends,
      showSplitByOptions: false
    });
  }

  onSubmit() {
    dismissKeyboard();
    const {
      bill_name,
      amount,
      group,
      paidBy,
      friends,
      added_on,
      category,
      splitType,
      splitByFriends,
      allocatedSplitAmount,
      friendsSplitAmount
    } = this.state;
    if (!bill_name) alert(I18n.t('please_enter_description'));
    if (!amount) alert(I18n.t('please_enter_amount'));
    // TODO if paidBy is empty change it to the user himself
    //  Add added_by
    // Need to replace screen instead of navigating.
    //  TODO remove current user here
    const current_user = { id: 1, mobile: '9866070833' };
    const paidByFinal =
      paidBy && Object.keys(paidBy).length ? paidBy : { [current_user.mobile]: amount };
    const { state, dispatch } = this.props.navigation;
    replaceScreen({
      routeName: 'BillDetails',
      currentScreenKey: state.key,
      params: {
        bill_name,
        amount,
        group,
        paidBy,
        friends,
        added_on,
        category,
        splitType,
        splitByFriends,
        allocatedSplitAmount,
        friendsSplitAmount
      },
      dispatch
    });
  }

  renderFriendsList() {
    const { showFriendsList } = this.state;
    if (!showFriendsList) return null;
    return (
      <SelectFriends
        onDialogClose={() => this.setState({ showFriendsList: false })}
        onAddFriend={friend => this.onAddFriend(friend)}
      />
    );
  }

  renderCalender() {
    const { added_on, showCalendar } = this.state;
    if (!showCalendar) return null;
    return (
      <CalendarView
        onSelectDate={day => this.onSelectDate(day)}
        showCalendar={showCalendar}
        selectedDay={added_on}
        onDialogClose={() => this.setState({ showCalendar: false })}
      />
    );
  }

  renderSplitByOptions() {
    const {
      friends,
      amount,
      showSplitByOptions,
      splitType,
      splitByFriends,
      allocatedSplitAmount,
      friendsSplitAmount
    } = this.state;
    if (!showSplitByOptions) return null;
    return (
      <SplitByOptions
        friends={friends}
        splitByFriends={splitByFriends}
        amount={Number(amount)}
        allocatedAmount={allocatedSplitAmount}
        friendsAmount={friendsSplitAmount}
        showSplitByOptions={showSplitByOptions}
        onDialogClose={() => this.setState({ showSplitByOptions: false })}
        onSelectFriend={friend => this.onSelectPaidByFriend(friend)}
        onOkay={this.onSplitByCompleted.bind(this)}
        splitType={splitType}
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

  renderCategories() {
    const { showCategory } = this.state;
    if (!showCategory) return null;
    return (
      <Categories
        onPress={category => this.setState({ category, showCategory: false })}
        onDialogClose={() => this.setState({ showCategory: false })}
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
              maxWidth: width / 2 - 50
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
    const { group, added_on } = this.state;
    const groupName = group && group.name ? group.name : I18n.t('none');
    const dateValue = added_on ? added_on : I18n.t('date');
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
          borderTopWidth: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        {this.renderFooterButton(dateValue, 'calendar', () => this.onFooterCalendarClick())}
        <View style={{ height: 48, width: 1, backgroundColor: COLORS.TEXT_BLACK }} />
        {this.renderFooterButton(groupName, 'multiple_people', () => this.onFooterGroupClick())}
        {/*<View style={{ height: 50, width: 1, backgroundColor: COLORS.TEXT_BLACK }} />
      {this.renderFooterButton('Image', 'camera', () => {})*/}
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
    const { paidBy, splitType, friends } = this.state;
    let paidByButtonTitle = I18n.t('you');
    if (Object.keys(paidBy).length === 1) {
      const paidByFriend = friends.filter(friend => friend.mobile == Object.keys(paidBy)[0])[0];
      const words = paidByFriend.name.split(' ');
      paidByButtonTitle = words.length > 1 ? words[0] + ' ' + words[1] + '.' : words[0];
    } else if (Object.keys(paidBy).length > 1) {
      paidByButtonTitle = `2 + ${I18n.t('people')}`;
    }
    const splitButtonTitle = splitType === 'equally' ? I18n.t('equally') : I18n.t('unequally');
    return (
      <View style={styles.paidByAndSplitContainer}>
        <EDText style={styles.paidByAndSplitText}>{I18n.t('paid_by')}</EDText>
        {this.renderPaidByAndSplitButton(paidByButtonTitle, 'showPaidByOptions')}
        <EDText style={styles.paidByAndSplitText}>{I18n.t('and_split')}</EDText>
        {this.renderPaidByAndSplitButton(splitButtonTitle, 'showSplitByOptions')}
      </View>
    );
  }

  renderAmount() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: 60 }}>{'₹'}</EDText>
        <EDTextInput
          title={I18n.t('amount')}
          textInputStyle={{ width: width - 100, marginLeft: 15 }}
          titleStyle={{ marginLeft: 15 }}
          containerStyle={{ marginHorizontal: 0 }}
          value={this.state['amount']}
          onChangeText={text => this.onChangeText('amount', text)}
          keyboardType={'number-pad'}
        />
      </View>
    );
  }

  renderCategoryButton() {
    const { category } = this.state;
    const categoryText = category ? I18n.t(category) : I18n.t('select_category');
    const categoryImage = category ? category : 'category';
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showCategory: true });
          dismissKeyboard();
        }}
        style={{ alignSelf: 'center' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 40 / 2,
              borderWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#bbbbbb'
            }}
          >
            <Image source={Images[categoryImage]} />
          </View>
          <EDText style={{ width: 40, fontSize: 10, color: COLORS.TEXT_BLACK, marginLeft: 5 }}>
            {categoryText}
          </EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderBillName() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={Images['bill_name']} />
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: COLORS.TEXT_BLACK,
            marginLeft: 15
          }}
        >
          <EDTextInput
            title={I18n.t('bill_name')}
            textInputStyle={{ width: width - 160, borderBottomWidth: 0 }}
            containerStyle={{ marginHorizontal: 0 }}
            value={this.state['bill_name']}
            onChangeText={text => this.onChangeText('bill_name', text)}
          />
          {this.renderCategoryButton()}
        </View>
      </View>
    );
  }

  renderFriendAvatar(friend, index) {
    return (
      <Avatar
        name={friend['name']}
        showClose={true}
        avatarSubText={friend['name']}
        avatarSubTextStyle={{ width: 50, color: COLORS.TEXT_BLACK }}
        onPress={() => this.unSelectFriend(friend)}
        buttonStyle={styles.selectFriendAvatarContainer}
      />
    );
  }

  renderFriends() {
    const { friends } = this.state;
    return (
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        <FlatList
          data={friends}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => this.renderFriendAvatar(item, index)}
        />
        <TouchableOpacity onPress={() => this.setState({ showFriendsList: true })}>
          <View style={styles.selectFriendAvatarContainer}>
            <View style={styles.plusButtonView}>
              <EDText style={{ color: '#bbbbbb', fontSize: 33 }}>{'+'}</EDText>
            </View>
            <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H5, paddingTop: 5 }}>
              {I18n.t('add_friend')}
            </EDText>
          </View>
        </TouchableOpacity>
      </View>
    );
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
          onRight={() => this.onSubmit()}
          rightImage="tick"
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.WHITE }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'always'}
          >
            {this.renderFriends()}
            <View style={styles.subContainer}>
              {this.renderBillName()}
              {this.renderAmount()}
              {this.renderPaidByAndSplit()}
              {/*this.renderAddNote()*/}
            </View>
          </KeyboardAwareScrollView>
          {this.renderFooter()}
        </View>
        {this.renderCategories()}
        {this.renderGroups()}
        {this.renderPaidByOptions()}
        {this.renderSplitByOptions()}
        {this.renderCalender()}
        {this.renderFriendsList()}
      </View>
    );
  }
}
