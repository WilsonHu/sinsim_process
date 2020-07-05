<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="发起人:">
                            <el-input v-model="filters.applicantPerson" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="发起部门:">
                            <el-input v-model="filters.applicantDepartment" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="订单号:">
                            <el-input v-model="filters.orderNum" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建日期:">
                            <el-date-picker v-model="filters.selectCreateDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="4">
                        <el-form-item label="落实人:">
                            <el-input v-model="filters.fulfillMan" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="落实状态:">
                            <el-select v-model="filters.fulfillStatus" clearable>
                                <el-option
                                        v-for="item in fulfillStatusList"
                                        :value="item.value"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="联系单号:">
                            <el-input v-model="filters.contactFormNum" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="更新日期:">
                            <el-date-picker v-model="filters.selectUpdateDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="0" >
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="searchFulfillList">查询 </el-button>
                    </el-col>
                    <el-col :span="2" :offset="0">
                        <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">落实单</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                    v-loading="loadingUI"
                    element-loading-text="获取数据中..."
                    :data="tableData"
                    border
                    empty-text="暂无数据..."
                    ref="singleTable"
                    highlight-current-row
                    show-overflow-tooltip="true"
                    :summary-method="getSummaries"
                    show-summary
                    style="width: 100%; "
            >
                <el-table-column width="55" align="center" label="序号">
                    <template scope="scope">{{scope.$index+startRow}}</template>
                </el-table-column>

                <el-table-column align="center" label="联系单号" min-width="95">
                    <template scope="scope">
                        <span>{{scope.row.contactForm.num}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单号" min-width="145">
                    <template scope="scope">
                        <span>{{scope.row.contactForm.orderNum}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="发起部门" min-width="80">
                    <template scope="scope">
                        <span>{{scope.row.contactForm.applicantDepartment}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="发起人" min-width="80">
                    <template scope="scope">
                        <span>{{scope.row.contactForm.applicantPerson}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="主题" min-width="175">
                    <template scope="scope">
                        <div style="font-weight: bold;">
                            {{scope.row.contactForm.contactTitle}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="110" prop="orderSignStatus" label="落实状态">
                    <template scope="scope">
                        <div>
                            {{scope.row.status}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="designer" label="落实人">
                    <template scope="scope">
                        <div>{{scope.row.fulfillMan}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="90" label="落实期限">
                    <template scope="scope">
                        {{(scope.row.hopeDate)|filterDateString}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="90" label="更新日期">
                    <template scope="scope">
                        {{(scope.row.updateDate)|filterDateString}}
                    </template>
                </el-table-column>


                <el-table-column align="center" label="操作" width="240">
                    <template scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content">装车单</div>
                            <el-button size="mini" type="info" icon="el-icon-download"
                                       @click="onDownload(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">编辑</div>
                            <el-button size="mini" type="primary" icon="el-icon-edit"
                                       :disabled="!modifyAllowedRow(scope.row)"
                                       @click="handleEdit(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">删除</div>
                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                       :disabled="!modifyAllowedRow(scope.row)"
                                       @click="handleDelete(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="新增落实单" :visible.sync="addFulfillVisible" width="30%" append-to-body>
                <span style="font-size: 22px">
                          请到具体的联系单里进行操作
                </span>
                <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="addFulfillVisible = false" icon="el-icon-check">OK</el-button>
                        </span>
            </el-dialog>

            <el-dialog title="删除" :visible.sync="deleteFulfillVisible" width="30%" append-to-body>
                <span style="font-size: 22px">
                           确认要删除对应联系单号为[
                            <b style="color: #F56C6C;font-weight: bold">{{selectedItem.orderNum}}</b> ] 的该落实单吗？
                </span>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteFulfillVisible = false" icon="el-icon-back">取 消</el-button>
                            <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
                        </span>
            </el-dialog>

            <div class="block" style="text-align: center; margin-top: 20px">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="totalRecords"
                ></el-pagination>
            </div>
        </el-col>

    </div>
</template>
<script>
    var _this;

    export default {
        name: 'design_dep_manage',
        data() {
            _this = this;
            return {
                fulfillStatusList: constFulfillStatusList,
                addLxdVisible: false,
                lxdTypes: ["变更", "工作"],
                //变更联系单的变更类型(变更内容)
                lxdChangeTypes: [
                    "设计变更",
                    "材料变更",
                    "工艺变更",
                    "模具设备",
                    "工艺夹具",
                    "制造场所",
                    "新供应商",
                    "包装运输",
                    "检验方法",
                    "其他变更，需说明"
                ],
                checkedChangeTypes: [],
                normalSignRoleList: [],
                uploadDialogVisible: false,
//                差一个字符，会导致”blocked by CORS policy: No 'Access-Control-Allow-Origin' “错误，小心被误导。
                uploadURL: HOST + "design/dep/info/uploadDesignFile",
                fileLists: [],
                //查看订单页面
                addContractVisible: false,
                orderChangeRecord: "",
                orderSplitRecord: "",//订单页面, 包括了订单细节
//                formList:[],
                form: {
                    contactFormDetailList: [],
                    createUserId: '',
                    customer: '',
                    contractNum: '',
                    contractShipDate: '',
                    planShipDate: '',
                    sellman: '',
                    packageMethod: '',
                    machineNum: '',
                    mark: '',
                    country: '',
                    brand: '',
                    machineType: '',
                    needleNum: '',
                    headNum: '',
                    headDistance: '',
                    xDistance: '',
                    yDistance: '',

                    orderDetail: {
                        specialTowelColor: '',
                        specialTowelDaxle: '',
                        specialTowelHaxle: '',
                        specialTowelMotor: '',
                        specialTapingHead: '',
                        specialTowelNeedle: '',

                        electricPc: '',
                        electricMotor: '',
                        electricMotorXy: '',
                        electricTrim: '',
                        electricPower: '',
                        electricSwitch: '',
                        electricOil: '',

                        axleSplit: '',
                        axlePanel: '',
                        axleNeedle: '',
                        axleRail: '',
                        axleDownCheck: '',
                        axleHook: '',
                        axleJump: '',
                        axleUpperThread: '',
                        axleAddition: '',

                        frameworkColor: '',
                        frameworkPlaten: '',
                        frameworkPlatenColor: '',
                        frameworkRing: '',
                        frameworkBracket: '',
                        frameworkStop: '',
                        frameworkPoleHeight: '',
                        frameworkLight: '',

                        driverType: '',
                        driverMethod: '',
                        driverReelHole: '',
                        driverReel: '',
                        driverHorizonNum: '',
                        driverVerticalNum: '',
                    },
                },

                allOrderList: [],
                disgnerList: [],
                queryMachineTypeURL: HOST + 'machine/type/list',
                allMachineType: [],
                filters: {
                    customer: '',
                    contract_num: '',
                    orderNum: '',
                    //machineLength: '',
                    sellman: '',
                    selectDate: [new Date(), new Date()], //默认查询当天
                },
                tableData: [],
                pageSize: EveryPageNum, //每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                loadingUI: false,

                userInfo: '',

                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
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
                //增加对话框, 这里只是提示，实际新增应该在联系单里操作。
                addFulfillVisible: false,
                dialogTitle: '设计',

                mode: 1,
                ADD_MODE: 1,
                EDIT_MODE: 2,
                VIEW_MODE: 3,
                formLabelWidth: '100px',
                longFormLabelWidth: '125px',
                formLabelWidthMiddle: '80px',
                formLabelWidthSmall: '60px',

                designExist: false,
                rules: {
                    orderNum: [
//                        {  type: 'string',required: true, message: '请填写订单号!', trigger: 'change' }
                    ],
                },

                selectedItem: {},
                //给后端保存文件命名用。
                uploadFileType: '',
                deleteFulfillVisible: false,

                contactForm: {
                    id: "",
                    num: "",
                    orderNum: "",
                    contactTitle: "",
                    contactType: "",
                    applicantDepartment: "",
                    createDate: new Date(),
                    hopeDate: "",
                    applicantPerson: "",
                    status: 0,
                    contactContent: "", //工作联系单内容
                    attachedFile: "",
                    contactContentElse: "", // 选中“其他变更”时的输入
                    contactContentElseIsChecked: false // “其他变更” 是否被选中。
                },
            };
        },

        methods: {

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteFulfillVisible = true;
                } else{
                }
            },

            onConfirmDelete: function () {
                _this.deleteFulfillVisible = false;
                $.ajax({
                    url: HOST + 'contact/fulfill/delete',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: _this.selectedItem.id
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.searchFulfillList();
                            showMessage(_this, '删除落实单成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },

            onAttachedDownload(item, fileType)
            {
                _this.selectedItem = copyObject(item);
                $.ajax({
                    url: HOST + "design/dep/info/getDesignAttachedFile",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        designDepInfoId: _this.selectedItem.id,
                        fileType: fileType
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data.length > 0) {
                                var downLoadURL = DOWNLOADPATH_LXD + res.data;
                                _this.downloadFile(downLoadURL);
                            }
                        }
                    }
                })
            },

            onDownload(item)
            {
//                _this.selectedItem = copyObject(item);
                _this.onAttachedDownload( item, '装车单');
            },

            downloadFile(url)
            {
                var form = $("<form>");
                form.attr("style", "display:none");
                form.attr("method", "get");
                form.attr("action", url);
                $("body").append(form);
                form.submit();
            },

            modifyAllowedRow(row)
            {
                if (this.userInfo!= null) {
                    //是管理员， 允许修改，
                    if(this.userInfo.role.id == 1){
                        return true;
                    } else if(this.userInfo.role.id == 8) {
                        //技术部经理 8
                        return true;
                    } else {
                        //除了管理员和技术部经理，设计员只能改自己的东西
                        return this.userInfo.account == row.designer;
                    }
                }
                return false;
            },

            fetchDisgnerList() {
                $.ajax({
                    url: HOST + 'user/selectUsers',
                    type: 'POST',
                    dataType: 'json',
                    data: {roleId: 27}, ///写死先
                    success: function (res) {
                        if (res.code == 200) {
                            _this.disgnerList = res.data.list;
                        }
                    }
                });
            },

            handleAdd() {
                this.mode = _this.ADD_MODE;
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '新增落实单';
                this.addFulfillVisible = true;

            },


            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                sums[0] = '合计';
                sums[1] = '总数：';
                sums[2] = _this.totalRecords;
                return sums;
            },
            handleCurrentChange(val) {
                _this.currentPage = val;
                _this.onSearchFulfillList();
            },
            searchFulfillList() {
                _this.currentPage = 1;
                _this.onSearchFulfillList();
            },

            onSearchFulfillList() {
                var condition = {
                    guestName: _this.filters.customer,
                    contract_num: _this.filters.contract_num,
                    orderNum: _this.filters.orderNum,
                    is_fuzzy: true,
                    saleman: _this.filters.saleman,
                    orderStatus:_this.filters.orderStatus,
                    drawingLoadingDoneStatus:_this.filters.drawingLoadingDoneStatus,
                    machineSpec: _this.filters.machineSpec,
                    keywords: _this.filters.keywords,
                    designer: _this.filters.designer,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                        _this.filters.selectDate != null &&
                        _this.filters.selectDate.length > 0
                ) {
                    condition.updateDateStart = _this.filters.selectDate[0].format(
                            'yyyy-MM-dd'
                    );
                    condition.updateDateEnd = _this.filters.selectDate[1].format(
                            'yyyy-MM-dd'
                    );
                }
                $.ajax({
                    url: HOST + 'contact/fulfill/selectFulfillList',
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function(res) {
                        if (res.code == 200) {
                            _this.totalRecords = res.data.total;
                            _this.tableData = res.data.list;
                            _this.startRow = res.data.startRow;
                        }
                        _this.loadingUI = false;
                    }
                });
            },

        },
        computed: {
        },
        filters: {
            filterRole(id) {
                let result = "";
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },

            filterDateString(strDate) {
                //为空的时间不要显示为1970xxxx，而是显示横杠就好
                if(strDate == null){
                    return "-";
                }
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

        },
        created: function() {
            this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userInfo)) {
                this.$router.push({ path: '/Login' });
                return;
            }
        },

        mounted: function () {
//        _this.selectContacts();
            _this.searchFulfillList();
            _this.fetchDisgnerList();
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
    /*很关键 --> 否则 upload页面会多出上传按钮*/
    input[type="file"] {
        display: none;
    }

    .el-upload-list {
        height: 100px;
    }

    .el-upload__tip {

    }
    /*输入框 disable后的字体*/
    input:disabled,textarea:disabled {
        -webkit-text-fill-color: black;
    }


</style>
