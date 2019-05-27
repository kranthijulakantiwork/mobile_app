// eslint-disable-next-line prop-types
/* @flow */

import { Platform } from 'react-native';
import { COLORS } from 'app/styles/Colors';
import { getCurrentUser } from 'app/models/User';
import { realm } from 'app/models/schema';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';

function displayNotificationFromCustomData(message: RemoteMessage) {
  if (message.data && message.data.title) {
    let notification = new firebase.notifications.Notification();
    notification = notification
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .setData(message.data)
      .setSound('bell.mp3');
    if (Platform.OS === 'android') {
      notification.android.setColor(COLORS.APP_THEME_GREEN);
      notification.android.setColorized(true);
      notification.android.setPriority(firebase.notifications.Android.Priority.High);
      notification.android.setVibrate([300]);
      notification.android.setSmallIcon('ic_stat_notification_icon');
      notification._android._channelId = 'settlemint_alerts';
      notification.android.setChannelId('settlemint_alerts');
      notification.android.setAutoCancel(true);
    }
    firebase.notifications().displayNotification(notification);
  }
}

function createChannel(id, title) {
  // Build a channel
  const channel = new firebase.notifications.Android.Channel(
    id,
    title,
    firebase.notifications.Android.Importance.Max
  ).setDescription(title);

  // Create the channel
  firebase.notifications().android.createChannel(channel);
}

function resetAndGoToScreen(routeName, key, params, dispatch) {
  const resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName,
        params,
        key
      })
    ]
  });
  return dispatch(resetAction);
}

module.exports = {
  init(dispatch) {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              return this.createNotificationListeners(dispatch);
            })
            .catch(() => {});
        }
      });
    return this.createNotificationListeners(dispatch);
  },

  async registerHeadlessListener(message: RemoteMessage) {
    displayNotificationFromCustomData(message);
    return Promise.resolve();
  },

  // these callback will be triggered only when app is foreground or background
  createNotificationListeners(dispatch) {
    //  Create Channels
    try {
      createChannel('settlemint_alerts', 'SettleMint Alerts');

      firebase
        .messaging()
        .getToken()
        .then(token => {
          console.log('fcm', token);
          // TODO send fcm token to server
        });

      const notificationListener = firebase.notifications().onNotification(notification => {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data);

        if (Platform.OS === 'android') {
          localNotification.android.setColor(COLORS.APP_THEME_GREEN);
          localNotification.android.setColorized(true);
          localNotification.android.setPriority(firebase.notifications.Android.Priority.High);
          notification.android.setVibrate([300]);
          localNotification.android.setSmallIcon('ic_stat_notification_icon');
          localNotification._android._channelId = 'settlemint_alerts';
          localNotification.android.setAutoCancel(true);
        }
        firebase.notifications().displayNotification(localNotification);
      });
      const notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened(notificationOpen => {
          const notif = notificationOpen.notification;
          this.onNotificationOpen(notif, dispatch);
        });

      const onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
        // TODO send fcm token to server
      });

      const messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
        displayNotificationFromCustomData(message);
      });

      return function() {
        notificationListener();
        notificationOpenedListener();
        onTokenRefreshListener();
        messageListener();
      };
    } catch (error) {
      return function() {};
    }
  },

  async onNotificationOpen(notif, dispatch) {
    const { success, currentUser } = getCurrentUser();
    if (success && currentUser) {
      return resetAndGoToScreen('Tabs', 'Tabs', {}, dispatch);
    }
    return resetAndGoToScreen('AuthScreen', 'AuthScreen', {}, dispatch);
  }
};
