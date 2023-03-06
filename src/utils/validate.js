/**
 * 判断字符串是否是https?:|mailto:|tal: 开头的
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断员工账号是否合法
 * @param {string} str
 * @returns {Boolean}
 */
export function validPhoneNumber(str) {
  return /^1(3\d{2}|4[14-9]\d|5([0-35689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/.test(str)
}
