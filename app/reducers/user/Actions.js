// @flow

import Types from 'app/reducers/user/ActionTypes';

export function setUser(user: Object) {
  return {
    type: Types.SET_USER,
    user: user
  };
}

export function logOut(user: Object) {
  return {
    type: Types.LOGOUT,
    user: user
  };
}
