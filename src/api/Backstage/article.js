import request from '@/utils/request'

export const getList = (current, size, params) => {
    return request({
        url: 'backstage/article/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const add = (article) => {
    return request({
        url: 'backstage/article/submit',
        method: 'post',
        data: article,
    })
}
export const saveOrUpdateArticle = (article) => {
    return request({
        url: 'backstage/article/saveOrUpdateArticle',
        method: 'post',
        data: article,
    })
}

export const update = (row) => {
    return request({
        url: 'backstage/article/submit',
        method: 'post',
        data: row
    })
}

export const remove = (articleId) => {
    return request({
        url: 'backstage/article/remove',
        method: 'post',
        params: {
            articleId,
        }
    })
}
export const removeMany = (articleList) => {
    return request({
        url: 'backstage/article/removeMany',
        method: 'post',
        data: articleList
    })
}

export const getDetail = (ids) => {
    return request({
        url: 'backstage/article/detail/' + ids,
        method: 'get'
    })
}

export const switchTop = (articleId) => {
    return request({
        url: 'backstage/article/switchTop',
        method: 'post',
        params: {
            articleId,
        }
    })
}

