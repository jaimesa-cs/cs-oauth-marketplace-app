import axios, { AxiosInstance } from "axios";

import { HOST } from "../hooks/oauth/constants";

const instance = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response.data.err)
);

export default instance;
