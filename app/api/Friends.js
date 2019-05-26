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
  },

  getUPIAddress: async (currentUser, mobile) => {
    const params = {
      auth_key: currentUser.auth_key,
      mobile
    };
    const apiParams = {
      name: 'get_upi',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
