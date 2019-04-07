/* @flow */

import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import AbsoluteView from 'app/components/AbsoluteView';
import EDText from 'app/components/EDText';
import FriendSelectionView from 'app/components/FriendSelectionView';
import I18n from 'app/config/i18n';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginVertical: 50,
    marginHorizontal: 20
  },
  headingText: {
    marginLeft: 10,
    color: COLORS.TEXT_BLACK,
    fontSize: FONT_SIZES.H2,
    paddingVertical: 20,
    fontWeight: 'bold'
  }
});

export default class GroupsList extends Component {
  static propTypes = {
    onDialogClose: PropTypes.func.isRequired,
    onSelectGroup: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired,
    showGroups: PropTypes.bool.isRequired
  };

  onDialogClose() {
    const { onDialogClose } = this.props;
    onDialogClose && onDialogClose();
  }

  onSelectGroup(group) {
    const { onSelectGroup } = this.props;
    onSelectGroup && onSelectGroup(group);
  }

  renderSingleGroup(group, index) {
    return (
      <FriendSelectionView
        onPress={() => this.onSelectGroup(group)}
        hideCheckBox={true}
        name={group.name ? group.name : I18n.t('not_in_group')}
        key={index}
        mobile={''}
      />
    );
  }

  renderGroups() {
    const { groups } = this.props;
    return (
      <FlatList
        data={groups}
        initialNumToRender={50}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }, index) => this.renderSingleGroup(item, index)}
      />
    );
  }

  renderHeadingText() {
    return <EDText style={styles.headingText}>{I18n.t('choose_group')}</EDText>;
  }

  render() {
    const { showGroups } = this.props;
    if (!showGroups) return null;
    return (
      <AbsoluteView onDialogClose={() => this.onDialogClose()}>
        <View style={styles.container}>
          {this.renderHeadingText()}
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {this.renderGroups()}
          </ScrollView>
        </View>
      </AbsoluteView>
    );
  }
}
