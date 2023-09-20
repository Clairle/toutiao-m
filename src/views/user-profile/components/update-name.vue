<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-warp">
      <van-field
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
export default {
  name: 'UpdateName',
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>