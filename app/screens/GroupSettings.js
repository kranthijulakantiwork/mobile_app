/* @flow */

import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Switch,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { getGroupsAndFriends } from 'app/reducers/groups/Actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { realm } from 'app/models/schema';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import { updateGroup } from 'app/api/Groups';
import Avatar from 'app/components/Avatar';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';
import SelectFriends from 'app/screens/SelectFriends';
import showToast from 'app/helpers/Toast';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, color: COLORS.BACKGROUND_GRAY },
  subContainer: {
    flex: 1,
    width,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.BACKGROUND_GRAY
  },
  singleFriendContainer: {
    width: width - 40,
    margin: 10,
    backgroundColor: COLORS.WHITE,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  addFriendContainer: {
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.TEXT_LIGHT_GRAY,
    borderWidth: 2,
    borderRadius: 3
  },
  plusButtonView: {
    height: 33,
    width: 33,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: COLORS.TEXT_LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: { marginLeft: 15, color: COLORS.TEXT_LIGHT_GRAY, fontSize: FONT_SIZES.H20 }
});

class GroupSettings extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // TODO Add current user to group automatically
    const { currentUser } = this.props;
    const { name, friends, intelligentSettlements } = this.props.navigation.state.params;
    this.state = {
      group_name: name,
      friends: this.getFriends(),
      friendsMobileNumber: friends.map(friend => friend.id),
      intelligentSettlements,
      showFriendsList: false,
      spinner: false
    };
  }

  getFriends() {
    const { friends } = this.props.navigation.state.params;
    const { contacts } = this.props;
    let friendsDetails = [];
    friends.forEach(friend => {
      const friendObject = contacts.filter(contact => contact.mobile == friend.id)[0];
      friendsDetails.push({ name: friendObject.name, mobile: friend.id, balance: friend.balance });
    });
    return friendsDetails;
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onFriendClick(index) {
    Alert.alert(
      I18n.t('remove_group_member'),
      I18n.t('are_you_sure_you_want_to_remove_this_person_from_group'),
      [
        { text: I18n.t('cancel'), onPress: () => {} },
        { text: I18n.t('ok'), onPress: () => this.onRemoveFriend(index) }
      ],
      { cancelable: true }
    );
  }

  onRemoveFriend(index) {
    const { friends } = this.state;
    let tempFriends = Object.assign([], friends);
    tempFriends.splice(index, 1);
    this.setState({ friends: tempFriends });
  }

  onAddFriend() {
    dismissKeyboard();
    this.setState({ showFriendsList: true });
  }

  onFriendAdded(friend) {
    const { friends, friendsMobileNumber } = this.state;
    if (friendsMobileNumber.includes(friend.mobile)) return null;
    this.setState({
      showFriendsList: false,
      friends: [...friends, friend],
      friendsMobileNumber: [...friendsMobileNumber, friend.mobile]
    });
  }

  onSubmit() {
    dismissKeyboard();
    const { currentUser, getGroupsAndFriends } = this.props;
    const { group_name, friends, intelligentSettlements } = this.state;
    const { id } = this.props.navigation.state.params;
    if (!group_name) return null;
    this.setState({ spinner: true });
    updateGroup(currentUser, group_name, friends, intelligentSettlements, id).then(response => {
      if (response.success) {
        getGroupsAndFriends(currentUser);
        showToast({ message: response.data.status });
      }
      this.setState({ spinner: false });
    });
  }

  renderFriendsList() {
    const { showFriendsList } = this.state;
    const { contacts } = this.props;
    if (!showFriendsList) return null;
    return (
      <SelectFriends
        friends={contacts}
        onDialogClose={() => this.setState({ showFriendsList: false })}
        onAddFriend={friend => this.onFriendAdded(friend)}
      />
    );
  }

  renderAddFriendButton() {
    return (
      <TouchableOpacity onPress={() => this.onAddFriend()}>
        <View style={styles.addFriendContainer}>
          <View style={styles.plusButtonView}>
            <EDText style={{ color: COLORS.TEXT_LIGHT_GRAY, fontSize: 33 }}>{'+'}</EDText>
          </View>
          <EDText style={styles.footerText}>{I18n.t('add_friend')}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderBalance(balance) {
    const color = balance < 0 ? COLORS.BALANCE_RED : COLORS.BALANCE_GREEN;
    const balanceText = balance < 0 ? I18n.t('owes') : I18n.t('gets_back');
    if (balance) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <EDText style={{ color, fontSize: FONT_SIZES.H4 }}>{balanceText}</EDText>
          <EDText style={{ color, fontSize: FONT_SIZES.H2 }}>{Math.abs(balance)}</EDText>
        </View>
      );
    }
    return null;
  }

  renderSingleFriend(friend, index) {
    const disabled = friend.balance ? true : false;
    return (
      <TouchableOpacity onPress={() => this.onFriendClick(index)} disabled={disabled}>
        <View style={styles.singleFriendContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Avatar
              name={friend['name']}
              disabled={true}
              buttonStyle={styles.selectFriendAvatarContainer}
            />
            <View>
              <EDText
                style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H1, marginLeft: 5 }}
                numberOfLines={1}
              >
                {friend['name']}
              </EDText>
              <EDText
                style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4, marginLeft: 5 }}
                numberOfLines={1}
              >
                {friend['mobile']}
              </EDText>
            </View>
          </View>
          {this.renderBalance(friend['balance'])}
          {disabled ? null : (
            <EDText style={{ color: COLORS.BALANCE_RED, fontSize: FONT_SIZES.H22, marginLeft: 5 }}>
              {'X'}
            </EDText>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  renderFriends() {
    const { friends } = this.state;
    return (
      <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => this.renderSingleFriend(item, index)}
      />
    );
  }

  renderIntelligentSettlementToggle() {
    const { intelligentSettlements } = this.state;
    const status = intelligentSettlements ? I18n.t('on') : I18n.t('off');
    return (
      <View
        style={{
          width: width - 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 30
        }}
      >
        <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H2 }}>
          {I18n.t('intelligent_settlements')}
        </EDText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            onValueChange={value =>
              this.setState({ intelligentSettlements: !intelligentSettlements })
            }
            thumbTintColor={COLORS.APP_THEME_GREEN}
            onTintColor={COLORS.APP_THEME_GREEN}
            tintColor={COLORS.BALANCE_RED}
            value={intelligentSettlements}
          />
          <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4 }}>
            {status.toUpperCase()}
          </EDText>
        </View>
      </View>
    );
  }

  renderGroupName() {
    const { group_name } = this.state;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          name={group_name || 'G'}
          disabled={true}
          buttonStyle={styles.selectFriendAvatarContainer}
        />
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: COLORS.TEXT_BLACK,
            marginLeft: 15
          }}
        >
          <EDTextInput
            title={I18n.t('group_name')}
            textInputStyle={{ width: width - 160, borderBottomWidth: 0, margin: 0, padding: 0 }}
            containerStyle={{ marginHorizontal: 0, padding: 0, marginVertical: 0 }}
            value={this.state['group_name']}
            onChangeText={text => this.onChangeText('group_name', text)}
          />
        </View>
      </View>
    );
  }

  render() {
    const { spinner } = this.state;
    const { goBack } = this.props.navigation;
    const { name } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <ToolBar
          title={I18n.t('edit_group_settings')}
          leftImage="back"
          onLeft={() => goBack()}
          onRight={() => this.onSubmit()}
          rightImage="tick"
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'always'}
          >
            <View style={styles.subContainer}>
              {this.renderGroupName()}
              {this.renderIntelligentSettlementToggle()}
              {this.renderFriends()}
              {this.renderAddFriendButton()}
            </View>
          </KeyboardAwareScrollView>
        </View>
        {this.renderFriendsList()}
        {spinner && <Spinner />}
      </View>
    );
  }
}

GroupSettings.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    contacts: state.common.contacts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getGroupsAndFriends }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSettings);
