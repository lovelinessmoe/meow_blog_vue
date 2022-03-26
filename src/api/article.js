import request from '@/utils/request'

export const getList = (current, size, params) => {
    return request({
        url: 'article/getList',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const getBlogDetail = (articleId) => {
    return request({
        url: 'article/detail/' + articleId,
        method: 'get',
        params: articleId
    })
}

