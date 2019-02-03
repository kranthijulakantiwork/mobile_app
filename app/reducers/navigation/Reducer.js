// @flow

import { AppNavigator } from 'app/helpers/NavigationHelper';

export default function nav(state: Object, action: Object = {}) {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
