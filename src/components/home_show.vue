<template xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-container>
        <el-header  style="background: whitesmoke; height: 100px">
            <el-row style="margin-top: 20px">
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="10">
                            <div style="font-size: 20px;font-weight: bold">安装中机器数：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 56px; font-weight: bold;">{{installingMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="10">
                            <div style="font-size: 20px;font-weight: bold">拆单中机器数：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 56px; font-weight: bold;">{{changeMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="10">
                            <div style="font-size: 20px;font-weight: bold">改单中机器数：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 56px; font-weight: bold; color: #FA5555">{{splitMachineNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="10">
                            <div style="font-size: 20px;font-weight: bold">异常工序数：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 56px; font-weight: bold; color: #FA5555">{{abnormalTaskNum}}</div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row type="flex" class="row-bg" justify="center" style="margin-top: 50px">
                <el-col>
                    <div id="installing" style="width:100%; height:500px; "></div>
                </el-col>
                <el-col>
                    <div id="abnormal" style="width:100%;height: 500px;"></div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 50px">
                <el-col :span="2" :offset="5">
                    <span style="font-size: 20px;font-weight: bold">改单记录</span>
                </el-col>
                <el-col :span="2" :offset="10" >
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
                            <template scope="scope">{{ scope.row.orderId }}</template>
                        </el-table-column>
                        <el-table-column label="改单原因" align="center">
                            <template scope="scope">
                                <span style="font-weight: bold;color: #1d90e6">{{ scope.row.changeReason }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="createTime"
                                width="200"
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
                            <template scope="scope">{{ scope.row.orderId}}</template>
                        </el-table-column>
                        <el-table-column label="拆单原因" align="center">
                            <template scope="scope">
                                <span style="font-weight: bold;color: #1d90e6">{{ scope.row.splitReason }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="createTime"
                                width="200"
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


</template >

<script >
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
                installData:[115, 200, 136, 100, 300, 205, 115, 200, 136, 100, 300, 205],
                abnormalData:[
                    {
                        name:'缺料',
                        type:'bar',
                        stack: '异常',
                        data:[15, 20, 12, 10, 3, 5, 15, 20, 16, 1, 3, 8],
//                        itemStyle:{
//                            normal:{color:'#FA5555'}
//                        },
                    },
                    {
                        name:'安装错误',
                        type:'bar',
                        stack: '异常',
                        data:[5, 2, 3, 10, 1, 0, 1, 6, 7, 1, 3, 8]
                    },
                    {
                        name:'检验不合格',
                        type:'bar',
                        stack: '异常',
//                        itemStyle:{
//                            normal:{color:'yellow'}
//                        },
                        data:[1, 2, 0, 3, 8, 5, 5, 10, 6, 1, 3, 4]
                    }
                ],
                changeOrderHistory:[],
                splitOrderHistory:[]
            }
        },
        methods: {
            formatDate(timeStamp) {
                if(timeStamp == null || timeStamp == "") {
                    return "";
                }else {
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
                    size: _this.pageSize
                };
                $.ajax({
                    url: HOST + "/order/change/record/list",
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
                $.ajax({
                    url: HOST + "/order/split/record/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
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

        },
        computed: {},
        filters: {

        },
        created: function () {
            this.getChangeOrderHistory();
            this.getSplitOrderHistory();

        },
        mounted: function () {
            // 基于准备好的dom，初始化echarts实例
            var installingChart = echarts.init(document.getElementById('installing'));
            var abnormalChart = echarts.init(document.getElementById('abnormal'));

            // 指定图表的配置项和数据
            var installOption = {
                color: ['#3398DB'],
                title: {
                    text: '未完成计划工序数/月'
                },
                tooltip: {},
                legend: {
                    data:['工序数']
                },
                xAxis: {
                    data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
                },
                yAxis: {},
                series: [{
                    name: '工序数',
                    type: 'bar',
                    data: _this.installData
                }]
            };

            // 指定图表的配置项和数据
            var abnormalOption = {
                title: {
                    text: '异常次数/月'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['缺料', '安装错误', '检验不合格']
                },
                xAxis: {
                    data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
                },
                yAxis: {
                    type : 'value'
                },
                series:_this.abnormalData
            };

            // 使用刚指定的配置项和数据显示图表。
            installingChart.setOption(installOption);
            abnormalChart.setOption(abnormalOption);
        },
        destroyed: function () {
        }
    }

</script >

<style lang="scss" scoped >

</style >