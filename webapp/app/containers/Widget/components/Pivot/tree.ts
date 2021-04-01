import Node from './node'
import cloneDeep from 'lodash/cloneDeep'
import { getOriginKey, isSumLastNode, isSumNodeEnd, isQuotaSum } from './util'
class MultiwayTree {
  public treePointItem = []
  public widgetProps = {
    root: null,
    wideTableList: [],
    metrics: [],
    colArray: [],
    rowArray: [],
    transformedWideTableList: [],
    metricNodeList: [],
    rowColConcat: [],
    rowLast: null,
    colLast: null
  }
  public pointOption = {
    treePointItem: [],
    isExistEqualParent: false,
    parentKey: '',
    level: {},
    initKey: '',
    isMetrics: true,
    initParentKey: '',
    existEqualNode: {
      parentId: null,
      key: null
    },
    nodeValue: null,
    listIdx: 0,
    originListItem: {}
  } as any
  public labelText = {
    rootLevel: { name_level0_cols: 'root' },
    rootKey: ['name_level0_cols'],
    sumConcat: ['总和', '合计'],
    sumText: '总和',
    subSumText: '合计'
  }

  constructor() {}
  public traverseBF(callback) {
    const queue = []
    let found = false
    queue.push(this.widgetProps.root)
    let currentNode = queue.shift()

    while (!found && currentNode) {
      found = !!callback(currentNode)
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
    const metrics = this.widgetProps.metrics

    const node = new Node(obj, metrics)
    if (this.widgetProps.root === null) {
      this.widgetProps.root = node
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

  public getEqualNode(labelText, treePointItem, index) {
    return treePointItem
      .filter((item, idx) => {
        if (Array.isArray(item)) {
          return tree.getEqualNode(labelText, item, index)
        } else {
          return item.value === labelText && index === idx
        }
      })
      .shift()
  }

  public getEqualParent(index, treeNodeGroup) {
    const { originListItem, levelKey, listIdx } = this.pointOption
    const labelText = originListItem[levelKey]
    if (!listIdx) {
      return (this.pointOption.isExistEqualParent = false)
    }
    this.pointOption.existEqualNode = tree.getEqualNode(
      labelText,
      this.treePointItem,
      index
    )

    const existEqualNodeOfParentKey = this.treePointItem
      .filter((item) => this.pointOption.existEqualNode?.parentId === item.key)
      .pop()?.key

    this.pointOption.initParentKey = this.pointOption.isMetrics
      ? treeNodeGroup.map((item) => item).pop().initKey
      : this.pointOption.parentKey

    const originParentKey = treeNodeGroup
      .filter((item) => this.pointOption.initParentKey === item.initKey)
      .pop()?.key
    this.pointOption.isExistEqualParent =
      originParentKey === existEqualNodeOfParentKey
  }

  public getParentId = (treeNodeGroup) => {
    const { isExistEqualParent, initParentKey, listIdx } = this.pointOption
    if (isExistEqualParent) {
      return this.pointOption.existEqualNode.parentId
    } else {
      if (this.pointOption.isMetrics) {
        return treeNodeGroup[treeNodeGroup.length - 1].initKey
      }
      if (listIdx == 0) {
        return this.pointOption.parentKey
      } else {
        const exitedNode = treeNodeGroup
          .filter((item) => item.initKey == initParentKey)
          .pop()
        return exitedNode.key
      }
    }
  }

  public getPointAttribute = (treeNodeGroup) => {
    const {
      isMetrics,
      isExistEqualParent,
      existEqualNode,
      initKey,
      levelKey,
      levelType,
      originListItem
    } = this.pointOption
    let key = isExistEqualParent ? existEqualNode.key : initKey
    const sumEnd = isSumNodeEnd(key)
    const sumLastEnd = isSumLastNode(key)
    let obj = {
      // data: isMetrics ? originListItem[levelKey] : null,
      value: isMetrics ? levelKey : originListItem[levelKey],
      originKey: getOriginKey(key),
      parentId: tree.getParentId(treeNodeGroup),
      key,
      initKey,
      type: levelType,
      sumLastEnd,
      sumEnd // sum(总停留时间)_19sum(true) sum(总停留时间)_1(false)
    }
    
    if(isMetrics){
      obj[levelKey] = isMetrics ? originListItem[levelKey] : null
    } else {
      obj[this.widgetProps.metrics[0]] =  null
      obj[this.widgetProps.metrics[1]] =  null
    }
    return obj
  }
  public getNodeLevelType(levelKey) {
    const isRow = [
      ...this.widgetProps.rowArray,
      ...this.labelText.rootKey
    ].includes(levelKey)
    const isCol = this.widgetProps.colArray.includes(levelKey)
    // const isMetrics = this.widgetProps.metrics.includes(levelKey)
    let levelType
    if (isRow) {
      levelType = 'row'
    } else if (isCol) {
      levelType = 'col'
    } else {
      levelType = 'metrics'
    }
    return levelType
  }
  public getLevelGroupAttribute(originListItem, listIdx) {
    const treeNodeGroup = []
    const targetNodeGroup = []
    originListItem = { ...this.labelText.rootLevel, ...originListItem }
    const levelKeyGroup = Object.keys(originListItem)
    levelKeyGroup.forEach((levelKey, index) => {
      const isMetrics = this.widgetProps.metrics.includes(levelKey)
      const parentKey = `${levelKeyGroup[index - 1]}_${listIdx}`
      const initKey = `${levelKey}_${listIdx}`
      const levelType = tree.getNodeLevelType(levelKey)
      this.pointOption = {
        initKey,
        parentKey,
        isMetrics,
        levelKey,
        listIdx,
        originListItem,
        levelType
      }
      tree.getEqualParent(index, treeNodeGroup)
      Array.prototype.push.call(
        this.pointOption.isMetrics ? targetNodeGroup : treeNodeGroup,
        tree.getPointAttribute(treeNodeGroup)
      )
    })
    return targetNodeGroup.length
      ? [...treeNodeGroup, targetNodeGroup]
      : [...treeNodeGroup]
  }

  public setTree() {
    this.widgetProps.wideTableList.forEach((item, index) => {
      this.pointOption.existEqualNode = null
      this.pointOption.isExistEqualParent = false
      this.treePointItem = tree.getLevelGroupAttribute(item, index)
      this.treePointItem.forEach((item, i) => {
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

  public getFirstNotSum(node) {
    const { subSumText } = this.labelText
    if (!node.sumEnd) {
      return node
    }
    if (node.value == subSumText && node.parent.value !== subSumText) {
      return node.parent
    }
    node = node.parent
    return tree.getFirstNotSum(node)
  }

  // 获取分支集合 总计和小计两部分
  public getPartBranch(parentNode) {
    const backParent = cloneDeep(parentNode)
    // 在行最后一个几点作为parentNode进行聚合
    if (backParent.originKey === this.widgetProps.rowLast) {
      if (backParent.sumEnd) {
        const args = { backParent, parentNode }
        while (!this.labelText.rootKey.includes(args.backParent.originKey)) {
          args.backParent = args.backParent.parent
        }
        return tree.getFirstNotSum(parentNode).children
      } else {
        return backParent.parent.children
      }
    }
  }
  public collectChildGroup(item) {
    const queue = [item]
    let currentNode = queue.shift()
    while (
      currentNode &&
      currentNode.originKey !== this.widgetProps.colArray[0]
    ) {
      queue.push(...currentNode.children)
      currentNode = queue.shift()
    }
    return [...queue, currentNode]
  }

  // 判断聚合数组是否为空
  public decidePolymerizeGroupEmpty(polymerizeGroup, node) {
    return (
      !polymerizeGroup.length ||
      polymerizeGroup.every((item) => item.value !== node.value)
    )
  }

  // 聚合分支 at lastRowNode  parentNode为lastRowNode curNode为 startColNode
  public getMergePartBranch(parentNode) {
    const polymerizeGroup = []
    tree.getPartBranch(parentNode).forEach((item) => {
      tree.collectChildGroup(item).forEach((node) => {
        const metrics = this.widgetProps.metrics
        let colBeginNode = new Node(cloneDeep(node), metrics)
        if (tree.decidePolymerizeGroupEmpty(polymerizeGroup, node)) {
          polymerizeGroup.push(colBeginNode)
        } else {
          let origin = polymerizeGroup.find(
            (item) => item.value == colBeginNode.value
          )
          const iteration = (origin, target) => {
            if (!origin && !target) {
              return
            }
            if (origin.value !== target.value) {
              return origin.parent.children.push(target)
            }
            target = target.children[0]
            origin =
              origin.children.find((item) => item.value == target.value) ||
              origin.children[0]
            return iteration(origin, target)
          }
          iteration(origin, colBeginNode)
        }
      })
    })
    return polymerizeGroup
  }
  // 复制聚合后非node节点
  public copyPolymerizeNormalNode(copyParems,polymerizeGroup) {
    const {
      deepCopy,
      isLastSumNode,
      parentNode,
      currentNode
    } = copyParems
    const group = polymerizeGroup || currentNode
    return group.reduce((sum, node) => {
      if ( parentNode.originKey == this.widgetProps.colLast) {
        return sum
      } else {
        const polyNormalNode = deepCopy(
          { currentNode: node, parentNode },
          { isLastSumNode: false }
        )
        return sum.concat(polyNormalNode)
      }
    }, [])
  }
  // 获取总和总计节点类型
  public decideSumBranchType(node) {
    const isBeiginNoneParentSumKey = tree.getFirstNotSum(node).originKey

    if (isBeiginNoneParentSumKey === this.labelText.rootKey[0]) {
      return 'rowSum'
    } else if (isBeiginNoneParentSumKey === this.widgetProps.rowLast) {
      return 'colSum'
    } else if (
      isBeiginNoneParentSumKey !== this.widgetProps.rowLast &&
      this.widgetProps.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      return 'rowSubSum'
    } else if (this.widgetProps.colArray.includes(isBeiginNoneParentSumKey)) {
      return 'colSubSum'
    }
  }

  public getColArrayFirstParent(node) {
    while (node.originKey !== this.widgetProps.colArray[0]) {
      node = node.parent
    }
    return node
  }

  public decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber, currentNode } = options
    if (currentNode.type === 'col' && isLastSumNode) {
      return `${nodeValue}sumlast`
    } else {
      return `${nodeValue}${indexNumber}sum`
    }
  }

  public decideSumAttribute(options) {
    const {
      newNode,
      key,
      deepCopy,
      parentNode,
      nodeValue,
      isLastSumNode
    } = options
    switch (key) {
      case 'parentId':
        newNode[key] = parentNode.key
        break
      case 'parent':
        newNode[key] = parentNode
        break
      case 'key':
        newNode.key = tree.decideSumNodeKeyTextDisplay(options)
        newNode.originKey = getOriginKey(newNode.key)
        newNode.type = tree.getNodeLevelType(newNode.originKey)
        newNode.sumEnd = isSumNodeEnd(newNode.key)
        newNode.sumLastEnd = isSumLastNode(newNode.key)
        break
      case 'value':
        newNode[key] = tree.decideSumOrSubSumTextDisplay(options)
        break
      case 'children':
        newNode[key] = tree.copyIteration(
          deepCopy,
          nodeValue,
          newNode,
          isLastSumNode
        )
        break
      default:
        newNode[key] = null
    }
  }
  // 判断总和和合计文字显示
  public decideSumOrSubSumTextDisplay(options) {
    const { nodeValue, isLastSumNode, parentNode, newNode } = options
    const { subSumText, sumText } = this.labelText
    const isMetricValue = parentNode.originKey == this.widgetProps.colLast
    const isParentRowLast = parentNode.originKey == this.widgetProps.rowLast
   
    const isRowSumText =
      !isParentRowLast &&
      [...this.widgetProps.rowArray, ...this.labelText.rootKey].includes(
        parentNode.originKey
      ) &&
      ['rowSum'].includes(tree.decideSumBranchType(parentNode))
    const isColSumText =
      !isMetricValue &&
      [...this.widgetProps.colArray, this.widgetProps.rowLast].includes(
        parentNode.originKey
      ) &&
      ['colSum'].includes(tree.decideSumBranchType(parentNode))

    const isColStartSumText =
      (!isMetricValue &&
        [...this.widgetProps.colArray].includes(parentNode.originKey) &&
        tree.getColArrayFirstParent(parentNode).sumLastEnd) ||
      (isParentRowLast && isLastSumNode && this.widgetProps.colArray.length)
    const isSubSumText = isLastSumNode && !isQuotaSum(nodeValue)
    if (isRowSumText || isColSumText || isColStartSumText) {
      return sumText
    } else if (isSubSumText) {
      return subSumText
    } else {
      return nodeValue
    }
  }

  public copyIteration(
    deepCopy,
    currentNode,
    parentNode,
    isLastSumNode = false
  ) {
    return deepCopy({ currentNode, parentNode }, { isLastSumNode })
  }

  // 聚合分支以及对聚合分支普通节点的复制
  public copyPolymerizeNoramlChild(copyParems) {
    // 聚合分叉分支当父节点是行最后一个时候开始进行分叉
    const {
      parentNode,
      newNode,
      isLastSumNode
    } = copyParems
    let polymerizeGroup
    if ((parentNode.originKey === this.widgetProps.rowLast) && this.widgetProps.colArray.length) {
      polymerizeGroup = tree.getMergePartBranch(parentNode)
    }
    // 普通节点的进行复制 polymerizeGroup 为 聚合后的头部
    if (polymerizeGroup || (!isLastSumNode && parentNode.type === 'col')) {
      return tree.copyPolymerizeNormalNode(copyParems,polymerizeGroup)
    }
    return newNode
  }

  // isLastSumNode true:统一最后一节点, false: 聚合后 要copy普通节点，非sum节点
  public copyTotalNode(currentNode, parentNode) {
    let indexNumber = 0
    const deepCopy = (copyNode, copyOptions) => {
      indexNumber++
      const { currentNode, parentNode } = copyNode
      const { isLastSumNode = true } = copyOptions

      if (typeof currentNode !== 'object' || !currentNode) {
        return currentNode
      }
      const metrics = this.widgetProps.metrics
      let newNode: any = Array.isArray(currentNode) ? [] : new Node({}, metrics)
      const copyParems = {
        deepCopy,
        ...copyNode,
        ...copyOptions,
        newNode,
        indexNumber,
        isLastSumNode
      }
      if (currentNode.length) {
        newNode = tree.copyPolymerizeNoramlChild(copyParems)
        if(parentNode.originKey === this.widgetProps.colLast){
          currentNode.forEach((k)=>{
            const copyNode = tree.copyIteration(
              deepCopy,
              k,
              parentNode,
              true
            )
            newNode.push(copyNode)
          })
        } else {
          const copyNode = tree.copyIteration(
            deepCopy,
            currentNode[0],
            parentNode,
            true
          )
          newNode.push(copyNode)
        }
        
       
      } else {
        Object.keys(currentNode).forEach((key) => {
          const exitedVal = Array.isArray(newNode[key])
            ? newNode[key].length
            : newNode[key]
          if (exitedVal) {
            return
          }
          const nodeValue = currentNode[key]
          const options = { nodeValue, key, ...copyParems }
          tree.decideSumAttribute(options)
        })
      }
      return newNode
    }
    return tree.copyIteration(deepCopy, currentNode, parentNode, true)
  }

  public addTotal() {
    const queue = [this.widgetProps.root]
    let currentNode = queue.shift()
    while (
      currentNode &&
      this.widgetProps.rowColConcat.includes(currentNode.originKey)
    ) {
      queue.push(...currentNode.children)
      currentNode.children.push(
        tree.copyTotalNode(currentNode.children[0], currentNode)
      )
      currentNode = queue.shift()
    }
  }

  public getMetricNodeList() {
    const queue = [this.widgetProps.root]
    let currentNode = queue.shift()
    queue.push(...currentNode.children)
    while (queue.length) {
      currentNode = queue.shift()
      if (this.widgetProps.metrics.includes(currentNode.value)) {
        this.widgetProps.metricNodeList.push(currentNode)
      }
      queue.push(...currentNode.children)
    }
  }

  public getUnSumNodeReduceSum(children, callback) {
    return children
      .filter((item) => callback(item))
      .reduce((sum, node) => {
        return (sum = sum + node.data)
      }, 0)
  }
  public getUnSumNodeReduceSumMetrics(children, key,callback) {
    let filterGroup
    if(children[0].parent.originKey === this.widgetProps.colLast){
      filterGroup = children
    .filter((item) => callback(item) && (item.originKey === key))
    } else {
      filterGroup = children
      .filter((item) => callback(item))
    }

    return filterGroup.reduce((sum, node) => {
        return (sum = sum + node[key])
      }, 0)
  }

  public calcSumNodeDFS() {
    this.widgetProps.metricNodeList.forEach((item) => {
      if (item.sumEnd) {
        // origin初始值为tagSumNode,最终值为第一个parent为非sumNode,branchPath为tagSumNode路径
        const getFirstNonSumParent = (origin, branchPath) => {
          while (origin.sumEnd) {
            branchPath.unshift(origin.value)
            origin = origin.parent
          }
          return {
            from: origin,
            path: branchPath
          }
        }
        const { from, path } = getFirstNonSumParent(item, [])
        this.widgetProps.metrics.forEach((key)=>{
          tree.matchSameNodeSum(from.children, key, path)
        })
        
      } else {
        while (item) {
          const callback = (item) => !item.sumEnd
          // 当item为 tagNode节点时 item.data = item.data
          if(this.widgetProps.metrics.includes(item.originKey)){
            item[item.originKey] =  item[item.originKey]
          } else {
            this.widgetProps.metrics.forEach((key)=>{
              item[key] =  tree.getUnSumNodeReduceSumMetrics(item.children, key, callback)
            })
          }
          item = item.parent
        }
        return
      }
    })
  }

  public matchSameNodeSum(currentQueue, key, path) {
    let level = 0
    let needSumNodeGroup = []
    let currentLevelSumNode = currentQueue.find((item) => item.sumEnd) // 计算目标
    while (currentQueue.length) {
      // needSumNodeGroup 需相加的节点
      needSumNodeGroup = currentQueue.filter((item) => {
        if (this.labelText.sumConcat.includes(path[level])) {
          return item.value !== path[level]
        } else {
          return item.value == path[level]
        }
      })
      const callback = (item) => !item.sumEnd
      currentLevelSumNode[key] = tree.getUnSumNodeReduceSumMetrics(
        needSumNodeGroup,
        key,
        callback
      )
      level++
      // 对上一级目标分支的child进行聚合
      currentQueue = needSumNodeGroup.reduce((pre, cur) => {
        return pre.concat(cur.children)
      }, [])
      // 对要进行赋值node的child进行聚合
      currentLevelSumNode = currentLevelSumNode.children.find(
        (item) => item.value === path[level]
      )
    }
  }

  public getJson() {
    console.log(this.widgetProps.metricNodeList, 'this.widgetProps.metricNodeList')
    this.widgetProps.metricNodeList.forEach((item, idx) => {
      if(!(idx%(this.widgetProps.metrics.length))){
        let obj = {}
        while (item.parent) {
          obj[item.originKey] = item.type === 'metrics' ? item[item.originKey] : item.value
          item = item.parent
        }
        this.widgetProps.transformedWideTableList.push(obj)
      } else {
        let obj = this.widgetProps.transformedWideTableList[this.widgetProps.transformedWideTableList.length-1]
        obj[item.originKey] = item[item.originKey]
      }
    })
  }

  public initProps(options) {
    const { metrics, rowGroup, colGroup, wideTableList } = options
    this.widgetProps.rowColConcat = [...colGroup, ...rowGroup]
    this.widgetProps.rowColConcat.pop()
    this.widgetProps.rowColConcat.push(...this.labelText.rootKey)
    this.widgetProps.metrics = metrics
    this.widgetProps.rowArray = colGroup
    this.widgetProps.colArray = rowGroup
    this.widgetProps.wideTableList = wideTableList
    this.widgetProps.root = null
    this.widgetProps.metricNodeList = []
    this.widgetProps.transformedWideTableList = []
    this.widgetProps.rowLast = colGroup[colGroup.length - 1]
    this.widgetProps.colLast = rowGroup[rowGroup.length - 1]
  }

  public getCompluteJson(options) {
    tree.initProps(options)
    tree.setTree()
    debugger
    tree.addTotal()
    tree.getMetricNodeList()
    tree.calcSumNodeDFS()
    tree.getJson()
    console.log(tree, 'tree')
    return tree
  }
}

let tree = new MultiwayTree()

export default tree
