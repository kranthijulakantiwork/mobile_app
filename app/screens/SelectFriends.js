/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  InteractionManager,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { realm } from 'app/models/schema';
import { replaceScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import AbsoluteView from 'app/components/AbsoluteView';
import Avatar from 'app/components/Avatar';
import EDText from 'app/components/EDText';
import FriendSelectionView from 'app/components/FriendSelectionView';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE, marginHorizontal: 20 },
  scrollContainer: { flex: 1 },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: { fontSize: FONT_SIZES.H1, textAlign: 'center', fontWeight: 'bold' },
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
class SelectFriends extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      friendsList: this.props.contacts,
      selectedFriends: ['you'],
      spinner: false,
      searchName: ''
    };
  }

  onDialogClose() {
    const { onDialogClose } = this.props;
    onDialogClose && onDialogClose();
  }

  onChangeText(text) {
    this.setState({
      searchName: text,
      friendsList: realm.objects('Contact').filtered('name CONTAINS[c] $0', text)
    });
  }

  // selectFriend(index) {
  //   const { friendsList, selectedFriends } = this.state;
  //   if (selectedFriends.length < 14) {
  //     let tempFriends = Object.assign([], friendsList);
  //     tempFriends[index].selected = true;
  //     let tempSelectedFriends = Object.assign([], selectedFriends);
  //     tempSelectedFriends.push(index);
  //     return this.setState({ friendsList: tempFriends, selectedFriends: tempSelectedFriends });
  //   }
  //   return alert(I18n.t('maximum_friends_reached'));
  // }

  // unSelectFriend(index) {
  //   const { friendsList, selectedFriends } = this.state;
  //   let tempFriends = Object.assign([], friendsList);
  //   tempFriends[index].selected = false;
  //   let tempSelectedFriends = Object.assign([], selectedFriends);
  //   const positionIndex = tempSelectedFriends.indexOf(index);
  //   tempSelectedFriends.splice(positionIndex, 1);
  //   return this.setState({ friendsList: tempFriends, selectedFriends: tempSelectedFriends });
  // }

  onFriendSelection(index) {
    const { friendsList } = this.state;
    const friend = friendsList[index];
    const { onAddFriend } = this.props;
    onAddFriend && onAddFriend(friend);
  }

  // onSubmit() {
  //   // TODO replace screen with screen from props or so
  //   const { dispatch, state } = this.props.navigation;
  //   const { selectedFriends, friendsList } = this.state;
  //   const selected_friends = [];
  //   selectedFriends.map(index => {
  //     if (index !== 'you') {
  //       selected_friends.push(friendsList[index]);
  //     }
  //   });
  //   replaceScreen({
  //     routeName: 'NewBill',
  //     currentScreenKey: state.key,
  //     params: { friends: selected_friends },
  //     dispatch
  //   });
  // }

  renderSingleFriend(friendDetails, index) {
    const { name, mobile, selected } = friendDetails;
    return (
      <FriendSelectionView
        onPress={() => this.onFriendSelection(index)}
        isSelected={selected}
        name={name}
        key={index}
        mobile={mobile}
        hideCheckBox={true}
      />
    );
  }

  renderFriends() {
    const { friendsList } = this.state;
    return (
      <FlatList
        data={friendsList}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={30}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => this.renderSingleFriend(item, index)}
      />
    );
    return friendsList.map((item, index) => this.renderSingleFriend(item, index));
  }

  // renderSelectedFriendAvatar(id) {
  //   const { friendsList } = this.state;
  //   const friend = id === 'you' ? { name: 'Kranthi' } : friendsList[id];
  //   return (
  //     <Avatar
  //       name={friend['name']}
  //       showClose={id !== 'you'}
  //       disabled={id === 'you'}
  //       avatarSubText={friend['name']}
  //       avatarSubTextStyle={{ width: 50 }}
  //       onPress={() => this.unSelectFriend(id)}
  //       buttonStyle={styles.selectFriendAvatarContainer}
  //     />
  //   );
  // }

  // renderSelectedFriends() {
  //   const { selectedFriends } = this.state;
  //   return (
  //     <View style={{ flexDirection: 'row' }}>
  //       <FlatList
  //         data={selectedFriends}
  //         horizontal={true}
  //         showsHorizontalScrollIndicator={false}
  //         keyExtractor={(item, index) => index.toString()}
  //         renderItem={({ item }) => this.renderSelectedFriendAvatar(item)}
  //       />
  //     </View>
  //   );
  // }

  renderHeader() {
    // TODO add search Bar and show selected Friends
    return (
      <View style={styles.headerContainer}>
        <EDText style={styles.headerText}>{I18n.t('add_friend')}</EDText>
        <TextInput
          style={{
            height: 50,
            width: width - 80,
            margin: 20,
            borderColor: 'black',
            borderWidth: 1
          }}
          onChangeText={text => this.onChangeText(text)}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          value={this.state.searchName}
          placeholder={I18n.t('search_friends')}
        />
        {/* {this.renderSelectedFriends()} */}
      </View>
    );
  }

  render() {
    const { spinner, selectedFriends } = this.state;
    return (
      <AbsoluteView onDialogClose={() => this.onDialogClose()}>
        <View style={styles.container}>
          {/* <ToolBar
            title={I18n.t('select_friends')}
            leftImage="back"
            onLeft={() => goBack()}
            onRight={() => this.onSubmit()}
            rightTitle={I18n.t('next')}
          /> */}
          {this.renderHeader()}
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
          >
            {this.renderFriends()}
            <View style={{ width, height: 20 }} />
          </ScrollView>
          {spinner && <Spinner />}
        </View>
      </AbsoluteView>
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
)(SelectFriends);
