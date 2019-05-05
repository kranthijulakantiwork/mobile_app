// @flow

import React, { Component } from 'react';
import { Dimensions, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import ToolBar from 'app/components/ToolBar';
import I18n from 'app/config/i18n';
import { FONT_SIZES, LANGUAGES } from 'app/config/ENV';
import { COLORS } from 'app/styles/Colors';
import EDText from 'app/components/EDText';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  btnSelected: {
    width: width / 2 - 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.APP_THEME_GREEN,
    margin: 10,
    borderRadius: 40,
    elevation: 1
  },
  notSelected: {
    width: width / 2 - 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 40,
    margin: 10,
    borderColor: COLORS.APP_THEME_GREEN,
    borderWidth: 2,
    elevation: 1
  },
  txtSelected: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H20,
    textAlign: 'center'
  },
  txtnotSelected: {
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H20,
    textAlign: 'center'
  }
});

export default class LanguageSelection extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      languages: LANGUAGES
    };
  }

  onSubmit() {
    alert('TODO');
  }

  onButtonClick(index) {
    this.setState({ selected: index });
  }

  renderLanguageButton(language, index) {
    const { selected } = this.state;
    const isButtonSelected = selected === index;
    return (
      <TouchableOpacity
        style={isButtonSelected ? styles.btnSelected : styles.notSelected}
        onPress={() => this.onButtonClick(index)}
      >
        {language.value ? (
          <EDText style={isButtonSelected ? styles.txtSelected : styles.txtnotSelected}>
            {language.value}
          </EDText>
        ) : null}
        <EDText style={isButtonSelected ? styles.txtSelected : styles.txtnotSelected}>
          {language.name}
        </EDText>
      </TouchableOpacity>
    );
  }

  renderButtons() {
    const { languages } = this.state;
    return (
      <FlatList
        data={languages}
        extraData={this.state}
        ListHeaderComponent={() => <View style={{ width, height: 20 }} />}
        ListFooterComponent={() => <View style={{ width, height: 20 }} />}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => this.renderLanguageButton(item, index)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ToolBar
          title={I18n.t('select_your_language')}
          leftImage="back"
          onLeft={() => goBack()}
          onRight={() => this.onSubmit()}
          rightImage="tick"
        />
        {this.renderButtons()}
      </View>
    );
  }
}
