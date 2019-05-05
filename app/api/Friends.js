/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getFriends: async currentUser => {
    const params = {
      user_id: currentUser.server_id,
      auth_key: currentUser.access_token
    };
    const apiParams = {
      name: 'get_friends',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
