<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单号:">
                            <el-input v-model="filters.orderNum" placeholder="订单号" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                
                    <el-col :span="6">
                        <el-form-item label="完成状态:">
                            <el-select v-model="filters.status" clearable>
                                <el-option v-for="item in statusList" :value="item.value" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="完成日期:">
                            <el-date-picker v-model="filters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="机器编号:">
                            <el-input v-model="filters.nameplate" placeholder="机器编号" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
            
                    <el-col :span="12">
                        <el-form-item label="工序:">
                            <!-- <el-input v-model="filters.taskName" placeholder="工序" auto-complete="off">
                            </el-input> -->
                            <el-select v-model="filters.taskNameList" multiple placeholder="工序">
                                <el-option v-for="item in workTaskList" :key="item.id" :label="item.taskName" :value="item.taskName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4" :offset="2">
                        <el-button
                                icon="el-icon-share"
                                size="normal"
                                type="danger"
                                @click="processMachineExport">导出
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table v-loading="loadingUI" element-loading-text="获取数据中..." :data="tableData" border empty-text="暂无数据..." ref="singleTable" highlight-current-row show-overflow-tooltip="true" style="width: 100%; ">
                <el-table-column width="75" align="center" label="序号">
                    <template scope="scope">
                        <div :style="scope.row.warning|filterWaring">
                            {{scope.$index+startRow}}
                        </div>
                    </template>
                </el-table-column>

                <!-- <el-table-column
                            align="center"
                            prop="machineStrId"
                            label="系统编号">
                    </el-table-column> -->
                <el-table-column align="center" prop="nameplate" label="机器编号">
                    <template scope="scope">
                        <div v-if="scope.row.isUrgent==1" style="color: darkorange">
                                {{scope.row.nameplate}}
                            </div>
                            <div v-else>
                                {{scope.row.nameplate}}
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
                            prop="location"
                            label="位置">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="当前工序">
                        <template scope="scope">
                            <el-tag size="small" style="margin-left: 3px;margin-top:3px;color: green;"
                                    v-for="item in scope.row.currentTaskList">
                                {{item}}
                            </el-tag>
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
                            prop="processCreateTime"
                            label="开始日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.processCreateTime)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                  
                    <el-table-column width="200"
                                    label="操作" align="center">
                        <template scope="scope" style="text-align: center">
                            <el-tooltip placement="left" content="查看机器">
                                <el-button
                                        size="mini"
                                        type="primary"
                                        icon="el-icon-view"
                                        @click="editWithItem(scope.row)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-show="scope.row.status!=7 && scope.row.status!=4 &&  scope.row.status!=9
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                        || userinfo.role.roleName.indexOf('PMC')>-1
                                        || userinfo.role.roleName.indexOf('超级管理员')>-1) "
                                        placement="right">
                                <div slot="content">取消机器</div>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        icon="el-icon-close"
                                        @click="cancelMachine(scope.row)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-show="scope.row.status==7
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                            || userinfo.role.roleName.indexOf('PMC')>-1
                                            || userinfo.role.roleName.indexOf('超级管理员')>-1)"
                                        placement="right">
                                <div slot="content">恢复安装</div>
                                <el-button
                                        size="mini"
                                        type="success"
                                        icon="el-icon-check"
                                        @click="recoverMachine(scope.row)">
                                </el-button>
                            </el-tooltip>

                            <el-tooltip v-show="scope.row.status!=7 && scope.row.status!=4 && scope.row.isUrgent!=1 &&  scope.row.status!=9
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                        || userinfo.role.roleName.indexOf('PMC')>-1
                                        || userinfo.role.roleName.indexOf('超级管理员')>-1) "
                                        placement="right">
                                <div slot="content">"设为加急"</div>
                                <el-button
                                        size="mini"
                                        type="success"
                                        icon="el-icon-edit"
                                        @click="setMachineUrgent(scope.row)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-show="scope.row.status!=7 && scope.row.status!=4 && scope.row.isUrgent==1
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                        || userinfo.role.roleName.indexOf('PMC')>-1
                                        || userinfo.role.roleName.indexOf('超级管理员')>-1) "
                                        placement="right">
                                <div slot="content">"取消加急"</div>
                                <el-button
                                        size="mini"
                                        type="warning"
                                        icon="el-icon-edit"
                                        @click="setMachineUnUrgent(scope.row)">
                                </el-button>
                            </el-tooltip>

                            <!-- todo: 发货权限-->
                            <el-tooltip v-show="scope.row.status==4
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                        || userinfo.role.roleName.indexOf('PMC')>-1
                                        || userinfo.role.roleName.indexOf('超级管理员')>-1) "
                                        placement="right">
                                <div slot="content">"发货"</div>
                                <el-button
                                        size="mini"
                                        type="success"
                                        icon="el-icon-edit"
                                        @click="setMachineShipped(scope.row)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-show="scope.row.status==9
                                        && (userinfo.role.roleName.indexOf('生产部')>-1
                                        || userinfo.role.roleName.indexOf('PMC')>-1
                                        || userinfo.role.roleName.indexOf('超级管理员')>-1) "
                                        placement="right">
                                <div slot="content">"取消发货"</div>
                                <el-button
                                        size="mini"
                                        type="primary"
                                        icon="el-icon-edit"
                                        @click="setMachineUnShipped(scope.row)">
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
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
  
    export default {
        name: "machine_install_whole",
        components: {},
        data() {
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
                    nameplate: '',
                    contract_num: '',
                    order_status: '',
                    orderNum: '',
                    status: '',
                    selectDate: '',
                },
                workTaskList:[],
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
            }

        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchDetailData();
            },
            search() {
                _this.currentPage = 1;
                this.onSearchDetailData();
            },
            onSearchDetailData()
            {
                var condition = {
                    machine_strid: _this.filters.machine_strid.trim(),
                    orderNum: _this.filters.orderNum.trim(),
                    nameplate: _this.filters.nameplate.trim(),
                    contractNum: _this.filters.contract_num.trim(),
                    taskNameList: '', //array _this.filters.taskNameList
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
                var nameList=[];
                _this.filters.taskNameList.forEach(obj=>{
                    nameList.push(`'${obj}'`);
                });
                if(_this.filters.taskNameList.length > 0)
                {
                   condition.taskNameList = nameList.join(",");
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
                            _this.tableData.forEach(itemObj => {
                                itemObj.finishedCount = 0;
                                itemObj.totalTaskCount = 0;
                                itemObj.currentTaskList = [];//当前的工序名
                                try {
                                    var nodeDataArray = JSON.parse(itemObj.nodeData);
                                } catch (ex) {
                                    console.log(ex.toString());
                                }
                                if (nodeDataArray != null && nodeDataArray.length > 0) {
                                    itemObj.totalTaskCount = nodeDataArray.length - 2;//去掉开始，结束.
                                    nodeDataArray.forEach(item => {
                                        if (parseInt(item.taskStatus) > 2 && parseInt(item.taskStatus) < 6)//进行中
                                        {
                                            itemObj.currentTaskList.push(item.text);
                                        }
                                        else if (parseInt(item.taskStatus) == 2) {//待安装
                                            itemObj.currentTaskList.push("待 " + item.text);
                                        }
                                        if (parseInt(item.taskStatus) == 6) {//完成
                                            itemObj.finishedCount++;
                                        }
                                    });
                                }
                                itemObj.currentTaskName = itemObj.currentTaskList.join(",");
                            });
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            processMachineExport() {
                var condition = {
                    machine_strid: _this.filters.machine_strid.trim(),
                    orderNum: _this.filters.orderNum.trim(),
                    nameplate: _this.filters.nameplate.trim(),
                    contractNum: _this.filters.contract_num.trim(),
                    taskNameList: '', //array _this.filters.taskNameList
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
                var nameList=[];
                _this.filters.taskNameList.forEach(obj=>{
                    nameList.push(`'${obj}'`);
                });
                if(_this.filters.taskNameList.length > 0)
                {
                    condition.taskNameList = nameList.join(",");
                }
                $.ajax({
                    url: HOST + "machine/processMachineExport",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (data) {
                        if (data.code == 200) {
//                            _this.tableDataPlaned = data.data.list;
//                            _this.totalNumPlaned = data.data.total;
//                            _this.startRowPlaned = data.data.startRow;
//                            window.location.href = data.data;
                            showMessage(_this, "计划导出excel成功！", 1);

                        } else {
                            showMessage(_this, "导出导出excel失败！", 0);
                        }
                        _this.loadingUI = false;
                    },
                    error: function (data) {
                        showMessage(_this, data.message, 0);
                    }
                })
            },

            getTaskRecordDetail() {

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
                            _this.taskDataList.forEach(itemObj => {
                                itemObj.costTime = 0;
                                try {
                                    if (itemObj.status > 2) { //开始安装
                                        //添加显示已安装时间
                                        if (!isStringEmpty(itemObj.installBeginTime)) {
                                            let endDay = new Date();
                                            if (!isStringEmpty(itemObj.installEndTime)) {
                                                endDay = new Date(itemObj.installEndTime);
                                            }
                                            let beginDay = new Date(itemObj.installBeginTime);
                                            let timespan = endDay.getTime() - beginDay.getTime();
                                            itemObj.costTime = timespan;
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        }

                    }
                })
            },
       
            editWithItem(data) {
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
                if (_this.addForm.contractShipDate != null) {
                    _this.addForm.contractShipDate = _this.filterDateString(_this.addForm.contractShipDate)
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
                        taskList.nodeDataArray.forEach(item => {
                            if (item.category != "Start" && item.category != "End") {
                                if (parseInt(item.taskStatus) == 2)//待安装
                                {
                                    item.category = ProcessCatergory.Waiting;
                                }
                                else if (parseInt(item.taskStatus) > 2 && parseInt(item.taskStatus) < 6)//进行中
                                {
                                    item.category = ProcessCatergory.Working;
                                }
                                else if (parseInt(item.taskStatus) == 6) {//完成
                                    item.category = ProcessCatergory.Finished;
                                    _this.addForm.finishedCount++;
                                }
                                else if (parseInt(item.taskStatus) > 6 && parseInt(item.taskStatus) < 9)//异常
                                {
                                    item.category = ProcessCatergory.Abnormal;
                                    _this.addForm.abnormalCount++;
                                }
                                else if (parseInt(item.taskStatus) == 9)//已跳过
                                {
                                    item.category = ProcessCatergory.Skip;
                                    _this.addForm.skipCount++;
                                }
                            }
                        });
                        _this.addForm.currentProgress = (_this.addForm.finishedCount / _this.addForm.totalTaskCount) * 100;
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

            initAllRoles() {
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

            initMachineType() {
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

            getTaskContentName() {
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

            getGroupData() {
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

            filterDateString(strDate) {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },
        },

        computed: {},
        filters: {
            filterDateString(strDate) {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterStatus(id) {
                var result = _this.statusList[0].name;
                for (var i = 0; i < _this.statusList.length; i++) {
                    if (id == _this.statusList[i].value) {
                        result = _this.statusList[i].name;
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
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            _this.initMachineType();
        },
        mounted: function () {
            _this.filters.status = "";
            _this.search();
        },
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

