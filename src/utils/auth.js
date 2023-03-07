// 获取token
export function getToken() {
  return localStorage.getItem('token')
}

// 设置token
export function setToken(token) {
  return localStorage.setItem('token', token)
}

// 删除token
export function removeToken() {
  return localStorage.removeItem('token')
}

// 获取路由
export function getRouters() {
  return localStorage.getItem("routerMap")
}

// 设置路由
export function setRouters(routeMap) {
  return localStorage.setItem("routerMap", routeMap)
}

// 获取路由
export function removeRouters() {
  return localStorage.removeItem("routerMap")
}
