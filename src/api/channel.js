import request from "@/utils/request";

// 获取所有频道
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}

// 后台添加用户频道
export const addUserChannel = channel => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

// 后台删除用户频道
export const deleteUserChannel = channelId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`
    })
}