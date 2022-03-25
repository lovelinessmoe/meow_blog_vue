import request from '@/utils/request'

export const getList = (current, size, params) => {
    return request({
        url: 'article/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

