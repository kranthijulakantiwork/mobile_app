/* @flow */

const initialState = {
  show_spinner: false,
  contacts: []
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case 'START_SPINNER':
      return { ...state, show_spinner: true };
    case 'STOP_SPINNER':
      return { ...state, show_spinner: false };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.contacts };
    default:
      return state;
  }
}
