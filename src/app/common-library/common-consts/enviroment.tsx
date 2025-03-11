import axios from 'axios';

export const CERTIFICATE_EXP = 1000 * 60 * 60;
export const PROJECT_NAME = 'medical-chain';
// export const APP_TITLE: string = process.env.REACT_APP_TITLE ?? '';

export const API_BASE_URL = (() => {
    const { REACT_APP_API_BASE_URL,  } = process.env;
    return REACT_APP_API_BASE_URL ?? '';
})();

export const BASE_URL =
    API_BASE_URL.indexOf('http') === 0
        ? API_BASE_URL.split('/').slice(0, 3).join('/')
        : '';

console.log({ API_BASE_URL });

// TODO: Pincode....
export const USE_PIN_CODE = false;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;