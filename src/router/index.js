import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由目录
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue') 
  },
  {
    path: '/',
    redirect: 'home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',// 默认子路由
        name: 'home',
        component: () => import('@/views/home') 
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 把路由参数映射到组件的props中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
