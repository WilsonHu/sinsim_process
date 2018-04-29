//Server root address
var IP = "http://127.0.0.1";
var HOST = IP + ":8080/";
var DOWNLOADPATH = IP + "/oll/";
var SOCKECT_ADDR = "ws://127.0.0.1:9998";//CRHService IP address(Windows service)
var SYSTEMNAME = "SinSim流程管理系统";

var EveryPageNum = 10;
var MaxUpDownItems = 4;
var ScrollTimerInterval = 5000;
var DisableScroll = 1;
var COM_CMD_INTERVAL = 5000;

const STATISTICS_DATE_MODE = {
    YEAR: 0,
    MONTH: 1,
    DAY: 2
}

const USER_ROLE = {
    ROLE_SALEPERSON: 9,
}

const PROGRESSTYPE = {
    NORMAL: "",
    EXCEPTION: "exception",
    SUCCESS: "success"
}

const ProcessCatergory = {
    Working: "Working",
    Finished: "Finished",
    Abnormal: "Abnormal",
    Skip: "Skip"
}

const DefaultTaskList = {
    "class": "go.GraphLinksModel",
    "linkFromPortIdProperty": "fromPort",
    "linkToPortIdProperty": "toPort",
}

//有效、无效
const ValidList = [
    {value: 1, name: '有效'},
    {value: 0, name: '无效'},
];

//机器流程配置状态
const ConfigStatusList = [
    {value: 1, name: '未配置'},
    {value: 2, name: '已配置'},
];

//机器装置
const MachineEquipmentList = [
    {name: '简易绳绣'},
    {name: '单金片'},
    {name: '2mm单金片'},
    {name: '单针双片'},
    {name: '简易毛巾'},
    {name: '雕孔'},
    {name: '佳宇珠子装置'},
    {name: '冠炯珠子装置'},
    {name: '诺德珠子装置'},
    {name: '激光装置'},
];

//需求单状态
const OrderStatusList = [
    {value: 0, name: '未提交审核'},
    {value: 1, name: '审核中'},
    {value: 2, name: '审核完成'},
    {value: 3, name: '已改单'},
    {value: 4, name: '已拆单'},
    {value: 5, name: '已驳回'},
    {value: 6, name: '已取消'}
];

//机器状态
const MachineStatusList = [
    {value: 0, name: '初始化'},
    {value: 1, name: '已配置'},
    {value: 2, name: '已计划'},
    {value: 3, name: '生产中'},
    {value: 4, name: '生产完成'},
    {value: 5, name: '已改单'},
    {value: 6, name: '已拆单'},
    {value: 7, name: '已取消'}
];

//安装工序状态
let TaskStatusList = [
    {value: 0, name: '初始化'},
    {value: 1, name: '已计划'},
    {value: 2, name: '待安装'},
    {value: 3, name: '开始安装'},
    {value: 4, name: '安装完成'},
    {value: 5, name: '质检中'},
    {value: 6, name: '质检完成'},
    {value: 7, name: '安装异常'},
    {value: 8, name: '质检异常'},
    {value: 9, name: '已跳过'},
];


//查询日期类型
const SearchDateType = [
    {value: 1, name: '合同交货日期'},
    {value: 2, name: '计划交货日期'},
];

//包装方式
const PackageModeList =
    [
        {
            value: 0,
            text: "单机"
        },
        {
            value: 1,
            text: "叠机"
        },
    ];

//保修方式
const MaintainTypeList =
    [
        {
            value: 0,
            text: "SinSim保修"
        },
        {
            value: 1,
            text: "代理商保修"
        },
    ];

const DefaultSelectedValue = "无";

//色数
const SpecialTowelColorList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "4色"
    },
    {
        value: 2,
        text: "6色"
    },
];

//盘带头
const SpecialTapingHeadList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "冠军独立"
    },
    {
        value: 2,
        text: "普通全独立"
    },
    {
        value: 3,
        text: "普通半独立"
    },
];

//D轴上
const SpecialTowelDaxleList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "独立"
    },
    {
        value: 2,
        text: "集中"
    },
];

//H轴下
const SpecialTowelHaxleList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "独立"
    },
    {
        value: 2,
        text: "集中"
    },
];

//主电机
const SpecialTowelMotorList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "大豪"
    },
    {
        value: 2,
        text: "松下"
    },
    {
        value: 2,
        text: "儒竞"
    },
];

//毛巾机针
const SpecialTowelNeedleList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1,
        text: "16"
    },
    {
        value: 2,
        text: "18"
    },
];


//M98,C29,528,322,328,366,316,C98,C88,C19,C16,
//电脑型号
const PCModeList =
    [
        {
            value: 0,
            text: "528"
        },
        {
            value: 1,
            text: "M98"
        },
        {
            value: 2,
            text: "D16"
        },
        {
            value: 3,
            text: "D56"
        },
        {
            value: 4,
            text: "D19"
        },
        {
            value: 5,
            text: "A18"
        },
        {
            value: 6,
            text: "A58"
        }

    ];

//英语,中文,西班牙,法语,葡萄牙,土耳其,韩语,俄语,阿拉伯语
//语言
const LanguageList =
    [
        {
            value: 0,
            text: "英语"
        },
        {
            value: 1,
            text: "中文"
        },
        {
            value: 2,
            text: "西班牙"
        },
        {
            value: 3,
            text: "法语"
        },
        {
            value: 4,
            text: "葡萄牙"
        },
        {
            value: 5,
            text: "土耳其"
        },
        {
            value: 6,
            text: "韩语"
        },
        {
            value: 7,
            text: "俄语"
        },
        {
            value: 8,
            text: "阿拉伯语"
        },
    ];
//中国、巴基斯坦、印度
//销售国家
const CountryList =
    [
        {
            value: 0,
            text: "中国"
        },
        {
            value: 1,
            text: "巴基斯坦"
        },
        {
            value: 2,
            text: "印度"
        }
    ];
//币种
const CurrencyTypeList =
    [
        {
            value: 0,
            text: "人民币"
        },
        {
            value: 1,
            text: "美元"
        },
        {
            value: 2,
            text: "欧元"
        }
    ];


//电气主电机
//大豪,松下,儒竞
const ElectricMotorList =
    [
        {
            value: 0,
            text: "大豪"
        },
        {
            value: 1,
            text: "松下"
        },
        {
            value: 2,
            text: "儒竞"
        },
    ];

//XY主电机
//三相步进,五相步进,伺服
const XYMotorList =
    [
        {
            value: 0,
            text: "三相步进"
        },
        {
            value: 1,
            text: "五相步进"
        },
        {
            value: 2,
            text: "伺服"
        },
    ];

//剪线方式
//电机剪线,普通剪线,不剪线
const TrimList =
    [
        {
            value: 0,
            text: "电机剪线"
        },
        {
            value: 1,
            text: "普通剪线"
        },
        {
            value: 2,
            text: "不剪线"
        },
    ];

//电源
//220V,380V
const ElectricPowerList =
    [
        {
            value: 0,
            text: "220V"
        },
        {
            value: 1,
            text: "380V"
        },
    ];

//按钮开关
//无,1个,2个,3个,Y驱动数,Y驱动数+1
const ElectricSwitchList =
    [
        {
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "1个"
        },
        {
            value: 2,
            text: "2个"
        },
        {
            value: 3,
            text: "3个"
        },
        {
            value: 4,
            text: "Y驱动数"
        },
        {
            value: 5,
            text: "Y驱动数+1"
        },
    ];

//加油系统
//上机壳旁油盒下点动,上机壳旁油盒下自动,下点动,下自动,无
const ElectricOilList =
    [
        {
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "下自动"
        },
        {
            value: 2,
            text: "下点动"
        },
        {
            value: 3,
            text: "上机壳旁油盒下自动"
        },
        {
            value: 4,
            text: "上机壳旁油盒下点动"
        },
    ];

//夹线器
//伟龙款,15款信胜普通,15款信胜高速,信胜普通,信胜高速,仿田岛,上海,固定式
const AxleSplitList =
    [
        {
            value: 0,
            text: "伟龙款"
        },
        {
            value: 1,
            text: "15款信胜普通"
        },
        {
            value: 2,
            text: "15款信胜高速"
        },
        {
            value: 3,
            text: "信胜普通"
        },
        {
            value: 4,
            text: "信胜高速"
        },
        {
            value: 5,
            text: "仿田岛"
        },
        {
            value: 6,
            text: "上海"
        },
        {
            value: 7,
            text: "固定式"
        },
    ];

//面板
//上下分体面板,上塑料下铁,上塑料下复合,上塑料下塑料
const AxlePanelList =
    [
        {
            value: 0,
            text: "上下分体面板"
        },
        {
            value: 1,
            text: "上塑料下铁"
        },
        {
            value: 2,
            text: "上塑料下复合"
        },
        {
            value: 3,
            text: "上塑料下塑料"
        },
    ];

//机针
//9,11,12,14,16,18
const AxleNeedleList =
    [
        {
            value: 0,
            text: "9"
        },
        {
            value: 1,
            text: "11"
        },
        {
            value: 2,
            text: "12"
        },
        {
            value: 3,
            text: "14"
        },
        {
            value: 4,
            text: "16"
        },
        {
            value: 5,
            text: "18"
        },
    ];

//SUK,GROZ
const AxleNeedleTypeList =
    [
        {
            value: 0,
            text: "SUK"
        },
        {
            value: 1,
            text: "GROZ"
        },
    ];

//机头导轨
const AxleRailList =
    [
        {
            value: 0,
            text: "普通导轨"
        },

        {
            value: 1,
            text: "珠架导轨"
        },
    ];

//底检方式
const AxleDownCheckList =
    [
        {
            value: 0,
            text: "二位底检"
        },

        {
            value: 1,
            text: "三型断检"
        },
    ];

//旋梭
//广濑1.6倍高速,广濑1.6倍,佐伩12-R,佐伩12-RP,佐伩12-RY,佐伩12RYP,佐文,韩大,韩大黑芯,广濑普通,广濑高速,SINSIM,
// 德盛精品,广濑AO(MG1),广濑ATR(MG1),广濑ATR(MG1QF)黑心
const AxleHookList =
    [
        {
            value: 0,
            text: "广濑1.6倍高速"
        },
        {
            value: 1,
            text: "广濑1.6倍"
        },
        {
            value: 2,
            text: "佐伩12-R"
        },
        {
            value: 3,
            text: "佐伩12-RP"
        },
        {
            value: 4,
            text: "佐伩12-RY"
        },
        {
            value: 5,
            text: "佐伩12RYP"
        },
        {
            value: 6,
            text: "佐文"
        },
        {
            value: 7,
            text: "韩大"
        },
        {
            value: 8,
            text: "韩大黑芯"
        },
        {
            value: 9,
            text: "广濑普通"
        },
        {
            value: 10,
            text: "广濑高速"
        },
        {
            value: 10,
            text: "SINSIM"
        },
        {
            value: 11,
            text: "德盛精品"
        },
        {
            value: 12,
            text: "广濑AO(MG1)"
        },
        {
            value: 13,
            text: "广濑ATR(MG1)"
        },
        {
            value: 14,
            text: "广濑ATR(MG1QF)黑心"
        },
    ];


//跳跃方式
//电磁铁跳跃,电机跳跃,电磁铁跳跃带轴承
const AxleJumpList =
    [
        {
            value: 0,
            text: "电磁铁跳跃"
        },
        {
            value: 1,
            text: "电机跳跃"
        },
        {
            value: 2,
            text: "电磁铁跳跃带轴承"
        },
    ];

//面线夹持
const AxleUpperThreadList =
    [
        {
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "有"
        },
    ];

//机架颜色
//田岛绿桔纹,4201,乳白色
const FrameworkColorList =
    [
        {
            value: 0,
            text: "田岛绿桔纹"
        },
        {
            value: 1,
            text: "4201"
        },
        {
            value: 2,
            text: "乳白色"
        },
    ];

//台板
const FrameworkPlatenList =
    [
        {
            value: 0,
            text: "杨桉木"
        },
    ];

//台板颜色
//鲁冰花浅灰边,浅绿
const FrameworkPlatenColorList =
    [
        {
            value: 0,
            text: "鲁冰花浅灰边"
        },
        {
            value: 1,
            text: "浅绿"
        },
    ];


//吊环
const FrameworkRingList =
    [
        {
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "有"
        },
    ];

//电脑托架
//梁上,台板上
const FrameworkBracketList =
    [
        {
            value: 0,
            text: "梁上"
        },
        {
            value: 1,
            text: "台板上"
        },
    ];

//急停装置
//无,1个托架下,1个托架下，一个另一侧梁上长杆,左侧梁壁上,一个托架下，一个左侧台板下,一个左侧台板下
const FrameworkStopList =
    [
        {
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "1个托架下"
        },
        {
            value: 2,
            text: "1个托架下,一个另一侧梁上长杆"
        },
        {
            value: 3,
            text: "左侧梁壁上"
        },
        {
            value: 4,
            text: "一个托架下,一个左侧台板下"
        },
        {
            value: 5,
            text: "一个左侧台板下"
        },
    ];

//日光灯
const FrameworkLightList =
    [
        {
            value: 0,
            text: "LED灯"
        },
        {
            value: 1,
            text: "梁下普通"
        },
    ];

//驱动类型
const DriverTypeList =
    [
        {
            value: 0,
            text: "普通"
        },
    ];

//驱动方式
//普通,宽幅(中传动)
const DriverMethodList =
    [
        {
            value: 0,
            text: "普通"
        },
        {
            value: 1,
            text: "宽幅(中传动)"
        },
    ];

//绷孔架
const DriverReelHoleList =
    [
        {
            value: 0,
            text: "有"
        },
        {
            value: 1,
            text: "无"
        },
    ];


//绷架
const DriverReelList =
    [
        {
            value: 0,
            text: "有"
        },
        {
            value: 1,
            text: "无"
        },
    ];

//佳字绳绣
const JiaZiXiuPricelList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];

//冠军金片
const ChampionGoldList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];