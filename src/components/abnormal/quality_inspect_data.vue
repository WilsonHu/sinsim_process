<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-form :model="filters" label-position="right" label-width="80px">
            <el-row>

                <el-col :span="4">
                    <el-form-item label="订单号 :">
                        <el-input v-model="filters.orderNumber"
                                  placeholder="订单号"
                                  auto-complete="off"
                                  clearable>
                        </el-input>
                    </el-form-item>
                </el-col>

                <!--<el-col :span="4">-->
                    <!--<el-form-item label="异常:">-->
                        <!--<el-select v-model="filters.abnormalType" clearable>-->
                            <!--<el-option-->
                                    <!--v-for="item in abnormalList"-->
                                    <!--v-bind:value="item.id"-->
                                    <!--v-bind:label="item.abnormalName">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="4">
                    <el-form-item label="机器编号:">
                        <el-input v-model="filters.nameplate"
                                  placeholder="机器编号"
                                  clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="工序:">
                        <el-select v-model="filters.taskName" clearable>
                            <el-option
                                    v-for="item in taskList"
                                    v-bind:value="item.taskName"
                                    v-bind:label="item.taskName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="4">
                    <el-form-item label="提交人:">
                        <el-input v-model="filters.inspectPerson"
                                  placeholder="提交人"
                                  clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="备注:">
                        <el-input v-model="filters.recordRemark"
                                  placeholder="备注信息"
                                  clearable>
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="质检名称:"
                                  clearable>
                        <el-select v-model="filters.inspectName" clearable>
                            <el-option
                                    v-for="item in inspectNameList"
                                    v-bind:value="item.inspectName"
                                    v-bind:label="item.inspectName">
                            </el-option>

                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="质检结果:"
                                  clearable>
                        <el-select v-model="filters.recordStatus" clearable>
                            <el-option
                                    v-for="item in qualityInspectRecordstatusList"
                                    v-bind:value="item.value"
                                    v-bind:label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="质检时间:" label-width="80px">
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
                <el-col :span="2" :offset="4">
                    <el-button
                            icon="el-icon-search"
                            size="normal"
                            type="primary"
                            @click="getStatisticsData">搜索
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button
                            icon="el-icon-upload2"
                            size="normal"
                            type="danger"
                            @click="exportData">导出
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-col class="well well-lg" style="background-color: white;">
            <el-table
                    :data="tableData"
                    border
                    empty-text="暂无数据...（注意：上传机器位置时，生成待质检项。APP提交质检时，更新质检结果）"
                    style="width: 100%;"
                    v-loading="listLoading">
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">{{ scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column label="订单号" align="center">
                    <template scope="scope">{{ scope.row.orderNumber}}</template>
                </el-table-column>
                <el-table-column label="机器编号" align="center">
                    <template scope="scope">{{ scope.row.machineNameplate}}</template>
                </el-table-column>
                <el-table-column label="工序" align="center">
                    <template scope="scope">
                        <span style="color: #409EFF">
                            {{ scope.row.taskName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="质检名称" align="center"  >
                    <template scope="scope">{{ scope.row.inspectName}}</template>
                </el-table-column>
                <el-table-column label="质检结果" align="center"  >
                    <template scope="scope">{{(scope.row.recordStatus)|formatInspectStatus }}</template>
                </el-table-column>
                <el-table-column label="备注" align="center"  >
                    <template scope="scope">{{ scope.row.recordRemark}}</template>
                </el-table-column>
                <el-table-column label="复检结果" align="center"  >
                    <template scope="scope">{{ scope.row.reInspect}}</template>
                </el-table-column>
                <el-table-column label="提交人" align="center">
                    <template scope="scope">
                        {{ scope.row.inspectPerson }}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        width="160"
                        label="创建时间">
                    <template scope="scope">
                        <div>
                            {{formatDate(scope.row.createTime)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        width="160"
                        label="更新时间">
                    <template scope="scope">
                        <div>
                            {{formatDate(scope.row.updateTime)}}
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column width="100" align="center">-->
                    <!--<template scope="scope" style="text-align: center">-->
                        <!--<el-button-->
                                <!--size="small"-->
                                <!--type="primary"-->
                                <!--icon="el-icon-edit"-->
                                <!--@click="editWithItem(scope.$index, scope.row)">操作-->
                        <!--</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <br>
            <div class="block" align="center">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="totalNum">
                </el-pagination>
            </div>
            <br>
        </el-col>
        <!--<el-dialog title="查看/解决异常" :visible.sync="addDialogVisible" width="60%">-->
            <!--<el-form :model="addForm" label-position="right" label-width="100px">-->
                <!--<el-row>-->
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="机器编号：">-->
                            <!--<el-input type="text"-->
                                      <!--v-model="addForm.machine.nameplate"-->
                                      <!--style="width:100%"-->
                                      <!--disabled>-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="异常类型：">-->
                            <!--<el-select type="text"-->
                                       <!--v-model="addForm.abnormalType"-->
                                       <!--style="width:100%">-->
                                <!--<el-option-->
                                        <!--v-for="item in abnormalList"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.abnormalName"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="工序：">-->
                            <!--<el-input type="text"-->
                                      <!--v-model="addForm.taskRecord.taskName"-->
                                      <!--style="width:100%"-->
                                      <!--disabled>-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="提交者：">-->
                            <!--<el-select type="text"-->
                                       <!--v-model="addForm.submitUser"-->
                                       <!--style="width:100%"-->
                                       <!--disabled>-->
                                <!--<el-option-->
                                        <!--v-for="item in userList"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="24">-->
                        <!--<el-form-item label="异常描述:">-->
                            <!--<el-input v-model="addForm.comment"-->
                                      <!--type="textarea"-->
                                      <!--:rows="5"-->
                                      <!--style="width: 100%;"-->
                                      <!--disabled>-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row style="margin-left: 20px;">-->
                    <!--<el-col :span="7" v-for="(item, index) in abnormalImgList" :key="item" :offset="1">-->
                        <!--<el-card style="margin-top: 10px">-->
                            <!--<img style="width: 100%; height: 100%" :src="item" @click="showBigImg(item)">-->
                        <!--</el-card>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row style="margin-top: 10px">-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="解决者：">-->
                            <!--<el-select type="text"-->
                                       <!--v-model="addForm.solutionUser"-->
                                       <!--clearable-->
                                       <!--filterable-->
                                       <!--style="width:100%">-->
                                <!--<el-option-->
                                        <!--v-for="item in userList"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="24">-->
                        <!--<el-form-item label="异常解决:">-->
                            <!--<el-input v-model="addForm.solution"-->
                                      <!--type="textarea"-->
                                      <!--:rows="5"-->
                                      <!--style="width: 100%;">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</el-form>-->
            <!--<el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"-->
                      <!--:title="errorMsg"-->
                      <!--type="error"-->
                      <!--:closable="false"-->
                      <!--show-icon>-->
            <!--</el-alert>-->
            <!--<div slot="footer" class="dialog-footer" style="margin-bottom: 50px;">-->
                <!--<el-col :span="24" style="margin-top: 10px;margin-bottom: 10px">-->
                    <!--<el-button v-show="addForm.solveTime == null || addForm.solveTime == '' " type="primary"-->
                               <!--@click="onSubmit" icon="el-icon-check" :disabled="!isAdmin()">确 定-->
                    <!--</el-button>-->
                    <!--<el-button type="danger" @click="addDialogVisible = false" icon="el-icon-close">取 消</el-button>-->
                <!--</el-col>-->
            <!--</div>-->
            <!--<el-dialog :visible.sync="showBigImgVisible" width="50%" append-to-body>-->
                <!--<el-card style="margin: 2px">-->
                    <!--<img style="width: 100%; height: 100%" :src="bigImgUrl">-->
                <!--</el-card>-->
            <!--</el-dialog>-->
            <!--<el-dialog :visible.sync="confirmSubmitVisible" width="20%" append-to-body>-->
                <!--<span style="font-size: 16px">确认提交解决方案？</span>-->
                <!--<div slot="footer" class="dialog-footer" style="margin-bottom: 50px;">-->
                    <!--<el-col :span="24" style="margin-top: 10px;margin-bottom: 10px">-->
                        <!--<el-button type="primary" @click="onConfirmSubmit" icon="el-icon-check">确 定</el-button>-->
                        <!--<el-button type="danger" @click="confirmSubmitVisible = false" icon="el-icon-close">取 消-->
                        <!--</el-button>-->
                    <!--</el-col>-->
                <!--</div>-->
            <!--</el-dialog>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Notification} from 'element-ui'
    var _this;
    export default {
        name: "quality_inspect_data",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: {},
                userListUrl: HOST + "/user/selectUsers",
                listLoading: false,
                tableData: [],
                totalNum: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                userList: [],


                dialogLoading: true,
                confirmSubmitVisible: false,
                errorMsg: '',
                isError: false,
                abnormalList: {},
                taskList: {},
                filters: {
                    nameplate: "",
                    orderNumber: "",
                    abnormalType: "",
                    taskName: "",
                    finishStatus: 2,
                    selectDate: [new Date(), new Date()],

                    recordStatus:"",
                    inspectName:"",
                    inspectPerson:"",
                    recordRemark:"",
                    reInspect:""
                },
                qualityInspectRecordstatusList: QualityInspectRecordStatusList,
                inspectNameList:{},
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
                abnormalImgList: [],
                showBigImgVisible: false,
                bigImgUrl: ""
            }

        },
        methods: {
            isAdmin(){
                if (_this.userInfo != null && _this.userInfo.role != null) {
                    if (_this.userInfo.role.roleName.indexOf('管理员') != -1) {
                        return true;
                    } else {
                        let abnormalName = "";
                        for (let i = 0; i < _this.abnormalList.length && abnormalName == ""; i++) {
                            if (_this.abnormalList[i].id == _this.addForm.abnormalType) {
                                abnormalName = _this.abnormalList[i].abnormalName;
                            }
                        }
                        if (abnormalName != "" && abnormalName.indexOf("仓库") != -1) {
                            return _this.userInfo.role.roleName.indexOf('采购') != -1;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            },
            showBigImg(src) {
                this.showBigImgVisible = true;
                this.bigImgUrl = src;
            },
            formatDate(timeStamp) {
                if (timeStamp == null || timeStamp == "") {
                    return "";
                } else {
                    return new Date(timeStamp).format("yyyy-MM-dd hh:mm");
                }
            },
            exportData() {
                var condition = {
                    nameplate: _this.filters.nameplate,
                    abnormalType: _this.filters.abnormalType,
                    orderNumber: _this.filters.orderNumber,
                    taskName: _this.filters.taskName,
                    finishStatus: _this.filters.finishStatus,
                    queryStartTime: '',
                    queryFinishTime: ''
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate[0] != null) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                }
                if (_this.filters.selectDate != null && _this.filters.selectDate[1] != null) {
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "quality/inspect/record/export",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            window.location.href = res.data;
                            showMessage(_this, "安装异常导出成功！", 1);
                        }
                        _this.listLoading = false;
                    },
                    error: function (res) {
                        _this.listLoading = false;
                        showMessage(_this, "服务器访问失败!", 0);
                    }
                })

            },

            getStatisticsData() {
                _this.listLoading = true;
                var condition = {
                    nameplate: _this.filters.nameplate,
                    abnormalType: _this.filters.abnormalType,
                    orderNumber: _this.filters.orderNumber,
                    taskName: _this.filters.taskName,
                    recordStatus: _this.filters.recordStatus,
                    inspectName: _this.filters.inspectName,
                    inspectPerson: _this.filters.inspectPerson,
                    recordRemark: _this.filters.recordRemark,
                    reInspect: _this.filters.reInspect,
                    queryStartTime: '',
                    queryFinishTime: '',
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate[0] != null) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                }
                if (_this.filters.selectDate != null && _this.filters.selectDate[1] != null) {
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "quality/inspect/record/selectQualityInspectRecordDetail",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.tableData = res.data.list;
                            _this.totalNum = res.data.total;
                            _this.startRow = res.data.startRow;
                        }
                        _this.listLoading = false;
                    },
                    error: function (res) {
                        _this.listLoading = false;
                        showMessage(_this, "服务器访问失败!", 0);
                    }
                })
            },
            editWithItem(index, data){
                _this.isError = false;
                _this.addForm = copyObject(data);
                if (_this.addForm.solutionUser == 0) {
                    _this.addForm.solutionUser = null;
                }
                _this.abnormalImgList = [];
                if (data.abnormalImage.image != null) {
                    let temp = data.abnormalImage.image.replace('[', '').replace(']', '').split(",");
                    for (let i = 0; i < temp.length; i++) {
                        let tmp = temp[i].split('/');
                        _this.abnormalImgList.push(IP + "/abnormal/" + tmp[tmp.length - 1]);
                    }
                }
                _this.errorMsg = '';
                _this.addDialogVisible = true;

            },
            onConfirmSubmit(){
                if (_this.isError) {
                    return;
                }
                let abnormalRecord = {
                    id: _this.addForm.id,
                    abnormalType:_this.addForm.abnormalType,
                    solution: _this.addForm.solution,
                    solutionUser: _this.addForm.solutionUser
                }
                $.ajax({
                    url: HOST + "abnormal/record/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {abnormalRecord: JSON.stringify(abnormalRecord)},
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "修改成功", 1)
                            _this.getStatisticsData();

                        } else {
                            showMessage(_this, "修改失败", 0)
                        }
                        _this.addDialogVisible = false;

                    },
                })
                this.confirmSubmitVisible = false;
            },

            onSubmit()
            {
                _this.isError = false;
                if (_this.addForm.solutionUser == null || _this.addForm.solutionUser == "") {
                    _this.errorMsg = "异常解决者不能为空！";
                    _this.isError = true;
                    return;
                }
                if (isStringEmpty(_this.addForm.solution)) {
                    _this.errorMsg = "解决问题不能为空！";
                    _this.isError = true;
                    return;
                }
                this.confirmSubmitVisible = true;
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.getStatisticsData();
            },

            getUserList()
            {
                $.ajax({
                    url: _this.userListUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    data: { valid: 1},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.userList = res.data.list;
                        }
                    },
                })
            },
            getAbnormalList() {
                $.ajax({
                    url: HOST + "/abnormal/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.abnormalList = res.data.list;
                        } else {
                            showMessage(_this, res.data.message, 0)
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },

            getInspectNameList(){
                $.ajax({
                    url: HOST + "/quality/inspect/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.inspectNameList = res.data.list;
                        } else {
                            showMessage(_this, res.data.message, 0)
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "服务器访问出错！", 0)
                    }
                })
            },

            getTaskList() {
                $.ajax({
                    url: HOST + "/task/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.taskList = res.data.list;
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
        filters: {
            filterUser(id) {
                let result = "";
                for (let i = 0; i < _this.userList.length; i++) {
                    if (_this.userList[i].id == id) {
                        result = _this.userList[i].name;
                        break;
                    }
                }
                return result;
            },
            filterAbnormal(id) {
                let result = "";
                for (let i = 0; i < _this.abnormalList.length; i++) {
                    if (_this.abnormalList[i].id == id) {
                        result = _this.abnormalList[i].abnormalName;
                        break;
                    }
                }
                return result;
            },

            formatInspectStatus(recordStatus) {
                var result = _this.qualityInspectRecordstatusList[0].name;
                for (var i = 0; i < _this.qualityInspectRecordstatusList.length; i++) {
                    if (recordStatus == _this.qualityInspectRecordstatusList[i].value) {
                        result = _this.qualityInspectRecordstatusList[i].name;
                        break;
                    }
                }
                return result;
            },
        },

        computed: {},
        created: function () {
            this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userInfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.getUserList();
            _this.getStatisticsData();
            _this.getAbnormalList();
            _this.getTaskList();
            _this.getInspectNameList();
        },
        mounted: function () {

        },
    }

</script>
<style>
    .el-select {
        width: 100%;
    }

    .el-date-picker {
        width: 100%;
    }
</style>
