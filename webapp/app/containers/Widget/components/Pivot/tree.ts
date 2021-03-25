import Node from './node'
import cloneDeep from 'lodash/cloneDeep'
import {
  getOriginKey,
  isSumLastNode,
  isSumNodeEnd,
  isColRowMermber
} from './util'
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
    const node = new Node(obj)
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
    return {
      data: isMetrics ? originListItem[levelKey] : null,
      value: isMetrics ? levelKey : originListItem[levelKey],
      originKey: getOriginKey(key),
      parentId: tree.getParentId(treeNodeGroup),
      key,
      initKey,
      type: levelType,
      sumEnd // sum(总停留时间)_19sum(true) sum(总停留时间)_1(false)
    }
  }
  public getNodeLevelType(levelKey) {
    const isRow = [...this.widgetProps.rowArray, ...this.labelText.rootKey].includes(levelKey)
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
      // console.log(levelKey, 'levelKey')
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

  // 获取父节点首个不为sum
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
        while(!this.labelText.rootKey.includes(args.backParent.originKey)){
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
        const colBeginNode = new Node(cloneDeep(node))
        if (tree.decidePolymerizeGroupEmpty(polymerizeGroup, node)) {
          polymerizeGroup.push(colBeginNode)
        } else {
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
          const origin = polymerizeGroup.find(
            (item) => item.value == colBeginNode.value
          )
          iteration(origin, colBeginNode)
        }
      })
    })
    return polymerizeGroup
  }
  // 复制聚合后非node节点
  public copyPolymerizeNormalNode(polymerizeOptions) {
    const {
      deepCopy,
      isLastSumNode,
      parentNode,
      polymerizeGroup,
      currentNode
    } = polymerizeOptions
    const group = polymerizeGroup || currentNode
    return group.reduce((sum, node) => {
      if (
        parentNode.originKey ==
        this.widgetProps.colArray[this.widgetProps.colArray.length - 1]
      ) {
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
    } else if (
      isBeiginNoneParentSumKey ===
      this.widgetProps.rowLast
    ) {
      return 'colSum'
    } else if (
      isBeiginNoneParentSumKey !==
        this.widgetProps.rowLast &&
      this.widgetProps.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      return 'rowSubSum'
    } else if (this.widgetProps.colArray.includes(isBeiginNoneParentSumKey)) {
      return 'colSubSum'
    }
  }

  public getColArrayFirstParent(node) {
    while(node.originKey !== this.widgetProps.colArray[0]){
      node = node.parent
    }
    return node
  }
  public decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber, currentNode } = options
    console.log(nodeValue, options, '1111')
    const isSumLastText =
      (currentNode.type === 'col') 
      && isLastSumNode

    if (isSumLastText) {
      return `${nodeValue}sumlast`
    } else {
      // 对于行指标的key
      return `${nodeValue}${indexNumber}sum`
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
      [...this.widgetProps.rowArray, ...this.labelText.rootKey].includes(parentNode.originKey)&&
      ['rowSum'].includes(tree.decideSumBranchType(parentNode))
    const isColSumText = !isMetricValue &&
      [
        ...this.widgetProps.colArray,
        this.widgetProps.rowLast
      ].includes(parentNode.originKey) &&
      ['colSum'].includes(tree.decideSumBranchType(parentNode))
    const isColStartSumText =
      (!isMetricValue &&[...this.widgetProps.colArray].includes(parentNode.originKey) &&
        isSumLastNode(tree.getColArrayFirstParent(parentNode).key)) ||
      (isParentRowLast &&
        isLastSumNode &&
        this.widgetProps.colArray.length)
    const isSubSumText = isLastSumNode && !isMetricValue
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
      deepCopy,
      currentNode,
      parentNode,
      newNode,
      isLastSumNode
    } = copyParems
    let polymerizeGroup
    const isRowColLastLevels = parentNode.originKey === this.widgetProps.rowLast
    if (isRowColLastLevels && this.widgetProps.colArray.length) {
      polymerizeGroup = tree.getMergePartBranch(parentNode)
    }
    // 普通节点的进行复制 polymerizeGroup 为 聚合后的头部
    const isNeedCopy =
      !isLastSumNode &&
      (parentNode.type === 'col')
    if (polymerizeGroup || isNeedCopy) {
      const polymerizeOptions = {
        deepCopy,
        isLastSumNode,
        parentNode,
        polymerizeGroup,
        currentNode
      }
      return tree.copyPolymerizeNormalNode(polymerizeOptions)
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

      let newNode: any = Array.isArray(currentNode) ? [] : new Node({})
      const copyParems = {
        deepCopy,
        ...copyNode,
        ...copyOptions,
        newNode,
        indexNumber
      }
      if (currentNode.length) {
        newNode = tree.copyPolymerizeNoramlChild(copyParems)
        const copyNode = tree.copyIteration(
          deepCopy,
          currentNode[0],
          parentNode,
          true
        )
        newNode.push(copyNode)
      } else {
        Object.keys(currentNode).forEach((key) => {
          const isEmpty = Array.isArray(newNode[key])
            ? newNode[key].length
            : newNode[key]
          if (isEmpty) {
            return
          }
          const nodeValue = currentNode[key]
          const options = { nodeValue, ...copyParems }
          if (key === 'parentId') {
            newNode[key] = parentNode.key
          } else if (key === 'parent') {
            newNode[key] = parentNode
          } else if (key === 'key') {
            newNode.key = tree.decideSumNodeKeyTextDisplay(options)
            newNode.originKey = getOriginKey(newNode.key)
            newNode.type = tree.getNodeLevelType(newNode.originKey)
            newNode.sumEnd = isSumNodeEnd(newNode.key)
          } else if (key === 'value') {
            newNode[key] = tree.decideSumOrSubSumTextDisplay(options)
          } else if (key == 'children') {
            newNode[key] = tree.copyIteration(
              deepCopy,
              nodeValue,
              newNode,
              isLastSumNode
            )
          } else {
            newNode[key] = null
          }
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
  // 筛选 非sum node并求和
  public getUnSumNodeReduceSum(children,cb) {
    const nonSumNodeGroup = children.filter((item) => cb(item))
    return nonSumNodeGroup.reduce((sum, node) => {
      return (sum = sum + node.data)
    }, 0)
  }
  public calcSumNodeDFS() {
    this.widgetProps.metricNodeList.forEach((item) => {
      // 对于tagNode为sumNode
      if (item.sumEnd) {
        // origin初始值为tagSumNode,最终值为第一个parent为非sumNode,branchPath为tagSumNode路径
        const getFirstNonSumParent = (origin, branchPath) => {
          while(origin.sumEnd){
            branchPath.unshift(origin.value)
            origin = origin.parent
          }
          return {
            from: origin,
            path: branchPath
          }
        }
        const { from, path } = getFirstNonSumParent(item, [])
        tree.matchSameNodeSum(from.children, path)
      } else {
        // 对于tagNode为非sumNode
        while (item) {
          const cb =(item)=> !item.sumEnd
          item.data = tree.getUnSumNodeReduceSum(item.children, cb) || item.data  // 当item为 tagNode节点时 item.data = item.data
          item = item.parent
        }
        return
      }
      let obj = {}
      while (item.parent) {
        obj[item.originKey] = item.type === 'metrics' ? item.data : item.value
        item = item.parent
      }
      this.widgetProps.transformedWideTableList.push(obj)
    })
  }

  // 匹配 sumNode 相同同级节点进行向上递归求和
  public matchSameNodeSum(currentQueue, path) {
    let initLevel = 0
    let searchTarget = []
    let target = currentQueue.find((item) =>
      item.sumEnd
    ) // 获取目标
    while(currentQueue.length){
      // path level为总和总计, 筛选非 总计总和的分支
      searchTarget = currentQueue.filter((item) => {
        if (this.labelText.sumConcat.includes(path[initLevel])) {
          return item.value !== path[initLevel]
        } else {
          return item.value == path[initLevel]
        }
      })
      if (this.labelText.sumConcat.includes(path[initLevel])) {
        // 筛选 currentQueue中 非sumNode分支的和
        const cb =(item)=> !item.sumEnd
        target.data = tree.getUnSumNodeReduceSum(currentQueue, cb)
      } else {
        // 筛选与path[initLevel]同名的分支求和，且筛选去重
        const cb = (item) => !isSumNodeEnd(item.parentId)
        target.data = tree.getUnSumNodeReduceSum(searchTarget, cb)
      }
      initLevel++
      // 对上一级目标分支的child进行聚合
      currentQueue = searchTarget.reduce((pre, cur) => {
        return pre.concat(cur.children)
      }, [])
      // 对要进行赋值node的child进行聚合
      target = target.children.find((item) => item.value === path[initLevel])
    }
    // 最后searchTarget为tagNode
    return searchTarget[0].data
  }
  public initProps(options) {
    const { metrics, rowGroup, colGroup, wideTableList } = options
    this.widgetProps.rowColConcat = [
      ...colGroup,
      ...rowGroup,
    ]
    this.widgetProps.rowColConcat.pop()
    this.widgetProps.rowColConcat.push(...this.labelText.rootKey)
    this.widgetProps.metrics = metrics
    this.widgetProps.rowArray = colGroup
    this.widgetProps.colArray = rowGroup
    this.widgetProps.wideTableList = wideTableList
    this.widgetProps.root = null
    this.widgetProps.metricNodeList = []
    this.widgetProps.transformedWideTableList = []
    this.widgetProps.rowLast = colGroup[colGroup.length-1]
    this.widgetProps.colLast = rowGroup[rowGroup.length-1]
  }

  public getCompluteJson(options) {
    console.time('time')
    tree.initProps(options)
    tree.setTree()
    tree.addTotal()
    tree.getMetricNodeList()
    tree.calcSumNodeDFS()
    console.log(tree, 'tree')
    console.timeEnd('time')

    return tree
  }
}

let tree = new MultiwayTree()

export default tree
