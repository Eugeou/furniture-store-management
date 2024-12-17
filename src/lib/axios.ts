import { logout } from '@/redux/slices/auth.slice'
import { store } from '@/redux/store'
import { refreshTokenService } from '@/services/auth-service'
import envConfig from '@/configs/config'
//import { notifyError } from '@/utils/helpers/notify.helper'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'
import { a } from 'framer-motion/m'


const axiosClient = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
})

// axiosClient.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
//   const token = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : ''
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
  
// })

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    //console.log('session', session?.accessToken) 
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const userId = localStorage.getItem('userId')
        if (refreshToken && userId) {
          try {
            const { access } = await refreshTokenService(refreshToken, userId)
            if (access) {
              localStorage.setItem('accessToken', access)
              axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access}`
              originalRequest.headers['Authorization'] = `Bearer ${access}`
              return axiosClient(originalRequest)
            }
          } catch (error) {
            // Dispatch action để clear Redux (đăng xuất người dùng)
            store.dispatch(logout())
            console.error(error)
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!')
          }
        }
      } catch (error) {
        console.error(error)
        // notifyError(error?.response?.data?.message || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!')
      }
      return new Promise((reject) => {
        reject(error)
      })
    } else {
      return Promise.reject(error)
    }
  }
)
export default axiosClient
