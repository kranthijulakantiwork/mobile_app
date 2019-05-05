import React, { Component } from 'react';
import { Dimensions, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import RNUpiPayment from 'react-native-upi-payment';
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

export default class Settlement extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: '500'
    };
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onPayThroughUPI() {
    // TODO Take to UPI apps using react-native-upi-payment and api integration
    alert('TODO');
    dismissKeyboard();
    // const { upiId, name, transactionNote, amount } = this.state;
    // if (!upiId) return alert('Please enter UPI ID.');
    // if (!amount) return alert('Please enter Amount.');
    // RNUpiPayment.initializePayment(
    //   {
    //     vpa: upiId,
    //     payeeName: name,
    //     amount,
    //     transactionNote,
    //     transactionRef: 'aasf-332-aoei-fn'
    //   },
    //   e => this.onDone(e),
    //   e => this.onDone(e)
    // );
  }

  onRecordSettlement() {
    // TODO API integration
    alert('TODO');
    dismissKeyboard();
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
    return (
      <View style={styles.buttonsContainer}>
        {this.renderRecordSettlementButton()}
        {this.renderPayThroughUPIButton()}
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
    // TODO
    // const { paidTo } = this.props.navigation.state.params;
    const paidTo = 'Jana Guzman';
    return (
      <EDText style={{ color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4, marginVertical: 10 }}>
        {I18n.t('you_are_paying', { payeeName: paidTo })}
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
      </View>
    );
  }
}
