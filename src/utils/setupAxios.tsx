import { AxiosStatic } from 'axios';
import { EnhancedStore } from '@reduxjs/toolkit';

const qs = require('qs');

export default function setupAxios(axios: AxiosStatic, store: EnhancedStore) {
  // Request interceptor - handles authorization and params
  axios.interceptors.request.use(
    config => {
      // Configure params serialization for consistency
      config.paramsSerializer = params => {
        return qs.stringify(params, { allowDots: true, arrayFormat: 'comma', encode: false });
      };
      
      // Set Authorization header with JWT token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (token && token.length > 20) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added auth token to request:", config.url);
      } else {
        delete config.headers.Authorization;
      }
      
      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );
  
  // Response interceptor - handles responses and errors
  axios.interceptors.response.use(
    next => {
      const nextData = next.data;
      return Promise.resolve(nextData);
    },
    error => {
      // Add token expiration handling if needed
      if (error.response && error.response.status === 401) {
        console.log("Authentication failed - might need to refresh token or redirect to login");
      }
      return Promise.reject(error);
    },
  );
}
