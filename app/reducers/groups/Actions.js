// @flow

import Types from 'app/reducers/groups/ActionTypes';
import { getFriends } from 'app/api/Friends';
import { getGroups } from 'app/api/Groups';
import { getDetails } from 'app/api/Details';

export function setGroups(groups: Array<Object>) {
  return {
    type: Types.SET_GROUPS,
    groups
  };
}

export function setGroupsData(groupsData: Array<Object>) {
  return {
    type: Types.SET_GROUPS_DATA,
    groupsData
  };
}

export function setFriendsData(friendsData: Array<Object>) {
  return {
    type: Types.SET_FRIENDS_DATA,
    friendsData
  };
}

export function setUserBalance(balance: Array<Object>) {
  return {
    type: Types.SET_USER_BALANCE,
    balance
  };
}

export function getGroupsAndFriends(currrentUser) {
  return async dispatch => {
    try {
      const response = await getDetails(currrentUser);
      if (response.success) {
        const groups = response.data.groups;
        const groupsList = [];
        groups.forEach(group => {
          groupsList.push({ name: group.name, id: group.id });
        });
        dispatch(setGroups(groupsList));
        dispatch(setGroupsData(groups));
        dispatch(setFriendsData(response.data.friends));
        dispatch(setUserBalance(response.data.user));
      }
    } catch (error) {}
  };
}
