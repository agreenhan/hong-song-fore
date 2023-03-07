import request from '@/utils/request'

// 登陆请求
export function login(data) {
  return request({
    url: '/employee/login',
    method: 'post',
    params: data
  })
}

// 员工信息请求
export function getInfo() {
  return request({
    url: '/employee/info',
    method: 'get'
  })
}

// 员工退出请求
export function logout() {
  return request({
    url: '/employee/logout',
    method: 'get'
  })
}

// TODO 查询员工列表

// TODO 修改员工信息

// TODO 删除员工信息

// TODO 查询员工详情信息

