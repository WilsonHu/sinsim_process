//Server root address
var HOST = "http://127.0.0.1:8080/";
//var HOST = "http://127.0.0.1/";
var HOST_URL = HOST + "shcrhservice/";

var SERVER_ROOT = HOST_URL + "index.php/";
var HOME = SERVER_ROOT + "Home/";
var DOWNLOADPATH = HOST_URL + "DownLoad/";
var Import_URL = HOST_URL + "Import/";
var Image_URL = HOST_URL + "Image/";
var SOCKECT_ADDR = "ws://127.0.0.1:9998";//CRHService IP address(Windows service)
var SYSTEMNAME = "SinSim流程管理系统";

var EveryPageNum = 10;
var MaxUpDownItems = 4;
var ScrollTimerInterval = 5000;
var DisableScroll = 1;
var COM_CMD_INTERVAL = 5000;

var DefaultTaskList = {
    "class": "go.GraphLinksModel",
    "linkFromPortIdProperty": "fromPort",
    "linkToPortIdProperty": "toPort",
}

//机器安装完成状态
var ProcessStatusList = [
    // {value: 0, name: '未配置'},
    {value: 1, name: '待安装'},
    {value: 2, name: '进行中'},
    {value: 3, name: '已完成'},
    {value: 4, name: '异常'},
];

//机器流程配置状态
var ConfigStatusList = [
    {value: 1, name: '未配置'},
    {value: 2, name: '已配置'},
];

//需求单状态
var OrderStatusList = [
    {value: 0, name: '未提交审核'},
    {value: 1, name: '审核中'},
    {value: 2, name: '审核完成'},
    {value: 3, name: '已改单'},
    {value: 4, name: '已拆单'},
    {value: 5, name: '已驳回'},
    {value: 6, name: '已取消'}
];

//机器状态
var MachineStatusList = [
    {value: 0, name: '未计划'},
    {value: 1, name: '已计划'},
    {value: 2, name: '生产中'},
    {value: 3, name: '生产完成'},
    {value: 4, name: '已改单'},
    {value: 5, name: '已拆单'},
    {value: 6, name: '已取消'}
];

//安装工序状态
let TaskStatusList = [
    {value: 0, name: '待安装'},
    {value: 1, name: '开始安装'},
    {value: 2, name: '安装完成'},
    {value: 3, name: '质检中'},
    {value: 4, name: '质检完成'},
    {value: 5, name: '安装异常'},
    {value: 6, name: '质检异常'}];

//查询日期类型
var SearchDateType = [
    {value: 1, name: '合同交货日期'},
    {value: 2, name: '计划交货日期'},
];

//包装方式
var PackageModeList =
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

//国家
var CountryList = [
    {"text": "安哥拉"},
    {"text": "阿富汗"},
    {"text": "阿尔巴尼亚"},
    {"text": "阿尔及利亚"},
    {"text": "安道尔共和国"},
    {"text": "安圭拉岛"},
    {"text": "安提瓜和巴布达"},
    {"text": "阿根廷"},
    {"text": "亚美尼亚"},
    {"text": "澳大利亚"},
    {"text": "奥地利"},
    {"text": "阿塞拜疆"},
    {"text": "巴哈马"},
    {"text": "巴林"},
    {"text": "孟加拉国"},
    {"text": "巴巴多斯"},
    {"text": "白俄罗斯"},
    {"text": "比利时"},
    {"text": "伯利兹"},
    {"text": "贝宁"},
    {"text": "百慕大群岛"},
    {"text": "玻利维亚"},
    {"text": "博茨瓦纳"},
    {"text": "巴西"},
    {"text": "文莱"},
    {"text": "保加利亚"},
    {"text": "布基纳法索"},
    {"text": "缅甸"},
    {"text": "布隆迪"},
    {"text": "喀麦隆"},
    {"text": "加拿大"},
    {"text": "中非共和国"},
    {"text": "乍得"},
    {"text": "智利"},
    {"text": "中国"},
    {"text": "哥伦比亚"},
    {"text": "刚果"},
    {"text": "库克群岛"},
    {"text": "哥斯达黎加"},
    {"text": "古巴"},
    {"text": "塞浦路斯"},
    {"text": "捷克"},
    {"text": "丹麦"},
    {"text": "吉布提"},
    {"text": "多米尼加共和国"},
    {"text": "厄瓜多尔"},
    {"text": "埃及"},
    {"text": "萨尔瓦多"},
    {"text": "爱沙尼亚"},
    {"text": "埃塞俄比亚"},
    {"text": "斐济"},
    {"text": "芬兰"},
    {"text": "法国"},
    {"text": "法属圭亚那"},
    {"text": "加蓬"},
    {"text": "冈比亚"},
    {"text": "格鲁吉亚"},
    {"text": "德国"},
    {"text": "加纳"},
    {"text": "直布罗陀"},
    {"text": "希腊"},
    {"text": "格林纳达"},
    {"text": "关岛"},
    {"text": "危地马拉"},
    {"text": "几内亚"},
    {"text": "圭亚那"},
    {"text": "海地"},
    {"text": "洪都拉斯"},
    {"text": "香港"},
    {"text": "匈牙利"},
    {"text": "冰岛"},
    {"text": "印度"},
    {"text": "印度尼西亚"},
    {"text": "伊朗"},
    {"text": "伊拉克"},
    {"text": "爱尔兰"},
    {"text": "以色列"},
    {"text": "意大利"},
    {"text": "牙买加"},
    {"text": "日本"},
    {"text": "约旦"},
    {"text": "柬埔寨"},
    {"text": "哈萨克斯坦"},
    {"text": "肯尼亚"},
    {"text": "韩国"},
    {"text": "科威特"},
    {"text": "吉尔吉斯坦"},
    {"text": "老挝"},
    {"text": "拉脱维亚"},
    {"text": "黎巴嫩"},
    {"text": "莱索托"},
    {"text": "利比里亚"},
    {"text": "利比亚"},
    {"text": "列支敦士登"},
    {"text": "立陶宛"},
    {"text": "卢森堡"},
    {"text": "澳门"},
    {"text": "马达加斯加"},
    {"text": "马拉维"},
    {"text": "马来西亚"},
    {"text": "马尔代夫"},
    {"text": "马里"},
    {"text": "马耳他"},
    {"text": "毛里求斯"},
    {"text": "墨西哥"},
    {"text": "摩尔多瓦"},
    {"text": "摩纳哥"},
    {"text": "蒙古"},
    {"text": "蒙特塞拉特岛"},
    {"text": "摩洛哥"},
    {"text": "莫桑比克"},
    {"text": "纳米比亚"},
    {"text": "瑙鲁"},
    {"text": "尼泊尔"},
    {"text": "荷兰"},
    {"text": "新西兰"},
    {"text": "尼加拉瓜"},
    {"text": "尼日尔"},
    {"text": "尼日利亚"},
    {"text": "朝鲜"},
    {"text": "挪威"},
    {"text": "阿曼"},
    {"text": "巴基斯坦"},
    {"text": "巴拿马"},
    {"text": "巴布亚新几内亚"},
    {"text": "巴拉圭"},
    {"text": "秘鲁"},
    {"text": "菲律宾"},
    {"text": "波兰"},
    {"text": "法属玻利尼西亚"},
    {"text": "葡萄牙"},
    {"text": "波多黎各"},
    {"text": "卡塔尔"},
    {"text": "罗马尼亚"},
    {"text": "俄罗斯"},
    {"text": "圣卢西亚"},
    {"text": "圣文森特岛"},
    {"text": "圣马力诺"},
    {"text": "圣多美和普林西比"},
    {"text": "沙特阿拉伯"},
    {"text": "塞内加尔"},
    {"text": "塞舌尔"},
    {"text": "塞拉利昂"},
    {"text": "新加坡"},
    {"text": "斯洛伐克"},
    {"text": "斯洛文尼亚"},
    {"text": "所罗门群岛"},
    {"text": "索马里"},
    {"text": "南非"},
    {"text": "西班牙"},
    {"text": "斯里兰卡"},
    {"text": "苏丹"},
    {"text": "苏里南"},
    {"text": "斯威士兰"},
    {"text": "瑞典"},
    {"text": "瑞士"},
    {"text": "叙利亚"},
    {"text": "台湾省"},
    {"text": "塔吉克斯坦"},
    {"text": "坦桑尼亚"},
    {"text": "泰国"},
    {"text": "多哥"},
    {"text": "汤加"},
    {"text": "特立尼达和多巴哥"},
    {"text": "突尼斯"},
    {"text": "土耳其"},
    {"text": "土库曼斯坦"},
    {"text": "乌干达"},
    {"text": "乌克兰"},
    {"text": "阿拉伯联合酋长国"},
    {"text": "英国"},
    {"text": "美国"},
    {"text": "乌拉圭"},
    {"text": "乌兹别克斯坦"},
    {"text": "委内瑞拉"},
    {"text": "越南"},
    {"text": "也门"},
    {"text": "南斯拉夫"},
    {"text": "津巴布韦"},
    {"text": "扎伊尔"},
    {"text": "赞比亚"}
];

//色数
var SpecialTowelColorList = [
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
var SpecialTapingHeadList = [
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
var SpecialTowelDaxleList = [
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
var SpecialTowelHaxleList = [
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
var SpecialTowelMotorList = [
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
var SpecialTowelNeedleList = [
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
var PCModeList =
    [
        {
            value: 0,
            text: "M98"
        },
        {
            value: 1,
            text: "C29"
        },
        {
            value: 2,
            text: "528"
        },
        {
            value: 3,
            text: "322"
        },
        {
            value: 4,
            text: "328"
        },
        {
            value: 5,
            text: "366"
        },
        {
            value: 6,
            text: "316"
        },
        {
            value: 7,
            text: "C98"
        },
        {
            value: 8,
            text: "C88"
        },
        {
            value: 9,
            text: "C19"
        },
        {
            value: 10,
            text: "C16"
        },

    ];

//英语,中文,西班牙,法语,葡萄牙,土耳其,韩语,俄语,阿拉伯语
//语言
var LanguageList =
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


//电气主电机
//大豪,松下,儒竞
var ElectricMotorList =
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
var XYMotorList =
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
var TrimList =
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
var ElectricPowerList =
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
var ElectricSwitchList =
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
var ElectricOilList =
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
var AxleSplitList =
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
var AxlePanelList =
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
var AxleNeedleList =
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

//SUK
var SUKList =
    [
        {
            value: 0,
            text: "SUK"
        },
    ];


//机头导轨
var AxleRailList =
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
var AxleDownCheckList =
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
var AxleHookList =
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
var AxleJumpList =
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
var AxleUpperThreadList =
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
var FrameworkColorList =
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
var FrameworkPlatenList =
    [
        {
            value: 0,
            text: "杨桉木"
        },
    ];

//台板颜色
//鲁冰花浅灰边,浅绿
var FrameworkPlatenColorList =
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
var FrameworkRingList =
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
var FrameworkBracketList =
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
var FrameworkStopList =
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
var FrameworkLightList =
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
var DriverTypeList =
    [
        {
            value: 0,
            text: "普通"
        },
    ];

//驱动方式
//普通,宽幅(中传动)
var DriverMethodList =
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
var DriverReelHoleList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];


//绷架
var DriverReelList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];

//佳字绳绣
var JiaZiXiuPricelList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];

//冠军金片
var ChampionGoldList =
    [
        {
            value: 0,
            text: "正常"
        },
    ];