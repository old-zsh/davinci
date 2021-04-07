
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
  sumType: any
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
    this.sumType = obj.sumType
  }
}
export default Node