/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

const BALANCES = ['to_pay', 'to_get', 'balance'];
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    width: width - 20,
    margin: 10
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceValue: { color: COLORS.WHITE, fontSize: FONT_SIZES.H22, marginBottom: 5 },
  balanceText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H1, fontWeight: 'bold' }
});

export default class Balances extends Component {
  static propTypes = {
    to_pay: PropTypes.string.isRequired,
    to_get: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBalance(title, index) {
    const balanceStyles = {
      to_pay: { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
      to_get: {},
      balance: { borderTopRightRadius: 5, borderBottomRightRadius: 5 }
    };
    let imageSource = title;
    if (title === 'balance') {
      imageSource = Number(this.props[title]) > 0 ? 'balance_positive' : 'balance_negative';
    }
    return (
      <ImageBackground
        style={{ ...styles.image, ...balanceStyles[title] }}
        key={index}
        source={Images[imageSource]}
      >
        <EDText style={styles.balanceValue}>{'₹' + Math.abs(this.props[title])}</EDText>
        <EDText style={styles.balanceText}>{I18n.t(title)}</EDText>
      </ImageBackground>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {BALANCES.map((title, index) => this.renderBalance(title, index))}
      </View>
    );
  }
}
