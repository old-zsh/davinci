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