/* @flow */

module.exports = {
  getApiPath: (apiParams: Object) => {
    switch (apiParams.name) {
      case 'get_friends':
        return 'friends';
      case 'get_groups':
        return 'groups';
      case 'bill':
        return 'bill';
      case 'bills_friends':
        return 'bills/friends/' + apiParams.data.id;
      case 'bills_groups':
        return 'bills/groups/' + apiParams.data.id;
      case 'update_user_info':
        return 'userInfo';
      case 'add_group':
        return 'groups';
      case 'login':
        return 'login';
      case 'send_otp':
        return 'sendOTP';
      case 'get_details':
        return 'getDetails';
      default:
        return 'unknown route';
    }
  },
  API_KEY: 'eb88d166-1924-4319-acaf-8f38ff3405f7'
};
