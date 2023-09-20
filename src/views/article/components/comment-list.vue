<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :immediate-check="false" 
  @load="onLoad"
>
  <comment-item 
    v-for="(item, index) in list" 
    :key="index" 
    :comment="item"
    @reply-click="$emit('reply-click', $event)"
  />
</van-list> 
</template>

<script>
// 获取评论模块
import { getComments } from '@/api/comment'
// 文章评论项渲染模板
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  data() {
    return {
      // list: [], //把list定义到父组件中，让父组件对其进行操控
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
    };
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 父组件需要就绑定一个下来，不需要子组件直接用,这是引用类型
    },
    type: {
      type: String,
      // 数据验证
      validator (value) {
        return ['a', 'c'].includes(value) // 传参只能是其中两个
      },
      default: 'a'
    }
  },
  created () {
    // 当手动初始 onLoad ，它不会自动开始初始的 loading
    // 所以要手动的开启初始 loading
    this.loading = true
    this.onLoad() // 绑定:immediate-check="false"属性，避免手动启动onLoad()后,下面又再次启动onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        //    type
        //      a 文章的评论
        //      c 评论的回复
        //    source
        //      文章的评论，则传递文章的 ID
        //      评论的回复，则传递评论的 ID
        // 1. 请求获取数据
        const {data} = await getComments({
          type: this.type, // 评论类型这里不能写死
          source: this.source.toString(), // 源id，文章id或评论id,提前toString,避免axios字符串拼接出错
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 将评论总数传递到外部
        this.$emit('onload-success', data.data)

        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有数据就把当页最后一个评论id给偏移量加载下一页数据
          this.offset = data.data.last_id
        }
        else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
  }
}
</script>

<style scoped lang="less"></style>