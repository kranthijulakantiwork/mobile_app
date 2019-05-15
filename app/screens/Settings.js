import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import EDTextInput from 'app/components/EDTextInput';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';


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
    // header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      upi_address: '',
      email: ''
    }
  }

  onChangeText(stateKey, text) {
    this.setState({ [stateKey]: text });
  }

  onEdit() {
    alert('edit')
  }
  renderEditableFiled(stateKey, icon, keyboardType = 'default') {
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
              value={this.state[stateKey]}
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
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, margin: 30, flexDirection: 'row', justifyContent: "space-around" }}>
          <EDText>
            {'Logout'}
          </EDText>
          <EDText>
            {'Contact us'}
          </EDText>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: '20%' }}>
          {this.renderEditableFiled('name', 'name')}
          {this.renderEditableFiled('phone', 'phone', 'phone-pad')}
          {this.renderEditableFiled('upi_address', 'wallet_43')}
          {this.renderEditableFiled('email', 'email', 'email-address')}
        </View>
        <View style={{
          backgroundColor: 'white', borderRadius: 5, shadowColor: '#000', justifyContent: 'center',
          shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 2, elevation: 5,
          alignItems: 'center', width: '25%', height: '20%'
        }}>
          <TouchableOpacity style={{ justifyContent: "center", alignSelf: 'center' }}>
            <Image source={Images.translate} style={{ alignItems: 'center' }} />
            <EDText>{I18n.t('language')}</EDText>
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>


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
