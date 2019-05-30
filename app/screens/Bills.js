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
import { navigateToScreen } from 'app/helpers/NavigationHelper';
import { realm } from 'app/models/schema';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';
import ToolBar from 'app/components/ToolBar';
import { getFriendsBills, getGroupsBills } from 'app/api/Bills';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  billButton: {
    width: (2 * width) / 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE
  },
  billName: { color: COLORS.BILL_DETAILS_BLACK, fontSize: 12, marginTop: 10 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SEPARATOR_WHITE
  },
  settleButton: { backgroundColor: '#13b4f0', borderRadius: 25, marginVertical: 10 },
  settleButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H1,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  addButton: { position: 'absolute', bottom: 75, right: 30 },
  addButtonTextContainer: {
    backgroundColor: COLORS.APP_THEME_GREEN,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: 40,
    includeFontPadding: false
  }
});

class Bills extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      spinner: false
    };
  }

  componentWillMount() {
    const { isFriend, id } = this.props.navigation.state.params;
    const { currentUser } = this.props;
    setSpinner(this);
    if (isFriend) {
      getFriendsBills(currentUser, id).then(response => {
        removeSpinner(this);
        if (response.success) {
          this.setState({ bills: response.data });
        }
      });
    } else {
      getGroupsBills(currentUser, id).then(response => {
        removeSpinner(this);
        if (response.success) {
          this.setState({ bills: response.data });
        }
      });
    }
  }

  onGroupSettingsClick() {
    const { isFriend } = this.props.navigation.state.params;
    const { dispatch } = this.props.navigation;
    if (!isFriend) {
      return navigateToScreen({
        routeName: 'GroupSettings',
        params: this.props.navigation.state.params,
        dispatch
      });
    }
  }

  goToBillDetails(billDetails) {
    const { dispatch } = this.props.navigation;
    const friends = [];
    billDetails.friends.forEach(mobile => {
      friends.push({ mobile });
    });
    return navigateToScreen({
      routeName: 'BillDetails',
      params: {
        ...billDetails,
        bill_name: billDetails.name,
        added_on: billDetails.addedOn,
        added_by: billDetails.created_by,
        friends
      },
      dispatch
    });
  }

  onSettle() {
    const { dispatch } = this.props.navigation;
    const { isFriend, balance, mobile } = this.props.navigation.state.params;
    if (isFriend) {
      let gets = balance && balance > 0 ? true : false;
      return navigateToScreen({
        routeName: 'Settlement',
        params: {
          amount: balance ? Math.abs(balance).toString() : '0',
          mobile,
          gets
        },
        dispatch
      });
    } else {
      return navigateToScreen({
        routeName: 'SettleUpFriends',
        params: this.props.navigation.state.params,
        dispatch
      });
    }
  }

  onAddBill() {
    const { currentUser } = this.props;
    const { dispatch } = this.props.navigation;
    const { id, isFriend, balance, mobile } = this.props.navigation.state.params;
    if (isFriend) {
      return navigateToScreen({
        routeName: 'NewBill',
        params: { friends: [{ mobile: currentUser.mobile }, { mobile }] },
        dispatch
      });
    } else {
      const { friends } = this.props.navigation.state.params;
      let friendsList = [];
      friends.forEach(friend => {
        friendsList.push({ mobile: friend.id });
      });
      return navigateToScreen({
        routeName: 'NewBill',
        params: { group: id, friends: friendsList },
        dispatch
      });
    }
  }

  renderAddButton() {
    return (
      <TouchableOpacity onPress={() => this.onAddBill()} style={styles.addButton}>
        <View style={styles.addButtonTextContainer}>
          <EDText style={styles.addButtonText}>+</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => this.onSettle()} style={styles.settleButton}>
          <EDText style={styles.settleButtonText}>{I18n.t('settle')}</EDText>
        </TouchableOpacity>
      </View>
    );
  }

  renderSingleBill(billDetails) {
    const { currentUser } = this.props;
    const {
      amount,
      name,
      group,
      paidBy,
      added_on,
      splitType,
      splitByFriends,
      allocatedSplitAmount,
      friendsSplitAmount,
      created_by,
      friends
    } = billDetails;
    const paidByUser =
      paidBy && paidBy[currentUser.mobile] ? Number(paidBy[currentUser.mobile]) : 0;
    const totalAmount = amount ? Number(amount) : 0;
    let splitByUser = 0;
    if (splitType === 'equally') {
      if (splitByFriends.includes(currentUser.mobile)) {
        splitByUser = totalAmount / splitByFriends.length;
      }
    } else {
      switch (splitType) {
        case 'unequally':
          splitByUser =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          break;
        case 'shares':
          const userShares =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          splitByUser = totalAmount * (Number(userShares) / allocatedSplitAmount[splitType]);
          break;
        case 'percentages':
          const userPercentage =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          splitByUser = (totalAmount * Number(userPercentage)) / 100;
          break;
        case 'adjustment':
          const userAdjustment =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          splitByUser =
            (totalAmount - allocatedSplitAmount[splitType]) / friends.length +
            Number(userAdjustment);
        default:
          break;
      }
    }
    splitByUser = Math.round(splitByUser * 10) / 10;
    const userPaidAmount = Math.round((paidByUser - splitByUser) * 10) / 10;
    const text =
      userPaidAmount > 0
        ? '₹' + userPaidAmount + ' Paid'
        : '₹' + Math.abs(userPaidAmount) + ' Borrowed';
    const color = userPaidAmount > 0 ? COLORS.BALANCE_GREEN : COLORS.BALANCE_RED;
    return (
      <TouchableOpacity onPress={() => this.goToBillDetails(billDetails)}>
        <View
          style={{
            ...styles.billButton,
            alignSelf: created_by === currentUser.mobile ? 'flex-end' : 'flex-start'
          }}
        >
          <EDText style={{ fontSize: 22, color }}>{text}</EDText>
          <EDText style={styles.billName}>{'Bill Name : ' + name}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderBills() {
    const { bills } = this.state;
    return (
      <FlatList
        style={{ flex: 1, backgroundColor: COLORS.SEPARATOR_WHITE }}
        data={bills}
        inverted={true}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{ height: 15, width }} />}
        ItemSeparatorComponent={() => <View style={{ height: 15, width }} />}
        ListFooterComponent={() => <View style={{ height: 15, width }} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }, index) => this.renderSingleBill(item, index)}
      />
    );
  }

  render() {
    const { goBack, state } = this.props.navigation;
    const { name, mobile, isFriend } = state.params;
    const rightImage = isFriend ? '' : 'settings';
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <ToolBar
          title={name || mobile}
          leftImage="back"
          onLeft={() => goBack()}
          rightImage={rightImage}
          onRight={() => this.onGroupSettingsClick()}
        />
        {this.renderBills()}
        {this.renderFooter()}
        {this.renderAddButton()}
        {spinner && <Spinner />}
      </View>
    );
  }
}

Bills.propTypes = {
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
)(Bills);
