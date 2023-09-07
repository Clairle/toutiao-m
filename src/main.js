import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 加载vant核心
import Vant from 'vant';
// 加载vant样式
import 'vant/lib/index.css';

// 加载全局样式
import './styles/index.less'

// 动态设置 REM 基准值
import 'amfe-flexible'

// 加载时间处理工具
import './utils/dayjs'

// 挂载vant
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
