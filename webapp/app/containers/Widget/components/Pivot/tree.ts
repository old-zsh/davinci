/*
 * @Author: your name
 * @Date: 2021-02-22 16:19:27
 * @LastEditTime: 2021-03-01 18:53:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /davinci-fork/davinci/webapp/app/containers/Widget/components/Pivot/test.ts
 */
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
  public group = {}
  public treePointItem = []
  public rowPath = {}
  public rowColTopLevelPath = {}
  public groupWholePath = []
  public widgetProps = {
    root: null,
    wideTableList: [],
    rootArray: ['name_level0'],
    tagGroup: ['sum(总停留时间)'],
    colArray: [],
    rowArray: [],
    transformedWideTableList: [],
    treeRootTagNodeList: []
  }
  public arrTarget = []
  public treeOption = {
    treePointItem: [],
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
    },
    treeAllPath: [],
    topNewPartType: ''
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

  public buildTreePointItem(treeItem, treeIndex) {
    const treeNodeGroup = []
    const targetNodeGroup = []

    treeItem = { name_level0: 'root', ...treeItem }
    const treeItemKeys = Object.keys(treeItem)
    treeItemKeys.forEach((levelKey, levelIndex) => {
      this.treeOption = {
        defaultKey: `${levelKey}_${treeIndex}`,
        parentKey: `${treeItemKeys[levelIndex - 1]}_${treeIndex}`,
        targetNode: this.widgetProps.tagGroup.includes(levelKey),
        nodeValue: treeItem[levelKey],
        levelOption: { treeItem, treeIndex, levelKey, levelIndex }
      }

      tree.isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup)
      const buildTreeNodeData = () => {
        const {
          targetNode,
          defaultKey,
          levelOption,
          hasSameParent,
          existEqualNode,
          parentKey,
          parentDefaultKey
        } = this.treeOption
        const { treeItem, treeIndex, levelKey } = levelOption
        const getNodeParentId = () => {
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
              .filter((k) => k.defaultKey == parentDefaultKey)
              .pop()?.key
          }
        }
        return {
          data: targetNode ? treeItem[levelKey] : null,
          value: targetNode ? levelKey : treeItem[levelKey],
          defaultKey,
          parentId: getNodeParentId(),
          key: hasSameParent ? existEqualNode.key : defaultKey
        }
      }
      Array.prototype.push.call(
        this.treeOption.targetNode ? targetNodeGroup : treeNodeGroup,
        buildTreeNodeData()
      )
    })
    return [...treeNodeGroup, targetNodeGroup]
  }

  public constructMultiwayTree() {
    this.widgetProps.wideTableList.forEach((item, index) => {
      this.treeOption.existEqualNode = null
      this.treeOption.hasSameParent = false
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
    const getFirstNotSum = (node) => {
      if (!isSumNodeEnd(node.key)) {
        return node
      }
      if (node.value == '合计' && node.parent.value !== '合计')
        return node.parent
      node = node.parent
      return getFirstNotSum(node)
    }
    return getFirstNotSum(node)
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
  public setNodePath(node) {
    node.path = {}
    let nodePath = node.path
    const iteration = (node) => {
      if (getOriginKey(node.key) === this.widgetProps.colArray[0])
        return nodePath
      node = node.parent
      nodePath[getOriginKey(node.key)] = node.value
      return iteration(node)
    }
    return iteration(node)
  }
  public setAllNodePath(node) {
    node.fullPath = {}
    let nodePath = node.fullPath
    const iteration = (node) => {
      if (getOriginKey(node.key) === this.widgetProps.rowArray[0])
        return nodePath
      node = node.parent
      nodePath[getOriginKey(node.key)] = node.value
      return iteration(node)
    }
    return iteration(node)
  }
  // 获取 指标根节点集合
  public getTreeRootOfTag() {
    this.treeOption.treeAllPath = {}

    const queue = [this.widgetProps.root]
    const currentNode = queue.shift()
    queue.push(...currentNode.children)
    const iteration = (currentNode) => {
      queue.forEach((item) => {
        currentNode = queue.shift()
        if (this.widgetProps.tagGroup.includes(currentNode.value)) {
          if (!isSumNodeEnd(currentNode.key)) {
            // currentNode.startLevel = this.widgetProps.colArray[0]
            currentNode.parentName = 'noraml'
            currentNode.type = 'noramlNode'
            currentNode.path = tree.setNodePath(currentNode)
            currentNode.fullPath = tree.setAllNodePath(currentNode)
            let firstLevel: any = Object.values(currentNode.fullPath).pop()

            if (!this.treeOption.treeAllPath[firstLevel]) {
              this.treeOption.treeAllPath[firstLevel] = []
            } else {
              let valArray = Object.values(currentNode.fullPath)
              valArray.pop()
              this.treeOption.treeAllPath[firstLevel].push(valArray.join())
            }
          } else {
            const getFirstNotSums = (node) => {
              const getFirstNotSum = (node) => {
                if (!isSumLastNode(node.key)) return node
                node = node.parent
                return getFirstNotSum(node)
              }
              return getFirstNotSum(node)
            }
            // if (currentNode.key === 'sum(总停留时间)_035sum') {
            //   debugger
            // }
            // if (currentNode.key === 'sum(总停留时间)_05sum') {
            //   debugger
            // }
            if (
              getOriginKey(getFirstNotSums(currentNode.parent).key) ==
              this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1]
            ) {
              // if(this.widgetProps.rowArray.includes(getOriginKey(getFirstNotSums(currentNode.parent).key))){
              //   // const test = (node) => {
              //   //   const iteration = (node) => {
              //   //     if (getOriginKey(node.key) === this.widgetProps.colArray[0]) return node
              //   //     node = node.parent
              //   //     return iteration(node)
              //   //   }
              //   //   return iteration(node)
              //   // }
              //   // var startNode = test(currentNode.parent)

              // }
              var startNode = getFirstNotSums(currentNode.parent)
            } else {
              // 小计
              // 区分正常总计和总计下面总计currentNode.parent.value === '合计'判断

              var startNode = tree.getFirstNotSum(currentNode)
              if (
                !this.widgetProps.colArray.includes(
                  getOriginKey(startNode.key)
                ) &&
                currentNode.parent.value === '合计'
              ) {
                var startNode = currentNode.parent.parent
              }
            }

            if (
              getOriginKey(startNode.key) ===
              this.widgetProps.rowArray[this.widgetProps.rowArray.length - 1]
            ) {
              // 行总和
              const getParent = (node) => {
                if (node.parentId === 'name_level0_0') return node
                node = node.parent
                return getParent(node)
              }
              currentNode.parentLevel = getOriginKey(getParent(currentNode).key)
              currentNode.parentName = getParent(currentNode).value
            } else {
              // 列总和和小计
              currentNode.parentName = startNode.value
              currentNode.parentLevel = getOriginKey(startNode.key)
              // currentNode.parentLevel = '1111'
            }

            currentNode.startLevel = getOriginKey(
              startNode.children[startNode.children.length - 1].key
            )
            currentNode.type = 'sumlNode'
          }

          this.widgetProps.treeRootTagNodeList.push(currentNode)
        }
        queue.push(...currentNode.children)
        iteration(currentNode)
      })
    }
    iteration(currentNode)

    console.log(this.treeOption.treeAllPath, 'this.treeOption.treeAllPath')
  }
  public getMultipleGroupSamePart(obj) {
    let concatGroup = Object.values(obj)
    let firstArray: any = concatGroup.shift()
    const isEveryExited = firstArray.reduce((pre, cur) => {
      let isOtherArrayExited = concatGroup.every((o: any) => {
        return o.some((j) => j === cur)
      })
      return isOtherArrayExited ? [...pre, cur] : [...pre]
    }, [])
    // console.log(isEveryExited, 'isEveryExited')
    return isEveryExited.length > 2
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

  public initWidgetProps(rowGroup, colGroup, wideTableList) {
    this.widgetProps.rowArray = colGroup
    this.widgetProps.colArray = rowGroup
    this.widgetProps.wideTableList = wideTableList
    this.widgetProps.root = null
    this.widgetProps.treeRootTagNodeList = []
    this.widgetProps.transformedWideTableList = []
    this.arrTarget = [
      this.widgetProps.rowArray[0],
      ...this.widgetProps.colArray
    ]
  }

  public getCompluteJson(rowGroup, colGroup, wideTableList) {
    tree.initWidgetProps(rowGroup, colGroup, wideTableList)
    tree.constructMultiwayTree()
    tree.addTotalNodeToTree()
    tree.getTreeRootOfTag()
    tree.calcSumNodeDFS()
    tree.buildJson()
    tree.getJson()
    return tree
  }

  public decideRowForwardOrBack(path, target) {
    const flatPathKeyGroup = Object.keys(path).flat(Infinity)
    const flatPathValueGroup = Object.values(path).flat(Infinity)
    // target作为key在path中出现个数
    const targetAsKeyCount = flatPathKeyGroup.filter((item) => {
      return isSumNodeStartReg(target, item)
    })
    //target作为key在path中出现个数
    const targetAsKeyMoreThanOne =
      Array.from(new Set(targetAsKeyCount)).length > 1

    const targetAsKeyOfVal = path[targetAsKeyCount[0]]
    let isType
    // 倒叙情况，targetAsKeyOfVal只有一个
    if (targetAsKeyOfVal.length == 1) {
      // 倒叙
      // 查找存在这个值,在path作为value存在多少个，
      const valOfCount = flatPathValueGroup.filter((item) => {
        return item === targetAsKeyOfVal[0]
      })
      const isValOfcountMoreOne = Array.from(new Set(valOfCount)).length == 1
      if (valOfCount.length >= 1 && isValOfcountMoreOne) {
        isType = 'back'
      }
    } else {
      // 正序 判断value值各不相同
      let targetAsKeyOfValMoreThanOne =
        Array.from(new Set(targetAsKeyOfVal)).length > 1
      // 判断多个value对应的key是相同的
      let isValueOfKeyIsSame = targetAsKeyOfVal.every((item) => {
        return (
          // target为新媒体营销 ，右侧为新媒体营销_name_level2
          target ===
          flatPathKeyGroup.filter((o) => {
            return path[o].includes(item)
          })[0]
        )
      })
      if (targetAsKeyOfValMoreThanOne) {
        isType = 'forward'
      }
    }
    return isType
  }

  public decideColBranchBreakUp(path, value) {
    let branchBreakUpLevel
    const flatPathValueGroup = Object.values(path).flat(Infinity)
    // 倒叙: value-基础上线工作,查找path中基础上线工作为value的值
    const valueCountGroupOne = flatPathValueGroup.filter((item) => {
      return isSumNodeStartReg(value, item)
    }) // ["基础上线工作_name_level2","基础上线工作_name_level2","基础上线工作_name_level2","基础上线工作_name_level2","基础上线工作_name_level2"]

    // 判断value值是否为同一个
    const isSameMoreCountValueOne =
      Array.from(new Set(valueCountGroupOne)).length == 1

    // 对应的key值，此处判断是否为不同的多个 ["运营商_name_level3", "PC_name_level3", "Wap_name_level3", "AppStore_name_level3", "Android AppStore_name_level3"]
    let valueOfKey = Object.keys(path).filter((key) => {
      return path[key].some((item) => isSumNodeStartReg(value, item))
    })
    // 查找此对对应的key在path出现的次数
    const valueOfKeyOfValueCount = flatPathValueGroup.filter(
      (item) => item === valueOfKey[0]
    )
    const isSameMoreCountValueTwo =
      Array.from(new Set(valueOfKeyOfValueCount)).length == 1
    // key
    const isDifferMoreKey = Array.from(new Set(valueOfKey)).length > 1
    // 对应的相同的多个

    // if (isSameMoreCountValueOne && isDifferMoreKey) {
    //   console.log('倒叙')
    // }

    if (
      valueCountGroupOne.length > 1 &&
      isSameMoreCountValueOne &&
      isDifferMoreKey
    ) {
      // 子为value相同的多个
      branchBreakUpLevel = [
        ...this.widgetProps.rowArray,
        ...this.widgetProps.colArray
      ].find((item) => isSumNodeEndReg(item, valueOfKey[0]))
      return {
        branchBreakUpLevel: branchBreakUpLevel,
        isBranchBreakUp: true
      }
    } else if (valueOfKeyOfValueCount.length > 1 && isSameMoreCountValueTwo) {
      const itration = (test, value) => {
        if (Array.from(new Set(test)).length == test.length)
          return [
            ...this.widgetProps.rowArray,
            ...this.widgetProps.colArray
          ].find((item) => isSumNodeEndReg(item, value))
        test = Object.keys(path).filter((key) => {
          // value对应的key的集合
          return path[key].some((item) => item === value)
        })
        return itration(test, test[0])
      }
      return {
        branchBreakUpLevel: branchBreakUpLevel
          ? branchBreakUpLevel
          : itration(valueOfKeyOfValueCount, valueOfKeyOfValueCount[0]),
        isBranchBreakUp: true
      }
    } else {
      return {
        branchBreakUpLevel: this.widgetProps.rowArray[0],
        isBranchBreakUp: false
      }
    }
  }
  public getFirstNotSumLevel(item) {
    const getParent = (node) => {
      if (
        getOriginKey(node.key) ==
        tree.decideColBranchBreakUp(this.rowPath, item.parentName)
          .branchBreakUpLevel
      )
        return node.value
      node = node.parent
      return getParent(node)
    }
    return getParent(item)
  }
  public getRowPath() {
    this.widgetProps.treeRootTagNodeList
      .filter((item) => item.parentName === 'noraml')
      .forEach((o) => {
        let arr = Object.keys(o.path).reverse()
        let newObj = o.path
        arr.forEach((key, index) => {
          let newKey = `${newObj[key]}_${key}`
          if (index < arr.length - 1) {
            if (!this.rowPath[newKey]) {
              this.rowPath[newKey] = []
            }
            const child = `${newObj[arr[index + 1]]}_${arr[index + 1]}`
            if (!this.rowPath[newKey].includes(child)) {
              this.rowPath[newKey].push(child)
            }
          }
        })
      })
  }
  public getTopRowAndColMatchPath() {
    // 行列首行 path关系，判定 是聚合离散关系 start
    this.widgetProps.treeRootTagNodeList
      .filter((item) => item.parentName === 'noraml')
      .forEach((o) => {
        // debugger
        let arr = Object.keys(o.fullPath).reverse()
        let newObj = o.fullPath
        arr.forEach((key, index) => {
          let newKey = `${newObj[key]}_${key}`
          if (index < arr.length - 1) {
            if (!this.rowColTopLevelPath[newKey]) {
              this.rowColTopLevelPath[newKey] = []
            }
            const child = `${newObj[arr[index + 1]]}_${arr[index + 1]}`
            if (!this.rowColTopLevelPath[newKey].includes(child)) {
              this.rowColTopLevelPath[newKey].push(child)
            }
          }
        })
      })

    // 每一层进行迭代，一直迭代到最后一层
    let pathKeyGroup = Object.keys(this.rowColTopLevelPath).filter((item) =>
      isSumNodeEndReg(this.widgetProps.rowArray[0], item)
    ) // 获取层级的key
    pathKeyGroup.forEach((key) => {
      // path[key]应该等于一个迭代结构
      const iteration = (rowColTopLevelPath, array) => {
        const queue = [...array]
        let currentNode = queue.shift()
        while (
          currentNode &&
          !isSumNodeEndReg(this.widgetProps.colArray[0], currentNode)
        ) {
          queue.push(...rowColTopLevelPath[currentNode])
          currentNode = queue.shift()
        }
        return Array.from(new Set([currentNode, ...queue]))
      }

      this.rowColTopLevelPath[key] = iteration(
        this.rowColTopLevelPath,
        this.rowColTopLevelPath[key]
      )
    })
  }
  public isMergeOrSplice() {
    return Object.keys(this.rowColTopLevelPath)
      .filter((item) => isSumNodeEndReg(this.widgetProps.rowArray[0], item))
      .some((h) => {
        const targetKey = Object.keys(this.treeOption.treeAllPath).filter((l) =>
          isSumNodeStartReg(l, h)
        )[0]
        const endKey = this.treeOption.treeAllPath[targetKey].reduce(
          (pre, cur) => {
            const key = cur.split(',')[this.widgetProps.colArray.length - 1]
            return (pre = [...pre, key])
          },
          []
        )
        return Array.from(new Set(endKey)).length > 1
      })
  }
  public buildWholePath(){
    this.groupWholePath =  Object.keys(this.treeOption.treeAllPath).reduce(
      (pre: any, cur: any) => {
        const keyGroup = this.treeOption.treeAllPath[cur].map((item) => {
          return `${item},${cur}`.split(',')
        })
        return (pre = [...pre, ...keyGroup])
      },
      []
    )
   
  }
  public partTopGroup(item,index){
    return  this.groupWholePath.reduce((pre, cur) => {
      pre = cur.includes(item.parentName)
        ? [...pre, cur[cur.length - index]]
        : [...pre]
      return Array.from(new Set(pre))
    }, [])
   
  }
  public getTopNewPart(item,index){
    if (getOriginKey(item.key) === this.widgetProps.rowArray[index - 1])
      return item
    item = item.parent
    return tree.getTopNewPart(item,index)
  }
  public setGroup(level) {
    this.group[level] = {}
    const sumGroup = this.widgetProps.treeRootTagNodeList.filter(
      (item) =>
        item.parentLevel === level &&
        item.parentName !== 'noraml' &&
        !this.widgetProps.rowArray.includes(item.startLevel)
      // || (item.parentName !== 'noraml' &&  this.widgetProps.rowArray.includes(item.startLevel) && item.parent.value === '合计')
    )

    sumGroup.forEach((item) => {
      const firstNotSum = tree.getFirstNotSumLevel(item)
      if (firstNotSum !== '总和') {
        if (!this.group[level].hasOwnProperty(item.parentName)) {
          if (tree.isMergeOrSplice()) {
            this.group[level][item.parentName] = {}
          } else {
            this.group[level][item.parentName] = []
          }
        }


        const buildGroupTop = (index) => {
          const partTopGroup = tree.partTopGroup(item,index)
          if (
            partTopGroup.length > 1 ||
            (partTopGroup.length == 1 && index !== 1)
          ) {
           
            if (partTopGroup.every((a) => isQdReg('QD', a))) { // 待补充两字符串最大公共序列
              index--
            }
            this.treeOption.topNewPartType = tree.getTopNewPart(item,index).value
            let topNewPartTypeItem = this.group[level][item.parentName][this.treeOption.topNewPartType]
            if (!topNewPartTypeItem) {
              topNewPartTypeItem = []
            }
            return
          }
          index++
          return buildGroupTop(index)
        }

        // if(firstRowLevel !== '总和' && (getOriginKey(getFirstNotSums(item.parent).key) !== this.widgetProps.rowArray[0])){
        buildGroupTop(1)
        if (tree.isMergeOrSplice() && level !== this.widgetProps.rowArray[0]) {
          this.group[level][item.parentName][
            this.treeOption.topNewPartType
          ].push(item)
        } else {
          this.group[level][item.parentName][
            this.treeOption.topNewPartType
          ].push(item)
        }
      }
    })
    console.log(this.group, 'this.group')
  }
  public changePosition() {
    this.arrTarget.reverse().forEach((level, index) => {
      if (index == 0) {
        const levelGroup = Object.values(this.group[level])
        levelGroup.pop()
        const concatArray: any = levelGroup.reduce((pre: any, cur: any) => {
          return (pre = [...pre, ...Object.values(cur)])
        }, [])

        const firstArr = concatArray.flat(Infinity)
        const findIndex = this.widgetProps.treeRootTagNodeList.findIndex(
          (o) => o === firstArr[firstArr.length - 1]
        )
        this.widgetProps.treeRootTagNodeList.splice(findIndex, 0, ...firstArr)
        firstArr.forEach((k) => {
          const isExitedIndex = this.widgetProps.treeRootTagNodeList.findIndex(
            (o) => o === k
          )
          this.widgetProps.treeRootTagNodeList.splice(isExitedIndex, 1)
        })
      } else {
        delete this.group[level]['合计']
        Object.values(this.group[level]).forEach((obj: any) => {
          const getEndArray = (origin) => {
            if (
              Array.isArray(origin) &&
              origin.every((item) => Array.isArray(item))
            )
              return origin
            if (Object.prototype.toString.call(origin) === '[object Object]') {
              origin = Object.values(origin)
            } else {
              origin = origin.map((j) => Object.values(j))
            }

            return getEndArray(origin)
          }
          let flatGroup: any = getEndArray(obj).flat(Infinity)
          const count = tree.isMergeOrSplice()
            ? getEndArray(obj)[0].length - 2
            : flatGroup.length - 2
          const findIndex = this.widgetProps.treeRootTagNodeList.findIndex(
            (o) => o === flatGroup[count]
          )
          this.widgetProps.treeRootTagNodeList.splice(
            findIndex,
            0,
            ...flatGroup
          )
          flatGroup.forEach((k) => {
            const isExitedIndex = this.widgetProps.treeRootTagNodeList.findIndex(
              (o) => o === k
            )
            this.widgetProps.treeRootTagNodeList.splice(isExitedIndex, 1)
          })
        })
      }
    })
  }
  public buildJson() {
    tree.getRowPath()
    tree.getTopRowAndColMatchPath()
    tree.buildWholePath()
    this.arrTarget.reverse().forEach((level) => {
      tree.setGroup(level)
    })
    debugger
    tree.changePosition()
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
}

let tree = new MultiwayTree()

export default tree
