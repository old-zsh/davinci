import React from 'react'
import classnames from 'classnames'
import Yaxis from './Yaxis'
import { IDrawingData, IMetricAxisConfig } from './Pivot'
import { IWidgetMetric, DimetionType, IChartStyles } from '../Widget'
import {
  spanSize,
  getPivotCellWidth,
  getPivotCellHeight,
  getAxisData,
  decodeMetricName,
  getAggregatorLocale,
  getPivot,
  getStyleConfig
} from '../util'
import { PIVOT_LINE_HEIGHT, DEFAULT_SPLITER } from 'app/globalConstants'
import { isElementOfArray } from './util'
const styles = require('./Pivot.less')

interface IRowHeaderProps {
  rows: string[]
  rowKeys: string[][]
  colKeys: string[][]
  rowWidths: number[]
  rowTree: object
  colTree: object
  tree: object
  chartStyles: IChartStyles
  drawingData: IDrawingData
  dimetionAxis: DimetionType
  metrics: IWidgetMetric[]
  metricAxisConfig: IMetricAxisConfig
  hasMetricNameDimetion: boolean
}

export class RowHeader extends React.Component<IRowHeaderProps, {}> {
  public render() {
    let {
      rows,
      rowKeys,
      colKeys,
      rowWidths,
      rowTree,
      colTree,
      tree,
      chartStyles,
      drawingData,
      dimetionAxis,
      metrics,
      metricAxisConfig,
      hasMetricNameDimetion
    } = this.props
    const { elementSize, unitMetricHeight } = drawingData
    // console.log(rowTree, 'rowTree RowHeader')
    // console.log(colTree, 'colTree RowHeader')
    console.log(this.props, 'this.props')
    // console.log(colKeys, 'colKeys RowHeader')
    // console.log(tree, 'tree RowHeader')
    const {
      color: fontColor,
      fontSize,
      fontFamily,
      lineColor,
      lineStyle,
      headerBackgroundColor
    } = getStyleConfig(chartStyles).pivot

    const headers = []

    if (rows.length) {
      let elementCount = 0
      let x = -1
      let hasAuxiliaryLine = false
      if (rowKeys.length > 1) {
        console.log(rowKeys,JSON.stringify(rowKeys), 'rowKeys')
        const breakFn = (rowKeys, idx) => {
          const levelSortKey = rowKeys.reduce((pre, cur) => {
            return (pre = Array.from(new Set([...pre, cur[idx]])));
          }, []);
          debugger
          const sumText = levelSortKey.findIndex((key) =>
            ["总和", "合计"].includes(key)
          );
          levelSortKey.push(...levelSortKey.splice(sumText, 1));
          let partGroup = levelSortKey.reduce((pre, cur) => {
            const group = rowKeys.filter((item) => item[idx] === cur);
            return (pre = [...pre, group]);
          }, []);
          if(idx == rows.length - 2){
            const exitedSumGroup = partGroup.splice(0,partGroup.length-1)
            exitedSumGroup.forEach((group,index)=>{
              const sumText = exitedSumGroup[index].findIndex((k)=> ["总和", "合计"].includes(k[k.length-1]))
              exitedSumGroup[index].push(...exitedSumGroup[index].splice(sumText, 1));
            })
            partGroup = [...exitedSumGroup,...partGroup]
          }
          return partGroup;
        };
        const iteration = (rowKeys, idx) => {
          if (!idx) return breakFn(rowKeys, idx);
          rowKeys = rowKeys.reduce((pre, cur) => {
            if (!isElementOfArray(cur.flat(1)))
              return (pre = [...pre, breakFn(cur, idx)]);
            const group = iteration(cur, idx);
            return (pre = [...pre, group]);
          }, []);
          return rowKeys;
        };
        const getPartGroupByKey = (divideGroupByLevel, index) => {
          if (index > Math.max(rows.length - 2,0)) return divideGroupByLevel;
          divideGroupByLevel = iteration(divideGroupByLevel, index);
          index++;
          return getPartGroupByKey(divideGroupByLevel, index);
        };
        const result = getPartGroupByKey(rowKeys, 0);
        const flatItem = (group) => {
          if (group[0].every((d) => !Array.isArray(d))) return group;
          group = group.reduce((pre, cur) => {
            return (pre = [...pre, ...cur]);
          }, []);
          return flatItem(group);
        };
        rowKeys = flatItem(result)
      }
        

      rowKeys.forEach((rk, i) => {
        const flatRowKey = rk.join(String.fromCharCode(0))
        const header = []
        const { height, records } = rowTree[flatRowKey]
        const maxElementCount = tree[flatRowKey]
          ? Math.max(
              ...Object.values(tree[flatRowKey]).map((r: any[]) =>
                r ? r.length : 0
              )
            )
          : records.length
        let cellHeight = 0

        rk.forEach((txt, j) => {
          if (dimetionAxis === 'row') {
            if (j === rk.length - 1) {
              x = -1
            } else if (j === rk.length - 2) {
              const lastRk = rowKeys[i + 1] || []
              elementCount += 1
              if (rk[j] === lastRk[j]) {
                return
              } else {
                cellHeight = elementCount * elementSize
                x = 1
                elementCount = 0
                hasAuxiliaryLine = true
              }
            } else {
              x = spanSize(rowKeys, i, j)
            }
          } else {
            if (j === rk.length - 1) {
              cellHeight =
                dimetionAxis === 'col'
                  ? unitMetricHeight * metrics.length
                  : maxElementCount === 1
                  ? getPivotCellHeight(height)
                  : getPivotCellHeight(
                      maxElementCount *
                        (hasMetricNameDimetion ? 1 : metrics.length) *
                        PIVOT_LINE_HEIGHT
                    )
              hasAuxiliaryLine = dimetionAxis === 'col'
            }
            x = spanSize(rowKeys, i, j)
          }

          const columnClass = classnames({
            [styles.topBorder]: true,
            [styles.bottomBorder]: true
          })

          const contentClass = classnames({
            [styles.hasAuxiliaryLine]: hasAuxiliaryLine
          })

          if (x !== -1) {
            let colContent
            if (txt.includes(DEFAULT_SPLITER)) {
              const [name, id, agg] = txt.split(DEFAULT_SPLITER)
              colContent = `[${getAggregatorLocale(agg)}]${name}`
            } else {
              colContent = txt
            }
            header.push(
              <th
                key={`${txt}${j}`}
                rowSpan={x}
                colSpan={1}
                className={columnClass}
                style={{
                  width: getPivotCellWidth(rowWidths[j]),
                  ...(!!cellHeight && { height: cellHeight }),
                  ...(!dimetionAxis && {
                    backgroundColor: headerBackgroundColor
                  }),
                  color: fontColor,
                  fontSize: Number(fontSize),
                  fontFamily,
                  borderColor: lineColor,
                  borderStyle: lineStyle
                }}
              >
                <p
                  className={contentClass}
                  {...(!!cellHeight && {
                    style: {
                      height: cellHeight - 1,
                      lineHeight: `${cellHeight - 1}px`
                    }
                  })}
                >
                  {colContent}
                  {hasAuxiliaryLine && (
                    <span
                      className={styles.line}
                      style={{
                        borderColor: lineColor,
                        borderStyle: lineStyle
                      }}
                    />
                  )}
                </p>
              </th>
            )
          }
        })

        headers.push(<tr key={flatRowKey}>{header}</tr>)
      })
    }

    let yAxis
    if (
      dimetionAxis &&
      !(dimetionAxis === 'row' && !colKeys.length && !rowKeys.length)
    ) {
      const { data, length } = getAxisData(
        'y',
        rowKeys,
        colKeys,
        rowTree,
        colTree,
        tree,
        metrics,
        drawingData,
        dimetionAxis
      )
      yAxis = (
        <Yaxis
          height={length}
          metrics={metrics}
          data={data}
          chartStyles={chartStyles}
          dimetionAxis={dimetionAxis}
          metricAxisConfig={metricAxisConfig}
        />
      )
    }

    const containerClass = classnames({
      [styles.rowBody]: true,
      [styles.raw]: !dimetionAxis
    })

    return (
      <div className={containerClass}>
        <table className={styles.pivot}>
          <thead>{headers}</thead>
        </table>
        {yAxis}
      </div>
    )
  }
}

export default RowHeader
