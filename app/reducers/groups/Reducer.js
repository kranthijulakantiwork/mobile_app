/* @flow */

const initialState = [];

export default function groups(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case 'SET_GROUPS':
      return action.groups;
    default:
      return state;
  }
}
