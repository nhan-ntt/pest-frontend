import axios from "axios";
import { API_BASE_URL } from "../../../../common-library/common-consts/enviroment";

const api = API_BASE_URL + '/notification'

export const GetNotification = (page?: number, limit?: number) => {
    if (!page) page = 1;
    if (!limit) limit = 10;
    return axios.get(api, { params: { page, limit } })
}