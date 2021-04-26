import Node from './node'
import cloneDeep from 'lodash/cloneDeep'
import { getOriginKey, isSumLastNode, isSumNodeEnd, isQuotaSum, isMetricsName } from './util'
import { SumType, CategoryType, SumText } from './constants'
import { replaceRowColPrx } from './util'
import { makeSelectLocalControlPanelFormValues } from 'app/containers/ControlPanel/selectors'
export type TreeNodeLevelType = 'row' | 'col' | 'metrics'

export type TreeNodeSumType = Array<
  | 'default'
  | 'colTotal'
  | 'rowTotal'
  | 'subTotal'
  | 'rowSubTotal'
  | 'colSubTotal'
>

interface ITreeNodeProperty {
  initKey: string
  key: string
  label: string
  levelKey: string
  levelCount: number
  levelType: TreeNodeLevelType
  listNumber: number
  originKey: string
  originParentKey: string
  parentKey: string
  samePathNode: any
  sumType: TreeNodeSumType
  sumLastNode: boolean
  sumNode: boolean
  children: Array<ITreeNodeProperty>
  parent: ITreeNodeProperty
}

class MultiwayTree {
  public tree = {
    wideProps: {
      root: null,
      wideTableList: [],
      metrics: [],
      metricsAgg: [],
      metricsTotal: {},
      colArray: [],
      rowArray: [],
      resultWideList: [],
      resultList: [],
      metricNodeList: [],
      rowColConcat: [],
      rowLast: null,
      colLast: null,
      rootRowArray: []
    },
    labelText: {
      rootLevel: { name_level0_cols: 'root' },
      rootKey: ['name_level0_cols']
    }
  }

  constructor() { }

  public getTraverseBF(callback) {
    const queue = []
    let found = false
    queue.push(this.tree.wideProps.root)
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

  public getContains(callback, traversal) {
    traversal.call(this, callback)
  }

  public getAddToData(obj, toData) {
    const metrics = this.tree.wideProps.metrics

    const node = new Node(obj)
    node.set(obj, metrics)
    if (this.tree.wideProps.root === null) {
      this.tree.wideProps.root = node
      return this
    }
    const exitCallBack = function (currentNode) {
      if (currentNode.key === node.key && currentNode.label === node.label) {
        return true
      }
    }
    const exitTag = tree.getTraverseBF.call(this, exitCallBack)
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
    this.getContains(callback, tree.getTraverseBF)
    if (parent) {
      parent.children.push(node)
      node.parent = parent
      return this
    } else {
      throw new Error()
    }
  }

  private getParentId(treeNodeGroup, options) {
    const {
      listNumber,
      levelType,
      samePathNode,
      levelCount,
      listItem
    } = options
    if (samePathNode) {
      return options.samePathNode.parentKey
    } else {
      if (levelType == CategoryType.Metrics) {
        return treeNodeGroup[treeNodeGroup.length - 1].key
      }
      if (!listNumber) {
        const originParentKey = levelCount
          ? `${Object.keys(listItem)[levelCount - 1]}_${listNumber}`
          : null
        return originParentKey
      } else {
        return treeNodeGroup[treeNodeGroup.length - 1].key
      }
    }
  }

  private getParentIdByMetrics(
    attrMap,
    key,
    treeNodeGroup,
    options,
    number?
  ) {
    const { levelCount, levelKey, listItem } = options
    const preLevel = tree.getNodeLevelType(levelKey) == CategoryType.Metrics
      ? this.tree.wideProps.colLast
      : Object.keys(attrMap)[levelCount - 1]

    const parentItem = attrMap[preLevel].find((item) => {
      
      if(number && attrMap[preLevel].length == this.tree.wideProps.metricsAgg.length * 2){
        const prex = item.key.split('_').pop()
        return item.nameLabel == key && number == prex || item.label == key
      } else {
        return item.nameLabel == key || item.label == key
      }
      
    }) || treeNodeGroup[treeNodeGroup.length - 1]
    return parentItem.key
  }


  public getNodeLevelType(levelKey) {
    const { rootRowArray, colArray } = this.tree.wideProps
    let levelType
    if (rootRowArray.includes(levelKey)) {
      if (levelKey !== '指标名称_cols') {
        levelType = CategoryType.Row
      } else {
        levelType = 'metricsName'
      }
    } else if (colArray.includes(levelKey)) {
      if (levelKey !== '指标名称_rows') {
        levelType = CategoryType.Col
      } else {
        levelType = 'metricsName'
      }
    } else {
      levelType = CategoryType.Metrics
    }
    return levelType
  }

  public getNodeKey(options) {
    const { listNumber, levelCount, levelKey, listItem, metricsItemName, metricsCount, metricsCountSecond } = options
    if (!listNumber) {
      options.samePathNode = null
    } else if (!levelCount) {
      options.samePathNode = this.tree.wideProps.root
    } else {
      const queue = [this.tree.wideProps.root]
      let currentNode = queue[0]
      while (levelCount !== currentNode.levelCount) {
        queue.push(...currentNode.children)
        currentNode = queue.shift()
      }
      if (metricsItemName) {
        // if
        listItem['指标名称_cols'] = metricsItemName
      }
      const arrGroup = Object.values(listItem)

      const listItemPath = arrGroup.splice(1, levelCount)
      if (isMetricsName(levelKey)) {
        listItemPath.pop()
        listItemPath.push(metricsItemName)
      }
      options.samePathNode = queue.find((item) => {
        let itemPath = []
        while (item.parent) {
          itemPath.unshift(item.label)
          item = item.parent
        }
        return itemPath.toString() == listItemPath.toString()
      })
    }
    const { samePathNode } = options
    const initKey = `${levelKey}_${listNumber}`
    const nodeKey = samePathNode ? samePathNode.key : initKey
    if (metricsItemName) {
      return samePathNode ? `${nodeKey}` : metricsCountSecond ? `${nodeKey}${metricsCount}${metricsCountSecond}`:`${nodeKey}${metricsCount}`
    } else {
      return nodeKey
    }

  }
  public getKeyBeforeOfMetricNameCount(levelCount, currentKeyGroup) {
    const beforeKey = currentKeyGroup.splice(1, levelCount)
    const count = beforeKey.reduce((pre, cur) => {
      return pre = isMetricsName(cur) ? pre + 1 : pre
    }, 0)
    return count
  }

  public getNodeProperyOfLabel() {

  }

  public getNodePropertyOfParentId(count, options, treeNodeGroup, attrMap, metricsItemName) {
    const { levelKey } = options
    const isNoneMetricsNameBefore = !count
    const isMetrics = tree.getNodeLevelType(levelKey) == CategoryType.Metrics
    if (isNoneMetricsNameBefore && !isMetrics) {
      return tree.getParentId(treeNodeGroup, options)
    } else {
      return tree.getParentIdByMetrics(
        attrMap,
        metricsItemName,
        treeNodeGroup,
        options
      )
    }
  }


  public getMultiwayTree() {
    let {
      wideProps: { wideTableList, rowArray, colArray },
      labelText: { rootLevel, rootKey }
    } = this.tree
    wideTableList.forEach((listItem, listNumber) => {
      const treeNodeGroup = []
      const targetNodeGroup = []
      let metricsNameGroup = []
      const attrMap = {}
      let labelStart = false
      listItem = { ...rootLevel, ...listItem }
      Object.keys(listItem).forEach((levelKey, levelCount) => {
        const options = {
          listItem,
          levelKey,
          listNumber,
          levelCount,
          samePathNode: null,
          metricsCount: null,
          metricsItemName: null,
          metricsCountSecond: null
        }
        const currentKeyGroup = Object.keys(listItem)
        const count = tree.getKeyBeforeOfMetricNameCount(levelCount, currentKeyGroup)
        let baseProprty = {
          levelKey,
          levelCount,
          sumType: null,
          sumLastNode: false,
          sumNode: false,
          levelType: tree.getNodeLevelType(levelKey),
        }
        if (!count) {
          // 名称为零
          if (
            !isMetricsName(levelKey) &&
            tree.getNodeLevelType(levelKey) !== CategoryType.Metrics
          ) {
            let normalGroup = []
            options.metricsCount = null
            options.metricsItemName = null
            const key = tree.getNodeKey(options)
            const nodeAttr = {
              ...baseProprty,
              key,
              label: isMetricsName(levelKey) ? null : listItem[levelKey],
              originKey: getOriginKey(key),
              parentKey: tree.getParentId(treeNodeGroup, options)
            }
            treeNodeGroup.push(nodeAttr)
            normalGroup.push(nodeAttr)
            attrMap[levelKey] = normalGroup
          }
        } else if (count == 1) {
           // 名称为一
          if (tree.getNodeLevelType(levelKey) !== CategoryType.Metrics) {
            metricsNameGroup = []
            labelStart = true
            this.tree.wideProps.metrics.forEach((metricsItemName, index) => {
              options.metricsCount = index
              options.metricsItemName = metricsItemName
              const key = tree.getNodeKey(options)
              let newObj = {
                ...baseProprty,
                key,
                originKey: getOriginKey(key),
                label: isMetricsName(levelKey) ? metricsItemName : listItem[levelKey],
                nameLabel: metricsItemName,
                parentKey: tree.getParentIdByMetrics(
                  attrMap,
                  metricsItemName,
                  treeNodeGroup,
                  options
                ),
              }
              metricsNameGroup.push(newObj)
            })
            attrMap[levelKey] = metricsNameGroup
          }
        } else if (count == 2) {
          if (tree.getNodeLevelType(levelKey) !== CategoryType.Metrics) {
            metricsNameGroup = []
            labelStart = true
            this.tree.wideProps.metrics.forEach((nameOne, metricsCountSecond) => {
            this.tree.wideProps.metrics.forEach((metricsItemName, index) => {
              options.metricsCount = index
              options.metricsCountSecond = metricsCountSecond
              options.metricsItemName = metricsItemName
              const number = `${index}${metricsCountSecond}`
              const key = tree.getNodeKey(options)
              let newObj = {
                ...baseProprty,
                key,
                originKey: getOriginKey(key),
                label: isMetricsName(levelKey) ? metricsItemName : listItem[levelKey],
                nameLabel: metricsItemName,
                parentKey: tree.getParentIdByMetrics(
                  attrMap,
                  metricsItemName,
                  treeNodeGroup,
                  options,
                  number
                ),
              }
              metricsNameGroup.push(newObj)
            })
          })
            attrMap[levelKey] = metricsNameGroup
          }
        }
        if (tree.getNodeLevelType(levelKey) == CategoryType.Metrics) {
          options.metricsCount = null
          options.metricsItemName = null
          let key = tree.getNodeKey(options)
          const nodeAttr = {
            ...baseProprty,
            key,
            label: levelKey,
            originKey: getOriginKey(key),
            parentKey: tree.getParentIdByMetrics(
              attrMap,
              levelKey,
              treeNodeGroup,
              options
            )
          }
          nodeAttr[levelKey] = listItem[levelKey]
          targetNodeGroup.push(nodeAttr)
          attrMap['指标'] = targetNodeGroup
        }
      })
        const keyGroup = [...rootKey, ...rowArray, ...colArray, '指标']
        keyGroup.forEach((key, idx) => {
          const currentKeyGroup = Object.keys(listItem)
          const count = tree.getKeyBeforeOfMetricNameCount(idx, currentKeyGroup)

          attrMap[key].map((obj) => {
            if (!count) {
              const parent = !idx ? null : attrMap[keyGroup[idx - 1]][0]
              tree = tree.getAddToData(obj, parent)
            } else {
              const parent = attrMap[keyGroup[idx - 1]].find(
                (item) => item.key == obj.parentKey
              )
              tree = tree.getAddToData(obj, parent)
            }

          })

        })
    })
  }

  public getFirstNotSum(node) {
    if (!node.sumNode) {
      return node
    }
    if (node.label == SumText.Sub && node.parent.label !== SumText.Sub) {
      return node.parent
    }
    node = node.parent
    return tree.getFirstNotSum(node)
  }

  public getPartBranch(parentNode) {
    const backParent = cloneDeep(parentNode)
    if (backParent.originKey === this.tree.wideProps.rowLast) {
      if (backParent.sumNode) {
        const args = { backParent, parentNode }
        while (
          !this.tree.labelText.rootKey.includes(args.backParent.originKey)
        ) {
          args.backParent = args.backParent.parent
        }

        return tree.getFirstNotSum(parentNode).children
      } else {
        return backParent.parent.children
      }
    }
  }

  public getChildGroup(item, metricsName) {
    const queue = [item]
    let currentNode = queue.shift()
    while (
      currentNode &&
      currentNode.originKey !== this.tree.wideProps.colArray[0]
    ) {
      if (
        metricsName &&
        currentNode.children.every((o) => o.levelType == 'metricsName')
      ) {
        const child = currentNode.children.filter((j) => j.label == metricsName)
        queue.push(...child)
      } else {
        queue.push(...currentNode.children)
      }
      // queue.push(...currentNode.children)
      currentNode = queue.shift()
    }
    return [...queue, currentNode]
  }

  public decidePolymerizeGroupEmpty(polymerizeGroup, node) {
    return (
      !polymerizeGroup.length ||
      polymerizeGroup.every((item) => item.label !== node.label)
    )
  }

  public getMergePartBranch(parentNode: ITreeNodeProperty, metricsName) {
    const polymerizeGroup = []
    let branchs = tree.getPartBranch(parentNode)
    if (branchs.every((g) => g.levelType == 'metricsName')) {
      branchs = [branchs[0]]
    }
    branchs.forEach((item: ITreeNodeProperty) => {
      let groupChild = tree.getChildGroup(item, metricsName)
      groupChild.forEach((node) => {
        const metrics = this.tree.wideProps.metrics
        let colBeginNode = new Node(cloneDeep(node))
        colBeginNode.set(cloneDeep(node), metrics)
        if (tree.decidePolymerizeGroupEmpty(polymerizeGroup, node)) {
          polymerizeGroup.push(colBeginNode)
        } else {
          let origin: ITreeNodeProperty = polymerizeGroup.find(
            (item) => item.label == colBeginNode.label
          )
          const iteration = (origin, target) => {
            if (!origin && !target) {
              return
            }
            if (origin.label !== target.label) {
              return origin.parent.children.push(target)
            }
            target = target.children[0]
            origin =
              origin.children.find((item) => item.label == target.label) ||
              origin.children[0]
            return iteration(origin, target)
          }
          iteration(origin, colBeginNode)
        }
      })
    })
    return polymerizeGroup
  }

  public copyPolymerizeNormalNode(copyParems, polymerizeGroup) {
    const { deepCopy, isLastSumNode, parentNode, currentNode } = copyParems
    const group = polymerizeGroup || currentNode
    return group.reduce((sumNode, node) => {
      if (parentNode.originKey == this.tree.wideProps.colLast || /指标名称\_(?<=)\d*/g.test(currentNode[0].originKey)) {
        return sumNode
      } else {
        const polyNormalNode = deepCopy(
          { currentNode: node, parentNode },
          { isLastSumNode: false }
        )
        return sumNode.concat(polyNormalNode)
      }
    }, [])
  }

  public getFirstNotSumColAndRow(node) {
    if (!node.sumNode) {
      return node
    }
    if (
      (isSumLastNode(node.key) &&
        node.originKey == this.tree.wideProps.colArray[0]) ||
      (isSumNodeEnd(node.key) &&
        node.originKey == this.tree.wideProps.colArray[0])
    ) {
      return node
    }

    node = node.parent
    return tree.getFirstNotSumColAndRow(node)
  }

  public decideSumBranchType(node) {
    if (
      Object.keys(this.tree.wideProps.metricsTotal).includes(node.originKey)
    ) {
      return null
    }

    const isBeiginNoneParentSumKey = tree.getFirstNotSumColAndRow(node)
      .originKey
    const isBeiginSumLastNode = tree.getFirstNotSumColAndRow(node).sumLastNode
    let subType = []

    if (isBeiginNoneParentSumKey === this.tree.labelText.rootKey[0]) {
      subType.push(SumType.ColTotal)
    } else if (
      isBeiginNoneParentSumKey === this.tree.wideProps.colArray[0] &&
      isBeiginSumLastNode
    ) {
      subType.push(SumType.RowTotal)
    } else if (
      !isBeiginSumLastNode &&
      this.tree.wideProps.colArray.includes(isBeiginNoneParentSumKey)
    ) {
      subType.push(SumType.RowSubTotal)
    } else if (
      isBeiginNoneParentSumKey !== this.tree.labelText.rootKey[0] &&
      this.tree.wideProps.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      subType.push(SumType.ColSubTotal)
    } else {
    }
    return subType
  }

  public getColArrayFirstParent(node) {
    while (node.originKey !== this.tree.wideProps.colArray[0]) {
      node = node.parent
    }
    return node
  }

  public decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber, currentNode } = options
    if (currentNode.levelType === CategoryType.Col && isLastSumNode) {
      return `${nodeValue}sumLastNode`
    } else {
      return `${nodeValue}${indexNumber}sumNode`
    }
  }
  public decideSumAttribute(options) {
    const {
      newNode,
      key,
      deepCopy,
      parentNode,
      nodeValue,
      isLastSumNode,
      metricsName
    } = options
    switch (key) {
      case 'levelCount':
        newNode[key] = parentNode[key] + 1
      case 'parent':
        newNode[key] = parentNode
        break
      case 'parentKey':
        newNode[key] = parentNode.key
        break
      case 'key':
        newNode[key] = tree.decideSumNodeKeyTextDisplay(options)
        break
      case 'originKey':
        newNode[key] = getOriginKey(newNode.key)
        break
      case 'sumLastNode':
        newNode[key] = !!isSumLastNode(newNode.key)
        break
      case 'sumNode':
        newNode[key] = isSumNodeEnd(newNode.key)
        break
      case 'levelType':
        newNode[key] = tree.getNodeLevelType(newNode.originKey)
        break
      case 'sumType':
        newNode[key] = tree.decideSumBranchType(newNode)
        break
      case 'label':
        if (newNode.key == '指标名称_cols_003sumNode') {
          debugger
        }
        newNode[key] = tree.decideSumOrSubSumTextDisplay(options)
        break
      case 'children':
        newNode[key] = tree.copyIteration(
          deepCopy,
          nodeValue,
          newNode,
          isLastSumNode,
          metricsName
        )
        break
      default:
        newNode[key] = null
    }
  }

  public decideSumOrSubSumTextDisplay(options) {
    const { nodeValue, isLastSumNode, newNode } = options
    const totalTypes = tree.decideSumBranchType(newNode)
    // 名称在首位 去掉 && newNode.levelType !== 'metricsName'
    if (isLastSumNode && totalTypes && newNode.levelType !== 'metricsName') {
      const Sum = [SumType.ColTotal, SumType.RowTotal].includes(...totalTypes)
      return Sum ? SumText.Sum : SumText.Sub
    }
    // else if(isLastSumNode && totalTypes && newNode.levelType == 'metricsName'){
    //   const Sum = [SumType.ColTotal, SumType.RowTotal].includes(...totalTypes)
    //   return SumText.Sum
    // }
    else {
      return nodeValue
    }
  }

  public copyIteration(
    deepCopy,
    currentNode,
    parentNode,
    isLastSumNode = false,
    metricsName = null
  ) {
    return deepCopy({ currentNode, parentNode, metricsName }, { isLastSumNode })
  }

  // TODO
  public copyPolymerizeNoramlChild(copyParems) {
    const { parentNode, newNode, isLastSumNode, metricsName } = copyParems
    let polymerizeGroup
    if (
      parentNode.originKey === this.tree.wideProps.rowLast &&
      this.tree.wideProps.colArray.length
    ) {
      polymerizeGroup = tree.getMergePartBranch(parentNode, metricsName)
    }
    if (
      polymerizeGroup ||
      (!isLastSumNode && parentNode.levelType === CategoryType.Col)
    ) {
      return tree.copyPolymerizeNormalNode(copyParems, polymerizeGroup)
    }
    return newNode
  }

  public copyTotalNode(currentNode, parentNode) {
    let indexNumber = 0
    const deepCopy = (copyNode, copyOptions) => {
      indexNumber++
      const { currentNode, parentNode, metricsName } = copyNode
      const { isLastSumNode = true } = copyOptions
      const metrics = this.tree.wideProps.metrics

      if (typeof currentNode !== 'object' || !currentNode) {
        return currentNode
      }

      let newNode
      if (Array.isArray(currentNode)) {
        newNode = []
      } else {
        newNode = new Node({})
        newNode.set({}, metrics)
      }
      const copyParems = {
        deepCopy,
        ...copyNode,
        ...copyOptions,
        newNode,
        indexNumber,
        isLastSumNode,
        metricsName
      }
      if (parentNode.key === 'platform_rows_05sumNode') {
        debugger
      }
      if (currentNode.length) {
        newNode = tree.copyPolymerizeNoramlChild(copyParems)


        const isLast = this.tree.wideProps.rowLast == '指标名称_cols'

        if (
          parentNode.originKey ===
          (this.tree.wideProps.colLast || this.tree.wideProps.rowLast)
          ||
          (/指标名称\_(?<=)\d*/g.test(currentNode[0].originKey) && isLastSumNode && isLast)
          || /指标名称\_(?<=)\d*/g.test(currentNode[0].originKey)
        ) {

          currentNode.forEach((k) => {
            const copyNode = tree.copyIteration(
              deepCopy,
              k,
              parentNode,
              true,
              k.label
            )
            newNode.push(copyNode)
          })
          // }
        } else {
          const isColTop = this.tree.wideProps.colArray[0] === '指标名称_rows'
          const isRowTop = this.tree.wideProps.rowArray[0] === '指标名称_cols'

          if (!/指标名称\_(?<=)\d*/g.test(currentNode[0].originKey)) {
            const copyNode = tree.copyIteration(
              deepCopy,
              currentNode[0],
              parentNode,
              true,
              metricsName
            )
            newNode.push(copyNode)
          }
        }
      } else {
        const baseKey = [
          'levelCount',
          'parent',
          'parentKey',
          'key',
          'originKey',
          'sumLastNode',
          'sumNode',
          'levelType',
          'label',
          'sumType',
          'children',
          ...metrics
        ]
        !Array.isArray(currentNode) &&
          baseKey.forEach((attr) => {
            const exitedVal = Array.isArray(newNode[attr])
              ? newNode[attr].length
              : newNode[attr]
            if (exitedVal) {
              return
            }
            const nodeValue = currentNode[attr]
            const options = { nodeValue, key: attr, ...copyParems }
            tree.decideSumAttribute(options)
          })
      }
      return newNode
    }
    return tree.copyIteration(deepCopy, currentNode, parentNode, true, null)
  }

  public getSumMultiwayTree() {
    const queue = [this.tree.wideProps.root]
    let currentNode = queue.shift()
    const {
      wideProps: { rowArray, colArray },
      labelText: { rootKey }
    } = this.tree
    const rowColConcat = [...rowArray, ...colArray]
    rowColConcat.splice(rowColConcat.length - 1, 1, ...rootKey)
    while (currentNode && rowColConcat.includes(currentNode.originKey)) {
      queue.push(...currentNode.children)
      const isMetricsName = currentNode.children.some(
        (d) => d.levelType == 'metricsName'
      )
      // 只有指标名称在行首或者列首时候 可以显示，其他不显示
      const isColTop = this.tree.wideProps.colArray[0] === '指标名称_rows'
      const isRowTop = this.tree.wideProps.rowArray[0] === '指标名称_cols'
      if (currentNode.key == 'platform_rows_37sumNode') {
        debugger
      }
      if (
        !isMetricsName ||
        (isMetricsName && isColTop) ||
        (isMetricsName && isRowTop)
      ) {
        currentNode.children.push(
          tree.copyTotalNode(currentNode.children[0], currentNode)
        )
      }
      currentNode = queue.shift()
    }
  }

  public getNodePathSumType(currentNode) {
    let pathSumTypeGroup = []
    while (currentNode.parent) {
      if ([SumText.Sum, SumText.Sub].includes(currentNode.label)) {
        pathSumTypeGroup = currentNode.sumType
          ? [...pathSumTypeGroup, ...currentNode.sumType]
          : pathSumTypeGroup
      }
      currentNode = currentNode.parent
    }
    return Array.from(new Set(pathSumTypeGroup))
  }

  public getMetricNodeList() {
    const queue = [this.tree.wideProps.root]
    let currentNode = queue.shift()
    queue.push(...currentNode.children)
    while (queue.length) {
      currentNode = queue.shift()
      // if(!currentNode){
      //   debugger
      // }
      if (
        this.tree.wideProps.metrics.includes(currentNode.label) &&
        currentNode.levelType == CategoryType.Metrics
      ) {
        currentNode.sumType = tree.getNodePathSumType(currentNode)
        this.tree.wideProps.metricNodeList.push(currentNode)
      }

      queue.push(...currentNode.children)
    }
  }

  public getUnSumNodeReduceSumMetrics(option) {
    const { children, key, callback } = option
    const { colLast, rowLast } = this.tree.wideProps
    const colLastNode = children[0].parent.originKey === (colLast || rowLast)
    const selectChild = children.filter((item) => {
      if (colLastNode) {
        return callback(item) && item.originKey === key
      } else {
        return callback(item)
      }
    })
    return selectChild.reduce((number, node) => {
      return (number = number + Number(node[key]))
    }, 0)
  }

  public getSumMetricDFS() {
    this.tree.wideProps.metricNodeList.forEach((node: ITreeNodeProperty) => {
      if (node.sumNode) {
        const getFirstNonSumParent = (
          origin: ITreeNodeProperty,
          path: Array<string>
        ) => {
          while (origin.sumNode) {
            path.unshift(origin.label)
            origin = origin.parent
          }
          return {
            from: origin,
            path
          }
        }
        const { from, path } = getFirstNonSumParent(node, [])
        this.tree.wideProps.metrics.forEach((key: string) => {
          const needSum = node.sumType.some((item) =>
            this.tree.wideProps.metricsTotal[node.originKey].includes(item)
          )
          if (needSum) {
            tree.matchSameNodeSum(from.children, key, path)
          }
        })
      } else {
        while (node) {
          const callback = (node) => !node.sumNode
          if (this.tree.wideProps.metrics.includes(node.originKey)) {
            node[node.originKey] = node[node.originKey]
          } else {
            this.tree.wideProps.metrics.forEach((key) => {
              const option = {
                children: node.children,
                key,
                callback
              }
              node[key] = tree.getUnSumNodeReduceSumMetrics(option)
            })
          }
          node = node.parent
        }
        return
      }
    })
  }

  public matchSameNodeSum(
    currentQueue: Array<ITreeNodeProperty>,
    key: string,
    path: Array<string>
  ) {
    let level: number = 0
    let needSumNodeGroup: Array<ITreeNodeProperty> = []
    let currentLevelSumNode: ITreeNodeProperty = currentQueue.find(
      (node) => node.sumNode
    )
    while (currentQueue.length) {
      needSumNodeGroup = currentQueue.filter((node) => {
        if ([SumText.Sum, SumText.Sub].includes(path[level])) {
          return node.label !== path[level]
        } else {
          return node.label == path[level]
        }
      })
      const callback = (node) => !node.sumNode
      const option = {
        children: needSumNodeGroup,
        key,
        callback
      }
      currentLevelSumNode[key] = tree.getUnSumNodeReduceSumMetrics(option)
      level++
      currentQueue = needSumNodeGroup.reduce(
        (array: Array<ITreeNodeProperty>, item: ITreeNodeProperty) => {
          return array.concat(item.children)
        },
        []
      )
      currentLevelSumNode = currentLevelSumNode.children.find(
        (item) => item.label === path[level]
      )
    }
  }

  private makeOriginJson() {
    const {
      resultWideList,
      colArray,
      rowArray,
      metricsTotal
    } = this.tree.wideProps
    let rowOrder = [...rowArray, ...colArray, ...Object.keys(metricsTotal)]
    rowOrder = rowOrder.filter((key) => !/指标名称\_(?<=)\d*/g.test(key))
    console.log(resultWideList, 'resultWideList')
    this.tree.wideProps.resultList = resultWideList.reduce((pre, cur) => {
      const newObj = {}
      rowOrder.forEach((key) => {
        // if(cur[key]){
        newObj[key] = cur[key]
        // }
      })
      return pre.concat(newObj)
    }, [])
  }

  public getTotalWideTableJson() {
    const { rowArray, colArray } = this.tree.wideProps
    const lens = [...rowArray, ...colArray].length - 1
    this.tree.wideProps.metricNodeList.forEach(
      (item: ITreeNodeProperty, count: number) => {
        const len = this.tree.wideProps.metrics.length
        // if (!(count % len)) {
        let obj = {}
        while (item.parent) {
          if (item.levelType !== 'metricsName') {
            if (item.levelType === CategoryType.Metrics) {
              obj[item.originKey] = item[item.originKey]
            } else {
              if (item.label) {
                obj[item.originKey] = item.label
              }
            }
          }
          item = item.parent
        }
        this.tree.wideProps.resultWideList.push(obj)
        // const isSamePath = this.tree.wideProps.resultWideList.find(
        //   (t) => {
        //     const exitKeyPath = Object.values(t).reverse().splice(0, lens)
        //     const objKeyPath = Object.values(obj).reverse().splice(0, lens)
        //     return exitKeyPath.join() == objKeyPath.join()
        //   }
        // )
        // if (!isSamePath) {
        //   this.tree.wideProps.resultWideList.push(obj)
        // } else {
        //   const isEmptyKey = Object.keys(isSamePath).find((d)=>!isSamePath[d])
        //   isSamePath[isEmptyKey] = obj[isEmptyKey]
        // }

        // } else {
        //   const resultWideListLast = this.tree.wideProps.resultWideList[
        //     this.tree.wideProps.resultWideList.length - 1
        //   ]
        //   resultWideListLast[item.originKey] = item[item.originKey]
        // }
      }
    )
  }

  public initProps(props) {
    const { rows, cols, metrics, data } = props
    this.tree.wideProps.colArray = rows.map((item) => `${item.name}_rows`)
    this.tree.wideProps.rowArray = cols.reduce((col, item) => {
      const repeatGroup = col.filter((item) => item === `${item.name}_cols`)
      const colItem = repeatGroup.length ? repeatGroup.length : ''
      col = [...col, `${item.name}_cols${colItem}`]
      return col
    }, [])
    this.tree.wideProps.metricsAgg = metrics.map((l) => l.agg)
    this.tree.wideProps.metricsTotal = metrics.reduce((result, item) => {
      result[`${item.agg}(${item.name.split('@')[0]})`] =
        item.total?.totalType || []
      return result
    }, {})
    const { rowArray, colArray, metricsTotal } = this.tree.wideProps
    this.tree.wideProps.wideTableList = data.reduce((result, cur) => {
      cur = [...rowArray, ...colArray, ...Object.keys(metricsTotal)].reduce(
        (obj, key) => {
          obj[key] = cur[replaceRowColPrx(key)]
          return obj
        },
        {}
      )
      return (result = [...result, cur])
    }, [])
  }

  public getSortSumNode(rows, rowKeys) {
    const breakFn = (rowKeys, idx) => {
      const levelSortKey = rowKeys.reduce((pre, cur) => {
        return (pre = Array.from(new Set([...pre, cur[idx]])))
      }, [])
      const sumText = levelSortKey.findIndex((key) =>
        [SumText.Sum, SumText.Sub].includes(key)
      )
      levelSortKey.push(...levelSortKey.splice(sumText, 1))
      let partGroup = levelSortKey.reduce((pre, cur) => {
        const group = rowKeys.filter((item) => item[idx] === cur)
        return (pre = [...pre, group])
      }, [])
      if (idx == rows.length - 2) {
        const exitedSumGroup = partGroup.splice(0, partGroup.length - 1)
        exitedSumGroup.forEach((group, index) => {
          const sumText = exitedSumGroup[index].findIndex((k) =>
            [SumText.Sum, SumText.Sub].includes(k[k.length - 1])
          )
          exitedSumGroup[index].push(
            ...exitedSumGroup[index].splice(sumText, 1)
          )
        })
        partGroup = [...exitedSumGroup, ...partGroup]
      }
      return partGroup
    }

    const iteration = (rowKeys, idx: number) => {
      if (!idx) return breakFn(rowKeys, idx)
      rowKeys = rowKeys.reduce((arr, item) => {
        const isArray = (group) => {
          return group.every((item) => Array.isArray(item))
        }
        if (!isArray(item.flat(1))) return (arr = [...arr, breakFn(item, idx)])
        const group = iteration(item, idx)
        return (arr = [...arr, group])
      }, [])
      return rowKeys
    }

    const getPartGroupByKey = (divideGroupByLevel, index) => {
      while (index <= Math.max(rows.length - 2, 0)) {
        divideGroupByLevel = iteration(divideGroupByLevel, index)
        index++
      }
      return divideGroupByLevel
    }

    const result = getPartGroupByKey(rowKeys, 0)

    const flatItem = (result) => {
      while (!result[0].every((d) => !Array.isArray(d))) {
        result = result.reduce((pre, cur) => {
          return (pre = [...pre, ...cur])
        }, [])
      }
      return result
    }
    return flatItem(result)
  }

  public getDefaultProps() {
    const { rowArray, colArray, metricsTotal } = this.tree.wideProps
    const { rootKey } = this.tree.labelText
    this.tree.wideProps.root = null
    this.tree.wideProps.metricNodeList = []
    this.tree.wideProps.resultWideList = []
    this.tree.wideProps.rowLast = rowArray[rowArray.length - 1]
    this.tree.wideProps.colLast = colArray[colArray.length - 1]
    this.tree.wideProps.metrics = Object.keys(metricsTotal) || []
    this.tree.wideProps.rootRowArray = [...rowArray, ...rootKey]
  }

  public getTotalWideTableList(props) {
    tree.initProps(props)
    tree.getDefaultProps()
    tree.getMultiwayTree()
    tree.getSumMultiwayTree()
    tree.getMetricNodeList()
    tree.getSumMetricDFS()
    tree.getTotalWideTableJson()
    tree.makeOriginJson()
    console.log(tree, this.tree.wideProps.resultWideList, 'tree')
    return tree
  }
}

let tree = new MultiwayTree()

export default tree
