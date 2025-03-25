import axios from 'axios';
import { API_BASE_URL } from '../../common-library/common-consts/enviroment';
import {
  CountProps,
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  GetAllPropsServer,
  GetProps,
  UpdateProps,
} from '../../common-library/common-types/common-type';
import { formatParamsGet, removeValueFromObject } from '../../common-library/helpers/axios-slice';

import store from '../../../redux/store';


export const API_URL = API_BASE_URL + `/report`;
export const API_URL_PREDICT = API_BASE_URL + `/predict`;
export const API_URL_PLAN = API_BASE_URL + `/plan`;

export const Create: CreateProps<any> = async (data: any) => {
  console.log('running false');

  const auth = store.getState().auth;
  console.log("Auth state:", auth);

  let payload = { ...data };
  if (payload?.city) payload.city = data.city.name_with_type;
  if (payload?.state) payload.state = data.state.name_with_type;
  if (payload?.district) payload.district = data.district.name_with_type;
  if (payload?.pestLevel) payload.pestLevel = data.pestLevel.value;  
  
  payload.userId = auth.id;

  payload = removeValueFromObject(payload, null);

  return axios.post(`${API_URL}`, payload);
};

export const GetAll: GetAllPropsServer<any> = ({ queryProps, sortList, paginationProps }) => {
  return axios.post(`${API_URL}/get-report`, {
    queryProps,
    sortList,
    paginationProps,
  });
};


export const CreateReportAPI = (data: {
  state: string;
  city: string;
  district: string;
  timeEnd: string;
  pestLevel: string;
  note?: string;
  address?: string;
}) => {
  return axios.post(`${API_BASE_URL}/report`, {
    ...data,
    address: data?.address ?? '',
    note: data?.note ?? '',
  });
};


export const GetById = (_id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/get-report-by-id`, { reportId: _id })
      .then(data => {
        resolve({ data: data?.data || {} });
      })
      .catch(() => {
        reject(null);
      });
  });
};

export const Update: UpdateProps<any> = async (entity: any) => {
  let payload = { ...entity };
  if (payload?.city) payload.city = entity.city.name_with_type;
  if (payload?.state) payload.state = entity.state.name_with_type;
  if (payload?.district) payload.district = entity.district.name_with_type;
  if (payload?.pestLevel) payload.pestLevel = entity.pestLevel.value;  
    
  payload = removeValueFromObject(payload, null);

  return axios.post(`${API_URL}/update-report`, payload);
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/remove-report`, { reportId: entity._id });
};

export const DeleteMany: DeleteManyProps<any> = (entities: any[]) => {
  return axios.delete(API_URL, {
    data: { data: entities },
  });
};

export const getPestLevelApi = () => {
  return axios.post(`${API_BASE_URL}/pestLevel/get-pest-level`);
};
export const getPlantStageApi = () => {
  return axios.post(`${API_URL_PREDICT}/get-list-plant-stage`);
};

// export const Get: GetProps<any> = entity => {
//   return axios.post(`${API_URL}/${entity.id}`);
// };

// export const Lock: any = (entity: any) => {
//   return axios.post(`${API_URL}/${entity.id}/ban`, { data: { id: entity.id } });
// };

// export const Unlock: any = (entity: any) => {
//   return axios.post(`${API_URL}/${entity.id}/unban`, { data: { id: entity.id } });
// };

// export const Count: CountProps<any> = queryProps => {
//   return axios.post(`${API_URL}/get/count`, {
//     params: { ...queryProps },
//   });
// };

// export const GetPreSignedURL = (data: {
//   UserId: string;
//   filename: string;
//   contentLength: number;
// }) => {
//   return axios.post(API_BASE_URL + '/upload-url', data).then(res => res.data);
// };

// export const handleUploadImage = async (listImg: any[]): Promise<string> => {
//   if (listImg.length < 1) return '';

//   const data = await GetPreSignedURL({
//     filename: listImg[0].name as string,
//     contentLength: listImg[0].size as number,
//     UserId: '',
//   });

//   const { form: headers, url } = data;

//   const formData = new FormData();
//   for (const key in headers) {
//     formData.append(key, headers[key]);
//   }
//   const file = listImg[0];
//   formData.append('file', file, headers.key);

//   await CustomPostRequest(url, formData).catch((error: any) => {
//     throw new Error(error);
//   });
//   return url + headers.key;
// };

// export const CustomPostRequest = (url: string, data: any) => {
//   const _axios = axios.create();
//   return _axios({
//     url: url,
//     method: 'post',
//     data: data,
//   });
// };
