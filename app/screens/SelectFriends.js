/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
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
  avatarContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.APP_THEME_PURPLE
  },
  avatarText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H3 },
  closeContainer: {
    position: 'absolute',
    top: 0,
    right: 3,
    width: 12,
    height: 12,
    borderColor: 'red',
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  closeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  avatarName: {
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H4,
    textAlign: 'center',
    width: 50,
    paddingTop: 3
  },
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
      friends: {
        1: { ...FRIENDS_DETAILS, id: 1 },
        2: { ...FRIENDS_DETAILS, id: 2 },
        3: { ...FRIENDS_DETAILS, id: 3 },
        4: { ...FRIENDS_DETAILS, id: 4 },
        5: { ...FRIENDS_DETAILS, id: 5 },
        6: { ...FRIENDS_DETAILS, id: 6 },
        7: { ...FRIENDS_DETAILS, id: 7 },
        8: { ...FRIENDS_DETAILS, id: 8 },
        9: { ...FRIENDS_DETAILS, id: 9 },
        10: { ...FRIENDS_DETAILS, id: 10 }
      },
      selectedFriends: ['you'],
      spinner: false
    };
  }

  selectFriend(id) {
    const { selectedFriends } = this.state;
    if (selectedFriends.length < 14) {
      let tempSelectedFriends = Object.assign([], selectedFriends);
      tempSelectedFriends.push(id.toString());
      return this.setState({ selectedFriends: tempSelectedFriends });
    }
    return alert(I18n.t('maximum_friends_reached'));
  }

  unSelectFriend(id) {
    const { selectedFriends } = this.state;
    let tempSelectedFriends = Object.assign([], selectedFriends);
    const index = tempSelectedFriends.indexOf(id.toString());
    tempSelectedFriends.splice(index, 1);
    return this.setState({ selectedFriends: tempSelectedFriends });
  }

  onFriendSelection(friendDetails) {
    const { id } = friendDetails;
    const { selectedFriends } = this.state;
    if (selectedFriends.includes(id.toString())) {
      return this.unSelectFriend(id.toString());
    } else {
      return this.selectFriend(id.toString());
    }
  }

  renderSingleFriend(id, index) {
    const { selectedFriends, friends } = this.state;
    const friendDetails = friends[id];
    const { name, mobile } = friendDetails;
    return (
      <FriendSelectionView
        onPress={() => this.onFriendSelection(friendDetails)}
        isSelected={selectedFriends.includes(id)}
        name={name}
        key={index}
        mobile={mobile}
      />
    );
  }

  renderFriends() {
    const { friends } = this.state;
    return Object.keys(friends).map((id, index) => this.renderSingleFriend(id.toString(), index));
  }

  renderCloseImage(id) {
    if (id !== 'you') {
      return (
        <View style={styles.closeContainer}>
          <EDText style={styles.closeText}>{'X'}</EDText>
        </View>
      );
    }
    return null;
  }

  renderSelectedFriendAvatar(id) {
    const { friends } = this.state;
    const friend = id === 'you' ? { name: 'Kranthi' } : friends[id];
    return (
      <TouchableOpacity
        onPress={() => this.unSelectFriend(id)}
        disabled={id === 'you'}
        style={styles.selectFriendAvatarContainer}
      >
        <View style={{ width: 40, height: 45 }}>
          <View style={styles.avatarContainer}>
            <EDText style={styles.avatarText}>{friend['name'][0]}</EDText>
          </View>
          {this.renderCloseImage(id)}
        </View>
        <EDText numberOfLines={1} style={styles.avatarName}>
          {friend['name']}
        </EDText>
      </TouchableOpacity>
    );
  }

  renderSelectedFriends() {
    const { selectedFriends } = this.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={selectedFriends}
          horizontal={true}
          initialNumToRender={50}
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
