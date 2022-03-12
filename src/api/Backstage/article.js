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
export const addArticle = (article) => {
    return request({
        url: 'backstage/article/addArticle',
        method: 'post',
        data: {
            articleContent: JSON.stringify(article.articleContent),
            articleId: article.articleId,
            articleTitle: article.articleTitle,
            articleShort: article.articleShort,
        },
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

export const getDetail = (ids) => {
    return request({
        url: 'backstage/article/detail/' + ids,
        method: 'get'
    })
}

