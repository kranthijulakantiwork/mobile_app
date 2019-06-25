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
import { deleteBill } from 'app/api/Bills';
import { FONT_SIZES } from 'app/config/ENV';
import { navigateToScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import showToast from 'app/helpers/Toast';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: { flex: 1, width, alignItems: 'center', paddingVertical: 20 },
  categoryContainer: {
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  statusContainer: {
    width: width - 30,
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10
  },
  statusText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H22 },
  summaryTypeView: {
    flex: 1,
    paddingHorizontal: 30,
    borderRightWidth: 1,
    borderColor: COLORS.BILL_DETAILS_BLACK,
    alignItems: 'center'
  },
  summaryTypeTitleView: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    marginBottom: 10
  },
  deleteButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.BALANCE_RED,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  deleteButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H1,
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});

class BillDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      paidBy: {},
      splitBy: {}
    };
  }

  componentWillMount() {
    const { paidBy } = this.props.navigation.state.params;
    let splitBy = this.getSplitBy();
    this.setState({
      paidBy: Object.assign({}, paidBy),
      splitBy: Object.assign({}, splitBy)
    });
  }

  getSplitBy() {
    const {
      friends,
      splitType,
      splitByFriends,
      friendsSplitAmount,
      allocatedSplitAmount,
      amount
    } = this.props.navigation.state.params;
    let splitBy = {};
    const friendsSplit = friendsSplitAmount[splitType];
    switch (splitType) {
      case 'equally':
        let eachPersonShare = Number(amount) / splitByFriends.length;
        splitByFriends.map(mobile => (splitBy[mobile] = eachPersonShare));
        break;
      case 'unequally':
        splitBy = friendsSplit;
        break;
      case 'shares':
        const eachShareValue = Number(amount) / allocatedSplitAmount[splitType];
        Object.keys(friendsSplit).map(
          mobile => (splitBy[mobile] = Number(friendsSplit[mobile]) * eachShareValue)
        );
        break;
      case 'percentages':
        Object.keys(friendsSplit).map(
          mobile => (splitBy[mobile] = (Number(friendsSplit[mobile]) * Number(amount)) / 100)
        );
        break;
      case 'adjustment':
        eachPersonShare = (amount - allocatedSplitAmount[splitType]) / friends.length;
        friends.map(friend => {
          const mobile = friend.mobile;
          const adjustment = friendsSplit[mobile] ? Number(friendsSplit[mobile]) : 0;
          splitBy[mobile] = eachPersonShare + adjustment;
        });
        break;
      default:
        break;
    }
    return splitBy;
  }

  onDeleteBill() {
    const { currentUser } = this.props;
    const { id } = this.props.navigation.state.params;
    const { popToTop } = this.props.navigation;
    deleteBill(currentUser, id).then(response => {
      if (response.success) {
        response.data.status && showToast({ message: response.data.status });
        popToTop();
      }
    });
  }

  onSubmit() {
    const { currentUser } = this.props;
    const { added_by } = this.props.navigation.state.params;
    if (added_by === currentUser.mobile) {
      const { dispatch } = this.props.navigation;
      navigateToScreen({
        routeName: 'NewBill',
        key: 'NewBillFromBillDetails',
        params: {
          ...this.props.navigation.state.params
        },
        dispatch
      });
    } else alert(I18n.t('only_owner_can_edit_bill'));
  }

  renderText({
    text,
    fontSize = FONT_SIZES.H22,
    color = COLORS.BILL_DETAILS_BLACK,
    fontWeight = 'bold'
  }) {
    return <EDText style={{ fontSize, color, fontWeight, alignSelf: 'center' }}>{text}</EDText>;
  }

  renderDeleteButton() {
    const { currentUser } = this.props;
    const { added_by } = this.props.navigation.state.params;
    if (added_by === currentUser.mobile) {
      return (
        <TouchableOpacity onPress={() => this.onDeleteBill()} style={styles.deleteButton}>
          <EDText style={styles.deleteButtonText}>{I18n.t('delete_bill')}</EDText>
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderSummaryUnderType(title, summary) {
    const { friends } = this.props.navigation.state.params;
    const { currentUser, contacts } = this.props;
    const color = title === 'paid' ? COLORS.BALANCE_GREEN : COLORS.BALANCE_RED;
    return (
      <View style={styles.summaryTypeView}>
        <View style={styles.summaryTypeTitleView}>{this.renderText({ text: I18n.t(title) })}</View>
        <FlatList
          data={Object.keys(summary)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            let friend = friends.filter(friend => friend.mobile == item)[0];
            if (friend.mobile === currentUser.mobile) friend = currentUser;
            let name = friend && friend.name ? friend.name : '';
            if (!name) {
              const friendObject = contacts.filter(contact => contact.mobile == friend.mobile)[0];
              name = friendObject ? friendObject.name : friend.name;
            }
            return (
              <EDText style={{ fontSize: FONT_SIZES.H2, color }}>{`${name} ₹${
                summary[item]
              }`}</EDText>
            );
          }}
        />
      </View>
    );
  }

  renderUserStatus() {
    //  TODO get owed or paid
    const { paidBy, splitBy } = this.state;
    const { currentUser } = this.props;
    const paidByUser = paidBy[currentUser.mobile] ? Number(paidBy[currentUser.mobile]) : 0;
    const splitByUser = splitBy[currentUser.mobile] ? Number(splitBy[currentUser.mobile]) : 0;
    let amount = paidByUser - splitByUser;
    if (!amount) return null;
    amount = Math.round(amount * 10) / 10;
    const colors = amount < 0 ? ['#ff9966', '#ff5e62'] : ['#93f9b9', '#1d976c'];
    const text =
      amount < 0 ? `${I18n.t('you_owe_')} ₹${-1 * amount}` : `${I18n.t('you_get')} ₹${amount}`;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors}
        style={styles.statusContainer}
      >
        <EDText style={styles.statusText}>{text}</EDText>
      </LinearGradient>
    );
  }

  renderBillSummary() {
    const { paidBy, splitBy } = this.state;
    return (
      <View>
        {this.renderUserStatus()}
        <View style={{ flexDirection: 'row' }}>
          {this.renderSummaryUnderType('paid', paidBy)}
          {this.renderSummaryUnderType('owe', splitBy)}
        </View>
      </View>
    );
  }

  renderAddedBy() {
    const { added_by, added_on } = this.props.navigation.state.params;
    const { mobile } = this.props.currentUser;
    const addedBy = mobile === added_by ? I18n.t('you') : added_by;
    return this.renderText({
      text: `${I18n.t('added_by')} ${addedBy} ${I18n.t('on')} ${new Date(added_on)
        .toDateString()
        .substr(4)}`,
      fontSize: FONT_SIZES.H2,
      fontWeight: 'normal'
    });
  }

  renderGroupName() {
    const { group } = this.props.navigation.state.params;
    const { groupsList } = this.props;
    let groupName = '';
    if (group) {
      const groupObject = groupsList.filter(g => g.id === group)[0];
      if (groupObject) groupName = groupObject.name;
    }
    return this.renderText({
      text: `${I18n.t('group')}: ${groupName ? groupName : I18n.t('none')}`,
      fontSize: FONT_SIZES.H2,
      fontWeight: 'normal'
    });
  }

  renderAmount() {
    const { amount } = this.props.navigation.state.params;
    return this.renderText({ text: `₹${amount}` });
  }

  renderBillName() {
    const { bill_name } = this.props.navigation.state.params;
    return this.renderText({ text: bill_name });
  }

  renderCategory() {
    const { category = 'others', colors } = this.props.navigation.state.params;
    return (
      <View style={{ paddingVertical: 15, alignSelf: 'center' }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors || ['#91b8f7', '#3b84f9']}
          style={styles.categoryContainer}
        >
          <Image source={Images[category]} />
        </LinearGradient>
      </View>
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ToolBar
          title={I18n.t('bill_details')}
          leftImage="back"
          onLeft={() => goBack()}
          onRight={() => this.onSubmit()}
          rightImage="edit"
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {this.renderCategory()}
          {this.renderBillName()}
          {this.renderAmount()}
          {this.renderGroupName()}
          {this.renderAddedBy()}
          <View
            style={{
              height: 1,
              width,
              backgroundColor: COLORS.BILL_DETAILS_BLACK,
              marginVertical: 15
            }}
          />
          {this.renderBillSummary()}
          {this.renderDeleteButton()}
        </ScrollView>
      </View>
    );
  }
}

BillDetails.propTypes = {
  navigation: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    groupsList: state.groups.groupsList,
    contacts: state.common.contacts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillDetails);
