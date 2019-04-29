/* @flow */

module.exports = {
  getApiPath: (apiParams: Object) => {
    let getAuthString = params => {
      let authString = '';
      if (params.data.user_id) {
        authString = `user[id]=${params.data.user_id}&device[id]=${
          params.data.device_id
        }&device[access_token]=${params.data.access_token}`;
      }
      return authString;
    };

    switch (apiParams.name) {
      default:
        return 'unknown route';
    }
  }
};
