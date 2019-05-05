/* @flow */

import { SERVER_URL } from 'app/config/ENV';
import { getApiPath } from 'app/api/helper';
import { NetInfo } from 'react-native';
import showToast from 'app/helpers/Toast';
import I18n from 'app/config/i18n';
// import store from 'app/helpers/Store';
import { enableReload, disableReload } from 'app/reducers/netInfo/Actions';

type apiParams = {
  name: string,
  data: Object,
  type: string
};

async function checkNetworkInfoAndprepareRequest(api_params) {
  let invalid = ['none', 'unknown'];
  // store.dispatch(enableReload());
  const connectivity = await NetInfo.getConnectionInfo();
  if (!invalid.includes(connectivity.type)) {
    // store.dispatch(disableReload());
    return prepareRequest(api_params);
  } else {
    if (!['unknown'].includes(connectivity.type)) {
      showToast({
        message: I18n.t('please_check_your_internet_connection')
      });
    }
  }
  return {
    success: false,
    network_error: true
  };
}

function getRequestHeader(requestParams: apiParams) {
  const { type, data } = requestParams;
  if (type === 'GET') {
    return {};
  }
  return {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
}

function getRequestUrl(requestParams: apiParams) {
  return SERVER_URL + getApiPath(requestParams);
}

function handleErrorResponse(serverResponse, { showServerError, hideError }) {
  if (!hideError) {
    const message =
      showServerError && serverResponse.errors
        ? serverResponse.errors
        : I18n.t('api_error_message');
    showToast({ message });
  }
  return { success: false, error: serverResponse.errors || I18n.t('api_error_message') };
}

async function makeApiCall(
  requestUrl: string,
  requestHeader: Object,
  { showServerError = false, hideError = false }
) {
  try {
    const response = await fetch(requestUrl, requestHeader);
    const { status } = response;
    const serverResponse = await response.json();
    if (serverResponse.errors || status >= 400) {
      return handleErrorResponse(serverResponse, { showServerError, hideError });
    }
    return { success: true, data: serverResponse };
  } catch (error) {
    showToast({ message: I18n.t('api_error_message') });
    return { success: false, error };
  }
}

function prepareRequest(requestParams: apiParams) {
  const requestUrl = getRequestUrl(requestParams);
  const requestHeader = getRequestHeader(requestParams);
  return makeApiCall(requestUrl, requestHeader, {
    showServerError: requestParams.showError,
    hideError: requestParams.hideError
  });
}

module.exports = {
  get: (apiRequestParams: apiParams) => {
    const requestParams = Object.assign({ type: 'GET' }, apiRequestParams);
    return checkNetworkInfoAndprepareRequest(requestParams);
  },

  post: (apiRequestParams: apiParams) => {
    const requestParams = Object.assign({ type: 'POST' }, apiRequestParams);
    return checkNetworkInfoAndprepareRequest(requestParams);
  },

  put: (apiRequestParams: apiParams) => {
    const requestParams = Object.assign({ type: 'PUT' }, apiRequestParams);
    return checkNetworkInfoAndprepareRequest(requestParams);
  },

  delete: (apiRequestParams: apiParams) => {
    const requestParams = Object.assign({ type: 'DELETE' }, apiRequestParams);
    return checkNetworkInfoAndprepareRequest(requestParams);
  }
};
