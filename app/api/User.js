import HTTP from 'app/api/HTTP';
import { API_KEY } from 'app/api/helper';

function login(phone, otp) {
  const params = {
    phone,
    otp,
    auth_key: API_KEY
  };
  const apiParams = {
    name: 'login',
    data: params,
    showError: true
  };
  return HTTP.post(apiParams).then(({ success, data, error }) => ({ success, data, error }));
}

function sendOtp(phone) {
  const params = {
    phone,
    auth_key: API_KEY
  };
  const apiParams = {
    name: 'send_otp',
    data: params,
    showError: true
  };
  return HTTP.post(apiParams).then(({ success, data, error }) => {
    if (success) {
      return { success, ...data };
    }
    return { success: false, error };
  });
}

function getUserInfo(auth_key) {
    const params = {
      auth_key: auth_key
    };
    const apiParams = {
      name: 'update_user_info',
      data: params,
      showError: true
    };
    return HTTP.get(apiParams).then(({ success, data, error }) => {
      if (success) {
        return { success, ...data };
      }
      return { success: false, error };
    });
}

function logOut(currentUser) {
    const params = {
        auth_key: currentUser.auth_key
    };
    const apiParams = {
      name: 'logout',
      data: params
    };
    return HTTP.put(apiParams).then(response => {
      if (response.network_error) {
        return response;
      }
      currentUser.update({ auth_key: null });
      return { success: true };
    });
  }

  
function updateUserInfo(data, auth_key) {
    const params = {
      ...data,
      auth_key: auth_key
    };
    const apiParams = {
      name: 'update_user_info',
      data: params,
      showError: true
    };
    return HTTP.post(apiParams).then(({ success, data, error }) => {
      if (success) {
        return { success, ...data };
      }
      return { success: false, error };
    });
}

module.exports = {
  login,
  sendOtp,
  updateUserInfo,
  getUserInfo,
  logOut
};
