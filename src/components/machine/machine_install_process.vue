<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单号:">
                            <el-input v-model="filters.orderNum"
                                      placeholder="订单号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">-->
                    <!--<el-form-item label="合同编号:">-->
                    <!--<el-input v-model="filters.contract_num"-->
                    <!--placeholder="合同编号"-->
                    <!--auto-complete="off"></el-input>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="6">
                        <el-form-item label="完成状态:">
                            <el-select v-model="filters.status" clearable>
                                <el-option
                                        v-for="item in statusList"
                                        :value="item.value"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button
                                icon="el-icon-search"
                                size="normal"
                                type="primary"
                                @click="search">查询
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="系统编号:">
                            <el-input v-model="filters.machine_strid"
                                      placeholder="系统编号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="选择日期:">
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
                    style="width: 100%; ">
                <el-table-column
                        width="75"
                        align="center"
                        label="序号">
                    <template scope="scope">
                        {{scope.$index+startRow}}
                    </template>
                </el-table-column>
                <el-table-column label="订单号"
                                 align="center"
                                 prop="orderNum">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderNum}}
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                <!--align="center"-->
                <!--prop="contractNum"-->
                <!--label="合同号">-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        prop="machineStrId"
                        label="系统编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="nameplate"
                        label="机器编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="location"
                        label="位置">
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
                        label="已完成/总工序">
                    <template scope="scope">
                        <span style="color: limegreen;font-weight: bold;">{{scope.row.finishedCount}}</span>
                        <span>/</span>
                        <span style="color: darkslategrey;font-weight: bold;">{{scope.row.totalTaskCount}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        align="center"
                        label="安装状态">
                    <template scope="scope">
                        <div v-if="scope.row.status==0"
                             style="color: #686868">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==1"
                             style="color: #8b6c0e">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==2"
                             style="color: #13678b">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==3"
                             style="color: #198b57">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==4"
                             style="color: darkred">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==5"
                             style="color: indianred">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==6"
                             style="color: red">
                            {{scope.row.status|filterStatus}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="processCreateTime"
                        label="开始时间">
                    <template slot-scope="scope">
                        <span>
                            {{(scope.row.processCreateTime)|filterDateString}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="processEndTime"
                        label="完成时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.processEndTime==null"
                              style="color: darkorange">
                            未完成
                        </span>
                        <span v-else>
                            {{(scope.row.processEndTime)|filterDateString}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="操作" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-view"
                                @click="editWithItem(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
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

        <el-dialog title="机器安装进度" :visible.sync="addDialogVisible"
                   fullscreen
                   @open="onopened">
            <table style="width: 100%">
                <tr style="width: 100%;vertical-align: text-top;">
                    <td style="padding-right: 5px">
                        <div id="sample" style="width:100%; white-space:nowrap;">
                            <div id="myDiagramDiv" style="border: solid 1px black;"></div>
                        </div>

                    </td>
                    <td style="width: 50%">
                        <div>
                            <el-row>
                                <el-form :model="addForm" label-position="right" label-width="120px">

                                    <el-col :span="10">
                                        <el-form-item label="订单号：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.orderNum"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="系统编号：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.machineStrId"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item label="机器编号：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.nameplate"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="机型：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.machineTypeName"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item label="开始时间：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.processCreateTime"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="完成时间：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.processEndTime"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item label="位置：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.location"
                                                      style="width:100%"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="当前流程：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.currentTaskName"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="colorDiv"
                                             style="background-color: green;"></div>
                                    </el-col>

                                    <el-col :span="10">
                                        <el-form-item label="流程总数：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.totalTaskCount"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="已完成数：">
                                            <el-input type="text"
                                                      readonly
                                                      v-model="addForm.finishedCount"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="colorDiv"
                                             style="background-color: gray;"></div>
                                    </el-col>

                                    <el-col :span="10">
                                        <el-form-item label="当前进度：">

                                            <el-progress type="circle"
                                                         :text-inside="false"
                                                         :stroke-width="15"
                                                         show-text
                                                         :status="addForm.progressStatus"
                                                         :percentage="addForm.currentProgress"></el-progress>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="未完成数：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.totalTaskCount-addForm.finishedCount"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="colorDiv"
                                             style="background-color: #00A9C9;"></div>
                                    </el-col>

                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="异常数：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.abnormalCount"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="colorDiv"
                                             style="background-color: red;"></div>
                                    </el-col>

                                    <el-col :span="10" :offset="1">
                                        <el-form-item label="跳过数：">
                                            <el-input type="text"
                                                      disabled
                                                      v-model="addForm.skipCount"
                                                      style="width:100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="colorDiv"
                                             style="background-color: orange;"></div>
                                    </el-col>

                                </el-form>
                            </el-row>
                            <br>
                            <el-row>
                                <el-col :span="23" :offset="1">
                                    <el-table
                                            :data="taskDataList"
                                            border
                                            empty-text="暂无数据..."
                                            show-overflow-tooltip="true"
                                    >
                                        <el-table-column
                                                width="75"
                                                align="center"
                                                label="序号">
                                            <template scope="scope">
                                                {{scope.$index+1}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="120"
                                                align="center"
                                                label="工序名">
                                            <template scope="scope">
                                                {{scope.row.taskName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="120"
                                                align="center"
                                                label="组长">
                                            <template scope="scope">
                                                {{scope.row.leader}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column

                                                align="center"
                                                label="组员">
                                            <template scope="scope">
                                                <div v-if="scope.row.workerList==null||scope.row.workerList.length==0 ">
                                                    无
                                                </div>
                                                <el-tag v-else
                                                        v-for="item in scope.row.workerList">
                                                    {{item}}
                                                </el-tag>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="120"
                                                align="center"
                                                label="状态">
                                            <template scope="scope">
                                                <div v-if="scope.row.status < 2"
                                                     style="color: #00A9C9;">
                                                    {{scope.row.status|filterTaskStatus}}
                                                </div>
                                                <div v-if="scope.row.status>=2&&scope.row.status<6"
                                                     style="color: green">
                                                    {{scope.row.status|filterTaskStatus}}
                                                </div>
                                                <div v-if="scope.row.status==6"
                                                     style="color: gray">
                                                    {{scope.row.status|filterTaskStatus}}
                                                </div>
                                                <div v-if="scope.row.status>6&&scope.row.status<9"
                                                     style="color: red">
                                                    {{scope.row.status|filterTaskStatus}}
                                                </div>
                                                <div v-if="scope.row.status==9"
                                                     style="color: orange">
                                                    {{scope.row.status|filterTaskStatus}}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                align="center"
                                                label="操作" width="120">
                                            <template scope="scope">
                                                <el-button v-if="scope.row.status<=2"
                                                           size="small"
                                                           type="danger"
                                                           icon="el-icon-tickets"
                                                           @click="showSkip(scope.row)">跳过
                                                </el-button>
                                                <el-button v-if="scope.row.status==9"
                                                           size="small"
                                                           type="primary"
                                                           icon="el-icon-tickets"
                                                           @click="showRecover(scope.row)">恢复
                                                </el-button>
                                            </template>
                                        </el-table-column>

                                    </el-table>

                                </el-col>
                            </el-row>
                            <!--<el-row>-->
                                <!--<el-col :span="2" :offset="22">-->
                                    <!--<el-button-->
                                            <!--style="margin-top: 40px;"-->
                                            <!--icon="el-icon-close"-->
                                            <!--size="normal"-->
                                            <!--type="danger"-->
                                            <!--@click="addDialogVisible = false">-->
                                        <!--关闭-->
                                    <!--</el-button>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                            <el-dialog title="跳过工序" :visible.sync="confirmSkipDialog" width="30%"
                                       :modal="false">
                                <span>确定要跳过这一步骤 [<b style="color: red;font-size: 18px">{{selectedTaskItem.taskName}}</b>] 吗？</span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="confirmSkipDialog = false" icon="el-icon-close">取 消</el-button>
                                    <el-button type="primary" @click="onConfirmSkip"
                                               icon="el-icon-check">确 定</el-button>
                                </span>
                            </el-dialog>
                            <el-dialog title="恢复工序" :visible.sync="confirmRecoverDialog" width="30%"
                                       :modal="false">
                                <span>确定要恢复这一步骤 [<b style="color: red;font-size: 18px">{{selectedTaskItem.taskName}}</b>] 吗？</span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="confirmRecoverDialog = false"
                                               icon="el-icon-close">取 消</el-button>
                                    <el-button type="primary" @click="onConfirmRecover"
                                               icon="el-icon-check">确 定</el-button>
                                </span>
                            </el-dialog>
                        </div>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer" >
                <el-col :span="24" style="margin-bottom: 30px;">
                    <el-button   icon="el-icon-close"
                                 size="normal"
                                 type="danger"
                                 @click="addDialogVisible = false">关 闭</el-button>
                </el-col>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    var myDiagram;
    var subParts = new go.List();
    export default {
        name: "machine_config_process",
        components: {},
        data () {
            _this = this;
            return {
                queryDataUrl: HOST + "machine/selectProcessMachine",
                taskContentNameUrl: HOST + "task/list",
                errorMsg: '',
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                statusList: MachineStatusList,
                filters: {
                    machine_strid: '',
                    contract_num: '',
                    order_status: '',
                    orderNum: '',
                    status: '',
                    selectDate: '',
                },

                allMachineType: [],
                allRoles: [],
                loadingUI: false,
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
                addForm: {},
                addDialogVisible: false,
                isError: false,

                loading: false,
                allProcessTemplate: [],
                allProcessList: [],
                taskDataList: [],
                confirmSkipDialog: false,
                confirmRecoverDialog: false,
                selectedTaskItem: {},
            }

        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                _this.search();
            },
            search() {
                this.onSearchDetailData();
            },
            onSearchDetailData()
            {
                var condition = {
                    machine_strid: _this.filters.machine_strid.trim(),
                    orderNum: _this.filters.orderNum.trim(),
                    contractNum: _this.filters.contract_num.trim(),
                    query_start_time: '',
                    query_finish_time: '',
                    status: _this.filters.status,
                    is_fuzzy: true,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.query_start_time = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: _this.queryDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.totalRecords = res.data.total;
                            _this.tableData = res.data.list;
                            _this.startRow = res.data.startRow;
                            _this.tableData.forEach(itemObj=> {
                                itemObj.finishedCount = 0;
                                itemObj.totalTaskCount = 0;
                                try {
                                    var nodeDataArray = JSON.parse(itemObj.nodeData);
                                } catch (ex) {
                                    console.log(ex.toString());
                                }
                                if (nodeDataArray != null && nodeDataArray.length > 0) {
                                    itemObj.totalTaskCount = nodeDataArray.length - 2;//去掉开始，结束.
                                    nodeDataArray.forEach(item=> {
                                        if (parseInt(item.task_status) == 6) {//完成
                                            itemObj.finishedCount++;
                                        }
                                    });
                                }
                            });
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            getTaskRecordDetail()
            {

                if (_this.addForm.processRecordId == "") {
                    console.log("数据异常，还没有配置过对应的安装流程");
                    return;
                }
                $.ajax({
                    url: HOST + "task/record/getTaskRecordData",
                    type: 'POST',
                    dataType: 'json',
                    data: {processRecordId: _this.addForm.processRecordId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.taskDataList = res.data.list;
//                            _this.taskDataList.forEach(itemObj=> {
//
//                            });
                        }

                    }
                })
            },

            editWithItem(data){
                _this.selectedItem = copyObject(data);
                _this.isError = false;
                _this.addForm = copyObject(_this.selectedItem);
                _this.addForm.machineTypeName = _this.filterMachineType(_this.addForm.machineType);
                if (_this.addForm.processCreateTime != null) {
                    _this.addForm.processCreateTime = _this.filterDateString(_this.addForm.processCreateTime)
                }
                if (_this.addForm.processEndTime != null) {
                    _this.addForm.processEndTime = _this.filterDateString(_this.addForm.processEndTime)
                }
                if (_this.addForm.processRecordId != '') {
                    /*
                     已配置显示当前数据
                     */
                    _this.getTaskRecordDetail();
                    var taskList = copyObject(DefaultTaskList);
                    try {
                        taskList.linkDataArray = JSON.parse(_this.addForm.linkData);
                        taskList.nodeDataArray = JSON.parse(_this.addForm.nodeData);
                        _this.addForm.progressStatus = PROGRESSTYPE.NORMAL;
                        _this.addForm.finishedCount = 0;
                        _this.addForm.abnormalCount = 0;
                        _this.addForm.skipCount = 0;
                        _this.addForm.totalTaskCount = taskList.nodeDataArray.length - 2;//去掉开始，结束.
                        taskList.nodeDataArray.forEach(item=> {
                            if (item.category != "Start" && item.category != "End") {
                                if (parseInt(item.task_status) > 2 && parseInt(item.task_status) < 6)//进行中
                                {
                                    item.category = ProcessCatergory.Working;
                                    _this.addForm.currentTaskName = item.text;
                                }
                                else if (parseInt(item.task_status) == 6) {//完成
                                    item.category = ProcessCatergory.Finished;
                                    _this.addForm.finishedCount++;
                                }
                                else if (parseInt(item.task_status) > 6 && parseInt(item.task_status) < 9)//异常
                                {
                                    item.category = ProcessCatergory.Abnormal;
                                    _this.addForm.abnormalCount++;
                                }
                                else if (parseInt(item.task_status) == 9)//已跳过
                                {
                                    item.category = ProcessCatergory.Skip;
                                    _this.addForm.skipCount++;
                                }
                            }
                        });
                        _this.addForm.currentProgress = ( _this.addForm.finishedCount / _this.addForm.totalTaskCount) * 100;
                        _this.addForm.currentProgress = parseInt(_this.addForm.currentProgress);
                        if (_this.addForm.finishedCount == _this.addForm.totalTaskCount) {
                            _this.addForm.progressStatus = PROGRESSTYPE.SUCCESS
                        }
                        _this.addForm.taskList = JSON.stringify(taskList);
                    } catch (ex) {
                        showMessage(_this, "图形流程JSON数据解析失败！", 0)
                        console.log(ex.toString());
                        return;
                    }
                    _this.addDialogVisible = true;
                }
                else {
                    _this.addForm.taskList = '';
                    _this.isError = false;
                    _this.addDialogVisible = true;
                }
            },

            initAllRoles()
            {
                $.ajax({
                    url: _this.queryUserRoleUrl,
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

            initMachineType()
            {
                _this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
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

            getTaskContentName(){
                $.ajax({
                    url: _this.taskContentNameUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: null,
                    success: function (res) {
                        if (res.code == 200) {
                            taskContentArray = [];
                            for (var i = res.data.list.length - 1; i >= 0; i--) {
                                var str = {
                                    "text": res.data.list[i].taskName,
                                    "task_status": "0",
                                    "begin_time": "",
                                    "end_time": "",
                                    "leader": res.data.list[i].leader,
                                    "work_list": res.data.list[i].work_list,
                                };
                                taskContentArray.push(str);
                            }
                        }
                        else {

                        }
                    }
                })
            },

            getGroupData()
            {
                _this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
                if (_this.groupList != null && _this.groupList.length > 0) {
                    return;
                }
                $.ajax({
                    url: HOST + "/install/group/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.groupList = res.data.list;
                            sessionStorage.setItem('groupList', JSON.stringify(_this.groupList));
                        }
                    },
                })
            },
            onopened()
            {
                _this.isError = false;
                _this.errorMsg = '';
                _this.loadingInstance = Loading.service(
                        {
                            fullscreen: true,
                            text: "正在加载中，请稍后..."
                        });
                if (myDiagram != null) {
                    resetDiagram();
                }

                window.setTimeout(()=> {
                    try {
                        init();
                        if (_this.addForm.taskList != null && _this.addForm.taskList.length > 0) {
                            myDiagram.model = go.Model.fromJson(_this.addForm.taskList);
                        }
                    } catch (ex) {
                        showMessage(_this, "图形流程数据加载失败！", 0)
                        console.log(ex.toString());
                    } finally {
                        _this.loadingInstance.close();
                    }
                }, 200);

            },

            onConfirmSkip()
            {
                var taskRecord = {
                    id: _this.selectedTaskItem.id,
                    status: TaskStatusList[9].value,
                };
                _this.onUpdateData(taskRecord);
                _this.confirmSkipDialog = false;
            },

            showSkip(row)
            {
                _this.selectedTaskItem = copyObject(row);

                _this.confirmSkipDialog = true;
            },

            onConfirmRecover()
            {
                var taskRecord = {
                    id: _this.selectedTaskItem.id,
                    status: TaskStatusList[1].value,
                };
                _this.onUpdateData(taskRecord);
                _this.confirmRecoverDialog = false;
            },

            showRecover(row)
            {
                _this.selectedTaskItem = copyObject(row);
                _this.confirmRecoverDialog = true;
            },

            onUpdateData(tRecord)
            {
                var pRecord = {
                    id: _this.selectedTaskItem.processRecordId,
                    nodeData: [],
                };
                try {
                    var nodeData = JSON.parse(_this.addForm.nodeData);
                    if (nodeData != null) {
                        nodeData.forEach(item=> {
                            if (item.key == _this.selectedTaskItem.nodeKey) {
                                item.task_status = tRecord.status;
                            }
                        });
                    }
                    pRecord.nodeData = nodeData;
                    var dataInfo = {
                        taskRecord: JSON.stringify(tRecord),
                        processRecord: JSON.stringify(pRecord)
                    }
                } catch (ex) {
                    console.log(ex);
                }
                $.ajax({
                    url: HOST + "task/record/updateStatus",
                    type: 'POST',
                    dataType: 'JSON',
                    data: dataInfo,
                    success: function (res) {
                        if (res.code == 200) {
//                            _this.taskDataList.forEach(item=> {
//                                if (item.id == _this.selectedTaskItem.id) {
//                                    item.status = tRecord.status;
//                                }
//                            });
                            _this.addForm.nodeData = JSON.stringify(pRecord.nodeData);
                            var taskList = JSON.parse(_this.addForm.taskList);
                            taskList.nodeDataArray = JSON.parse(_this.addForm.nodeData);
                            _this.addForm.taskList = JSON.stringify(taskList);

//                            myDiagram.model = go.Model.fromJson(_this.addForm.taskList);

                            var sItem = null;
                            _this.tableData.forEach(item=> {
                                if (item.machineStrId == _this.addForm.machineStrId) {
                                    item.nodeData = _this.addForm.nodeData;
                                    sItem = item;
                                    return;
                                }
                            });
                            if (sItem != null) {
                                _this.addDialogVisible = false;
                                window.setTimeout(()=> {
                                    _this.editWithItem(sItem);

                                }, 50);
                            }
                            showMessage(_this, "设置成功！", 1);
                        }
                        else {
                            showMessage(_this, "设置失败！", 0);
                        }
                    },
                })
            },

            filterGroup(id) {
                let result = "";
                for (let i = 0; i < _this.groupList.length; i++) {
                    if (_this.groupList[i].id == id) {
                        result = _this.groupList[i].groupName;
                        break;
                    }
                }
                return result;
            },

            filterMachineType(id)
            {
                var result = '';
                for (var i = 0; i < _this.allMachineType.length; i++) {
                    if (id == _this.allMachineType[i].id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            },

            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },
        },

        computed: {},
        filters: {
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterStatus(id)
            {
                var result = _this.statusList[0].name;
                for (var i = 0; i < _this.statusList.length; i++) {
                    if (id == _this.statusList[i].value) {
                        result = _this.statusList[i].name;
                        break;
                    }
                }
                return result;
            },
            filterMachineType(id)
            {
                var result = '';
                for (var i = 0; i < _this.allMachineType.length; i++) {
                    if (id == _this.allMachineType[i].id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            },

            filterTaskStatus(id)
            {
                var result = '';
                for (var i = 0; i < TaskStatusList.length; i++) {
                    if (id == TaskStatusList[i].value) {
                        result = TaskStatusList[i].name;
                        break;
                    }
                }
                return result;
            },
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            //_this.getGroupData();
            _this.initMachineType();
        },
        mounted: function () {
            _this.filters.status = "";
            _this.search();
        },
    }

    var taskContentArray = [];
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
        myDiagram.nodeTemplateMap.add("Working",  //category
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


        myDiagram.nodeTemplateMap.add("Finished",  // Finished category
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

        myDiagram.nodeTemplateMap.add("Abnormal",  // Abnormal category
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

        myDiagram.nodeTemplateMap.add("Comment",
                $(go.Node, "Auto", nodeStyle(),
                        $(go.Shape, "File",
                                {fill: "#EFFAB4", stroke: null}),
                        $(go.TextBlock,
                                {
                                    margin: 5,
                                    maxSize: new go.Size(200, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    textAlign: "center",
                                    editable: false,
                                    font: "bold 12pt Helvetica, Arial, sans-serif",
                                    stroke: '#454545'
                                },
                                new go.Binding("text").makeTwoWay())
                        // no ports, because no links are allowed to connect with a comment
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
    .el-select {
        width: 100%;
    }

    .el-input-number {
        width: 100%;
        float: left;
    }

    .colorDiv {
        width: 40px;
        height: 30px;
        background-color: gray;
        border: solid 0.5px grey;
        margin-top: 5px;
        margin-left: 10px;
    }

</style>


