/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  recordSettlement: async (currentUser, data) => {
    const params = {
      auth_key: currentUser.auth_key,
      ...data
    };
    const apiParams = {
      name: 'record_settlement',
      data: params
    };
    const response = await Http.put(apiParams);
    return response;
  }
};
