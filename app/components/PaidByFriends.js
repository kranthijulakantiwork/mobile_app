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
    fontWeight: '200',
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

export default class PaidByFriends extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
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

  renderTextBox() {
    const { showTextBoxes, amount } = this.props;
    if (!showTextBoxes) return null;
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <EDText
            style={{
              fontSize: FONT_SIZES.H4,
              color: COLORS.TEXT_BLACK
            }}
          >
            ₹{' '}
          </EDText>
        </View>
        <TextInput
          style={{
            height: 40,
            marginHorizontal: 10,
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
      </View>
    );
  }

  renderSelectionBox() {
    const { isSelected, hideCheckBox } = this.props;
    if (hideCheckBox) return null;
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
    const { name, showTextBoxes } = this.props;
    let viewWidth = width - 140;
    if (showTextBoxes) {
      viewWidth = width - 170;
    }
    return (
      <EDText style={{ ...styles.name, width: viewWidth }} numberOfLines={1}>
        {name}
      </EDText>
    );
  }

  renderAvatar() {
    const { name } = this.props;
    return <Avatar name={name} />;
  }

  render() {
    const { onPress, showTextBoxes } = this.props;
    let viewWidth = width - 40;
    if (showTextBoxes) {
      viewWidth = width - 120;
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
