import Vue from 'vue'
import Vuex from 'vuex'

// 导入本地存储操作模块
import { getItem, setItem} from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 从本地存储获取用户的token
    user: getItem(TOKEN_KEY)
  },
  getters: {
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 防止刷新丢失，将数据存储到本地存储
      // 本地存储只能放字符串，需要把对象转换成json形式的字符串进行存储
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
