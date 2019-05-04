import React, { Component, PropTypes } from 'react'
import { StyleSheet, AppState } from 'react-native'
import { Text, View } from 'react-native-animatable'
import { sendOtp } from 'app/api/User';
import CustomButton from '../../components/auth/CustomButton'
import CustomTextInput from '../../components/auth/CustomTextInput'
import metrics from '../../config/metrics'

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
      otp: '',
      time_for_otp: '',
      otp_recieved_time: 0,
      appState: AppState.currentState,
      wait_time: 0,
    }
  }
  
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.requesOtp();
    
  }

  requesOtp() {
    // sendOtp(this.formRef.state.phone)
    // .then((response) => {
    //   this.setState({wait_time: 30, time_for_otp: 30, otp_recieved_time: Math.floor(Date.now() / 1000)}, () =>{
    //     this.interval = setInterval(this.otp_resend_timer.bind(this), 1000)
    //   })
    // })
    // .catch((error) => {

    // })
  }
  otp_resend_timer() {
    var seconds = this.state.wait_time -1;
    this.setState({wait_time: seconds});
    if (seconds <= 0) {
      clearInterval(this.interval);
    }
  }

  componentWillUnMount(){
    clearInterval(this.interval);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  presentTime(){
    return(
      this.state.time_for_otp - (Math.floor(Date.now() / 1000) - this.state.otp_recieved_time)
    )
  }


  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({wait_time: this.presentTime() <=0 ? 0 : this.presentTime()})
      if (this.state.wait_time <= 0) {
        clearInterval(this.interval);
      }
    }
    this.setState({appState: nextAppState});
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

  resendOtp() {
    this.requesOtp();
  }

  renderMinutes(time) {
    var minutes = Math.floor(time / 60)
    var seconds = time - (minutes * 60)
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds
  }

  render () {
    const { otp } = this.state
    const { isLoading, processType, onLoginLinkPress, onOTPPress } = this.props
    const isValid = otp !== ''
    const customButtonText = (processType === 'LOGIN') ? 'LOGIN' : 'Create Account'
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => this.formRef = ref}>
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
            ref={(ref) => this.phoneInputRef = ref}
            placeholder={'Enter 6 digit OTP'}
            editable={!isLoading}
            returnKeyType={'done'}
            secureTextEntry={true}
            withRef={true}
            onChangeText={(value) => this.setState({ otp: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          
          {(this.state.wait_time) ? <Text
            // ref={(ref) => this.linkRef = ref}
            style={styles.loginLink}
            // onPress={() => this.resendOtp()}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {this.renderMinutes(this.state.wait_time)}
          </Text>:  <Text
            // ref={(ref) => this.linkRef = ref}
            style={styles.loginLink}
            onPress={() => this.resendOtp()}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Resend'}
          </Text>}
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => onOTPPress(otp)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.createAccountButton}
              textStyle={styles.createAccountButtonText}
              text={customButtonText}
            />
          </View>
          {/* <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Already have an account?'}
          </Text> */}
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
    justifyContent: 'center'
  },
  createAccountButton: {
    backgroundColor: 'white',
    marginBottom: 10
  },
  createAccountButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  loginLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
    // textDecorationLine: 'underline'
  },
  waitTime: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
  }
})
