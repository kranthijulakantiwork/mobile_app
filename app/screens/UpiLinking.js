/* @flow */

import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { navigateToScreen, replaceScreen } from 'app/helpers/NavigationHelper';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import { updateUserInfo } from 'app/api/User';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

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
  textInputOuterContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  textInputInnerContainer: {
    flexDirection: 'row',
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

class UpiLinking extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      upi_address: '',
      confirm_upi_address: '',
      spinner: false
    };
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onLink() {
    dismissKeyboard();
    const { upi_address, confirm_upi_address } = this.state;
    if (upi_address !== confirm_upi_address) return alert(I18n.t('upi_address_mismatch'));
    const { currentUser } = this.props;
    updateUserInfo({ upi: upi_address }, currentUser.auth_key)
      .then(response => {
        if (response.success) {
          currentUser.update(this.state);
          this.onSkip();
        }
      })
      .catch(err => {});
  }

  onSkip() {
    dismissKeyboard();
    const { state, dispatch } = this.props.navigation;
    return replaceScreen({
      routeName: 'GettingStarted',
      currentScreenKey: state.key,
      params,
      dispatch
    });
  }

  renderSkip() {
    return (
      <TouchableOpacity onPress={() => this.onSkip()} style={styles.skipButton}>
        <EDText style={styles.skipButtonText}>{I18n.t('skip')}</EDText>
      </TouchableOpacity>
    );
  }

  renderUPILinkingDescription() {
    return <EDText style={styles.linkingDescription}>{I18n.t('upi_link_description')}</EDText>;
  }

  renderLinkButton() {
    return (
      <TouchableOpacity onPress={() => this.onLink()} style={styles.linkButton}>
        <EDText style={styles.linkButtonText}>{I18n.t('link')}</EDText>
      </TouchableOpacity>
    );
  }

  renderTextInput(stateKey) {
    return (
      <View style={styles.textInputOuterContainer}>
        <Image source={Images.wallet} />
        <View style={styles.textInputInnerContainer}>
          <EDTextInput
            placeholder={I18n.t(stateKey)}
            textInputStyle={{
              width: width - 160,
              borderBottomWidth: 0,
              marginBottom: 15
            }}
            containerStyle={{
              marginHorizontal: 0,
              padding: 0,
              marginVertical: 0
            }}
            value={this.state[stateKey]}
            onChangeText={text => this.onChangeText(stateKey, text)}
          />
        </View>
      </View>
    );
  }

  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <EDText style={styles.title}>{I18n.t('receive_through')}</EDText>
        <Image source={Images.upi_logo} />
      </View>
    );
  }

  renderTransferImage() {
    return (
      <View style={styles.imageContainer}>
        <Image source={Images.upi_link} style={{ alignSelf: 'center' }} />
      </View>
    );
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={'always'}
        >
          {this.renderTransferImage()}
          {this.renderTitle()}
          {this.renderTextInput('upi_address')}
          {this.renderTextInput('confirm_upi_address')}
          {this.renderLinkButton()}
          {this.renderUPILinkingDescription()}
          {this.renderSkip()}
        </KeyboardAwareScrollView>
        {spinner && <Spinner />}
      </View>
    );
  }
}

UpiLinking.propTypes = {
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
)(UpiLinking);
