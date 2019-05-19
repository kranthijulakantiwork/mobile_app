/* @flow */

module.exports = {
  getApiPath: (apiParams: Object) => {
    let getAuthString = params => {
      let authString = '';
      if (params.data.user_id) {
        authString = `user[id]=${params.data.user_id}`;
      }
      return authString;
    };

    switch (apiParams.name) {
      case 'get_friends':
        return 'friends';
      case 'get_groups':
        return 'groups';
      case 'bill':
        return 'bill';
      case 'bills_friends':
        return 'bills/friends';
      case 'bills_groups':
        return 'bills/groups';
      case 'add_group':
        return 'groups';
      case 'login':
        return 'login';
      case 'send_otp':
        return 'sendOTP';
      default:
        return 'unknown route';
    }
  },
  API_KEY: 'API_KEY'
};
