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
    Planed: "Planed",
    Waiting: "Waiting",
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
    {name: '单针四片'},
    {name: '简易毛巾'},
    {name: '雕孔'},
    {name: '佳宇珠子装置'},
    {name: '冠炯珠子装置'},
    {name: '诺德珠子装置'},
    {name: '激光装置'},
    {name: '铝合金框架花架'},
    {name: '自动换底线'}
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
//绕线机配备
const WrapMachineList =
    [
        {
            value: 0,
            text: "配普通绕线机"
        },
        {
            value: 1,
            text: "不配普通绕线机"
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
        {
            value: 2,
            text: "客户自理"
        },
    ];

const DefaultSelectedValue = "无";

const ColorChangeModeList = [
    {
        value: 0,
        text: "无"
    },
    {
        value: 1, text: "凸轮换色"
    },
    {
        value: 2, text: "丝杆换色"
    }
];

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
    {
        value: 3,
        text: "9色"
    }
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
        },
        {
            value: 7,
            text: "285"
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
            en: "China",
            cn: "中国"

        },
        {
            value: 1,
            en: "Andorra",
            cn: "安道尔共和国"
        },
        {
            value: 2,
            en: "United Arab Emirates",
            cn: "阿拉伯联合酋长国"
        },
        {
            value: 3,
            en: "Afghanistan",
            cn: "阿富汗"
        },
        {
            value: 4,
            en: "Antigua and Barbuda",
            cn: "安提瓜和巴布达"
        },
        {
            value: 5,
            en: "Anguilla",
            cn: "安圭拉岛"
        },
        {
            value: 6,
            en: "Albania",
            cn: "阿尔巴尼亚"
        },
        {
            value: 7,
            en: "Armenia",
            cn: "亚美尼亚"
        },
        {
            value: 8,
            en: "Angola",
            cn: "安哥拉"
        },
        {
            value: 9,
            en: "Argentina",
            cn: "阿根廷"
        },
        {
            value: 10,
            en: "Austria",
            cn: "奥地利"
        },
        {
            value: 11,
            en: "Australia",
            cn: "澳大利亚"
        },
        {
            value: 12,
            en: "Azerbaijan",
            cn: "阿塞拜疆"
        },
        {
            value: 13,
            en: "Barbados",
            cn: "巴巴多斯"
        },
        {
            value: 14,
            en: "Bangladesh",
            cn: "孟加拉国"
        },
        {
            value: 15,
            en: "Belgium",
            cn: "比利时"
        },
        {
            value: 16,
            en: "Burkina-faso",
            cn: "布基纳法索"
        },
        {
            value: 17,
            en: "Bulgaria",
            cn: "保加利亚"
        },
        {
            value: 18,
            en: "Bahrain",
            cn: "巴林"
        },
        {
            value: 19,
            en: "Burundi",
            cn: "布隆迪"
        },
        {
            value: 20,
            en: "Benin",
            cn: "贝宁"
        },
        {
            value: 21,
            en: "Palestine",
            cn: "巴勒斯坦"
        },
        {
            value: 22,
            en: "Bermuda Is.",
            cn: "百慕大群岛"
        },
        {
            value: 23,
            en: "Brunei",
            cn: "文莱"
        },
        {
            value: 24,
            en: "Bolivia",
            cn: "玻利维亚"
        },
        {
            value: 25,
            en: "Brazil",
            cn: "巴西"
        },
        {
            value: 26,
            en: "Bahamas",
            cn: "巴哈马"
        },
        {
            value: 27,
            en: "Botswana",
            cn: "博茨瓦纳"
        },
        {
            value: 28,
            en: "Belarus",
            cn: "白俄罗斯"
        },
        {
            value: 29,
            en: "Belize",
            cn: "伯利兹"
        },
        {
            value: 30,
            en: "Canada",
            cn: "加拿大"
        },
        {
            value: 31,
            en: "Central African Republic",
            cn: "中非共和国"
        },
        {
            value: 32,
            en: "Congo",
            cn: "刚果"
        },
        {
            value: 33,
            en: "Switzerland",
            cn: "瑞士"
        },
        {
            value: 34,
            en: "Cook Is.",
            cn: "库克群岛"
        },
        {
            value: 35,
            en: "Chile",
            cn: "智利"
        },
        {
            value: 36,
            en: "Cameroon",
            cn: "喀麦隆"
        },
        {
            value: 37,
            en: "Colombia",
            cn: "哥伦比亚"
        },
        {
            value: 38,
            en: "Costa Rica",
            cn: "哥斯达黎加"
        },
        {
            value: 39,
            en: "Czech",
            cn: "捷克"
        },
        {
            value: 40,
            en: "Cuba",
            cn: "古巴"
        },
        {
            value: 41,
            en: "Cyprus",
            cn: "塞浦路斯"
        },
        {
            value: 42,
            en: "Czech Republic",
            cn: "捷克"
        },
        {
            value: 43,
            en: "Germany",
            cn: "德国"
        },
        {
            value: 44,
            en: "Djibouti",
            cn: "吉布提"
        },
        {
            value: 45,
            en: "Denmark",
            cn: "丹麦"
        },
        {
            value: 46,
            en: "Dominica Rep.",
            cn: "多米尼加共和国"
        },
        {
            value: 47,
            en: "Algeria",
            cn: "阿尔及利亚"
        },
        {
            value: 48,
            en: "Costa Rica",
            cn: "厄瓜多尔"
        },
        {
            value: 49,
            en: "Estonia",
            cn: "爱沙尼亚"
        },
        {
            value: 50,
            en: "Egypt",
            cn: "埃及"
        },
        {
            value: 51,
            en: "Spain",
            cn: "西班牙"
        },
        {
            value: 52,
            en: "Ethiopia",
            cn: "埃塞俄比亚"
        },
        {
            value: 53,
            en: "Finland",
            cn: "芬兰"
        },
        {
            value: 54,
            en: "Fiji",
            cn: "斐济"
        },
        {
            value: 55,
            en: "France",
            cn: "法国"
        },
        {
            value: 56,
            en: "Gabon",
            cn: "加蓬"
        },
        {
            value: 57,
            en: "United Kiongdom",
            cn: "英国"
        },
        {
            value: 58,
            en: "Grenada",
            cn: "格林纳达"
        },
        {
            value: 59,
            en: "Georgia",
            cn: "格鲁吉亚"
        },
        {
            value: 60,
            en: "French Guiana",
            cn: "法属圭亚那"
        },
        {
            value: 61,
            en: "Ghana",
            cn: "加纳"
        },
        {
            value: 62,
            en: "Gibraltar",
            cn: "直布罗陀"
        },
        {
            value: 63,
            en: "Gambia",
            cn: "冈比亚"
        },
        {
            value: 64,
            en: "Guinea",
            cn: "几内亚"
        },
        {
            value: 65,
            en: "Greece",
            cn: "希腊"
        },
        {
            value: 66,
            en: "Guatemala",
            cn: "危地马拉"
        },
        {
            value: 67,
            en: "Guam",
            cn: "关岛"
        },
        {
            value: 68,
            en: "Guyana",
            cn: "圭亚那"
        },
        {
            value: 69,
            en: "Hongkong",
            cn: "香港特别行政区"
        },
        {
            value: 70,
            en: "Honduras",
            cn: "洪都拉斯"
        },
        {
            value: 71,
            en: "Haiti",
            cn: "海地"
        },
        {
            value: 72,
            en: "Hungary",
            cn: "匈牙利"
        },
        {
            value: 73,
            en: "Indonesia",
            cn: "印度尼西亚"
        },
        {
            value: 74,
            en: "Ireland",
            cn: "爱尔兰"
        },
        {
            value: 75,
            en: "India",
            cn: "印度"
        },
        {
            value: 76,
            en: "Iraq",
            cn: "伊拉克"
        },
        {
            value: 77,
            en: "Iran",
            cn: "伊朗"
        },
        {
            value: 78,
            en: "Iceland",
            cn: "冰岛"
        },
        {
            value: 79,
            en: "Jamaica",
            cn: "牙买加"
        },
        {
            value: 80,
            en: "Jordan",
            cn: "约旦"
        },
        {
            value: 81,
            en: "Japan",
            cn: "日本"
        },
        {
            value: 82,
            en: "Kenya",
            cn: "肯尼亚"
        },
        {
            value: 83,
            en: "Kyrgyzstan",
            cn: "吉尔吉斯坦"
        },
        {
            value: 84,
            en: "Kampuchea (Cambodia)",
            cn: "柬埔寨"
        },
        {
            value: 85,
            en: "North Korea",
            cn: "朝鲜"
        },
        {
            value: 86,
            en: "Korea",
            cn: "韩国"
        },
        {
            value: 87,
            en: "Republic of Ivory Coast",
            cn: "科特迪瓦共和国"
        },
        {
            value: 88,
            en: "Kuwait",
            cn: "科威特"
        },
        {
            value: 89,
            en: "Kazakstan",
            cn: "哈萨克斯坦"
        },
        {
            value: 90,
            en: "Laos",
            cn: "老挝"
        },
        {
            value: 91,
            en: "Lebanon",
            cn: "黎巴嫩"
        },
        {
            value: 92,
            en: "St.Lucia",
            cn: "圣卢西亚"
        },
        {
            value: 93,
            en: "Liechtenstein",
            cn: "列支敦士登"
        },
        {
            value: 94,
            en: "Sri Lanka",
            cn: "斯里兰卡"
        },
        {
            value: 95,
            en: "Lesotho",
            cn: "利比里亚"
        },
        {
            value: 96,
            en: "Korea",
            cn: "莱索托"
        },
        {
            value: 97,
            en: "Lithuania",
            cn: "立陶宛"
        },
        {
            value: 98,
            en: "Luxembourg",
            cn: "卢森堡"
        },
        {
            value: 99,
            en: "Latvia",
            cn: "拉脱维亚"
        },
        {
            value: 100,
            en: "Libya",
            cn: "利比亚"
        },
        {
            value: 101,
            en: "Morocco",
            cn: "摩洛哥"
        },
        {
            value: 102,
            en: "Monaco",
            cn: "摩纳哥"
        },
        {
            value: 103,
            en: "Moldova, Republic of",
            cn: "摩尔多瓦"
        },
        {
            value: 104,
            en: "Madagascar",
            cn: "马达加斯加"
        },
        {
            value: 105,
            en: "Mali",
            cn: "马里"
        },
        {
            value: 106,
            en: "Burma",
            cn: "缅甸"
        },
        {
            value: 107,
            en: "Mongolia",
            cn: "蒙古"
        },
        {
            value: 108,
            en: "Macao",
            cn: "澳门"
        },
        {
            value: 109,
            en: "Montserrat Is",
            cn: "蒙特塞拉特岛"
        },
        {

            value: 110,

            en: "Malta",

            cn: "马耳他"

        },

        {

            value: 111,

            en: "Mauritius",

            cn: "毛里求斯"

        },

        {

            value: 112,

            en: "Maldives",

            cn: "马尔代夫"

        },

        {

            value: 113,

            en: "Malawi",

            cn: "马拉维"

        },

        {

            value: 114,

            en: "Mexico",

            cn: "墨西哥"

        },

        {

            value: 115,

            en: "Malaysia",

            cn: "马来西亚"

        },

        {

            value: 116,

            en: "Mozambique",

            cn: "莫桑比克"

        },

        {

            value: 117,

            en: "Namibia",

            cn: "纳米比亚"

        },

        {

            value: 118,

            en: "Niger",

            cn: "尼日尔"

        },

        {

            value: 119,

            en: "Nigeria",

            cn: "尼日利亚"

        },

        {

            value: 120,

            en: "Nicaragua",

            cn: "尼加拉瓜"

        },

        {

            value: 121,

            en: "Netherlands",

            cn: "荷兰"

        },

        {

            value: 122,

            en: "Norway",

            cn: "挪威"

        },

        {

            value: 123,

            en: "Nepal",

            cn: "尼泊尔"

        },

        {

            value: 124,

            en: "Nauru",

            cn: "瑙鲁"

        },

        {

            value: 125,

            en: "New Zealand",

            cn: "新西兰"

        },

        {

            value: 126,

            en: "Oman",

            cn: "阿曼"

        },

        {

            value: 127,

            en: "Panama",

            cn: "巴拿马"

        },

        {

            value: 128,

            en: "Peru",

            cn: "秘鲁"

        },

        {

            value: 129,

            en: "French Polynesia",

            cn: "法属玻利尼西亚"

        },

        {

            value: 130,

            en: "Papua New Cuinea",

            cn: "巴布亚新几内亚"

        },

        {

            value: 131,

            en: "Philippines",

            cn: "菲律宾"

        },

        {

            value: 132,

            en: "Pakistan",

            cn: "巴基斯坦"

        },

        {

            value: 133,

            en: "Poland",

            cn: "波兰"

        },

        {

            value: 134,

            en: "Puerto Rico",

            cn: "波多黎各"

        },

        {

            value: 135,

            en: "Portugal",

            cn: "葡萄牙"

        },

        {

            value: 136,

            en: "Paraguay",

            cn: "巴拉圭"

        },

        {

            value: 137,

            en: "Qatar",

            cn: "卡塔尔"

        },

        {

            value: 138,

            en: "Romania",

            cn: "罗马尼亚"

        },

        {

            value: 139,

            en: "Russia",

            cn: "俄罗斯"

        },

        {

            value: 140,

            en: "Saudi Arabia",

            cn: "沙特阿拉伯"

        },

        {

            value: 141,

            en: "Solomon Is",

            cn: "所罗门群岛"

        },

        {

            value: 142,

            en: "Seychelles",

            cn: "塞舌尔"

        },

        {

            value: 143,

            en: "Sudan",

            cn: "苏丹"

        },

        {

            value: 144,

            en: "Sweden",

            cn: "瑞典"

        },

        {

            value: 145,

            en: "Singapore",

            cn: "新加坡"

        },

        {

            value: 146,

            en: "Slovenia",

            cn: "斯洛文尼亚"

        },

        {

            value: 147,

            en: "Slovakia",

            cn: "斯洛伐克"

        },

        {

            value: 148,

            en: "Sierra Leone",

            cn: "塞拉利昂"

        },

        {

            value: 149,

            en: "San Marino",

            cn: "圣马力诺"

        },

        {

            value: 150,

            en: "Senegal",

            cn: "塞内加尔"

        },

        {

            value: 151,

            en: "Somali",

            cn: "索马里"

        },

        {

            value: 152,

            en: "Suriname",

            cn: "苏里南"

        },

        {

            value: 153,

            en: "Sao Tome and Principe",

            cn: "圣多美和普林西比"

        },

        {

            value: 154,

            en: "EI Salvador",

            cn: "萨尔瓦多"

        },

        {

            value: 155,

            en: "Syria",

            cn: "叙利亚"

        },

        {

            value: 156,

            en: "Swaziland",

            cn: "斯威士兰"

        },

        {

            value: 157,

            en: "Chad",

            cn: "乍得"

        },

        {

            value: 158,

            en: "Togo",

            cn: "多哥"

        },

        {

            value: 159,

            en: "Thailand",

            cn: "泰国"

        },

        {

            value: 160,

            en: "Tajikstan",

            cn: "塔吉克斯坦"

        },

        {

            value: 161,

            en: "Turkmenistan",

            cn: "土库曼斯坦"

        },

        {

            value: 162,

            en: "Tunisia",

            cn: "突尼斯"

        },

        {

            value: 163,

            en: "Tonga",

            cn: "汤加"

        },

        {

            value: 164,

            en: "Turkey",

            cn: "土耳其"

        },

        {

            value: 165,

            en: "Trinidad and Tobago",

            cn: "特立尼达和多巴哥"

        },

        {

            value: 166,

            en: "Taiwan",

            cn: "台湾省"

        },

        {

            value: 167,

            en: "Tanzania",

            cn: "坦桑尼亚"

        },

        {

            value: 168,

            en: "Ukraine",

            cn: "乌克兰"

        },

        {

            value: 169,

            en: "Uganda",

            cn: "乌干达"

        },

        {

            value: 170,

            en: "United States of America",

            cn: "美国"

        },

        {

            value: 171,

            en: "Uruguay",

            cn: "乌拉圭"

        },

        {

            value: 172,

            en: "Uzbekistan",

            cn: "乌兹别克斯坦"

        },

        {

            value: 173,

            en: "Saint Vincent",

            cn: "圣文森特岛"

        },

        {

            value: 174,

            en: "Venezuela",

            cn: "委内瑞拉"

        },

        {

            value: 175,

            en: "Vietnam",

            cn: "越南"

        },

        {
            value: 176,
            en: "Yemen",
            cn: "也门"
        },

        {
            value: 177,
            en: "Yugoslavia",
            cn: "南斯拉夫"
        },

        {
            value: 178,
            en: "South Africa",
            cn: "南非"
        },
        {
            value: 179,
            en: "Zambia",
            cn: "赞比亚"
        },
        {
            value: 180,
            en: "Zaire",
            cn: "扎伊尔"
        },
        {
            value: 181,
            en: "Zimbabwe ",
            cn: "津巴布韦"
        },
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
            text: "无"
        },
        {
            value: 1,
            text: "电机剪线"
        },
        {
            value: 2,
            text: "普通剪线"
        },
        {
            value: 3,
            text: "不剪线"
        },
        {
            value: 4,
            text: "电机静态剪线"
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
            text: "上油盒"
        },
        {
            value: 2,
            text: "上油盒下点动"
        },
        {
            value: 3,
            text: "上油盒下手压"
        },
        {
            value: 4,
            text: "白油循环"
        },
    ];

//夹线器
//伟龙款,15款信胜普通,15款信胜高速,信胜普通,信胜高速,仿田岛,上海,固定式
const AxleSplitList =
    [
    	{
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "信胜款"
        },
        {
            value: 2,
            text: "NXE款"
        },
        {
            value: 3,
            text: "仿田岛"
        },
        {
            value: 4,
            text: "固定式"	    
        },
        {
            value: 5,
            text: "佳宇珠子绣款"	    
        }
    ];

//面板
//上下分体面板,上塑料下铁,上塑料下复合,上塑料下塑料
const AxlePanelList =
    [
    	{
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "上下分体面板"
        },
        {
            value: 2,
            text: "上塑料下铁"
        },
        {
            value: 3,
            text: "上塑料下复合"
        },
        {
            value: 4,
            text: "上塑料下塑料"
        },
    ];

//机针
//9,11,12,14,16,18
const AxleNeedleList =
    [
    	{
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "尖头针"
        },
        {
            value: 2,
            text: "SUK"
        },
        {
            value: 3,
            text: "GROZ"
        },
        {
            value: 4,
            text: "风琴尖头"
        }
    ];

//SUK,GROZ
const AxleNeedleTypeList =
    [
    	{
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "尖头针"
        },
        {
            value: 2,
            text: "SUK"
        },
        {
            value: 3,
            text: "GROZ"
        },
        {
            value: 4,
            text: "风琴尖头"
        }

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
            text: "无"
        },
        {
            value: 1,
            text: "广濑1.6倍高速"
        },
        {
            value: 2,
            text: "广濑1.6倍"
        },
        {
            value: 3,
            text: "佐伩12-R"
        },
        {
            value: 4,
            text: "佐伩12-RP"
        },
        {
            value: 5,
            text: "佐伩12-RY"
        },
        {
            value: 6,
            text: "佐伩12RYP"
        },
        {
            value: 7,
            text: "佐文"
        },
        {
            value: 8,
            text: "韩大"
        },
        {
            value: 9,
            text: "韩大黑芯"
        },
        {
            value: 10,
            text: "广濑普通"
        },
        {
            value: 11,
            text: "广濑高速"
        },
        {
            value: 12,
            text: "SINSIM"
        },
        {
            value: 13,
            text: "德盛精品"
        },
        {
            value: 14,
            text: "广濑AO(MG1)"
        },
        {
            value: 15,
            text: "广濑ATR(MG1)"
        },
        {
            value: 16,
            text: "广濑ATR(MG1F)黑心"
        },
	{
            value: 17,
            text: "广濑ATR(MG1QF)黑心"
        },
    ];


//跳跃方式
//电磁铁跳跃,电机跳跃,电磁铁跳跃带轴承
const AxleJumpList =
    [
    	{
            value: 0,
            text: "无"
        },
        {
            value: 1,
            text: "电磁铁跳跃"
        },
        {
            value: 2,
            text: "电机跳跃"
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
        {
            value: 3,
            text: "NXE蓝色"
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
        {
            value: 2,
            text: "NXE白色"
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
            text: "宽幅"
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