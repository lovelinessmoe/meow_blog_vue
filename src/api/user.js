import request from "@/utils/request";

export const getUserInfo = () => {
    return request({
        url: 'user/getUserInfo',
        method: 'get',
    })
}

export const getModifyInfMail = (captchaVal) => {
    return request({
        url: 'user/modifyInfMail',
        method: 'post',
        params: {
            captchaVerification: captchaVal.captchaVerification,
            code: captchaVal.verifyCode
        }
    })
}

export const updateUserInfoApi = (user, mailCode) => {
    return request({
        url: 'user/updateUserInfo',
        method: 'post',
        data: user,
        params: {
            mailCode
        }
    })
}
