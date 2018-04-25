<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-container>
        <el-header style="background: whitesmoke; height: 80px">
            <el-row style="margin-top: 10px">
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col >
                            <div style="font-size: 20px;font-weight: bold">安装中:</div>
                        </el-col>
                        <el-col>
                            <div style="font-size: 52px; font-weight: bold;">{{installingMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col >
                            <div style="font-size: 20px;font-weight: bold">改单中:</div>
                        </el-col>
                        <el-col >
                            <div style="font-size: 52px; font-weight: bold; color: #FA5555">{{changeMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col >
                            <div style="font-size: 20px;font-weight: bold">拆单中:</div>
                        </el-col>
                        <el-col >
                            <div style="font-size: 52px; font-weight: bold; color: #FA5555">{{splitMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5">
                    <el-row type="flex" justify="center">
                        <el-col>
                            <div style="font-size: 20px;font-weight: bold">异常工序:</div>
                        </el-col>
                        <el-col >
                            <div style="font-size: 52px; font-weight: bold; color: #FA5555">{{abnormalTaskNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row type="flex" class="row-bg" justify="center" style="margin-top: 25px">
                <el-col>
                    <div id="installing" style="width:100%; height:450px; "></div>
                </el-col>
                <el-col>
                    <div id="abnormal" style="width:100%;height: 450px;"></div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 25px">
                <el-col :span="3" :offset="4">
                    <span style="font-size: 20px;font-weight: bold">改单记录</span>
                </el-col>
                <el-col :span="3" :offset="9">
                    <span style="font-size: 20px;font-weight: bold">拆单记录</span>
                </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center" style="margin-top: 20px">
                <el-col :span="11">
                    <el-table
                            :data="changeOrderHistory"
                            border
                            style="width: 100%;">
                        <el-table-column label="序号" width="70" align="center">
                            <template scope="scope">{{ scope.$index+changeStartRow}}</template>
                        </el-table-column>
                        <el-table-column label="需求单编号" width="200" align="center">
                            <template scope="scope">
                                <div @click="onDetailOrder(scope.row.orderNum)"
                                     style="font-weight: bold;"
                                     class="btn btn-link">
                                    {{scope.row.orderNum}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="改单原因" align="center">
                            <template scope="scope">
                                <span style="font-weight: bold;color: #1d90e6">{{ scope.row.changeReason }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="createTime"
                                width="160"
                                label="改单时间">
                            <template scope="scope">
                                <div>
                                    {{formatDate(scope.row.changeTime)}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <div class="block" align="center">
                        <el-pagination
                                background
                                @current-change="handleCurrentChange"
                                :current-page="changeCurrentPage"
                                :page-size="pageSize"
                                layout="total,prev, pager, next, jumper"
                                :total="changeTotalNum">
                        </el-pagination>
                    </div>
                </el-col>
                <el-col :span="11" :offset="1">
                    <el-table
                            :data="splitOrderHistory"
                            border
                            style="width: 100%;">
                        <el-table-column label="序号" width="70" align="center">
                            <template scope="scope">{{ scope.$index+splitStartRow}}</template>
                        </el-table-column>
                        <el-table-column label="需求单编号" width="200" align="center">
                            <template scope="scope">
                                <div @click="onDetailOrder(scope.row.orderNum)"
                                     style="font-weight: bold;"
                                     class="btn btn-link">
                                    {{scope.row.orderNum}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="拆单原因" align="center">
                            <template scope="scope">
                                <span style="font-weight: bold;color: #1d90e6">{{ scope.row.splitReason }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="createTime"
                                width="160"
                                label="拆单时间">
                            <template scope="scope">
                                <div>
                                    {{formatDate(scope.row.splitTime)}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <div class="block" align="center">
                        <el-pagination
                                background
                                @current-change="handleCurrentSplit"
                                :current-page="splitCurrentPage"
                                :page-size="pageSize"
                                layout="total,prev, pager, next, jumper"
                                :total="splitTotalNum">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>


</template>

<script>
    var _this;
    import echarts from 'echarts';

    export default {
        name: "home_show",
        components: {},
        data () {
            _this = this;
            return {
                pageSize: 5,//每一页的num

                changeTotalNum: 1,
                changeCurrentPage: 1,
                changeStartRow: 1,

                splitTotalNum: 1,
                splitCurrentPage: 1,
                splitStartRow: 1,

                installingMachineNum: 0,
                abnormalTaskNum: 0,
                changeMachineNum: 0,
                splitMachineNum: 0,
                installData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                abnormalData: [
                    {
                        name: '缺料',
                        type: 'bar',
                        stack: '异常',
                        data: [15, 20, 12, 10, 3, 5, 15, 20, 16, 1, 3, 8],
//                        itemStyle:{
//                            normal:{color:'#FA5555'}
//                        },
                    },
                    {
                        name: '安装错误',
                        type: 'bar',
                        stack: '异常',
                        data: [5, 2, 3, 10, 1, 0, 1, 6, 7, 1, 3, 8]
                    },
                    {
                        name: '检验不合格',
                        type: 'bar',
                        stack: '异常',
                        data: [1, 2, 0, 3, 8, 5, 5, 10, 6, 1, 3, 4]
                    }
                ],
                abnormalLegend: [],
                changeOrderHistory: [],
                splitOrderHistory: []
            }
        },
        methods: {
            onDetailOrder(ordernum)
            {
                sessionStorage.setItem('order_recorder', JSON.stringify({
                    orderNum: ordernum,
                }));
                _this.$router.push("/home/order");
            },

            formatDate(timeStamp) {
                if (timeStamp == null || timeStamp == "") {
                    return "";
                } else {
                    return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss");
                }
            },
            handleCurrentChange(val) {
                this.changeCurrentPage = val;
                this.getChangeOrderHistory();
            },
            handleCurrentSplit(val) {
                this.splitCurrentPage = val;
                this.getSplitOrderHistory();
            },
            getChangeOrderHistory() {
                var condition = {
                    page: _this.changeCurrentPage,
                    size: _this.pageSize,
                    id: "",
                    orderId: "",
                };
                $.ajax({
                    url: HOST + "/order/change/record/getChangeRecordList",
                    type: 'POST',
                    dataType: 'JSON',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.changeOrderHistory = res.data.list;
                            _this.changeTotalNum = res.data.total;
                            _this.changeStartRow = res.data.startRow;
                        } else {
                            showMessage(_this, res.data.message, 0)
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },
            getSplitOrderHistory() {

                var condition = {
                    page: _this.splitCurrentPage,
                    size: _this.pageSize,
                    id: "",
                    orderId: "",
                };
                $.ajax({
                    url: HOST + "/order/split/record/getSplitRecordList",
                    type: 'POST',
                    dataType: 'JSON',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.splitOrderHistory = res.data.list;
                            _this.splitTotalNum = res.data.total;
                            _this.splitStartRow = res.data.startRow;
                        } else {
                            showMessage(_this, res.data.message, 0)
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },
            getStatistic() {
                $.ajax({
                    url: HOST + "/dashboard/getStatistic",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data != null) {
                                _this.installingMachineNum = res.data.installingMachineNum;
                                _this.changeMachineNum = res.data.changeMachineNum;
                                _this.splitMachineNum = res.data.splitMachineNum;
                                _this.abnormalTaskNum = res.data.abnormalTaskNum;
                            }
                        } else {
                            showMessage(_this, res.data.message, 0)
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },

            getExpiredTaskStatistics() {
                $.ajax({
                    url: HOST + "/dashboard/getExpiredTaskStatistics",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        mode: STATISTICS_DATE_MODE.MONTH //取月份数据
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            for (var i = 0; i < res.data.length; i++) {
                                var j = res.data[i].dateMonth - 1;
                                _this.installData[j] = res.data[i].expiredCount;
                            }
                            _this.loadInstallData();
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },

            getAbnormalStatistics() {
                $.ajax({
                    url: HOST + "/dashboard/getAbnormalStatistics",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        mode: STATISTICS_DATE_MODE.MONTH //取月份数据
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.abnormalData = [];
                            _this.abnormalLegend = [];
                            for (var i = 0; i < res.data.length; i++) {
                                var j = res.data[i].dateMonth - 1;
                                var existIndex = -1;
                                for (var p = 0; p < _this.abnormalData.length; p++) {
                                    if (_this.abnormalData[p].name.trim() == res.data[i].abnormalName.trim()) {
                                        existIndex = p;
                                        break;
                                    }
                                }
                                if (existIndex > 0) {
                                    _this.abnormalData[existIndex].data[j] = res.data[i].abnormalCount;
                                }
                                else {
                                    _this.abnormalLegend.push(res.data[i].abnormalName.trim());
                                    _this.abnormalData.push({
                                        name: res.data[i].abnormalName.trim(),
                                        type: 'bar',
                                        stack: '异常',
                                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    },);
                                    _this.abnormalData[_this.abnormalData.length - 1].data[j] = res.data[i].abnormalCount;
                                }

                            }
                            _this.loadAbnormalData();
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },


            loadInstallData() {
                var installingChart = echarts.init(document.getElementById('installing'));
                // 指定图表的配置项和数据
                var installOption = {
                    color: ['#3398DB'],
                    title: {
                        text: '超期工序数/月'
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: true},
                            magicType: {show: true, type: ['line', 'bar']},
//                        restore: {show: true},
//                        saveAsImage: {show: true}
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
//                            type: 'cross',
//                            crossStyle: {
//                                color: '#999'
//                            }
                        }
                    },
                    legend: {
                        data: ['超期工序数']
                    },
                    xAxis: {
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                    },
                    yAxis: {
//                    type: 'value',
//                    name: '超时工序',
//                    min: 0,
//                    max: 250,
//                    interval: 50,
//                    axisLabel: {
//                        formatter: '{value}'
//                    }
                    },
                    series: [{
                        name: '超期工序数',
                        type: 'bar',
                        data: _this.installData
                    }]
                };
                installingChart.setOption(installOption);
            },

            loadAbnormalData() {
// 基于准备好的dom，初始化echarts实例
                var abnormalChart = echarts.init(document.getElementById('abnormal'));
                // 指定图表的配置项和数据
                var abnormalOption = {
                    title: {
                        text: '异常次数/月'
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: true},
                            magicType: {show: true, type: ['line', 'bar']},
//                        restore: {show: true},
//                        saveAsImage: {show: true}
                        }
                    },

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: _this.abnormalLegend,//['缺料', '安装错误', '检验不合格']
                    },
                    xAxis: {
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: _this.abnormalData
                };

                // 使用刚指定的配置项和数据显示图表。
                abnormalChart.setOption(abnormalOption);
            },

        },
        computed: {}
        ,
        filters: {}
        ,
        created: function () {
            this.getChangeOrderHistory();
            this.getSplitOrderHistory();
            this.getStatistic();
            _this.getExpiredTaskStatistics();
            _this.getAbnormalStatistics();
        }
        ,
        mounted: function () {
        },

        destroyed: function () {
        }
    }

</script>

<style lang="scss" scoped>

</style>