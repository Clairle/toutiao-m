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

    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
    >
    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
        <van-image
          class="avatar"
          fit="cover"
          round
          :src="user.photo"
          @click="$refs.file.click()"
        />
    </van-cell>
    <van-cell 
      title="昵称" 
      :value="user.name" 
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell 
      title="性别" 
      :value="user.gender === 0 ? '男' : '女'" 
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell 
      title="生日" 
      :value="user.birthday" 
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name 
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-model="user.gender"
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
// 获取登录用户信息模块
import { getUserProfile } from '@/api/user'
// 编辑昵称模块
import UpdateName from './components/update-name'
// 编辑性别模块
import UpdateGender from './components/update-gender'
// 编辑生日模块
import UpdateBirthday from './components/update-birthday'
// 编辑头像模块
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 后台获取的个人信息
      isUpdateNameShow: false, // 修改昵称弹出层显示控制
      isUpdateGenderShow: false, // 修改性别弹出层
      isUpdateBirthdayShow: false, // 修改生日弹出层
      img: null, // 图片url
      isUpdatePhotoShow: false // 修改头像弹出层
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
    },

    // 用户头像文件选中编辑
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
  
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
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