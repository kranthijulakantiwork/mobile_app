/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getFriends: async currentUser => {
    const params = {
      auth_key: currentUser.auth_key
    };
    const apiParams = {
      name: 'get_friends',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
