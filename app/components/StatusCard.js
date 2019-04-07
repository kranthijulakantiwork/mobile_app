/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 100,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: COLORS.WHITE
  },
  statusContainer: { flexDirection: 'row' },
  avatarContainer: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    // marginRight: 10,
    backgroundColor: COLORS.APP_THEME_PURPLE
  },
  avatarText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H2, fontWeight: 'bold' },
  nameContainer: { flex: 2, paddingTop: 5, paddingHorizontal: 15 },
  name: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    color: COLORS.TEXT_BLACK,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.H1
  },
  detailsContainer: {},
  details: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H5 },
  balanceContainer: { flex: 1 },
  balanceText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4, textAlign: 'center' },
  balanceValue: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H2, textAlign: 'center' }
});

export default class StatusCard extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.array,
    balance: PropTypes.string,
    balanceType: PropTypes.string,
    owed: PropTypes.bool,
    mobile: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSummaryDetails(detail, i) {
    let oweText = detail.name + ' ' + I18n.t('owes_you') + ' ';
    let color = COLORS.GREEN;
    if (detail.owed) {
      oweText = I18n.t('you_owe') + ' ' + detail.name + ' ';
      color = COLORS.ORANGE;
    }
    return (
      <EDText style={styles.details} key={i}>
        {oweText}
        <EDText style={{ ...styles.details, color }}>{'₹' + detail.amount}</EDText>
      </EDText>
    );
  }

  renderSummary() {
    const { details, balance } = this.props;
    if (!balance || !details || !details.length) return null;
    let count = 0;
    return (
      <View>
        {details.map((detail, i) => {
          count += 1;
          if (count === 3)
            return (
              <EDText style={styles.details} key={i}>
                {I18n.t('plus_other_balances', { count: details.length - 2 })}
              </EDText>
            );
          if (count > 3) return null;
          return this.renderSummaryDetails(detail, i);
        })}
      </View>
    );
  }

  renderDetails() {
    const { mobile, balanceType } = this.props;
    let summary = mobile;
    return (
      <View style={styles.detailsContainer}>
        {balanceType === 'groups' ? (
          this.renderSummary()
        ) : (
          <EDText style={styles.details}>{summary}</EDText>
        )}
      </View>
    );
  }

  renderBalance() {
    const { balance, balanceType, owed } = this.props;
    if (!balance) {
      return <EDText style={styles.balanceText}>{I18n.t('settled_up')}</EDText>;
    }
    let status = 'owes_you';
    let color = COLORS.GREEN;
    if (owed) {
      color = COLORS.ORANGE;
      if (balanceType === 'groups') {
        status = 'you_are_owed';
      } else {
        status = 'you_owe';
      }
    }
    return (
      <View style={styles.balanceContainer}>
        <EDText style={{ ...styles.balanceValue, color }}>{'₹ ' + balance}</EDText>
        <EDText style={{ ...styles.balanceText, color }}>{I18n.t(status)}</EDText>
      </View>
    );
  }

  renderName() {
    const { name } = this.props;
    return (
      <View style={styles.nameContainer}>
        <EDText style={styles.name} numberOfLines={1}>
          {name}
        </EDText>
        {this.renderDetails()}
      </View>
    );
  }

  renderAvatar() {
    const { name } = this.props;
    return (
      <View>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#91b8f7', '#3b84f9']}
          style={styles.avatarContainer}
        >
          <EDText style={styles.avatarText}>{name[0]}</EDText>
        </LinearGradient>
        <EDText style={{ fontSize: FONT_SIZES.H6, paddingTop: 5, color: COLORS.GRAY }}>
          {'edited Apr 4'}
        </EDText>
      </View>
    );
  }

  render() {
    const { onPress } = this.props;
    return (
      <TouchableHighlight onPress={onPress} underlayColor={COLORS.GRAY} style={styles.container}>
        <View style={styles.statusContainer}>
          {this.renderAvatar()}
          {this.renderName()}
          {this.renderBalance()}
        </View>
      </TouchableHighlight>
    );
  }
}
