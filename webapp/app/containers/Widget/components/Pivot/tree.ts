import Node from './node'
class MultiwayTree {
  public testJson2 = [
    {
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      QD_id: "QD1018",
      platform: "Android",
      "sum(总停留时间)": 476.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      QD_id: "QD1018",
      platform: "IOS",
      "sum(总停留时间)": 3178.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      QD_id: "QD1018",
      platform: "移动浏览器",
      "sum(总停留时间)": 612.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "垂直社区",
      QD_id: "QD1008",
      platform: "Android",
      "sum(总停留时间)": 923.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "垂直社区",
      QD_id: "QD1008",
      platform: "IOS",
      "sum(总停留时间)": 163.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      QD_id: "QD1006",
      platform: "Android",
      "sum(总停留时间)": 2233.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      QD_id: "QD1006",
      platform: "IOS",
      "sum(总停留时间)": 1638.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      QD_id: "QD1006",
      platform: "移动浏览器",
      "sum(总停留时间)": 686.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      QD_id: "QD1007",
      platform: "Android",
      "sum(总停留时间)": 695.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      QD_id: "QD1007",
      platform: "IOS",
      "sum(总停留时间)": 1081.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      QD_id: "QD1007",
      platform: "移动浏览器",
      "sum(总停留时间)": 828.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      QD_id: "QD1017",
      platform: "Android",
      "sum(总停留时间)": 1585.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      QD_id: "QD1017",
      platform: "IOS",
      "sum(总停留时间)": 1922.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      QD_id: "QD1017",
      platform: "移动浏览器",
      "sum(总停留时间)": 14.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      QD_id: "QD1016",
      platform: "Android",
      "sum(总停留时间)": 990.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      QD_id: "QD1016",
      platform: "IOS",
      "sum(总停留时间)": 3024.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      QD_id: "QD1016",
      platform: "移动浏览器",
      "sum(总停留时间)": 360.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      QD_id: "QD1015",
      platform: "Android",
      "sum(总停留时间)": 820.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      QD_id: "QD1015",
      platform: "IOS",
      "sum(总停留时间)": 1939.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      QD_id: "QD1015",
      platform: "移动浏览器",
      "sum(总停留时间)": 1.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      QD_id: "QD1013",
      platform: "Android",
      "sum(总停留时间)": 534.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      QD_id: "QD1013",
      platform: "IOS",
      "sum(总停留时间)": 1129.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      QD_id: "QD1013",
      platform: "移动浏览器",
      "sum(总停留时间)": 73.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "活动推广",
      QD_id: "QD1014",
      platform: "Android",
      "sum(总停留时间)": 872.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "活动推广",
      QD_id: "QD1014",
      platform: "IOS",
      "sum(总停留时间)": 1626.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      QD_id: "QD1010",
      platform: "Android",
      "sum(总停留时间)": 986.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      QD_id: "QD1010",
      platform: "IOS",
      "sum(总停留时间)": 370.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      QD_id: "QD1010",
      platform: "移动浏览器",
      "sum(总停留时间)": 576.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      QD_id: "QD1009",
      platform: "Android",
      "sum(总停留时间)": 1093.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      QD_id: "QD1009",
      platform: "IOS",
      "sum(总停留时间)": 604.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      QD_id: "QD1009",
      platform: "移动浏览器",
      "sum(总停留时间)": 1117.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      QD_id: "QD1012",
      platform: "Android",
      "sum(总停留时间)": 34.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      QD_id: "QD1012",
      platform: "IOS",
      "sum(总停留时间)": 1880.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      QD_id: "QD1012",
      platform: "移动浏览器",
      "sum(总停留时间)": 649.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      QD_id: "QD1011",
      platform: "Android",
      "sum(总停留时间)": 2420.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      QD_id: "QD1011",
      platform: "IOS",
      "sum(总停留时间)": 457.0,
    },
    {
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      QD_id: "QD1011",
      platform: "移动浏览器",
      "sum(总停留时间)": 1.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      QD_id: "QD1005",
      platform: "Android",
      "sum(总停留时间)": 368.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      QD_id: "QD1005",
      platform: "IOS",
      "sum(总停留时间)": 2362.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      QD_id: "QD1005",
      platform: "移动浏览器",
      "sum(总停留时间)": 433.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      QD_id: "QD1004",
      platform: "Android",
      "sum(总停留时间)": 11.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      QD_id: "QD1004",
      platform: "IOS",
      "sum(总停留时间)": 2056.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      QD_id: "QD1004",
      platform: "移动浏览器",
      "sum(总停留时间)": 324.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "PC",
      QD_id: "QD1002",
      platform: "Android",
      "sum(总停留时间)": 1545.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "PC",
      QD_id: "QD1002",
      platform: "IOS",
      "sum(总停留时间)": 2424.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      QD_id: "QD1003",
      platform: "Android",
      "sum(总停留时间)": 523.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      QD_id: "QD1003",
      platform: "IOS",
      "sum(总停留时间)": 302.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      QD_id: "QD1003",
      platform: "移动浏览器",
      "sum(总停留时间)": 1.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "运营商",
      QD_id: "QD1001",
      platform: "Android",
      "sum(总停留时间)": 866.0,
    },
    {
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "运营商",
      QD_id: "QD1001",
      platform: "IOS",
      "sum(总停留时间)": 579.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      QD_id: "QD1019",
      platform: "Android",
      "sum(总停留时间)": 1603.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      QD_id: "QD1019",
      platform: "IOS",
      "sum(总停留时间)": 662.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      QD_id: "QD1019",
      platform: "移动浏览器",
      "sum(总停留时间)": 108.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      QD_id: "QD1020",
      platform: "Android",
      "sum(总停留时间)": 1521.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      QD_id: "QD1020",
      platform: "IOS",
      "sum(总停留时间)": 608.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      QD_id: "QD1020",
      platform: "移动浏览器",
      "sum(总停留时间)": 1.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      QD_id: "QD1021",
      platform: "Android",
      "sum(总停留时间)": 434.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      QD_id: "QD1021",
      platform: "IOS",
      "sum(总停留时间)": 28.0,
    },
    {
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      QD_id: "QD1021",
      platform: "移动浏览器",
      "sum(总停留时间)": 1080.0,
    },
  ];

  public testJson = [
    {
      platform: "Android",
      QD_id: "QD1001",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "运营商",
      "sum(总停留时间)": 866.0,
    },
    {
      platform: "Android",
      QD_id: "QD1002",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "PC",
      "sum(总停留时间)": 1545.0,
    },
    {
      platform: "Android",
      QD_id: "QD1003",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      "sum(总停留时间)": 523.0,
    },
    {
      platform: "Android",
      QD_id: "QD1004",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      "sum(总停留时间)": 11.0,
    },
    {
      platform: "Android",
      QD_id: "QD1005",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      "sum(总停留时间)": 368.0,
    },
    {
      platform: "Android",
      QD_id: "QD1006",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      "sum(总停留时间)": 2233.0,
    },
    {
      platform: "Android",
      QD_id: "QD1007",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      "sum(总停留时间)": 695.0,
    },
    {
      platform: "Android",
      QD_id: "QD1008",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "垂直社区",
      "sum(总停留时间)": 923.0,
    },
    {
      platform: "Android",
      QD_id: "QD1009",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      "sum(总停留时间)": 1093.0,
    },
    {
      platform: "Android",
      QD_id: "QD1010",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      "sum(总停留时间)": 986.0,
    },
    {
      platform: "Android",
      QD_id: "QD1011",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      "sum(总停留时间)": 2420.0,
    },
    {
      platform: "Android",
      QD_id: "QD1012",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      "sum(总停留时间)": 34.0,
    },
    {
      platform: "Android",
      QD_id: "QD1013",
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      "sum(总停留时间)": 534.0,
    },
    {
      platform: "Android",
      QD_id: "QD1014",
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "活动推广",
      "sum(总停留时间)": 872.0,
    },
    {
      platform: "Android",
      QD_id: "QD1015",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      "sum(总停留时间)": 820.0,
    },
    {
      platform: "Android",
      QD_id: "QD1016",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      "sum(总停留时间)": 990.0,
    },
    {
      platform: "Android",
      QD_id: "QD1017",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      "sum(总停留时间)": 1585.0,
    },
    {
      platform: "Android",
      QD_id: "QD1018",
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      "sum(总停留时间)": 476.0,
    },
    {
      platform: "Android",
      QD_id: "QD1019",
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      "sum(总停留时间)": 1603.0,
    },
    {
      platform: "Android",
      QD_id: "QD1020",
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      "sum(总停留时间)": 1521.0,
    },
    {
      platform: "Android",
      QD_id: "QD1021",
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      "sum(总停留时间)": 434.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1001",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "运营商",
      "sum(总停留时间)": 579.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1002",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "PC",
      "sum(总停留时间)": 2424.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1003",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      "sum(总停留时间)": 302.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1004",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      "sum(总停留时间)": 2056.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1005",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      "sum(总停留时间)": 2362.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1006",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      "sum(总停留时间)": 1638.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1007",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      "sum(总停留时间)": 1081.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1008",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "垂直社区",
      "sum(总停留时间)": 163.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1009",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      "sum(总停留时间)": 604.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1010",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      "sum(总停留时间)": 370.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1011",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      "sum(总停留时间)": 457.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1012",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      "sum(总停留时间)": 1880.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1013",
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      "sum(总停留时间)": 1129.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1014",
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "活动推广",
      "sum(总停留时间)": 1626.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1015",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      "sum(总停留时间)": 1939.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1016",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      "sum(总停留时间)": 3024.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1017",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      "sum(总停留时间)": 1922.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1018",
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      "sum(总停留时间)": 3178.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1019",
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      "sum(总停留时间)": 662.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1020",
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      "sum(总停留时间)": 608.0,
    },
    {
      platform: "IOS",
      QD_id: "QD1021",
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      "sum(总停留时间)": 28.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1003",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Wap",
      "sum(总停留时间)": 1.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1004",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "AppStore",
      "sum(总停留时间)": 324.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1005",
      name_level1: "线上渠道",
      name_level2: "基础上线工作",
      name_level3: "Android AppStore",
      "sum(总停留时间)": 433.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1006",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "百科类",
      "sum(总停留时间)": 686.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1007",
      name_level1: "新媒体营销",
      name_level2: "品牌基础推广",
      name_level3: "问答类",
      "sum(总停留时间)": 828.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1009",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "机锋论坛",
      "sum(总停留时间)": 1117.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1010",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "安卓论坛",
      "sum(总停留时间)": 576.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1011",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "魔趣网",
      "sum(总停留时间)": 1.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1012",
      name_level1: "新媒体营销",
      name_level2: "轮台、贴吧推广",
      name_level3: "风暴论坛",
      "sum(总停留时间)": 649.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1013",
      name_level1: "新媒体营销",
      name_level2: "微博推广",
      name_level3: "内容推广",
      "sum(总停留时间)": 73.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1015",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "微信互推",
      "sum(总停留时间)": 1.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1016",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号积累",
      "sum(总停留时间)": 360.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1017",
      name_level1: "新媒体营销",
      name_level2: "微信推广",
      name_level3: "小号导大号",
      "sum(总停留时间)": 14.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1018",
      name_level1: "新媒体营销",
      name_level2: "事件营销",
      name_level3: "事件营销",
      "sum(总停留时间)": 612.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1019",
      name_level1: "线下渠道",
      name_level2: "手机厂商预装",
      name_level3: "手机厂商预装",
      "sum(总停留时间)": 108.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1020",
      name_level1: "线下渠道",
      name_level2: "水货刷机",
      name_level3: "水货刷机",
      "sum(总停留时间)": 1.0,
    },
    {
      platform: "移动浏览器",
      QD_id: "QD1021",
      name_level1: "线下渠道",
      name_level2: "行货店面",
      name_level3: "行货店面",
      "sum(总停留时间)": 1080.0,
    },
  ];
  public root = null
  public originObj = []
  public treePointItem = []
  public tagCollectArray = []
  public rootArray = ["name_level0"];
  public testSwitch = "test2";
  public tagGroup = ["sum(总停留时间)"];
  public tagRootNodeGroup = [];
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
  public mockObj = {
    test2: {
      colArray: [
        "name_level1",
        "name_level2",
        "name_level3",
      ],
      rowArray: ["platform", "QD_id"],
      data: this.testJson,
    },
    test1: {
      colArray: [
        "name_level1",
        "name_level2",
        "name_level3",
      ],
      rowArray: ["platform"],
      data: this.testJson,
    },
    test6: {
      colArray: ["name_level2", "name_level3"],
      rowArray: ["platform", "QD_id", "name_level1"],
      data: this.testJson,
    },
    test3: {
      colArray: ["platform"],
      rowArray: [
        "name_level1",
        "name_level2",
        "name_level3",
      ],
      data: this.testJson2,
    },

    test5: {
      colArray: ["QD_id", "platform"],
      rowArray: [
        "name_level1",
        "name_level2",
        "name_level3",
      ],
      data: this.testJson2,
    },
    test7: {
      colArray: ["platform", "QD_id"],
      rowArray: [
        "name_level1",
        "name_level2",
        "name_level3",
      ],
      tagArray: ["sum(总停留时间)"],
      data: this.testJson2,
    },
    test8: {
      colArray: ["QD_id", "name_level1", "name_level2", "name_level3"],
      rowArray: ["platform"],
      tagArray: ["sum(总停留时间)"],
      data: this.testJson,
    },
  };

  public colArray = this.mockObj[this.testSwitch].colArray;
  public rowArray = this.mockObj[this.testSwitch].rowArray;
  public tagArray = this.mockObj[this.testSwitch].tagArray;
  public rowcolArray1 = [...this.colArray, ...this.rowArray];

  constructor() {
  }
  makeOriginJson = (data) => {
    const rowOrder = [...this.rowArray, ...this.colArray, ...this.tagGroup];
    return data.reduce((pre, cur) => {
      let newObj = {};
      rowOrder.forEach((key) => {
        newObj[key] = cur[key];
      });
      return pre.concat(newObj);
    }, []);
  };
  public datas = tree.makeOriginJson(this.mockObj[this.testSwitch].data);
  public totalLevel = Object.keys(this.datas[0])
    .slice(0, Object.keys(this.datas[0]).length - 2)
    .concat(this.rootArray);
 
  isRowColLastLevel(node, array) {
    return tree.getOriginKey(node.key) == array[array.length - 1];
  }
  getOriginKey(key) {
    return key.match(/\S*(?=\_)/g).shift();
  }
  isSumNode(key) {
    return /(?=sum)/g.test(key);
  }
  isColRowMermber(group, key) {
    return group.some((item) => {
      let reg = RegExp("(?=" + item + ")", "i");
      return reg.test(key);
    });
  }
  isQuotaSum(key) {
    return /(sum\()(?<=)(\W*)/g.test(key);
  }
  isSumNodeEnd(key) {
    return /\_(?<=)\S*sum/g.test(key);
  }
  isNodeIncludeArray(array, node) {
    return array.includes(tree.getOriginKey(node.key));
  }
  traverseBF(callback) {
    const queue = [];
    let found = false;
    queue.push(this.root);
    let currentNode = queue.shift();

    while (!found && currentNode) {
      found = callback(currentNode) === true ? true : false;
      if (!found) {
        queue.push(...currentNode.children);
        currentNode = queue.shift();
      }
    }
    return found;
  }
  contains(callback, traversal) {
    traversal.call(this, callback);
  }

  add(obj, toData) {
    const node = new Node(obj);
    if (this.root === null) {
      this.root = node;
      return this;
    }
    const exitCallBack = function (currentNode) {
      if (
        currentNode.key === node.key &&
        currentNode.data === node.data
      ) {
        return true;
      }
    };
    const exitTag = tree.traverseBF.call(this, exitCallBack);
    if (exitTag) {
      return this;
    }

    let parent = null;
    const callback = (node) => {
      if (node.key === toData.key) {
        parent = node;
        return true;
      }
    };
    this.contains(callback, tree.traverseBF);
    if (parent) {
      parent.children.push(node);
      node.parent = parent;
      return this;
    } else {
      throw new Error();
    }
  }

  isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup) {
    if (!treeIndex) return (this.treeOption.hasSameParent = false);

    const getExistEqualNode = (treePointItem, nodeValue, levelIndex) => {
      return treePointItem
        .filter((item, idx) => {
          if (Array.isArray(item)) {
            getExistEqualNode(item, nodeValue, levelIndex);
          } else {
            return item.value === nodeValue && levelIndex === idx;
          }
        })
        .shift();
    };

    this.treeOption.existEqualNode = getExistEqualNode(
      this.treePointItem,
      this.treeOption.nodeValue,
      levelIndex
    );

    const existEqualNodeOfParentKey = this.treePointItem
      .filter(
        (item) => this.treeOption.existEqualNode?.parentId === item.key
      )
      .pop()?.key;

    this.treeOption.parentDefaultKey = this.treeOption.targetNode
      ? treeNodeGroup.map((o) => o).pop().defaultKey
      : this.treeOption.parentKey;

    const originParentKey = treeNodeGroup
      .filter(
        (item) => this.treeOption.parentDefaultKey === item.defaultKey
      )
      .pop()?.key;
    this.treeOption.hasSameParent =
      originParentKey === existEqualNodeOfParentKey;
  }

  buildTreePointItem(treeItem, treeIndex, tagGroup) {
    let treeNodeGroup = [];
    let targetNodeGroup = [];

    treeItem = Object.assign({ name_level0: "root" }, treeItem);
    let treeItemKeys = Object.keys(treeItem);
    treeItemKeys.forEach((levelKey, levelIndex) => {
      this.treeOption = {
        defaultKey: `${levelKey}_${treeIndex}`,
        parentKey: `${treeItemKeys[levelIndex - 1]}_${treeIndex}`,
        targetNode: tagGroup.includes(levelKey),
        nodeValue: treeItem[levelKey],
        levelOption: { treeItem, treeIndex, levelKey, levelIndex },
      };

      tree.isEqualTreeNode(treeIndex, levelIndex, treeNodeGroup);
      const buildTreeNodeData = () => {
        const {
          targetNode,
          defaultKey,
          levelOption,
          hasSameParent,
          existEqualNode,
          parentKey,
          parentDefaultKey,
        } = this.treeOption;
        const { treeItem, treeIndex, levelKey } = levelOption;
        const getNodeParentId = () => {
          const { treeIndex } = levelOption;

          if (targetNode)
            return treeNodeGroup.map((item) => item).pop().defaultKey;

          if (!treeIndex) {
            return parentKey;
          }
          if (hasSameParent) {
            return existEqualNode.parentId;
          }
          if (hasSameParent) {
            return existEqualNode.parentId;
          } else {
            return treeNodeGroup
              .filter((k) => k.defaultKey == parentDefaultKey)
              .pop()?.key;
          }
        };
        return {
          data: targetNode ? treeItem[levelKey] : null,
          value: targetNode ? levelKey : treeItem[levelKey],
          defaultKey: defaultKey,
          parentId: getNodeParentId(),
          key: hasSameParent ? existEqualNode.key : defaultKey,
        };
      };
      Array.prototype.push.call(
        this.treeOption.targetNode ? targetNodeGroup : treeNodeGroup,
        buildTreeNodeData()
      );
    });
    return [...treeNodeGroup, targetNodeGroup];
  }

  constructMultiwayTree(originTreePointGroup, tagGroup) {
    originTreePointGroup.forEach((treeItem, treeIndex) => {
      this.treeOption.existEqualNode = null;
      this.treeOption.hasSameParent = false;
      this.treePointItem = tree.buildTreePointItem(
        treeItem,
        treeIndex,
        tagGroup
      );
      this.treePointItem.forEach((item, i) => {
        if (!item.length && !item.parentId) {
          return (tree = tree.add(item, null));
        }
        item = item.length ? item : [item];
        item.map((currentItem) => {
          const parentItem = this.treePointItem
            .filter((item) => item.key === currentItem.parentId)
            .pop();
          tree = tree.add(currentItem, parentItem);
        });
      });
    });
  }
  // 获取父节点首个不为sum
  getFirstNotSum(node) {
    const getFirstNotSum = (node) => {
      if (!tree.isSumNodeEnd(node.key)) return node;
      node = node.parent;
      return getFirstNotSum(node);
    };
    return getFirstNotSum(node);
  }
  // 获取分支集合 总计和小计两部分
  getPartBranch(parentNode) {
    let backParent = _.cloneDeep(parentNode);
    // 在行最后一个几点作为parentNode进行聚合
    if (tree.isRowColLastLevel(backParent, this.rowArray)) {
      if (tree.isSumNodeEnd(backParent.key)) {
        const args = { backParent, parentNode };
        const getRoot = (args) => {
          if (
            this.rootArray.includes(tree.getOriginKey(args.backParent.key))
          ) {
            return tree.getFirstNotSum(parentNode).children;
          }
          args.backParent = args.backParent.parent;
          return getRoot(args);
        };
        return getRoot(args);
      } else {
        return backParent.parent.children;
      }
    }
  }
  collectChildGroup(item) {
    const queue = [item];
    let currentNode = queue.shift();
    while (
      currentNode &&
      tree.getOriginKey(currentNode.key) !== this.colArray[0]
    ) {
      if (currentNode) {
        queue.push(...currentNode.children);
        currentNode = queue.shift();
      }
    }
    return [...queue, currentNode];
  }
  // 判断聚合数组是否为空
  decidePolymerizeGroupEmpty(polymerizeGroup, node) {
    return (
      !polymerizeGroup.length ||
      polymerizeGroup.every((item) => item.value !== node.value)
    );
  }
  // 聚合分支 at lastRowNode  parentNode为lastRowNode curNode为 startColNode
  getMergePartBranch(parentNode) {
    let polymerizeGroup = [];
    tree.getPartBranch(parentNode).forEach((item) => {
      tree.collectChildGroup(item).forEach((node) => {
        const colBeginNode = new Node(_.cloneDeep(node));
        if (tree.decidePolymerizeGroupEmpty(polymerizeGroup, node)) {
          polymerizeGroup.push(colBeginNode);
        } else {
          const iteration = (origin, target) => {
            if (!origin && !target) return;
            // 如果名字相同 或者到最后节点children为空
            if (origin.value !== target.value) {
              return origin.parent.children.push(target);
            }
            target = target.children[0];
            origin =
              origin.children.find(
                (item) => item.value == target.value
              ) || origin.children[0];
            return iteration(origin, target);
          };
          const origin = polymerizeGroup.find(
            (item) => item.value == colBeginNode.value
          );
          iteration(origin, colBeginNode);
        }
      });
    });
    return polymerizeGroup;
  }
  // 复制聚合后非node节点
  copyPolymerizeNormalNode(polymerizeOptions) {
    const {
      deepCopy,
      isLastSumNode,
      parentNode,
      polymerizeGroup,
      currentNode,
    } = polymerizeOptions;
    const group = polymerizeGroup || currentNode;
    return group.reduce((sum, node) => {
      if (
        tree.getOriginKey(parentNode.key) == this.colArray[this.colArray.length - 1]
      ) {
        return sum;
      } else {
        let polyNormalNode = deepCopy(
          { currentNode: node, parentNode: parentNode },
          { isLastSumNode: false }
        );
        return sum.concat(polyNormalNode);
      }
    }, []);
  }
  // 获取总和总计节点类型
  decideSumBranchType(node) {
    const isBeiginNoneParentSumKey = tree.getOriginKey(
      tree.getFirstNotSum(node).key
    );

    if (isBeiginNoneParentSumKey === "name_level0") {
      return "rowSum";
    } else if (
      isBeiginNoneParentSumKey === this.rowArray[this.rowArray.length - 1]
    ) {
      return "colSum";
    } else if (
      isBeiginNoneParentSumKey !== this.rowArray[this.rowArray.length - 1] &&
      this.rowArray.includes(isBeiginNoneParentSumKey)
    ) {
      return "rowSubSum";
    } else if (this.colArray.includes(isBeiginNoneParentSumKey)) {
      return "colSubSum";
    }
  }
  decideSumNodeKeyTextDisplay(options) {
    const { nodeValue, isLastSumNode, indexNumber } = options;
    const isSumLastText =
      tree.isColRowMermber(this.colArray, nodeValue) && isLastSumNode;

    if (isSumLastText) {
      return `${nodeValue}sumlast`;
    } else {
      // 对于行指标的key
      return `${nodeValue}${indexNumber}sum`;
    }
  }
  // 判断总和和合计文字显示
  decideSumOrSubSumTextDisplay(options) {
    const { nodeValue, isLastSumNode, parentNode } = options;
    const isRowSumText =
      !tree.isRowColLastLevel(parentNode, this.rowArray) &&
      tree.isNodeIncludeArray([...this.rowArray, ...this.rootArray], parentNode) &&
      ["rowSum"].includes(tree.decideSumBranchType(parentNode));
    const isColSumText =
      !tree.isRowColLastLevel(parentNode, this.colArray) &&
      tree.isNodeIncludeArray(
        [...this.colArray, this.rowArray[this.rowArray.length - 1]],
        parentNode
      ) &&
      ["colSum"].includes(tree.decideSumBranchType(parentNode));
    const isSubSumText = isLastSumNode && !tree.isQuotaSum(nodeValue);
    if (isRowSumText || isColSumText) {
      return "总和";
    } else if (isSubSumText) {
      return "合计";
    } else {
      return nodeValue;
    }
  }
  copyIteration(
    deepCopy,
    currentNode,
    parentNode,
    isLastSumNode = false
  ) {
    return deepCopy({ currentNode, parentNode }, { isLastSumNode });
  }
  // 聚合分支以及对聚合分支普通节点的复制
  copyPolymerizeNoramlChild(copyParems) {
    // 聚合分叉分支当父节点是行最后一个时候开始进行分叉
    const {
      deepCopy,
      currentNode,
      parentNode,
      newNode,
      isLastSumNode,
    } = copyParems;
    let polymerizeGroup;
    if (tree.isRowColLastLevel(parentNode, this.rowArray)) {
      polymerizeGroup = tree.getMergePartBranch(parentNode);
    }
    // 普通节点的进行复制 polymerizeGroup 为 聚合后的头部
    const isNeedCopy =
      !isLastSumNode && tree.isColRowMermber(this.colArray, parentNode.key);
    if (polymerizeGroup || isNeedCopy) {
      const polymerizeOptions = {
        deepCopy,
        isLastSumNode,
        parentNode,
        polymerizeGroup,
        currentNode,
      };
      return tree.copyPolymerizeNormalNode(polymerizeOptions);
    }
    return newNode;
  }
  copyTotalNode(currentNode, parentNode) {
    let indexNumber = 0;
    const deepCopy = (copyNode, copyOptions) => {
      indexNumber++;
      let { currentNode, parentNode } = copyNode;
      let {
        isLastSumNode = true, // true:统一最后一节点, false: 聚合后 要copy普通节点，非sum节点
      } = copyOptions;

      if (typeof currentNode !== "object" || !currentNode) {
        return currentNode;
      }

      let newNode = Array.isArray(currentNode) ? [] : new Node({});
      let copyParems = {
        deepCopy,
        ...copyNode,
        ...copyOptions,
        newNode,
        indexNumber,
      };
      if (currentNode.length) {
        // 分支进行聚合,并且对聚合后 NoramlNode进行复制
        newNode = tree.copyPolymerizeNoramlChild(copyParems);
        // 合计+小计 child最后一个 sum branch
        newNode.push(
          tree.copyIteration(deepCopy, currentNode[0], parentNode, true)
        );
      } else {
        Object.keys(currentNode).forEach((key) => {
          const isEmpty = Array.isArray(newNode[key])
            ? newNode[key].length
            : newNode[key];
          if (isEmpty) {
            return;
          }
          const nodeValue = currentNode[key];
          const options = { nodeValue, ...copyParems };
          if (key === "parentId") {
            newNode[key] = parentNode.key;
          } else if (key === "parent") {
            newNode[key] = parentNode;
          } else if (key === "key") {
            newNode[key] = tree.decideSumNodeKeyTextDisplay(options);
          } else if (key === "value") {
            newNode[key] = tree.decideSumOrSubSumTextDisplay(options);
          } else if (key == "children") {
            newNode[key] = tree.copyIteration(
              deepCopy,
              nodeValue,
              newNode,
              isLastSumNode
            );
          } else {
            newNode[key] = null;
          }
        });
      }
      return newNode;
    };
    return tree.copyIteration(deepCopy, currentNode, parentNode, true);
  }

  addTotalNodeToTree() {
    const queue = [this.root];
    let currentNode = queue.shift();
    while (
      currentNode &&
      this.totalLevel.includes(tree.getOriginKey(currentNode.key))
    ) {
      if (currentNode) {
        queue.push(...currentNode.children);
        currentNode.children.push(
          tree.copyTotalNode(currentNode.children[0], currentNode)
        );
        currentNode = queue.shift();
      }
    }
  }

  // 获取 指标根节点集合
  getTreeRootOfTag() {
    const queue = [this.root];
    let currentNode = queue.shift();
    queue.push(...currentNode.children);
    const iteration = (currentNode) => {
      queue.forEach((item) => {
        currentNode = queue.shift();
        if (this.tagGroup.includes(currentNode.value)) {
          this.tagRootNodeGroup.push(currentNode);
        }
        queue.push(...currentNode.children);
        iteration(currentNode);
      });
    };
    iteration(currentNode);
  }
  // 筛选 非sum node并求和
  getUnSumNodeReduceSum(children) {
    const nonSumNodeGroup = children.filter(
      (item) => !tree.isSumNodeEnd(item.key)
    );
    return nonSumNodeGroup.reduce((sum, node) => {
      return (sum = sum + node.data);
    }, 0);
  }
  calcSumNodeDFS() {
    // origin初始值为tagSumNode,最终值为第一个parent为非sumNode,branchPath为tagSumNode路径
    const getFirstNonSumParent = (origin, branchPath) => {
      if (!tree.isSumNodeEnd(origin.key))
        return {
          from: origin,
          path: branchPath,
        };
      branchPath.unshift(origin.value);
      origin = origin.parent;
      return getFirstNonSumParent(origin, branchPath);
    };
    this.tagRootNodeGroup.forEach((item) => {
      // 对于tagNode为sumNode
      if (tree.isSumNodeEnd(item.key)) {
        const { from, path } = getFirstNonSumParent(item, []);
        tree.matchSameNodeSum(from.children, item, path);
      } else {
        // 对于tagNode为非sumNode
        const iteration = (item) => {
          if (!item) return;
          item.data =
            tree.getUnSumNodeReduceSum(item.children) || item.data;
          // 当item为 tagNode节点或者tagNode节点时 item.data = item.data
          item = item.parent;
          return iteration(item);
        };
        iteration(item);
      }
    });
  }
  // 匹配 sumNode 相同同级节点进行向上递归求和
  matchSameNodeSum(isStartNonParentSumNode, origin, path) {
    let initLevel = 0;
    let searchTarget = [];
    let target = isStartNonParentSumNode.find((item) =>
      tree.isSumNodeEnd(item.key)
    ); // 获取目标
    const getOriginSameLevel = (currentQueue, initLevel, target) => {
      if (!currentQueue.length) return;
      // path level为总和总计, 筛选非 总计总和的分支
      searchTarget = currentQueue.filter((item) => {
        if (["合计", "总和"].includes(path[initLevel])) {
          return item.value !== path[initLevel];
        } else {
          return item.value == path[initLevel];
        }
      });
      if (["合计", "总和"].includes(path[initLevel])) {
        // 筛选 currentQueue中 非sumNode分支的和
        target.data = tree.getUnSumNodeReduceSum(currentQueue);
      } else {
        // 筛选与path[initLevel]同名的分支求和，且筛选去重
        target.data = searchTarget
          .filter((item) => {
            return !tree.isSumNodeEnd(item.parentId);
          })
          .reduce((sum, node) => {
            return (sum = sum + node.data);
          }, 0);
      }
      initLevel++;
      // 对上一级目标分支的child进行聚合
      currentQueue = searchTarget.reduce((pre, cur) => {
        return pre.concat(cur.children);
      }, []);
      // 对要进行赋值node的child进行聚合
      target = target.children.find(
        (item) => item.value === path[initLevel]
      );
      return getOriginSameLevel(currentQueue, initLevel, target);
    };
    getOriginSameLevel(isStartNonParentSumNode, initLevel, target);
    // 最后searchTarget为tagNode
    return searchTarget[0].data;
  }
  getCompluteJson(originTreePointGroup, tagGroup) {
    tree.constructMultiwayTree(originTreePointGroup, tagGroup);
    tree.addTotalNodeToTree();
    tree.getTreeRootOfTag();
    tree.calcSumNodeDFS();
    tree.buildJson();
    console.log(
      tree,
      this.tagRootNodeGroup,
      this.originObj,
      "currentNode1-sum"
    );
  }

  buildJson() {
    this.tagRootNodeGroup.forEach((item) => {
      let obj = {};
      const iteration = (item, obj) => {
        if (!item.parent) return this.originObj.push(obj);
        obj[tree.getOriginKey(item.key)] = tree.isQuotaSum(item.key)
          ? item.data
          : item.value;
        item = item.parent;
        return iteration(item, obj);
      };
      iteration(item, obj);
    });
  }
}
let tree = new MultiwayTree()
export default tree
