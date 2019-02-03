/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import EDButton from 'app/components/EDButton';
import EDTextInput from 'app/components/EDTextInput';
import Images from 'app/config/Images';

const { height, width } = Dimensions.get('window');

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      otp: '',
      isOTPReceived: false,
      spinner: false
    };
  }

  onSubmit() {
    const { params } = this.props.navigation.state;
    const { isOTPReceived } = this.state;
    setSpinner(this);
    // TODO API and navigation based on signin or signup and submitting OTP.
    alert('TODO');
    removeSpinner(this);
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
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

  renderOTPInput() {
    const { isOTPReceived } = this.state;
    if (isOTPReceived) {
      return this.renderTextInputField({
        title: 'OTP',
        stateKey: 'otp',
        keyboardType: 'number-pad'
      });
    }
    return null;
  }

  render() {
    const { params } = this.props.navigation.state;
    const { isOTPReceived, spinner } = this.state;
    let title = params && params.isLogin ? 'LOGIN' : 'SIGN UP';
    if (isOTPReceived) {
      title = 'SUBMIT';
    }
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
          <View
            style={{
              flex: 1,
              minHeight: height / 3,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={Images.logo}
              style={{ width: width - 40, marginHorizontal: 20, marginTop: 20 }}
              resizeMode={'contain'}
            />
          </View>
          <View
            style={{
              flex: 1,
              minHeight: height / 3,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {this.renderTextInputField({
              title: 'Mobile',
              stateKey: 'mobile',
              keyboardType: 'number-pad'
            })}
            {this.renderOTPInput()}
          </View>
          <View style={{ flex: 1, minHeight: height / 3, alignItems: 'center' }}>
            <EDButton
              title={title}
              onClick={() => this.onSubmit()}
              buttonStyle={{ width: (2 * width) / 3 }}
            />
          </View>
        </KeyboardAwareScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
