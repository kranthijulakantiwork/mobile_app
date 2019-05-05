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
        return 'listFriends?' + getAuthString(apiParams);
      case 'get_groups':
        return 'listGroups?' + getAuthString(apiParams);
      case 'get_bills':
        return 'listBills?' + getAuthString(apiParams);
      case 'add_bill':
        return 'addBill';
      case 'add_group':
        return 'addGroup';
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
