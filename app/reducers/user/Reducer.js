/* @flow */

const initialState = null;

export default function currentUser(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
}
