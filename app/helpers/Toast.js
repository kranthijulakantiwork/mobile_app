/* @flow */

import Toast from 'react-native-root-toast';

type data = {
  message: string,
  onHidden: Function,
  onHide: Function,
  onShow: Function,
  onShown: Function
};

const TOAST_DURATION = 2000;

export default function showToast(data: data) {
  if (data.message) {
    const toast = Toast.show(data.message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: false,
      delay: 0
    });

    setTimeout(function() {
      Toast.hide(toast);
    }, TOAST_DURATION);
  }
  return null;
}
