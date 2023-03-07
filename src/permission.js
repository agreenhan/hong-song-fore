import router, {constantRoutes} from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getRouters } from "@/api/module"
import Layout from "@/layout";

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
    // 是否有路由信息
    if (store.getters.routers !== undefined && store.getters.routers.length) {
      // 有
      next()
    } else {
      // 没有
      // 如果不存在，则重新获取
      // getRouters 是定义在 api 中的接口，需要 import 进来
      await getRouters().then(res => {
        // 生成动态路由节点
        const dynamicRouters = handleRouter(res.data)
        constantRoutes.push(...dynamicRouters)
        console.log(constantRoutes)
        // 将最终的路由信息保存到 vuex 中，保存完成后，再添加到 router 对象中。
        store.dispatch('router/setRouters', constantRoutes).then(() => {
          router.addRoutes(store.getters.routers)
        })
        next()
      })
    }
    if (to.path === '/login') {
      // 如果已登陆，则重定向到home
      next({ path: '/' })
      NProgress.done()
    } else {
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
          next(`/login`)
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
      next(`/login`)
      NProgress.done()
    }
  }
})

/**
 * 组装动态路由函数
 * @param {*} routerList
 * @returns *[] 最终的动态路由数组
 */
const handleRouter = (routerList) => {
  const routers = []
  for (const router of routerList) {
    console.log(router)
    const node = {
      path: router.path,
      component: router.component === 'Layout' ? Layout : (resolve) =>  require([`@/views${router.component}.vue`], resolve),
      name: router.name,
      meta: {
        title: router.meta.title,
        icon: router.meta.icon
      },
    }
    // 如果当前路由节点存在子路由，需要递归组装数据
    if (router.children && router.children.length) {
      node.children = handleRouter(router.children)
    }
    routers.push(node)
  }
  const node = { path: '*', redirect: '/404', hidden: true }
  routers.push(node)
  return routers
}

// 每次路由后
router.afterEach(() => {
  // 进度条完成
  NProgress.done()
})



