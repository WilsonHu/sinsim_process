<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工序:">
                            <el-select v-model="filters.taskName" placeholder="工序" clearable>
                                <el-option v-for="item in workTaskList" :key="item.id" :label="item.taskName" :value="item.taskName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单号:">
                            <el-input  v-model="filters.orderNum" placeholder="订单号" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="机器编号:">
                            <el-input  v-model="filters.nameplate" placeholder="机器编号" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="生产日期:">
                            <el-date-picker
                                    v-model="filters.selectDate"
                                    type="daterange"
                                    align="left"
                                    unlink-panels
                                    range-separator="—"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="8">
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询
                        </el-button>
                    </el-col>
                    <el-col :span="2" >
                        <el-button
                                icon="el-icon-share"
                                size="normal"
                                type="danger"
                                @click="processMachineExport">导出
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                    v-loading="loadingUI"
                    element-loading-text="获取数据中..."
                    :data="tableData"
                    border
                    empty-text="暂无数据..."
                    ref="singleTable"
                    highlight-current-row
                    show-overflow-tooltip="true"
                    :summary-method="getSummaries"
                    show-summary
                    style="width: 100%; ">
                <el-table-column
                        width="75"
                        align="center"
                        label="序号">
                    <template scope="scope">
                        {{scope.$index+startRow}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="taskName"
                        label="工序名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="machineOrder.orderNum"
                        label="订单号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="machine.nameplate"
                        label="机器编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="leader"
                        label="安装组长">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="installBeginTime"
                        label="开始时间">
                    <template slot-scope="scope">
                <span>
                {{(scope.row.installBeginTime)|filterDateString}}
                </span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="结束时间">
                    <template slot-scope="scope">
                <span>
                {{(scope.row.installBeginTime)|filterDateString}}
                </span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="spendTime"
                        label="耗时">
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        align="center"-->
                <!--                        prop="standardTime"-->
                <!--                        label="标准时间">-->
                <!--                </el-table-column>-->
                <!-- 效率目前没有方法计算-->
                <!-- 因为工序没法确定一个标准时间，因为时间和工序，机型，头数，长度（比如台板）等等都有关，目前只能先记录下所有耗时时间。后面再考虑设计如何反映效率。-->
                <!--<el-table-column-->
                <!--align="center"-->
                <!--prop="productivity"-->
                <!--label="效率">-->
                <!--</el-table-column>-->
            </el-table>
            <div class="block" style="text-align: center; margin-top: 20px">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </el-col>
    </div>
</template>

<script>
    var _this;

    export default {
        name: "machine_production_report",
        data() {
            _this = this;
            return {
                getWorkTaskUrl:HOST + "task/list",
                onSearchDetailDataUrl:HOST + "/task/record/searchTaskRecordDetail",
                workTaskList:[],
                filters: {
                    taskName: '',
                    orderNum: '',
                    selectDate: '',
                    nameplate:'',
                },
                tableData: [],
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                loadingUI: false,

                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        methods: {

            getWorkTask() {
                $.ajax({
                    url: _this.getWorkTaskUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            if(res.data.list.length>0)
                            {
                                _this.workTaskList=[];
                                res.data.list.forEach(item=>{
                                    _this.workTaskList.push({
                                        id:item.id,
                                        taskName:item.taskName,
                                    })
                                });
                            }
                        }
                    }
                })
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                sums[0]='合计';
                sums[1]='总数：';
                sums[2]=_this.totalRecords;
                return sums;
            },
            handleCurrentChange(val) {
                _this.currentPage = val;
                _this.onSearchDetailData();
            },
            search() {
                _this.currentPage = 1;
                _this.onSearchDetailData();
            },
            onSearchDetailData() {
                var condition = {
                    taskName: _this.filters.taskName.trim(),
                    machineOrderNumber: _this.filters.orderNum.trim(),
                    queryStartTime: '',
                    queryFinishTime: '',
                    is_fuzzy: true,
                    nameplate:_this.filters.nameplate.trim(),
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: _this.onSearchDetailDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.totalRecords = res.data.total;
                            _this.tableData = res.data.list;
                            _this.startRow = res.data.startRow;
                        }
                        for (let i=0;i<_this.tableData.length;i++){
                            if (_this.tableData[i].installEndTime) {
                                let st = _this.tableData[i].installEndTime - _this.tableData[i].installBeginTime;
                                let time = parseFloat(st) / 1000;
                                if (time) {
                                    if (time > 60 && time < 60 * 60) {
                                        _this.tableData[i].spendTime = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                                            parseInt(time / 60.0)) * 60) + "秒";
                                    } else if (time >= 60 * 60) {
                                        _this.tableData[i].spendTime = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                                            parseInt(time / 3600.0)) * 60) + "分钟" +
                                            parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                                                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                                    } else {
                                        _this.tableData[i].spendTime = parseInt(time) + "秒";
                                    }
                                }
                            }
                        }
                        _this.loadingUI = false;
                    }
                })
            },
            processMachineExport() {
            },
        },

        filters: {

            filterDateString(strDate) {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd hh:mm:ss");
            },
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.getWorkTask();
        },
        mounted: function () {
            _this.search();
        },
    }
</script>

<style scoped>

</style>
