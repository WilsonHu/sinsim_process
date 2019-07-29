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
                        <el-form-item label="日期:">
                            <el-date-picker v-model="filters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="4" :offset="14">
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
                                 prop="orderNum"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.groupName}}
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
        <el-dialog title="新增总装排产" :visible.sync="addDialogVisible" append-to-body width="70%">
            
            <el-form :model="addForm" >
                <el-row>
                <el-col :span="8">
                    <el-form-item label="日期：" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="addForm.createDate"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8" >
                    <el-form-item label="订单号：" :label-width="formLabelWidth"> 
                        <el-input v-model="addForm.orderId" @change="onOrderChanged" clearable></el-input>
                    </el-form-item>
                </el-col >
                <el-col :span="8">
                <el-form-item label="机器号：" :label-width="formLabelWidth">
                    <el-select v-model="addForm.machineId" placeholder="根据订单号自动提供选择" clearable>
                        <el-option v-for="item in machineList" :key="item.id" :label="item.machineStrId" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8" >
                    <el-form-item label="安装组："  :label-width="formLabelWidth">
                        <el-select v-model="addForm.groupId" placeholder="安装组" clearable>
                            <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.groupName">
                            </el-option>
                        </el-select>
                    </el-form-item >
                </el-col >
                <el-col :span="8" >
                    <el-form-item label="头数："  :label-width="formLabelWidth">
                        <el-input v-model="addForm.headCount" @change="onChange" clearable></el-input>
                    </el-form-item >
                </el-col >
                <el-col :span="8" >
                    <el-form-item label="针数："  :label-width="formLabelWidth">
                        <el-input v-model="addForm.location" @change="onChange" clearable></el-input>
                    </el-form-item >
                </el-col >
                 <el-col :span="23" :offset="1">
                    <el-form-item label="备注信息：" prop="desc">
                        <el-input type="textarea" v-model="addForm.cmtSend" :rows="5"></el-input>
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
                <el-button @click="addDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button >
                <el-button type="primary" @click="onAdd" icon="el-icon-check">确 定</el-button >
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
                groupList:[],
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
                formLabelWidth: '120px',
                machineListByOrderNum:[],
                machineListByOrderNumTimeout: null,
                machineList:[],
            }

        },
        methods: {
            onOrderChanged(orderId)
            {
                 _this.machineList=[];
                if(isStringEmpty(orderId))
                {
                    _this.addForm.machineId='';
                    return;
                }
                $.ajax({
                    url: HOST + "machine/selectMachines",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        order_id:orderId,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                           _this.machineList=res.data.list;
                           if(_this.machineList.length==1)
                           {
                               _this.addForm.machineId= _this.machineList[0].id
                           }
                        }
                    }
                })  
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
                    type:INSTALLTYPE.ALL,
                    installGroupName: _this.filters.groupName,
                    // query_start_time: '',
                    // query_finish_time: '',
                    //status: _this.filters.status,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                // if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                //     condition.query_start_time = _this.filters.selectDate[0].format("yyyy-MM-dd");
                //     condition.query_finish_time = _this.filters.selectDate[1].format("yyyy-MM-dd");
                // }
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
                _this.addDialogVisible=true;
            },

            onAdd()
            {

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


            requestMachineListByOrderNum(orderId) {
                $.ajax({
                    url: HOST + "machine/selectMachines",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        order_id: orderId
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.machineListByOrderNum = [];
                            res.data.forEach(item => {
                                _this.machineListByOrderNum.push({
                                    value: item.nameplate
                                });
                            });
                        }
                    }
                });
            },
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
            filterCompletionRate(headCountDone,headNum) {
                let rate = (headCountDone/headNum)*100;
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
             _this.getGroupData();
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

