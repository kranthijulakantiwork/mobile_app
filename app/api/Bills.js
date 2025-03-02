/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getFriendsBills: async (currentUser, id) => {
    const params = {
      auth_key: currentUser.auth_key,
      id
    };
    const apiParams = {
      name: 'bills_friends',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  },

  getGroupsBills: async (currentUser, id) => {
    const params = {
      auth_key: currentUser.auth_key,
      id
    };
    const apiParams = {
      name: 'bills_groups',
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
      name: 'bill',
      data: params
    };
    const response = await Http.put(apiParams);
    return response;
  },

  updateBill: async (currentUser, billDetails) => {
    const params = {
      auth_key: currentUser.auth_key,
      ...billDetails
    };
    const apiParams = {
      name: 'bill',
      data: params
    };
    const response = await Http.post(apiParams);
    return response;
  },

  deleteBill: async (currentUser, id) => {
    const params = {
      auth_key: currentUser.auth_key,
      id
    };
    const apiParams = {
      name: 'delete_bill',
      data: params
    };
    const response = await Http.delete(apiParams);
    return response;
  }
};
