import Node from './node'
class MultiwayTree {
  public originObj = []
  public treePointItem = []
  public treeOption = {
    hasSameParent: false,
    parentKey: '',
    level: {},
    defaultKey: '',
    targetNode: true,
    parentDefaultKey: '',
    existEqualNode: {
      parentId: null,
      key: null
    },
    nodeValue: null,
    levelOption: {
      treeIndex: 0,
      levelKey: '',
      treeItem: {},
      levelIndex: 0
    }
  }
  public root = null
  constructor() {
    // this.treePointItem = []
    // this.treeOption = {}
    // this.root = null
  }
  public traverseBF(callback) {
    const queue = []
    let found = false
    queue.push(this.root)
    let currentNode = queue.shift()

    while (!found && currentNode) {
      found = callback(currentNode) === true ? true : false
      if (!found) {
        queue.push(...currentNode.children)
        currentNode = queue.shift()
      }
    }
    return found
  }
  public contains(callback, traversal) {
    traversal.call(this, callback)
  }

  public add(obj, toData) {
    const node = new Node(obj)
    if (this.root === null) {
      this.root = node
      return this
    }
    const exitCallBack = function (currentNode) {
      if (currentNode.key === node.key && currentNode.data === node.data) {
        return true
      }
    }
    const exitTag = tree.traverseBF.call(this, exitCallBack)
    if (exitTag) {
      return this
    }

    let parent = null
    const callback = (node) => {
      if (node.key === toData.key) {
        parent = node
        return true
      }
    }
    this.contains(callback, tree.traverseBF)
    if (parent) {
      parent.children.push(node)
      node.parent = parent
      return this
    } else {
      throw new Error()
    }
  }
  public getTreeParentId(treeNodeGroup) {
    const {
      targetNode,
      levelOption,
      hasSameParent,
      existEqualNode,
      parentKey,
      parentDefaultKey
    } = this.treeOption
    const { treeIndex } = levelOption

    if (targetNode) {
      return treeNodeGroup.map((item) => item).pop().defaultKey
    }

    if (!treeIndex) {
      return parentKey
    }

    if (hasSameParent) {
      return existEqualNode.parentId
    }

    if (hasSameParent) {
      return existEqualNode.parentId
    } else {
      return treeNodeGroup
        .filter((k) => k.defaultKey === parentDefaultKey)
        .pop()?.key
    }
  }
  public buildTreeNodeData(treeNodeGroup) {
    const {
      targetNode,
      defaultKey,
      levelOption,
      hasSameParent,
      existEqualNode
    } = this.treeOption
    const { treeItem, levelKey } = levelOption

    return {
      data: targetNode ? treeItem[levelKey] : null,
      value: targetNode ? levelKey : treeItem[levelKey],
      defaultKey,
      parentId: tree.getTreeParentId(treeNodeGroup),
      key: hasSameParent ? existEqualNode.key : defaultKey
    }
  }

  public isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup) {
    if (!treeIndex) {
      return (this.treeOption.hasSameParent = false)
    }

    const getExistEqualNode = (treePointItem, nodeValue, levelIndex) => {
      return treePointItem
        .filter((item, idx) => {
          if (Array.isArray(item)) {
            getExistEqualNode(item, nodeValue, levelIndex)
          } else {
            return item.value === nodeValue && levelIndex === idx
          }
        })
        .shift()
    }

    this.treeOption.existEqualNode = getExistEqualNode(
      this.treePointItem,
      this.treeOption.nodeValue,
      levelIndex
    )

    const existEqualNodeOfParentKey = this.treePointItem
      .filter((item) => this.treeOption.existEqualNode?.parentId === item.key)
      .pop()?.key

    this.treeOption.parentDefaultKey = this.treeOption.targetNode
      ? treeNodeGroup.map((o) => o).pop().defaultKey
      : this.treeOption.parentKey

    const originParentKey = treeNodeGroup
      .filter((item) => this.treeOption.parentDefaultKey === item.defaultKey)
      .pop()?.key
    this.treeOption.hasSameParent =
      originParentKey === existEqualNodeOfParentKey
  }

  public buildTreePointItem(treeItem, treeIndex, tagGroup) {
    const treeNodeGroup = []
    const targetNodeGroup = []

    treeItem = { name_level0: 'root', ...treeItem }
    const treeItemKeys = Object.keys(treeItem)
    treeItemKeys.forEach((levelKey, levelIndex) => {
      this.treeOption = {
        defaultKey: `${levelKey}_${treeIndex}`,
        parentKey: `${treeItemKeys[levelIndex - 1]}_${treeIndex}`,
        targetNode: tagGroup.includes(levelKey),
        nodeValue: treeItem[levelKey],
        levelOption: { treeItem, treeIndex, levelKey, levelIndex }
      } as any

      tree.isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup)

      Array.prototype.push.call(
        this.treeOption.targetNode ? targetNodeGroup : treeNodeGroup,
        tree.buildTreeNodeData(treeNodeGroup)
      )
    })
    return [...treeNodeGroup, targetNodeGroup]
  }

  public buildMultiwayTree(originTreePointGroup, tagGroup) {
    originTreePointGroup.forEach((treeItem, treeIndex) => {
      this.treeOption.existEqualNode = null
      this.treeOption.hasSameParent = false
      this.treePointItem = tree.buildTreePointItem(
        treeItem,
        treeIndex,
        tagGroup
      )
      this.treePointItem.forEach((item) => {
        if (!item.length && !item.parentId) {
          return (tree = tree.add(item, null))
        }
        item = item.length ? item : [item]
        item.map((currentItem) => {
          const parentItem = this.treePointItem
            .filter((item) => item.key === currentItem.parentId)
            .pop()
          tree = tree.add(currentItem, parentItem)
        })
      })
    })
  }
  public buildTotalNode(node) {
    const copyedObj = []
    const deepCopy = (node) => {
      if (typeof node !== 'object' || !node) {
        return node
      }

      for (let i = 0; i < copyedObj.length; i++) {
        if (copyedObj[i].node === node) {
          return copyedObj[i].copyTarget
        }
      }
      const newNode = Array.isArray(node) ? [] : new Node({})

      copyedObj.push({ node, copyTarget: newNode })

      if (!Array.isArray(node)) {
        Object.keys(node).forEach((key) => {
          if (
            Array.isArray(newNode[key]) ? newNode[key].length : newNode[key]
          ) {
            return
          }
          if (key === 'key') {
            newNode[key] = deepCopy(
              node[key].match(/\S*(?<=\_)/g).shift() + 'sum'
            )
          } else if (key === 'value' && !/(sum)(?<=)(\W*)/g.test(node.key)) {
            // 最后一层未使用总和,target为原始数据未插入之前数据
            newNode[key] = /\S*(?<=name_level1)/g.test(node[key])
              ? '总和'
              : '总计'
          } else {
            newNode[key] = deepCopy(node[key])
          }
        })
      } else {
        node.length && newNode.push(deepCopy(node[0]))
      }
      return newNode
    }
    return deepCopy(node)
  }

  public buildTotalTree() {
    
    const queue = [this.root]
    let currentNode = queue.shift()
    let end = false
    while (!end && /(name_level)(?=)/g.test(currentNode.key)) {
      end = !currentNode
      if (!end) {
        const key = currentNode.key
        queue.push(...currentNode.children)
        currentNode.children.push(tree.buildTotalNode(currentNode.children[0]))
        currentNode = queue.shift()
      }
    }
  }
  public calculateTotal(cb) {
    const queue = [this.root]
    const currentNode = queue.shift()
    const currentQueue = [...currentNode.children]
    const getBranchRoot = function (queue, cb) {
      const isBranchRoot = queue.every((item) => !item.children.length)
      if (isBranchRoot) {
        return cb(queue.shift())
      }
      queue.forEach((currentNode) => {
        while (!currentNode.data) {
          queue = [...currentNode.children]
          getBranchRoot(queue, cb)
        }
      })
    }
    getBranchRoot(currentQueue, cb)
  }
  public caleSubTotalCb(currentNode) {
    if (!currentNode.parent) {
      return
    }
    currentNode = currentNode.parent
    const totalNode = currentNode.children[currentNode.children.length - 1]
    const filterTotalNode = (children) =>
      children.filter((item) => !/(?<=(\_sum))/g.test(item.key))
    currentNode.data = filterTotalNode(currentNode.children).reduce(
      (pre, cur) => {
        return (pre = pre + cur.data)
      },
      0
    )
    const setTotalChildNodeData = (totalNode, currentNode) => {
      if (!totalNode.children.length) {
        return
      }
      totalNode.data = currentNode.data
      if (totalNode.children.length > 0) {
        totalNode = totalNode.children[0]
        totalNode.data = currentNode.data
        setTotalChildNodeData(totalNode, currentNode)
      }
    }
    setTotalChildNodeData(totalNode, currentNode)
    tree.caleSubTotalCb(currentNode)
  }
  generateAfterJson(tree) {
    const revertKey = (key) => key.match(/\S*(?=\_)/g).shift();
    tree.children.forEach((level0) => {
      level0.children.forEach((level1) => {
        level1.children.forEach((level2) => {
          level2.children.forEach((item) => {
            let obj = {};
            obj[revertKey(level0.key)] = level0.value;
            obj[revertKey(level1.key)] = level1.value;
            obj[revertKey(level2.key)] = level2.value;
            obj[revertKey(item.key)] = item.value;
            item.children.forEach((o) => {
              obj[revertKey(o.key)] = o.data;
            });
            this.originObj.push(obj);
          });
        });
      });
    });
  };
  public getCompluteJson(originTreePointGroup, tagGroup) {
    tree.buildMultiwayTree(originTreePointGroup, tagGroup)
    tree.buildTotalTree()
    tree.calculateTotal(tree.caleSubTotalCb)
    tree.generateAfterJson(tree.root);
    console.log(tree, '这是tree')
    return tree.originObj
   
    // console.log(originObj, "originObj");
  }

}

let tree = new MultiwayTree()
export default tree

