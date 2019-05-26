/* @flow */

module.exports = {
  getApiPath: (apiParams: Object) => {
    switch (apiParams.name) {
      case 'get_friends':
        return 'friends';
      case 'groups':
        return 'groups';
      case 'bill':
        return 'bills';
      case 'delete_bill':
        return 'bills/' + apiParams.data.id;
      case 'bills_friends':
        return 'bills/friends/' + apiParams.data.id;
      case 'bills_groups':
        return 'bills/groups/' + apiParams.data.id;
      case 'update_user_info':
        return 'userInfo';
      case 'get_upi':
        return 'getUpi/' + apiParams.data.mobile;
      case 'login':
        return 'login';
      case 'send_otp':
        return 'sendOTP';
      case 'get_details':
        return 'getDetails';
      case 'record_settlement':
        return 'settlement';
      default:
        return 'unknown route';
    }
  },
  API_KEY: 'eb88d166-1924-4319-acaf-8f38ff3405f7'
};
