<template>
    <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
>已关注</van-button>
<van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
>关注</van-button>
</template>

<script>
// 用户关注相关
import {addFollow, deleteFollow} from '@/api/user'
export default {
name: 'FollowUser',
model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
},
props: {
    isFollowed:{
        type: Boolean,
        required: true
    },
    userId: {
        type: [Number, String, Object],
        required: true
    }
},
data() {
    return {
        loading: false // 展示关注按钮的loading状态
    }
},

methods: {
    // 关注按钮方法
    async onFollow () {
        this.loading = true
        try{
        if (this.isFollowed) {
            // 关注了就取消关注
        await deleteFollow(this.userId)
        }
        else {
        // 没关注就添加关注
        await addFollow(this.userId)
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
        } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
            message = '你不能关注你自己'
        }
        this.$toast(message)
        }
        this.loading = false
    }
}
}
</script>

<style>

</style>