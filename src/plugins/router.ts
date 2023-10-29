import { createRouter, createWebHashHistory } from 'vue-router'

import Greeting from '@/components/Greeting.vue';
import User from '@/components/User/User.vue';
import Manager from '@/components/Manager/Manager.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Greeting',
      component: Greeting,
      meta: {
        title: '登录',
      },
    },
    {
      path: '/user',
      component: User,
      meta: {
        title: '用户页',
      }
    },
    {
      path: '/manager',
      component: Manager,
      meta: {
        title: '管理页',
      }
    },
  ]
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果路由配置中没有定义标题，则使用默认标题
  const destTitle = to.meta.title as string
  document.title = destTitle || '毕业生去向信息共享系统'

  // if (to.path !== '/') {
  //   if (to.path === '/register') {
  //     next()
  //   } else {
  //     const token = localStorage.getItem('token')
  //     if (token === null || token === '') {
  //       next('/')
  //     } else {
  //       const userType = localStorage.getItem('type')
  //       if (userType === 'user') {
  //         if (to.path === '/manager' || to.path === '/system') {
  //           next('/user')
  //         } else {
  //           next()
  //         }
  //       } else {
  //         if (to.path === '/user') {
  //           next('/manager')
  //         } else {
  //           next()
  //         }
  //       }
  //     }
  //   }
  // }
  next()
});

export default router