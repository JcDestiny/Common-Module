import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import isObject from "lodash-es/isObject";
import qs from "qs";
import { useToken } from "@/store/user";
import { yfAlert } from "@/utils/message";
import { Paths } from ".";
import { RequestConfig, Result, UrlConfigs } from "./@type";

const ERROR_CODE = {
  NO_AUTH: 40100, //  token已过期
  FORBIDDEN: 40300, // '无权限'
  ERROR: 50000, // 服务器异常
};

const ERROR_MSG = {
  40100: "登录已过期, 请重新登录",
  40300: "无权限, 请联系管理员",
};

let _isFirstToast: boolean = true;

class Request {
  _instance: AxiosInstance;
  _baseConfig: AxiosRequestConfig = { baseURL: "", timeout: 60000 };
  _urlConfig: UrlConfigs;

  constructor(config: UrlConfigs) {
    this._urlConfig = config;
    this._instance = axios.create(
      Object.assign(this._baseConfig, {
        baseUrl: `${config.PROTOCOL}${config.HOST}`,
      })
    );

    // 请求拦截
    this._instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const innoreUrl: string[] = ["/config.json"];
        if (config.url && innoreUrl.includes(config.url)) {
          return config;
        }
        if (!config.withoutToken) {
          const store = useToken();
          const token = store.Token;
          if (token) {
            config.headers.Authorization = token;
          }
        }
        return config;
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err);
      }
    );

    //返回;
    this._instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // FIX 因服务器原因返回html数据导致存储错误数据，刷新页面无反应必须清空缓存重登陆的 BUG
        const { data } = res;
        if (`${data}`.startsWith("<!DOCTYPE html>")) {
          res.data = "";
        }
        return res || {};
      },
      (err: any) => {
        const res = err?.response || {};
        if (res) {
          const errcode = res?.data?.code;
          if (
            errcode === ERROR_CODE.NO_AUTH ||
            errcode === ERROR_CODE.FORBIDDEN
          ) {
            if (_isFirstToast) {
              _isFirstToast = false;
              yfAlert(ERROR_MSG[errcode], "error");
            }
            new Promise((resolve) => {
              const store = useToken();
              store.logOut();
              setTimeout(() => {
                resolve(null);
              }, 1000);
            }).then(() => {
              location.replace("/login");
            });
            return Promise.reject(null);
          }
        }
        return Promise.reject(err);
      }
    );
  }

  request<T>(config: RequestConfig): Promise<Result<T>> {
    return this._instance.request<T, Result<T>>(this.overwriteConfig(config));
  }

  toUrl(path: string): string {
    if (!path) return "";
    const pathConfig = {
      [Paths.GateWay]: `${this._baseConfig.baseURL}${this._urlConfig.GATEWAY_PATH}`,
      [Paths.Account]: `${this._baseConfig.baseURL}${this._urlConfig.ACCOUNT_PATH}`,
      [Paths.Ops]: `${this._baseConfig.baseURL}${this._urlConfig.OPS_PATH}`,
      [Paths.Statictics]: `${this._baseConfig.baseURL}${this._urlConfig.STATISTICS_PATH}`,
      [Paths.Gpubiz]: `${this._baseConfig.baseURL}${this._urlConfig.DS_CENTER_PATH}`,
      [Paths.Acm]: `${this._baseConfig.baseURL}${this._urlConfig.ACM_PATH}`,
    };
    return pathConfig[path as keyof typeof pathConfig] || "";
  }

  toData(data: any, isFile?: boolean, isJson?: boolean, method?: string): any {
    if (isFile) {
      return data;
    }
    if (method === "POST") {
      if (isJson) {
        return JSON.stringify(data);
      }
      return qs.stringify(data, { allowDots: true });
    }
    return data;
  }

  toGetParams(params: Record<string, any>): any {
    const data: any = {};
    for (const param in params) {
      if (isObject(params[param])) {
        for (const key in params[param]) {
          data[`${param}.${key}`] = params[param][key];
        }
      } else {
        data[param] = params[param];
      }
    }
    return data;
  }

  overwriteConfig(config?: RequestConfig): AxiosRequestConfig {
    if (config === undefined) {
      return {};
    }
    const axiosConfig: AxiosRequestConfig = {};
    const url = this.toUrl(config.path);
    axiosConfig.url = url + config.url;
    axiosConfig.data = this.toData(
      config.data,
      config.isFile,
      config.isJson,
      config.method
    );
    axiosConfig.params = this.toGetParams(config.params);
    axiosConfig.headers = {
      "Content-Type": config.contentType,
      "Without-Token": config.withoutToken,
    };
    axiosConfig.responseType = config.responseType;
    axiosConfig.method = config.method;
    return axiosConfig;
  }
}

export default Request;
