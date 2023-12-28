import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "./config";

export const axiosProtect = axios.create({
    baseURL: baseUrl
})

axiosProtect.interceptors.response.use(
    function (response: AxiosResponse) {
        return response;
    },
    function (error: AxiosError) {
        const statusCode = error.response?.status
        return Promise.reject(error);
    }
);

export const setCredentialRequest = ({ token }: { token: string | null }) => {
    return new Promise((resolve, reject) => {
        axiosProtect.defaults.headers.common['Authorization'] = token !== null ? 'Bearer ' + token : null;
        resolve(true)
    })
}

export const axiosPublic = axios.create({
    baseURL: baseUrl
})