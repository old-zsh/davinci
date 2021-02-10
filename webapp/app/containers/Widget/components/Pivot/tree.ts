import Node from './node'
import cloneDeep from 'lodash/cloneDeep'
class MultiwayTree {

  public root = null
  public originObj = []
  public treePointItem = []
  public tagCollectArray = []
  public rootArray = ['name_level0']
  public tagGroup = ['sum(总停留时间)']
  public tagRootNodeGroup = []
  public datas
  public totalLevel
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
  public colArray = []
  public rowArray = []

  constructor() {}
  public makeOriginJson = (data) => {
    const rowOrder = [...this.rowArray, ...this.colArray, ...this.tagGroup]
    return data.reduce((pre, cur) => {
      const newObj = {}
      rowOrder.forEach((key) => {
        newObj[key] = cur[key]
      })
      return pre.concat(newObj)
    }, [])
  }
  

  public isRowColLastLevel(node, array) {
    return tree.getOriginKey(node.key) == array[array.length - 1]
  }
  public getOriginKey(key) {
    return key.match(/\S*(?=\_)/g).shift()
  }

  public isColRowMermber(group, key) {
    return group.some((item) => {
      const reg = RegExp('(?=' + item + ')', 'i')
      return reg.test(key)
    })
  }
  public isSumNodeStartReg(item, key) {
    let reg = RegExp(item + '_(?=)S*', 'g')
    return reg.test(key)
  }
  public isSumLastNode(key) {
    return /\_(?<=)\d*sumlast/g.test(key)
  }
  public isQuotaSum(key) {
    return /(sum\()(?<=)(\W*)/g.test(key)
  }
  public isSumNodeEnd(key) {
    return /\_(?<=)\S*sum/g.test(key)
  }
  public isNodeIncludeArray(array, node) {
    return array.includes(tree.getOriginKey(node.key))
  }
  public isSumNodeEndReg(item, key) {
    let reg = RegExp('_(?<=)S*' + item, 'g')
    return reg.test(key)
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

  public constructMultiwayTree(originTreePointGroup, tagGroup) {
    originTreePointGroup.forEach((treeItem, treeIndex) => {
      this.treeOption.existEqualNode = null
      this.treeOption.hasSameParent = false
      this.treePointItem = tree.buildTreePointItem(
        treeItem,
        treeIndex,
        tagGroup
      )
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
      if (!tree.isSumNodeEnd(node.key)) {
        return node
      }
      node = node.parent
      return getFirstNotSum(node)
    }
    return getFirstNotSum(node)
  }
  // 获取分支集合 总计和小计两部分
  public getPartBranch(parentNode) {
    const backParent = cloneDeep(parentNode)
    // 在行最后一个几点作为parentNode进行聚合
    if (tree.isRowColLastLevel(backParent, this.rowArray)) {
      if (tree.isSumNodeEnd(backParent.key)) {
        const args = { backParent, parentNode }
        const getRoot = (args) => {
          if (this.rootArray.includes(tree.getOriginKey(args.backParent.key))) {
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
      tree.getOriginKey(currentNode.key) !== this.colArray[0]
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
            // 如果名字相同 或者到最后节点children为空
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
        tree.getOriginKey(parentNode.key) ==
        this.colArray[this.colArray.length - 1]
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
    const isBeiginNoneParentSumKey = tree.getOriginKey(
      tree.getFirstNotSum(node).key
    )

    if (isBeiginNoneParentSumKey === 'name_level0') {
      return 'rowSum'
    } else if (
      isBeiginNoneParentSumKey === this.rowArray[this.rowArray.length - 1]
    ) {
      return 'colSum'
    } else if (
      isBeiginNoneParentSumKey !== this.rowArray[this.rowArray.length - 1] &&
      this.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      return 'rowSubSum'
    } else if (this.colArray.includes(isBeiginNoneParentSumKey)) {
      return 'colSubSum'
    }
  }
  public getColArrayFirstParent(node) {
    const getColArrayFirstParent = (node) => {
      if (tree.getOriginKey(node.key) === this.colArray[0]) return node
      node = node.parent
      return getColArrayFirstParent(node)
    }
    return getColArrayFirstParent(node)
  }
  public decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber } = options
    const isSumLastText =
      tree.isColRowMermber(this.colArray, nodeValue) && isLastSumNode

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
      !tree.isRowColLastLevel(parentNode, this.rowArray) &&
      tree.isNodeIncludeArray(
        [...this.rowArray, ...this.rootArray],
        parentNode
      ) &&
      ['rowSum'].includes(tree.decideSumBranchType(parentNode))
    const isColSumText =
      !tree.isRowColLastLevel(parentNode, this.colArray) &&
      tree.isNodeIncludeArray(
        [...this.colArray, this.rowArray[this.rowArray.length - 1]],
        parentNode
      ) &&
      ['colSum'].includes(tree.decideSumBranchType(parentNode))
    const isColStartSumText =
      (!tree.isQuotaSum(nodeValue) &&
        tree.isNodeIncludeArray([...this.colArray], parentNode) &&
        tree.isSumLastNode(tree.getColArrayFirstParent(parentNode).key)) ||
      (tree.getOriginKey(parentNode.key) ===
        this.rowArray[this.rowArray.length - 1] &&
        isLastSumNode)
    const isSubSumText = isLastSumNode && !tree.isQuotaSum(nodeValue)
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
    if (tree.isRowColLastLevel(parentNode, this.rowArray)) {
      polymerizeGroup = tree.getMergePartBranch(parentNode)
    }
    // 普通节点的进行复制 polymerizeGroup 为 聚合后的头部
    const isNeedCopy =
      !isLastSumNode && tree.isColRowMermber(this.colArray, parentNode.key)
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
    const queue = [this.root]
    let currentNode = queue.shift()
    while (
      currentNode &&
      this.totalLevel.includes(tree.getOriginKey(currentNode.key))
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
      if (tree.getOriginKey(node.key) === this.colArray[0]) return nodePath
      node = node.parent
      nodePath[tree.getOriginKey(node.key)] = node.value
      return iteration(node)
    }
    return iteration(node)
  }
  // 获取 指标根节点集合
  public getTreeRootOfTag() {
    var testArray = []
    const queue = [this.root]
    const currentNode = queue.shift()
    queue.push(...currentNode.children)
    const iteration = (currentNode) => {
      queue.forEach((item) => {
        currentNode = queue.shift()
        if (this.tagGroup.includes(currentNode.value)) {
          if (!tree.isSumNodeEnd(currentNode.key)) {
            // currentNode.startLevel = this.colArray[0]
            currentNode.parentName = 'noraml'
            currentNode.type = 'noramlNode'
            currentNode.path = tree.setNodePath(currentNode)
          } else {
            const getFirstNotSums = (node) => {
              const getFirstNotSum = (node) => {
                if (!tree.isSumLastNode(node.key)) return node
                node = node.parent
                return getFirstNotSum(node)
              }
              return getFirstNotSum(node)
            }
            if (
              tree.getOriginKey(getFirstNotSums(currentNode.parent).key) ==
              this.rowArray[this.rowArray.length - 1]
            ) {
              var startNode = getFirstNotSums(currentNode.parent)
            } else {
              var startNode = tree.getFirstNotSum(currentNode)
            }
            if (
              tree.getOriginKey(startNode.key) ===
              this.rowArray[this.rowArray.length - 1]
            ) {
              // 行总和
              const getParent = (node) => {
                if (node.parentId === 'name_level0_0') return node
                node = node.parent
                return getParent(node)
              }
              currentNode.parentLevel = tree.getOriginKey(
                getParent(currentNode).key
              )
              currentNode.parentName = getParent(currentNode).value
              // 不准确
              // currentNode.nearNode =
              //   startNode.children[startNode.children.length - 2].value;
            } else {
              // 列总和和小计
              currentNode.parentName = startNode.value
              // 不准确
              // currentNode.nearNode =
              //   startNode.children[startNode.children.length - 2].value;
              currentNode.parentLevel = tree.getOriginKey(startNode.key)
            }

            currentNode.startLevel = tree.getOriginKey(
              startNode.children[startNode.children.length - 1].key
            )
            currentNode.type = 'sumlNode'
          }

          this.tagRootNodeGroup.push(currentNode)
        }
        queue.push(...currentNode.children)
        iteration(currentNode)
      })
    }
    iteration(currentNode)
  }
  // 筛选 非sum node并求和
  public getUnSumNodeReduceSum(children) {
    const nonSumNodeGroup = children.filter(
      (item) => !tree.isSumNodeEnd(item.key)
    )
    return nonSumNodeGroup.reduce((sum, node) => {
      return (sum = sum + node.data)
    }, 0)
  }
  public calcSumNodeDFS() {
    // origin初始值为tagSumNode,最终值为第一个parent为非sumNode,branchPath为tagSumNode路径
    const getFirstNonSumParent = (origin, branchPath) => {
      if (!tree.isSumNodeEnd(origin.key)) {
        return {
          from: origin,
          path: branchPath
        }
      }
      branchPath.unshift(origin.value)
      origin = origin.parent
      return getFirstNonSumParent(origin, branchPath)
    }
    this.tagRootNodeGroup.forEach((item) => {
      // 对于tagNode为sumNode
      if (tree.isSumNodeEnd(item.key)) {
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
      tree.isSumNodeEnd(item.key)
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
            return !tree.isSumNodeEnd(item.parentId)
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

  public getCompluteJson(rowGroup,colGroup,originList) {
    this.rowArray = colGroup 
    this.colArray = rowGroup
    this.root = null
    this.tagRootNodeGroup = []
    this.originObj = []
    this.datas = originList
    this.totalLevel = Object.keys(this.datas[0])
      .slice(0, Object.keys(this.datas[0]).length - 2)
      .concat(this.rootArray)
    tree.constructMultiwayTree(this.datas, this.tagGroup)
    tree.addTotalNodeToTree()
    tree.getTreeRootOfTag()
    tree.calcSumNodeDFS()
    tree.buildJson()
    console.log(tree, 'tree')
    return tree
  }
  public decideColBranchBreakUp(path, value) {
    let branchBreakUpLevel
    const flatPathValueGroup = Object.values(path).flat(Infinity)
    const valueCountGroupOne = flatPathValueGroup.filter((item) => {
      return tree.isSumNodeStartReg(value, item)
    }) // 本身value为多个

    const isSameMoreCountValueOne =
      Array.from(new Set(valueCountGroupOne)).length == 1
    // value对应的key 查找为多个
    let valueOfKey = Object.keys(path).filter((key) => {
      return path[key].some((item) => tree.isSumNodeStartReg(value, item))
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

    if (
      valueCountGroupOne.length > 1 &&
      isSameMoreCountValueOne &&
      isDifferMoreKey
    ) {
      // 子为value相同的多个
      branchBreakUpLevel = [...this.rowArray, ...this.colArray].find((item) =>
        tree.isSumNodeEndReg(item, valueOfKey[0])
      )
      return {
        branchBreakUpLevel: branchBreakUpLevel,
        isBranchBreakUp: true
      }
    } else if (valueOfKeyOfValueCount.length > 1 && isSameMoreCountValueTwo) {
      const itration = (test, value) => {
        if (Array.from(new Set(test)).length == test.length)
          return [...this.rowArray, ...this.colArray].find((item) =>
            tree.isSumNodeEndReg(item, value)
          )
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
        branchBreakUpLevel: this.rowArray[0],
        isBranchBreakUp: false
      }
    }
  }
  public buildJson() {
    let path = {}
    this.tagRootNodeGroup
      .filter((item) => item.parentName === 'noraml')
      .forEach((o) => {
        let arr = Object.keys(o.path).reverse()
        let newObj = o.path
        arr.forEach((key, index) => {
          let newKey = `${newObj[key]}_${key}`
          if (index < arr.length - 1) {
            if (!path[newKey]) {
              path[newKey] = []
            }
            const child = `${newObj[arr[index + 1]]}_${arr[index + 1]}`
            if (!path[newKey].includes(child)) {
              path[newKey].push(child)
            }
          } else {
            // if (!path[newKey]) {
            //   path[newKey] = [];
            // }
            // const child = `${newObj[arr[index]]}_${arr[index]}`;
            // if (!path[newKey].includes(child)) {
            //   path[newKey].push(child);
            // }
          }
        })
      })
    console.log(path, 'path before')
    // 每一层进行迭代，一直迭代到最后一层
    // let pathKeyGroup = Object.keys(path); // 获取层级的key
    // pathKeyGroup.forEach((key) => {
    //   // path[key]应该等于一个迭代结构
    //   const iteration = (path, array) => {
    //     const queue = [...array];
    //     let currentNode = queue.shift();
    //     while (
    //       currentNode &&
    //       !tree.isSumNodeEndReg(
    //         this.colArray[this.colArray.length - 1],
    //         currentNode
    //       )
    //     ) {
    //       queue.push(...path[currentNode]);
    //       currentNode = queue.shift();
    //     }
    //     return [currentNode, ...queue];
    //   };

    //   path[key] = iteration(path, path[key]);
    // });

    let group = {}
    let arrTaget = [this.rowArray[0], ...this.colArray]
    arrTaget.reverse().forEach((level, levelIndex) => {
      group[level] = {}
      var allSumGroup
      allSumGroup = this.tagRootNodeGroup.filter(
        (item, index) =>
          item.parentLevel === level &&
          item.parentName !== 'noraml' &&
          !this.rowArray.includes(item.startLevel)
      )
      allSumGroup.forEach((item) => {
        if (!group[level].hasOwnProperty(item.parentName)) {
          group[level][item.parentName] = {
            all: {}
          }
        }
        let decideColBranchBreakUp = tree.decideColBranchBreakUp(
          path,
          item.parentName
        )
        const getParent = (node) => {
          if (
            tree.getOriginKey(node.key) ==
            decideColBranchBreakUp.branchBreakUpLevel
          )
            return node.value
          node = node.parent
          return getParent(node)
        }
        const firstRowLevel = getParent(item)

        if (!group[level][item.parentName].all[firstRowLevel]) {
          group[level][item.parentName].all[firstRowLevel] = []
        }
        group[level][item.parentName].all[firstRowLevel].push(item)
      })
    })

    let testArray = arrTaget.reverse()
    arrTaget.forEach((level, index) => {
      if (index == 0) {
        const levelGroup = Object.values(group[level])
        levelGroup.pop()
        const concatArray: any = levelGroup.reduce((pre: any, cur: any) => {
          return (pre = [...pre, ...Object.values(cur.all)])
        }, [])

        const firstArr = concatArray.flat(Infinity)
        const findIndex = this.tagRootNodeGroup.findIndex(
          (o) => o === firstArr[firstArr.length - 1]
        )
        this.tagRootNodeGroup.splice(findIndex, 0, ...firstArr)
        firstArr.forEach((k) => {
          const isExitedIndex = this.tagRootNodeGroup.findIndex((o) => o === k)
          this.tagRootNodeGroup.splice(isExitedIndex, 1)
        })
      } else {
        const levelGroup = Object.values(group[level])
        levelGroup.forEach((obj: any) => {
          const group = Object.values(obj.all)
          const flatGroup: any = Object.values(obj.all).flat(Infinity)
          const isType = tree.decideColBranchBreakUp(
            path,
            flatGroup[0].parentName
          ).isBranchBreakUp
          // debugger
          group.forEach((item: any) => {
            const findIndex = this.tagRootNodeGroup.findIndex((o) =>
              isType ? o === item[0] : o === item[item.length - 1]
            )
            // const findIndex = this.tagRootNodeGroup.findIndex(
            //   (o) => o === item[item.length - 1]
            // )
            this.tagRootNodeGroup.splice(findIndex, 0, ...item)
            item.forEach((k) => {
              const isExitedIndex = this.tagRootNodeGroup.findIndex(
                (o) => o === k
              )
              this.tagRootNodeGroup.splice(isExitedIndex, 1)
            })
          })
        })
      }
    })

    this.tagRootNodeGroup.forEach((item) => {
      const obj = {}
      const iteration = (item, obj) => {
        if (!item.parent) {
          return this.originObj.push(obj)
        }
        obj[tree.getOriginKey(item.key)] = tree.isQuotaSum(item.key)
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
