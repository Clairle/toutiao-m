<template>
  <div class="home-container">
        <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 标签页 -->
    <van-tabs v-model="active" class="channel-tabs" swipeable>
      <van-tab v-for="channel in channels" 
      :title="channel.name" 
      :key="channel.id">
      <!-- 频道文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>

      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道弹出层 -->
    <van-popup 
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <channel-edit 
      :user-channels="channels"
      :active="active"
      @update-active="onUpdateActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
// 频道获取
import { getUserChannels } from '@/api/user';
// 频道文章列表
import ArticleList from './components/article-list' 
// 频道编辑模块
import ChannelEdit from './components/channel-edit.vue'
// 用户token
import { mapState } from 'vuex'
// 本地token取用
import { getItem } from '@/utils/storage'

export default {
 name: 'HomePage',
 components: {
  ArticleList,
  ChannelEdit,
 },
 data() {
  return {
    active: 0,  //选择一开始激活的标签
    channels: [], // 频道列表
    isChennelEditShow: false // 控制频道弹出层变量
  }
 },
 created() {
  // 获取用户的频道列表
  this.loadChannels()
 },
 methods: {
  // 获取用户的频道列表
  async loadChannels() {
    try {
      let channels = []
      if (this.user) {
        // 已登录，请求获取用户频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      }
      else {
        // 未登录，判断是否有本地的频道列表数据
        const localChannels = getItem('TOUTIAO_CHANNELS')
        //    有，拿来使用
        if (localChannels) {
          channels = localChannels
        }
        else {
          //    没有，请求获取默认频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    } catch (err) {
      this.$toast('获取用户频道失败')
    }
  },
  onUpdateActive (index, isChennelEditShow = true) {
    // 更新激活的频道项
    this.active = index
    // 关闭编辑频道弹层
    this.isChennelEditShow = isChennelEditShow
  }
 }
}
</script>

<style lang='less' scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 400px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    padding: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }


  // 导航栏样式
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    // 汉堡按钮设置
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
