/*
 * @Author: your name
 * @Date: 2020-12-21 17:56:09
 * @LastEditTime: 2021-03-29 17:25:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /davinci-fork/davinci/webapp/app/containers/Widget/components/Pivot/node.ts
 */
class Node {
  value: any
  key: any
  type: any
  parent: any
  children: any[]
  originKey: any
  parentId: any
  sumEnd: any
  sumLastEnd: any
  constructor(obj, metrics) {
    if(obj.type == 'metrics'){
      this[obj.originKey] = obj[obj.originKey]
    } else {
      metrics.forEach(element => {
        this[element] = obj[element]
      });
    }
    
    // this.data = obj.data;
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