import Node from './node'
class MultiwayTree {
  public root= null
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
  } as any
  public rowArray = ['name_level0', 'name_level1', 'name_level2', 'name_level3']
  public colArray = ['platform']
  public rootArray = ['name_level0']
  public tagGroup = ['sum(总停留时间)']
  constructor() {

  }
  // 工具函数 - "name_level3_0" => "name_level3"
  getOriginKey(key) {
    return key.match(/\S*(?=\_)/g).shift()
  }
  // 工具函数 -  末尾与key比较
  isBackRowLevelNode(currentNode, index) {
    return (
      tree.getOriginKey(currentNode.key) == this.rowArray[this.rowArray.length - index]
    )
  }
  // 工具函数 -
  isEmptyArrey(queue) {
    return queue.every((item) => !item.children.length)
  }

  // 工具函数 - 最后
  lastNode(currentNode, index = 1) {
    return currentNode.children[currentNode.children.length - index]
  }
  // 工具函数 -
  filterNode(currentNode, reg) {
    return currentNode.children.filter((item) => !reg.test(item.key))
  }
  // 工具函数 -  去掉sum
  removeSum(key) {
    return key.replace(/\_sum(?<=[^(\_sum)]*$)/, '')
  }
  // 工具函数 -  判断sum node
  isSumNode(key) {
    return /(?=sum)/g.test(key)
  }
  // 工具函数 - 构造cacheMap key
  getCacheMapKey(currentKey, parentKey) {
    if (tree.isSumNode(currentKey)) {
      return `${currentKey}_${parentKey.split('_').pop()}`
    } else {
      return currentKey
    }
  }
  // 去除_sum结尾
  replaceKey(key) {
    return key.replace(/\_\d+(?=[^(\_\d+)]*$)/, '_sum')
  }

  // 判断列标志对key的修改: platform
  isColReg(key) {
    return key.split('_').includes(...this.colArray)
  }
  // 判断不为指标: "sum(总停留时间)"
  isQuotaSum(key) {
    return /(sum\()(?<=)(\W*)/g.test(key)
  }
  // 首层为总和 之后为总计
  isTopLevelRow(key) {
    return /\S*(?<=name_level1)/g.test(key)
  }
  traverseBF(callback) {
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
  contains(callback, traversal) {
    traversal.call(this, callback)
  }

  add(obj, toData) {
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
  getNodeParentId(treeNodeGroup) {
    const {
      targetNode,
      defaultKey,
      levelOption,
      hasSameParent,
      existEqualNode,
      parentKey,
      parentDefaultKey
    } = this.treeOption
    const { treeIndex } = levelOption
    if (targetNode) return treeNodeGroup.map((item) => item).pop().defaultKey
    if (!treeIndex) return parentKey
    if (hasSameParent) return existEqualNode.parentId
    if (hasSameParent) {
      return existEqualNode.parentId
    } else {
      return treeNodeGroup.filter((k) => k.defaultKey == parentDefaultKey).pop()
        ?.key
    }
  }
  buildTreeNodeData(treeNodeGroup) {
    const {
      targetNode,
      defaultKey,
      levelOption,
      hasSameParent,
      existEqualNode
    } = this.treeOption
    const { treeItem, treeIndex, levelKey } = levelOption
    return {
      data: targetNode ? treeItem[levelKey] : null,
      value: targetNode ? levelKey : treeItem[levelKey],
      defaultKey: defaultKey,
      parentId: tree.getNodeParentId(treeNodeGroup),
      key: hasSameParent ? existEqualNode.key : defaultKey
    }
  }

  isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup) {
    if (!treeIndex) return (this.treeOption.hasSameParent = false)

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

  buildTreePointItem(treeItem, treeIndex, tagGroup) {
    let treeNodeGroup = []
    let targetNodeGroup = []

    treeItem = Object.assign({ name_level0: 'root' }, treeItem)
    let treeItemKeys = Object.keys(treeItem)
    treeItemKeys.forEach((levelKey, levelIndex) => {
      this.treeOption = {
        defaultKey: `${levelKey}_${treeIndex}`,
        parentKey: `${treeItemKeys[levelIndex - 1]}_${treeIndex}`,
        targetNode: tagGroup.includes(levelKey),
        nodeValue: treeItem[levelKey],
        levelOption: { treeItem, treeIndex, levelKey, levelIndex }
      }

      tree.isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup)

      Array.prototype.push.call(
        this.treeOption.targetNode ? targetNodeGroup : treeNodeGroup,
        tree.buildTreeNodeData(treeNodeGroup)
      )
    })
    return [...treeNodeGroup, targetNodeGroup]
  }

  constructMultiwayTree(originTreePointGroup, tagGroup) {
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

  copyTotalNode(node) {
    let copyedObj = []
    const deepCopy = (node, sumType) => {
      if (typeof node !== 'object' || !node) {
        return node
      }
      for (let i = 0; i < copyedObj.length; i++) {
        if (copyedObj[i].node === node) {
          return copyedObj[i].copyTarget
        }
      }
      let newNode: any = Array.isArray(node) ? [] : new Node({})
      copyedObj.push({ node, copyTarget: newNode })
      if (node.length) {
        const copyObj = node[0]
        if (tree.isColReg(copyObj.key) && copyObj.parent) {
          // name_level_name3 的child 处理前三个obj
          copyObj.parent.children.forEach((item) => {
            const copyItem = deepCopy(item, true)
            if (item.key === tree.removeSum(copyItem.key)) {
              let copyNode = new Node(copyItem)
              copyNode.value = item.value
              newNode.push(copyNode)
            }
          })
        }
        newNode.push(deepCopy(node[0], true))
      } else {
        Object.keys(node).forEach((key) => {
          let breakCopy = Array.isArray(newNode[key])
            ? newNode[key].length
            : newNode[key]
          if (breakCopy) {
            return
          }
          const data = node[key]
          if (key === 'key') {
            newNode[key] = tree.isColReg(data) ? `${data}_sum` : `${data}sum` // : replaceKey(data);
          } else if (key === 'value') {
            const topLevelValue = tree.isTopLevelRow(data) ? '总和' : '总计'
            newNode[key] = !tree.isQuotaSum(data) ? topLevelValue : data
          } else if (key === 'parentId') {
            newNode[key] =
              // sumType && node.parentId ? replaceKey(node.parentId) : data;
              sumType && node.parentId ? `${node.parentId}sum` : data
          } else {
            newNode[key] = deepCopy(data, true)
          }
        })
      }
      return newNode
    }
    return deepCopy(node, false)
  }

  addTotalNodeToTree() {
    const queue = [this.root]
    let currentNode = queue.shift()
    let end = false
    while (
      !end &&
      this.rowArray.concat(this.rootArray).includes(tree.getOriginKey(currentNode.key))
    ) {
      end = !currentNode
      if (!end) {
        queue.push(...currentNode.children)
        currentNode.children.push(tree.copyTotalNode(currentNode.children[0]))
        currentNode = queue.shift()
      }
    }
  }

  calcTotalNodeDFS() {
    const queue = [this.root]
    const currentNode = queue.shift()
    const currentQueue = [...currentNode.children]
    const calcTotalDataDFS = (currentNode) => {
      if (!currentNode.parent) return
      currentNode = currentNode.parent
      currentNode.data = currentNode.children
        .filter((item) => !/\_(?<=)\S*sum/g.test(item.key))
        .reduce((pre, cur) => {
          return (pre = pre + cur.data)
        }, 0)
      const setTotalChildData = (totalNode, currentNode) => {
        if (!totalNode.children.length) {
          return
        }
        totalNode.data = currentNode.data
        if (totalNode.children.length > 0) {
          totalNode = tree.lastNode(totalNode)
          totalNode.data = currentNode.data
          setTotalChildData(totalNode, currentNode)
        }
      }
      setTotalChildData(tree.lastNode(currentNode), currentNode)
      calcTotalDataDFS(currentNode)
    }
    const getBranchRoot = function (queue, cb) {
      const isBranchRoot = tree.isEmptyArrey(queue)
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
    getBranchRoot(currentQueue, calcTotalDataDFS)
  }

  calcTotalNodeBFS() {
    const constructTreeCacheMap = () => {
      const queue = [this.root]
      let currentNode = queue.shift()
      queue.push(...currentNode.children)
      let treeMap = new Map()
      treeMap.set(currentNode.key, currentNode)
      const iteration = (currentNode) => {
        queue.forEach((item) => {
          currentNode = queue.shift()
          queue.push(...currentNode.children)
          treeMap.set(
            tree.getCacheMapKey(currentNode.key, currentNode.parentId),
            currentNode
          )
          iteration(currentNode)
        })
        return treeMap
      }
      return iteration(currentNode)
    }
    const maxIdx = this.rowArray.length - 1
    const recursion = (index) => {
      if (index > maxIdx) return
      const treeMap = constructTreeCacheMap()
      treeMap.forEach((currentNode) => {
        if (tree.isBackRowLevelNode(currentNode, index)) {
          tree.caleSubTotalLevelBFS(currentNode, treeMap)
        }
      })
      index++
      recursion(index)
    }
    recursion(2)
  }
  // 循环小函数 计算层序遍历和
  caleSubTotalLevelBFS(currentNode, treeMap) {
    let sumNode = currentNode.children[currentNode.children.length - 1]
    const getLastKey = (sumNode, position) => {
      if (!tree.isBackRowLevelNode(sumNode, 1)) {
        let idx = position ? 0 : sumNode.children.length - 1
        sumNode = sumNode.children[idx]
        return getLastKey(sumNode, position)
      } else {
        return sumNode.children
      }
    }
    const searchKey = tree.getCacheMapKey(
      currentNode.parentId,
      currentNode.parent.parentId
    )
    let currentNodeParent

    currentNodeParent = treeMap.get(searchKey)
    getLastKey(sumNode, true).forEach((totalItem) => {
      totalItem.data = 0
      let ItemSum
      if (tree.isSumNode(currentNode.key)) {
        ItemSum = currentNodeParent.children.map((o) => {
          return o.children.filter((item) => {
            return tree.isSumNode(item.key)
          })[0]
        })
      } else {
        // "name_level2_0" 中除去sumNode值 currentNode不为sum node
        ItemSum = currentNode.children.filter((item) => {
          return !tree.isSumNode(item.key)
        })
      }
      // ItemSum:倒数第二级通过getLastKey(cur)找到指标
      totalItem.data = ItemSum.reduce((pre, cur) => {
        const matchItem = getLastKey(cur, false).filter(
          (cur) => cur.value === totalItem.value
        )[0]
        return (pre = pre + (matchItem ? matchItem.data : 0))
      }, 0)
    })
    treeMap.set(searchKey, currentNodeParent)
  }

  getTreeRootCopy(cb) {
    const queue = [this.root]
    const currentNode = queue.shift()
    const currentQueue = [...currentNode.children]
    const getBranchRoot = function (queue, cb) {
      const isBranchRoot = tree.isEmptyArrey(queue)
      if (isBranchRoot) {
        return cb(queue.shift())
      }
      queue.forEach((currentNode) => {
        while (currentNode.children.length) {
          queue = [...currentNode.children]
          getBranchRoot(queue, cb)
        }
      })
    }
    getBranchRoot(currentQueue, cb)
  }
  getCompluteJson(originTreePointGroup, tagGroup) {
    tree.constructMultiwayTree(originTreePointGroup, tagGroup)
    tree.addTotalNodeToTree()
    tree.calcTotalNodeDFS()
    tree.calcTotalNodeBFS()
    // tree.getTreeRootCopy(tree.buildTreeToObj)
    tree.generateAfterJson(tree)
    console.log(tree, 'currentNode1-sum')
    return tree.originObj
    
  }

  generateAfterJson(tree) {
    const revertKey = (key) => {
      const target = tree.getOriginKey(key)
      if (/\S*(?=\_\d)/g.test(target)) {
        return tree.getOriginKey(target)
      } else {
        return target
      }
    }
    tree.root.children.forEach((level0) => {
      level0.children.forEach((level1) => {
        level1.children.forEach((level2) => {
          level2.children.forEach((item) => {
            let obj = {}
            obj[revertKey(level0.key)] = level0.value
            obj[revertKey(level1.key)] = level1.value
            obj[revertKey(level2.key)] = level2.value
            obj[revertKey(item.key)] = item.value
            item.children.forEach((o) => {
              obj[revertKey(o.key)] = o.data
            })
            this.originObj.push(obj)
          })
        })
      })
    })
  }
}
let tree = new MultiwayTree()
export default tree
