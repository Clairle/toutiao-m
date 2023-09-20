<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
    :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
    >
      <van-icon
      slot="left"
      name="cross"
      @click="$emit('close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->
    <div class="scroll-warp">
      <!-- 当前回复的评论项 -->
      <comment-item :comment="comment"/>
      <!-- /当前回复的评论项 -->

      <!-- 评论回复列表 -->
      <van-cell title="全部回复"/>
      <comment-list 
        :list="commentList"
        :source="comment.com_id"
        type="c"
      />
    <!-- /评论回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="reply-bottom">
        <van-button
          class="write-btn"
          size="small"
          round
          @click="isPostShow = true"
        >写评论</van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
        <comment-post
            :target="comment.com_id"
            @post-success="onPostSuccess"
        />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
// 评论项模块
import CommentItem from './comment-item'
// 回复模块复用评论列表模块
import CommentList from './comment-list'
// 发布评论模块复用
import CommentPost from './comment-post'

export default {
    name: 'CommentReply',
    components: {
        CommentItem,
        CommentList,
        CommentPost,
    },
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            isPostShow: false,
            commentList: [] // 通过父组件定义拿到子组件props中的评论的回复列表数据
        }
    },
    methods: {
        onPostSuccess (data) {
            console.log(data)
            // 更新回复数量
            this.comment.reply_count++
            
            // 关闭弹出层，通过v-model控制
            this.isPostShow = false

            // 更新视图，将回复放到列表顶部
            this.commentList.unshift(data.new_obj)
        }
    },
}
</script>

<style scoped lang="less">
.scroll-warp {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto; // 元素内容在垂直方向上超出了容器的高度，自动添加垂直滚动条
}
.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>