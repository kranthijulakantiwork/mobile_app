import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

import RupeeIcon from 'app/assets/amount.png';
import BackIcon from 'app/assets/back.png';

import { styles } from './styles';

const Emoji = ({ symbol }) => <Text style={{ fontSize: 50, padding: 8 }}>{symbol}</Text>;

const CheckBox = () => <View style={styles.checkbox} />;

const SettlementAmount = ({ amount = 'N/A' }) => (
  <View style={styles.settlementAmountContainer}>
    <CheckBox />
    <View style={styles.settlementAmountTextView}>
      <Text style={styles.settlementText}>Settlement</Text>
      <Text style={styles.settlementText}>Rs {amount}/-</Text>
    </View>
  </View>
);

const TimeStamp = ({ name = 'N/A', date = 'N/A' }) => (
  <View style={styles.padding}>
    <Text style={styles.fontSize}>{`Added by ${name} on ${date}`}</Text>
  </View>
);

const EmojiTransaction = () => (
  <View
    style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center' }}
  >
    <Emoji symbol="😃" />
    <Image source={BackIcon} style={{ width: 30 }} />
    <Emoji symbol="😃" />
  </View>
);

const TransactionDetails = ({ paidBy }) => (
  <View style={styles.padding}>
    <Text style={styles.fontSize}>{`${paidBy} paid you`}</Text>
  </View>
);

const Amount = ({ amount = '123' }) => (
  <View style={styles.amountContainer}>
    <Image source={RupeeIcon} />
    <TextInput style={styles.amountInputText} value={amount} />
  </View>
);

const DeleteButton = ({ title }) => (
  <TouchableOpacity style={styles.deleteButton}>
    <Text style={styles.textWhite}>{title}</Text>
  </TouchableOpacity>
);

const SettlementDetailView = () => (
  <View style={styles.container}>
    <SettlementAmount amount="123" />
    <TimeStamp name="Some One" date="13 April 2019" />
    <EmojiTransaction />
    <TransactionDetails paidBy="Some other" />
    <Amount />
    <DeleteButton title="Delete" />
  </View>
);

export default SettlementDetailView;
