import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '../utils/auth'
const history = createWebHistory()

const routes : Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth-github/auth-github.vue')
  }
]

const router = createRouter({
  history,
  routes
})

const whiteList = ['/login', '/sign-up'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
  NProgress.start()
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      next()
    }
  } else {
     /* has no token*/
     if (whiteList.indexOf(to.path) !== -1) {
      // console.log('token not found', to)
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router