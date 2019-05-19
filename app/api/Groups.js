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
      name: 'add_group',
      data: params
    };
    const response = await Http.put(apiParams);
    return response;
  },

  getGroups: async currentUser => {
    const params = {
      auth_key: currentUser.auth_key
    };
    const apiParams = {
      name: 'get_groups',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
