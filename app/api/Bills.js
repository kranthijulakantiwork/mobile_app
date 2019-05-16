/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getBills: async currentUser => {
    const params = {
      auth_key: currentUser.auth_key
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
      auth_key: currentUser.auth_key,
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
