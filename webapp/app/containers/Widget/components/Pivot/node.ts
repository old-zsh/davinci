/*
 * @Author: your name
 * @Date: 2020-12-21 17:56:09
 * @LastEditTime: 2021-03-25 15:40:40
 * @LastEditors: Please set LastEditors
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
  originKey: any
  parentId: any
  sumEnd: any
  sumLastEnd: any
  constructor(obj) {
    this.data = obj.data;
    this.value = obj.value;
    this.key = obj.key;
    this.parentId = obj.parentId;
    this.type = obj.type;
    this.parent = null;
    this.children = obj.children || [];
    this.originKey = obj.originKey
    this.type = obj.type
    this.sumEnd = obj.sumEnd
    this.sumLastEnd = obj.sumLastEnd
  }
}
export default Node