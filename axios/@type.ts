import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method, ResponseType } from 'axios'

export interface Token {
  access_token: string
  [key: string]: any
}

export interface UrlConfigs {
  PROTOCOL: string
  HOST: string
  GATEWAY_PATH: string
  ACCOUNT_PATH: string
  OPS_PATH: string
  STATISTICS_PATH: string
  DS_CENTER_PATH: string
  [key: string]: any
}

export interface RequestConfig extends AxiosRequestConfig {
  url: string
  path: string
  data?: any
  method?: Method
  params?: any
  isFile?: boolean
  headers?: AxiosHeaders
  responseType?: ResponseType
  isJson?: boolean
  contentType?: string
  withoutToken?: boolean
  isRefresh?: boolean
}

export interface Result<T> extends AxiosResponse {
  data: {
    data: T
    code: number
    msg: string
    [key: string]: any
  }
}
