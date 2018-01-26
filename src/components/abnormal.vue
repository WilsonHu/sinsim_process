<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <div >
        <el-col class="well well-lg" style="background-color: white;">
            <el-row>
                <el-col>
                    <el-form :model="filters" label-position="right" label-width="60px">
                        <el-col :span="4">
                            <el-form-item label="账号:">
                                <el-input v-model="filters.account"
                                          placeholder="账号"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="姓名:">
                                <el-input v-model="filters.name"
                                          placeholder="姓名"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="角色:">
                                <el-select v-model="filters.role_name" clearable>
                                    <el-option
                                            v-for="item in allRoles"
                                            v-bind:value="item.role_name"
                                            v-bind:label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="状态:">
                                <el-select v-model="filters.role_name" clearable>
                                    <el-option
                                            v-for="item in allRoles"
                                            v-bind:value="item.role_name"
                                            v-bind:label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form>
                    <el-col :span="3" style="margin-left: 25px">
                        <el-button
                                icon="el-icon-search"
                                size="normal"
                                type="primary"
                                @click="search" >搜索
                        </el-button >
                    </el-col >

                    <el-button style="float: right;"
                               icon="el-icon-plus"
                               size="normal"
                               type="primary"
                               @click="handleAdd" >用户
                    </el-button >


                    <el-table
                            v-loading="loadingUI"
                            element-loading-text="获取数据中..."
                            :data="tableData"
                            border
                            style="width: 99%;margin-left: 12px" >
                        <el-table-column
                                width="50"
                                label="序号" >
                            <template scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="200"
                                prop="account"
                                label="账号">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>

                        <el-table-column
                                prop="role_name"
                                label="角色" >
                        </el-table-column >
                        <el-table-column label="操作" width="200" >
                            <template scope="scope" >
                                <el-button
                                        size="small"
                                        type="primary"
                                        @click="handleEdit(scope.$index, scope.row)" >编辑
                                </el-button >
                                <el-button
                                        size="small"
                                        type="danger"
                                        :disabled="scope.row.account=='admin'"
                                        @click="handleDelete(scope.$index, scope.row)" >删除
                                </el-button >
                            </template >
                        </el-table-column >
                    </el-table >
                    <div class="block" style="text-align: center; margin-top: 20px" >
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-size="pageSize"
                                layout="prev, pager, next, jumper"
                                :total="totalRecords" >
                        </el-pagination >
                    </div >
                </el-col >
            </el-row >
        </el-col>
        <el-dialog title="增加用户" :visible.sync="addDialogVisible">
            <el-form :model="form" >

                <el-col :span="12">
                    <el-form-item label="账号(工号)：" :label-width="formLabelWidth">
                        <el-input v-model="form.account" @change="onChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户名：" :label-width="formLabelWidth">
                        <el-input v-model="form.name" @change="onChange"></el-input>
                    </el-form-item>
                </el-col >
                <el-col :span="12">
                    <el-form-item label="密码：" :label-width="formLabelWidth">
                        <el-input v-model="form.password" @change="onChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="确认密码：" :label-width="formLabelWidth">
                        <el-input v-model="form.confirmpwd" @change="onChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="角色：" :label-width="formLabelWidth" >
                        <el-select v-model="form.role_name" @change="onChange" clearable>
                            <el-option
                                    v-for="item in allRoles"
                                    v-bind:value="item.role_name"
                                    v-bind:label="item.name" >
                            </el-option >
                        </el-select >
                    </el-form-item >
                </el-col >
                <el-col :span="12" >
                    <el-form-item label="资质：" :label-width="formLabelWidth" >
                        <template scope="scope" >
                            <el-select v-model="form.qualification"
                                       multiple
                                       filterable
                                       placeholder="请选择资质" >
                                <el-option
                                        v-for="item in allQualification"
                                        :label="item.name"
                                        :value="item.name" >
                                </el-option >
                            </el-select >
                        </template >
                    </el-form-item >
                </el-col >
            </el-form >
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;background-color: #ff9999"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer" style="margin-bottom: 20px" >
                <el-button @click="addDialogVisible = false" >取 消</el-button >
                <el-button type="primary" @click="onAdd" >确 定</el-button >
            </div >
        </el-dialog >

        <el-dialog title="编辑用户" :visible.sync="modifyDialogVisible" >
            <el-form :model="modifyForm" >
                <el-col :span="12" >
                    <el-form-item label="账号(工号)：" :label-width="formLabelWidth">
                        <el-input v-model="modifyForm.account" @change="onChange" ></el-input >
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="卡号(饭卡)：" :label-width="formLabelWidth">
                        <el-input v-model="modifyForm.card_id" @change="onChange"></el-input>
                    </el-form-item >
                </el-col >
                <el-col :span="12" >
                    <el-form-item label="用户名：" :label-width="formLabelWidth" >
                        <el-input v-model="modifyForm.name" @change="onChange" ></el-input >
                    </el-form-item >
                </el-col >
                <el-col :span="12">
                    <el-form-item label="密码：" :label-width="formLabelWidth">
                        <el-input v-model="modifyForm.password" @change="onChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="确认密码：" :label-width="formLabelWidth">
                        <el-input v-model="modifyForm.confirmpwd" @change="onChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="角色：" :label-width="formLabelWidth" >
                        <el-select v-model="modifyForm.role_name" @change="onChange" clearable>
                            <el-option
                                    v-for="item in allRoles"
                                    v-bind:value="item.role_name"
                                    v-bind:label="item.name" >
                            </el-option >
                        </el-select >
                    </el-form-item >
                </el-col >
                <el-col :span="12" >
                    <el-form-item label="资质：" :label-width="formLabelWidth" >
                        <template scope="scope" >
                            <el-select v-model="modifyForm.qualification"
                                       multiple
                                       filterable
                                       placeholder="请选择资质" >
                                <el-option
                                        v-for="item in allQualification"
                                        :label="item.name"
                                        :value="item.name" >
                                </el-option >
                            </el-select >
                        </template >
                    </el-form-item >
                </el-col >
            </el-form >
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;background-color: #ff9999"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer" style="margin-bottom: 20px" >
                <el-button @click="modifyDialogVisible = false" >取 消</el-button >
                <el-button type="primary" @click="onEidt" >确 定</el-button >
            </div >
        </el-dialog >

        <el-dialog title="提示" :visible.sync="deleteConfirmVisible"  >
            <span >确认要删除账号为[ <b >{{selectedItem.account}}</b > ]的用户吗？</span >
            <span slot="footer" class="dialog-footer" >
                <el-button @click="deleteConfirmVisible = false" >取 消</el-button >
                <el-button type="primary" @click="onConfirmDelete" >确 定</el-button >
            </span >
        </el-dialog>
    </div >
</template >

<script >
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    export default {
        name: "abnormal",
        components: {},
        data () {
            _this = this;
            return {
                addUrl: HOME + "User/addData",
                editUrl: HOME + "User/modifyData",
                deleteUrl: HOME + "User/deleteData",
                queryCountUrl: HOME + "User/getRecordsCount",
                queryDataUrl: HOME + "User/getRecords",
                isError: false,
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
                queryUserRoleUrl: HOME + "UserRole/getRecords",
                queryQualificationUrl: HOME + "QualificationManage/getRecords",
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRecord: 0,

                //增加对话框
                addDialogVisible: false,
                form: {
                    account: "",
                    card_id: '',
                    name: "",
                    password:"",
                    confirmpwd:"",
                    role_id: "",
                    role_name: "",
                    qualification: [],
                },
                formLabelWidth: '100px',

                //增加对话框
                modifyDialogVisible: false,
                modifyForm: {
                    id: '',
                    account: "",
                    card_id: '',
                    name: "",
                    password:"",
                    confirmpwd:"",
                    role_id: "",
                    role_name: "",
                    qualification: [],
                },
                filters: {
                    name: "",
                    account: "",
                    role_id:"",
                    role_name: "",
                },
                allRoles: [],
                allQualification: [],
                loadingUI: false,
            }
        },
        methods: {
            onChange: function () {
                if (_this.addDialogVisible) {
                    _this.isError = _this.validateForm(_this.form, false);
                }
                else {
                    _this.isError = _this.validateForm(_this.modifyForm, true);
                }

            },


            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.startRecord = this.pageSize * (this.currentPage - 1)
                this.onSearchDetailData();
            },
            search() {
                _this.filters.role_id = _this.roleNametoID(_this.filters.role_name);
                _this.onSearchRecordCounts();
            },
            onSearchDetailData()
            {
                _this.filters.start_record = _this.startRecord;
                _this.filters.page_size = _this.pageSize;
                $.ajax({
                    url: _this.queryDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: _this.filters,
                    success: function (data) {
                        if (data.status) {
                            var dataList = data.info;
                            //list.splice(0, 1);//remove 1 element from index 0
                            _this.tableData = dataList;
                            var userinfo = JSON.parse(sessionStorage.getItem('user'));
                            for(var i=0; i<_this.tableData.length; i++){
                                if(_this.tableData[i].account == "admin" && userinfo != null && userinfo.account != "admin"){
                                    _this.tableData.splice(i, 1);
                                }
                            }
                            //console.log(_this.tableData);
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            onSearchRecordCounts()
            {
                _this.tableData = new Array();
                _this.loadingUI = true;
                $.ajax({
                    url: _this.queryCountUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: _this.filters,
                    success: function (data) {
                        if (data.status) {
                            _this.totalRecords = parseInt(data.info);
                            _this.onSearchDetailData();
                        }
                    },
                })
            },


            handleAdd() {

                var defaultRoleID = "";
                var defaultRoleName = "";

                if (_this.allRoles.length != 0) {
                    defaultRoleName = _this.allRoles[0].role_name;
                    defaultRoleID = _this.allRoles[0].id;
                }

                this.form = {
                    account: "",
                    card_id: '',
                    name: "",
                    role_id: defaultRoleID,
                    role_name: defaultRoleName,
                    qualification: [],
                };

                this.isError = false;
                this.errorMsg = '';
                this.addDialogVisible = true;
            },

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.selectedItem = item;
                this.modifyForm = copyObject(this.selectedItem);
                this.modifyForm.confirmpwd =  this.modifyForm.password;

                this.modifyDialogVisible = true;
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteConfirmVisible = true;
                }
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: _this.selectedItem,
                    success: function (data) {
                        if (data.status > 0) {
                            var index = _this.tableData.indexOf(_this.selectedItem);
                            _this.tableData.splice(index, 1);

                            _this.onSearchRecordCounts();

                            showMessage(_this, '删除成功', 1);
                        } else {
                            showMessage(_this, '删除失败', 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                })
            },

            validateForm(formObj, isEdit)
            {
                var iserror = false;

                if (!iserror && isStringEmpty(formObj.account)) {
                    iserror = true;
                    this.errorMsg = '账号不能为空';
                }
                if (!iserror && isStringEmpty(formObj.card_id)) {
                    iserror = true;
                    this.errorMsg = '卡号不能为空';
                }
                if (!iserror && isStringEmpty(formObj.name)) {
                    iserror = true;
                    this.errorMsg = '姓名不能为空';
                }

                formObj.role_id = this.roleNametoID(formObj.role_name);
                if (!iserror && isStringEmpty(formObj.role_id)) {
                    iserror = true;
                    this.errorMsg = '请选择角色';
                }

                if (!iserror) {
                    if (isStringEmpty(formObj.password)) {
                        iserror = true;
                        this.errorMsg = '密码不能为空';
                    } else if (!isEdit && formObj.password != formObj.confirmpwd) {
                        iserror = true;
                        this.errorMsg = '密码和确认密码不一致';
                    }
                }

                if (formObj.qualification.length == 0) {
                    iserror = true;
                    this.errorMsg = '请选择资质';
                }

                return iserror;
            },

            onAdd() {
                //console.log(this.form);
                this.form.role_id = this.roleNametoID( this.form.role_name);

                _this.isError = this.validateForm(this.form, false);

                if (!_this.isError) {
                    $.ajax({
                        url: _this.addUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: _this.form,
                        success: function (data) {
                            _this.isError = data.status == 0;
                            if (!_this.isError) {
                                _this.addDialogVisible = false;
                                _this.onSearchRecordCounts();
                                showMessage(_this, '添加成功', 1);
                            } else {
                                _this.errorMsg = '添加失败';
                                if (!isUndefined(data.info.errorMsg)) {
                                    _this.errorMsg = data.info.errorMsg;
                                }
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = '服务器访问出错！';
                            _this.isError = true;
                        }
                    })
                }

            },
            onEidt() {
                //this.modifyForm.confirmPwd = this.modifyForm.password;
                this.modifyForm.role_id = this.roleNametoID( this.modifyForm.role_name);

                this.isError = this.validateForm(this.modifyForm, false);
                if (!_this.isError) {
                    $.ajax({
                        url: _this.editUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: _this.modifyForm,
                        success: function (data) {
                            if (!isUndefined(data.info.errorMsg)) {
                                _this.errorMsg = data.info.errorMsg;
                                _this.isError = true;
                                showMessage(_this, _this.errorMsg, 0);//error
                            }
                            else {
                                _this.modifyDialogVisible = false;
                                _this.onSearchDetailData();
                                showMessage(_this, '修改成功', 1);
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = '服务器访问出错！';
                            _this.isError = true;
                        }
                    })
                }
            },


            initAllRoles()
            {
                $.ajax({
                    url: _this.queryUserRoleUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (data) {
                        if (data.status) {
                            _this.allRoles = data.info;
                            //console.log(data.info);
                        }
                    }
                })
            },
            initAllQualification()
            {
                $.ajax({
                    url: _this.queryQualificationUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (data) {
                        if (data.status) {
                            _this.allQualification = data.info;
                            //console.log(data.info);
                        }
                    }
                })
            },

            _toString_ (val){
                return val == null
                        // 如果是null就返回空字符串
                        ? ''
                        : typeof val === 'object'
                        // 如果是object就转成json
                        // 这里比较特殊的是在调用stringify时除了要转换的值，还多传了两个参数，其中第二个参数用来过滤数据，第三个参数用来控制内容的缩进
                        ? JSON.stringify(val, null, 2)
                        // 其他的都是用String来转换为字符串，其实跟调用对象的toString是一样的吧？
                        : String(val);
            },

            roleNametoID(rolename)
            {
                if (isStringEmpty(rolename)) {
                    return '';
                }
                var x;
                var roleid = '';

                for (x in _this.allRoles)
                {
                    if (rolename.indexOf(_this.allRoles[x].role_name)  == 0 && _this.allRoles[x].role_name.indexOf(rolename) ==0 )
                    {
                        roleid =  _this.allRoles[x].id;
                    }
                }

                return _this._toString_(roleid);//roleid.toString();
            }
        },
        computed: {},
        filters: {
            filterWorkGroupName(id) {
                var result = ''
                for (var i = 0; i < _this.allWorkGroup.length; i++) {
                    if (id == _this.allWorkGroup[i].work_group_no) {
                        result = _this.allWorkGroup[i].work_group_name;
                        break;
                    }
                }
                return result;
            },
            filterDepartmentName(id) {
                let result = ''
                for (let i = 0; i < _this.allDepartments.length; i++) {
                    if (id == _this.allDepartments[i].department_no) {
                        result = _this.allDepartments[i].department_name;
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
            this.initAllRoles();
            this.initAllQualification();

        },
        mounted: function () {
            this.onSearchRecordCounts();
        },
    }

</script >
<style >

</style >
