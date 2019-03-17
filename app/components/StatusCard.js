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
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { height: 30, width: 30, borderRadius: 15, marginHorizontal: 10 },
  detailsContainer: { width: width - 60, marginLeft: 50, marginRight: 10 },
  name: {
    color: COLORS.TEXT_BLACK,
    fontWeight: '200',
    fontSize: FONT_SIZES.H2,
    width: width - 160
  },
  details: { width: width - 60, color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4 },
  balanceContainer: { width: 100, justifyContent: 'center', alignItems: 'center' },
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
    avatar: PropTypes.string,
    mobile: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSummaryDetails(detail, i) {
    const { owed } = this.props;
    let oweText = detail.name + ' ' + I18n.t('owes_you') + ' ';
    let color = COLORS.GREEN;
    if (owed) {
      oweText = I18n.t('you_owe_') + ' ' + detail.name + ' ';
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
    if (!balance) return null;
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
        <EDText style={styles.balanceText}>{I18n.t(status)}</EDText>
        <EDText style={{ ...styles.balanceValue, color }}>{'₹' + balance}</EDText>
      </View>
    );
  }

  renderName() {
    const { name } = this.props;
    return <EDText style={styles.name}>{name}</EDText>;
  }

  renderAvatar() {
    const { avatar } = this.props;
    return (
      <Image
        source={{ uri: avatar || 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png' }}
        style={styles.avatar}
      />
    );
  }

  render() {
    const { onPress } = this.props;
    return (
      <TouchableHighlight onPress={onPress} underlayColor={COLORS.LIGHT_GRAY}>
        <View style={styles.container}>
          <View style={styles.statusContainer}>
            {this.renderAvatar()}
            {this.renderName()}
            {this.renderBalance()}
          </View>
          {this.renderDetails()}
        </View>
      </TouchableHighlight>
    );
  }
}
