import defaultTo from 'lodash-es/defaultTo'
import Request from './instance'
import { RequestConfig, UrlConfigs } from './@type'

export enum Paths {
  GateWay = 'gateway',
  Account = 'account',
  Ops = 'ops',
  Statictics = 'statistics',
  Gpubiz = 'gpubiz',
  Acm = 'acm',
}

const https = async () => {
  const config = await new Promise<UrlConfigs>(resolve => {
    import('./config').then(config => {
      const { default: urlConfig } = config
      resolve(urlConfig)
    })
  }).then(urlConfig => {
    return urlConfig
  })
  return new Request(config)
}

async function send<T>(config: RequestConfig) {
  const axiosInstance = await https()
  return axiosInstance.request<T>(config)
}

const instance = {
  get: <T>(config: RequestConfig) => {
    return send<T>({
      ...config,
      url: config.url,
      params: config.data,
      path: config.path,
      method: 'GET',
      contentType: 'application/x-www-form-urlencoded',
    })
  },
  post: <T>(config: RequestConfig) => {
    return send<T>({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      isFile: defaultTo(config.isFile, false),
      isJson: defaultTo(config.isJson, true),
      method: 'POST',
      responseType: config.responseType,
      contentType: defaultTo(config.isFile, false)
        ? 'multipart/form-data;'
        : defaultTo(config.isJson, true)
        ? 'application/json;charset=utf-8'
        : 'application/x-www-form-urlencoded',
    })
  },
  put: <T>(config: RequestConfig) => {
    return send<T>({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      method: 'PUT',
      contentType: 'application/json',
    })
  },
  patch: <T>(config: RequestConfig) => {
    return send<T>({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      method: 'PATCH',
      contentType: 'application/json',
    })
  },
  delete: <T>(config: RequestConfig) => {
    return send<T>({
      ...config,
      url: config.url,
      path: config.path,
      method: 'DELETE',
      contentType: 'application/json',
    })
  },
}

export default instance
