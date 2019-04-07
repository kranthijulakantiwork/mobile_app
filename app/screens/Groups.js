/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { COLORS } from 'app/styles/Colors';
import { connect } from 'react-redux';
import { FONT_SIZES } from 'app/config/ENV';
import { Spinner, removeSpinner, setSpinner } from 'app/components/Spinner';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import Images from 'app/config/Images';
import StatusCard from 'app/components/StatusCard';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1, backgroundColor: COLORS.LIGHT_GRAY },
  headerContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1
  },
  headerText: { fontSize: FONT_SIZES.H3, textAlign: 'center' },
  footerContainer: {
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 15,
    borderColor: COLORS.TEXT_BLACK,
    borderWidth: 1
  },
  footerText: { color: COLORS.TEXT_BLACK, fontSize: FONT_SIZES.H3 },
  addButton: { position: 'absolute', bottom: 20, right: 30 }
});

const GROUPS_DETAILS = {
  name: 'KranthiKranthiKranthiKranthiKranthiKranthiKranthi',
  owed: true,
  details: [
    { name: 'Ram', amount: '20', owed: true },
    { name: 'Ravi', amount: 100, owed: false },
    { name: 'Ravi', amount: 100, owed: true }
  ],
  balance: '200',
  mobile: '9491267523'
};
const amountToBeSettled = '300';

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS,
        GROUPS_DETAILS
      ],
      amountToBeSettled,
      isOwed: false,
      spinner: false
    };
  }

  onGroupSelection(groupDetails) {
    alert('TODO');
  }

  onCreateGroup() {
    alert('TODO');
  }

  onAddBill() {
    alert('TODO');
  }

  renderAddButton() {
    return (
      <TouchableOpacity onPress={this.onAddBill} style={styles.addButton}>
        <Image
          source={{ uri: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png' }}
          style={{ height: 60, width: 60, borderRadius: 30 }}
        />
      </TouchableOpacity>
    );
  }

  renderFooter() {
    return (
      <TouchableOpacity onPress={this.onCreateGroup}>
        <View style={styles.footerContainer}>
          <EDText style={styles.footerText}>{I18n.t('create_group')}</EDText>
        </View>
      </TouchableOpacity>
    );
  }

  renderSingleGroup(groupDetails) {
    const { name, balance, details, owed, mobile } = groupDetails;
    return (
      <StatusCard
        onPress={() => this.onGroupSelection(groupDetails)}
        name={name}
        details={details}
        balance={balance}
        owed={owed}
        mobile={mobile}
        balanceType={'groups'}
      />
    );
  }

  renderGroups() {
    const { groups } = this.state;
    return (
      <FlatList
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => this.renderSingleGroup(item)}
      />
    );
  }

  renderHeader() {
    const { amountToBeSettled, isOwed } = this.state;
    const color = isOwed ? COLORS.ORANGE : COLORS.GREEN;
    return (
      <View style={styles.headerContainer}>
        <EDText style={styles.headerText}>
          {I18n.t('net_settlement_amount_rs')}
          <EDText style={{ ...styles.headerText, color }}>{amountToBeSettled}</EDText>
        </EDText>
      </View>
    );
  }

  render() {
    const { spinner } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderGroups()}
          {this.renderFooter()}
          <View style={{ width, height: 100 }} />
        </ScrollView>
        {/* {this.renderAddButton()} */}
        {spinner && <Spinner />}
      </View>
    );
  }
}
