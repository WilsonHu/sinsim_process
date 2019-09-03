<template>
    <div>
        <!-- 需建立一个表格，班长为单位进行统计，今天上班人数，加班人数，明日上班人数，人员总数，请假人数，数据要保存到数据库，并可查询-->
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">

                <el-row>

                    <el-col :span="4">
                        <el-form-item label="安装组：">
                            <el-select v-model="filters.groupName" clearable>
                                <el-option v-for="item in groupList" :key="item.groupName" :label="item.groupName" :value="item.groupName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4">
                        <el-form-item label="组长 :">
                            <el-input v-model="filters.installGroupLeader" placeholder="姓名" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="日期:">
                            <el-date-picker v-model="filters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询
                        </el-button>
                    </el-col>

                </el-row>
                <el-row>

                    <el-col :span="1" :offset="0" align="center"  >
                        <el-form-item label="合计:">
                            {{getSummaries()}}
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <el-table v-loading="loadingUI" element-loading-text="获取数据中..." :data="tableData" border empty-text="暂无数据..." ref="singleTable" highlight-current-row show-overflow-tooltip="true" style="width: 100%; ">
                <el-table-column width="55" align="center" label="序号">
                    <template scope="scope">
                        <div >
                            {{scope.$index+startRow}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="安装组"
                                 align="center"
                                 prop="installGroupName"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.installGroupName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="组长"
                                 align="center"
                                 prop="userAccount"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.userAccount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="日期"
                                 align="center"
                                 prop="date"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{formatDate(scope.row.date)}}
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column label="计划上班人数"-->
                                 <!--align="center"-->
                                 <!--prop="attendanceMember"-->
                                 <!--span="2">-->
                    <!--<template scope="scope">-->
                        <!--<div>-->
                            <!--{{scope.row.attendanceMember}}-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column align="center" prop="nameplate" label="实际上班人数">
                    <template scope="scope">
                        <div>
                            {{scope.row.attendanceMember}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="nameplate" label="请假人数">
                    <template scope="scope">
                        <div >
                            {{scope.row.absenceMember}}
                        </div>
                    </template>
                </el-table-column>
                    <el-table-column
                            align="center"
                            label="加班人数">
                        <template scope="scope">
                            <span>
                                {{scope.row.overtimeMember}}
                            </span>
                        </template>
                    </el-table-column>
                <el-table-column label="下个工作日上班人数"
                                 align="center"
                                 prop="attendanceTomorrow"
                                 span="2">
                    <template scope="scope">
                        <div>
                            {{scope.row.attendanceTomorrow}}
                        </div>
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
                            :total="totalRecords">
                    </el-pagination>
                </div>
            </el-col>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
  
    export default {
        name: "produce_staff_attendance",
        components: {},
        data() {
            _this = this;
            return {
                queryDataUrl: HOST + "/attendance/selectAttendanceDetails",
                errorMsg: '',
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                groupList: [],
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                statusList: MachineStatusList,
                filters: {
                    nameplate: '',
                    orderNum: '',
                    selectDate: '',
                },
                workTaskList: [],
                allMachineType: [],
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

                isError: false,
                loading: false,
                formLabelWidth: '120px',
                formLabelWidthSmall: '60px',

            }

        },
        methods: {

            filterGroup(id) {
                let result = "";
                for (let i = 0; i < _this.groupList.length; i++) {
                    if (_this.groupList[i].id == id) {
                        result = _this.groupList[i].groupName;
                        break;
                    }
                }
                return result;
            },
            getSummaries() {
                return _this.totalRecords;
            },


            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchDetailData();
            },
            search() {
                _this.currentPage = 1;
                this.onSearchDetailData();
            },
            onSearchDetailData()
            {
                var condition = {
                    orderNum: _this.filters.orderNum.trim(),
                    nameplate: _this.filters.nameplate.trim(),
                    type: INSTALLTYPE.ALL,
                    installGroupName: _this.filters.groupName,
                    queryStartTime: '',
                    queryFinishTime: '',
                    //status: _this.filters.status,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.queryStartTime = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.queryFinishTime = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: _this.queryDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.totalRecords = res.data.total;
                            _this.tableData = res.data.list;
                            _this.startRow = res.data.startRow;
                        }
                        _this.loadingUI = false;
                    }
                })
            },



            filterDateString(strDate) {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },
            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd");
            },
            //安装各组
            getInstallGroupData() {
                if (_this.groupList != null && _this.groupList.length > 0) {
                    return;
                }
                $.ajax({
                    url: HOST + "/install/group/list",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.groupList = res.data.list;
                            //sessionStorage.setItem('groupList', JSON.stringify(_this.groupList));
                        }
                    },
                })
            },
        },

        computed: {},
        filters: {
            filterDateString(strDate) {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterStatus(id) {
                var result = _this.statusList[0].name;
                for (var i = 0; i < _this.statusList.length; i++) {
                    if (id == _this.statusList[i].value) {
                        result = _this.statusList[i].name;
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
            _this.getInstallGroupData();
        },
        mounted: function () {
            _this.filters.status = "";
            _this.search();
        },
    }
</script>
<style>
    .el-select {
        width: 100%;
    }
    .el-input{
         width: 100%;
    }
    .el-input-number {
        width: 100%;
        float: left;
    }

    .colorDiv {
        width: 40px;
        height: 30px;
        background-color: gray;
        border: solid 0.5px grey;
        margin-top: 5px;
        margin-left: 10px;
    }

</style>

