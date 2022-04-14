import request from '@/utils/request'

export const login = (loginUser) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data: loginUser,
        params: {
            captchaVerification: loginUser.captchaVerification,
            code: loginUser.verifyCode
        }
    })
}

export const logout = () => {
    return request({
        url: '/auth/logout',
        method: 'post'
    })
}

export const captcha = () => {
    return request({
        url: '/auth/captcha',
        method: 'post'
    })
}
export const register = (loginUser) => {
    return request({
        url: '/auth/register',
        method: 'post',
        data: loginUser,
        params: {
            code: loginUser.mailCode
        }
    })
}
export const getRegisterEmail = (loginUser) => {
    return request({
        url: '/auth/registerMail',
        method: 'post',
        data: loginUser,
        params: {
            captchaVerification: loginUser.captchaVerification,
            code: loginUser.verifyCode
        }
    })
}

