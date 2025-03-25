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
import { UserModel } from './user.model';
import _ from 'lodash';
import { formatParamsGet } from '../../common-library/helpers/axios-slice';

export const API_URL = API_BASE_URL + `/admin`;
export const API_URL_USER = API_BASE_URL + `/user`;
export const API_URL_ROLE = API_BASE_URL + `/role`;


// Now your API calls don't need to include auth headers manually
export const Create: CreateProps<any> = (data: any) => {
  return axios.post(`${API_BASE_URL}/admin/create-user-web-app`, {...data});
};

export const createWithTransform = (data: any) => {
  // Create a new object with transformed values
  const transformedData = {
    ...data,
    // For role, use _id
    role: data.role?._id || data.role,
    
    // For location fields, use name_with_type
    state: data.state?.name_with_type || data.state,
    city: data.city?.name_with_type || data.city,
    district: data.district?.name_with_type || data.district
  };
  
  console.log("Creating user with transformed data:", transformedData);
  
  // Call the original Create function with transformed data
  return Create(transformedData);
};

// export const Create: CreateProps<any> = (data: any) => {
//   // Transform the data to extract IDs from objects
//   const transformedData = {
//     ...data,
//     role: data.role?._id || data.role?.id || data.role,
//     state: data.state?.code || data.state?._id || data.state,
//     city: data.city?.code || data.city?._id || data.city,
//     district: data.district?.code || data.district?._id || data.district
//   };
  
//   return axios.post(`${API_BASE_URL}/admin/create-user-web-app`, transformedData);
// };

export const GetAll: GetAllPropsServer<any> = ({ queryProps, sortList, paginationProps }) => {
  return axios.post(`${API_BASE_URL}/admin/web-app/get-user`, {
    queryProps,
    sortList,
    paginationProps,
  });
};

export const GetAllByAdmin: GetAllPropsServer<any> = ({ queryProps, sortList, paginationProps }) => {
  return axios.post(`${API_BASE_URL}/admin/get-user`, {
    queryProps,
    sortList,
    paginationProps,
  });
};

export const Count: CountProps<UserModel> = queryProps => {
  return axios.post(`${API_URL}/get/count`, {
    params: { ...queryProps },
  });
};

export const GetById = (_id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL_USER}/get-user-by-id`, { id: _id })
      .then(data => {
        resolve({ data: data?.data?.user || {} });
      })
      .catch(() => {
        reject(null);
      });
  });
};

export const Get: GetProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}`);
};

export const Update: UpdateProps<any> = (entity: any) => {
  // Log the incoming entity
  console.log("Update function called with entity:", entity);
  
  // Properly transform the data to match API expectations
  const payload = {
    ...entity,
    // Extract name_with_type for location fields if they're objects
    state: entity?.state?.name_with_type || entity?.state,
    city: entity?.city?.name_with_type || entity?.city,
    district: entity?.district?.name_with_type || entity?.district,
    // Extract role._id and set as roleId
    roleId: entity?.role?._id || entity?.roleId || entity?.role
  };
  
  // Remove role property since we're using roleId
  if (payload.role && payload.roleId) {
    delete payload.role;
  }
  
  console.log("Sending API request with payload:", payload);
  
  // Call the API with proper error handling
  return axios.post(`${API_BASE_URL}/admin/update-user`, payload)
    .then(response => {
      console.log("Update API response:", response);
      return response;
    })
    .catch(error => {
      console.error("Update API error:", error.response?.data || error);
      throw error;
    });
};

export const updateWithTransform = (data: any) => {
  console.log("updateWithTransform called with data:", data);
  
  // Create a transformed object that matches API expectations
  const transformedData = {
    ...data,
    // Extract role ID
    roleId: data.role?._id || data.roleId || data.role,
    
    // Keep location fields as strings
    state: data.state?.name_with_type || data.state,
    city: data.city?.name_with_type || data.city,
    district: data.district?.name_with_type || data.district
  };
  
  // Remove role property if roleId is set
  if (transformedData.role && transformedData.roleId) {
    delete transformedData.role;
  }
  
  console.log("Transformed update data:", transformedData);
  
  // Call the Update function with transformed data
  return Update(transformedData);
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/remove-user`, { id: entity._id });
};

export const DeleteMany: DeleteManyProps<any> = (entities: any[]) => {
  return axios.delete(API_URL, { data: entities });
};

export const BanUser: any = (entity: any) => {
  return axios.post(`${API_URL}/ban-user`, { id: entity?._id });
};

export const LookAccount: any = (id: string) => {
  return axios.post(`${API_URL}/lock-account`, { id: id });
};

export const getRoles: any = (entity: any) => {
  return axios.post(`${API_BASE_URL}` + '/role/get-roles', entity);
};

export const getNamebyRole: any = (role: string) => {
  return axios.post(`${API_BASE_URL}/role/name`, { role }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });};