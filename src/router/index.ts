import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'newHome',
    component: () => import(/* webpackChunkName: "station" */ '@/views/newHome/index.vue'),
    meta: {
      title: '华劲校招校园大使',
      keepAlive: false
    }
  },
  {
    path: '/station',
    name: 'station',
    component: () => import(/* webpackChunkName: "station" */ '@/views/station/index.vue'),
    meta: {
      title: '华劲校招校园大使',
      keepAlive: false
    }
  },
  {
    path: '/sendMsgHome',
    name: 'sendMsgHome',
    component: () => import(/* webpackChunkName: "sendMsgHome" */ '@/views/sendMsgHome/index.vue'),
    meta: {
      title: '华劲校招校园大使',
      keepAlive: false
    }
  },
  {
    path: '/sendMsgInput',
    name: 'sendMsgInput',
    component: () => import(/* webpackChunkName: "sendMsgInput" */ '@/views/sendMsgInput/index.vue'),
    meta: {
      title: '上传招聘信息发布截图',
      keepAlive: false
    }
  },
  {
    path: '/sendMsgDetail',
    name: 'sendMsgDetail',
    component: () => import(/* webpackChunkName: "sendMsgDetail" */ '@/views/sendMsgDetail/index.vue'),
    meta: {
      title: '招聘信息发布截图明细',
      keepAlive: false
    }
  },
  {
    path: '/sendMsgList',
    name: 'sendMsgList',
    component: () => import(/* webpackChunkName: "sendMsgList" */ '@/views/sendMsgList/index.vue'),
    meta: {
      title: '已上传招聘信息发布截图查询',
      keepAlive: false
    }
  },
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  //   meta: {
  //     title: '首页',
  //     keepAlive: false
  //   }
  // },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    meta: {
      title: '关于',
      keepAlive: false
    }
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import(/* webpackChunkName: "landing" */ '@/views/landing/index.vue'),
    meta: {
      title: '华劲校招校园大使注册登录',
      keepAlive: false
    }
  },
  {
    path: '/collectionList',
    name: 'collectionList',
    component: () => import(/* webpackChunkName: "collectionList" */ '@/views/collectionList/index.vue'),
    meta: {
      title: '已收集的招聘单位薪酬',
      keepAlive: false
    }
  },
  {
    path: '/collectionInput',
    name: 'collectionInput',
    component: () => import(/* webpackChunkName: "collectionInput" */ '@/views/collectionInput/index.vue'),
    meta: {
      title: '招聘单位薪酬信息录入',
      keepAlive: false
    }
  },
  {
    path: '/collectionDetail',
    name: 'collectionDetail',
    component: () => import(/* webpackChunkName: "collectionDetail" */ '@/views/collectionDetail/index.vue'),
    meta: {
      title: '招聘单位薪酬信息查阅',
      keepAlive: false
    }
  },
  {
    path: '/examineList',
    name: 'examineList',
    component: () => import(/* webpackChunkName: "examineList" */ '@/views/examineList/index.vue'),
    meta: {
      title: '薪酬调查',
      keepAlive: false
    }
  },
  {
    path: '/examineDetail',
    name: 'examineDetail',
    component: () => import(/* webpackChunkName: "examineDetail" */ '@/views/examineDetail/index.vue'),
    meta: {
      title: '薪酬收集填报',
      keepAlive: false
    }
  },
  {
    path: '/examineConsult',
    name: 'examineConsult',
    component: () => import(/* webpackChunkName: "examineConsult" */ '@/views/examineConsult/index.vue'),
    meta: {
      title: '填报人填报状况查询',
      keepAlive: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

/**
 * vue-router配置
 * @param app
 */
export function setupRouter (app: App<Element>): void {
  app.use(router)
}

export default router
