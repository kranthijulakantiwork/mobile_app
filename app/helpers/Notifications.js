/* @flow */

import { Platform } from 'react-native';
// import { createOrUpdate } from 'app/models/Device';
import firebase from 'react-native-firebase';

module.exports = {
  init: function(dispatch) {
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
            .catch(error => {});
        }
      });
    return this.createNotificationListeners(dispatch);
  },

  createNotificationListeners(dispatch) {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'docsam_alert',
      'Fan Duniya Alerts',
      firebase.notifications.Android.Importance.Max
    ).setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    firebase
      .messaging()
      .getToken()
      .then(token => console.log(token));

    const notificationListener = firebase.notifications().onNotification(notification => {
      const localNotification = new firebase.notifications.Notification()
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body);

      if (Platform.OS === 'android') {
        localNotification._android._channelId = notification.data.channelId;
        localNotification.android.setAutoCancel(true);
      }
      firebase.notifications().displayNotification(localNotification);
    });
    const notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const notif = notificationOpen.notification;
        // TODO Background and Foreground Notifications are handled here.
      });

    const onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => console.log(token));

    return function() {
      notificationListener.remove();
      notificationOpenedListener.remove();
      onTokenRefreshListener.remove();
    };
  }
};
