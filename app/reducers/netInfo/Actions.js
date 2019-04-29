// @flow

import Types from 'app/reducers/netInfo/ActionTypes';

export function enableReload() {
  return {
    type: Types.ENABLE_RELOAD
  };
}

export function disableReload() {
  return {
    type: Types.DISABLE_RELOAD
  };
}
