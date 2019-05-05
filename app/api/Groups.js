/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  addGroup: async (currentUser, groupName, friends, intelligentSettlements) => {
    const params = {
      user_id: currentUser.server_id,
      auth_key: currentUser.access_token,
      'Group Name': groupName,
      'Phone Numbers': friends.map(friend => friend.mobile),
      'Intelligent Settlements': intelligentSettlements
    };
    const apiParams = {
      name: 'add_group',
      data: params
    };
    const response = await Http.post(apiParams);
    return response;
  },

  getGroups: async currentUser => {
    const params = {
      user_id: currentUser.server_id,
      auth_key: currentUser.access_token
    };
    const apiParams = {
      name: 'get_groups',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
