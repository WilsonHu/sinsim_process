<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">


            <div align="right" style="margin-bottom: 20px">
                <el-button
                        icon="el-icon-plus"
                        size="normal"
                        type="primary"
                        @click="addDialogShow">安装项
                </el-button>
            </div>
            <el-table

                    :data="tableData"
                    border
                    style="width: 100%;"
                    @selection-change="handleSelectionChange" v-loading="listLoading">
                <!--<el-table-column-->
                <!--type="selection"-->
                <!--align="center"-->
                <!--width="55">-->
                <!--</el-table-column>-->
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">{{ scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column label="工作名称" align="center">
                    <template scope="scope">{{ scope.row.taskName }}</template>
                </el-table-column>
                <el-table-column label="工作小组" align="center">
                    <template scope="scope">
                        {{ scope.row.groupId|filterGroup }}
                    </template>
                </el-table-column>
                <el-table-column label="质检员" align="center">
                    <template scope="scope">
                        {{ scope.row.qualityUserId | filterQuality}}
                    </template>
                </el-table-column>
                <el-table-column label="编辑" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-edit"
                                :disabled="cantEdit"
                                @click="editWithItem(scope.$index, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="删除" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                icon="el-icon-delete"
                                type="danger"
                                @click="deleteWithItem(scope.row)">删除
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
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible"
                   append-to-body>
            <span>确认要删除选定的工作内容信息吗？</span>
            <span slot="footer" class="dialog-footer">
      <el-button @click="deleteConfirmVisible = false" icon="el-icon-close">取 消</el-button>
      <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
    </span>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="60%">
            <el-form :model="addForm" label-position="right" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="工作名称：">
                            <el-input type="text"
                                      v-model="addForm.taskName"
                                      placeholder="工作内容名称"
                                      style="width:100%"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工作小组：">
                            <el-select
                                    clearable
                                    v-model="addForm.groupId"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in groupList"
                                        :label="item.groupName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="质检员：">
                            <el-select
                                    clearable
                                    v-model="addForm.qualityUserId"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in qualityUsers"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
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
            <div slot="footer" class="dialog-footer" style="margin-bottom: 70px;margin-top: 30px">
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
    var _this
    export default {
        name: "task_content_manage",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: {},
                queryDataUrl: HOST + "task/list",
                deleteUrl: HOST + "task/delete",
                addUrl: HOST + "task/add",
                editTaskContentUrl: HOST + "task/update",
                groupUrl: HOST + "/install/group/list",
                listLoading: false,
                tableData: [],
                totalNum: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                groupList: [],
                isEdit: true,
                addDialogVisible: false,
                cantEdit: false,
                selectedItem: {},
                addForm: {
                    taskName: "",
                    groupId: "",
                },
                dialogLoading: true,
                deleteConfirmVisible: false,
                deletedItem: {
                    data: [],
                },
                errorMsg: '',
                isError: false,
                dialogTitle: '',
                qualityUsers: []
            }

        },
        methods: {
            handleSelectionChange(val) {
                if (val.length <= 0) {
                    this.cantEdit = false;
                } else {
                    this.cantEdit = true;
                }
                this.multipleSelection = val;
            },
            getStatisticsData() {
                _this.listLoading = true;
                $.ajax({
                    url: _this.queryDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {page: _this.currentPage, size: _this.pageSize},
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

            getAllQualityUsers() {
                $.ajax({
                    url: HOST + "user/selectAllQuality",
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.qualityUsers = res.data.list;
                        }
                    },
                    error: function (res) {
                        showMessage(_this, "获取质检员信息失败!", 0);
                    }
                })
            },
            deleteWithItem(data){
                _this.selectedItem = copyObject(data);
                _this.deleteConfirmVisible = true;
            },
            onConfirmDelete(){
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: parseInt(_this.selectedItem.id)
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "删除成功", 1)
                            _this.getStatisticsData();
                        } else {
                            showMessage(_this, "删除失败", 0)
                        }

                    }
                })
            },
            editWithItem(index, data){
                _this.selectedItem = copyObject(data);
                _this.dialogTitle = "修改工作子项";
                _this.isEdit = true;
                _this.isError = false;
                _this.addForm = copyObject(data);
                _this.addForm.qualityUserId = _this.addForm.qualityUserId == 0 ? "" : _this.addForm.qualityUserId;
                _this.errorMsg = '';
                _this.addDialogVisible = true;

            },
            onEdit(){
                if (!_this.isError) {
                    $.ajax({
                        url: _this.editTaskContentUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "id": _this.addForm.id,
                            "taskName": _this.addForm.taskName,
                            "groupId": _this.addForm.groupId,
                            "qualityUserId": _this.addForm.qualityUserId,
                            "guidance": _this.addForm.guidance,
                        },
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
            addDialogShow(){
                _this.addForm = {};
                _this.dialogTitle = "添加工作子项";
                _this.isEdit = false;
                _this.isError = false;
                _this.errorMsg = '';
                _this.addDialogVisible = true;
            },

            onSubmit()
            {
                if (isStringEmpty(this.addForm.taskName)) {
//				  showMessage(_this, "作业内容不能为空", 0)
                    _this.errorMsg = "作业内容不能为空";
                    _this.isError = true;
                    return;
                }
                if (!_this.isEdit) {
                    _this.onAdd();
                }
                else {
                    _this.onEdit();
                }
            },

            onAdd(){
                if (!_this.isError) {
                    $.ajax({
                        url: _this.addUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "id": 0,
                            "taskName": _this.addForm.taskName,
                            "groupId": _this.addForm.groupId,
                            "qualityUserId": _this.addForm.qualityUserId,
                            "guidance": "",
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, "添加成功", 1)
                                _this.getStatisticsData();
                            } else {
                                showMessage(_this, "添加失败", 0)
                            }
                            _this.addDialogVisible = false;

                        },
                    })
                }
            },


            handleCurrentChange(val) {
                this.currentPage = val;
                this.getStatisticsData();
            },

            getGroupData()
            {
                //_this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
                if (_this.groupList != null && _this.groupList.length > 0) {
                    return;
                }
                $.ajax({
                    url: _this.groupUrl,
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
            }

        },
        filters: {
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

            filterQuality(id) {
                let result = "";
                for (let i = 0; i < _this.qualityUsers.length; i++) {
                    if (_this.qualityUsers[i].id == id) {
                        result = _this.qualityUsers[i].name;
                        break;
                    }
                }
                return result;
            }
        },

        computed: {},
        created: function () {
            _this.getGroupData();
            _this.getStatisticsData();
            _this.getAllQualityUsers();
        },
        mounted: function () {

        },
    }

</script>
<style>

</style>
