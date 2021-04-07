
import { IFieldTotalConfig } from './types'
import { ViewModelVisualTypes } from 'containers/View/constants'

export enum TotalTypes {
  Default = 'default',
  RowTotal = 'rowTotal',
  ColTotal = 'colTotal',
  SubTotal = 'subTotal'
}

export const TotalTypesSetting = {
  [ViewModelVisualTypes.Number]: [
    TotalTypes.RowTotal,
    TotalTypes.ColTotal,
    TotalTypes.SubTotal
  ]
}

export const TotalTypesLocale = {
  [TotalTypes.RowTotal]: '行总计',
  [TotalTypes.ColTotal]: '列总计',
  [TotalTypes.SubTotal]: '小计'
}

export enum NumericUnit {
  None = '无',
  TenThousand = '万',
  OneHundredMillion = '亿',
  Thousand = 'k',
  Million = 'M',
  Giga = 'G'
}

export const NumericUnitList = [
  NumericUnit.None,
  NumericUnit.TenThousand,
  NumericUnit.OneHundredMillion,
  NumericUnit.Thousand,
  NumericUnit.Million,
  NumericUnit.Giga
]

// export const defaultFormatConfig: IFieldFormatConfig = {
//   formatType: FieldFormatTypes.Default,
//   [FieldFormatTypes.Numeric]: {
//     decimalPlaces: 2,
//     unit: NumericUnit.None,
//     useThousandSeparator: true
//   },
//   [FieldFormatTypes.Currency]: {
//     decimalPlaces: 2,
//     unit: NumericUnit.None,
//     useThousandSeparator: true,
//     prefix: '',
//     suffix: ''
//   },
//   [FieldFormatTypes.Percentage]: {
//     decimalPlaces: 2
//   },
//   [FieldFormatTypes.ScientificNotation]: {
//     decimalPlaces: 2
//   },
//   [FieldFormatTypes.Date]: {
//     format: 'YYYY-MM-DD'
//   },
//   [FieldFormatTypes.Custom]: {
//     format: ''
//   }
// }
