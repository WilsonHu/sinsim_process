<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-main>
        <el-tabs type="border-card">
            <el-tab-pane label="已计划">
                <el-form :model="filters" label-position="right" label-width="80px" >
                    <el-row >
                        <el-col :span="4" >
                            <el-form-item label="合同号:" >
                                <el-input v-model="filters.contractNum"
                                          placeholder="合同号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="需求单号:" >
                                <el-input v-model="filters.orderNum"
                                          placeholder="需求单号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机器编号:" >
                                <el-input v-model="filters.machineId"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="安装状态:" >
                                <el-select v-model="filters.status" clearable >
                                    <el-option
                                            v-for="item in machineStatusList"
                                            v-bind:value="item.value"
                                            v-bind:label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="1" :offset="3">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="search" >查询
                            </el-button >
                        </el-col >
                    </el-row >
                    <el-row>
                        <el-col :span="3" >
                            <el-form-item label="选择日期:" >
                                <el-date-picker
                                        v-model="filters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        clearable
                                        range-separator="—"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions" >
                                </el-date-picker >
                            </el-form-item >
                        </el-col >
                    </el-row>
                </el-form >
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableData"
                        border
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; " >
                    <el-table-column
                            align="center"
                            width="75"
                            label="序号" >
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="订单号"
                            prop="orderNum" >
                        <template scope="scope" >
                            <div v-on:click="onDetail(scope.row)"
                                 style="font-weight: bold;">
                                {{scope.row.orderNum}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="machineId"
                            label="机器编号" >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="machineType"
                            label="机型" >
                        <template scope="scope" >
                            <div >
                                {{scope.row.machineType|filterMachineType}}
                            </div >
                        </template >
                    </el-table-column >

                    <el-table-column
                            align="center"
                            prop="status"
                            label="状态" >
                        <template scope="scope" >
                            <div >
                                {{scope.row.status|filterMachineStatus}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="contractShipDate"
                            label="合同交货日期" >
                        <template slot-scope="scope" >
                    <span >
                        {{(scope.row.contractShipDate)|filterDateString}}
                    </span >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="planShipDate"
                            label="计划交货日期" >
                        <template slot-scope="scope" >
                    <span >
                        {{(scope.row.planShipDate)|filterDateString}}
                    </span >
                        </template >

                    </el-table-column >
                </el-table >
                <div class="block" style="text-align: center; margin-top: 20px" >
                    <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, pager, next, jumper"
                            :total="totalNum" >
                    </el-pagination >
                </div >
            </el-tab-pane>
            <el-tab-pane label="待计划">
                <el-form :model="filters" label-position="right" label-width="80px" >
                    <el-row >
                        <el-col :span="4">
                            <el-form-item label="需求单号:" >
                                <el-input v-model="filters.orderNum"
                                          placeholder="需求单号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机器编号:" >
                                <el-input v-model="filters.machineId"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机型:" >
                                <el-select v-model="filters.machineType" clearable >
                                    <el-option
                                            v-for="item in allMachineType"
                                            :value="item.id"
                                            :label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机器状态:" >
                                <el-select v-model="filters.status" clearable >
                                    <el-option
                                            v-for="item in machineStatusList"
                                            :value="item.value"
                                            :label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="1" :offset="3">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="search" >查询
                            </el-button >
                        </el-col >
                    </el-row >
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="日期类型:" >
                                <el-select v-model="filters.dateType" clearable
                                           placeholder="日期类型">
                                    <el-option
                                            v-for="item in searchDateType"
                                            :value="item.value"
                                            :label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" >
                            <el-form-item label="选择日期:" >
                                <el-date-picker
                                        v-model="filters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        clearable
                                        range-separator="—"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions" >
                                </el-date-picker >
                            </el-form-item >
                        </el-col >
                    </el-row>
                </el-form >
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableData"
                        border
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; " >
                    <el-table-column
                            align="center"
                            width="75"
                            label="序号" >
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                    </el-table-column >
                    <el-table-column label="订单号" align="center">
                        <template scope="scope"
                                  prop="orderNum">
                            <div
                                 style="font-weight: bold;">
                                {{scope.row.orderNum}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="machineId"
                            label="机器编号" >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            scope="scope"
                            label="已计划 / 总工序" >
                        <template scope="scope" >
                            <span>{{scope.row.planedTaskNum}}/{{scope.row.totalTaskNum}}</span>
                        </template>

                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="machineType"
                            label="机型" >
                        <template scope="scope" >
                            <div >
                                {{scope.row.machineType|filterMachineType}}
                            </div >
                        </template >
                    </el-table-column >

                    <el-table-column
                            align="center"
                            prop="status"
                            label="机器状态" >
                        <template scope="scope" >
                            <div >
                                {{scope.row.status|filterMachineStatus}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="contractShipDate"
                            label="合同交货日期" >
                        <template slot-scope="scope" >
                            <span >
                                {{(scope.row.contractShipDate)|filterDateString}}
                            </span >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            prop="planShipDate"
                            label="计划交货日期" >
                        <template slot-scope="scope" >
                            <span >
                                {{(scope.row.planShipDate)|filterDateString}}
                            </span >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="操作" width="100" >
                        <template scope="scope" >
                            <el-button
                                    size="small"
                                    type="primary"
                                    @click="doPlan(scope.row)" >计划
                            </el-button >
                        </template >
                    </el-table-column >
                </el-table >
                <div class="block" style="text-align: center; margin-top: 20px" >
                    <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalNum" >
                    </el-pagination >
                </div >
            </el-tab-pane>
        </el-tabs>
    </el-main >
</template >

<script >
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    export default {
        name: "plan",
        components: {},
        data () {
            _this = this;
            return {
                errorMsg: '',
                totalNum: 0,
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                //机器类型
                allMachineType:[],

                formLabelWidth: '100px',
                filters: {
                    orderNum:'',
                    machineId:'',
                    status: '',
                    machineType: "",
                    selectDate: '',
                    dateType:""
                },
                allRoles: [],
                loadingUI: false,

                machineStatusList : MachineStatusList,
                searchDateType : SearchDateType,

                pickerOptions: {
                    shortcuts: [{
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
                }
            }

        },
        methods: {

            doPlan(machineItem) {

            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchNotPlanedData();
            },
            search() {
                this.onSearchNotPlanedData();
            },
            onSearchNotPlanedData(){
                var condition = {
                    id: _this.filters.id,
                    orderNum: _this.filters.orderNum,
                    machineType: _this.filters.machineType,
                    machineId: _this.filters.machineId,
                    status: _this.filters.status,
                    dateType: _this.filters.dateType,
                    query_start_time: '',
                    query_finish_time: '',
                    page:this.currentPage,
                    size:this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.query_start_time = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "machine/selectPlanningMachines",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableData = data.data.list;
                            _this.totalNum = data.data.total;
                            _this.startRow = data.data.startRow;
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            initAllRoles() {
                $.ajax({
                    url: HOST + "role/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                        }
                    }
                })
            },

            initMachineType() {
                _this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: HOST + "machine/type/list",
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                sessionStorage.setItem('allMachineType', JSON.stringify(res.data.list));
                            }
                        }
                    })
                }
            }
        },
        computed: {},
        filters: {

            filterDateString(strDate){
                if(strDate == null) {
                    return ""
                }else {
                    var resDate = new Date(strDate);
                    return resDate.format("yyyy-MM-dd");
                }
            },

            filterMachineStatus(id){
                var result = _this.machineStatusList[0].name;
                for (var i = 0; i < _this.machineStatusList.length; i++) {
                    if (id == _this.machineStatusList[i].value) {
                        result = _this.machineStatusList[i].name;
                        break;
                    }
                }
                return result;
            },

            filterMachineType(id) {
                var result = '';
                for (var i = 0; i < _this.allMachineType.length; i++) {
                    if (id == _this.allMachineType[i].id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            }
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            _this.initMachineType();
            _this.onSearchNotPlanedData();

        },
        mounted: function () {

        }
    }

</script >
<style >

</style >