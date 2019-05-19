import React, { Component } from 'react';
import { Dimensions, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { FONT_SIZES } from 'app/config/ENV';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resetAndGoToScreen } from 'app/helpers/NavigationHelper';
import dismissKeyboard from 'dismissKeyboard';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import ToolBar from 'app/components/ToolBar';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE
  }
});

export default class Tracker extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <EDText
          style={{ fontSize: FONT_SIZES.H22, color: COLORS.APP_THEME_GREEN, fontWeight: 'bold' }}
        >
          {I18n.t('coming_soon')}
        </EDText>
      </View>
    );
  }
}
