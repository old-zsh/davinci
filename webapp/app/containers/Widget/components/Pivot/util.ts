/*
 * @Author: your name
 * @Date: 2021-02-10 11:13:52
 * @LastEditTime: 2021-03-01 18:32:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /davinci-fork/davinci/webapp/app/containers/Widget/components/Pivot/util.js
 */

export function isRowColLastLevel(node, array) {
  return getOriginKey(node.key) == array[array.length - 1]
}
export function getOriginKey(key) {
  return key.match(/\S*(?=\_)/g).shift()
}

export function isColRowMermber(group, key) {
  return group.some((item) => {
    const reg = RegExp('(?=' + item + ')', 'i')
    return reg.test(key)
  })
}
export function isSumNodeStartReg(item, key) {
  let reg = RegExp(item + '_(?=)S*', 'g')
  return reg.test(key)
}
export function isQdReg(item, key) {
  let reg = RegExp(item + '(?=)S*', 'g')
  return reg.test(key)
}
export function isSumLastNode(key) {
  return /\_(?<=)\d*sumlast/g.test(key)
}
export function isQuotaSum(key) {
  return /(sum\()(?<=)(\W*)/g.test(key)
}
export function isSumNodeEnd(key) {
  return /\_(?<=)\S*sum/g.test(key)
}
export function isNodeIncludeArray(array, node) {
  return array.includes(getOriginKey(node.key))
}
export function isSumNodeEndReg(item, key) {
  let reg = RegExp('_(?<=)S*' + item, 'g')
  return reg.test(key)
}
