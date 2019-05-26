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
  container: { flex: 1 }
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
      bills: []
    };
  }

  componentWillMount() {
    const { isFriend, id } = this.props.navigation.state.params;
    const { currentUser } = this.props;
    if (isFriend) {
      getFriendsBills(currentUser, id).then(response => {
        if (response.success) {
          this.setState({ bills: response.data });
        }
      });
    } else {
      getGroupsBills(currentUser, id).then(response => {
        if (response.success) {
          this.setState({ bills: response.data });
        }
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
        friends
      },
      dispatch
    });
  }

  renderFooter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.SEPARATOR_WHITE
        }}
      >
        <TouchableOpacity
          onPress={() => alert('TODO')}
          style={{ backgroundColor: '#13b4f0', borderRadius: 25, marginVertical: 10 }}
        >
          <EDText
            style={{
              color: COLORS.WHITE,
              fontSize: FONT_SIZES.H1,
              textAlign: 'center',
              paddingHorizontal: 15,
              paddingVertical: 10
            }}
          >
            {'SETTLE UP'}
          </EDText>
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
    const paidByUser = paidBy && paidBy[currentUser.mobile] ? paidBy[currentUser.mobile] : 0;
    let splitByUser = 0;
    if (splitType === 'equally') {
      if (splitByFriends.includes(currentUser.mobile)) {
        splitByUser = amount / splitByFriends.length;
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
          splitByUser = amount * (userShares / allocatedSplitAmount[splitType]);
          break;
        case 'percentages':
          const userPercentage =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          splitByUser = (amount * userPercentage) / 100;
          break;
        case 'adjustment':
          const userAdjustment =
            friendsSplitAmount[splitType] && friendsSplitAmount[splitType][currentUser.mobile]
              ? friendsSplitAmount[splitType][currentUser.mobile]
              : 0;
          splitByUser =
            (amount - allocatedSplitAmount[splitType]) / friends.length + userAdjustment;
        default:
          break;
      }
    }
    splitByUser = Math.round(splitByUser * 10) / 10;
    const userPaidAmount = paidByUser - splitByUser;
    const text =
      userPaidAmount > 0
        ? '₹' + userPaidAmount + ' Paid'
        : '₹' + Math.abs(userPaidAmount) + ' Borrowed';
    const color = userPaidAmount > 0 ? COLORS.BALANCE_GREEN : COLORS.BALANCE_RED;
    return (
      <TouchableOpacity onPress={() => this.goToBillDetails(billDetails)}>
        <View
          style={{
            width: (2 * width) / 3,
            alignSelf: created_by === currentUser.mobile ? 'flex-end' : 'flex-start',
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginHorizontal: 10,
            borderRadius: 15,
            backgroundColor: COLORS.WHITE
          }}
        >
          <EDText style={{ fontSize: 22, color }}>{text}</EDText>
          <EDText style={{ color: COLORS.BILL_DETAILS_BLACK, fontSize: 12, marginTop: 10 }}>
            {'Bill Name : ' + name}
          </EDText>
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
    const { name, mobile } = state.params;
    return (
      <View style={styles.container}>
        <ToolBar title={name || mobile} leftImage="back" onLeft={() => goBack()} />
        {this.renderBills()}
        {this.renderFooter()}
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
