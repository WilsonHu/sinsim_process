<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-main>
        <el-col class="well well-lg" style="background-color: white;" >
            <el-row >
                <el-col >
                    <el-form :model="filters" label-position="right" label-width="80px" >
                        <el-row >
                            <el-col :span="6" >
                                <el-form-item label="订单号:" >
                                    <el-input v-model="filters.id"
                                              placeholder="订单号"
                                              auto-complete="off" ></el-input >
                                </el-form-item >
                            </el-col >
                            <!--<el-col :span="4" >-->
                            <!--<el-form-item label="审核部门:" >-->
                            <!--<el-select v-model="filters.roleName" clearable >-->
                            <!--<el-option-->
                            <!--v-for="item in allRoles"-->
                            <!--v-bind:value="item.roleName"-->
                            <!--v-bind:label="item.roleName" >-->
                            <!--</el-option >-->
                            <!--</el-select >-->
                            <!--</el-form-item >-->
                            <!--</el-col >-->

                            <el-col :span="4" >
                                <el-form-item label="审核状态:" >
                                    <el-select v-model="filters.order_status" clearable >
                                        <el-option
                                                v-for="item in orderStatusList"
                                                v-bind:value="item.value"
                                                v-bind:label="item.text" >
                                        </el-option >
                                    </el-select >
                                </el-form-item >
                            </el-col >
                            <el-col :span="4" >
                                <el-form-item label="销售人员:" >
                                    <el-input v-model="filters.sellman"
                                              placeholder="销售人员"
                                              auto-complete="off" ></el-input >
                                </el-form-item >
                            </el-col >
                            <el-col :span="6" >
                                <el-button
                                        icon="el-icon-search"
                                        size="normal"
                                        type="primary"
                                        @click="search" >查询
                                </el-button >
                            </el-col >
                        </el-row >
                        <el-row >
                            <el-col :span="6" >
                                <el-form-item label="合同号:" >
                                    <el-input v-model="filters.contract_num"
                                              placeholder="合同号"
                                              auto-complete="off" ></el-input >
                                </el-form-item >
                            </el-col >
                            <el-col :span="6" >
                                <el-form-item label="选择日期:" >
                                    <el-date-picker
                                            v-model="filters.selectDate"
                                            type="daterange"
                                            align="left"
                                            unlink-panels
                                            range-separator="—"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :picker-options="pickerOptions" >
                                    </el-date-picker >
                                </el-form-item >
                            </el-col >

                            <!--<el-col :span="2" style="float: right" >-->
                            <!--<el-button style="float: right;"-->
                            <!--icon="el-icon-plus"-->
                            <!--size="normal"-->
                            <!--type="primary"-->
                            <!--@click="handleAdd" >-->
                            <!--添加-->
                            <!--</el-button >-->
                            <!--</el-col >-->

                        </el-row >
                    </el-form >


                    <el-table
                            v-loading="loadingUI"
                            element-loading-text="获取数据中..."
                            :data="tableData"
                            border
                            empty-text="暂无数据..."
                            show-overflow-tooltip="true"
                            style="width: 100%; " >
                        <el-table-column
                                width="75"
                                label="序号" >
                            <template scope="scope" >
                                {{scope.$index+1}}
                            </template >
                        </el-table-column >
                        <el-table-column label="订单号"
                                         prop="orderNum" >
                            <template scope="scope" >
                                <div v-on:click="onDetail(scope.row)"
                                     style="font-weight: bold;"
                                     class="btn btn-link" >
                                    {{scope.row.orderNum}}
                                </div >
                            </template >
                        </el-table-column >
                        <el-table-column
                                prop="contractNum"
                                label="合同号" >
                        </el-table-column >
                        <el-table-column
                                prop="customer"
                                label="客户" >
                        </el-table-column >
                        <el-table-column
                                prop="brand"
                                label="商标" >
                        </el-table-column >
                        <el-table-column
                                prop="machineType"
                                label="机型" >
                            <template scope="scope" >
                                <div >
                                    {{scope.row.machineType.id|filterMachineType}}
                                </div >
                            </template >
                        </el-table-column >

                        <el-table-column
                                prop="status"
                                label="审核状态" >
                            <template scope="scope" >
                                <div >
                                    {{scope.row.status|filterOrderStatus}}
                                </div >
                            </template >
                        </el-table-column >
                        <el-table-column
                                prop="contractShipDate"
                                label="合同交货日期" >
                            <template slot-scope="scope" >
			                    <span >
				                    {{(scope.row.contractShipDate)|filterDateString}}
			                    </span >
                            </template >
                        </el-table-column >
                        <el-table-column
                                prop="planShipDate"
                                label="计划交货日期" >
                            <template slot-scope="scope" >
			                    <span >
				                    {{(scope.row.planShipDate)|filterDateString}}
			                    </span >
                            </template >

                        </el-table-column >
                        <el-table-column
                                prop="sellman"
                                label="销售人员" >
                        </el-table-column >
                        <el-table-column
                                prop="createTime"
                                label="填表日期" >
                            <template slot-scope="scope" >
			                    <span >
				                    {{(scope.row.createTime)|filterDateString}}
			                    </span >
                            </template >
                        </el-table-column >
                    </el-table >
                    <div class="block" style="text-align: center; margin-top: 20px" >
                        <el-pagination
                                background
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-size="pageSize"
                                layout="prev, pager, next, jumper"
                                :total="totalRecords" >
                        </el-pagination >
                    </div >
                </el-col >
            </el-row >
        </el-col >
    </el-main >
</template >

<script >
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    export default {
        name: "machine_manage",
        components: {},
        data () {
            _this = this;
            return {
                queryCountUrl: HOST + "machine/order/selectOrderCount",
                queryDataUrl: HOST + "machine/order/selectOrders",
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,


                //增加对话框
                addDialogVisible: false,
                formLabelWidth: '100px',
                filters: {
                    id: '',
                    contract_num: '',
                    order_status: '',
                    sellman: '',
                    customer: '',
                    selectDate: '',
                },
                allRoles: [],
                loadingUI: false,


                pickerOptions: {
                    shortcuts: [{
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
            }

        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.startRow = this.pageSize * (this.currentPage - 1)
            },
            search() {

            },

            initAllRoles()
            {
                $.ajax({
                    url: _this.queryUserRoleUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                        }
                    }
                })
            },

            initMachineType()
            {
                _this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                sessionStorage.setItem('allMachineType', JSON.stringify(res.data.list));
                            }
                        }
                    })
                }
            },
        },
        computed: {},
        filters: {
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterOrderStatus(id)
            {
                var result = _this.orderStatusList[0].text;
                for (var i = 0; i < _this.orderStatusList.length; i++) {
                    if (id == _this.orderStatusList[i].value) {
                        result = _this.orderStatusList[i].text;
                        break;
                    }
                }
                return result;
            },
            filterMachineType(id)
            {
                var result = '';
                for (var i = 0; i < _this.allMachineType.length; i++) {
                    if (id == _this.allMachineType[i].id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            }
        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            _this.initMachineType();

        },
        mounted: function () {
            this.onSearchRecordCounts();
        },
    }

</script >
<style >

</style >


