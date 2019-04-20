import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes
} from 'react-native';
import { Image } from 'react-native';
import { MessageText, MessageVideo, MessageImage, Time, utils } from 'react-native-gifted-chat';

const { isSameUser, isSameDay } = utils;

export default class Bubble extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else if (this.props.currentMessage.text) {
      const options = ['Copy Text', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            default:
              break;
          }
        }
      );
    }
  }

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position]
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position]
      ]);
    }
    return null;
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} />;
    }
    return null;
  }

  renderMessageVideo() {
    if (this.props.currentMessage.video) {
      const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
      if (this.props.renderMessageVideo) {
        return this.props.renderMessageVideo(messageVideoProps);
      }
      return <MessageVideo {...messageVideoProps} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received || currentMessage.pending) {
      return (
        <View style={styles.tickView}>
          {currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.pending && <Text style={[styles.tick, this.props.tickStyle]}>🕓</Text>}
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      const txtStyle = { color: 'black', fontSize: 10, fontFamily: 'WorkSans-Regular' };
      return <Time {...timeProps} textStyle={{ left: txtStyle, right: txtStyle }} />;
    }
    return null;
  }

  renderUsername() {
    const { previousMessage, currentMessage } = this.props;
    if (!isSameUser(previousMessage, currentMessage)) {
      return (
        <View style={styles.usernameView}>
          <Text style={[styles.username, this.props.usernameStyle]}>
            ~ {currentMessage.user.name}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderBadges() {
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position]
        ]}
      >
        <View
          style={[
            // styles[this.props.position].wrapper,
            // this.props.wrapperStyle[this.props.position],
            // this.handleBubbleToNext(),
            // this.handleBubbleToPrevious(),
            { borderRadius: 10, backgroundColor: 'white', marginVertical: 7 }
          ]}
        >
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
            onPress={() => alert('TODO')}
            accessibilityTraits="text"
            {...this.props.touchableProps}
          >
            <View>
              <View
                style={[
                  styles[this.props.position].bottom,
                  this.props.bottomContainerStyle[this.props.position]
                ]}
              >
                {/* {this.renderUsername()} */}
                {/* {this.renderBadges()} */}
              </View>
              {/* {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageVideo()} */}
              {this.renderMessageText()}
              {/* {this.renderTicks()} */}
              {this.renderTime()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const Color = {
  defaultColor: '#b2b2b2',
  backgroundTransparent: 'transparent',
  defaultBlue: '#0084ff',
  leftBubbleBackground: '#f0f0f0',
  white: '#fff',
  carrot: '#e67e22',
  emerald: '#2ecc71',
  peterRiver: '#3498db',
  wisteria: '#8e44ad',
  alizarin: '#e74c3c',
  turquoise: '#1abc9c',
  midnightBlue: '#2c3e50',
  optionTintColor: '#007AFF',
  timeTextColor: '#aaa'
};

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start'
    },
    wrapper: {
      borderRadius: 2,
      elevation: 0,
      marginTop: 5,
      backgroundColor: Color.leftBubbleBackground,
      marginRight: 60,
      minWidth: 150,
      minHeight: 30,
      justifyContent: 'flex-end'
    },
    containerToNext: {
      borderBottomLeftRadius: 3
    },
    containerToPrevious: {
      borderTopLeftRadius: 3
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end'
    },
    wrapper: {
      elevation: 1,
      marginTop: 5,
      borderRadius: 2,
      backgroundColor: Color.defaultBlue,
      marginLeft: 60,
      minWidth: 150,
      minHeight: 30,
      justifyContent: 'flex-end'
    },
    containerToNext: {
      borderBottomRightRadius: 3
    },
    containerToPrevious: {
      borderTopRightRadius: 3
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    }
  }),

  tick: {
    fontSize: 10,
    backgroundColor: Color.backgroundTransparent,
    color: Color.white
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10
  },
  username: {
    top: -3,
    marginTop: 5,
    fontFamily: 'WorkSans-Bold',
    left: 0,
    fontSize: 15,
    backgroundColor: 'transparent',
    color: 'black'
  },
  usernameView: {
    flexDirection: 'row',
    marginHorizontal: 10
  }
};

Bubble.contextTypes = {
  actionSheet: PropTypes.func
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageVideo: null,
  renderMessageText: null,
  renderCustomView: null,
  renderUsername: null,
  renderTicks: null,
  renderTime: null,
  position: 'left',
  currentMessage: {
    text: null,
    createdAt: null,
    image: null
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  bottomContainerStyle: {},
  tickStyle: {},
  usernameStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {}
};

Bubble.propTypes = {
  user: PropTypes.object.isRequired,
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageVideo: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsernameOnMessage: PropTypes.bool,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  bottomContainerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  tickStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  })
};
