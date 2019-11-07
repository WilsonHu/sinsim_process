<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <div align="right" style="margin-bottom: 20px">
                <el-button
                    icon="el-icon-plus"
                    size="normal"
                    type="primary"
                    @click="handleAdd">签核流程</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        width="60"
                        prop="id"
                        label="序号">
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                </el-table-column>
                <el-table-column
                        prop="processName"
                        width="200"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="processContent"
                        label="签核流程">
                    <template slot-scope="scope">
                        <el-tag v-for="item in JSON.parse(scope.row.processContent)"
                                :type="getRoleNameById(item.roleId) === '总经理' ? 'danger' : 'primary'"
                                style="margin-left: 10px">{{getRoleNameById(item.roleId)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                                size="small"
                                type="danger"
                                icon="el-icon-delete"
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
                        :total="totalNum">
                </el-pagination>
            </div>
        </el-col>
        <el-dialog title="添加签核流程" :visible.sync="addDialogVisible" width="60%">
            <el-form :model="form">
                <el-col :span="20">
                    <el-form-item label="名称：" :label-width="formLabelWidth" style="width: 50%">
                        <el-input  v-model="form.processName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button
                        type="primary"
                        class="el-icon-plus"
                        @click="handleAddRole">签核角色</el-button>
                </el-col>
                <el-col :span="24">
                    <el-col :span="23">
                        <el-table
                                border
                                :data="form.processContent"
                                style="margin-left: 30px;margin-bottom: 30px">
                            <el-table-column
                                    label="签核顺序"
                                    width="80">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.number}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="签核角色">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.roleId" placeholder="请选择">
                                        <el-option
                                                v-for="item in allRoles"
                                                :key="item.id"
                                                :label="item.roleName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="签核类型">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.signType" placeholder="请选择">
                                        <el-option
                                                v-for="item in signTypes"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="handleDeleteRole(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSignProcess">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑签核流程" :visible.sync="modifyDialogVisible" width="60%">
            <el-form :model="modifyForm">
                <el-col :span="20">
                    <el-form-item label="名称：" :label-width="formLabelWidth" style="width: 35%">
                        <el-input  v-model="modifyForm.processName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button
                            type="primary"
                            class="el-icon-plus"
                            @click="handleEditAddRole">签核角色</el-button>
                </el-col>
                <el-col :span="24">
                    <el-col :span="23">
                        <el-table
                                border
                                :data="modifyForm.processContent"
                                style="margin-left: 30px;margin-bottom: 30px">
                            <el-table-column
                                    label="签核顺序"
                                    width="80">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.number}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="签核角色">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.roleId" placeholder="请选择">
                                        <el-option
                                                v-for="item in allRoles"
                                                :key="item.id"
                                                :label="item.roleName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="签核类型">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.signType" placeholder="请选择">
                                        <el-option
                                                v-for="item in signTypes"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="handleEditDeleteRole(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-col>
            </el-form>
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button>
                <el-button type="primary" @click="modifySignProcess" icon="el-icon-check">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="20%" >
		  <span >确认要删除[ <b >{{selectedItem.processName}}</b > ]的签核流程吗？</span >
		  <span slot="footer" class="dialog-footer" >
		    <el-button @click="deleteConfirmVisible = false" icon="el-icon-close">取 消</el-button >
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
        name:"sign_process",
        components: {},
        data () {
            _this = this;
            return {
                tableData: [],

                isError: false,
                errorMsg: '',
                //分页
                totalNum: 1,
                pageSize: EveryPageNum,//每一页的num
                currentPage:1,
                startRow: 1,

                //增加对话框
                addDialogVisible: false,
                form: {
                    processName: "",
                    processContent:[{number:1, roleId:"", signType:""}]
                },
                formLabelWidth: '100px',

                //编辑对话框
                modifyDialogVisible: false,
                modifyForm: {
                    id:"",
                    processName: "",
                    processContent:[]
                },
                selectedItem: {},
                deleteConfirmVisible: false,

                //所有角色
                allRoles:"",
                //签核类型
                signTypes:["需求单签核", "联系单签核"]
            }
        },
        methods: {
            //获取所有签核流程
            fetchSignProcesses(){
                $.ajax({
                    url: HOST + "sign/process/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {"size": _this.pageSize,"page":_this.currentPage},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableData = data.data.list;
                            _this.totalNum = data.data.total;
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
                _this.fetchSignProcesses();
            },
            handleAdd() {
                //先清除
                this.form.processName = "";
                this.form.processContent = [];
                this.addDialogVisible = true;
            },

            addSignProcess() {
                _this.isError = _this.validateForm(_this.form);
                if(!_this.isError) {
                    $.ajax({
                        url: HOST + "sign/process/add",
                        type: 'POST',
                        dataType: 'json',
                        data: {'signProcess': JSON.stringify(_this.form)},
                        success: function (data) {
                            _this.isError = data.status == 0;
                            if (!_this.isError) {
                                _this.addDialogVisible = false;
                                _this.fetchSignProcesses();
                                showMessage(_this, '添加签核流程成功', 1);
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
                }
            },

            handleEdit(item) {
                this.modifyForm.id = item.id;
                this.modifyForm.processName = item.processName;
                this.modifyForm.processContent = JSON.parse(item.processContent);
                _this.modifyDialogVisible = true;
            },

            handleAddRole(){
                this.form.processContent.push({number:this.form.processContent.length+1, roleId:""});
            },

            handleEditAddRole(){
                this.modifyForm.processContent.push({number:this.modifyForm.processContent.length+1, roleId:""});
            },

            handleDeleteRole(index) {
                for(var i=0; i< this.form.processContent.length; i++) {
                    if(index == i) {
                        this.form.processContent.splice(i, 1);
                        break;
                    }
                }
            },

            handleEditDeleteRole(index) {
                for(var i=0; i< this.modifyForm.processContent.length; i++) {
                    if(index == i) {
                        this.modifyForm.processContent.splice(i, 1);
                        break;
                    }
                }
            },

            modifySignProcess() {
                $.ajax({
                    url: HOST + "sign/process/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {'signProcess': JSON.stringify(_this.modifyForm)},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.modifyDialogVisible = false;
                            _this.fetchSignProcesses();
                            showMessage(_this, '修改签核流程成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = '改签核流程失败！'
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
                    url: HOST + "sign/process/delete",
                    type: 'POST',
                    dataType: 'json',
                    data: {"id":item.id},
                    success: function (data) {
                        if (data.code == 200) {
                            showMessage(_this, '删除签核流程成功', 1);
                            _this.fetchSignProcesses();
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
            //获取所有role
            fetchRoles(){
                $.ajax({
                    url: HOST + "role/list",
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            _this.allRoles = data.data.list;
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                })
            },

            getRoleNameById(roleId) {
                let found = false;
                let result = "";
                for(let i=0; i< _this.allRoles.length && !found; i++) {
                    if(_this.allRoles[i].id == roleId) {
                        found = true;
                        result = _this.allRoles[i].roleName;
                    }
                }
                return result;
            },

            validateForm(formObj) {
                var iserror = false;

                if (!iserror && isStringEmpty(formObj.processName)) {
                    iserror = true;
                    this.errorMsg = '签核流程名不能为空！';
                }
                if (!iserror && formObj.processContent.length == 0) {
                    iserror = true;
                    this.errorMsg = '签核角色为空！';
                } else {
                    var hasEmpty = false;
                    for(var i=0; i<formObj.processContent.length && !hasEmpty; i++) {
                        if(formObj.processContent[i].roleId == null || formObj.processContent[i].roleId == "") {
                            hasEmpty = true;
                            break;
                        }
                    }
                    if(hasEmpty) {
                        iserror = true;
                        this.errorMsg = '有签核项角色为空！';
                    }
                }
                return iserror;
            },

        },
        computed: {

        },

        filters:{

        },

        created: function () {

        },
        mounted: function () {
            _this.fetchSignProcesses();
            _this.fetchRoles();
        }
    }
</script>
<style>

</style>
