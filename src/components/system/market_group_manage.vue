<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <div align="right" style="margin-bottom: 20px">
                <el-button
                    icon="el-icon-plus"
                    size="normal"
                    type="primary"
                    @click="handleAdd">部门</el-button>
            </div>
<!--///2020-0303 销售组 改为 部门，代码里名称不改。-->
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        width="75"
                        prop="id"
                        align="center"
                        label="序号">
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="groupName"
                        label="部门名称">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200"
                        align="center">
                    <template scope="scope">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                                size="small"
                                icon="el-icon-delete"
                                type="danger"
                                @click="handleDelete(scope.row)">删除</el-button>
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
                        :total="totalPage">
                </el-pagination>
            </div>
        </el-col>
        <el-dialog title="添加部门" :visible.sync="addDialogVisible" width="40%">
            <el-form :model="form">
                <el-col :span="24">
                    <el-form-item label="部门名称：" :label-width="formLabelWidth" style="width: 50%">
                        <el-input  v-model="form.groupName" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addGroup" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑部门" :visible.sync="modifyDialogVisible" width="40%">
            <el-form :model="modifyForm">
                <el-col :span="24">
                    <el-form-item label="部门名称：" :label-width="formLabelWidth" style="width: 50%">
                        <el-input  v-model="modifyForm.groupName" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogVisible = false" type="danger" size="small" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="modifyGroup" size="small" icon="el-icon-check">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="20%" >
		  <span >确认要删除[ <b >{{selectedItem.groupName}}</b > ]的部门吗？</span >
		  <span slot="footer" class="dialog-footer" >
		    <el-button @click="deleteConfirmVisible = false" type="danger" icon="el-icon-close">取 消</el-button >
		    <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button >
		  </span >
		</el-dialog >
    </div>
</template>

<script>
    import Vue from 'vue'
    import routes from '../../config/routes'
    let _this;
    export default {
        name:"market_group_manage",
        components: {},
        data () {
            _this = this;
            return {
                tableData: [],

                isError: false,
                errorMsg: '',
                //分页
                totalPage: 0,
                pageSize: EveryPageNum,//每一页的num
                currentPage:1,
                startRow: 1,

                //增加对话框
                addDialogVisible: false,
                form: {
                    groupName: "",
                    valid: "1",
                },
                formLabelWidth: '100px',

                //编辑对话框
                modifyDialogVisible: false,
                modifyForm: {
                    id:"",
                    groupName: "",
                    valid: "1",
                },
                selectedItem: {},
                deleteConfirmVisible: false,
            }
        },
        methods: {
            //获取所有group
            fetchMarketGroups(){
                $.ajax({
                    url: HOST + "market/group/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {"size": _this.pageSize,"page":_this.currentPage},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableData = data.data.list;
                            _this.totalPage = data.data.total;
                            _this.startRow = data.data.startRow;
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                })
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                _this.fetchMarketGroups();
            },
            handleAdd() {
                this.addDialogVisible = true;
            },

            addGroup() {
                $.ajax({
                    url: HOST + "market/group/add",
                    type: 'POST',
                    dataType: 'json',
                    data: {marketGroup: JSON.stringify(_this.form)},
                    success: function (data) {
                        _this.isError = data.status == 0;
                        if (!_this.isError) {
                            _this.addDialogVisible = false;
                            _this.fetchMarketGroups();
                            showMessage(_this, '添加部门成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = data.message;
                        }
                    },
                    error: function (data) {
                        _this.isError = true;
                        _this.errorMsg = '服务器访问出错';
                    }
                })

            },

            handleEdit(item) {
                this.modifyForm.id = item.id;
                this.modifyForm.groupName = item.groupName;
                this.modifyForm.valid = item.valid;
                _this.modifyDialogVisible = true;
            },

            modifyGroup() {
                $.ajax({
                    url: HOST + "market/group/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {marketGroup: JSON.stringify(_this.modifyForm)},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.modifyDialogVisible = false;
                            _this.fetchMarketGroups();
                            showMessage(_this, '修改部门成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = '修改部门失败！'
                        }
                    },
                    error: function (data) {
                        _this.isError = true;
                        _this.errorMsg = '服务器访问出错！';
                    }
                })

            },

            handleDelete(item) {
                _this.selectedItem = copyObject(item);
                this.deleteConfirmVisible = true;
            },

            onConfirmDelete() {
                this.deleteData(_this.selectedItem);
                _this.deleteConfirmVisible = false;
            },

            deleteData(item) {
                $.ajax({
                    url: HOST + "market/group/delete",
                    type: 'POST',
                    dataType: 'json',
                    data: {"id":item.id},
                    success: function (data) {
                        if (data.code == 200) {
                            showMessage(_this, '删除部门成功', 1);
                            _this.fetchMarketGroups();
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                        _this.deleteConfirmVisible = false;
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问出错！', 0);
                        _this.deleteConfirmVisible = false;

                    }
                })
            },

        },
        computed: {

        },

        filters:{

        },

        created: function () {

        },
        mounted: function () {
            _this.fetchMarketGroups();
        }
    }
</script>
<style>

</style>
