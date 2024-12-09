import axios from 'axios';
import { API_BASE_URL } from '../../common-library/common-consts/enviroment';
// import _ from 'lodash';

export const GetProvince: any = (code: string) => {
  return axios.post(`${API_BASE_URL}/user/get-address-info`, {
    type: 'state',
    parentCode: code || '0'
  });
};

export const GetDistrict: any = (code: string) => {
  return axios.post(`${API_BASE_URL}/user/get-address-info`, {
    type: 'city',
    parentCode: code || '0'
  });
};

export const GetWards: any = (code: string) => {
  return axios.post(`${API_BASE_URL}/user/get-address-info`, {
    type: 'district',
    parentCode: code || '0'
  });
};

// export const GetProvince: any = () => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`https://provinces.open-api.vn/api/p/`)
//       .then(data => {
//         resolve({ data: data });
//       })
//       .catch(() => {
//         reject(null);
//       });
//   });
// };

// export const GetDistrict: any = (code: number) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
//       .then((data: any) => {
//         resolve({ data: data.districts });
//         console.log('data.districts', data.districts);
//       })
//       .catch(() => {
//         reject(null);
//       });
//   });
// };

// export const GetWards: any = (code: number) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
//       .then((data: any) => {
//         resolve({ data: data.wards });
//         console.log('data.wards', data.wards);
//       })
//       .catch(() => {
//         reject(null);
//       });
//   });
// };
