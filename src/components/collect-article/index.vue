<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
// 文章收藏接口
import { addCollect, deleteCollect } from '@/api/article'
export default {
    name: 'CollectArticle',
    props: {
        value: {
            type: Boolean,
            required: true
        },
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    data () {
        return {
            loading: false
        }
    },
    methods: {
        async onCollect () {
            this.loading = true
            try {
                if (this.value) {
                    // 已收藏，取消收藏
                    await deleteCollect(this.articleId)
                }
                else {
                    // 没有收藏，添加收藏
                    await addCollect(this.articleId)
                }
                // 更新视图
                this.$emit('input', !this.value)
            } catch (err) {
                this.$toast.fail('操作失败，请重试！') //v-model会自动接收处理
                // 这里收藏状态的后台数据更新并不是立即的，所以需要!this.value来判断状态
                this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
            }
            this.loading = false
        }
    }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500 !important;
  }
}
</style>