<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="订单号:">
                            <el-input v-model="filters.orderNum" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="销售员:">
                            <el-input v-model="filters.saleman" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="客户:">
                            <el-input v-model="filters.customer" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">-->
                    <!--<el-form-item label="合同号:">-->
                    <!--<el-input-->
                    <!--v-model="filters.contract_num"-->
                    <!--placeholder="合同号"-->
                    <!--auto-complete="off"-->
                    <!--clearable-->
                    <!--&gt;</el-input>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="4">
                        <el-form-item label="审核状态:">
                            <el-input
                                    v-model="filters.machineLength"
                                    auto-complete="off"
                                    clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="图纸状态:">
                            <el-input v-model="filters.drawingLoadingDone" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="4">
                        <el-form-item label="设备规格:">
                            <el-input v-model="filters.machineSpec" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="关键字:">
                            <el-input v-model="filters.keywords" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="设计人员:">
                            <el-input v-model="filters.designer" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="创建日期:">
                            <el-date-picker v-model="filters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="0" >
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询 </el-button>
                    </el-col>
                    <el-col :span="2" :offset="0">
                        <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">设计</el-button>
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
                <el-table-column width="75" align="center" label="序号">
                    <template scope="scope">{{scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column align="center" label="订单号" min-width="145">
                    <template scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="110" prop="orderSignStatus" label="审核状态">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderSignStatus|filterOrderStatus}}
                            <!--{{scope.row.orderSignStatus}}-->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="85" label="审核更新日期">
                    <template scope="scope">
                        {{(scope.row.updatedDate)|filterDateString}}
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="nameplate" label="设备规格">
                    <template scope="scope">
                        <div>{{scope.row.machineSpec}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="designer" label="设计人员">
                    <template scope="scope">
                        <div>{{scope.row.designer}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="designCostDates" label="已设计天数">
                    <template scope="scope">
                        {{(scope.row.createdDate)|CalculateAndfilterDateString}}
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="drawingLoadingDone" label="图纸装车单">
                    <template scope="scope">
                        {{(scope.row.drawingLoadingDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="bomDone" label="BOM" >
                    <template scope="scope">
                        {{(scope.row.bomDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="holeTubeDone" label="点孔" >
                    <template scope="scope">
                        {{(scope.row.holeTubeDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="coverDone" label="罩盖" >
                    <template scope="scope">
                        {{(scope.row.coverDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="designStatus" label="当前状态" >
                    <template scope="scope">
                        {{(scope.row.designStatus) }}
                    </template>
                </el-table-column>S


                <el-table-column align="center" label="操作" width="240">
                    <template scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content">审核</div>
                            <el-button v-show="userInfo.role.roleName !='销售员'" size="mini" type="success" icon="el-icon-check"
                                       @click="handleSign(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">编辑</div>
                            <el-button v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)"
                                       size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">下载</div>
                            <el-button size="mini" type="info" icon="el-icon-download" @click="handleDownload(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">删除</div>
                            <el-button v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)&&(scope.row.status>=5||scope.row.status==0)" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog :visible.sync="addDesignVisible" fullscreen @close="dialogCloseCallback()">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
                            {{dialogTitle}}
                        </div>
                        <el-form :model="designForm.contactForm" :rules="rules" ref="ruleForm">

                            <el-card class="box-card" style="margin: 25px">
                                <el-row>
                                    <el-col :span="6"  >
                                        <el-form-item label="订单号:" :label-width="longFormLabelWidth" prop="orderNum">
                                            <el-select
                                                    :disabled="notWritter() "
                                                    v-model="designForm.orderNum"
                                                    @change="onOrderChanged(designForm.orderNum)"
                                                    clearable
                                                    filterable >
                                                <el-option
                                                        v-for="item in allOrderList"
                                                        :label="item.orderNum"
                                                        :value="item.orderNum">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="4" :offset="1">
                                        <el-form-item label="销售员："  :label-width="formLabelWidthMiddle">
                                            <el-input v-model="designForm.saleman"   clearable></el-input>
                                        </el-form-item >
                                    </el-col >
                                    <el-col :span="5" :offset="0">
                                        <el-form-item label="客户："  :label-width="formLabelWidthMiddle">
                                            <el-input v-model="designForm.customerName" clearable></el-input>
                                        </el-form-item >
                                    </el-col >
                                    <el-col :span="4" :offset="0">
                                        <el-form-item label="国家："  :label-width="formLabelWidthMiddle">
                                            <el-input v-model="designForm.country" clearable></el-input>
                                        </el-form-item >
                                    </el-col >
                                    <el-col :span="4" :offset="0">
                                        <el-form-item label="机器数："  :label-width="formLabelWidthMiddle">
                                            <el-input v-model="designForm.machineNum" clearable></el-input>
                                        </el-form-item >
                                    </el-col >
                                    <el-col :span="5" :offset="0">
                                        <el-form-item label="审核状态："  :label-width="longFormLabelWidth">
                                            <el-input v-model="designForm.orderstatus" clearable></el-input>
                                        </el-form-item >
                                    </el-col >

                                </el-row>
                                <el-row>
                                    <el-col :span="23" :offset="1">
                                        <el-form-item label="备注信息："   >
                                            <el-input type="textarea" v-model="designForm.remark" :rows="5" clearable></el-input>
                                        </el-form-item >
                                    </el-col >
                                </el-row>

                            </el-card>
                        </el-form>

                        <el-form>
                            <div>
                                <el-button @click="dialogClose()" icon="el-icon-back" type="info" offset="120">关 闭
                                </el-button>
                                <el-button
                                        v-show="mode == ADD_MODE||mode==EDIT_MODE"
                                        type="primary"
                                        @click="onAddOrEdit('ruleForm')"
                                        icon="el-icon-check"
                                >保 存
                                </el-button>

                            </div>
                        </el-form>
                    </el-col>
                </el-row>
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
                allOrderList:[],
                onSearchDetailDataUrl: HOST + '/design/dep/info/selectDesignDepInfo',
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
                //增加对话框
                addDesignVisible: false,
                dialogTitle: '设计',

                mode: 1,
                ADD_MODE: 1,
                EDIT_MODE: 2,
                CHANGE_MODE: 3,
                formLabelWidth: '100px',
                longFormLabelWidth: '125px',
                formLabelWidthMiddle: '80px',
                formLabelWidthSmall: '60px',


                //用于保存设计内容
                designForm: {
                    orderNum: '',
                    saleman: '',
                    customerName: '',
                    country: '',
                    machineNum: '',
                    remark: '',
                    orderStatus: CONTRACT_INITIAL,

                    designer: '',
                    designCreatedDate: '',
                    machineSpec: '',
                    keywords: '',
                    drawingLoadingDone: '',
                    holeTubeDone: '',
                    bomDone: '',
                    coverDone: ''
                },

                designExist: false,
                rules: {
                    orderNum: [
//                        {  type: 'string',required: true, message: '请填写订单号!', trigger: 'change' }
                    ],
                },
            };
        },
        methods: {


            onOrderChanged(orderNum)
            {
                //获取 订单的销售员等
                $.ajax({
                    url: HOST + 'machine/order/selectOrders',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        order_num: orderNum,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            //因为订单号唯一 所以返回的值应该只有一个。
                            _this.designForm.saleman = res.data.list[0].sellman;
                            _this.designForm.customerName = res.data.list[0].customer;
                            _this.designForm.country = res.data.list[0].country;
                            _this.designForm.machineNum = res.data.list[0].machineNum;
                            _this.designForm.orderstatus = res.data.list[0].status;
                            _this.designForm.orderId = res.data.id;
                            console.log(' 200, 获取 订单信息 OK' + res.data.customer);
                            console.log(' 200, 获取 订单信息 OK sellman ' + res.data.sellman);
                        } else {
                            console.error('获取 订单信息失败，res.code: ' + res.code);
                        }
                    },
                    error: function (data) {
                        console.error('服务器访问出错');
                        _this.errorMsg = '服务器访问出错！';
                    }
                });
            },

            fetchAllOrderList() {
                $.ajax({
                    url: HOST + 'machine/order/getValidList',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allOrderList = res.data.list;
                        }
                    }
                });
            },
            notWritter()
            {
                return false;
            },

            handleAdd() {
                this.mode = _this.ADD_MODE;
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '新增设计项目';
                this.addDesignVisible = true;

            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                this.contractForm = {
                    contractNum: '',
                    customerName: '',
                    marketGroupName: '',
                    sellman: '',
                    mark: '',
                    status: CONTRACT_INITIAL,
                    payMethod: ''
                };
                //修复T第一次打开对话框，Tinymce中无法显示的问题，主要原因tab container中的tab没有被remove，导致tinymce组件不会被destroy
                //再一次打开就不会执行mounted，editor中的内容就无法显示
                this.requisitionForms.splice(0, this.requisitionForms.length);
                _this.addDesignVisible = false;
                _this.selectContracts();
            },
            dialogClose() {
                _this.addDesignVisible = false;
//                _this.selectContacts();
            },
            changeDesignContentDisable(item) {
                return (
                        (item.status != CONTRACT_INITIAL &&
                        item.status != CONTRACT_REJECTED &&
                        item.status != CONTRACT_SPLITED &&
                        item.status != CONTRACT_CHANGED)
                );
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
                _this.onSearchDetailData();
            },
            search() {
                _this.currentPage = 1;
                _this.onSearchDetailData();
            },
            onSearchDetailData() {
                var condition = {
                    customer: _this.filters.customer,
                    contract_num: _this.filters.contract_num,
                    order_num: _this.filters.orderNum,
                    is_fuzzy: true,
                    sellman: _this.filters.sellman,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                $.ajax({
                    url: _this.onSearchDetailDataUrl,
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

            onExport() {
                var condition = {
                    customer: _this.filters.customer,
                    contract_num: _this.filters.contract_num,
                    order_num: _this.filters.orderNum,
                    is_fuzzy: true,
                    sellman: _this.filters.sellman,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                        _this.filters.selectDate != null &&
                        _this.filters.selectDate.length > 0
                ) {
                    condition.queryStartTime = _this.filters.selectDate[0].format(
                            'yyyy-MM-dd'
                    );
                    condition.queryFinishTime = _this.filters.selectDate[1].format(
                            'yyyy-MM-dd'
                    );
                }
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
                    url: HOST + 'task/record/exportToExcel',
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function(data) {
                        if (data.code == 200) {
                            window.location.href = data.data;
                            showMessage(_this, '报表导出成功！', 1);
                        } else {
                            showMessage(_this, '报表导出失败！', 0);
                        }
                        _this.loadingUI = false;
                    },
                    error: function(data) {
                        showMessage(_this, data.message, 0);
                    }
                });
            },
            initMachineType() {
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function(res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                            }
                        }
                    });
                }
            }
        },

        filters: {
            filterOrderStatus(id) {
                var result = '';
                if(id==0){
                    result = "未提交审核"
                } else if(id==1){
                    result = "审核中"
                } else if(id==2){
                    result = "审核完成"
                } else if(id==3){
                    result = "已改单"
                } else if(id==4){
                    result = "已拆单"
                } else if(id==5){
                    result = "已驳回"
                } else if(id==6){
                    result = "已取消"
                } else if(id==7){
                    result = "已拆单 不必再审核"
                } else if(id==1){
                    result = "已改单 不必再审核"
                } else {
                    result = "/"
                }
                return result;
            },

            filterDateString(strDate) {
                //为空的时间不要显示为1970xxxx，而是显示横杠就好
                if(strDate == null){
                    return "-";
                }
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd hh:mm:ss");
            },

            CalculateAndfilterDateString(strDate) {
                //为空的时间不要显示为1970xxxx，而是显示横杠就好
                if(strDate == null){
                    return "-";
                }
                var dateToday = new Date();
                var resDate = new Date(strDate);
                var iDays = parseInt(Math.abs(dateToday.getTime()- resDate.getTime()) /1000/60/60/24);
                return iDays;

            },
            filterDone(status) {
                var result = '';
                console.log("status:" + status);
                if (status == 0) {
                    result = "未完成"
                } else if (status == 1) {
                    result = "完成"
                } else {
                    result = "NA"
                }
                return result;
            },
            filterDesignStatus(status){ //未计划  设计中   完成（全部完成）/改单

            }

        },
        created: function() {
            this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userInfo)) {
                this.$router.push({ path: '/Login' });
                return;
            }
            _this.initMachineType();
        },

        mounted: function () {
//        _this.selectContacts();
            _this.search();
            _this.fetchAllOrderList();
        }
    };
</script>

<style scoped>
</style>
