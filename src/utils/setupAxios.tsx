import { SignMessage } from '../app/pages/auth/service/auth-cryptography';
import { AxiosStatic } from 'axios';
import { EnhancedStore } from '@reduxjs/toolkit';

const qs = require('qs');
const GetActionModule = (_url: string) => {
  const pathname = _url[0] === '/' ? _url : new URL(_url).pathname;
  return pathname?.replaceAll('/', '-').substring(1);
};

export default function setupAxios(axios: AxiosStatic, store: EnhancedStore) {
  axios.interceptors.request.use(
    config => {
      config.paramsSerializer = params => {
        return qs.stringify(params, { allowDots: true, arrayFormat: 'comma', encode: false });
      };
      const url = config.url ?? '';
      if (
        url.indexOf('/auth/credential') > -1 ||
        url.indexOf('/auth/otp/forgot') > -1 ||
        url.indexOf('/auth/otp') > -1 ||
        url.indexOf('/provinces.open-api.vn') > -1
      ) {
        return config;
      }
      const { auth } = store.getState();
      if (auth.id) {
        config.headers.Authorization = `${JSON.stringify(auth._certificate)}`;
        const getActionType = () => {
          return (config.method + '_' + GetActionModule(config.url ?? '/')).toUpperCase();
        };
        if (config.method !== 'GET') {
          if (config.data) {
            if (auth._privateKey) {
              if (config.data instanceof FormData) {
                config.data.append('_timestamp', new Date().getTime().toString());
                config.data.append('_actionType', getActionType());
                const sig = JSON.stringify(Object.fromEntries(config.data));
                const signature = SignMessage(auth._privateKey, sig);
                config.headers['Content-Type'] = 'multipart/form-data';
                config.data.append('_signature', signature);
                return config;
              } else {
                config.data = {
                  ...config.data,
                  _actionType: getActionType(),
                  _timestamp: new Date().getTime(),
                };
                const signature = SignMessage(auth._privateKey, config.data);
                config.data = {
                  data: { ...config.data },
                  // ...config.data,
                  _signature: signature,
                };
              }
            }
          } else {
            config.data = {
              ...config.data,
              _actionType: getActionType(),
              _timestamp: new Date().getTime(),
            };
            const signature = SignMessage(auth._privateKey, config.data);
            config.data = {
              data: { ...config.data },
              // ...config.data,
              _signature: signature,
            };
          }
        }
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );
  axios.interceptors.response.use(
    next => {
      const nextData = next.data;
      return Promise.resolve(nextData);
    },
    error => {
      if (!error.response) return Promise.reject(error);
      return Promise.reject(error);
    },
  );
}
