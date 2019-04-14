/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import dismissKeyboard from 'dismissKeyboard';
import EDButton from 'app/components/EDButton';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import Images from 'app/config/Images';
import RNUpiPayment from 'react-native-upi-payment';

const { height, width } = Dimensions.get('window');

export default class Payment extends Component {
  static navigationOptions = {
    title: 'Payment'
    // headerLeft:
  };

  constructor(props) {
    super(props);
    this.state = {
      upiId: '',
      name: '',
      transactionNote: '',
      amount: '',
      response: '',
      spinner: false
    };
  }

  onDone(response) {
    this.setState({ response: JSON.stringify(response) });
  }

  onSubmit() {
    dismissKeyboard();
    const { upiId, name, transactionNote, amount } = this.state;
    if (!upiId) return alert('Please enter UPI ID.');
    if (!amount) return alert('Please enter Amount.');
    RNUpiPayment.initializePayment(
      {
        vpa: upiId,
        payeeName: name,
        amount,
        transactionNote,
        transactionRef: 'aasf-332-aoei-fn'
      },
      e => this.onDone(e),
      e => this.onDone(e)
    );
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  renderSubmit() {
    return (
      <View
        style={{ flex: 1, minHeight: height / 3, alignItems: 'center', justifyContent: 'center' }}
      >
        <EDButton
          title={'Proceed'}
          onClick={() => this.onSubmit()}
          buttonStyle={{ width: (2 * width) / 3 }}
        />
      </View>
    );
  }

  renderTextInputField({
    title,
    placeholder = title,
    stateKey,
    keyboardType = 'default',
    secureTextEntry = false
  }) {
    return (
      <View>
        <EDTextInput
          title={title}
          placeholder={placeholder}
          value={this.state[stateKey]}
          onChangeText={text => this.onChangeText(stateKey, text)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    );
  }

  renderFields() {
    return (
      <View
        style={{
          flex: 1,
          minHeight: height / 3,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {this.renderTextInputField({
          title: 'NAME',
          stateKey: 'name'
        })}
        {this.renderTextInputField({
          title: 'RECEIVER UPI ID',
          stateKey: 'upiId'
        })}
        {this.renderTextInputField({
          title: 'TRANSACTION NOTE',
          stateKey: 'transactionNote'
        })}
        {this.renderTextInputField({
          title: 'AMOUNT IN INR',
          stateKey: 'amount',
          keyboardType: 'number-pad'
        })}
      </View>
    );
  }

  render() {
    const { spinner, response } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: COLORS.WHITE }}
          keyboardShouldPersistTaps={'always'}
        >
          <EDText
            style={{
              color: COLORS.APP_THEME_BLUE,
              fontSize: 24,
              textAlign: 'center',
              paddingVertical: 80
            }}
          >
            Enter Payee Details
          </EDText>
          {this.renderFields()}
          <EDText
            style={{
              color: COLORS.TEXT_GRAY,
              fontSize: 14,
              textAlign: 'center',
              paddingVertical: 10
            }}
          >
            {response}
          </EDText>
          {this.renderSubmit()}
        </KeyboardAwareScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}
