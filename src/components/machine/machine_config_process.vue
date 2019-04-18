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
                    <el-col :span="6">
                        <el-form-item label="合同编号:">
                            <el-input v-model="filters.contract_num"
                                      placeholder="合同编号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="配置状态:">
                            <el-select v-model="filters.configStatus" clearable>
                                <el-option
                                        v-for="item in configStatusList"
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
                        <el-form-item label="机器编号:">
                            <el-input v-model="filters.nameplate"
                                      placeholder="机器编号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="机型:">
                            <el-select v-model="filters.machineType" clearable>
                                <el-option
                                        v-for="item in allMachineType"
                                        :value="item.id"
                                        :label="item.name">
                                    <span style="float: left">{{ item.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.finished ? '成品机' : "" }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建日期:">
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
                    highlight-current-row
                    empty-text="暂无数据..."
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

                <!-- <el-table-column
                        align="center"
                        prop="machineStrId"
                        label="系统编号">
                </el-table-column> -->
                <el-table-column
                        align="center"
                        prop="nameplate"
                        label="机器编号">
                    <template scope="scope">
                        <div @click="onShowMachineInfo(scope.row)"
                             style="font-weight: bold;"
                             class="btn btn-link">
                            <span
                                    style="color: red"
                                    v-if="scope.row.nameplate==''||scope.row.nameplate==null">
                                点击设置
                            </span>
                            <span v-else>
                               {{scope.row.nameplate}}
                            </span>
                        </div>
                    </template>
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
                <el-table-column label="订单号"
                                 align="center"
                                 prop="orderNum">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderNum}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="contractNum"
                        label="合同号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="location"
                        label="位置">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="配置状态">
                    <template scope="scope">
                        <div v-if="scope.row.processRecordId!=''"
                             style="color: #2b542c"
                        >
                            已配置
                        </div>
                        <div v-else style="color: darkred">
                            未配置
                        </div>
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
                             style="color: darkred">
                            {{scope.row.status|filterStatus}}
                        </div>
                        <div v-if="scope.row.status==7"
                             style="color: red">
                            {{scope.row.status|filterStatus}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        label="创建日期">
                    <template slot-scope="scope">
                        <span v-if="scope.row.createTime==null"
                              style="color: darkorange">
                            无
                        </span>
                        <span v-else>
                            {{(scope.row.createTime)|filterDateString}}
                        </span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--align="center"-->
                        <!--prop="shipTime"-->
                        <!--label="发货时间">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span v-if="scope.row.shipTime==null"-->
                              <!--style="color: darkorange">-->
                            <!--无-->
                        <!--</span>-->
                        <!--<span v-else>-->
                            <!--{{(scope.row.shipTime)|filterDateString}}-->
                        <!--</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column
                        label="操作" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <!--非完成状态下，都可以更改具体的作业流程。
                        在改变工序时，已经做过的工序不可更改，但可以添加，这部分逻辑在图形界面去判断-->
                        <el-tooltip placement="right" v-if="!isFinishedMachine(scope.row.machineType)">
                            <div slot="content">配置</div>
                            <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-setting"
                                    :disabled="scope.row.status == 4"
                                    @click="editWithItem(scope.$index, scope.row)">配置
                            </el-button>
                        </el-tooltip>
                        <el-tooltip placement="right" v-if="isFinishedMachine(scope.row.machineType)">
                            <div slot="content">设置</div>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-setting"
                                    :disabled="scope.row.status == 4"
                                    @click="setMachineFinished(scope.row)">完成
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
                        layout="total, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </el-col>

        <el-dialog title="机器基本信息配置"
                   :visible.sync="machineDialog" width="50%"
                   @close="basicDialogClose"
                   @open="basicDialogOpen">
            <el-form :model="machineForm" label-position="right" label-width="150px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="订单号：">
                            <el-input type="text"
                                      disabled
                                      v-model="machineForm.orderNum"
                                      placeholder="订单号"
                                      style="width:100%"
                            ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10" :offset="1">
                        <el-form-item label="机型：">
                            <el-input type="text"
                                      disabled
                                      v-model="machineForm.machineTypeName"
                                      placeholder="机型"
                                      style="width:100%"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="11" :offset="0">
                        <el-form-item label="系统编号：">
                            <el-input type="text"
                                      disabled
                                      v-model="machineForm.machineStrId"
                                      placeholder="系统编号"
                                      style="width:100%"
                            ></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="10">
                        <el-form-item label="机器编号：">
                            <el-input type="text"
                                      autofocus
                                      v-model="machineForm.nameplate"
                                      placeholder="机器编号(铭牌号)"
                                      style="width:100%"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="点击生成二维码" placement="top">
                            <el-button type="success" @click="onGeneralQRCode" style="margin-top:5px; margin-left: 5px" size="mini"
                                       icon="el-icon-check"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="10" :offset="0">
                        <el-form-item label="位置：">
                            <el-input type="text"
                                      v-model="machineForm.location"
                                      disabled
                                      style="width:100%"
                                      clearable></el-input>
                            <!--<el-select-->
                            <!--clearable-->
                            <!--v-model="machineForm.location"-->
                            <!--placeholder="请选择">-->
                            <!--<el-option-->
                            <!--v-for="item in groupList"-->
                            <!--:label="item.groupName"-->
                            <!--:value="item.id">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <div id="qrcode"></div>
            </el-row>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon>
            </el-alert>
            <div slot="footer" class="dialog-footer" style="margin-bottom: 70px;margin-top: 30px">
                <el-col :span="24" style="margin-top: 10px;margin-bottom: 10px">
                    <el-button type="primary" @click="onSubmitMachine" icon="el-icon-check">确 定</el-button>
                    <el-button type="danger" @click="machineDialog = false" icon="el-icon-close">取 消</el-button>
                </el-col>
            </div>
        </el-dialog>

        <el-dialog title="机器配置流程" :visible.sync="addDialogVisible"
                   fullscreen
                   @open="onopened">
            <table style="width: 100%">
                <tr style="width: 100%;vertical-align: text-top;">
                    <td style="width: 20%; padding-right: 10px">
                        <el-row>
                            <el-form :model="addForm">
                                <!-- <el-col :span="24">
                                    <el-form-item label="系统编号：">
                                        <el-input type="text"
                                                  disabled
                                                  v-model="addForm.machineStrId"
                                                  style="width:100%"></el-input>
                                    </el-form-item>
                                </el-col> -->
                                <el-col :span="24">
                                    <el-form-item label="机器编号(铭牌号)：">
                                        <el-input type="text"
                                                  disabled
                                                  v-model="addForm.nameplate"
                                                  placeholder="无"
                                                  style="width:100%"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" :offset="0">
                                    <el-form-item label="机型：">
                                        <el-input type="text"
                                                  disabled
                                                  v-model="addForm.machineTypeName"
                                                  style="width:100%"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" :offset="0">
                                    <el-form-item label="流程模板：">
                                        <el-select
                                                :disabled="isTaskOngoing"
                                                v-model="addForm.processId"
                                                @change="onSelectedChange"
                                                clearable
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                :remote-method="remoteMethod"
                                                :loading="loading">
                                            <el-option
                                                    v-for="item in allProcessList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <br>
                        <el-row>
                            <el-button
                                    icon="el-icon-check"
                                    size="normal"
                                    type="primary"
                                    @click="onSubmit">保存
                            </el-button>
                            <el-button
                                    icon="el-icon-close"
                                    size="normal"
                                    type="danger"
                                    @click="addDialogVisible = false">关闭
                            </el-button>
                        </el-row>
                    </td>
                    <td style="width: 80%">
                        <div id="sample">
                            <div style="width:100%; white-space:nowrap; ">
                                <span style="display: inline-block; vertical-align: top; width: 15%;">
                                  <div id="myPaletteDiv" style="border: solid 1px black;"></div>
                                </span>
                                <span style="display: inline-block; vertical-align: top; text-align: center;width:85%">
			                        <div id="myDiagramDiv" style="border: solid 1px black;"></div>
			                    </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    var myDiagram;
    var myPalette;
    export default {
        name: "machine_config_process",
        components: {},
        data () {
            _this = this;
            return {
                queryDataUrl: HOST + "machine/selectConfigMachine",
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
                configStatusList: ConfigStatusList,
                machineStatusList: MachineStatusList,
                filters: {
                    machine_strid: '',
                    nameplate: '',
                    contract_num: '',
                    order_status: '',
                    orderNum: '',
                    machineType: "",
                    configStatus: 1,
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

                machineForm: {
                    nameplate : ''
                },
                machineDialog: false,
                isShowGeneral: false,
                isTaskOngoing:false
            }

        },
        methods: {
            isFinishedMachine(machineTypeId) {
                let result = false;
                for (let i = 0; i < this.allMachineType.length && !result; i++) {
                    if(this.allMachineType[i].id == machineTypeId) {
                        if(this.allMachineType[i].finished == 1) {
                            result = true;
                        }
                    }
                }
                return result;
            },
            basicDialogClose()
            {
                _this.isError = false;
                _this.errorMsg = "";
                $('#qrcode').html("");
            },
            onGeneralQRCode()
            {
                if (!isStringEmpty(_this.machineForm.nameplate)) {
                    _this.isError = false;
                    _this.errorMsg = "";
                    window.setTimeout(()=> {
                        // 设置参数方式
                        var str = toUtf8(_this.machineForm.nameplate);
                        $('#qrcode').html("");
                        $('#qrcode').qrcode(str);
                    }, 200);
                }
                else {
                    _this.isError = true;
                    _this.errorMsg = "请输入机器编号再生成二维码"
                    $('#qrcode').html("");
                }
            },
            onShowMachineInfo(item)
            {
                _this.selectedItem = item;
                _this.machineForm.id = item.id;
                _this.machineForm.orderNum = item.orderNum;
                _this.machineForm.machineTypeName = _this.filterMachineType(item.machineType);
                _this.machineForm.nameplate = item.nameplate;
                _this.machineForm.machineStrId = item.machineStrId;
                _this.machineForm.location = item.location;

                _this.errorMsg = "";
                _this.isError = false;
                _this.machineDialog = true;
            },
            onSubmitMachine()
            {
                if (isStringEmpty(_this.machineForm.nameplate)) {
                    _this.errorMsg = "机器编号不能为空!";
                    _this.isError = true;
                    return;
                }
                // if (isStringEmpty(_this.machineForm.location)) {
                //     _this.errorMsg = "机器位置信息不能为空!";
                //     _this.isError = true;
                //     return;
                // }
                if (_this.selectedItem.nameplate == _this.machineForm.nameplate
                        && _this.selectedItem.location == _this.machineForm.location) {
                    _this.errorMsg = "数据没有更改，不需要提交!";
                    _this.isError = true;
                    return;
                }
                var jsonData = JSON.stringify({
                    id: _this.machineForm.id,
                    nameplate: _this.machineForm.nameplate,
                    // location: _this.machineForm.location,
                });
                $.ajax({
                    url: HOST + "/machine/addMachineNum",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        machine: jsonData
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "机器信息更新成功!", 1)
                            for (var i = 0; i < _this.tableData.length; i++) {
                                if (_this.tableData[i].id === _this.machineForm.id) {
                                    _this.tableData[i].nameplate = _this.machineForm.nameplate;
                                    _this.tableData[i].location = _this.machineForm.location;
                                    break;
                                }
                            }
                            _this.machineDialog = false;

                        } else {
                            showMessage(_this, res.message, 0)
                        }
                    },
                })
            },

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
                    nameplate: _this.filters.nameplate.trim(),
                    machineType: _this.filters.machineType,
                    orderNum: _this.filters.orderNum.trim(),
                    contractNum: _this.filters.contract_num.trim(),
                    query_start_time: '',
                    query_finish_time: '',
                    configStatus: _this.filters.configStatus,
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
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            editWithItem(index, data){
                _this.selectedItem = copyObject(data);
                _this.isError = false;
                _this.addForm = copyObject(_this.selectedItem);
                _this.isTaskOngoing = false;
                _this.addForm.machineTypeName = _this.filterMachineType(_this.addForm.machineType);
                if (_this.addForm.processRecordId != '') {
                    /*
                     已配置显示当前数据
                     */
                    var taskList = DefaultTaskList;
                    taskList.nodeDataArray = JSON.parse(_this.addForm.nodeData);
                    taskList.linkDataArray = JSON.parse(_this.addForm.linkData);
                    _this.addForm.taskList = JSON.stringify(taskList);

                    _this.addDialogVisible = true;
                }
                else {
                    _this.addForm.processId = '';
                    _this.addForm.taskList = '';
                    _this.isError = false;
                    _this.addDialogVisible = true;
                }
            },

            setMachineFinished(machine) {
                let param = copyObjectByJSON(machine);
                param.status = 4;//完成状态
                $.ajax({
                    url: HOST + "machine/update",
                    type: 'POST',
                    dataType: 'json',
                    traditional: true,
                    data: {machine:JSON.stringify(param)},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.onSearchDetailData();
                            _this.addDialogVisible = false;
                            showMessage(_this, "设置完成状态成功！", 1)
                        } else {
                            showMessage(_this, "设置完成状态失败!" + res.message, 0)
                        }
                    }
                })

            },

            //配置或修改工序流程
            onSubmit()
            {
                if (_this.addForm.processId == "") {
                    showMessage(_this, "作业流程不能为空", 0)
                    _this.isError = true;
                    return;
                }
                _this.addForm.taskList = myDiagram.model.toJson();
                var taskList = JSON.parse(_this.addForm.taskList);

                if (taskList == null || taskList.nodeDataArray.length < 2) {
                    showMessage(_this, "当前还没有可用流程，请添加后再保存", 0)
                    return;
                }
                var trObjList = new Array();
                var machineStatus = _this.addForm.status;
                let highTaskStatus = 0;
                let allFinished = true;
                taskList.nodeDataArray.forEach(item=> {
                    if (item.category != "Start" && item.category != "End") {//排除start,end
                        if (isUndefined(item.taskStatus) || item.taskStatus == 0) {
                            trObjList.push({
                                taskName: item.text,
                                nodeKey: item.key,
                                status: 0,
                                processRecordId: _this.addForm.processRecordId
                            });
                        }
                        else if (machineStatus != MachineStatusList[3].value
                                && parseInt(item.taskStatus) != TaskStatusList[6].value
                                && parseInt(item.taskStatus) > TaskStatusList[1].value)//有一个是安装中
                        {
                            machineStatus = MachineStatusList[3].value//生产中
                        }
                        if(item.taskStatus > highTaskStatus) {
                            highTaskStatus = parseInt(item.taskStatus);
                        }
                        if(parseInt(item.taskStatus) != TaskStatusList[6].value) {
                            allFinished = false;
                        }
                        delete item["category"];
                        delete item["deletable"];
                        delete item["movable"];
                    }
                });
                //如果机器还处于初始化状态，则设置成已配置
                if(highTaskStatus == TaskStatusList[0].value){
                    machineStatus = MachineStatusList[1].value//已配置
                }
                //如果机器还处于已计划
                if(highTaskStatus == TaskStatusList[1].value){
                    machineStatus = MachineStatusList[2].value//已计划
                }
                //如果机器所有工序都完成
                if(allFinished){
                    machineStatus = MachineStatusList[4].value//已完成
                }
                //还处于初始化状态，则设置成已配置
                if(machineStatus == 0) {
                    machineStatus = MachineStatusList[1].value//已配置
                }

                var prObj = {
                    machineId: _this.addForm.id,
                    processId: _this.addForm.processId,
                    linkData: taskList.linkDataArray,
                    nodeData: taskList.nodeDataArray
                };

                if (_this.addForm.processRecordId != ""
                        && _this.addForm.processRecordId != 0) {
                    prObj.id = parseInt(_this.addForm.processRecordId);
                }
                _this.addForm.status = machineStatus;
                $.ajax({
                    url: HOST + "process/record/addProcessForMachine",
                    type: 'POST',
                    dataType: 'json',
                    traditional: true,
                    data: {
                        taskRecords: JSON.stringify(trObjList),
                        processRecord: JSON.stringify(prObj),
                        machine: JSON.stringify({
                            id: _this.addForm.id,
                            status: _this.addForm.status,
                        }),
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.onSearchDetailData();
                            _this.addDialogVisible = false;
                            showMessage(_this, "保存成功! 请到安装进度页面或计划管理页面查看", 1)
                        } else {
                            showMessage(_this, "保存失败!" + res.message, 0)
                        }
                    }
                })

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
                //_this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
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
                                    "taskStatus": "0",
                                    "beginTime": "",
                                    "endTime": "",
                                    "leader": res.data.list[i].leader,
                                    "workList": res.data.list[i].workList,
                                };
                                taskContentArray.push(str);
                            }
                        }
                        else {

                        }
                    }
                })
            },

            getAllProcessTemplate()
            {
                $.ajax({
                    url: HOST + "process/selectProcess",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        isSimple: true,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allProcessTemplate = [];
                            if (res.data.list != null && res.data.list.length > 0) {
                                _this.allProcessTemplate = res.data.list.map(item => {
                                    return {
                                        value: item.id,
                                        label: item.name
                                    };
                                });
                            }
                        }
                    }
                })
            },

            getGroupData()
            {
                //_this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
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
                            //sessionStorage.setItem('groupList', JSON.stringify(_this.groupList));
                        }
                    },
                })
            },
            basicDialogOpen() {
                _this.onGeneralQRCode();
            },
            onopened()
            {
                _this.isError = false;
                _this.errorMsg = '';
                if (myDiagram != null) {
                    resetDiagram();
                }
                _this.remoteMethod('');
                _this.loadingInstance = Loading.service(
                        {
                            fullscreen: true,
                            text: "正在加载中，请稍后..."
                        });

                window.setTimeout(()=> {
                    init();
                    if (_this.addForm.taskList != null && _this.addForm.taskList.length > 0) {
                        _this.renderDiagramDataToUI();
                    }
                    _this.loadingInstance.close();
                }, 200);

            },
            filterGroup(id) {
                var result = "";
                if (_this.groupList != null && _this.groupList.length > 0) {
                    for (var i = 0; i < _this.groupList.length; i++) {
                        if (_this.groupList[i].id == id) {
                            result = _this.groupList[i].groupName;
                            break;
                        }
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

            remoteMethod(query) {
                if (query !== '') {
                    _this.loading = true;
                    setTimeout(() => {
                        _this.loading = false;
                        _this.allProcessList = _this.allProcessTemplate.filter(item => {
                            return item.label.toLowerCase()
                                            .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    _this.allProcessList = this.allProcessTemplate;
                }
            },

            getDetailProcess(id)
            {
                _this.loadingInstance = Loading.service(
                        {
                            fullscreen: true,
                            text: "正在加载中，请稍后..."
                        });
                $.ajax({
                    url: HOST + "process/selectProcess",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: id,
                        isSimple: false,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data.list != null && res.data.list.length > 0) {
                                _this.addForm.taskList = res.data.list[0].taskList;
                                _this.renderDiagramDataToUI();
                            }
                        }
                    },
                    error: function (info) {
                        _this.loadingInstance.close();
                    }
                })
            },

            onSelectedChange(item)
            {
                _this.getDetailProcess(item);
            },

            renderDiagramDataToUI()
            {
                window.setTimeout(()=> {
                            try {
                                if (_this.addForm.taskList == '') {
                                    myDiagram.model = go.Model.fromJson({
                                        "class": "go.GraphLinksModel",
                                        "linkFromPortIdProperty": "fromPort",
                                        "linkToPortIdProperty": "toPort",
                                        "nodeDataArray": [
                                            {
                                                "category": "Start",
                                                "text": "开始",
                                                "key": -1,
                                                "loc": "208 40"
                                            },
                                            {
                                                "category": "End",
                                                "text": "结束",
                                                "key": -4,
                                                "loc": "208 216"
                                            }
                                        ],
                                        "linkDataArray": []
                                    });
                                } else {//edit
                                    var taskList = JSON.parse(_this.addForm.taskList);
                                    for (var i = 0; i < taskList.nodeDataArray.length; i++) {
                                        var item = taskList.nodeDataArray[i];
                                        if (item.category != "Start" && item.category != "End") {//排除start,end
                                            //已经安装中的，将不能删除，但可以接着增加流程
                                            if (item.taskStatus >= 2) {
                                                _this.isTaskOngoing = true;
                                                item.category = ProcessCatergory.Working;
                                                item.deletable = false;
                                                item.movable = false;
                                            }
                                        }
                                    }
                                    myDiagram.model = go.Model.fromJson(JSON.stringify(taskList));
                                }
                            } catch (ex) {
                                console.log(ex.toString());
                            } finally {
                                _this.loadingInstance.close();
                            }
                        },
                        200
                )
                ;
            },

        },

        computed: {}
        ,
        filters: {
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            }
            ,

            filterStatus(id)
            {
                var result = _this.machineStatusList[0].name;
                for (var i = 0; i < _this.machineStatusList.length; i++) {
                    if (id == _this.machineStatusList[i].value) {
                        result = _this.machineStatusList[i].name;
                        break;
                    }
                }
                return result;
            }
            ,

            filterConfigStatus(id)
            {
                var result = _this.configStatusList[0].name;
                for (var i = 0; i < _this.configStatusList.length; i++) {
                    if (id == _this.configStatusList[i].value) {
                        result = _this.configStatusList[i].name;
                        break;
                    }
                }
                return result;
            }
            ,
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
            }
            ,

        }
        ,
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            _this.initMachineType();
            _this.getGroupData();
            _this.getTaskContentName();
            _this.getAllProcessTemplate();

        }
        ,
        mounted: function () {
            _this.filters.configStatus = 1;
            _this.search();
        }
        ,
    }

    var taskContentArray = [];
    function resetDiagram() {

        try {
            var objDiagram = document.getElementById("myDiagramDiv");
            var childList = objDiagram.childNodes;
            if (childList != null && childList.length > 0) {
                for (var i = childList.length - 1; i >= 0; i--) {
                    document.getElementById("myDiagramDiv").removeChild(childList[i]);
                }
            }
//            var objPalette = document.getElementById("myPaletteDiv");
//            var childList2 = objPalette.childNodes;
//            if (childList2 != null && childList2.length > 0) {
//                for (var i = childList2.length - 1; i >= 0; i--) {
//                    document.getElementById("myPaletteDiv").removeChild(childList2[i]);
//                }
//            }
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
                            allowDrop: true,  // must be true to accept drops from the Palette
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
        //PartResized
        myDiagram.addDiagramListener("PartCreated", function (e) {
            console.log("addDiagramListener")
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
//                    deletable: false,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function (e, obj) {
                        showPorts(obj.part, false);
                    },

                },
                new go.Binding("deletable", "deletable"),
                new go.Binding("movable", "movable"),
//                new go.Binding("canDelete", "canDelete"),
//                new go.Binding("canMove", "canMove"),
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
                                        {
                                            fill: "#00A9C9", stroke: null,
                                        },
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
                                            isMultiline: true,
                                        },
                                        new go.Binding("text").makeTwoWay(),
                                ),
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
                                        {fill: "Gray", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Arial",
                                            stroke: "black",
                                            margin: 8,
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
                                            editable: false,
                                            textAlign: 'center',
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

        if (myPalette != null) {
            myPalette.div = null;
        }
        myPalette =
                $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                        {
                            "animationManager.duration": 100, // slightly longer than default (600ms) animation
                            nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                            model: new go.GraphLinksModel(taskContentArray)
                        });

        // The following code overrides GoJS focus to stop the browser from scrolling
        // the page when either the Diagram or Palette are clicked or dragged onto.

        function customFocus() {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            go.Diagram.prototype.doFocus.call(this);
            window.scrollTo(x, y);
        }

        myDiagram.doFocus = customFocus;
        myPalette.doFocus = customFocus;

//        myDiagram.isReadOnly = _this.isNotAdmin;  // Disable the diagram!
//        myPalette.isReadOnly = _this.isNotAdmin;  // Disable the diagram!
        document.getElementById("myDiagramDiv").style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + "px";
        document.getElementById("myPaletteDiv").style.height = document.getElementById("myDiagramDiv").style.height;

    } // end init

    // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "white" : null);
        });
    }

    function toUtf8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
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

</style>


