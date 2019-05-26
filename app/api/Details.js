/* @flow */

import Http from 'app/api/HTTP';

module.exports = {
  getDetails: async currentUser => {
    const params = {
      auth_key: currentUser.auth_key
    };
    const apiParams = {
      name: 'get_details',
      data: params
    };
    const response = await Http.get(apiParams);
    return response;
  }
};
