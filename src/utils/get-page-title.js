import defaultSettings from '@/settings'

const title = defaultSettings.title || '洪松公司员工考评系统'

// 动态显示网站名
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
