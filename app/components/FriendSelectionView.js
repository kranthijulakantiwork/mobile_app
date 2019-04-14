/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
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
  nameContainer: { width: width - 100, marginLeft: 10 },
  name: {
    textAlignVertical: 'top',
    includeFontPadding: false,
    color: COLORS.TEXT_BLACK,
    fontWeight: '200',
    fontSize: FONT_SIZES.H2,
    width: width - 100
  },
  mobile: { width: width - 100, color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H4 },
  selectionBox: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.TEXT_BLACK
  }
});

export default class FriendSelectionView extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    mobile: PropTypes.string,
    isSelected: PropTypes.bool,
    hideCheckBox: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {};
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
    const { name, mobile } = this.props;
    return (
      <View style={styles.nameContainer}>
        <EDText style={styles.name} numberOfLines={1}>
          {name}
        </EDText>
        <EDText style={styles.mobile}>{mobile}</EDText>
      </View>
    );
  }

  renderAvatar() {
    const { name } = this.props;
    return <Avatar name={name} />;
  }

  render() {
    const { onPress } = this.props;
    return (
      <TouchableHighlight onPress={onPress} underlayColor={COLORS.LIGHT_GRAY}>
        <View style={styles.container}>
          {this.renderAvatar()}
          {this.renderName()}
          {this.renderSelectionBox()}
        </View>
      </TouchableHighlight>
    );
  }
}
