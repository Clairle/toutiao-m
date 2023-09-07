<template>
    <div class="search-container">
        <!-- 搜索栏 -->
        <form class="search-form" action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
                background="#3296fa"
                @search="onSearch"
                @cancel="onCancel"
            />
        </form>
    </div>
</template>
  
<script>
export default {
    name: "SearchPage",
    components: {},
    props: {},
    data() {
        return {
            value: '',
        };
    },
    computed: {},
    watch: {},
    created() {},
    methods: {
        onSearch(val) {
            Toast(val);
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