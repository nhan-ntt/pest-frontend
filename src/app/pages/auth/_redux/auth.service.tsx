import axios from 'axios';
import { API_BASE_URL } from '../../../common-library/common-consts/enviroment';


const AUTH_BASE_URL = API_BASE_URL + '/auth';

export const REGISTER_URL = AUTH_BASE_URL + '/register';
export const LOGIN_URL = AUTH_BASE_URL + '/login';


/**
 *{
    "email": "nhanexpert@gmail.com",
    "name": "nhan",
    "password": "19112004",
    "role": "expert"
}
 */
export const Register = (userData: any) => {
  return axios.post(REGISTER_URL, userData);
}

/**
 * {
    "email": "nhanadmin@gmail.com",
    "password": "19112004"
}
 */
export const Login = (email: string, password: string) => {
  return axios.post(LOGIN_URL, {email, password});
}

// export const CREDENTIAL_URL = AUTH_BASE_URL + '/credential';
// export const PING_URL = AUTH_BASE_URL + '/ping';
// export const IDENTITY_URL = AUTH_BASE_URL + '/identity/';

// export const REQUEST_PASSWORD_URL = AUTH_BASE_URL + '/verify';
// export const CHANGE_PASSWORD_URL = AUTH_BASE_URL + '/password';
// export const SET_TEMP_PASSWORD_URL = AUTH_BASE_URL + '/temp-password';

// export function GetCredential(email: string) {
//   return axios.post(CREDENTIAL_URL, 
//     { email }
//    );
// }

// export const Ping = () => {
//   return axios.post(PING_URL, {});
// };

// export function requestPassword(email: string) {
//   return axios.post(REQUEST_PASSWORD_URL, { email });
// }

// export const ChangePassword = (data: any) => {
//   return axios.post(CHANGE_PASSWORD_URL, data);
// };

// export const SetTempPassword = (data: { publicKey: string; encryptedPrivateKey: string }) => {
//   return axios.post(SET_TEMP_PASSWORD_URL, data);
// };
// export const SetPassword = (data: { publicKey: string; encryptedPrivateKey: string }) => {
//   return axios.post(CHANGE_PASSWORD_URL, data);
// };

// export function getUserFromIdentity(username: string) {
//   return axios.get(IDENTITY_URL + username);
// }

// export function saveIdentity(
//   username: any,
//   rs_password: any,
//   signature: any,
//   en_private_key: any,
//   public_key: any,
// ) {
//   return axios.post(IDENTITY_URL, { username, rs_password, signature, en_private_key, public_key });
// }
