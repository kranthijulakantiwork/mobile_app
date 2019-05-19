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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { navigateToScreen } from 'app/helpers/NavigationHelper';
import { realm } from 'app/models/schema';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
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

  onSubmit() {
    // TODO navigate to edit bill
    const { dispatch } = this.props.navigation;
    navigateToScreen({
      routeName: 'NewBill',
      key: 'NewBillFromBillDetails',
      params: {
        ...this.props.navigation.state.params
      },
      dispatch
    });
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
    return (
      <TouchableOpacity onPress={() => alert('TODO')} style={styles.deleteButton}>
        <EDText style={styles.deleteButtonText}>{I18n.t('delete_bill')}</EDText>
      </TouchableOpacity>
    );
  }

  renderSummaryUnderType(title, summary) {
    const { friends } = this.props.navigation.state.params;
    const color = title === 'paid' ? COLORS.BALANCE_GREEN : COLORS.BALANCE_RED;
    return (
      <View style={styles.summaryTypeView}>
        <View style={styles.summaryTypeTitleView}>{this.renderText({ text: I18n.t(title) })}</View>
        <FlatList
          data={Object.keys(summary)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const friend = friends.filter(friend => friend.mobile == item)[0];
            let name = friend ? friend.name : '';
            if (!name) {
              const friendObject = realm.objects('User').filtered('mobile=$0', friend.mobile)[0];
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
    //  TODO remove current user here
    const current_user = { id: 1, mobile: '9866070833' };
    const paidByUser = paidBy[current_user.mobile] ? Number(paidBy[current_user.mobile]) : 0;
    const splitByUser = splitBy[current_user.mobile] ? Number(splitBy[current_user.mobile]) : 0;
    const amount = paidByUser - splitByUser;
    if (!amount) return null;
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
    const { added_by = 'you', added_on } = this.props.navigation.state.params;
    return this.renderText({
      text: `${I18n.t('added_by')} ${added_by} ${I18n.t('on')} ${added_on}`,
      fontSize: FONT_SIZES.H2,
      fontWeight: 'normal'
    });
  }

  renderGroupName() {
    const { group } = this.props.navigation.state.params;
    return this.renderText({
      text: `${I18n.t('group')}: ${group ? group.name : I18n.t('none')}`,
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
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillDetails);
