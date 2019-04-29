// @flow

import Types from 'app/reducers/common/ActionTypes';

export function startSpinner() {
  return {
    type: Types.START_SPINNER
  };
}

export function stopSpinner() {
  return {
    type: Types.STOP_SPINNER
  };
}

export function setContacts(contacts) {
  return {
    type: Types.SET_CONTACTS,
    contacts
  };
}
