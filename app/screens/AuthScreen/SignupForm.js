import React, { Component, PropTypes } from "react"
import { StyleSheet } from "react-native"
import { Text, View } from "react-native-animatable"

import CustomButton from "../../components/auth/CustomButton"
import CustomTextInput from "../../components/auth/CustomTextInput"
import metrics from "../../config/metrics"

export default class SignupForm extends Component {
  // static propTypes = {
  //   isLoading: PropTypes.bool.isRequired,
  //   onSignupPress: PropTypes.func.isRequired,
  //   onLoginLinkPress: PropTypes.func.isRequired
  // }
  constructor(props) {
    super(props);
    this.state = {
      // email: '',
      // password: '',
      // fullName: '',
      phone: this.props.phone || ''
    }
    
  }

  

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  }

  render() {
    const { phone } = this.state
    const { isLoading, onLoginLinkPress, onSignupPress } = this.props
    const isValid = phone !== ""
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={ref => (this.formRef = ref)}>
          {/*
          <CustomTextInput
            ref={(ref) => this.mobileInputRef = ref}
            placeholder={'Full name'}
            editable={!isLoading}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.emailInputRef.focus()}
            onChangeText={(value) => this.setState({ fullName: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            ref={(ref) => this.emailInputRef = ref}
            placeholder={'Email'}
            keyboardType={'email-address'}
            editable={!isLoading}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={(value) => this.setState({ email: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            ref={(ref) => this.passwordInputRef = ref}
            placeholder={'Password'}
            editable={!isLoading}
            returnKeyType={'done'}
            secureTextEntry={true}
            withRef={true}
            onChangeText={(value) => this.setState({ password: value })}
            isEnabled={!isLoading}
          />
        */}
          <CustomTextInput
            ref={ref => (this.phoneInputRef = ref)}
            placeholder={"Phone Number"}
            editable={!isLoading}
            returnKeyType={"done"}
            secureTextEntry={false}
            value={this.state.phone}
            withRef={true}
            onChangeText={value => this.setState({ phone: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          <View
            ref={ref => (this.buttonRef = ref)}
            animation={"bounceIn"}
            duration={600}
            delay={400}
          >
            <CustomButton
              onPress={() => onSignupPress(phone)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.createAccountButton}
              textStyle={styles.createAccountButtonText}
              text={"Procced"}
            />
          </View>
          <Text
            ref={ref => (this.linkRef = ref)}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={"fadeIn"}
            duration={600}
            delay={400}
          >
            {"Already have an account?"}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: "center"
  },
  createAccountButton: {
    backgroundColor: "white"
  },
  createAccountButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  loginLink: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "center",
    padding: 20
  }
})
