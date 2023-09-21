<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img">

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
// 图像裁剪
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs';

// 更新头像后台接口
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: {
    img: {
        type: [String, Object],
        required: true
    }
  },
  data () {
    return {
        cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      aspectRatio: 1,
      background: false
    });
  },
  methods: {
    onConfirm () {
        // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
        this.cropper.getCroppedCanvas().toBlob(blob => {
            this.updateUserPhoto(blob) // 使用裁剪后的js图片文件对头像进行更新
        })
    },

    async updateUserPhoto (blob) {
        this.$toast.loading({
            message: '保存中...',
            forbidClick: true, // 禁止背景点击
            duration: 0 // 持续展示
        })
        try {
            // 错误的用法
            // 如果接口要求 Content-Type 是 application/json
            // 则传递普通 JavaScript 对象
            // updateUserPhoto({
            //   photo: blob
            // })

            // 如果接口要求 Content-Type 是 multipart/form-data
            // 则你必须传递 FormData 对象
            const formData = new FormData()
            formData.append('photo', blob)

            const { data } = await updateUserPhoto(formData)
            
            // 关闭弹出层
            this.$emit('close')

            // 更新视图
            this.$emit('update-photo', data.data.photo)

            // 提示成功
            this.$toast.success('更新成功')
        } catch (err) {
            this.$toast.fail('更新失败')
        }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>