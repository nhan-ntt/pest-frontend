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


export const API_URL = API_BASE_URL + `/predict`;
export const API_URL_PLAN = API_BASE_URL + `/plan`;

export const Create: CreateProps<any> = async (data: any) => {
  // Get the current user ID from Redux store or localStorage
  const auth = store.getState().auth;
  console.log("Auth state:", auth);
  
  // // First try the standard location
  // let userId = auth?.id;
  
  // // If not found, try alternative locations
  // if (!userId) {
  //   userId = auth?.user?.id || auth?.user?._id || auth?._id || localStorage.getItem('userId');
  //   console.log("Using alternative userId:", userId);
  // }
  // console.log("Final userId:", userId);
  
  let payload = { ...data };
  if (payload) {
    payload.state = data?.state?.name_with_type;
    payload.city = data?.city?.name_with_type;
    payload.district = data?.district?.name_with_type;
    payload.pestLevelId = data?.lastPestLevel?._id;
    payload.user = auth;
    
    // Make sure timeStart is set
    if (!payload.timeStart) {
      payload.timeStart = new Date().toISOString();
    }
  }
  
  // Now validate all required fields
  if (!payload.state || !payload.city || !payload.district || !payload.timeStart || !payload.user) {
    console.error("Missing required fields:", {
      state: !!payload.state,
      city: !!payload.city, 
      district: !!payload.district,
      timeStart: !!payload.timeStart,
      user: !!payload.user
    });
    return Promise.reject(new Error("PREDICT.POST.INVALID_PARAMS"));
  }
  
  console.log("Sending final payload to API:", payload);
  return axios.post(`${API_URL}`, payload);
};

export const getPestLevelApi = () => {
  return axios.post(`${API_BASE_URL}/pestLevel/get-pest-level`);
};

export const getPlantStageApi = () => {
  return axios.post(`${API_URL}/get-list-plant-stage`);
};

export const GetAll: GetAllPropsServer<any> = ({ queryProps, sortList, paginationProps }) => {
  return axios.post(`${API_URL}/get-predict`, {
    queryProps: queryProps ?? {},
    sortList,
    paginationProps,
  });
};

export const GetPredictInMobile = (data: any) => {
  let payload = { ...data };
  payload = {
    state: data.state.name_with_type || 1,
    city: data.city.name_with_type || '',
    district: data.district.name_with_type || '',
  };
  return axios.post(`${API_BASE_URL}/get-predict-by-address`, payload);
};

export const GetById = (_id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/${_id}`)
      .then(data => {
        resolve({ data: data?.data || {} });
      })
      .catch(() => {
        reject(null);
      });
  });
};

export const GetUserById = (_id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/user/get-user-by-id`, { id: _id })
      .then(data => {
        resolve({ data: data?.data?.user || {} });
      })
      .catch(() => {
        reject(null);
      });
  });
};

export const EndPredict = async (entity: any) => {
  return axios.post(`${API_URL}/end-predict`, {
    ...entity,
    isFinish: true,
  });
};

export const Get: GetProps<any> = entity => {
  return axios.get(`${API_URL}/${entity.id}`);
};

export const Update: UpdateProps<any> = async (entity: any) => {
  let payload = { ...entity };
  // console.log('payload', payload);
  if (payload) {
    payload.state = entity?.state?.name_with_type;
    payload.city = entity?.city?.name_with_type;
    payload.district = entity?.district?.name_with_type;
    payload.lastPestLevel = entity?.lastPestLevel?._id;
    payload.currentPestLevel = entity?.currentPestLevel?._id;

  }
  return axios.post(`${API_URL}/update-predict`, payload);
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/remove-predict`, { _id: entity._id });
};

export const DeleteMany: DeleteManyProps<any> = (entities: any[]) => {
  return axios.delete(`${API_URL_PLAN}/update-predict`, {
    data: { data: entities },
  });
};

export const CustomPostRequest = (url: string, data: any) => {
  const _axios = axios.create();
  return _axios({
    url: url,
    method: 'post',
    data: data,
  });
};
