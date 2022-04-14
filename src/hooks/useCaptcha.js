import {reactive} from 'vue'
import {captcha} from '@/api/login'

export default function () {

    const captchaVal = reactive({
        captchaVerification: '',
        verifyCode: '',
        captchaImg: ''
    });

    async function getCaptcha() {
        let captchaRes = await captcha()
        captchaVal.captchaImg = captchaRes.data.img
        captchaVal.captchaVerification = captchaRes.data.captchaVerification
        captchaVal.verifyCode = ''
    }

    return {getCaptcha, captchaVal}
}
