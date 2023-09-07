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
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',// 默认子路由
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
  }

]

const router = new VueRouter({
  routes
})

export default router
