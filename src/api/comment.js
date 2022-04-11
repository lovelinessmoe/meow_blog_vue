import request from "@/utils/request";

export const getComment = (articleId) => {
    return request({
        url: 'comment/getComment/' + articleId,
        method: 'get'
    })
}

export const addComment = (comment) => {
    return request({
        url: 'comment/addComment',
        method: 'post',
        data: comment
    })
}
