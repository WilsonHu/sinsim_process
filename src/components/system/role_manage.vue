<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <div align="right" style="margin-bottom: 20px">
                <el-button
                    icon="el-icon-plus"
                    size="normal"
                    type="primary"
                    @click="handleAdd">角色</el-button>
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
                        prop="roleName"
                        label="角色名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="roleDes"
                        label="角色描述">
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
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
            <el-form :model="form">
                <el-col :span="24">
                    <el-form-item label="角色名称：" :label-width="formLabelWidth" style="width: 35%">
                        <el-input  v-model="form.roleName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="角色描述：" :label-width="formLabelWidth" style="width: 60%">
                        <el-input type="textarea" v-model="form.roleDes" :rows="3"></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="text-align: left;margin-left: 20px;margin-bottom:10px; font-weight: bold">
                    权限分配:
                </el-col>
                <el-col :span="24">
                    <el-form-item>
                        <el-row style="background-color: #F9FAFC; border-radius: 5px;">
                            <el-col :span="4" style="margin-left: -20px">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="contractAllChecked"
                                                     @change="handleContractCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">签核管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in contractRoleList" style="list-style: none;" >
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedContractChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="orderAllChecked"
                                                     @change="handleOrderCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">订单管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in orderRoleList" style="list-style: none;" >
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedOrderChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="planAllChecked"
                                                     @change="handlePlanCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">计划管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in planRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedPlanChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="abnormalAllChecked"
                                                     @change="handleAbnormalCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">异常管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in abnormalRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedAbnormalChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="taskAllChecked"
                                                     @change="handleTaskCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">流程管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in taskRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedTaskChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="systemAllChecked"
                                                     @change="handleSystemCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">系统管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in systemRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedSystemChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                        </el-row>
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
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑角色" :visible.sync="modifyDialogVisible" width="50%">
            <el-form :model="modifyForm">
                <el-col :span="24">
                    <el-form-item label="角色名称：" :label-width="formLabelWidth" style="width: 35%">
                        <el-input  v-model="modifyForm.roleName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="角色描述：" :label-width="formLabelWidth" style="width: 60%">
                        <el-input type="textarea" v-model="modifyForm.roleDes" :rows="3"></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="text-align: left;margin-left: 20px;margin-bottom:10px; font-weight: bold">
                    权限分配:
                </el-col>
                <el-col :span="24">
                    <el-form-item >
                        <el-row style="background-color: #F9FAFC; border-radius: 5px;">
                            <el-col :span="4" style="margin-left: -20px">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="contractAllChecked"
                                                     @change="handleContractCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">签核管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in contractRoleList" style="list-style: none;" >
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedContractChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="orderAllChecked"
                                                     @change="handleOrderCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">订单管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in orderRoleList" style="list-style: none;" >
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedOrderChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="planAllChecked"
                                                     @change="handlePlanCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">计划管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in planRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedPlanChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4" >
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="abnormalAllChecked"
                                                     @change="handleAbnormalCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">异常管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in abnormalRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedAbnormalChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4" >
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="taskAllChecked"
                                                     @change="handleTaskCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">流程管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in taskRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedTaskChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                            <el-col :span="4" >
                                <div style="margin-top: 20px">
                                    <div >
                                        <el-checkbox style="margin-left: 20px"
                                                     v-model="systemAllChecked"
                                                     @change="handleSystemCheckAllChange"></el-checkbox>
                                        <div style="font-weight: bold;  margin-bottom: 20px; display: inline">系统管理</div>
                                    </div>
                                    <ul>
                                        <li v-for=" item in systemRoleList" style="list-style: none;">
                                            <el-checkbox style="font-weight: normal"
                                                         v-model="item.checked"
                                                         @change="handleCheckedSystemChange">{{item.name}}</el-checkbox>
                                        </li>
                                    </ul>
                                </div>
                            </el-col>
                        </el-row>
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
                <el-button type="primary" @click="modifyRole">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" v-model="deleteConfirmVisible" width="20%" >
		  <span >确认要删除[ <b >{{selectedItem.role_name}}</b > ]的角色吗？</span >
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
        name:"role_manage",
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
                    roleName: "",
                    roleDes:"",
                    valid: "1",
                    roleScope: ""
                },
                goAddNotOK:true,
                formLabelWidth: '100px',

                //编辑对话框
                modifyDialogVisible: false,
                modifyForm: {
                    id:"",
                    roleName: "",
                    roleDes:"",
                    valid: "",
                    roleScope: ""
                },
                selectedItem: {},
                deleteConfirmVisible: false,

                //存放权限列表
                contractRoleList:[],
                orderRoleList:[],
                planRoleList:[],
                abnormalRoleList:[],
                taskRoleList:[],
                systemRoleList:[],
                contractAllChecked: false,//全选的checkbox是否checked
                orderAllChecked: false,
                planAllChecked: false,
                abnormalAllChecked: false,
                taskAllChecked: false,
                systemAllChecked: false
            }
        },
        methods: {
            //获取所有role
            fetchRoles(){
                $.ajax({
                    url: HOST + "role/list",
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
                _this.fetchRoles();
            },
            handleAdd() {
                this.resetStatus()
                this.addDialogVisible = true;
            },

            addRole() {
                $.ajax({
                    url: HOST + "role/add",
                    type: 'POST',
                    dataType: 'json',
                    data: {'role': JSON.stringify(_this.form)},
                    success: function (data) {
                        _this.isError = data.status == 0;
                        if (!_this.isError) {
                            _this.addDialogVisible = false;
                            _this.fetchRoles();
                            showMessage(_this, '添加角色成功', 1);
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
                this.resetStatus();
                this.modifyForm.id = item.id;
                this.modifyForm.roleName = item.roleName;
                this.modifyForm.roleDes = item.roleDes;
                this.modifyForm.valid = item.valid;
                //解析scope
                this.prepareScopeJsonToObject(item.roleScope);
                _this.modifyDialogVisible = true;
            },

            modifyRole() {
                this.modifyForm.roleScope = this.prepareRoleScopeJson();
                $.ajax({
                    url: HOST + "role/update",
                    type: 'POST',
                    dataType: 'json',
                    data: {'role': JSON.stringify(_this.modifyForm)},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.modifyDialogVisible = false;
                            _this.fetchRoles();
                            showMessage(_this, '修改角色成功', 1);
                        } else {
                            _this.isError = true;
                            _this.errorMsg = '修改角色失败！'
                        }
                    },
                    error: function (data) {
                        _this.isError = true;
                        _this.errorMsg = '服务器访问出错！';
                    }
                })

            },
            resetStatus() {
                this.isError = false;
                this.errorMsg = false;

                let i;
                for(i = 0; i<_this.contractRoleList.length; i++ ){
                    _this.contractRoleList[i].checked = false;
                }
                for(i = 0; i<_this.orderRoleList.length; i++ ){
                    _this.orderRoleList[i].checked = false;
                }
                for(i=0; i<_this.planRoleList.length; i++ ){
                    _this.planRoleList[i].checked = false;
                }
                for(i=0; i<_this.abnormalRoleList.length; i++ ){
                    _this.abnormalRoleList[i].checked = false;
                }
                for(i=0; i<_this.taskRoleList.length; i++ ){
                    _this.taskRoleList[i].checked = false;
                }
                for(i=0; i<_this.systemRoleList.length; i++ ){
                    _this.systemRoleList[i].checked = false;
                }

                this.contractAllChecked = false;//全选的checkbox是否checked
                this.orderAllChecked = false;//全选的checkbox是否checked
                this.planAllChecked = false;
                this.abnormalAllChecked = false;
                this.taskAllChecked = false;
                this.systemAllChecked = false
            },

            handleDelete(item) {
                _this.selectedItem = copyObject(item);
                _this.deleteConfirmVisible = true;
            },
            onConfirmDelete()
            {
                this.deleteData(_this.selectedItem);
                _this.deleteConfirmVisible = false;
            },

            deleteData(item) {
                $.ajax({
                    url: HOST + "role/delete",
                    type: 'POST',
                    dataType: 'json',
                    data: {"id":item.id},
                    success: function (data) {
                        if (data.code == 200) {
                            showMessage(_this, '删除角色成功', 1);
                            _this.fetchRoles();
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

            handleCheckedContractChange() {
                if(this.contractCheckedNum === this.contractRoleList.length) {
                    this.contractAllChecked = true;
                } else {
                    this.contractAllChecked = false;
                }
            },

            handleContractCheckAllChange(){
                if(this.contractAllChecked) {
                    for(let i =0; i<_this.contractRoleList.length; i++) {
                        _this.contractRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<_this.contractRoleList.length; i++) {
                        this.contractRoleList[i].checked = false;
                    }
                }
            },

            handleOrderCheckAllChange(){
                if(this.orderAllChecked) {
                    for(let i =0; i<this.orderRoleList.length; i++) {
                        this.orderRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<this.orderRoleList.length; i++) {
                        this.orderRoleList[i].checked = false;
                    }
                }
            },
            handleCheckedOrderChange() {
                if(this.orderCheckedNum === this.orderRoleList.length) {
                    this.orderAllChecked = true;
                } else {
                    this.orderAllChecked = false;
                }
            },

            handlePlanCheckAllChange(){
                if(this.planAllChecked) {
                    for(let i =0; i<this.planRoleList.length; i++) {
                        this.planRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<this.planRoleList.length; i++) {
                        this.planRoleList[i].checked = false;
                    }
                }
            },
            handleCheckedPlanChange(){
                if(this.planCheckedNum === this.planRoleList.length) {
                    this.planAllChecked = true;
                } else {
                    this.planAllChecked = false;
                }
            },

            handleAbnormalCheckAllChange() {
                if(this.abnormalAllChecked) {
                    for(let i =0; i<this.abnormalRoleList.length; i++) {
                        this.abnormalRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<this.abnormalRoleList.length; i++) {
                        this.abnormalRoleList[i].checked = false;
                    }
                }
            },
            handleCheckedAbnormalChange() {
                if(this.abnormalCheckedNum === this.abnormalRoleList.length) {
                    this.abnormalAllChecked = true;
                } else {
                    this.abnormalAllChecked = false;
                }
            },

            handleTaskCheckAllChange() {
                if(this.taskAllChecked) {
                    for(let i =0; i<this.taskRoleList.length; i++) {
                        this.taskRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<this.taskRoleList.length; i++) {
                        this.taskRoleList[i].checked = false;
                    }
                }
            },
            handleCheckedTaskChange() {
                if(this.taskCheckedNum === this.taskRoleList.length) {
                    this.taskAllChecked = true;
                } else {
                    this.taskAllChecked = false;
                }
            },

            handleSystemCheckAllChange() {
                if(this.systemAllChecked) {
                    for(let i =0; i<this.systemRoleList.length; i++) {
                        this.systemRoleList[i].checked = true;
                    }
                }else {
                    for(let i =0; i<this.systemRoleList.length; i++) {
                        this.systemRoleList[i].checked = false;
                    }
                }
            },
            handleCheckedSystemChange() {
                if(this.systemCheckedNum === this.systemRoleList.length) {
                    this.systemAllChecked = true;
                } else {
                    this.systemAllChecked = false;
                }
            },
            prepareRoleScopeJson() {
                let result = "";
                let contractArr = [];
                let orderArr = [];
                let planArr = [];
                let abnormalArr = [];
                let taskArr = [];
                let systemArr = [];
                for(let i=0; i<this.contractRoleList.length; i++ ){
                    if(this.contractRoleList[i].checked) {
                        contractArr.push(this.contractRoleList[i].path)
                    }
                }
                for(let i=0; i<this.orderRoleList.length; i++ ){
                    if(this.orderRoleList[i].checked) {
                        orderArr.push(this.orderRoleList[i].path)
                    }
                }
                for(let i=0; i<this.planRoleList.length; i++ ){
                    if(this.planRoleList[i].checked) {
                        planArr.push(this.planRoleList[i].path)
                    }
                }
                for(let i=0; i<this.abnormalRoleList.length; i++ ){
                    if(this.abnormalRoleList[i].checked) {
                        abnormalArr.push(this.abnormalRoleList[i].path)
                    }
                }
                for(let i=0; i<this.taskRoleList.length; i++ ){
                    if(this.taskRoleList[i].checked) {
                        taskArr.push(this.taskRoleList[i].path)
                    }
                }
                for(let i=0; i<this.systemRoleList.length; i++ ){
                    if(this.systemRoleList[i].checked) {
                        systemArr.push(this.systemRoleList[i].path)
                    }
                }
                result = JSON.stringify({"contract": contractArr,"order":orderArr, "plan":planArr, "abnormal":abnormalArr, "task":taskArr,"system":systemArr})
                return result
            },

            prepareScopeJsonToObject(scopeStr) {
                if(scopeStr == null || scopeStr == "") return;
                let all;
                try {
                    all = JSON.parse(scopeStr);
                }catch (e) {
                    return;
                }
                let count = 0;
                if(all.contract != null) {
                    for(let i=0; i< this.contractRoleList.length; i++ ){
                        for(let j=0; j<all.contract.length; j++ ) {
                            if(this.contractRoleList[i].path == all.contract[j]){
                                this.contractRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.contractRoleList.length) {
                        this.contractAllChecked = true
                    }
                }

                count = 0;
                if(all.order != null) {
                    for(let i=0; i< this.orderRoleList.length; i++ ){
                        for(let j=0; j<all.order.length; j++ ) {
                            if(this.orderRoleList[i].path == all.order[j]){
                                this.orderRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.orderRoleList.length) {
                        this.orderAllChecked = true
                    }
                }

                count = 0;
                if(all.plan != null) {
                    for(let i=0; i< this.planRoleList.length; i++ ){
                        for(let j=0; j<all.plan.length; j++ ) {
                            if(this.planRoleList[i].path == all.plan[j]){
                                this.planRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.planRoleList.length) {
                        this.planAllChecked = true
                    }
                }

                count = 0;
                if(all.abnormal != null) {
                    for(let i=0; i< this.abnormalRoleList.length; i++ ){
                        for(let j=0; j<all.abnormal.length; j++ ) {
                            if(this.abnormalRoleList[i].path == all.abnormal[j]){
                                this.abnormalRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.abnormalRoleList.length) {
                        this.abnormalAllChecked = true
                    }
                }

                count = 0;
                if(all.task != null) {
                    for(let i=0; i< this.taskRoleList.length; i++ ){
                        for(let j=0; j<all.task.length; j++ ) {
                            if(this.taskRoleList[i].path == all.task[j]){
                                this.taskRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.taskRoleList.length) {
                        this.taskAllChecked = true
                    }
                }

                count = 0;
                if(all.system != null) {
                    for(let i=0; i< this.systemRoleList.length; i++ ){
                        for(let j=0; j<all.system.length; j++ ) {
                            if(this.systemRoleList[i].path == all.system[j]){
                                this.systemRoleList[i].checked = true;
                                count++
                            }
                        }
                    }
                    if(count == this.systemRoleList.length) {
                        this.systemAllChecked = true
                    }
                }
            }
        },
        computed: {

            contractCheckedNum() {
                let num =0;
                for(let i=0; i<this.contractRoleList.length; i++){
                    if (this.contractRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            },
            orderCheckedNum() {
                let num =0;
                for(let i=0; i<this.orderRoleList.length; i++){
                    if (this.orderRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            },
            planCheckedNum() {
                let num =0;
                for(let i=0; i<this.planRoleList.length; i++){
                    if (this.planRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            },
            abnormalCheckedNum() {
                let num =0;
                for(let i=0; i<this.abnormalRoleList.length; i++){
                    if (this.abnormalRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            },
            taskCheckedNum() {
                let num =0;
                for(let i=0; i<this.taskRoleList.length; i++){
                    if (this.taskRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            },
            systemCheckedNum() {
                let num =0;
                for(let i=0; i<this.systemRoleList.length; i++){
                    if (this.systemRoleList[i].checked) {
                        num = num + 1
                    }
                }
                return num
            }
        },

        filters:{

        },

        created: function () {
            //读取路由信息
            for(let i=0; i<routes.length; i++) {
                if(routes[i].path == "/home") {
                    for(let j=0; j<routes[i].children.length; j++) {
                        switch (routes[i].children[j].path) {
                            case "/home/contract":
                                for(let k=0; k<routes[i].children[j].children.length; k++) {
                                    _this.contractRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})
                                }
                                break;
                            case "/home/order":
                                for(let k=0; k<routes[i].children[j].children.length; k++) {
                                    _this.orderRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})
                                }
                                break;
                            case "/home/plan":
                                for(let k=0; k< routes[i].children[j].children.length; k++) {
                                    _this.planRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})
                                }
                                break;
                            case "/home/abnormal":
                                for(let k=0; k< routes[i].children[j].children.length; k++) {
                                    _this.abnormalRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})
                                }
                                break;
                            case "/home/task":
                                for(let k=0; k< routes[i].children[j].children.length; k++) {
                                    _this.taskRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})//checked状态用于存储是否被选中的状态
                                }
                                break;
                            case "/home/system":
                                for(let k=0; k< routes[i].children[j].children.length; k++) {
                                    _this.systemRoleList.push({"path":routes[i].children[j].children[k].path,
                                        "name":routes[i].children[j].children[k].meta,
                                        "checked":0})//checked状态用于存储是否被选中的状态
                                }
                                break;
                        }
                    }
                }
            }

        },
        mounted: function () {
            _this.fetchRoles();
        }
    }
</script>
<style>

</style>
