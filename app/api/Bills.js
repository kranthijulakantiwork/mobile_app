/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getBills: async currentUser => {
    const params = {
      user_id: currentUser.server_id,
      auth_key: currentUser.access_token
    };
    const apiParams = {
      name: 'get_bills',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  },

  addBill: async (currentUser, billDetails) => {
    const params = {
      user_id: currentUser.server_id,
      auth_key: currentUser.access_token,
      ...billDetails
    };
    const apiParams = {
      name: 'add_bill',
      data: params
    };
    const response = await Http.post(apiParams);
    return response;
  }
};
