/* @flow */

import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import AbsoluteView from 'app/components/AbsoluteView';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const CATEGORIES = [
  'food',
  'transport',
  'drinks',
  'shopping',
  'grocery',
  'medicine',
  'fuel',
  'rent',
  'bills',
  'entertainment',
  'loan',
  'others'
];
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    width: width - 50,
    marginHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 7
  },
  buttonView: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageName: { fontSize: 10, color: '#5d5d5d', marginTop: 3 }
});

export default class Categories extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  };

  onDialogClose() {
    const { onDialogClose } = this.props;
    onDialogClose && onDialogClose();
  }

  renderImage(imageName) {
    const { onPress } = this.props;
    return (
      <TouchableOpacity onPress={() => onPress(imageName)} key={imageName}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.buttonView}>
            <Image source={Images[imageName]} />
          </View>
          <EDText style={styles.imageName}>{I18n.t(imageName)}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderRow(imageArray) {
    return (
      <View style={styles.row}>{imageArray.map(imageName => this.renderImage(imageName))}</View>
    );
  }

  render() {
    return (
      <AbsoluteView onDialogClose={() => this.onDialogClose()}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            {this.renderRow(CATEGORIES.slice(0, 4))}
            {this.renderRow(CATEGORIES.slice(4, 8))}
            {this.renderRow(CATEGORIES.slice(8, 12))}
          </View>
        </View>
      </AbsoluteView>
    );
  }
}
