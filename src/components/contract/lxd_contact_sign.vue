<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div>
            <el-row>
                <el-col :span="20">
                    <el-row type="flex" justify="left">
                        <el-col :span="2">
                            <div style="font-size: 14px;color: #909399">审核状态：</div>
                        </el-col>
                        <el-col style="text-align: left">
                            <span v-for="(item, index) in lxdStatusForFilterList">
                            <el-button
                                    size="mini"
                                    :type="item.choosed ? 'primary': '' "
                                    style="margin-left: 8px"
                                    @click="chooseCurrentSignStep(index)"
                            >{{item.name}}</el-button>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="left" style="margin-top: 10px">
                        <el-col :span="2">
                            <div style="font-size: 14px; color: #909399">审核部门：</div>
                        </el-col>
                        <el-col style="text-align: left">
                            <span v-for="(item, index) in lxdSignRoleList">
                                <el-button
                                        size="mini"
                                        :type="item.choosed ? 'primary': '' "
                                        style="margin-left: 8px"
                                        :disabled="!filterIsSigning()"
                                        @click="chooseCurrentSignDepartment(index)"
                                >{{item.name}}</el-button>
                          </span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="2" :offset="2">
                    <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">联系单</el-button>
                </el-col>
            </el-row>
            <el-col class="well well-lg" style="background-color: white; margin-top: 10px">
                <el-row>
                    <el-col>
                        <el-form :model="filters" label-position="right" label-width="80px">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="类型:">
                                        <el-input v-model="filters.contractNum" placeholder="类型" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="合同号:">
                                        <el-input v-model="filters.contractNum" placeholder="合同号" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="发起部门:">
                                        <el-input v-model="filters.applicantDepartment" placeholder="发起部门"
                                                  auto-complete="off" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="创建日期:">
                                        <el-date-picker v-model="filters.selectDate" type="daterange" align="left"
                                                        unlink-panels range-separator="—" start-placeholder="开始日期"
                                                        end-placeholder="结束日期"
                                                        :picker-options="pickerOptions"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" :offset="5">
                                    <el-button icon="el-icon-search" size="normal"
                                               style="float: right; margin-right: -12px" type="primary" @click="search">
                                        查询
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table element-loading-text="获取数据中..." :data="tableData" border show-overflow-tooltip="true"
                                  style="width: 100%;">
                            <el-table-column align="center" width="50" label="序号">
                                <template scope="scope">{{scope.$index+startRow}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="125" prop="contactType"
                                             label="类型"></el-table-column>
                            <el-table-column align="center" label="订单号" min-width="125">
                                <template scope="scope">
                                    <div v-on:click="handleSign(scope.$index, scope.row)" style="font-weight: bold;"
                                         class="btn btn-link">
                                        {{scope.row.orderNum}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="applicantDepartment" label="发起部门"></el-table-column>
                            <el-table-column align="center" prop="applicantPerson" label="发起人"></el-table-column>
                            <el-table-column align="center" prop="status" label="审核状态">
                                <template scope="scope">
                                    <div :class="scope.row.status|filterStatusStyle">
                                        {{filterContactStatus(scope.row.status)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="currentStep" label="审核阶段"></el-table-column>
                            <el-table-column align="center" prop="createTime" width="100" label="创建时间">
                                <template scope="scope">
                                    <div>
                                        {{formatDate(scope.row.createDate)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="100" label="更新时间">
                                <template scope="scope">
                                    <div>
                                        {{scope.row.updateDate != null ? formatDate(scope.row.updateDate) : "/"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="200">
                                <template scope="scope">
                                    <el-tooltip placement="top">
                                        <div slot="content">审核</div>
                                        <el-button v-show="userInfo.role.roleName !='销售员'" size="mini" type="success"
                                                   icon="el-icon-check"
                                                   @click="handleSign(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">编辑</div>
                                        <el-button
                                                v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)"
                                                size="mini" type="primary" icon="el-icon-edit"
                                                @click="handleEdit(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">删除</div>
                                        <el-button
                                                v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)&&(scope.row.status>=5||scope.row.status==0)"
                                                size="mini" type="danger" icon="el-icon-delete"
                                                @click="handleDelete(scope.$index, scope.row)"></el-button>
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
                                    :total="totalNum"
                            ></el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </div>
        <el-dialog :visible.sync="addLxdVisible" fullscreen @close="dialogCloseCallback()">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="24">
                    <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
                        {{dialogTitle}}
                    </div>
                    <el-form>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="联系单类型：" :label-width="formLabelWidth">
                                    <el-select v-model="lxdForm.contactType" placeholder="选择不同类型，会有不同的内容" clearable
                                               @change="handleTypeSelect(lxdForm.contactType)">
                                        <el-option
                                                v-for="item in lxdTypes"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-card class="box-card" style="margin: 25px">
                            <el-form :model="lxdForm">
                                <el-row>
                                    <el-col :span="4">
                                        <el-form-item label="提出部门：" :label-width="longFormLabelWidth">
                                            <el-input v-model="lxdForm.applicantDepartment" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item label="提出人：" :label-width="formLabelWidth">
                                            <el-input v-model="lxdForm.applicantPerson" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="4">
                                        <el-form-item label="申请日期："
                                                      :label-width="longFormLabelWidth">
                                            <el-date-picker
                                                    type="date"
                                                    placeholder="申请日期"
                                                    v-model="lxdForm.createDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item label="ECO希望日期："
                                                      :label-width="longFormLabelWidth"
                                                      v-show="isShowHopeDate">
                                            <el-date-picker
                                                    type="date"
                                                    placeholder="ECO希望完成日期"
                                                    v-model="lxdForm.hopeDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6">
                                        <el-form-item label="合同号：" :label-width="longFormLabelWidth">
                                            <el-input
                                                    v-model="lxdForm.contractNum"
                                                    :readonly="changeLxdContentDisable(lxdForm)"
                                                    placeholder="合同号"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col>
                                        <el-form-item label="变更主题：" :label-width="longFormLabelWidth">
                                            <el-input type="textarea" v-model="lxdForm.contactTitle"
                                                      :rows="1"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="变更内容：" :label-width="longFormLabelWidth">
                                            <el-select v-model="lxdForm.contactContent" placeholder="选择变更内容子类型"
                                                       clearable
                                                       @change="handleChangeContentSelect(lxdForm.contactContent)">
                                                <el-option
                                                        v-for="item in lxdChangeTypes"
                                                        :key="item"
                                                        :label="item"
                                                        :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :offset=1 :span="4">
                                        <el-input v-model="lxdForm.contactContentByInput"
                                                  placeholder="请输入"
                                                  v-show="isShowContactContentInput"></el-input>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <div v-for="item in lxdForm.contentList">
                                        <el-col :span="8">
                                            <el-form-item label="旧状态：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.oldStatus" placeholder="输入变更前的状态"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="新状态：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.newStatus" placeholder="输入变更后的状态"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="备注：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.remark"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-button
                                                    size="mini"
                                                    type="danger"
                                                    class="el-icon-delete"
                                                    @click="onDeleteItem(item)" style="margin-top: 5px;"></el-button>
                                        </el-col>
                                    </div>
                                    <el-col :span="4" :offset="20">
                                        <el-button
                                                type="primary"
                                                class="el-icon-plus"
                                                @click="addChangeItem()">增加变更条目
                                        </el-button>
                                    </el-col>
                                </el-row>

                                <el-row>
                                </el-row>
                            </el-form>
                        </el-card>

                    </el-form>
                    <el-form>
                        <div>
                            <el-button @click="dialogClose()" icon="el-icon-back" type="info" offset="120">关 闭
                            </el-button>
                            <el-button
                                    v-show="mode == ADD_MODE"
                                    type="primary"
                                    @click="onAdd"
                                    icon="el-icon-check"
                                    :disabled="addButtonDisabled"
                            >保 存
                            </el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import Tinymce from '../Tinymce/index.vue';
    import {ConfigData} from '../../config/dataconfig';

    var _this;

    export default {
        name: 'contract_sign',
        components: {
            Tinymce,
            ConfigData
        },
        data() {
            _this = this;
            return {
                editUrl: HOST + 'contact/form/update',
                deleteUrl: HOST + 'contact/form/updateValid',
                isError: false,
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
                SIGN_MODE: 1,
                ADD_MODE: 2,
                EDIT_MODE: 3,
                CHANGE_MODE: 4,
                SPLIT_MODE: 5,
                tableData: [],
                //分页
                totalNum: 1,
                pageSize: EveryPageNum, //每一页的num
                currentPage: 1,
                startRow: 1,

                //增加对话框
                addLxdVisible: false,
                signProcesses: [],
                userInfo: '',

                //联系单内容
                lxdForm: {
                    contactType: '',
                    contractNum: '',
                    applicantDepartment: '',
                    applicantPerson: '',
                    status: LXD_INITIAL,
                    contentList: [],

                },

                addButtonDisabled: false,
                contractSignForms: [{
                    title: '合同签核记录',
                    name: '1',
                    contractSignData: []
                }],

                formLabelWidth: '100px',
                longFormLabelWidth: '120px',

                mode: this.SIGN_MODE,

                dialogTitle: '合同',
                editContract: '',

                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                rejectContractSignResultVisible: false,
                filters: {
                    contactType: '',
                    contractNum: '',
                    //默认审核中
                    status: 1,
                    applicantDepartment: '',
                    applicantPerson: '',
                    selectDate: ''
                },

                allRoles: [],

                // 变更联系单里，“变更内容”下拉选择了“其他，需说明”时 为true.
                isShowContactContentInput: false,

                timeout: null,

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                pickerOptions2: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }]
                },
                lxdSignRoleList: [],
                lxdStatusForFilterList: [],

                LxdStatusList: LxdStatusList,
                lxdStatusList: LxdStatusList,

                lxdTypes: ["变更联系单", "工作联系单"],
                //todo? 可以定制,
                lxdChangeTypes: ["设计变更", "材料变更", "工艺变更", "模具设备", "工艺夹具", "制造场所", "新供应商", "包装运输", "检验方法", "其他变更，需说明"],

                isShowHopeDate: false,

                changeItems: [],
            };

        },
        methods: {
            addChangeItem() {
                _this.lxdForm.contentList.push({
                    id: getGuid(),
                    oldStatus: '',
                    newStatus: '',
                    remark: ''
                });
            },

            checkShow() {
                return false;
            },

            handleTypeSelect(val) {
                if (_this.lxdForm.contactType == "变更联系单") {
                    _this.isShowHopeDate = true;
                } else if (_this.lxdForm.contactType == "工作联系单") {
                    _this.isShowHopeDate = false;
                } else
                    console.log("没有选对");
            },

            // 变更联系单里的变更内容
            handleChangeContentSelect(val) {
                if (_this.lxdForm.contactContent == "其他变更，需说明") {
                    _this.isShowContactContentInput = true;
                } else {
                    _this.isShowContactContentInput = false;
                }

            },


            changeLxdContentDisable(item) {
                return (
                    (item.status != LXD_INITIAL &&
                        item.status != LXD__REJECTED &&
                        item.status != LXD__SPLITED &&
                        item.status != LXD__CHANGED) ||
                    this.mode == this.SIGN_MODE
                );
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format('yyyy-MM-dd');
            },
            filterContactStatus(value) {
                let result = '';
                for (let i = 0; i < _this.lxdStatusList.length; i++) {
                    if (_this.lxdStatusList[i].value == value) {
                        result = _this.lxdStatusList[i].name;
                        break;
                    }
                }

                return result;
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.selectContacts();
            },

            search() {
                this.selectContacts();
            },
            selectContacts() {
                var condition = {
                    id: _this.filters.id,
                    contractNum: _this.filters.contractNum,
                    status: _this.filters.status,
                    applicantDepartment: _this.filters.applicantDepartment,
                    marketGroupName: _this.userInfo.marketGroupName,
                    query_start_time: '',
                    query_finish_time: '',

                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                    _this.filters.selectDate != null &&
                    _this.filters.selectDate.length > 0
                ) {
                    condition.query_start_time = _this.filters.selectDate[0].format(
                        'yyyy-MM-dd'
                    );
                    condition.query_finish_time = _this.filters.selectDate[1].format(
                        'yyyy-MM-dd'
                    );
                }
                $.ajax({
                    url: HOST + 'contact/form/selectContacts',
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (data) {
                        if (data.code == 200) {
                            _this.tableData = data.data.list;
                            _this.totalNum = data.data.total;
                            _this.startRow = data.data.startRow;
                        }
                    }
                });
            },


            handleAdd() {
                this.addLxdVisible = true;
                this.dialogTitle = '新增联系单';
                _this.lxdForm.applicantDepartment = this.userInfo.role.roleName;
                _this.lxdForm.contactType = _this.lxdTypes[0];
                _this.lxdForm.createDate = new Date().format('yyyy-MM-dd hh:mm:ss');
                _this.isShowHopeDate = true;
                _this.mode = _this.ADD_MODE;

            },

            handleSign(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '签核联系单';
                this.mode = this.SIGN_MODE;
                this.editContract = item;
                _this.fetchLxdData(item.id);
                _this.fetchLxdSignData(item.id);
                this.addLxdVisible = true;
            },

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑联系单';

                this.mode = this.EDIT_MODE;
                this.editContract = item;
                _this.fetchLxdData(item.id);
                _this.fetchLxdSignData(item.id);
                this.addLxdVisible = true;
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteConfirmVisible = true;
                }
            },

            onDeleteItem(item) {
                for (var i = 0; i < _this.lxdForm.contentList.length; i++) {
                    if (_this.lxdForm.contentList[i].id == item.id) {
                        _this.lxdForm.contentList.splice(i, 1);
                        break;
                    }

                }
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        orderId: _this.selectedItem.orderId
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.selectContacts();
                            showMessage(_this, '删除联系单成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },
            validContractInfo(formObj, isEdit) {
                //todo
                return iserror;
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //todo
                _this.selectContacts();
            },

            onAdd() {
                //先校验联系单是否正常
                //todo

                $.ajax({
                    url: HOST + 'contact/form/add',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        contract: JSON.stringify(_this.lxdForm),
                        contractSign: JSON.stringify(
                            _this.contractSignForms[0].contractSignData
                        ),
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            _this.addLxdVisible = false;
                            _this.editContract = '';
                            showMessage(_this, '添加成功', 1);
                            _this.selectContacts();
                        } else {
                            _this.errorMsg = res.message;
                            showMessage(_this, _this.errorMsg, 0);
                        }
                    },
                    error: function (info) {
                        _this.errorMsg = '服务器访问出错！';
                        _this.isError = true;
                    }
                });
                _this.addButtonDisabled = true;
                setTimeout(() => {
                    _this.addButtonDisabled = false;
                }, 2000);

            },

            onEdit() {

            },

            signDisable(signContentList, row, status) {
                //超级管理员可以操作，或者当前合同属于“签核状态”、登陆的用户有权限签核并且合同currentStep处于属于该角色签核
                //修改：下一个签核人未签核的状态下，允许修改。
                if (_this.userInfo.role.id == 1) {
                    return false;
                }
                if (row.roleId == _this.userInfo.role.id && status == 1) {
                    if (_this.editContract.currentStep == _this.userInfo.role.roleName) {
                        return false;
                    } else if (row.result > 0 && signContentList[row.number].result == 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
                // return !(
                //     (roleId == _this.userInfo.role.id &&
                //         status == 1 &&
                //         this.editContract.currentStep == _this.userInfo.role.roleName) ||
                //     _this.userInfo.role.id == 1
                // );
            },

            fetchLxdData(contractId) {
                $.ajax({
                    url: HOST + 'contact/detail',
                    type: 'POST',
                    dataType: 'json',
                    data: {id: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.lxdForm = res.data;

                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            fetchLxdSignData(contractId) {

                //todo
            },


            initAllRoles() {
                $.ajax({
                    url: HOST + 'role/list',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                            _this.fetchSignProcesses();
                        }
                    }
                });
            },

            getRoleNameById(id) {
                let result = '';
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },
            //获取所有签核流程
            fetchSignProcesses() {
                $.ajax({
                    url: HOST + 'sign/process/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            let tmpList = data.data.list;
                            for (let i = 0; i < tmpList.length; i++) {
                                if (
                                    tmpList[i].processName != null &&
                                    tmpList[i].processName.indexOf('联系单') != -1
                                ) {
                                    _this.lxdSignRoleList.push({
                                        roleId: '',
                                        name: '全部',
                                        choosed: _this.filters.roleName == '' ? true : false
                                    });
                                    var temp = JSON.parse(tmpList[i].processContent);
                                    if (temp != null && temp.length > 0) {
                                        for (let j = 0; j < temp.length; j++) {
                                            _this.lxdSignRoleList.push({
                                                roleId: temp[j].roleId,
                                                name: _this.getRoleNameById(temp[j].roleId),
                                                choosed: _this.filters.roleName ==
                                                _this.getRoleNameById(temp[j].roleId) ?
                                                    true : false
                                            });
                                        }
                                    }
                                    break;
                                }
                            }
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },
            chooseCurrentSignDepartment(index) {
                for (let i = 0; i < _this.lxdSignRoleList.length; i++) {
                    if (index == i) {
                        _this.lxdSignRoleList[i].choosed = true;
                        _this.filters.roleName = _this.getRoleNameById(
                            _this.lxdSignRoleList[i].roleId
                        );
                    } else {
                        _this.lxdSignRoleList[i].choosed = false;
                    }
                }
                _this.selectContacts();
            },
            chooseCurrentSignStep(index) {
                for (let i = 0; i < _this.lxdStatusForFilterList.length; i++) {
                    if (index == i) {
                        _this.lxdStatusForFilterList[i].choosed = true;
                        _this.filters.status = _this.lxdStatusForFilterList[i].value;
                    } else {
                        _this.lxdStatusForFilterList[i].choosed = false;
                    }
                }

                if (_this.lxdStatusForFilterList[index].value != 1) {
                    for (let i = 0; i < _this.lxdSignRoleList.length; i++) {
                        if (0 == i) {
                            _this.lxdSignRoleList[i].choosed = true;
                        } else {
                            _this.lxdSignRoleList[i].choosed = false;
                        }
                    }
                    _this.filters.roleName = '';
                }
                _this.selectContacts();
            },
            filterIsSigning() {
                let result = false;
                for (
                    let i = 0; i < _this.lxdStatusForFilterList.length && !result; i++
                ) {
                    if (_this.lxdStatusForFilterList[i].choosed) {
                        if (_this.lxdStatusForFilterList[i].value == 1) {
                            result = true;
                        }
                    }
                }
                return result;
            },
            dialogClose() {
                _this.addLxdVisible = false;
                _this.selectContacts();
            },
        },
        computed: {},
        filters: {
            filterRole(id) {
                let result = '';
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },

            filterStatusStyle(id) {
                var result = 'divStatusUnChecked';

                if (id == 0 || id == 5 || id == 6) {
                    result = 'divStatusUnChecked';
                } else if (id == 2) {
                    result = 'divOrderStatusFinished';
                } else if (id == 1 || id == 3 || id == 4) {
                    result = 'divOrderStatusChecking';
                }
                return result;
            },

        },
        created: function () {
            _this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(_this.userInfo)) {
                this.$router.push({path: '/login'});
                return;
            }
            //不是销售员，不是管理员
            if (
                this.userInfo.role.roleName != null &&
                this.userInfo.role.roleName.indexOf('销售员') == -1 &&
                this.userInfo.role.id != 1
            ) {
                _this.filters.roleName = this.userInfo.role.roleName;
            }

            //获取用户所在部门

            _this.lxdForm.applicantDepartment = this.userInfo.role.roleName;
            _this.lxdForm.applicantPerson = this.userInfo.account;


            this.lxdStatusForFilterList[0] = {
                name: '全部',
                value: '',
                choosed: false
            };

            for (let i = 0; i < _this.LxdStatusList.length; i++) {
                this.lxdStatusForFilterList.push({
                    name: this.lxdStatusList[i].name,
                    value: this.lxdStatusList[i].value,
                    choosed: this.lxdStatusList[i].value == 1 ? true : false
                });
            }
            _this.initAllRoles();

        },
        mounted: function () {
        }
    };
</script>
<style>
    .scopeMachine {
        font-weight: bold;
    }

    .el-table .warning-row {
        background: #909399;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .el-dialog__headerbtn {
        position: absolute;
        top: 15px;
        right: 15px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 5px;
        padding-bottom: 5px;
        background: #f56c6c;
        outline: 0;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
    }

    .different-value {
        /*border-width:5px;*/
        /*border-style:solid;*/
        background-color: #f56c6c;
    }

    .tab-disabled-background {
        position: relative;
        height: 100%;
        line-height: 100%;
        z-index: 9999;
        background: #ff99ff;
    }

    .divOrderStatusFinished {
        color: green;
    }

    .divOrderStatusChecking {
        color: darkorange;
    }

    .divStatusUnChecked {
        color: red;
    }

    .el-input {
        width: 100%;
    }

    .el-select {
        width: 100%;
    }

    .el-input-number {
        width: 100%;
    }

    .my-autocomplete {
        width: 100%;
    }
</style>
