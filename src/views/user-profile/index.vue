<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
        <van-image
          class="avatar"
          fit="cover"
          round
          :src="user.photo"
        />
    </van-cell>
    <van-cell 
      title="昵称" 
      :value="user.name" 
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link/>
    <van-cell title="生日" :value="user.birthday" is-link/>
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name @close="isUpdateNameShow = false"/>
    </van-popup>
    <!-- /编辑昵称 -->
  </div>
</template>

<script>
// 获取登录用户信息模块
import { getUserProfile } from '@/api/user'
// 编辑昵称模块
import UpdateName from './components/update-name.vue'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
  },
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 修改昵称弹出层显示控制
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    // 获取用户信息处理方法
    async loadUserProfile () {
      try {
        const {data} = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
    .avatar {
        width: 60px;
        height: 60px;
    }

    .van-popup {
      background-color: #f5f7f9;
    }
}

</style>