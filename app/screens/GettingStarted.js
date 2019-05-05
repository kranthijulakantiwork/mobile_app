import React, { Component } from 'react';
import { Dimensions, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import { resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  topContainer: { flex: 6, width: (2 * width) / 3 },
  bottomContainer: { flex: 1, width: width - 50, alignItems: 'flex-end', justifyContent: 'center' },
  appLogoAndNameContainer: { flex: 2, alignItems: 'center', justifyContent: 'flex-end' },
  appNameText1: {
    fontSize: 26.3,
    color: '#1da370'
  },
  appNameText2: {
    fontFamily: 'Roboto-Bold',
    color: '#268959'
  },
  letgGetStartedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  welcomeText: {
    fontFamily: 'Roboto-Light',
    fontSize: FONT_SIZES.H1,
    color: '#979797'
  },
  letsGetStartedText: {
    fontFamily: 'Roboto-Light',
    fontSize: FONT_SIZES.H2,
    color: '#979797'
  },
  addFriendAndGroupButtonContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: { alignItems: 'center' },
  billButton: {
    width: (2 * width) / 3,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5.3,
    shadowOpacity: 0.8,
    shadowRadius: 7,
    shadowOffset: { height: 5, width: 1 },
    elevation: 6,
    shadowColor: '#1da370',
    backgroundColor: COLORS.APP_THEME_GREEN
  },
  billButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H20
  },
  buttonDescription: {
    marginTop: 9.9,
    color: '#707070',
    textAlign: 'center',
    fontSize: FONT_SIZES.H4
  },
  groupButton: {
    width: (2 * width) / 3,
    marginTop: 30,
    height: 44,
    borderRadius: 5.3,
    backgroundColor: COLORS.WHITE,
    shadowOffset: { height: 1, width: 1 },
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOpacity: 0.8,
    shadowColor: '#e2e2e2'
  },
  groupButtonText: {
    color: COLORS.BILL_DETAILS_BLACK,
    fontSize: FONT_SIZES.H20
  },
  skipButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    backgroundColor: COLORS.TEXT_LIGHT_GRAY
  },
  skipButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2
  }
});

export default class GettingStarted extends Component {
  static navigationOptions = {
    header: null
  };

  onAddBill() {
    const { dispatch } = this.props.navigation;
    return resetAndGoToScreen({ routeName: 'NewBill', dispatch });
  }

  onAddGroup() {
    const { dispatch } = this.props.navigation;
    return resetAndGoToScreen({ routeName: 'CreateGroup', dispatch });
  }

  onSkip() {
    const { dispatch } = this.props.navigation;
    return resetAndGoToScreen({ routeName: 'Tabs', dispatch });
  }

  renderSkiButton() {
    return (
      <TouchableOpacity onPress={() => this.onSkip()} style={styles.skipButton}>
        <EDText style={styles.skipButtonText}>{I18n.t('skip')}</EDText>
      </TouchableOpacity>
    );
  }

  renderGroupButtonAndText() {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => this.onAddGroup()} style={styles.groupButton}>
          <EDText style={styles.groupButtonText}>{I18n.t('create_group')}</EDText>
        </TouchableOpacity>
        <EDText style={styles.buttonDescription}>{I18n.t('create_group_description')}</EDText>
      </View>
    );
  }

  renderBillButtonAndText() {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => this.onAddBill()} style={styles.billButton}>
          <EDText style={styles.billButtonText}>{I18n.t('add_bill')}</EDText>
        </TouchableOpacity>
        <EDText style={styles.buttonDescription}>{I18n.t('add_bill_description')}</EDText>
      </View>
    );
  }

  renderAddBillAndGroupButtons() {
    return (
      <View style={styles.addFriendAndGroupButtonContainer}>
        {this.renderBillButtonAndText()}
        {this.renderGroupButtonAndText()}
      </View>
    );
  }

  renderletsGetStartedText() {
    return (
      <View style={styles.letgGetStartedContainer}>
        <EDText style={styles.welcomeText}>{I18n.t('welcome')}</EDText>
        <EDText style={styles.letsGetStartedText}>{I18n.t('lets_get_started')}</EDText>
      </View>
    );
  }

  renderAppIconAndAppName() {
    return (
      <View style={styles.appLogoAndNameContainer}>
        <Image source={Images.logo} />
        <EDText style={styles.appNameText1}>
          {I18n.t('settle')}
          <EDText style={styles.appNameText2}>{I18n.t('mint')}</EDText>
        </EDText>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          {this.renderAppIconAndAppName()}
          {this.renderletsGetStartedText()}
          {this.renderAddBillAndGroupButtons()}
        </View>
        <View style={styles.bottomContainer}>{this.renderSkiButton()}</View>
      </View>
    );
  }
}
