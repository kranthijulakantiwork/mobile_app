/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { FONT_SIZES, FONT_FAMILY } from 'app/config/ENV';
import { GiftedChat } from 'react-native-gifted-chat';
import Bubble from 'app/components/Bubble';
import EDText from 'app/components/EDText';
import I18n from 'app/config/i18n';
import showToast from 'app/helpers/Toast';
import { COLORS } from 'app/styles/Colors';

type Props = {};

const { height, width } = Dimensions.get('window');
const UNKNOWN = 'unknown';
const APP_UPDATES_ROOM = 'updates';

const colors = [
  '#e67e22', // carrot
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50' // midnight blue
];

class ChatRoom extends Component<Props> {
  constructor(props) {
    super(props);
    const { navigation, currentUser = {} } = this.props;
    this.state = {
      messages: [
        {
          _id: Math.round(Math.random() * 1000000),
          text:
            'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          amount: '200',
          bill_name: 'House Rent',
          get: true,
          user: {
            _id: 1,
            name: 'Developer'
          }
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'React Native lets you build mobile apps using only JavaScript',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          amount: '450',
          bill_name: 'House Rent',
          get: false,
          user: {
            _id: 2,
            name: 'Developer'
          }
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'This is a system message.',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          system: true
        }
      ],
      username: UNKNOWN,
      userId: this.getUserID(),
      chatRoom: navigation.getParam('chatRoom'),
      title: navigation.getParam('title'),
      showLoadEarlier: true
    };
  }

  getUserID() {
    return 1;
    // const { success, uid } = FirebaseAuth.getUID();
    // if (!success) return UNKNOWN;
    // return uid;
  }

  appendNewMessages = ({ newMessages = [] } = {}) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessages)
    }));
  };

  componentWillMount() {
    const { chatRoom } = this.state;
    // TODO add new messages
  }

  renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF'
        }}
      >
        <EDText>{I18n.t('loading')}</EDText>
      </View>
    );
  };

  getColor(username) {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }
    return colors[sumChars % colors.length];
  }

  renderBubble = props => {
    const { currentMessage } = props;
    const username = currentMessage.user.name;
    const randomColor = this.getColor(username);
    const textStyle = { color: 'black', fontSize: FONT_SIZES.H3, fontFamily: FONT_FAMILY };
    return (
      <Bubble
        {...props}
        textStyle={{ right: { ...textStyle }, left: { ...textStyle } }}
        usernameStyle={{
          color: randomColor,
          fontSize: FONT_SIZES.H3,
          fontFamily: FONT_FAMILY
        }}
        wrapperStyle={{
          left: { backgroundColor: '#f0f0f0' },
          right: { backgroundColor: '#f0f0f0' }
        }}
      />
    );
  };

  render() {
    const { username, userId, chatRoom, title, showLoadEarlier } = this.state;
    // const disableInputToolbar = chatRoom === APP_UPDATES_ROOM;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}>
        {/* <TopBar back={true} backAction={() => this.props.navigation.goBack()} title={title} /> */}
        <GiftedChat
          messages={this.state.messages}
          // onSend={messages => {
          //   this.onSend(messages);
          // }}
          user={{
            _id: userId,
            name: username
          }}
          // loadEarlier={showLoadEarlier}
          isAnimated={true}
          // onLoadEarlier={this.getEarlierMessageCount}
          renderLoading={this.renderLoading}
          // renderAvatarOnTop={true}
          renderAvatar={null}
          renderBubble={this.renderBubble}
          renderInputToolbar={() => null}
          renderMessageText={messageTextProps => {
            const color = messageTextProps.currentMessage.get
              ? COLORS.BALANCE_GREEN
              : COLORS.BALANCE_RED;
            const text = messageTextProps.currentMessage.get
              ? '₹' + messageTextProps.currentMessage.amount + ' Paid'
              : '₹' + messageTextProps.currentMessage.amount + ' Borrowed';
            return (
              <View style={{ width: (2 * width) / 3, paddingHorizontal: 15, paddingVertical: 10 }}>
                <EDText style={{ fontSize: 22, color }}>{text}</EDText>
                <EDText style={{ color: COLORS.BILL_DETAILS_BLACK, fontSize: 12, marginTop: 10 }}>
                  {'Bill Name : ' + messageTextProps.currentMessage.bill_name}
                </EDText>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps)(ChatRoom);
