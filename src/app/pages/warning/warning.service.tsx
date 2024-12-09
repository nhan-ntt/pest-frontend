import axios from 'axios';
import { API_BASE_URL } from '../../common-library/common-consts/enviroment';

export const getWarningLevelApi = async () => {
    return axios.post(`${API_BASE_URL}/pestLevel/get-pest-level`);
};
  
export const updateWarningURLApi = async (data: any) => {
    return axios.post(`${API_BASE_URL}/pestLevel/update-pest-level`, data);
};