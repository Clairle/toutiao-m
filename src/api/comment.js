import request from '@/utils/request'

// 获取文章评论列表
export const getComments = params => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        // GET 参数使用 params 进行传递
        // axios 会把 我们传递的params对象
        // 转为 key=value?key=value 的格式放到 header中的 url 中发送
        // 但是当文章id超出js数子安全范围时转换就会出问题
        params
    })
}

// 评论点赞
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data: {
            target
        }
    })
}

// 取消评论点赞
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`,
        data: {
            target
        }
    })
}

// 发表评论或者评论回复
export const addComment = data => {
    return request ({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}
