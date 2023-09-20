<template>
    <div class="search-suggestion">
      <van-cell 
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
      >
      <div slot="title" v-html="highlight(text)"></div>
      <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
      </van-cell>
    </div>
</template>
  
<script>
// 联想建议模块接口
import { getSearchSuggestions } from '@/api/search'
// 加载lodash防抖功能
import { debounce } from "lodash"
export default {
    name: 'SearchSuggestion',
    components: {},
    props: {
      searchText: {
            type: String,
            required: true
        }
    },
    data () {
      return {
        suggestions: [], // 联想建议数据列表
      }
    },
    computed: {},
    watch: {
      searchText: {
          // 当 searchText 发生改变的时候就会调用 handler 函数
          // 注意：handler 函数名称是固定的
          // handler (value) {
          //   this.loadSearchSuggestions(value)
          // },
          
          // 防抖优化
          handler: debounce(function (value) {
            this.loadSearchSuggestions(value)
          },200),
          immediate: true // 该回调将会在侦听开始之后被立即调用
      }
    },
    created () {},
    mounted () {},
    methods: {
      // 获取联想建议
      async loadSearchSuggestions(q) {
        try {
          const { data } = await getSearchSuggestions(q)
          this.suggestions = data.data.options
        } catch (err) {
          console.log(err)
          this.$toast('数据获取失败，请稍后重试')
        }
      },

      // 使搜索框字符在搜索联想下高亮
      highlight (text) {
        const highlightStr = `<span class="active">${this.searchText}</span>`

        // 非动态正则无法使用变量参数
        // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
        // RegExp 正则表达式构造函数
        //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
        //    参数2：匹配模式，要写到字符串中
        const reg = new RegExp(this.searchText, 'gi')
        return text.replace(reg, highlightStr)
      }
    }
}
</script>
  
<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
  