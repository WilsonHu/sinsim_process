<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <div align="right" style="margin-bottom: 20px">
                <el-button
                    icon="el-icon-plus"
                    size="normal"
                    type="primary"
                    @click="handleAdd">设备</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        width="75"
                        align="center"
                        prop="id"
                        label="序号">
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="name"
                        label="设备名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="meid"
                        label="硬件编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="150">
                    <template scope="scope">
                        <el-button
                                size="small"
                                type="primary"
                                @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                                size="small"
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
        <el-dialog title="添加设备" :visible.sync="addDialogVisible" width="40%">
            <el-form :model="form">
                <el-col :span="24">
                    <el-form-item label="设备名称：" :label-width="formLabelWidth" style="width: 35%">
                        <el-input  v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="硬件编号：" :label-width="formLabelWidth" style="width: 60%">
                        <el-input v-model="form.meid"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;background-color: #ff9999"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDevice">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑角色" :visible.sync="modifyDialogVisible" width="40%">
            <el-form :model="modifyForm">
                <el-col :span="24">
                    <el-form-item label="设备名称：" :label-width="formLabelWidth" style="width: 35%">
                        <el-input  v-model="modifyForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="硬件编号：" :label-width="formLabelWidth" style="width: 60%">
                        <el-input v-model="modifyForm.meid"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;background-color: #ff9999"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyDevice">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="20%" >
		  <span >确认要删除[ <b >{{selectedItem.name}}</b > ]的设备吗？</span >
		  <span slot="footer" class="dialog-footer" >
		    <el-button @click="deleteConfirmVisible = false" >取 消</el-button >
		    <el-button type="primary" @click="onConfirmDelete" >确 定</el-button >
		  </span >
		</el-dialog >
    </div>
</template>

<script>
    import Vue from 'vue'
    import routes from '../../config/routes'
    let _this;
    export default {
        name:"device_manage",
        components: {},
        data () {
            _this = this;
            return {
                tableData: [],

                isError: false,
                errorMsg: '',
                //分页
                totalPage: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage:1,
                startRow: 1,

                //增加对话框
                addDialogVisible: false,
                form: {
                    name: "",
                    meid:"",
                    valid: "1",
                },
                formLabelWidth: '100px',

                //编辑对话框
                modifyDialogVisible: false,
                modifyForm: {
                    id:"",
                    name: "",
                    meid:"",
                    valid: "1",
                },
                selectedItem: {},
                deleteConfirmVisible: false,
            }
        },
        methods: {
            //获取所有device
            fetchDevices(){
                $.ajax({
                    url: HOST + "device/list",
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
                _this.fetchDevices();
            },
            handleAdd() {
                this.addDialogVisible = true;
            },

            addDevice() {
                $.ajax({
                    url: HOST + "device/add",
                    type: 'POST',
                    dataType: 'json',
                    data: {'device': JSON.stringify(_this.form)},
                    success: function (data) {
                        _this.isError = data.status == 0;
                        if (!_this.isError) {
                            _this.addDialogVisible = false;
                            _this.fetchDevices();
                            showMessage(_this, '添加设备成功', 1);
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
                this.modifyForm.name = item.name;
                this.modifyForm.meid = item.meid;
                this.modifyForm.valid = item.valid;
                _this.modifyDialogVisible = true;
            },

            modifyDevice() {
                $.ajax({
                    url: HOST + "device/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {'device': JSON.stringify(_this.modifyForm)},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.modifyDialogVisible = false;
                            _this.fetchDevices();
                            showMessage(_this, '修改设备成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = '修改设备信息失败！'
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
                    url: HOST + "device/delete",
                    type: 'POST',
                    dataType: 'json',
                    data: {"id":item.id},
                    success: function (data) {
                        if (data.code == 200) {
                            showMessage(_this, '删除设备成功', 1);
                            _this.fetchDevices();
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
            _this.fetchDevices();
        }
    }
</script>
<style>

</style>
