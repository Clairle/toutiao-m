<template>
    <div class="search-container">
        <!-- 搜索栏 -->
        <form class="search-form" action="/">
            <van-search
                v-model="searchText"
                show-action
                placeholder="请输入搜索关键词"
                background="#3296fa"
                @search="onSearch"
                @cancel="onCancel"
                @focus="isResultShow = false"
            />
        </form>
        <!-- /搜索栏 -->

        <!-- 搜索结果 -->
        <search-result 
            v-if="isResultShow"
            :search-text="searchText"
        >
        </search-result>
        <!-- /搜索结果 -->

        <!-- 联想建议 -->
        <search-suggestion 
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
        >
        </search-suggestion>
        <!-- /联想建议 -->

        <!-- 历史记录 -->
        <search-history 
        v-else
        :search-histories="searchHistories"
        @search="onSearch"
        @clear-search-histories="searchHistories = []"
        >
    </search-history>
        <!-- /历史记录 -->
    </div>
</template>
  
<script>
// 搜索历史
import SearchHistory from './components/search-history.vue'
// 搜索建议
import SearchSuggestion from './components/search-suggestion.vue'
// 搜索结果
import SearchResult from './components/search-result.vue'
// 本地存储工具模块
import { setItem, getItem } from '@/utils/storage'
export default {
    name: "SearchPage",
    components: {
        SearchHistory,
        SearchSuggestion,
        SearchResult
    },
    props: {},
    data() {
        return {
            searchText: '',
            isResultShow: false, // 控制搜索结果的展示
            searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 从本地加载搜素历史记录
        };
    },
    computed: {},
    watch: {
        searchHistories(value) {
            setItem('TOUTIAO_SEARCH_HISTORIES', value)
        }
    },
    created() {},
    methods: {
        // 电脑手机回车键触发
        onSearch(val) {
            // console.log(val)
            // 更新文本框内容
            this.searchText = val

            // 存储搜素历史记录
            // 要求：不要有重复历史记录、最新的排在最前面
            const index = this.searchHistories.indexOf(val)
            if (index !== -1) {
                this.searchHistories.splice(index, 1)
            }
            this.searchHistories.unshift(val)
            // 渲染搜索结果
            this.isResultShow = true
        },
        onCancel() {
            this.$router.back()
        },
    }
};
</script>
  
<style scoped lang="less">
.search-container {
    padding-top: 108px;
    .van-search__action {
        color: #fff;
    } 
    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>