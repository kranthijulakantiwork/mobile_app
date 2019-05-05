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

module.exports = {
  login,
  sendOtp
};
