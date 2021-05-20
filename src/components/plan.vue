<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-main>
        <el-tabs type="border-card">
            <el-tab-pane label="已计划">
                <el-form :model="filters" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="订单号:">
                                <el-input v-model="planedFilters.orderNum"
                                          placeholder="订单号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="机器编号:">
                                <el-input v-model="planedFilters.nameplate"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="机型:">
                                <el-select v-model="planedFilters.machineType" clearable filterable>
                                    <el-option
                                            v-for="item in allMachineType"
                                            :value="item.id"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="工序:">
                                <el-select v-model="planedFilters.taskName" clearable filterable>
                                    <el-option
                                            v-for="item in allTasks"
                                            :value="item.taskName"
                                            :label="item.taskName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="完成状态:">
                                <el-select v-model="planedFilters.installStatus" clearable>
                                    <el-option
                                            v-for="item in installStatusList"
                                            :value="item.value"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" :offset="1">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="onSearchPlanedData">查询
                            </el-button>
                        </el-col>
                        <el-col :span="1" :offset="1">
                            <el-button
                                    icon="el-icon-share"
                                    size="normal"
                                    type="danger"
                                    @click="exportData">导出
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="统计周期:">
                                <el-date-picker
                                        v-model="planedFilters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        clearable
                                        range-separator="—"
                                        start-placeholder="开始日期（计划）"
                                        end-placeholder="结束日期（计划）"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableDataPlaned"
                        border
                        highlight-current-row
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; ">
                    <el-table-column
                            align="center"
                            width="75"
                            label="序号">
                        <template scope="scope">
                            {{scope.$index+startRowPlaned}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            mini-width="200"
                            label="订单号">
                        <template scope="scope">
                            {{scope.row.machineOrder.orderNum}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="机器编号">
                        <template scope="scope">
                            {{scope.row.machine.nameplate}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="机型">
                        <template scope="scope">
                            <div>
                                {{scope.row.machine.machineType|filterMachineType}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="工序">
                        <template scope="scope">
                            <div style="font-weight: bold;color: #409EFF">
                                {{scope.row.taskName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="计划工时">
                        <template scope="scope">
                            <div style="font-weight: bold;color: #409EFF">
                                {{scope.row.planTimespan}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="状态">
                        <template scope="scope">
                            <div :class="scope.row.status|filterTaskInstallStatusStyle">
                                {{scope.row.status | filterTaskStatus}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="安装">
                        <el-table-column
                                align="center"
                                width="100"
                                label="开始时间">
                            <template scope="scope">
                                <div>
                                    {{scope.row.installBeginTime | filterDateTimeString}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                width="100"
                                label="结束时间">
                            <template scope="scope">
                                <div>
                                    {{scope.row.installEndTime | filterDateTimeString}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="质检">
                        <el-table-column
                                align="center"
                                width="100"
                                label="开始时间">
                            <template scope="scope">
                                <div>
                                    {{scope.row.qualityBeginTime | filterDateTimeString}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                width="100"
                                label="结束时间">
                            <template scope="scope">
                                <div>
                                    {{scope.row.qualityEndTime | filterDateTimeString}}
                                </div>
                            </template>

                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="计划完成时间">
                        <template scope="scope">
                            <div style="color: #E6A23C">
                                {{scope.row.taskPlan.planTime | filterDateString}}
                            </div>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--align="center"-->
                            <!--label="合同交货日期">-->
                        <!--<template slot-scope="scope">-->
                    <!--<span>-->
                        <!--{{(scope.row.machineOrder.contractShipDate)|filterDateString}}-->
                    <!--</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            align="center"
                            label="计划交货日期">
                        <template slot-scope="scope">
                    <span>
                        {{(scope.row.machineOrder.planShipDate)|filterDateString}}
                    </span>
                        </template>

                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作" width="120">
                        <template scope="scope">
                            <el-tooltip placement="top">
                                <div slot="content">删除计划</div>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        v-show="scope.row.status == 1 || scope.row.status == 2"
                                        icon="el-icon-delete"
                                        @click="toDeletePlanConfirm(scope.row)">
                                </el-button>
                            </el-tooltip><el-tooltip placement="top">
                            <div slot="content">修改日期</div>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    v-show="scope.row.status == 1 || scope.row.status == 2"
                                    icon="el-icon-edit"
                                    @click="editWithItem(scope.row)">
                            </el-button>
                        </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="text-align: center; margin-top: 20px">
                    <el-pagination
                            background
                            @current-change="handleCurrentChangePlaned"
                            :current-page="currentPagePlaned"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="totalNumPlaned">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="待计划">
                <el-form :model="filters" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="订单号:">
                                <el-input v-model="filters.orderNum"
                                          placeholder="订单号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机器编号:">
                                <el-input v-model="filters.nameplate"
                                          placeholder="机器编号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机型:">
                                <el-select v-model="filters.machineType" clearable filterable>
                                    <el-option
                                            v-for="item in allMachineType"
                                            :value="item.id"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-form-item label="机器状态:">
                                <el-select v-model="filters.status" clearable>
                                    <el-option
                                            v-for="item in machineStatusList"
                                            :value="item.value"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" :offset="3">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="onSearchPlanningData">查询
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="日期类型:">
                                <el-select v-model="filters.dateType" clearable
                                           placeholder="日期类型">
                                    <el-option
                                            v-for="item in searchDateType"
                                            :value="item.value"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="选择日期:">
                                <el-date-picker
                                        v-model="filters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        clearable
                                        range-separator="—"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableData"
                        border
                        highlight-current-row
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; ">
                    <el-table-column
                            align="center"
                            width="75"
                            label="序号">
                        <template scope="scope">
                            {{scope.$index+startRow}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单号" align="center">
                        <template scope="scope"
                                  prop="orderNum">
                            <div
                                    style="font-weight: bold;">
                                {{scope.row.orderNum}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="nameplate"
                            label="机器号(标红加急)">
                        <template scope="scope"
                                  prop="orderNum">
                            <div v-if="scope.row.isUrgent==1" style="background-color: red">
                                {{scope.row.nameplate}}
                            </div>
                            <div v-else>
                                {{scope.row.nameplate}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            scope="scope"
                            label="已计划 / 总工序">
                        <template scope="scope">
                            <el-button style="font-size: 14px; font-weight: bold" type="primary" size="mini">
                                {{scope.row.planedTaskNum}} / {{scope.row.totalTaskNum}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="已计划工序状态">
                        <el-table-column
                                align="center"
                                scope="scope"
                                label="待安装">
                            <template scope="scope">
                                <el-tag type="danger" style="font-weight: bold">{{scope.row.installWaitingTaskNum}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                scope="scope"
                                label="安装">
                            <template scope="scope">
                                <el-tag type="warning" style="font-weight: bold">{{scope.row.installingTaskNum}}
                                </el-tag>
                                <el-tag type="success" style="font-weight: bold">{{scope.row.installedTaskNum}}</el-tag>
                                <el-tag type="danger" style="font-weight: bold">{{scope.row.installAbnormalTaskNum}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                scope="scope"
                                label="质检">
                            <template scope="scope">
                                <el-tag type="warning" style="font-weight: bold">{{scope.row.qualityDoingTaskNum}}
                                </el-tag>
                                <el-tag type="success" style="font-weight: bold">{{scope.row.qualityDoneTaskNum}}
                                </el-tag>
                                <el-tag type="danger" style="font-weight: bold">{{scope.row.qualityAbnormalTaskNum}}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="machineType"
                            label="机型">
                        <template scope="scope">
                            <div>
                                {{scope.row.machineType|filterMachineType}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            prop="status"
                            label="机器状态">
                        <template scope="scope">
                            <div>
                                {{scope.row.status|filterMachineStatus}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="contractShipDate"
                            label="合同交货日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.contractShipDate)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="planShipDate"
                            label="计划交货日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.planShipDate)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作" width="60">
                        <template scope="scope">
                            <el-tooltip placement="top">
                                <div slot="content">设置计划</div>
                                <el-button
                                        size="mini"
                                        type="success"
                                        icon="el-icon-setting"
                                        @click="doPlan(scope.row)">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="text-align: center; margin-top: 20px">
                    <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalNum">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="提示" :visible.sync="deletePlanDialogVisible" width="25%">
            <span style="font-size: 16px">确认要删除作业计划[ <b>{{deleteData.taskName}}</b> ]？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deletePlanDialogVisible = false" icon="el-icon-close">取 消</el-button>
            <el-button type="primary" @click="deletePlan()" icon="el-icon-check">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="doPlaningDialogVisible" fullscreen append-to-body>
            <el-form :model="machineDoPlaning" label-position="right" label-width="110px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="订单号:">
                            <el-input v-model="machineDoPlaning.orderNum"
                                      placeholder="订单号"
                                      auto-complete="off"
                                      disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="机器编号:">
                            <el-input v-model="machineDoPlaning.nameplate"
                                      placeholder=""
                                      auto-complete="off"
                                      disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="机型:">
                            <el-select v-model="machineDoPlaning.machineType" disabled>
                                <el-option
                                        v-for="item in allMachineType"
                                        :value="item.id"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-form-item label="合同交货时间:">
                            <span style="font-size: 15px">{{machineDoPlaning.contractShipDate | filterDateString}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-form-item label="计划交货时间:">
                            <span style="font-size: 15px">{{machineDoPlaning.planShipDate | filterDateString}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form><el-form :model="machineDoPlaning" label-position="right" label-width="100px">
            <el-row>

                <el-col :span="3" :offset="0">
                    <el-form-item label="头数:">
                        <span style="font-size: 15px">{{machineDoPlaning.headNum }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="3" :offset="0">
                    <el-form-item label="针数:">
                        <span style="font-size: 15px">{{machineDoPlaning.needleNum }}</span>
                    </el-form-item>
                </el-col> 
            </el-row>
        </el-form>
            <el-row style="margin-top: 10px">
                <el-row>
                    <el-col :span="6" :style="getProcessViewHeight()" style="margin-left: 25px;border-radius: 5px;
                                          border: solid 1px; border-color:#DCDFE6; background-color: white;">
                        <div id="myDiagramDiv">

                        </div>
                    </el-col>

                    <el-col :span="16" :offset="1">
                        <el-row class="well">
                            <el-row>
                                <el-col :span="6">
                                    <el-form :model="planForm" label-position="right" label-width="100px">
                                        <el-row>
                                            <el-form-item label="计划方式：">
                                                <el-select v-model="planForm.planType">
                                                    <el-option
                                                            v-for="item in planTypeArray"
                                                            :value="item.value"
                                                            :label="item.name">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-row>
                                    </el-form>
                                </el-col>
                                <el-col :span="6" style="margin-left: 15px">
                                    <el-form :model="planForm" label-position="right" label-width="100px">
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
                                </el-col>
                            </el-row>
                            <el-row>
                    <el-col :span="18">
                    <el-transfer
                        style="margin-left: 25px; margin-top: 10px"
                        v-model="toPlanTasks"
                        :titles="['未计划工序', '添加计划中']"
                        :data="generateTasks()"
                    ></el-transfer>
                    </el-col>
              </el-row>
            </el-row>
                        <el-row style="margin-top: 10px">
                            <el-col :span="6" :offset="18">
                                <el-button @click="doPlaningDialogVisible = false" icon="el-icon-back">取 消</el-button>
                                <el-button type="primary" @click="addTaskPlans" icon="el-icon-check"
                                           :disabled="toPlanTasks.length <= 0">确 定
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-row>
        </el-dialog>

        <el-dialog title="修改计划日期" :visible.sync="modifyDialogVisible" append-to-body width="70%">
            <el-form :model="modifyForm" >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="机器铭牌号：" :label-width="formLabelWidth">
                            <!--<el-input v-model="modifyForm.machine.nameplate"  disabled >-->
                            <!--</el-input>-->
                            <el-input type="text"
                                      v-model="modifyForm.machine.nameplate"
                                      style="width:100%"
                                      disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序：" :label-width="formLabelWidth">
                            <el-input v-model="modifyForm.taskName"  disabled >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="日期：" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="modifyForm.taskPlan.planTime"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form >
            <span slot="footer" class="dialog-footer" style="margin-bottom: 20px; padding-top:30px;" >
                <el-button @click="modifyDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button >
                <el-button type="primary" @click="onModify" icon="el-icon-check">保 存</el-button >
            </span >

        </el-dialog >
    </el-main>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    var myDiagram;
    var taskContentArray = [];
    export default {
        name: "plan",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: "",
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
                startRow: 0,
                currentPage: 1,
                //已计划
                currentPagePlaned: 1,
                startRowPlaned: 0,
                //机器类型
                allMachineType: [],
                //所有工序名称
                allTasks: [],

                pageHeight: 0,

                formLabelWidth: '100px',
                //已计划
                planedFilters: {
                    orderNum: '',
                    nameplate: '',
                    machineStrId: '',
                    taskName: "",
                    installStatus: '',
                    machineType: "",
                    selectDate: [new Date(), new Date()],
                },
                installStatusList: [{name: "完成", value: 1}, {name: "未完成", value: 2}],

                filters: {
                    orderNum: '',
                    nameplate: '',
                    machineStrId: '',
                    status: '',
                    machineType: "",
                    selectDate: '',
                    dateType: ""
                },
                allRoles: [],
                loadingUI: false,

                machineStatusList: MachineStatusList,
                taskStatusList: TaskStatusList,
                searchDateType: SearchDateType,
                planForm: {
                    planType: 1,
                    planDate: new Date()
                },

                doPlaningDialogVisible: false,
                deletePlanDialogVisible: false,
                deleteData: "",
                machineDoPlaning: {},
                notPlanedTasks: [],
                toPlanTasks: [],

                planTypeArray: [
                    {
                        name: "日计划", value: 1
                    },
//                    {
//                        name: "弹性计划", value: 2
//                    }
                ],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < (new Date().getTime() - 24*60*60*1000);
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
                //修改
                modifyForm: {
                    id: "",
                    machine: {
                        nameplate: ""
                    },
                        taskName: "" ,
                    taskPlan:{
                        id:"",
                        taskRecordId:"",
                        planType:"",
                        planTime:"",
                        deadline:"",
                        userId:"",
                        createTime:"",
                        updateTime:""
                    }
                },
                selectedItem: {},
                modifyDialogVisible: false,
            }

        },
        methods: {
            onModify() {
                $.ajax({
                    url: HOST + "task/plan/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "taskPlan": JSON.stringify(_this.modifyForm.taskPlan)
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            _this.modifyDialogVisible = false;
                            _this.onSearchPlanedData();
                            _this.onSearchPlanningData();
                            showMessage(_this, '修改成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = data.message;
                        }
                    },
                    error: function (data) {
                        _this.errorMsg = '服务器访问出错！';
                    }
                })
            },
            exportData() {
                var condition = {
                    orderNum: _this.planedFilters.orderNum,
                    machineType: _this.planedFilters.machineType,
                    nameplate: _this.planedFilters.nameplate,
                    machineStrId: _this.planedFilters.machineStrId,
                    installStatus: _this.planedFilters.installStatus,
                    taskName: _this.planedFilters.taskName,
                    query_start_time: '',
                    query_finish_time: '',
                    page: this.currentPagePlaned,
                    size: this.pageSize
                };
                if (_this.planedFilters.selectDate != null && _this.planedFilters.selectDate.length > 0) {
                    condition.query_start_time = _this.planedFilters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.planedFilters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "task/record/export",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableDataPlaned = data.data.list;
                            _this.totalNumPlaned = data.data.total;
                            _this.startRowPlaned = data.data.startRow;
                            window.location.href = data.data;
                            showMessage(_this, "计划导出成功！", 1);

                        } else {
                            showMessage(_this, "导出计划失败！", 0);
                        }
                        _this.loadingUI = false;
                    },
                    error: function (data) {
                        showMessage(_this, data.message, 0);
                    }
                })
            },

            editWithItem(data) {
                _this.selectedItem = copyObject(data);
                _this.isError = false;
                _this.modifyForm =  copyObject(_this.selectedItem);
                this.modifyDialogVisible = true;
            },
            toDeletePlanConfirm(data) {
                this.deleteData = data;
                this.deletePlanDialogVisible = true;
            },
            deletePlan() {
                if (_this.deleteData != null && _this.deleteData.taskPlan.id > 0) {
                    $.ajax({
                        url: HOST + "task/plan/deletePlan",
                        type: 'POST',
                        dataType: 'json',
                        data: {id: _this.deleteData.taskPlan.id, taskRecordId: _this.deleteData.id},
                        success: function (data) {
                            if (data.code == 200) {
                                _this.onSearchPlanedData();
                                _this.onSearchPlanningData();
                                showMessage(_this, "删除计划成功！", 1);
                            } else {
                                showMessage(_this, "删除计划失败！", 0);
                            }
                        },
                        error: function (data) {
                            showMessage(_this, data.message, 0);
                        }
                    })
                }
                this.deletePlanDialogVisible = false;
            },
            generateTasks() {
                const data = [];
                _this.notPlanedTasks.forEach((task, index) => {
                    data.push({
                        label: task.taskName,
                        key: task.id,
                    });
                });
                return data;
    },


            getProcessViewHeight() {
                if (this.pageHeight == 0) {
                    return "height: 500px";
                } else {
                    return "height:" + this.pageHeight + "px";
                }
            },
            getAllPlanedTaskNum(task) {
                if (task != null) {
                    var num = task.planedTaskNum + task.installWaitingTaskNum + task.installingTaskNum + task.installedTaskNum
                            + task.qualityDoingTaskNum + task.qualityDoneTaskNum + task.installAbnormalTaskNum + task.qualityAbnormalTaskNum;
                    if (num >= 0) {
                        return num;
                    } else {
                        return "";
                    }
                } else {
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
                    data: {processRecordID: planItem.processRecordID},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.notPlanedTasks = data.data.list;
                            _this.originalNotPlanedTasks = copyObjectByJSON(_this.notPlanedTasks);//用于保存弹性计划下，直接使用的数据
                            _this.toPlanTasks = [];
                        }
                    }
                });

                $.ajax({
                    url: HOST + "machine/selectProcessMachine",
                    type: 'POST',
                    dataType: 'json',
                    data: {machine_strid: planItem.machineStrId},
                    success: function (data) {
                        if (data.code == 200) {
                            var taskList = copyObject(DefaultTaskList);
                            taskList.linkDataArray = JSON.parse(data.data.list[0].linkData);
                            taskList.nodeDataArray = JSON.parse(data.data.list[0].nodeData);
                            taskList.nodeDataArray.forEach(item=> {
                                if (parseInt(item.taskStatus) > 0 && parseInt(item.taskStatus) < 2)//已计划
                                {
                                    item.category = ProcessCatergory.Planed;
                                } else if (parseInt(item.taskStatus) > 1 && parseInt(item.taskStatus) < 3)//待安装
                                {
                                    item.category = ProcessCatergory.Waiting;
                                } else if (parseInt(item.taskStatus) > 2 && parseInt(item.taskStatus) < 6)//进行中
                                {
                                    item.category = ProcessCatergory.Working;
                                } else if (parseInt(item.taskStatus) == 6) {//完成
                                    item.category = ProcessCatergory.Finished;
                                }
                                else if (parseInt(item.taskStatus) > 6 && parseInt(item.taskStatus) < 9)//异常
                                {
                                    item.category = ProcessCatergory.Abnormal
                                }
                                else if (parseInt(item.taskStatus) == 9)//已跳过
                                {
                                    item.category = ProcessCatergory.Skip;
                                }
                            });
                            window.setTimeout(()=> {
                                try {
                                    init();
                                    if (taskList.linkDataArray != null && taskList.linkDataArray.length > 0) {
                                        myDiagram.model = go.Model.fromJson(JSON.stringify(taskList));
                                    }
                                } catch (ex) {
                                    showMessage(_this, "图形流程数据加载失败！", 0)
                                    console.log(ex.toString());
                                }
                            }, 200);
                        }
                    }
                });
            },

            addTaskPlans() {
                let addedTasks = [];
                if (this.planForm.planType == 1) {
                    //日计划,保存task_record的ID值
                    addedTasks = this.toPlanTasks;
                } else if (this.planForm.planType == 2) {
                    for (let i = 0; i < this.notPlanedTasks.length; i++) {
                        addedTasks.push(this.notPlanedTasks[i].id);
                    }
                } else {
                    showMessage(this, "获取计划方式失败！", 0);
                }
                if (addedTasks.length == 0) {
                    showMessage(this, "添加计划工序为空！", 0)
                } else {
                    $.ajax({
                        url: HOST + "task/plan/addTaskPlans",
                        type: 'POST',
                        dataType: 'json',
                        traditional: true,
                        data: {
                            taskRecordIds: addedTasks,
                            planType: _this.planForm.planType,
                            machineStrId: _this.machineDoPlaning.machineStrId,
                            planDate: _this.planForm.planDate,
                            userId: _this.userInfo.id
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                showMessage(_this, "添加计划成功！", 1);
                                _this.doPlaningDialogVisible = false;
                                _this.onSearchPlanningData();
                                _this.onSearchPlanedData();

                            } else {
                                showMessage(_this, data.message, 0);
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
            onSearchPlanningData(){
                var condition = {
                    orderNum: _this.filters.orderNum,
                    machineType: _this.filters.machineType,
                    nameplate: _this.filters.nameplate,
                    machineStrId: _this.filters.machineStrId,
                    status: _this.filters.status,
                    dateType: _this.filters.dateType,
                    query_start_time: '',
                    query_finish_time: '',
                    page: this.currentPage,
                    size: this.pageSize
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
                    nameplate: _this.planedFilters.nameplate,
                    machineStrId: _this.planedFilters.machineStrId,
                    installStatus: _this.planedFilters.installStatus,
                    taskName: _this.planedFilters.taskName,
                    query_start_time: '',
                    query_finish_time: '',
                    page: this.currentPagePlaned,
                    size: this.pageSize
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
                        } else {
                            showMessage(_this, "获取已计划工序失败！", 0);
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
                //_this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: HOST + "machine/type/list",
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                //sessionStorage.setItem('allMachineType', JSON.stringify(res.data.list));
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
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "获取服务器数据失败！", 0);
                    }
                })
            }
        },
        computed: {},
        filters: {

            filterDateString(strDate){
                if (strDate == null) {
                    return ""
                } else {
                    var resDate = new Date(strDate);
                    return resDate.format("yyyy-MM-dd");
                }
            },

            filterDateTimeString(strDate){
                if (strDate == null) {
                    return ""
                } else {
                    var resDate = new Date(strDate);
                    return resDate.format("yyyy-MM-dd hh:mm");
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
                for (let i = 0; i < _this.taskStatusList.length; i++) {
                    if (status == _this.taskStatusList[i].value) {
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

    function resetDiagram() {

        try {
            var objDiagram = document.getElementById("myDiagramDiv");
            if (objDiagram != null) {

                var childList = objDiagram.childNodes;
                if (childList != null && childList.length > 0) {
                    for (var i = childList.length - 1; i >= 0; i--) {
                        document.getElementById("myDiagramDiv").removeChild(childList[i]);
                    }
                }
            }
            if (myDiagram != null) {
                myDiagram.div = null;
            }
        } catch (ex) {
            console.log(ex.toString());
        }
    }
    function init() {
        resetDiagram();
        //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make;  // for conciseness in defining templates

        myDiagram =
                $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                        {
                            initialContentAlignment: go.Spot.Top,
                            allowDrop: false,  // must be true to accept drops from the Palette
                            "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                            "LinkRelinked": showLinkLabel,
                            "animationManager.duration": 100, // slightly longer than default (600ms) animation
                            "undoManager.isEnabled": true  // enable undo & redo
                        });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", function (e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        // helper definitions for node templates

        function nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Top,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function (e, obj) {
                        showPorts(obj.part, false);
                    }
                }
            ];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Circle",
                    {
                        fill: "transparent",
                        stroke: null,  // this is changed to "white" in the showPorts function
                        desiredSize: new go.Size(6, 6),
                        alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                        portId: name,  // declare this object to be a "port"
                        fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                        cursor: "pointer"  // show a different cursor to indicate potential link point
                    });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "#00A9C9", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));
        myDiagram.nodeTemplateMap.add("Working",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "green", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: "black",
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));
        myDiagram.nodeTemplateMap.add("Planed",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "#CAE1FF", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: "black",
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));
        myDiagram.nodeTemplateMap.add("Waiting",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "#66ff66", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: "black",
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));


        myDiagram.nodeTemplateMap.add("Finished",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "gray", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: lightText,
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));

        myDiagram.nodeTemplateMap.add("Abnormal",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "red", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: lightText,
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));


        myDiagram.nodeTemplateMap.add("Skip",  // Abnormal category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "orange", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: lightText,
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));


        myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                                $(go.Shape, "Circle",
                                        {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                                $(go.TextBlock, "Start",
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the top, all output only:
                        makePort("L", go.Spot.Left, true, false),
                        makePort("R", go.Spot.Right, true, false),
                        makePort("B", go.Spot.Bottom, true, false)
                ));

        myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                                $(go.Shape, "Circle",
                                        {minSize: new go.Size(48, 48), fill: "#DC3C00", stroke: null}),
                                $(go.TextBlock, "End",
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            textAlign: 'center',
                                            editable: false,
                                            isMultiline: true
                                        },
                                        new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the bottom, all input only:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, false, true),
                        makePort("R", go.Spot.Right, false, true)
                ));


        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5, toShortLength: 4,
                            relinkableFrom: true,
                            relinkableTo: true,
                            reshapable: true,
                            resegmentable: true,
                            // mouse-overs subtly highlight links:
                            mouseEnter: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                            },
                            mouseLeave: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "transparent";
                            }
                        },
                        new go.Binding("points").makeTwoWay(),
                        $(go.Shape,  // the highlight shape, normally transparent
                                {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
                        $(go.Shape,  // the link path shape
                                {isPanelMain: true, stroke: "gray", strokeWidth: 3}),
                        $(go.Shape,  // the arrowhead
                                {toArrow: "standard", stroke: null, fill: "gray"}),
                        $(go.Panel, "Auto",  // the link label, normally not visible
                                {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                                new go.Binding("visible", "visible").makeTwoWay(),
                                $(go.Shape, "RoundedRectangle",  // the label shape
                                        {fill: "#F8F8F8", stroke: null}),
                                $(go.TextBlock, "Yes",  // the label
                                        {
                                            textAlign: "center",
                                            font: "10pt helvetica, arial, sans-serif",
                                            stroke: "#333333",
                                            editable: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        )
                );

        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        // The following code overrides GoJS focus to stop the browser from scrolling
        // the page when either the Diagram or Palette are clicked or dragged onto.

        function customFocus() {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            go.Diagram.prototype.doFocus.call(this);
            window.scrollTo(x, y);
        }

        myDiagram.doFocus = customFocus;
        myDiagram.isReadOnly = true;  // Disable the diagram!
        document.getElementById("myDiagramDiv").style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + "px";
    } // end init

    // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "white" : null);
        });
    }

</script>
<style>
    .el-transfer-panel {
        width: 250px;
    }

    .el-transfer-panel__body {
        height: 420px
    }

    .el-transfer-panel__list {
        height: 420px
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
</style>