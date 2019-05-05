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
import { getFriends } from 'app/api/Friends';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import Balances from 'app/components/Balances';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';
import StatusCard from 'app/components/StatusCard';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1, backgroundColor: COLORS.BACKGROUND_GRAY },
  footerContainer: {
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: COLORS.WHITE,
    borderRadius: 3
  },
  footerText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 }
});

const FRIENDS_DETAILS = {
  name: 'Kranthi',
  owed: true,
  balance: '200',
  mobile: '9491267523'
};
const amountToBeSettled = '300';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [
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
      ],
      amountToBeSettled,
      isOwed: false,
      spinner: false
    };
  }

  componentWillMount() {
    const { currentUser } = this.props;
    getFriends(currentUser).then(response => {
      if (response.success) {
        this.setState({ friends: response.data.friends });
      }
    });
  }

  onFriendSelection(friendDetails) {
    alert('TODO');
  }

  onAddMoreFriends() {
    alert('TODO');
  }

  onAddBill() {
    alert('TODO');
  }

  renderFooter() {
    return (
      <TouchableOpacity onPress={this.onAddMoreFriends}>
        <View style={styles.footerContainer}>
          <EDText style={styles.footerText}>{I18n.t('add_more_friends')}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderSingleFriend(friendDetails) {
    const { name, balance, mobile } = friendDetails;
    return (
      <StatusCard
        onPress={() => this.onFriendSelection(friendDetails)}
        name={name}
        balance={balance}
        mobile={mobile}
        balanceType={'friends'}
      />
    );
  }

  renderFriends() {
    const { friends } = this.state;
    return (
      <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => this.renderSingleFriend(item)}
      />
    );
  }

  renderHeader() {
    const { amountToBeSettled, isOwed } = this.state;
    return <Balances to_pay={'15.00'} to_get={'344.00'} balance={'329.00'} />;
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderFriends()}
          {this.renderFooter()}
          <View style={{ width, height: 100 }} />
        </ScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

Friends.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
