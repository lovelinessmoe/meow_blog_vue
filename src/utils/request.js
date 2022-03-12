import axios from 'axios'
import {ElNotification} from 'element-plus'
import {getToken, removeToken, removeUser} from '@/utils/token'

const instance = axios.create({
    baseURL: 'http://localhost:80',
    // baseURL: 'http://192.168.2.167:80',
    timeout: 10000
})

// request拦截器
instance.interceptors.request.use(config => {
    if (getToken()) {
        config.headers.Authorization = getToken()
    }
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器
instance.interceptors.response.use(response => {
    const res = response.data
    if (!res.success) {
        ElNotification({
            message: res.message,
            title: '警告',
            type: 'warning'
        })

        //登陆过期
        if (res.code === 2002) {
            removeUser()
            removeToken()
            window.location.href = '/login'
        }

        // return Promise.reject(res)
        return response.data
    } else {
        if (res.message !== null) {
            ElNotification({
                message: res.message,
                title: '提示',
                type: 'success'
            })
        }
        return response.data
    }
}, error => {
    ElNotification.error({
        title: '网络错误' + error,
        message: '服务器超时'
    })
    return Promise.reject('error')
})
//其他主键可以访问
export default instance
