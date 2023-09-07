<template>
    <div class="article-list">
        <!-- 
             List 组件通过 loading 和 finished 两个变量控制加载状态，
             当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
         -->
        <!-- 
            load事件触发两次，初始化后和数据加载完毕后
         -->
        <van-pull-refresh 
            v-model="refreshing" 
            :success-text="refreshSuccessText"
            :success-duration="1000"
            @refresh="onRefresh"
        >
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="请求失败，点击重新加载"
                @load="onLoad"
            >

                <article-item
                    v-for="(article, index) in list"
                    :key="index"
                    :article="article"
                />
                <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
            </van-list>
        </van-pull-refresh>
    </div>
</template>
  
<script>
// 引入获取文章列表数据方法
import { getArticles } from '@/api/article'
// 列表中每个文章的结构模块
import ArticleItem from '@/components/article-item'
  export default {
    name: 'ArticleList',
    components: {
        ArticleItem,
    },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    data () {
      return {
        list: [], // 存储列表数据的数组
        loading: false, // 控制加载中 loading 状态
        finished: false, // 控制数据加载结束的状态
        timestamp: null, // 请求获取下一页数据的时间戳
        error: false, // 错误提示参数
        refreshing: false, // 下拉刷新提示参数
        refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
      }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        // 数据初始化或者滚动到底部时调用
        async onLoad() {
            try {
                // 1. 请求获取数据
                const { data } = await getArticles({
                    channel_id: this.channel.id, //频道id
                    timestamp: this.timestamp || Date.now(),
                })


                // // 模拟随机失败的情况
                // if (Math.random() > 0.5) {
                // JSON.parse('dsnajndjsa')
                // }


                // 2. 把请求结果数据放到 list 数组中
                const {results} = data.data //追加文章列表
                this.list.push(...results)
                // 3. 本次数据加载结束之后要把加载状态设置为结束
                this.loading = false
                // 4. 判断数据是否全部加载完成
                if (results.length) {
                    this.timestamp = data.data.pre_timestamp
                }
                else {
                    this.finished = true
                }
            } catch (err) {
                this.error = true; // 展示错误提示状态
                this.loading = false
            }
            
        },

        // 下拉刷新控制函数
        async onRefresh () {
            try {
                // 1. 请求获取数据
                const { data } = await getArticles({
                    channel_id: this.channel.id, //频道id
                    timestamp: this.timestamp || Date.now(),
                })
             // 2. 将数据追加到列表的顶部
             const { results} = data.data
             this.list.unshift(...results)
             // 3. 关闭下拉刷新的 loading 状态
             this.refreshing = false
             // 更新下拉刷新成功提示的文本
             this.refreshSuccessText = `刷新成功，更新了${results.length}数据`
            } catch(err) {
                this.refreshSuccessText = '刷新成功'
                this.refreshing = false
            }
        }
    }
  }
</script>
  
<style scoped lang="less">
.article-list {
    // 固定高度，溢出滚动，让列表产生自己的滚动容器
    // 让每个列表记住自己的滚动位置
  height: 79vh;
  overflow-y: auto;
}
</style>
  