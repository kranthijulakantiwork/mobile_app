import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FONT_SIZES } from 'app/config/ENV';
import { getUserInfo, logOut, updateUserInfo } from 'app/api/User';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, color: COLORS.WHITE },
  scrollViewContainer: { flex: 1, marginHorizontal: 50 },
  imageContainer: {
    height: height / 3.5,
    justifyContent: 'flex-end'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height / 7,
    justifyContent: 'center'
  },
  title: { color: '#979797', fontSize: FONT_SIZES.H2 },
  textInputOuterContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  textInputInnerContainer: {
    // flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.TEXT_BLACK,
    marginLeft: 20
  },
  linkButton: {
    marginHorizontal: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.APP_THEME_GREEN,
    borderRadius: 5,
    elevation: 3,
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.8,
    shadowColor: COLORS.APP_THEME_GREEN
  },
  linkButtonText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H1 },
  linkingDescription: { color: '#979797', fontSize: FONT_SIZES.H4, paddingVertical: 15 },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipButtonText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H2 }
});

class Settings extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    let { name, mobile, upi_address, email } = this.props.currentUser;
    this.state = {
      name: name || '',
      phone: mobile || '',
      upi_address: upi_address || '',
      email: email || '',
      spinner: true
    };
  }

  componentWillMount() {
    let { currentUser } = this.props;
    getUserInfo(currentUser.auth_key)
      .then(response => {
        if (response.success) {
          response.mobile = response.phone;
          response.upi_address = response.upi;
          currentUser.update(response);
          let { name, phone, upi_address, email } = response;
          this.setState({
            name,
            phone,
            upi_address,
            email
          });
        }
        this.setState({ spinner: false });
      })
      .catch(err => {
        this.setState({ spinner: false });
      });
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onSave() {
    dismissKeyboard();
    let { currentUser } = this.props;
    this.setState({ spinner: true });
    updateUserInfo({ ...this.state, upi: this.state.upi_address }, currentUser.auth_key)
      .then(response => {
        if (response.success) {
          currentUser.update(this.state);
        }
        this.setState({ spinner: false });
      })
      .catch(err => {
        this.setState({ spinner: false });
      });
  }

  logOut() {
    dismissKeyboard();
    let { currentUser } = this.props;
    logOut(currentUser)
      .then(response => {
        if (response.success) {
          return resetAndGoToScreen({ routeName: 'AuthScreen', dispatch });
        }
      })
      .catch(err => {});
  }

  renderEditableFiled(stateKey, icon, editable, keyboardType = 'default') {
    return (
      <View style={styles.textInputOuterContainer}>
        <Image source={Images[icon]} style={{ marginTop: '5%' }} />
        <View style={styles.textInputInnerContainer}>
          <View style={{ flexDirection: 'row' }}>
            <EDTextInput
              placeholder={I18n.t(stateKey)}
              textInputStyle={{
                width: width - 160,
                borderBottomWidth: 0,
                marginBottom: 5,
                height: 30
              }}
              containerStyle={{
                marginHorizontal: 0,
                padding: 0,
                marginVertical: 0
              }}
              title={I18n.t(stateKey)}
              value={this.state[stateKey] || ''}
              editable={editable}
              keyboardType={keyboardType}
              onChangeText={text => this.onChangeText(stateKey, text)}
            />
            {/* <Image source={Images.pencil}/>   */}
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    const { spinner } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'}>
          <ToolBar
            title={I18n.t('settings')}
            leftImage="back"
            onLeft={() => goBack()}
            rightImage="tick"
            onRight={() => this.onSave()}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              height: height / 2,
              maxHeight: height / 2
            }}
          >
            {this.renderEditableFiled('name', 'name', true)}
            {this.renderEditableFiled('phone', 'phone', false, 'phone-pad')}
            {this.renderEditableFiled('upi_address', 'wallet_43', true)}
            {this.renderEditableFiled('email', 'email', true, 'email-address')}
          </View>
          <View
            style={{
              height: height / 2 - 100,
              justifyContent: 'flex-end',
              padding: 15,
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={{ backgroundColor: '#1da370' }}
              onPress={() => {
                this.logOut();
              }}
            >
              <EDText style={{ padding: 10, color: '#ffffff' }}>{I18n.t('logout')}</EDText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

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
)(Settings);
