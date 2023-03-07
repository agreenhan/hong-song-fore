import request from "@/utils/request";

// 获取当前员工可见功能模块信息
export function getRouters() {
  return request({
    url: "/module/list",
    method: "get"
  })
}
