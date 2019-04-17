/* @flow */

import React, { Component } from 'react';
import { Dimensions, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
  avatarContainer: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  avatarText: { color: COLORS.WHITE, fontSize: FONT_SIZES.H20, fontWeight: 'bold' },
  avatarSubText: { fontSize: FONT_SIZES.H6, paddingTop: 5, color: '#bbbbbb' },
  closeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderColor: 'red',
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  closeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  }
});

export default class Avatar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    colors: PropTypes.array,
    avatarSubText: PropTypes.string,
    avatarSubTextStyle: PropTypes.object,
    showClose: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCloseImage() {
    const { showClose } = this.props;
    if (showClose) {
      return (
        <View style={styles.closeContainer}>
          <EDText style={styles.closeText}>{'X'}</EDText>
        </View>
      );
    }
    return null;
  }

  renderName() {
    const { name, colors } = this.props;
    if (!name) return null;
    return (
      <View style={{ paddingRight: 3, paddingTop: 3 }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors || ['#91b8f7', '#3b84f9']}
          style={styles.avatarContainer}
        >
          <EDText style={styles.avatarText}>{name[0]}</EDText>
        </LinearGradient>
        {this.renderCloseImage()}
      </View>
    );
  }

  renderImage() {
    const { imageSource } = this.props;
    if (!imageSource) return null;
    return <Image source={imageSource} style={{ height: 45, width: 45, borderRadius: 3 }} />;
  }

  render() {
    const { avatarSubText, onPress, disabled, avatarSubTextStyle, buttonStyle } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress || disabled} style={buttonStyle || {}}>
        <View style={{ alignItems: 'center' }}>
          {this.renderName()}
          {avatarSubText ? (
            <EDText style={avatarSubTextStyle || styles.avatarSubText} numberOfLines={1}>
              {avatarSubText}
            </EDText>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
