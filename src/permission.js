import router, {constantRoutes} from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getRouters } from "@/api/module";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 无重定向白名单

// 每次路由之前
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断员工是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登陆，则重定向到home
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果不存在，则重新获取
      // getRouters 是定义在 api 中的接口，需要 import 进来
      getRouters(hasToken).then(res => {
        // 生成动态路由节点
        const dynamicRouters = handleRouter(res)
        // 我们需要把动态生成的路由作为 Layout 组件的子路由，而Layout组件在常量路由数组中
        // 倒数第二个元素，所以 constantRoutes[constantRoutes.length - 2] 目的是获取Layout路由节点，
        // 并将动态路由合并到 Layout 的子节点中
        // constantRoutes[constantRoutes.length - 2].children.push(...dynamicRouters)
        constantRoutes.push(...dynamicRouters)
        // 将最终的路由信息保存到 vuex 中，保存完成后，再添加到 router 对象中。
        store.dispatch('router/setRouters', constantRoutes).then(() => {
          router.addRoutes(store.getters.routers)
        })
        next()
      })

      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 放行
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('employee/getInfo')
          // 放行
          next()
        } catch (error) {
          // 清除token，然后重定向到登陆界面
          await store.dispatch('employee/resetToken')
          Message.error(error || '出错啦')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单中，直接跳转
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

/**
 * 组装动态路由函数
 * @param {*} routerList
 * @returns 最终的动态路由数组
 */
const handleRouter = (routerList) => {
  const routers = []
  for (const router of routerList) {
    const node = {
      path: router.path,
      component: (resolve) =>  require([`@${router.component}.vue`], resolve),
      name: router.name,
      meta: router.meta
    }
    // 如果当前路由节点存在子路由，需要递归组装数据
    if (router.children && router.children.length) {
      node.children = handleRouter(router.children)
    }
    routers.push(node)
  }
  return routers
}

// 每次路由后
router.afterEach(() => {
  // 进度条完成
  NProgress.done()
})



