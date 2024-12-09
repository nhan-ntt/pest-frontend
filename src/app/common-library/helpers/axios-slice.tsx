import { createSlice } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from "axios";
const initialFactory = {
  factory: new Map<String, AxiosInstance>()
};


export const axiosSlice = createSlice({
  name: 'axios',
  initialState: initialFactory,
  reducers: {
    getAxiosInstance: (state, action) => {
      // console.log(action.payload);
    },
    addAxiosInstance: (state, action) => {
      console.log('call axios slice')
      console.log(action.payload);
      state.factory = state.factory.set(action.payload.instanceName, axios.create());
    }
  }
});

export const formatParamsGet = (queryProps: any, sortList: any, paginationProps: any) => {
  queryProps = queryProps || {}
  const limit = paginationProps?.limit || 5;
  const page = paginationProps?.page || 1;
  let params = { limit, offset: (page - 1) * limit };
  return { ...params, ...queryProps };
}

export const removeValueFromObject = (obj: any, value: any) => {
  return Object.entries(obj)
    .filter(([_, v]) => v != value)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}