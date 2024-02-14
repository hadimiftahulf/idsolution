import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const sendApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL}/api`,
});

const setAuthorizationHeader = (token: string | null): void => {
  if (token) {
    sendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete sendApi.defaults.headers.common["Authorization"];
  }
};

export const sendRequest = async <T>(
  url: string,
  method: AxiosRequestConfig["method"] = "GET",
  data: AxiosRequestConfig["data"] = null,
  token: string | null = null
): Promise<T> => {
  setAuthorizationHeader(token);

  try {
    const response: AxiosResponse<T> = await sendApi({
      method,
      url,
      data,
    });

    return response.data;
  } catch (error: any) {
    throw (error.response?.data as T) || error.message;
  }
};
