<template>
    <div class="article-container">
      <!-- 导航栏 -->
      <van-nav-bar
        class="page-nav-bar"
        left-arrow
        title="黑马头条"
        @click-left="$router.back()"
      ></van-nav-bar>
      <!-- /导航栏 -->
  
      <div class="main-wrap">
        <!-- 加载中 -->
        <div v-if="loading" class="loading-wrap">
          <van-loading
            color="#3296fa"
            vertical
          >加载中</van-loading>
        </div>
        <!-- /加载中 -->
  
        <!-- 加载完成-文章详情 -->
        <div v-else-if="article.title" class="article-detail">
          <!-- 文章标题 -->
          <h1 class="article-title">{{ article.title }}</h1>
          <!-- /文章标题 -->
  
          <!-- 用户信息 -->
          <van-cell class="user-info" center :border="false">
            <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="article.aut_photo"
            />
            <div slot="title" class="user-name">{{ article.aut_name}}</div>
            <div slot="label" class="publish-date">{{ article.pudate | relativeTime }}</div>

            <!-- 关注按钮 -->
            <!--
              模板中的 $event 是事件参数
              当传递给子组件的数据既要使用又要修改时，如
              is-followed="article.is_followed"
              @update-is_followed="article.is_followed = $event"
              可以在组件上使用v-model
              该语法会传递一个props:value="article.is_followed"
              并返回一个事件和参数@input="article.is_followed = $event"

              如果需要修改 v-model 的规则名称，可以通过子组件的 model
             -->
            <follow-user
              class="follow-btn"
              v-model="article.is_followed"
              :user-id="article.aut_id"
              
            />
            <!-- <van-button
              v-if="article.is_followed"
              class="follow-btn"
              round
              size="small"
              :loading="followloading"
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
              :loading="followloading"
              @click="onFollow"
            >关注</van-button> -->

          </van-cell>
          <!-- /用户信息 -->
  
          <!-- 文章内容 -->
          <div 
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
          ></div>
          <van-divider>正文结束</van-divider>
          <!-- 文章评论列表 -->
          <comment-list
            :source="article.art_id"
            :list="commentList"
            @onload-success="totalCommentCount = $event.total_count"
            @reply-click="onReplyClick"
          />
        <!-- /文章评论列表 -->
          <!-- 底部区域 -->
          <div class="article-bottom">
            <van-button
              class="comment-btn"
              type="default"
              round
              size="small"
              @click="isPostShow = true"
            >写评论</van-button>
            <van-icon
              name="comment-o"
              :badge="totalCommentCount"
              color="#777"
            />
            <collect-article 
              v-model="article.is_collected"
              :article-id="article.art_id"
            />
            <like-article
              name="good-job-o"
              v-model="article.attitude"
              :article-id="article.art_id"
            />
            <van-icon name="share" color="#777777"></van-icon>
          </div>
          <!-- /底部区域 -->

          <!-- 发布评论弹出层 -->
          <van-popup 
          v-model="isPostShow" 
          position="bottom" 
          >
            <comment-post
              :target="article.art_id"
              @post-success="onPostSuccess"
            />
          </van-popup>
        </div>
        <!-- /加载完成-文章详情 -->
        
  
        <!-- 加载失败：404 -->
        <div v-else-if="errStatus === 404" class="error-wrap">
          <van-icon name="failure" />
          <p class="text">该资源不存在或已删除！</p>
        </div>
        <!-- /加载失败：404 -->
  
        <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
        <div v-else class="error-wrap">
          <van-icon name="failure" />
          <p class="text">内容加载失败！</p>
          <van-button 
           class="retry-btn"
           @click="loadArticle"
          >点击重试</van-button>
        </div>
        <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      </div>
        <!-- 评论回复 -->
        <!-- 
          弹出层时是懒加载的，当弹出层只有第一次会渲染数据，
          当其关闭时，并不会销毁所渲染的组件，因此下一次打开不会渲染新的数据
          之后他的显示和隐藏都是隐藏和显示第一次渲染的数据
          而v-if有销毁渲染的功能
        -->
        <van-popup 
          v-model="isReplyShow" 
          position="bottom" 
          style="height: 100%"
        >
          <comment-reply
            v-if="isReplyShow"
            :comment="currentComment"
            @close="isReplyShow = false"
          />
        </van-popup>
        <!-- /评论回复 -->      
    </div>
</template>
  
<script>
// 文章详情接口
import { getArticleById } from '@/api/article'
// vant图片浏览功能
import { ImagePreview } from 'vant'
// 关注用户按钮
import FollowUser from '@/components/follow-user'
// 收藏按钮
import CollectArticle from '@/components/collect-article'
// 点赞按钮
import LikeArticle from '@/components/like-article'
// 文章评论列表组件
import CommentList from './components/comment-list'
// 发布评论组件
import CommentPost from './components/comment-post'
// 评论回复组件
import CommentReply from './components/comment-reply'

export default {
    name: 'ArticleIndex',
    components: {
      FollowUser,
      CollectArticle,
      LikeArticle,
      CommentList,
      CommentPost,
      CommentReply
    },

    // 依赖注入给所有的后代组件提供数据
    // 注意：不要滥用
    provide: function () {
      return {
        articleId: this.articleId
      }
    },

    props: {
        articleId: {
        type: [Number, String, Object],
        required: true
        }
    },
    data () {
        return {
            article: {}, // 文章详情
            loading: true, //加载页面显示参数
            errStatus: 0 ,// 失败的状态码
            totalCommentCount:0, // 文章评论总数
            isPostShow: false, // 控制发布评论的显示状态
            commentList: [], // 评论列表
            isReplyShow: false, // 控制回复弹出层的显示
            currentComment: {} // 回复的评论项的信息
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadArticle()
    },
    mounted () {},
    methods: {
        async loadArticle () {
            try {
                const {data} = await getArticleById(this.articleId)

                // // 未知错误页面功能测试代码
                // if (Math.random() > 0.5) {
                //     JSON.parse('sdffssafasfdsadf')
                // }
                
                // 数据更新影响dom这件事儿不是立即的
                this.article = data.data 

                // 初始化图片点击预览
                // console.log(this.$refs['article-content'])
                setTimeout(() => {
                  this.previewImage() // 图片预览函数
                })

            } catch (err) {
                console.log(err)
                // 后端返回404判断
                if (err.response && err.response.status === 404) {
                    this.errStatus = 404
                }
            }
            // 无论加载数据成功还是失败，都需要关闭loading页面
            this.loading = false
        },

        // 图片预览方法
        previewImage() {
          // 得到所有的 img 节点
          const articleContent = this.$refs['article-content']
          const imgs = articleContent.querySelectorAll('img')

          // 获取所有 img 地址
          const images = []
          imgs.forEach((img, index) => {
            images.push(img.src)

            // 给每个 img 注册点击事件，在处理函数中调用预览
            img.onClick = () => {
              ImagePreview({
                // 预览的图片地址数组
                images,
                // 起始位置，从 0 开始
                startPosition: index
              })
            }
          })
        },

        // 评论发布后处理方法
        onPostSuccess (data) {
          // 关闭弹出层
          this.isPostShow = false
          // 将发布对象显示列表顶部
          this.commentList.unshift(data.new_obj)
        },

        //点击回复按钮处理方法
        onReplyClick (comment) {
          // 将当前回复评论的评论对象信息储存在当前组件中
          this.currentComment = comment
          // 显示评论回复弹出层
          this.isReplyShow = true
        }
    }
}
</script>
  
<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>