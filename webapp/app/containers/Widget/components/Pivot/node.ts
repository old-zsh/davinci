/*
 * @Author: your name
 * @Date: 2020-12-21 17:56:09
 * @LastEditTime: 2021-01-28 18:07:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /davinci-fork/davinci/webapp/app/containers/Widget/components/Pivot/node.ts
 */
class Node {
  data: any
  value: any
  key: any
  type: any
  parent: any
  children: any[]
  constructor(obj) {
    this.data = obj.data;
    this.value = obj.value;
    this.key = obj.key;
    this.parentId = obj.parentId;
    this.type = obj.type;
    this.parent = null;
    this.children = obj.children || [];
  }
}
export default Node