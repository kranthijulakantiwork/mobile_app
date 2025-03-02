import React, { Component } from 'react';
import { Dimensions, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { getGroupsAndFriends } from 'app/reducers/groups/Actions';
import { getUPIAddress } from 'app/api/Friends';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { recordSettlement } from 'app/api/Settlement';
import { resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import AbsoluteView from 'app/components/AbsoluteView';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import RNUpiPayment from 'react-native-upi-payment';
import showToast from 'app/helpers/Toast';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fefefe' },
  imagesContainer: {
    height: height / 6,
    width: (3 * width) / 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  elevatedImageContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
    elevation: 15
  },
  buttonsContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  payThroughUPIButton: {
    width: (2 * width) / 3,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5.3,
    margin: 10,
    shadowOpacity: 0.8,
    shadowRadius: 7,
    shadowOffset: { height: 5, width: 1 },
    elevation: 6,
    shadowColor: '#1da370',
    backgroundColor: COLORS.APP_THEME_GREEN
  },
  payThroughUPIButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H20
  },
  recordSettlementButton: {
    width: (2 * width) / 3,
    height: 44,
    margin: 10,
    borderRadius: 5.3,
    backgroundColor: COLORS.WHITE,
    shadowOffset: { height: 1, width: 1 },
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOpacity: 0.8,
    shadowColor: '#e2e2e2'
  },
  recordSettlementButtonText: {
    color: COLORS.BILL_DETAILS_BLACK,
    fontSize: FONT_SIZES.H20
  }
});

class Settlement extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    const { amount, mobile } = this.props.navigation.state.params;
    const { contacts } = this.props;
    const friendObject = contacts.filter(contact => contact.mobile == mobile)[0];
    name = friendObject && friendObject.name ? friendObject.name : mobile;
    this.state = {
      amount,
      upiId: '',
      name,
      transactionNote: 'SettleMint',
      showInput: false
    };
  }

  componentWillMount() {
    const { currentUser } = this.props;
    const { mobile } = this.props.navigation.state.params;
    getUPIAddress(currentUser, mobile).then(response => {
      if (response.success) {
        this.setState({ upiId: response.data.upi || '' });
      }
    });
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onDone(e) {
    if (e['Status'] === 'SUCCESS' && e['responseCode'] === '00') {
      const { txnRef, txnId } = e;
      const { amount } = this.state;
      const { mobile, gets, key } = this.props.navigation.state.params;
      const { currentUser, getGroupsAndFriends } = this.props;
      const paidBy = gets ? mobile : currentUser.mobile;
      const paidTo = gets ? currentUser.mobile : mobile;
      recordSettlement(currentUser, { paidBy, paidTo, amount, txnRef, txnId }).then(response => {
        if (response.success) {
          getGroupsAndFriends();
          showToast({ message: response.data.status });
          this.props.navigation.pop(key);
        }
      });
    }
  }

  onPayThroughUPI() {
    dismissKeyboard();
    const { upiId } = this.state;
    if (upiId) {
      this.setState({ showInput: false });
      const { name, transactionNote, amount } = this.state;
      if (!upiId) return alert('Please enter UPI ID.');
      if (!amount) return alert('Please enter Amount.');
      RNUpiPayment.initializePayment(
        {
          vpa: upiId,
          payeeName: name,
          amount,
          transactionNote,
          transactionRef: 'Settle Up with ' + name
        },
        e => this.onDone(e),
        e => this.onDone(e)
      );
    } else {
      this.setState({ showInput: true });
    }
  }

  onRecordSettlement() {
    // TODO API integration
    dismissKeyboard();
    const { amount } = this.state;
    if (!amount) return null;
    const { mobile, gets, key } = this.props.navigation.state.params;
    const { currentUser, getGroupsAndFriends } = this.props;
    const paidBy = gets ? mobile : currentUser.mobile;
    const paidTo = gets ? currentUser.mobile : mobile;
    recordSettlement(currentUser, { paidBy, paidTo, amount }).then(response => {
      if (response.success) {
        getGroupsAndFriends();
        showToast({ message: response.data.status });
        this.props.navigation.pop(key);
      }
    });
  }

  onDialogClose() {
    this.setState({ showInput: false });
  }

  renderUPIIdInput() {
    const { showInput } = this.state;
    if (showInput) {
      return (
        <AbsoluteView
          onDialogClose={() => this.onDialogClose()}
          outerContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 50,
              paddingHorizontal: 30,
              paddingVertical: 15,
              marginBottom: 70
            }}
          >
            <EDTextInput
              placeholder={I18n.t('upi_address')}
              textInputStyle={{
                alignSelf: 'center',
                width: width - 160,
                borderBottomWidth: 0,
                marginBottom: 0
              }}
              containerStyle={{
                marginHorizontal: 0,
                padding: 0,
                marginVertical: 0
              }}
              value={this.state['upiId']}
              onChangeText={text => this.onChangeText('upiId', text)}
            />
            {this.renderPayThroughUPIButton()}
          </View>
        </AbsoluteView>
      );
    }
    return null;
  }

  renderPayThroughUPIButton() {
    return (
      <TouchableOpacity onPress={() => this.onPayThroughUPI()} style={styles.payThroughUPIButton}>
        <EDText style={styles.payThroughUPIButtonText}>{I18n.t('pay_through_upi')}</EDText>
      </TouchableOpacity>
    );
  }

  renderRecordSettlementButton() {
    return (
      <TouchableOpacity
        onPress={() => this.onRecordSettlement()}
        style={styles.recordSettlementButton}
      >
        <EDText style={styles.recordSettlementButtonText}>{I18n.t('record_settlement')}</EDText>
      </TouchableOpacity>
    );
  }

  renderAddBillAndrecordSettlementButtons() {
    const { gets } = this.props.navigation.state.params;
    const showUPI = !gets ? true : false;
    return (
      <View style={styles.buttonsContainer}>
        {this.renderRecordSettlementButton()}
        {showUPI && this.renderPayThroughUPIButton()}
      </View>
    );
  }

  renderTextInput() {
    const { amount } = this.state;
    return (
      <View
        style={{
          backgroundColor: 'lightgray',
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: width / 2
        }}
      >
        <EDText
          style={{
            color: COLORS.APP_THEME_GREEN,
            marginRight: 10,
            fontFamily: 'Roboto-Medium',
            fontSize: 26
          }}
        >
          ₹
        </EDText>
        <TextInput
          style={{
            paddingVertical: 10,
            color: COLORS.APP_THEME_GREEN,
            fontSize: 47,
            fontFamily: 'Roboto-Medium'
          }}
          onChangeText={text => this.onChangeText('amount', text)}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          value={amount}
        />
      </View>
    );
  }

  renderPayingText() {
    const { gets } = this.props.navigation.state.params;
    const { name } = this.state;
    const text = gets
      ? `${name} ${I18n.t('is_paying_you')}`
      : I18n.t('you_are_paying', { payeeName: name });
    return (
      <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4, marginVertical: 10 }}>
        {text}
      </EDText>
    );
  }

  renderElevatedImage(imageSource) {
    return (
      <View style={styles.elevatedImageContainer}>
        <Image source={imageSource} />
      </View>
    );
  }

  renderImages() {
    return (
      <View style={styles.imagesContainer}>
        {this.renderElevatedImage(Images.paid_by)}
        <Image source={Images.green_arrow} />
        {this.renderElevatedImage(Images.payee)}
      </View>
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ToolBar title={I18n.t('settlement')} leftImage="back" onLeft={() => goBack()} />
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        >
          {this.renderImages()}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {this.renderPayingText()}
            {this.renderTextInput()}
          </View>
          <View style={{ height: height / 10 }} />
          {this.renderAddBillAndrecordSettlementButtons()}
        </KeyboardAwareScrollView>
        {this.renderUPIIdInput()}
      </View>
    );
  }
}

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
)(Settlement);
