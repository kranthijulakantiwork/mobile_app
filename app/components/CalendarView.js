/* @flow */

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
//import { Calendar } from 'react-native-calendars';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import AbsoluteView from 'app/components/AbsoluteView';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingText: {
    marginLeft: 10,
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H2,
    paddingVertical: 20,
    fontWeight: 'bold'
  }
});

export default class CalendarView extends Component {
  static propTypes = {
    onDialogClose: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    selectedDay: PropTypes.string.isRequired,
    showCalendar: PropTypes.bool.isRequired
  };

  onDialogClose() {
    const { onDialogClose } = this.props;
    onDialogClose && onDialogClose();
  }

  onSelectDate(day) {
    const { onSelectDate } = this.props;
    onSelectDate && onSelectDate(day);
  }

  render() {
    const { showCalendar, selectedDay } = this.props;
    if (!showCalendar) return null;
    return (
      <AbsoluteView onDialogClose={() => this.onDialogClose()}>
        <View style={styles.container}>
          {/* <Calendar
            onDayPress={day => this.onSelectDate(day)}
            style={{ width: (2 * width) / 3, borderRadius: 10, height: 350 }}
            hideExtraDays
            markedDates={{
              [selectedDay]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange'
              }
            }}
          /> */}
        </View>
      </AbsoluteView>
    );
  }
}
