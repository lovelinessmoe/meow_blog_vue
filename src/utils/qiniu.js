import request from "@/utils/request";
import {upload} from 'qiniu-js'

function getQiNiuToken() {
    return request({
        url: 'qiniu/getQiNiuToken',
        method: 'get'
    })
}


export async function uploadImg(file, observer) {
    let token = await getQiNiuToken();
    token = token.data;
    let config = {
        useCdnDomain: true,
    };
    let observable = upload(file, null, token, {}, config)
    observable.subscribe(observer) // 上传开始
}

