<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-row>
            <el-col :span="20">
                <el-form :model="filters" label-position="right" label-width="60px">
                    <el-col :span="4">
                        <el-form-item label="异常:">
                            <el-select v-model="filters.abnormalType" clearable>
                                <el-option
                                        v-for="item in abnormalList"
                                        v-bind:value="item.id"
                                        v-bind:label="item.abnormalName">
                                </el-option>
                            </el-select>
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
                        <el-form-item label="状态:"
                                      clearable>
                            <el-select v-model="filters.finishStatus" clearable>
                                <el-option
                                        v-for="item in statusList"
                                        v-bind:value="item.value"
                                        v-bind:label="item.text">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="创建时间:" label-width="100px">
                            <el-date-picker
                                    v-model="filters.selectDate"
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
                </el-form>
            </el-col>
            <el-col :span="2">
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
        <el-col class="well well-lg" style="background-color: white;">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%;"
                    v-loading="listLoading">
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">{{ scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column label="异常类型" align="center">
                    <template scope="scope">{{ scope.row.abnormalType | filterAbnormal }}</template>
                </el-table-column>
                <el-table-column label="工序" align="center">
                    <template scope="scope">
                        {{ scope.row.taskRecord.taskName }}
                    </template>
                </el-table-column>
                <el-table-column label="提交者" align="center">
                    <template scope="scope">
                        {{ scope.row.submitUser | filterUser}}
                    </template>
                </el-table-column>
                <el-table-column label="解决者" align="center">
                    <template scope="scope">
                        {{ scope.row.solutionUser | filterUser}}
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
                        label="解决时间">
                    <template scope="scope">
                        <div>
                            {{formatDate(scope.row.solveTime)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-edit"
                                @click="editWithItem(scope.$index, scope.row)">操作
                        </el-button>
                    </template>
                </el-table-column>
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
        <el-dialog title="查看/解决异常" :visible.sync="addDialogVisible" width="60%">
            <el-form :model="addForm" label-position="right" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="异常类型：">
                            <el-select type="text"
                                       v-model="addForm.abnormalType"
                                       style="width:100%"
                                       disabled>
                                <el-option
                                        v-for="item in abnormalList"
                                        :key="item.id"
                                        :label="item.abnormalName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序：">
                            <el-input type="text"
                                      v-model="addForm.taskRecord.taskName"
                                      style="width:100%"
                                      disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提交者：">
                            <el-select type="text"
                                       v-model="addForm.submitUser"
                                       style="width:100%"
                                       disabled>
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="异常描述:">
                            <el-input v-model="addForm.comment"
                                      type="textarea"
                                      :rows="5"
                                      style="width: 100%;"
                                      disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="解决者：">
                            <el-select type="text"
                                       v-model="addForm.solutionUser"
                                       clearable
                                       style="width:100%">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="异常解决:">
                            <el-input v-model="addForm.solution"
                                      type="textarea"
                                      :rows="5"
                                      style="width: 100%;">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon>
            </el-alert>
            <div slot="footer" class="dialog-footer" style="margin-bottom: 50px;">
                <el-col :span="24" style="margin-top: 10px;margin-bottom: 10px">
                    <el-button type="primary" @click="onSubmit" icon="el-icon-check">确 定</el-button>
                    <el-button type="danger" @click="addDialogVisible = false" icon="el-icon-close">取 消</el-button>
                </el-col>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Notification} from 'element-ui'
    var _this;
    export default {
        name: "task_content_manage",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: {},
                queryDataUrl: HOST + "/abnormal/record/selectAbnormalRecordDetailList",
                deleteUrl: HOST + "task/delete",
                addUrl: HOST + "task/add",
                editTaskContentUrl: HOST + "task/update",
                userListUrl: HOST + "/user/selectUsers",
                listLoading: false,
                tableData: [],
                totalNum: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                userList: [],
                addDialogVisible: false,
                addForm: {
                    id: "",
                    solution: "",
                    submitUser: "",
                    taskRecord: {
                        taskName: ""
                    }
                },
                dialogLoading: true,
                deleteConfirmVisible: false,
                errorMsg: '',
                isError: false,
                abnormalList: {},
                taskList: {},
                filters: {
                    abnormalType: "",
                    taskName: "",
                    finishStatus: "",
                    selectDate: [new Date(), new Date()]
                },
                statusList: [
                    {text: "解决", value: 1},
                    {text: "未解决", value: 2},
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
            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss");
            },
            exportData() {
                var condition = {
                    abnormalType:_this.filters.abnormalType,
                    taskName:_this.filters.taskName,
                    finishStatus: _this.filters.finishStatus,
                    queryStartTime: '',
                    queryFinishTime: '',
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if(_this.filters.selectDate != null && _this.filters.selectDate[0] != null) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                }
                if(_this.filters.selectDate != null && _this.filters.selectDate[1] != null) {
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "abnormal/record/export",
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, res.data, 1);
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
                    abnormalType:_this.filters.abnormalType,
                    taskName:_this.filters.taskName,
                    finishStatus: _this.filters.finishStatus,
                    queryStartTime: '',
                    queryFinishTime: '',
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if(_this.filters.selectDate != null && _this.filters.selectDate[0] != null) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                }
                if(_this.filters.selectDate != null && _this.filters.selectDate[1] != null) {
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: _this.queryDataUrl,
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
                if(_this.addForm.solutionUser == 0) {
                    _this.addForm.solutionUser = null;
                }
                _this.errorMsg = '';
                _this.addDialogVisible = true;

            },
            submit(){
                if (!_this.isError) {
                    let abnormalRecord = {
                        id: _this.addForm.id,
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
                }
            },

            onSubmit()
            {
                if (_this.addForm.solutionUser == null || _this.addForm.solutionUser == "") {
                    _this.errorMsg = "异常解决者不能为空！";
                    _this.isError = true;
                    return;
                } else if (isStringEmpty(_this.addForm.solution)) {
                    _this.errorMsg = "解决问题不能为空！";
                    _this.isError = true;
                    return;
                } else {
                    _this.submit();
                }
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
                    data: {},
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
            }
        },

        computed: {},
        created: function () {
            _this.getUserList();
            _this.getStatisticsData();
            _this.getAbnormalList();
            _this.getTaskList();
        },
        mounted: function () {

        },
    }

</script>
<style>

</style>
