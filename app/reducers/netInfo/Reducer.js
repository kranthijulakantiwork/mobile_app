/* @flow */

const initialState = {
  reload: false
};

export default function network(state = initialState, action = {}) {
  switch (action.type) {
    case 'ENABLE_RELOAD':
      return {
        reload: true
      };
    case 'DISABLE_RELOAD':
      return {
        reload: false
      };
    default:
      return state;
  }
}
