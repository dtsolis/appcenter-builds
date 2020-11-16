const request = require('request-promise');
const config = require('../config');

let _appcenterToken = config.appcenterToken;

const setAppCenterToken = (token) => {
  _appcenterToken = token;
}

const _request = (endpoint, method, data) => {
  if (!_appcenterToken) {
    return Promise.reject('Environment variable "APP_CENTER_TOKEN" has not been specified. Ignore.');
  }

  let options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-Token': _appcenterToken,
    },
    method,
    uri: `https://api.appcenter.ms/v0.1/${endpoint}`,
  };
  if (data != null) {
    options = {
      ...options,
      body: JSON.stringify(data)
    };
  }
  return request(options).then(res => JSON.parse(res));
}

const getApps = (owner) => {
  const endpoint = owner != null && owner !== '' ? `orgs/${owner}/apps?%24orderBy=display_name` : 'apps?%24orderBy=display_name';
  return _request(endpoint, 'GET');
}

const getAppBranches = (owner, app) => {
  const endpoint = `apps/${owner}/${app}/branches`;
  return _request(endpoint, 'GET');
}

const getAppBuilds = (owner, app, branch = 'master') => {
  const endpoint = `apps/${owner}/${app}/branches/${branch}/builds`;
  return _request(endpoint, 'GET');
}

/**
 *
 *
 * @param {*} owner
 * @param {*} app
 * @param {*} build_id
 * @param {'build' | 'bundle' | 'symbols' | 'mapping' | 'logs'} download_type
 * @returns
 */
const getDownloadInfoForBuild = (owner, app, build_id, download_type) => {
  const endpoint = `apps/${owner}/${app}/builds/${build_id}/downloads/${download_type}`;
  return _request(endpoint, 'GET');
}

module.exports = {
  setAppCenterToken,
  getApps,
  getAppBranches,
  getAppBuilds,
  getDownloadInfoForBuild,
};
