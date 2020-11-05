import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

export interface IHttpClientRequestParameters<T> {
  url: string;
  requiresToken: boolean;
  payload?: T;
}
export interface IHttpClient {
  get<T>(parameters: IHttpClientRequestParameters<T>): Promise<T>;
  post<T>(parameters: IHttpClientRequestParameters<T>): Promise<T>;
}


export class HttpClient implements IHttpClient {
  
    getToken = () => {
    return;
  };

  get<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, requiresToken } = parameters;

      const options: AxiosRequestConfig = {
        headers: {},
      };

      if (requiresToken) {
        const token = this.getToken();
        options.headers.RequestVariationsToken = token;
      }

      axios
        .get(url, options)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((response: any) => {
          reject(response);
        });
    });
  }

  post<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, payload, requiresToken } = parameters;

      // axios request options like headers etc
      const options: AxiosRequestConfig = {
        headers: {},
      };

      // if API endpoint requires a token, we'll need to add a way to add this.
      if (requiresToken) {
        const token = this.getToken();
        options.headers.RequestVerificationToken = token;
      }

      // finally execute the GET request with axios:
      axios
        .post(url, payload, options)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((response: any) => {
          reject(response);
        });
    });
  }
}

export const httpClient = new HttpClient();
