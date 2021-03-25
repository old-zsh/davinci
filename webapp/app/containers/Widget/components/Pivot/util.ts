export function getOriginKey(key) {
  return key.match(/\S*(?=\_)/g).shift()
}
export function isSumLastNode(key) {
  return /\_(?<=)\d*sumlast/g.test(key)
}

export function isSumNodeEnd(key) {
  return /\_(?<=)\S*sum/g.test(key)
}
export function replaceRowColPrx(key){
  return key.replace(/\_(?<=)\d*(rows|cols)\d*/g,'')
}
export function isElementOfArray(group) {
  return group.every((item) => Array.isArray(item))
}

export function isColRowMermber(group, key) {
  return group.some((item) => {
    const reg = RegExp('(?=' + item + ')', 'i')
    return reg.test(key)
  })
}
// export function isQuotaSum(key) {
//   return /(sum\()(?<=)(\W*)/g.test(key)
// }
