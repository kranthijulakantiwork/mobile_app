// @flow

import React, { Component } from 'react';
import { Dimensions, View, Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import EDText from 'app/components/EDText';
import Images from 'app/config/Images';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 60,
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 1,
    // elevation: 2,
    backgroundColor: COLORS.APP_THEME_BLUE,
    shadowColor: '#000'
  },
  subTitleContainer: { flex: 1, marginVertical: 5 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.WHITE
  },
  button: { height: 60, width: 70, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: FONT_SIZES.H1, color: COLORS.WHITE }
});

export default class ToolBar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onLeft: PropTypes.func,
    leftTitle: PropTypes.string,
    rightTitle: PropTypes.string,
    onRight: PropTypes.func,
    leftImage: PropTypes.number,
    rightImage: PropTypes.number
  };

  renderButton({ onPress, title, image }) {
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <EDText style={styles.buttonText}>{title}</EDText>
        </TouchableOpacity>
      );
    }
    return <View style={styles.button} />;
  }

  renderTitle() {
    const { title, subTitle } = this.props;
    if (subTitle) {
      return (
        <View style={styles.subTitleContainer}>
          <EDText style={styles.title}>{title}</EDText>
          <EDText style={styles.title}>{subTitle}</EDText>
        </View>
      );
    } else return <EDText style={styles.title}>{title}</EDText>;
  }

  render() {
    const { onLeft, leftTitle = '', leftImage, onRight, rightTitle = '', rightImage } = this.props;
    return (
      <View style={styles.container}>
        {this.renderButton({ onPress: onLeft, title: leftTitle, image: leftImage })}
        {this.renderTitle()}
        {this.renderButton({ onPress: onRight, title: rightTitle, image: rightImage })}
      </View>
    );
  }
}
