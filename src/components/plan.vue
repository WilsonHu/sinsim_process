<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-main>
        <el-tabs type="border-card">
            <el-tab-pane label="已计划">
                <el-form :model="filters" label-position="right" label-width="80px" >
                    <el-row >
                        <el-col :span="4">
                            <el-form-item label="需求单号:" >
                                <el-input v-model="planedFilters.orderNum"
                                          placeholder="需求单号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" >
                            <el-form-item label="机器编号:" >
                                <el-input v-model="planedFilters.machineStrId"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" >
                            <el-form-item label="机型:" >
                                <el-select v-model="planedFilters.machineType" clearable filterable>
                                    <el-option
                                            v-for="item in allMachineType"
                                            :value="item.id"
                                            :label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4">
                            <el-form-item label="工序:" >
                                <el-select v-model="planedFilters.taskName" clearable filterable>
                                    <el-option
                                            v-for="item in allTasks"
                                            :value="item.taskName"
                                            :label="item.taskName" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="3">
                            <el-form-item label="完成状态:" >
                                <el-select v-model="planedFilters.installStatus" clearable >
                                    <el-option
                                            v-for="item in installStatusList"
                                            :value="item.value"
                                            :label="item.name" >
                                    </el-option >
                                </el-select >
                            </el-form-item >
                        </el-col >
                        <el-col :span="1" :offset="1">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="searchPlaned" >查询
                            </el-button >
                        </el-col >
                        <el-col :span="1" :offset="1">
                            <el-button
                                    icon="el-icon-share"
                                    size="normal"
                                    type="danger"
                                    @click="exportData" >导出
                            </el-button >
                        </el-col >
                    </el-row >
                    <el-row>
                        <el-col :span="3" >
                            <el-form-item label="统计周期:" >
                                <el-date-picker
                                        v-model="planedFilters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        clearable
                                        range-separator="—"
                                        start-placeholder="开始日期（计划）"
                                        end-placeholder="结束日期（计划）"
                                        :picker-options="pickerOptions" >
                                </el-date-picker >
                            </el-form-item >
                        </el-col >
                    </el-row>
                </el-form >
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableDataPlaned"
                        border
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; " >
                    <el-table-column
                            align="center"
                            width="75"
                            label="序号" >
                        <template scope="scope" >
                            {{scope.$index+startRowPlaned}}
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="需求单号">
                        <template scope="scope" >
                                {{scope.row.machineOrder.orderNum}}
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="机器编号" >
                        <template scope="scope" >
                                {{scope.row.machine.machineStrId}}
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="机型" >
                        <template scope="scope" >
                            <div >
                                {{scope.row.machine.machineType|filterMachineType}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="工序" >
                        <template scope="scope" >
                            <div style="font-weight: bold;color: #409EFF">
                                {{scope.row.taskName}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="状态" >
                        <template scope="scope" >
                            <div :class="scope.row.status|filterTaskInstallStatusStyle">
                                {{scope.row.status | filterTaskStatus}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="安装" >
                        <el-table-column
                                align="center"
                                prop="installBeginTime"
                                label="开始时间" >

                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="installEndTime"
                                label="结束时间" >

                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="质检" >
                        <el-table-column
                                align="center"
                                prop="qualityBeginTime"
                                label="开始时间" >

                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="qualityEndTime"
                                label="结束时间" >

                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="计划完成时间" >
                        <template scope="scope" >
                            <div style="color: #E6A23C">
                                {{scope.row.taskPlan.planTime | filterDateString}}
                            </div >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="合同交货日期" >
                        <template slot-scope="scope" >
                    <span >
                        {{(scope.row.machineOrder.contractShipDate)|filterDateString}}
                    </span >
                        </template >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="计划交货日期" >
                        <template slot-scope="scope" >
                    <span >
                        {{(scope.row.machineOrder.planShipDate)|filterDateString}}
                    </span >
                        </template >

                    </el-table-column >
                </el-table >
                <div class="block" style="text-align: center; margin-top: 20px" >
                    <el-pagination
                            background
                            @current-change="handleCurrentChangePlaned"
                            :current-page="currentPagePlaned"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="totalNumPlaned" >
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
                                <el-input v-model="filters.machineStrId"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input >
                            </el-form-item >
                        </el-col >
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机型:" >
                                <el-select v-model="filters.machineType" clearable filterable>
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
                        <el-col :span="4">
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
                    <el-table-column label="需求单号" align="center">
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
                            prop="machineStrId"
                            label="机器编号" >
                    </el-table-column >
                    <el-table-column
                            align="center"
                            scope="scope"
                            label="已计划 / 总工序" >
                        <template scope="scope" >
                            <el-button style="font-size: 14px; font-weight: bold" type="primary" size="mini">{{scope.row.planedTaskNum}} / {{scope.row.totalTaskNum}}</el-button>
                        </template>
                    </el-table-column >
                    <el-table-column
                            align="center"
                            label="已计划工序状态" >
                            <el-table-column
                                    align="center"
                                    scope="scope"
                                    label="初始状态" >
                                <template scope="scope" >
                                    <el-tag type="danger" style="font-weight: bold">{{scope.row.initialTaskNum}}</el-tag>
                                </template>
                            </el-table-column >
                            <el-table-column
                                    align="center"
                                    scope="scope"
                                    label="安装" >
                                <template scope="scope" >
                                    <el-tag type="warning" style="font-weight: bold">{{scope.row.installingTaskNum}}</el-tag>
                                    <el-tag type="success" style="font-weight: bold">{{scope.row.installedTaskNum}}</el-tag>
                                    <el-tag type="danger" style="font-weight: bold">{{scope.row.installAbnormalTaskNum}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    scope="scope"
                                    label="质检" >
                                <template scope="scope" >
                                    <el-tag type="warning" style="font-weight: bold" v-popover:popover1>{{scope.row.qualityDoingTaskNum}}</el-tag>
                                    <el-tag type="success" style="font-weight: bold">{{scope.row.qualityDoneTaskNum}}</el-tag>
                                    <el-tag type="danger" style="font-weight: bold">{{scope.row.qualityAbnormalTaskNum}}</el-tag>
                                </template>
                            </el-table-column>
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
                                    icon="el-icon-tickets"
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
        <el-dialog :visible.sync="doPlaningDialogVisible" fullscreen append-to-body>
            <el-form :model="machineDoPlaning" label-position="right" label-width="110px" >
                <el-row >
                    <el-col :span="4">
                        <el-form-item label="需求单号:" >
                            <el-input v-model="machineDoPlaning.orderNum"
                                      placeholder="需求单号"
                                      auto-complete="off"
                                      disabled></el-input >
                        </el-form-item >
                    </el-col >
                    <el-col :span="4" >
                        <el-form-item label="机器编号:" >
                            <el-input v-model="machineDoPlaning.machineStrId"
                                      placeholder="机器编号"
                                      auto-complete="off"
                                      disabled></el-input >
                        </el-form-item >
                    </el-col >
                    <el-col :span="4" >
                        <el-form-item label="机型:" >
                            <el-select v-model="machineDoPlaning.machineType" disabled >
                                <el-option
                                        v-for="item in allMachineType"
                                        :value="item.id"
                                        :label="item.name" >
                                </el-option >
                            </el-select >
                        </el-form-item >
                    </el-col >
                    <el-col :span="4" :offset="1">
                        <el-form-item label="合同交货时间:" >
                            <span style="font-size: 15px" >{{machineDoPlaning.contractShipDate | filterDateString}}</span >
                        </el-form-item >
                    </el-col >
                    <el-col :span="4" :offset="1">
                        <el-form-item label="计划交货时间:" >
                            <span style="font-size: 15px" >{{machineDoPlaning.planShipDate | filterDateString}}</span >
                        </el-form-item >
                    </el-col >
                </el-row >
            </el-form >
            <el-row style="margin-top: 10px">
                <el-row>
                    <el-col :span="6" :style="getProcessViewHeight()" style="margin-left: 25px;border-radius: 5px;
                                          border: solid 1px; border-color:#DCDFE6; background-color: white;"></el-col>

                    <el-col :span="16" :offset="1" >
                        <el-row class="well">
                            <el-row>
                                <el-col :span="6">
                                    <el-form :model="planForm" label-position="right" label-width="100px" >
                                        <el-row>
                                            <el-form-item label="计划方式：">
                                                <el-select v-model="planForm.planType">
                                                    <el-option
                                                            v-for="item in planTypeArray"
                                                            :value="item.value"
                                                            :label="item.name" >
                                                    </el-option >
                                                </el-select >
                                            </el-form-item>
                                        </el-row>
                                    </el-form>
                                </el-col>
                                <el-col :span="6" style="margin-left: 15px">
                                    <el-form :model="planForm" label-position="right" label-width="100px" >
                                        <el-row>
                                            <el-form-item :label="planForm.planType == 1 ? '完成日期：' : '截止日期：' ">
                                                <el-date-picker
                                                        v-model="planForm.planDate"
                                                        align="right"
                                                        type="date"
                                                        placeholder="选择日期"
                                                        :picker-options="pickerOptions1">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-row>
                                    </el-form>
                                </el-col >
                            </el-row>
                            <el-row>
                                <el-transfer
                                        style="margin-left: 25px; margin-top: 10px"
                                        v-model="toPlanTasks"
                                        :titles="['未计划工序', '添加计划中']"
                                        :data="generateTasks()">
                                </el-transfer>
                            </el-row>
                        </el-row>
                        <el-row style="margin-top: 10px">
                            <el-col :span="4" :offset="20">
                                <el-button @click="doPlaningDialogVisible = false" icon="el-icon-back" >取 消</el-button >
                                <el-button type="primary" @click="addTaskPlans" icon="el-icon-check" :disabled="toPlanTasks.length <= 0">确 定</el-button >
                            </el-col>
                        </el-row >
                    </el-col>
                </el-row>
            </el-row>
        </el-dialog >
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
                userInfo:"",
                errorMsg: '',
                //未计划
                totalNum: 0,
                //已计划
                totalNumPlaned: 0,
                //未计划table数据（机器）
                tableData: [],
                //已计划table数据（工序）
                tableDataPlaned: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                //未计划
                startRow:0,
                currentPage: 1,
                //已计划
                currentPagePlaned: 1,
                startRowPlaned: 0,
                //机器类型
                allMachineType:[],
                //所有工序名称
                allTasks:[],

                pageHeight: 0,

                formLabelWidth: '100px',
                //已计划
                planedFilters: {
                    orderNum:'',
                    machineStrId:'',
                    taskName:"",
                    installStatus: '',
                    machineType: "",
                    selectDate: [new Date(), new Date()],
                },
                installStatusList: [{name:"完成",value:1},{name:"未完成",value:2}],

                filters: {
                    orderNum:'',
                    machineStrId:'',
                    status: '',
                    machineType: "",
                    selectDate: '',
                    dateType:""
                },
                allRoles: [],
                loadingUI: false,

                machineStatusList : MachineStatusList,
                taskStatusList:TaskStatusList,
                searchDateType : SearchDateType,
                planForm:{
                    planType: 1,
                    planDate: new Date()
                },
                doPlaningDialogVisible:false,
                machineDoPlaning:{},
                notPlanedTasks:[],
                toPlanTasks:[],

                planTypeArray:[
                    {
                        name:"日计划",value:1
                    },
                    {
                        name:"弹性计划",value:2
                    }
                ],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },

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
                },
            }

        },
        methods: {
            exportData() {
                showMessage(_this, "暂无实现！", 0);
            },
            generateTasks() {
                const data = [];
                this.notPlanedTasks.forEach((task, index) => {
                    data.push({
                        label: task.taskName,
                        key: task.id,
                    });
                });
                return data;
            },

            getProcessViewHeight() {
                if(this.pageHeight == 0) {
                    return "height: 500px";
                }else {
                    return "height:" + this.pageHeight + "px";
                }
            },
            getInitialTaskNum(task) {
                if(task != null) {
                    var num = task.planedTaskNum - task.installingTaskNum - task.installedTaskNum
                                - task.qualityDoingTaskNum - task.qualityDoneTaskNum - task.installAbnormalTaskNum - task.qualityAbnormalTaskNum;
                    if(num >=0) {
                        return num;
                    }else {
                        return "";
                    }
                }else {
                    return "";
                }
            },

            doPlan(planItem) {
                //这里215是估计值
                this.pageHeight = document.documentElement.scrollHeight - 215;
                this.doPlaningDialogVisible = true;
                this.machineDoPlaning = copyObjectByJSON(planItem);
                $.ajax({
                    url: HOST + "task/record/selectNotPlanedTaskRecord",
                    type: 'POST',
                    dataType: 'json',
                    data: {processRecordID:planItem.processRecordID},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.notPlanedTasks = data.data.list;
                            _this.originalNotPlanedTasks = copyObjectByJSON(_this.notPlanedTasks);//用于保存弹性计划下，直接使用的数据
                        }
                    }
                })

            },
            addTaskPlans() {

                let addedTasks = [];
                if(this.planForm.planType == 1) {
                    //日计划,保存task_record的ID值
                    addedTasks = this.toPlanTasks;
                }else if(this.planForm.planType == 2) {
                    for(let i=0; i<this.notPlanedTasks.length; i++) {
                        addedTasks.push(this.notPlanedTasks[i].id);
                    }
                }else {
                    showMessage(this,"获取计划方式失败！", 0);
                }
                if(addedTasks.length == 0) {
                    showMessage(this,"添加计划工序为空！", 0)
                }else {
                    $.ajax({
                        url: HOST + "task/plan/addTaskPlans",
                        type: 'POST',
                        dataType: 'json',
                        traditional:true,
                        data: {taskRecordIds:addedTasks, planType: _this.planForm.planType, planDate:_this.planForm.planDate, userId:_this.userInfo.id},
                        success: function (data) {
                            if (data.code == 200) {
                                showMessage(_this,"添加计划成功！", 1);
                            }else {
                                showMessage(_this,data.message, 0);
                            }
                        }
                    })
                }
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchPlanningData();
            },
            handleCurrentChangePlaned(val) {
                this.currentPagePlaned = val;
                this.onSearchPlanedData();
            },
            search() {
                this.onSearchPlanningData();
            },
            searchPlaned() {
                this.onSearchPlanedData();
            },
            onSearchPlanningData(){
                var condition = {
                    orderNum: _this.filters.orderNum,
                    machineType: _this.filters.machineType,
                    machineStrId: _this.filters.machineStrId,
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
                    },
                    error: function (data) {
                        showMessage(_this, data.message, 0);
                    }
                })
            },

            onSearchPlanedData() {
                var condition = {
                    orderNum: _this.planedFilters.orderNum,
                    machineType: _this.planedFilters.machineType,
                    machineStrId: _this.planedFilters.machineStrId,
                    installStatus: _this.planedFilters.installStatus,
                    taskName: _this.planedFilters.taskName,
                    query_start_time: '',
                    query_finish_time: '',
                    page:this.currentPagePlaned,
                    size:this.pageSize
                };
                if (_this.planedFilters.selectDate != null && _this.planedFilters.selectDate.length > 0) {
                    condition.query_start_time = _this.planedFilters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.planedFilters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "task/record/selectPlanedTaskRecords",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableDataPlaned = data.data.list;
                            _this.totalNumPlaned = data.data.total;
                            _this.startRowPlaned = data.data.startRow;
                        }else {
                            showMessage(_this,"获取已计划工序失败！", 0);
                        }
                        _this.loadingUI = false;
                    },
                    error: function (data) {
                        showMessage(_this, data.message, 0);
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
            },

            initAllTasks() {
                $.ajax({
                    url: HOST + "task/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allTasks = res.data.list;
                        }else {
                            showMessage(_this,res.message, 0);
                        }
                    },
                    error:function (res) {
                        showMessage(_this,"获取服务器数据失败！", 0);
                    }
                })
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
            },
            filterTaskInstallStatusStyle(status){
                let style = "";
                switch (status) {
                    case 0:
                        style = "divTaskStatusInitial";
                        break;
                    case 1:
                        style = "divTaskStatusInstalling";
                        break;
                    case 2:
                        style = "divTaskStatusInstallFinished";
                        break;
                    case 3:
                        style = "divTaskStatusQualitying";
                        break;
                    case 4:
                        style = "divTaskStatusQualityFinished";
                        break;
                    case 5:
                    case 6:
                        style = "divTaskStatusAbnormal";
                        break;
                    default:
                        style = "divTaskStatusInitial";
                }
                return style;
            },
            filterTaskStatus(status) {
                let result = "";
                for (let i=0; i< _this.taskStatusList.length; i++) {
                    if(status == _this.taskStatusList[i].value){
                        result = _this.taskStatusList[i].name;
                        break;
                    }
                }
                return result;
            }
        },
        created: function () {
            this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userInfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            this.initAllRoles();
            this.initMachineType();
            this.initAllTasks();
            this.onSearchPlanningData();
            this.onSearchPlanedData();
        },
        mounted: function () {

        }
    }

</script >
<style >
    .el-transfer-panel{
        width: 270px;
    }
    .el-transfer-panel__body{
        height:550px
    }
    .el-transfer-panel__list{
        height:550px
    }

    .divTaskStatusInitial {
        color: #909399;
    }

    .divTaskStatusInstalling {
        color: yellowgreen;

    }

    .divTaskStatusInstallFinished {
        color: #67C23A;
    }

    .divTaskStatusQualitying {
        color: #E6A23C;
    }

    .divTaskStatusQualityFinished {
        color: green;
    }

    .divTaskStatusAbnormal {
        color: #F56C6C;
    }
</style >