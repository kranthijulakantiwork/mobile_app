/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import Avatar from 'app/components/Avatar';
import Contacts from 'react-native-contacts';
import EDText from 'app/components/EDText';
import FriendSelectionView from 'app/components/FriendSelectionView';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1
  },
  headerText: { fontSize: FONT_SIZES.H3, textAlign: 'center' },
  selectFriendAvatarContainer: { width: 55, alignItems: 'center', paddingVertical: 10 },
  name: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    color: COLORS.TEXT_BLACK,
    fontWeight: '200',
    fontSize: FONT_SIZES.H2,
    width: width - 100
  }
});

const FRIENDS_DETAILS = {
  name: 'Harshaknkvdkkndnf',
  mobile: '9491267523'
};

export default class SelectFriends extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      friendsList: [
        { ...FRIENDS_DETAILS, id: 1 },
        { ...FRIENDS_DETAILS, id: 2 },
        { ...FRIENDS_DETAILS, id: 3 },
        { ...FRIENDS_DETAILS, id: 4 },
        { ...FRIENDS_DETAILS, id: 5 },
        { ...FRIENDS_DETAILS, id: 6 },
        { ...FRIENDS_DETAILS, id: 7 },
        { ...FRIENDS_DETAILS, id: 8 },
        { ...FRIENDS_DETAILS, id: 9 },
        { ...FRIENDS_DETAILS, id: 10 }
      ],
      selectedFriends: ['you'],
      spinner: false
    };
  }

  componentWillMount() {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.'
      }).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
            console.log('err', err);
          } else {
            // contacts returned in Array
            let contacts_data = {};
            contacts.slice(0, 100).map((contact, contactIndex) => {
              if (contact.phoneNumbers.length) {
                contact.phoneNumbers.map((mobile, mobileIndex) => {
                  const id = `contact${contactIndex}mobile${mobileIndex}`;
                  contacts_data[id] = {
                    id,
                    name: `${contact.givenName ? contact.givenName : ''} ${
                      contact.familyName ? contact.familyName : ''
                    }`,
                    mobile: mobile.number
                  };
                });
              }
            });
            console.log('contacts', contacts_data);
            this.setState({ friends: contacts_data });
          }
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  selectFriend(index) {
    const { friendsList, selectedFriends } = this.state;
    if (selectedFriends.length < 14) {
      let tempFriends = Object.assign([], friendsList);
      tempFriends[index].selected = true;
      let tempSelectedFriends = Object.assign([], selectedFriends);
      tempSelectedFriends.push(index);
      return this.setState({ friends: tempFriends, selectedFriends: tempSelectedFriends });
    }
    return alert(I18n.t('maximum_friends_reached'));
  }

  unSelectFriend(index) {
    const { friendsList, selectedFriends } = this.state;
    let tempFriends = Object.assign([], friendsList);
    tempFriends[index].selected = false;
    let tempSelectedFriends = Object.assign([], selectedFriends);
    const positionIndex = tempSelectedFriends.indexOf(index);
    tempSelectedFriends.splice(positionIndex, 1);
    return this.setState({ friends: tempFriends, selectedFriends: tempSelectedFriends });
  }

  onFriendSelection(index) {
    const { selectedFriends } = this.state;
    if (selectedFriends.includes(index)) {
      return this.unSelectFriend(index);
    } else {
      return this.selectFriend(index);
    }
  }

  renderSingleFriend(friendDetails, index) {
    const { name, mobile, selected } = friendDetails;
    return (
      <FriendSelectionView
        onPress={() => this.onFriendSelection(index)}
        isSelected={selected}
        name={name}
        key={index}
        mobile={mobile}
      />
    );
  }

  renderFriends() {
    const { friendsList } = this.state;
    return friendsList.map((item, index) => this.renderSingleFriend(item, index));
  }

  renderSelectedFriendAvatar(id) {
    const { friends } = this.state;
    const friend = id === 'you' ? { name: 'Kranthi' } : friends[id];
    return (
      <Avatar
        name={friend['name']}
        showClose={id !== 'you'}
        disabled={id === 'you'}
        avatarSubText={friend['name']}
        avatarSubTextStyle={{ width: 50 }}
        onPress={() => this.unSelectFriend(id)}
        buttonStyle={styles.selectFriendAvatarContainer}
      />
    );
  }

  renderSelectedFriends() {
    const { selectedFriends } = this.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={selectedFriends}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderSelectedFriendAvatar(item)}
        />
      </View>
    );
  }

  renderHeader() {
    // TODO add search Bar and show selected Friends
    return (
      <View style={styles.headerContainer}>
        <EDText style={styles.headerText}>TODO</EDText>
        {this.renderSelectedFriends()}
      </View>
    );
  }

  render() {
    const { spinner, selectedFriends } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ToolBar
          title={I18n.t('select_friends')}
          subTitle={`${selectedFriends.length} / 15`}
          leftTitle={I18n.t('cancel')}
          onLeft={() => goBack()}
          onRight={() => alert('TODO')}
          rightTitle={I18n.t('next')}
        />
        {this.renderHeader()}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderFriends()}
          <View style={{ width, height: 20 }} />
        </ScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}
