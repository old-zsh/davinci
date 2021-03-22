/*
 * @Author: your name
 * @Date: 2021-03-22 10:29:35
 * @LastEditTime: 2021-03-22 11:06:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /davinci-fork/davinci/webapp/app/containers/Widget/components/Pivot/util.ts
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
export function replaceRowColPrx(key){
  return key.replace(/\_(?<=)\d*(rows|cols)\d*/g,'')
}
export function isElementOfArray(group) {
  return group.every((item) => Array.isArray(item))
}
