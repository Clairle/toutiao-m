module.exports = {
    // 配置要使用的PostCSS插件
    plugins: {
        // 配置使用 autoprefixer 插件
    //     // 生成浏览器css样式规则
    //   'autoprefixer': {
    //     // 配置环境信息
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    //   },
    //   配置使用postcss-pxtorem插件 将 `px` 转为 `rem
      'postcss-pxtorem': {
        // 如果你使用的是基于 lib-flexable 的 REM 适配方案，
        // 则应该设置为你的设计稿的十分之一。
        // 例如设计稿是 750 宽，则应该设置为 75。
        // 因为 Vant 是基于 375 写的，所以如果你设置为 75 的话，Vant 的样式就小了一半。
        rootValue ({ file }) {
            console.log(file)
            return file.indexOf('vant') !== -1 ? 37.5 : 75
          },
        // 配置要转换的css属性
        propList: ['*']
      }
    }
  }
  