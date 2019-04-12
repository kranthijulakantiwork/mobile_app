/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import Avatar from 'app/components/Avatar';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  name: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    color: COLORS.TEXT_BLACK,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.H2,
    width: width - 100
  },
  selectionBox: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.TEXT_BLACK
  }
});

export default class SplitByFriends extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    splitBy: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.string,
    shareValue: PropTypes.string,
    isSelected: PropTypes.bool,
    hideCheckBox: PropTypes.bool,
    showTextBoxes: PropTypes.bool,
    onChangeText: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  renderRightText() {
    const { splitBy } = this.props;
    if (['percentages', 'shares'].includes(splitBy)) {
      const text = splitBy === 'percentages' ? '%' : I18n.t('share_s');
      return (
        <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <EDText
            style={{
              fontSize: FONT_SIZES.H4,
              color: COLORS.TEXT_BLACK
            }}
          >
            {text}
          </EDText>
        </View>
      );
    }
    return null;
  }

  renderLeftText() {
    const { splitBy } = this.props;
    if (['unequally', 'adjustment'].includes(splitBy)) {
      const text = splitBy === 'unequally' ? '₹ ' : '+   ₹  ';
      return (
        <View
          style={{ height: 40, alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
        >
          <EDText
            style={{
              fontSize: FONT_SIZES.H4,
              color: COLORS.TEXT_BLACK
            }}
          >
            {text}
          </EDText>
        </View>
      );
    }
    return null;
  }

  renderTextBox() {
    const { amount, splitBy } = this.props;
    if (splitBy === 'equally') return null;
    return (
      <View style={{ flexDirection: 'row' }}>
        {this.renderLeftText()}
        <TextInput
          style={{
            height: 40,
            marginHorizontal: 5,
            width: 50,
            color: COLORS.TEXT_BLACK,
            borderBottomWidth: 1,
            borderColor: COLORS.APP_THEME_BLUE
          }}
          onChangeText={text => this.props.onChangeText(text)}
          autoCorrect={false}
          value={amount}
          placeholder={'0.00'}
          keyboardType={'number-pad'}
        />
        {this.renderRightText()}
      </View>
    );
  }

  renderSelectionBox() {
    const { isSelected, splitBy } = this.props;
    if (splitBy !== 'equally') return null;
    return (
      <View
        style={{
          ...styles.selectionBox,
          backgroundColor: isSelected ? COLORS.APP_THEME_BLUE : COLORS.LIGHT_GRAY
        }}
      />
    );
  }

  renderName() {
    const { name, splitBy, shareValue } = this.props;
    let viewWidth = width - 160;
    const fontSize = shareValue ? FONT_SIZES.H3 : FONT_SIZES.H2;
    switch (splitBy) {
      case 'unequally':
        viewWidth = width - 120;
        break;
      case 'percentages':
        viewWidth = width - 130;
        break;
      case 'shares':
        viewWidth = width - 180;
        break;
      case 'adjustment':
        viewWidth = width - 140;
        break;
      default:
        break;
    }
    return (
      <View>
        <EDText style={{ ...styles.name, width: viewWidth, fontSize }} numberOfLines={1}>
          {name}
        </EDText>
        {shareValue ? (
          <EDText style={{ fontSize: 8, color: COLORS.TEXT_BLACK }}>
            {I18n.t('total_share', { share: shareValue })}
          </EDText>
        ) : null}
      </View>
    );
  }

  renderAvatar() {
    const { name } = this.props;
    return <Avatar name={name} />;
  }

  render() {
    const { onPress, showTextBoxes, splitBy } = this.props;
    let viewWidth = width - 40;
    switch (splitBy) {
      case 'unequally':
        viewWidth = width - 120;
        break;
      case 'percentages':
        viewWidth = width - 130;
        break;
      case 'shares':
        viewWidth = width - 150;
        break;
      case 'adjustment':
        viewWidth = width - 140;
        break;
      default:
        viewWidth = width - 40;
        break;
    }
    return (
      <View style={{ flexDirection: 'row', width: viewWidth }}>
        <TouchableHighlight
          onPress={onPress}
          disabled={showTextBoxes}
          underlayColor={COLORS.LIGHT_GRAY}
          style={{ width: viewWidth }}
        >
          <View style={styles.container}>
            {this.renderAvatar()}
            {this.renderName()}
            {this.renderSelectionBox()}
          </View>
        </TouchableHighlight>
        {this.renderTextBox()}
      </View>
    );
  }
}
