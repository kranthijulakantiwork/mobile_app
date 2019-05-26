import React, { Component, PropTypes } from 'react';
import {
  KeyboardAvoidingView,
  BackHandler,
  LayoutAnimation,
  Platform,
  DeviceEventEmitter,
  StyleSheet,
  UIManager
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getGroupsAndFriends } from 'app/reducers/groups/Actions';
import { Image, View } from 'react-native-animatable';
import { login } from 'app/api/User';
import { realm, User } from 'app/models/schema';
import { setUser } from '../../reducers/user/Actions';
import imgLogo from '../../assets/logo.png';
import LoginForm from './LoginForm';
import metrics from '../../config/metrics';
import Opening from './Opening';
import OTPForm from './OTPForm';
import SignupForm from './SignupForm';

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.8;

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true);

/**
 * The authentication screen.
 * It shows three different sub-screens:
 * - The opening screen, with the two buttons that redirect to the login/signup forms (if this.state.visibleForm === null)
 * - The signup form (if this.state.visibleForm === 'SIGNUP')
 * - The login form (if this.state.visibleForm === 'LOGIN')
 *
 * The app state (isLoggedIn, isLoading) and the login/signup functions are received as props from src.app.js
 *
 * The animations are delegated to:
 * - react-native-animatable: for the simpler animations of the components (in e.g. bounceIn animation of the logo)
 * - react-native's LayoutAnimation: for the form show/hide animation
 * - react-native's KeyboardAvoidingView: for applying a bottom padding when a keyboard show-up is detected
 *
 * An example of this screen animation flow is the following:
 * - The user opens the app.
 * - The logo shows up using the bounceIn animation of react-native-animatable, while the "Opening" subscreen animates the button
 *   using the fadeIn animation of react-native-animatable.
 * - The user taps on the "Create account" button.
 * - _setVisibleForm gets called with the 'SIGNUP' parameter. It configures the next animation and sets this.state.visibleForm to 'SIGNUP'.
 *   The state change triggers a render and the change of formStyle gets animated (thanks to the animation configuration previously
 *   applied by _setVisibleForm).
 * - Just after the signup form has become visible it animates the form button using the bounceIn animation of react-native-animatable.
 * - The user fills up its info and signup succesfully.
 * - componentWillUpdate checks the isLoggedIn props and after realizing that the user has just authenticated it calls _hideAuthScreen.
 *   _hideAuthScreen then 1. calls the SignupForm.hideForm(), that hides the form buttons (zoomOut) and the form itself (fadeOut),
 *   2. fadeOut the logo, 3. tells the container that the login animation has completed and that the app is ready to show the next screen (HomeScreen).
 */
class AuthScreen extends Component {
  // static propTypes = {
  //   isLoggedIn: PropTypes.bool.isRequired,
  //   isLoading: PropTypes.bool.isRequired,
  //   signup: PropTypes.func.isRequired,
  //   login: PropTypes.func.isRequired,
  //   onLoginAnimationCompleted: PropTypes.func.isRequired // Called at the end of a succesfull login/signup animation
  // }
  constructor(props) {
    super(props);
    this.state = {
      visibleForm: null, // Can be: null | SIGNUP | LOGIN | OTP
      processType: 'SIGNUP' // Can be: SIGNUP | LOGIN
    };
    this.backPressSubscriptions = new Set();
    this.phone = '';
  }

  componentDidMount() {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      let invokeDefault = true;
      const subscriptions = [];

      this.backPressSubscriptions.forEach(sub => subscriptions.push(sub));

      for (let i = 0; i < subscriptions.reverse().length; i += 1) {
        if (subscriptions[i]()) {
          invokeDefault = false;
          break;
        }
      }

      if (invokeDefault) {
        BackHandler.exitApp();
      }
    });

    this.backPressSubscriptions.add(this.handleHardwareBack);
  }

  signup() {
    //TODO update or create user as per api response
    login(this.phone, this.formRefOtp.state.otp)
      .then(response => {
        response.data.mobile = response.data.phone;
        let current_user = realm
          .objects('User')
          .filtered('auth_key=$0', response.data.auth_key.toString())[0];
        if (current_user) {
          current_user.update(response.data);
        } else {
          current_user = User.create(response.data);
        }
        this.props.setUser(current_user);
        this.props.getGroupsAndFriends(current_user);
        let routeName = response.data.signup ? 'UpiLinking' : 'Tabs';
        this.props.navigation.navigate({
          routeName: routeName
        });
      })
      .catch(err => {});
  }

  componentWillUnmount = () => {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    this.backPressSubscriptions.clear();
  };

  handleHardwareBack = () => {
    if (this.state.visibleForm === 'OTP') {
      this.setState({ visibleForm: this.state.processType });
      return true;
    }
    return false;
  };

  componentWillUpdate(nextProps) {
    // If the user has logged/signed up succesfully start the hide animation
    // if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
    //   this._hideAuthScreen()
    // }
  }

  _hideAuthScreen = async () => {
    // 1. Slide out the form container
    await this._setVisibleForm(null);
    // 2. Fade out the logo
    await this.logoImgRef.fadeOut(800);
    // 3. Tell the container (app.js) that the animation has completed
    this.props.onLoginAnimationCompleted();
  };

  _setVisibleForm = async visibleForm => {
    let processType = this.state.visibleForm;
    // 1. Hide the current form (if any)
    if (this.state.visibleForm && this.formRef && this.formRef.hideForm) {
      if (this.state.visibleForm === 'OTP') {
        await this.formRefOtp.hideForm();
      } else {
        await this.formRef.hideForm();
      }
    }
    // 2. Configure a spring animation for the next step
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    // 3. Set the new visible form
    if (this.formRef) {
      this.phone = this.formRef.state.phone;
    }
    this.setState({ visibleForm, processType });
  };

  render() {
    const { isLoggedIn, isLoading, signup, login } = this.props;
    const { visibleForm, processType } = this.state;
    // The following style is responsible of the "bounce-up from bottom" animation of the form
    const formStyle = !visibleForm ? { height: 0 } : { marginTop: 40 };
    return (
      <View style={styles.container}>
        <Image
          animation={'bounceIn'}
          duration={1200}
          delay={200}
          ref={ref => (this.logoImgRef = ref)}
          style={styles.logoImg}
          source={imgLogo}
        />
        {!visibleForm && !isLoggedIn && (
          <Opening
            // onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
            onSignInPress={() => this._setVisibleForm('LOGIN')}
          />
        )}
        <KeyboardAvoidingView
          keyboardVerticalOffset={-100}
          behavior={'padding'}
          style={[formStyle, styles.bottom]}
        >
          {visibleForm === 'SIGNUP' && (
            <SignupForm
              ref={ref => (this.formRef = ref)}
              onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
              phone={this.phone}
              onSignupPress={() => this._setVisibleForm('OTP')}
              isLoading={isLoading}
            />
          )}
          {visibleForm === 'OTP' && (
            <OTPForm
              ref={ref => (this.formRefOtp = ref)}
              onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
              onOTPPress={() => this.signup()}
              processType={processType}
              phone={this.phone}
              isLoading={isLoading}
            />
          )}
          {visibleForm === 'LOGIN' && (
            <LoginForm
              ref={ref => (this.formRef = ref)}
              onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
              onLoginPress={() => this._setVisibleForm('OTP')}
              phone={this.phone}
              isLoading={isLoading}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: metrics.DEVICE_WIDTH,
    height: metrics.DEVICE_HEIGHT,
    paddingTop: 24,
    backgroundColor: '#D2DCDB' // #0D4946
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: 30
  },
  bottom: {
    backgroundColor: '#068679'
  }
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getGroupsAndFriends, setUser }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);
