<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">


            <div align="right" style="margin-bottom: 20px">
                <el-button
                        icon="el-icon-plus"
                        size="normal"
                        type="primary"
                        @click="addDialogShow">异常类型
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading">
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">{{ scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column label="异常名称" align="center">
                    <template scope="scope">{{ scope.row.abnormalName }}</template>
                </el-table-column>
                <el-table-column
                        prop="valid"
                        label="有效性" width="200" align="center"
                        :filters="[{ text: '有效', value: 1 }, { text: '无效', value: 0 }]"
                        :filter-method="filterValidTable"
                        filter-placement="bottom-end">
                    <template scope="scope">
                        <div :class="scope.row.valid | filterValidClass">
                            {{ scope.row.valid | filterValid}}
                        </div>
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
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="30%"
                   append-to-body>
            <span>确认要删除异常类型[ </span>
            <span style="color: red; font-size: 20px; font-weight: bold">{{selectedItem.abnormalName}}</span>
            <span> ]吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteConfirmVisible = false" icon="el-icon-close">取 消</el-button>
              <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="50%">
            <el-form :model="addForm" label-position="right" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="异常名称：">
                            <el-input type="text"
                                      v-model="addForm.abnormalName"
                                      placeholder="异常名称"
                                      style="width:100%"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效性：">
                            <el-select v-model="addForm.valid"
                                       placeholder=""
                                       clearable
                                       style="width: 100%">
                                <el-option
                                        v-for="item in validList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
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
        name: "abnormal_type_manage",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: {},
                queryDataUrl: HOST + "abnormal/list",
                deleteUrl: HOST + "abnormal/delete",
                addUrl: HOST + "abnormal/add",
                editTaskContentUrl: HOST + "abnormal/update",
                listLoading: false,
                tableData: [],
                totalNum: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                validList: ValidList,
                isEdit: true,
                addDialogVisible: false,
                cantEdit: false,
                selectedItem: {},
                addForm: {
                    abnormalName: "",
                    valid: "",
                },
                dialogLoading: true,
                deleteConfirmVisible: false,
                deletedItem: {
                    data: [],
                },
                errorMsg: '',
                isError: false,
                dialogTitle: '',
            }

        },
        methods: {
            filterValidTable(value, row) {
                return row.valid === value;
            },
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
                    data: {page : _this.currentPage, size : _this.pageSize},
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
                _this.dialogTitle = "修改异常";
                _this.isEdit = true;
                _this.isError = false;
                _this.addForm = copyObject(data);
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
                            "abnormalName": _this.addForm.abnormalName,
                            "valid": _this.addForm.valid,
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
                _this.addForm = {
                    abnormalName:"",
                    valid: 1
                };
                _this.dialogTitle = "添加异常";
                _this.isEdit = false;
                _this.isError = false;
                _this.errorMsg = '';
                _this.addDialogVisible = true;
            },

            onSubmit()
            {
                if (isStringEmpty(this.addForm.abnormalName)) {
                    _this.errorMsg = "异常名称不能为空";
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
                            "abnormalName": _this.addForm.abnormalName,
                            "valid": _this.addForm.valid,
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
            }
        },
        filters: {
            filterValid(id) {
                let result = "";
                for (let i = 0; i < _this.validList.length; i++) {
                    if (_this.validList[i].value == id) {
                        result = _this.validList[i].name;
                        break;
                    }
                }
                return result;
            },
            filterValidClass(valid) {
                if(valid == 1) {
                    return "valid-class";
                }else {
                    return "invalid-class";
                }
            }
        },

        computed: {},
        created: function () {
            _this.getStatisticsData();
        },
        mounted: function () {

        },
    }

</script>
<style>
    .valid-class {
        color: green;
        font-weight: bold;
    }
    .invalid-class {
        color: red;
        font-weight: bold;
    }
</style>
