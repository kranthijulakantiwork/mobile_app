// @flow

import Types from 'app/reducers/groups/ActionTypes';

export function setGroups(groups: Array<Object>) {
  return {
    type: Types.SET_GROUPS,
    groups: groups
  };
}
