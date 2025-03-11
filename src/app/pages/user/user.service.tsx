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
  return axios.post(`${API_BASE_URL}/admin/users`, {...data});
};

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
  return axios.post(`${API_URL_USER}/update-user`, {
    ...entity,
    city: entity?.city?.name_with_type,
    state: entity?.state?.name_with_type,
    district: entity?.district?.name_with_type,
    roleId: entity.role._id,
  });
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