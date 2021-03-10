
import Node from './node'
import cloneDeep from 'lodash/cloneDeep'
import {
  isRowColLastLevel,
  getOriginKey,
  isColRowMermber,
  isSumNodeStartReg,
  isSumLastNode,
  isQuotaSum,
  isSumNodeEnd,
  isNodeIncludeArray,
  isSumNodeEndReg,
  isQdReg
} from './util'
class MultiwayTree {
  public treePointItem = []
  public widgetProps = {
    root: null,
    wideTableList: [],
    rootArray: ['name_level0'],
    tagGroup: [],
    colArray: [],
    rowArray: [],
    transformedWideTableList: [],
    treeRootTagNodeList: []
  }
  public arrTarget = []
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
    originListItem: {},

  } as any

  constructor() {}
  public traverseBF(callback) {
    const queue = []
    let found = false
    queue.push(this.widgetProps.root)
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


  public getExistEqualNode (labelText, treePointItem, index){
    return treePointItem.filter((item, idx) => {
        if (Array.isArray(item)) {
          return tree.getExistEqualNode(labelText,item, index)
        } else {
          return item.value === labelText && index === idx
        }
      })
      .shift()
  }
  public isEqualTreeNode(index, treeNodeGroup) {
    const {originListItem, levelKey, listIdx} = this.pointOption
    const labelText = originListItem[levelKey]
    if (!listIdx) {
      return (this.pointOption.isExistEqualParent = false)
    }
    this.pointOption.existEqualNode = tree.getExistEqualNode(labelText, this.treePointItem,index)

    const existEqualNodeOfParentKey = this.treePointItem
      .filter((item) => this.pointOption.existEqualNode?.parentId === item.key)
      .pop()?.key

    this.pointOption.initParentKey = this.pointOption.isMetrics
      ? treeNodeGroup.map((o) => o).pop().initKey
      : this.pointOption.parentKey

    const originParentKey = treeNodeGroup
      .filter((item) => this.pointOption.initParentKey === item.initKey)
      .pop()?.key
    this.pointOption.isExistEqualParent =
      originParentKey === existEqualNodeOfParentKey
  }
  public getNodeParentId = (treeNodeGroup) => {
    const {
      isExistEqualParent,
      initParentKey,
      listIdx,
    } = this.pointOption
    if (isExistEqualParent) {
      return this.pointOption.existEqualNode.parentId
    } else {
      if(this.pointOption.isMetrics){
        return treeNodeGroup[treeNodeGroup.length-1].initKey
      }
      if(listIdx == 0){
        return this.pointOption.parentKey
      } else {
        const exitedNode = treeNodeGroup.filter((item) => item.initKey == initParentKey).pop()
        return exitedNode.key
      }
      
    }
  }
  public buildTreeNodeData = (treeNodeGroup) => {
    const {
      isMetrics,
      isExistEqualParent,
      existEqualNode,
      initKey,
      levelKey,
      originListItem
    } = this.pointOption
    
    return {
      data: isMetrics ? originListItem[levelKey] : null,
      value: isMetrics ? levelKey : originListItem[levelKey],
      initKey,
      parentId: tree.getNodeParentId(treeNodeGroup),
      key: isExistEqualParent ? existEqualNode.key : initKey
    }
  }
  public buildTreePointItem(originListItem, listIdx) {
    const treeNodeGroup = []
    const targetNodeGroup = []
    originListItem = { name_level0: 'root', ...originListItem }
    const levelKeyGroup = Object.keys(originListItem)
    levelKeyGroup.forEach((levelKey, index) => {
      this.pointOption = {
        initKey: `${levelKey}_${listIdx}`,
        parentKey: `${levelKeyGroup[index - 1]}_${listIdx}`,
        isMetrics: this.widgetProps.tagGroup.includes(levelKey),
        levelKey,
        listIdx,
        originListItem,
      }
      tree.isEqualTreeNode(index,treeNodeGroup)
      Array.prototype.push.call(
        this.pointOption.isMetrics ? targetNodeGroup : treeNodeGroup,
        tree.buildTreeNodeData(treeNodeGroup)
      )
    })
    return [...treeNodeGroup, targetNodeGroup]
  }

  public constructMultiwayTree() {
    
    this.widgetProps.wideTableList.forEach((item, index) => {
      this.pointOption.existEqualNode = null
      this.pointOption.isExistEqualParent = false
    
      this.treePointItem = tree.buildTreePointItem(item, index)
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
      if (!isSumNodeEnd(node.key)) {
        return node
      }
      if (node.value == '合计' && node.parent.value !== '合计'){
        return node.parent
      }
      node = node.parent
      return tree.getFirstNotSum(node)
  }
  // 获取分支集合 总计和小计两部分
  public getPartBranch(parentNode) {
    const backParent = cloneDeep(parentNode)
    // 在行最后一个几点作为parentNode进行聚合
    if (isRowColLastLevel(backParent, this.widgetProps.rowArray)) {
      if (isSumNodeEnd(backParent.key)) {
        const args = { backParent, parentNode }
        const getRoot = (args) => {
          if (
            this.widgetProps.rootArray.includes(
              getOriginKey(args.backParent.key)
            )
          ) {
            return tree.getFirstNotSum(parentNode).children
          }
          args.backParent = args.backParent.parent
          return getRoot(args)
        }
        return getRoot(args)
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
      getOriginKey(currentNode.key) !== this.widgetProps.colArray[0]
    ) {
      if (currentNode) {
        queue.push(...currentNode.children)
        currentNode = queue.shift()
      }
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
        getOriginKey(parentNode.key) ==
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
    const isBeiginNoneParentSumKey = getOriginKey(tree.getFirstNotSum(node).key)

    if (isBeiginNoneParentSumKey === 'name_level0') {
      return 'rowSum'
    } else if (
      isBeiginNoneParentSumKey ===
      this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1]
    ) {
      return 'colSum'
    } else if (
      isBeiginNoneParentSumKey !==
        this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1] &&
      this.widgetProps.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      return 'rowSubSum'
    } else if (this.widgetProps.colArray.includes(isBeiginNoneParentSumKey)) {
      return 'colSubSum'
    }
  }
  public getColArrayFirstParent(node) {
    const getColArrayFirstParent = (node) => {
      if (getOriginKey(node.key) === this.widgetProps.colArray[0]) return node
      node = node.parent
      return getColArrayFirstParent(node)
    }
    return getColArrayFirstParent(node)
  }
  public decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber } = options
    const isSumLastText =
      isColRowMermber(this.widgetProps.colArray, nodeValue) && isLastSumNode

    if (isSumLastText) {
      return `${nodeValue}sumlast`
    } else {
      // 对于行指标的key
      return `${nodeValue}${indexNumber}sum`
    }
  }
  // 判断总和和合计文字显示
  public decideSumOrSubSumTextDisplay(options) {
    const { nodeValue, isLastSumNode, parentNode } = options
    const isRowSumText =
      !isRowColLastLevel(parentNode, this.widgetProps.rowArray) &&
      isNodeIncludeArray(
        [...this.widgetProps.rowArray, ...this.widgetProps.rootArray],
        parentNode
      ) &&
      ['rowSum'].includes(tree.decideSumBranchType(parentNode))
    const isColSumText =
      !isRowColLastLevel(parentNode, this.widgetProps.colArray) &&
      isNodeIncludeArray(
        [
          ...this.widgetProps.colArray,
          this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1]
        ],
        parentNode
      ) &&
      ['colSum'].includes(tree.decideSumBranchType(parentNode))
    const isColStartSumText =
      (!isQuotaSum(nodeValue) &&
        isNodeIncludeArray([...this.widgetProps.colArray], parentNode) &&
        isSumLastNode(tree.getColArrayFirstParent(parentNode).key)) ||
      (getOriginKey(parentNode.key) ===
        this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1] &&
        isLastSumNode)
    const isSubSumText = isLastSumNode && !isQuotaSum(nodeValue)
    if (isRowSumText || isColSumText || isColStartSumText) {
      return '总和'
    } else if (isSubSumText) {
      return '合计'
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
    if (isRowColLastLevel(parentNode, this.widgetProps.rowArray)) {
      polymerizeGroup = tree.getMergePartBranch(parentNode)
    }
    // 普通节点的进行复制 polymerizeGroup 为 聚合后的头部
    const isNeedCopy =
      !isLastSumNode &&
      isColRowMermber(this.widgetProps.colArray, parentNode.key)
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
        newNode.push(
          tree.copyIteration(deepCopy, currentNode[0], parentNode, true)
        )
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
            newNode[key] = tree.decideSumNodeKeyTextDisplay(options)
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
  public addTotalNodeToTree() {
    const rowColConcat = [
      ...this.widgetProps.rowArray,
      ...this.widgetProps.colArray,
      ...this.widgetProps.rootArray
    ]
    rowColConcat.splice(rowColConcat.length - 2, 1) // 注意
    const queue = [this.widgetProps.root]
    let currentNode = queue.shift()
    console.log(rowColConcat, 'rowColConcat')
    while (
      currentNode &&
      rowColConcat.includes(getOriginKey(currentNode.key))
    ) {
      if (currentNode) {
        queue.push(...currentNode.children)

        currentNode.children.push(
          tree.copyTotalNode(currentNode.children[0], currentNode)
        )
        currentNode = queue.shift()
      }
    }
  }
  public setNodeParentName() {
    const queue = [this.widgetProps.root]
    const currentNode = queue.shift()
    queue.push(...currentNode.children)
    const iteration = (currentNode) => {
      queue.forEach((item) => {
        currentNode = queue.shift()
        if (this.widgetProps.tagGroup.includes(currentNode.value)) {
          this.widgetProps.treeRootTagNodeList.push(currentNode)
        }
        queue.push(...currentNode.children)
        iteration(currentNode)
      })
    }
    iteration(currentNode)
  }
  // 筛选 非sum node并求和
  public getUnSumNodeReduceSum(children) {
    const nonSumNodeGroup = children.filter((item) => !isSumNodeEnd(item.key))
    return nonSumNodeGroup.reduce((sum, node) => {
      return (sum = sum + node.data)
    }, 0)
  }
  public calcSumNodeDFS() {
    // origin初始值为tagSumNode,最终值为第一个parent为非sumNode,branchPath为tagSumNode路径
    const getFirstNonSumParent = (origin, branchPath) => {
      if (!isSumNodeEnd(origin.key)) {
        return {
          from: origin,
          path: branchPath
        }
      }
      branchPath.unshift(origin.value)
      origin = origin.parent
      return getFirstNonSumParent(origin, branchPath)
    }
    this.widgetProps.treeRootTagNodeList.forEach((item) => {
      // 对于tagNode为sumNode
      if (isSumNodeEnd(item.key)) {
        const { from, path } = getFirstNonSumParent(item, [])
        tree.matchSameNodeSum(from.children, item, path)
      } else {
        // 对于tagNode为非sumNode
        const iteration = (item) => {
          if (!item) {
            return
          }
          item.data = tree.getUnSumNodeReduceSum(item.children) || item.data
          // 当item为 tagNode节点或者tagNode节点时 item.data = item.data
          item = item.parent
          return iteration(item)
        }
        iteration(item)
      }
    })
  }
  // 匹配 sumNode 相同同级节点进行向上递归求和
  public matchSameNodeSum(isStartNonParentSumNode, origin, path) {
    const initLevel = 0
    let searchTarget = []
    const target = isStartNonParentSumNode.find((item) =>
      isSumNodeEnd(item.key)
    ) // 获取目标
    const getOriginSameLevel = (currentQueue, initLevel, target) => {
      if (!currentQueue.length) {
        return
      }
      // path level为总和总计, 筛选非 总计总和的分支
      searchTarget = currentQueue.filter((item) => {
        if (['合计', '总和'].includes(path[initLevel])) {
          return item.value !== path[initLevel]
        } else {
          return item.value == path[initLevel]
        }
      })
      if (['合计', '总和'].includes(path[initLevel])) {
        // 筛选 currentQueue中 非sumNode分支的和
        target.data = tree.getUnSumNodeReduceSum(currentQueue)
      } else {
        // 筛选与path[initLevel]同名的分支求和，且筛选去重
        target.data = searchTarget
          .filter((item) => {
            return !isSumNodeEnd(item.parentId)
          })
          .reduce((sum, node) => {
            return (sum = sum + node.data)
          }, 0)
      }
      initLevel++
      // 对上一级目标分支的child进行聚合
      currentQueue = searchTarget.reduce((pre, cur) => {
        return pre.concat(cur.children)
      }, [])
      // 对要进行赋值node的child进行聚合
      target = target.children.find((item) => item.value === path[initLevel])
      return getOriginSameLevel(currentQueue, initLevel, target)
    }
    getOriginSameLevel(isStartNonParentSumNode, initLevel, target)
    // 最后searchTarget为tagNode
    return searchTarget[0].data
  }
  public getJson() {
    this.widgetProps.treeRootTagNodeList.forEach((item) => {
      const obj = {}
      const iteration = (item, obj) => {
        if (!item.parent) {
          return this.widgetProps.transformedWideTableList.push(obj)
        }
        obj[getOriginKey(item.key)] = isQuotaSum(item.key)
          ? item.data
          : item.value
        item = item.parent
        return iteration(item, obj)
      }
      iteration(item, obj)
    })
  }
  public initWidgetProps(tagGroup,rowGroup, colGroup, wideTableList) {
    this.widgetProps.tagGroup = tagGroup
    this.widgetProps.rowArray = colGroup
    this.widgetProps.colArray = rowGroup
    this.widgetProps.wideTableList = wideTableList
    this.widgetProps.root = null
    this.widgetProps.treeRootTagNodeList = []
    this.widgetProps.transformedWideTableList = []
  }

  public getCompluteJson(tagGroup, rowGroup, colGroup, wideTableList) {
    tree.initWidgetProps(tagGroup, rowGroup, colGroup, wideTableList)
    tree.constructMultiwayTree()
    tree.addTotalNodeToTree()
    tree.setNodeParentName()
    tree.calcSumNodeDFS()
    tree.getJson()
    return tree
  }
}

let tree = new MultiwayTree()

export default tree
