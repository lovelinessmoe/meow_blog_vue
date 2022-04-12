import axios from 'axios'
import {ElNotification} from 'element-plus'
import {removeUser} from '@/utils/token'
import store from '@/store'

const instance = axios.create({
    baseURL: process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://javaee.xyz:8088',
    timeout: 10000
})

// request拦截器
instance.interceptors.request.use(config => {
    if (store.state.user) {
        config.headers.Authorization = store.state.user.token
    }
    return config
}, error => {
    Promise.reject(error)
})

// response拦截器
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
