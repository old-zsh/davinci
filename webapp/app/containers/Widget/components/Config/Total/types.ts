
import { TotalTypes, NumericUnit } from './constants'

export interface IFieldTotalConfig {
  totalType: TotalTypes
  [TotalTypes.RowTotal]?: string[]
  [TotalTypes.ColTotal]?: string[]
  [TotalTypes.SubTotal]?: string[]
}