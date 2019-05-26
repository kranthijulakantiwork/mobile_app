/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  addGroup: async (currentUser, groupName, friends, intelligentSettlements) => {
    const params = {
      auth_key: currentUser.auth_key,
      name: groupName,
      friends: friends.map(friend => friend.mobile),
      intelligentSettlements
    };
    const apiParams = {
      name: 'groups',
      data: params
    };
    const response = await Http.put(apiParams);
    return response;
  },

  updateGroup: async (currentUser, groupName, friends, intelligentSettlements, id) => {
    const params = {
      auth_key: currentUser.auth_key,
      name: groupName,
      friends: friends.map(friend => friend.mobile),
      intelligentSettlements,
      id
    };
    const apiParams = {
      name: 'groups',
      data: params
    };
    const response = await Http.post(apiParams);
    return response;
  },

  getGroups: async currentUser => {
    const params = {
      auth_key: currentUser.auth_key
    };
    const apiParams = {
      name: 'groups',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
