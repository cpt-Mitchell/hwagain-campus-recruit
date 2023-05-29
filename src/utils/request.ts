import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import { API_URL } from '@/utils/constants'
import { setLoadingStatus } from './index'

const service = axios.create({
  baseURL: API_URL,
  timeout: 20000
})

// http请求拦截器
service.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getters
    if (accessToken) {
      // @ts-ignore
      // config.headers.Authorization = `JWT  ${accessToken}`
      // config.headers.Authorization = `${accessToken}`
      config.headers['ambass-token'] = `${accessToken}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// http响应拦截器
service.interceptors.response.use(
  (response: any) => {
    const { status, data, statusText } = response
    if (status === 200) {
      if (data.success && (data.data !== null && data.data !== undefined)) {
        return data.data
      } else {
        setLoadingStatus(false)
        if (data.stackMsg && data.stackMsg.includes('非法请求校招接口')) {
          Toast({ message: '登录信息过期' })
          store.dispatch('setLoginStatus', 0)
          window.location.href = window.location.origin + (process.env.VUE_APP_BASE_URL || '')
          // window.location.reload()
        } else {
          Toast({ message: data.msg || data.message || '查询无信息返回，请联系后台管理员' })
        }
        return Promise.reject(Error(data.msg || data.message))
      }
    } else {
      setLoadingStatus(false)
      if (status === 401 || status === 403) {
        store.dispatch('setLoginStatus', 0)
        // window.location.reload()
        window.location.href = window.location.origin + (process.env.VUE_APP_BASE_URL || '')
      } else {
        // TODO错误提示
        if (statusText) {
          Toast({ message: statusText })
        }
        setLoadingStatus(false)
        return Promise.reject(Error(data.msg || data.message))
      }
    }
  },
  (err: any) => {
    setLoadingStatus(false)
    Toast({ message: err.message || err.responseMessage })
    return Promise.reject(err)
  }
)

export default service
