<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订 单 号 :">
                            <el-input v-model="filters.orderNum" placeholder="订单号" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                
                   <el-col :span="6">
                        <el-form-item label="机器编号:">
                            <el-input v-model="filters.nameplate" placeholder="机器编号" auto-complete="off" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="安装组：">
                            <el-select v-model="filters.groupName" clearable>
                                <el-option v-for="item in groupList" :key="item.groupName" :label="item.groupName" :value="item.groupName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="计划日期:">
                            <el-date-picker v-model="filters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="2" :offset="2" align="center"  >
                        <el-form-item label="合计:">
                            {{getSummaries()}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="10">
                        <el-button
                                icon="el-icon-plus"
                                size="normal"
                                type="danger"
                                @click="addPlan">排产
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table v-loading="loadingUI" element-loading-text="获取数据中..." :data="tableData" border empty-text="暂无数据..." ref="singleTable" highlight-current-row show-overflow-tooltip="true" style="width: 100%; ">
                <el-table-column width="55" align="center" label="序号">
                    <template scope="scope">
                        <div >
                            {{scope.$index+startRow}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="安装组"
                                 align="center"
                                 prop="groupName"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.groupName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="计划日期"
                                 align="center"
                                 prop="installDatePlan"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{formatDate(scope.row.installDatePlan)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单号"
                                 align="center"
                                 prop="orderNum"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderNum}}
                        </div>
                    </template>
                </el-table-column>
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
                            prop="location"
                            label="机架位置">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="头数">
                        <template scope="scope">
                            <span>
                                {{scope.row.headNum}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="已完成头数">
                        <template scope="scope">
                            <span>{{scope.row.headCountDone}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="完成率">
                        <template slot-scope="scope">
                            <span>
                               {{(scope.row.headCountDone) |filterCompletionRate(scope.row.headNum) }}%
                            </span>
                        </template>
                    </el-table-column>
                   <el-table-column
                            align="center"
                            label="备注">
                        <template slot-scope="scope">
                            <span>
                               {{scope.row.cmtSend}}
                            </span>
                        </template>
                    </el-table-column>
                     <el-table-column
                            align="center"
                            label="反馈">
                        <template slot-scope="scope">
                            <span>
                               {{scope.row.cmtFeedback}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                                    label="操作" align="center">
                        <template scope="scope" style="text-align: center">
                            <el-tooltip placement="left" content="修改">
                                <el-button
                                        size="mini"
                                        type="primary"
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
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="totalRecords">
                    </el-pagination>
                </div>
            </el-col>
        <el-dialog title="新增总装排产(以安装组和日期为依据进行排产)" :visible.sync="addDialogVisible" append-to-body width="70%">
            <el-form :model="addForm" >
                <el-row >
                    <el-col :span="8" >
                        <el-form-item label="安装组："  :label-width="formLabelWidth">
                            <el-select v-model="addForm.installGroupId" placeholder="安装切换后重新排产" clearable>
                                <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id"
                                           @change="onInstallGroupChanged()">
                                </el-option>
                            </el-select>
                        </el-form-item >
                    </el-col >
                    <el-col :span="8">
                        <el-form-item label="日期：" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="addForm.installDatePlan"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" >
                        <el-form-item label="订单号：" :label-width="formLabelWidth">
                            <el-input v-model="addForm.orderNum" @change="onOrderChanged(addForm.orderNum)" clearable></el-input>
                        </el-form-item>
                    </el-col >
                    <el-col :span="8">

                        <el-form-item label="机器铭牌号：" :label-width="formLabelWidth">
                            <el-select v-model="addForm.nameplate" placeholder="根据订单号自动提供选择" clearable >
                                <el-option v-for="item in machineList" :key="item.id" :label="item.nameplate" :value="item.nameplate" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" >
                        <el-form-item label="头数："  :label-width="formLabelWidthSmall">
                            <el-input v-model="addForm.headNum" clearable>
                            </el-input>
                        </el-form-item >
                    </el-col >
                    <el-col :span="4" >
                        <el-form-item label="针数："  :label-width="formLabelWidthSmall">
                            <el-input v-model="addForm.needleNum" @change="onChange" clearable></el-input>
                        </el-form-item >
                    </el-col >
                    <el-col :span="23" :offset="1">
                        <el-form-item label="备注信息：" prop="desc">
                            <el-input type="textarea" v-model="addForm.cmtSend" :rows="5"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-col :span="4" :offset ="21">
                    <el-button
                            type="primary"
                            class="el-icon-plus"
                            @click="handleAddInstallPlanWhole">增加排产 </el-button>
                </el-col>
                <el-col :span="24">
                    <el-col :span="23">
                        <el-table
                                border
                                :data="addFormList.installPlanWholeContent"
                                style="margin-left: 30px;margin-bottom: 30px">
                            <el-table-column
                                    label="订单号"
                                    width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.orderNum}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="机器铭牌号"
                                    width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.nameplate}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="安装组"
                                    width="100">
                                <template slot-scope="scope">
                                    {{ filterGroup( scope.row.installGroupId )}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="针数" width="60">
                                <template slot-scope="scope">
                                    {{ scope.row.needleNum}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="头数" width="60">
                                <template slot-scope="scope">
                                    {{ scope.row.headNum}}
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" width="500">
                                <template slot-scope="scope">
                                    {{ scope.row.cmtSend}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-col>

            </el-form >
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon >
            </el-alert >
            <span  slot="footer" class="dialog-footer" style="margin-bottom: 20px; padding-top:30px;" >
                <el-button @click="addDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button >
                <el-button type="primary" @click="onAdd" icon="el-icon-check">确 定</el-button >
            </span >

        </el-dialog >

        <el-dialog title="修改总装排产" :visible.sync="modifyDialogVisible" append-to-body width="70%">

            <el-form :model="modifyForm" >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="日期：" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="modifyForm.installDatePlan"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" >
                        <el-form-item label="订单号：" :label-width="formLabelWidth">
                            <el-input v-model="modifyForm.orderNum" @change="onOrderChanged(addForm.orderNum)"  disabled></el-input>
                        </el-form-item>
                    </el-col >
                    <el-col :span="8">

                        <el-form-item label="机器铭牌号：" :label-width="formLabelWidth">
                            <el-select v-model="modifyForm.nameplate" placeholder="根据订单号自动提供选择" disabled >
                                <el-option v-for="item in machineList" :key="item.id" :label="item.nameplate" :value="item.nameplate" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" >
                        <el-form-item label="安装组："  :label-width="formLabelWidth">
                            <el-select v-model="modifyForm.groupName" placeholder="安装组" disabled>
                                <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item >
                    </el-col >
                    <el-col :span="8" >
                        <el-form-item label="头数："  :label-width="formLabelWidth">
                            <el-input v-model="modifyForm.headNum" disabled>
                            </el-input>
                        </el-form-item >
                    </el-col >
                    <el-col :span="23" :offset="1">
                        <el-form-item label="备注信息：" prop="desc">
                            <el-input type="textarea" v-model="modifyForm.cmtSend" :rows="5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23" :offset="1">
                        <el-form-item label="反馈信息：" prop="desc">
                            <el-input type="textarea" v-model="modifyForm.cmtFeedback" :rows="5" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form >
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon >
            </el-alert >
            <span  slot="footer" class="dialog-footer" style="margin-bottom: 20px; padding-top:30px;" >
                <el-button @click="modifyDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button >
                <el-button type="primary" @click="onModify" icon="el-icon-check">保 存</el-button >
            </span  >

        </el-dialog >
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
                queryDataUrl: HOST + "/install/plan/actual/selectInstallPlanActualDetails",
                errorMsg: '',
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                groupList: [],
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                statusList: MachineStatusList,
                filters: {
                    nameplate: '',
                    orderNum: '',
                    selectDate: '',
                },
                workTaskList: [],
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

                addForm: {
                    type: INSTALLTYPE.ALL,
                },
                //新增的还没有保存的列表
                addFormList: {
                    type: INSTALLTYPE.ALL,
//                    installPlanWholeContent:[{orderNum:"", nameplate:"", needleNum:"", headNum:"",cmtSend:""}]
                    installPlanWholeContent:[ ]
                },
                addDialogVisible: false,
                isError: false,
                loading: false,
                formLabelWidth: '120px',
                formLabelWidthSmall: '60px',
                machineListByOrderNum: [],
                machineListByOrderNumTimeout: null,
                machineList: [],

                //修改
                modifyDialogVisible: false,
                modifyForm: {},
            }

        },
        methods: {

            //检查 该机器的该安装组 是否已经存在于当前列表（只在web页上，没到后端）
            checkIsExistInCurrentList(nameplate, installGroup){
                for ( var i = _this.addFormList.installPlanWholeContent.length - 1; i >= 0; i-- ){
                    console.log("===" +_this.addFormList.installPlanWholeContent.indexOf(i).nameplate)
                    if ( _this.addFormList.installPlanWholeContent[i].nameplate == nameplate){
                        if (_this.addFormList.installPlanWholeContent[i].installGroupId == installGroup ){

                            this.errorMsg = "该机器的该安装组 已经在列表中";
                            return true;
                        }
                    }
                }
                return false;
            },

            validInstallPlanInfo(formObj, isEdit) {
                var iserror = false;

                if (!iserror && isStringEmpty(formObj.installDatePlan)) {
                    iserror = true;
                    this.errorMsg = "安装日期不能为空";
                }
                if (!iserror && isStringEmpty(formObj.installGroupId)) {
                    iserror = true;
                    this.errorMsg = "安装组不能为空";
                }
                if (!iserror && isStringEmpty(formObj.orderNum)) {
                    iserror = true;
                    this.errorMsg = "订单号不能为空";
                }
                if (!iserror && isStringEmpty(formObj.nameplate)) {
                    iserror = true;
                    this.errorMsg = "铭牌号不能为空";
                }

                if (!iserror && isStringEmpty(formObj.needleNum)) {
                    iserror = true;
                    this.errorMsg = "针数不能为空";
                }
                if (!iserror && formObj.headNum == "") {
                    iserror = true;
                    this.errorMsg = "头数不能为空";
                }
                //todo: 还要检查当前已加到表格（未保存到数据库）的数据是否重复。
                return iserror;
            },

            //在添加排产时，先查询本地列表，再向服务器查, 这个排产，是否已经排过了。
            checkTheInstallPlanIsSet() {
                _this.isError = this.validInstallPlanInfo(_this.addForm, false);
                if (_this.isError) {
//                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    _this.isError = this.checkIsExistInCurrentList(_this.addForm.nameplate, _this.addForm.installGroupId);
                    if(_this.iserror){
                        console.log("===" +  this.errorMsg );
                        return _this.isError;
                    }
                    _this.addForm.machineId = null;
                    //step1. 根据nameplate获取机器machineId，
                    $.ajax({
                        url: HOST + "machine/selectMachinesByNameplate",
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        data: {
                            nameplate: _this.addForm.nameplate,
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                _this.addForm.machineId = res.data.id;

                                // step2 再向服务器查询
                                $.ajax({
                                    url: HOST + "install/plan/checkTheInstallPlanIsSet",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        "installPlan": JSON.stringify(_this.addForm)
                                    },
                                    success: function (data) {
                                        if (data.code == 200) {
                                            _this.search();
                                            //_this.addDialogVisible = false;///
                                        } else {
                                            _this.isError = true;
                                            _this.errorMsg = data.message;
                                        }
                                    },
                                    error: function (data) {
                                        _this.errorMsg = '服务器访问出错！';
                                    }
                                })
                            } else {
                                _this.isError = true;
                                _this.errorMsg = data.message;
                                console.log("fail");
                            }
                        },
                        error: function (data) {
                            _this.errorMsg = '服务器访问出错！';
                        }
                    });
                }
                return _this.isError;

            },
            handleAddInstallPlanWhole(){
                _this.isError = this.checkTheInstallPlanIsSet();
                if ( ! _this.isError) {
                    this.addFormList.installPlanWholeContent.push({
                        orderNum: this.addForm.orderNum,
                        nameplate: this.addForm.nameplate,
                        installGroupId: this.addForm.installGroupId,
                        needleNum: this.addForm.needleNum,
                        headNum: this.addForm.headNum,
                        cmtSend: this.addForm.cmtSend
                    });

                }
            },

            getSummaries() {
                return _this.totalRecords;
            },
            onOrderChanged(orderNum)
            {
                //获取针数, 头数, 订单ID
                $.ajax({
                    url: HOST + "machine/order/getMachineOrder",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        orderNum: orderNum,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.addForm.headNum = res.data.headNum;
                            _this.addForm.needleNum = res.data.needleNum;
                            _this.addForm.orderId = res.data.id;
                        }
                    }
                });

                // 获取订单的机器(包含铭牌号）
                //机器未设置铭牌号的情况下，获取的铭牌号为空。
                _this.machineList = [];
                if (isStringEmpty(orderNum)) {
                    _this.addForm.nameplate = '';
                    return;
                }
                $.ajax({
                    url: HOST + "machine/selectMachines",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        orderNum: orderNum,
                        is_fuzzy: "false",
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.machineList = res.data.list;
                        }
                    }
                })
            },

            onInstallGroupChanged(){
                _this.addForm.installPlanWholeContent = [];
                //todo 页面上也要清空
            },
            onChange()
            {
                // if (_this.addDialogVisible) {
                //     _this.isError = _this.validateForm(_this.form, false);
                // }
                // else {
                //     _this.isError = _this.validateForm(_this.modifyForm, true);
                // }
            },
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
                    orderNum: _this.filters.orderNum.trim(),
                    nameplate: _this.filters.nameplate.trim(),
                    type: INSTALLTYPE.ALL,
                    installGroupName: _this.filters.groupName,
                    queryStartTime: '',
                    queryFinishTime: '',
                    //status: _this.filters.status,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
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

            addPlan() {
                _this.isError = false;
                _this.errorMsg = '';
                _this.addDialogVisible = true;
            },

            //添加一系列排产,todo
            onAdd()
            {

                _this.addForm.machineId = null;
                //step1. 根据nameplate获取机器machineId，
                $.ajax({
                    url: HOST + "machine/selectMachinesByNameplate",
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        nameplate: _this.addForm.nameplate,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.addForm.machineId = res.data.id;

                            // step2 再添加计划
                            $.ajax({
                                url: HOST + "install/plan/add",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    "installPlan": JSON.stringify(_this.addForm)
                                },
                                success: function (data) {
                                    if (data.code == 200) {
                                        _this.search();
                                        _this.addDialogVisible = false;
                                        showMessage(_this, '添加成功', 1);
                                    } else {
                                        _this.isError = true;
                                        _this.errorMsg = data.message;
                                    }
                                },
                                error: function (data) {
                                    _this.errorMsg = '服务器访问出错！';
                                }
                            })
                        } else {
                            _this.isError = true;
                            _this.errorMsg = data.message;
                            console.log("fail");
                        }
                    },
                    error: function (data) {
                        _this.errorMsg = '服务器访问出错！';
                    }
                });


            },

            onModify() {
                this.isError = this.validateForm(this.modifyForm);
                if (!_this.isError) {
                    $.ajax({
                        url: HOST + "install/plan/update",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "installPlan": JSON.stringify(_this.modifyForm)
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                _this.search();
                                _this.modifyDialogVisible = false;
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
                }
            },
            validateForm(formObj)
            {
                var iserror = false;

                if (!iserror && isStringEmpty(formObj.installDatePlan)) {
                    iserror = true;
                    this.errorMsg = '排产日期不能为空';
                }

                if(!iserror) {
                    this.errorMsg = ""
                }

                return iserror;
            },
            editWithItem(data) {
                _this.modifyDialogVisible = true;
                _this.selectedItem = copyObject(data);
                _this.isError = false;
                _this.modifyForm = copyObject(_this.selectedItem);


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

            getWorkTask()
            {
                $.ajax({
                    url: HOST + "task/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data.list.length > 0) {
                                _this.workTaskList = [];
                                res.data.list.forEach(item=> {
                                    _this.workTaskList.push({
                                        id: item.id,
                                        taskName: item.taskName,
                                    })
                                });
                            }
                        }
                    }
                })
            },

            //总装各组
            getInstallWholeGroupData() {
                //_this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
                if (_this.groupList != null && _this.groupList.length > 0) {
                    return;
                }
                $.ajax({
                    url: HOST + "/install/group/getInstallGroupByType",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        type: INSTALLTYPE.ALL,
                    },
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


//            requestMachineListByOrderNum(orderId) {
//                $.ajax({
//                    url: HOST + "machine/selectMachines",
//                    type: "POST",
//                    dataType: "JSON",
//                    data: {
//                        order_id: orderId
//                    },
//                    success: function (res) {
//                        if (res.code == 200) {
//                            _this.machineListByOrderNum = [];
//                            res.data.forEach(item => {
//                                _this.machineListByOrderNum.push({
//                                    value: item.nameplate
//                                });
//                            });
//                        }
//                    }
//                });
//            },
            queryMachine(queryString, check) {
                //缓存加载
                var results = _this.machineListByOrderNum;
                if (queryString) {
                    results = _this.machineListByOrderNum.filter(
                            this.createStateFilter(queryString)
                    );
                }
//                clearTimeout(_this.machineListByOrderNumTimeout);
//                _this.machineListByOrderNumTimeout = setTimeout(() => {
//                    check(results);
//                }, 800 * Math.random());


            },
            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd");
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
            filterCompletionRate(headCountDone, headNum) {
                /**
                 * 有部分headNum形式为11+2，需要先计算
                 */
                //去空格
                let a = headNum.replace(/\s*/g,"");
                let b = a.split("+");
                let c = 0;
                if (b.length == 1) {
                    c = b;
                } else {
                    c = parseInt(b[0]) + parseInt(b[1]);
                }
                let rate = (headCountDone / c) * 100;
                let res = rate.toFixed(0);
                return res;
            }
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.getInstallWholeGroupData();
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
    .el-input{
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

