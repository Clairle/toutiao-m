// 导入用户相关的请求模块
import request from "@/utils/request.js";
// 导入数据容器模块 vuex
import store from "@/store/index"
import Target from "ol/events/Target";

// 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}

// 发送验证码
// 每手机号每分钟1次
export const getSmsCode = mobile => {
    return request({
        method: 'GET',
        url: '/v1_0/sms/codes/:mobile'
    })
}

// 获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user',
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

// 获取用户频道列表
// 不强制用户登录，匿名用户返回后台设置的默认频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

// 关注用户
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target
        }
    })
}

// 取消关注用户
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`
    })
}

// 获取当前登录用户的个人资料
export const getUserProfile = () => {
    return request ({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}