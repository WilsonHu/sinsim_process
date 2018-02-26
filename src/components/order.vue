<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-main>
        <el-row>
            <el-col class="well well-lg" style="background-color: white;">
                <el-form :model="filters" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="订单号:">
                                <el-input v-model="filters.order_num"
                                          placeholder="订单号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同号:">
                                <el-input v-model="filters.contract_num"
                                          placeholder="合同号"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="审核状态:">
                                <el-select v-model="filters.status" clearable>
                                    <el-option
                                            v-for="item in orderStatusList"
                                            :value="item.value"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-button
                                    icon="el-icon-search"
                                    size="normal"
                                    type="primary"
                                    @click="search">查询
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="客户:">
                                <el-input v-model="filters.customer"
                                          placeholder="客户"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="销售员:">
                                <el-input v-model="filters.sellman"
                                          placeholder="销售员"
                                          auto-complete="off"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="选择日期:">
                                <el-date-picker
                                        v-model="filters.selectDate"
                                        type="daterange"
                                        align="left"
                                        unlink-panels
                                        range-separator="—"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                        v-loading="loadingUI"
                        element-loading-text="获取数据中..."
                        :data="tableData"
                        border
                        empty-text="暂无数据..."
                        show-overflow-tooltip="true"
                        style="width: 100%; ">
                    <el-table-column
                            width="80"
                            align="center"
                            label="序号">
                        <template scope="scope">
                            {{scope.$index+startRow}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="contractNum"
                            label="合同号">
                    </el-table-column>
                    <el-table-column label="订单号"
                                     prop="orderNum"
                                     align="center">
                        <template scope="scope">
                            <div v-on:click="onDetail(scope.row)"
                                 style="font-weight: bold;"
                                 class="btn btn-link">
                                {{scope.row.orderNum}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="machineNum"
                            label="机器数量">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="status"
                            label="审核状态">
                        <template scope="scope">
                            <div :class="scope.row.status|filterOrderStatusStyle">
                                {{scope.row.status|filterOrderStatus}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="customer"
                            label="客户">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="sellman"
                            label="销售人员">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="contractShipDate"
                            label="合同交货日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.contractShipDate)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="planShipDate"
                            label="计划交货日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.planShipDate)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--align="center"-->
                    <!--prop="createTime"-->
                    <!--label="填表日期">-->
                    <!--<template slot-scope="scope">-->
                    <!--<span>-->
                    <!--{{(scope.row.createTime)|filterDateString}}-->
                    <!--</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            width="200px;"
                            align="center"
                            label="装车单">
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    type="primary"
                                    icon="el-icon-upload"
                                    @click="onUpload(scope.row)">上传
                            </el-button>
                            <el-button
                                    size="small"
                                    type="primary"
                                    icon="el-icon-download"
                                    :disabled="scope.row.orderLoadingList==null||scope.row.orderLoadingList.id==''"
                                    @click="onDownload(scope.row)">下载
                            </el-button>
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
        </el-row>
        <el-dialog title="装车单上传" :visible.sync="uploadDialogVisible"
                   width="50%" right>
            <el-row>
                <el-col :span="24">

                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="uploadURL"
                            :multiple="false"
                            :on-change="handleFileChange"
                            :before-upload="handleBefore"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :file-list="fileLists"
                            :auto-upload="false"
                            :data="uploadData">
                        <el-button slot="trigger" size="small"
                                   plain
                                   type="primary">选取文件
                        </el-button>
                        <el-button style="margin-left: 10px;" size="small"
                                   icon="el-icon-upload"
                                   type="success" @click="submitUpload">
                            上传到服务器
                        </el-button>
                        <div slot="tip" class="el-upload__tip"
                             style="font-size: 12px;color: gray">
                            只能上传xls/xlsx文件
                        </div>
                    </el-upload>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" style="margin-bottom: 60px">
                <el-col :span="24" style="margin-bottom: 30px;">
                    <el-button icon="el-icon-close"
                               size="normal"
                               type="danger"
                               @click="uploadDialogVisible = false">关 闭
                    </el-button>
                </el-col>
            </div>
        </el-dialog>

        <el-dialog title="查看订单" :visible.sync="addDialogVisible" fullscreen>
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="20" :offset="1">
                    <el-form :model="form">
                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">订单信息</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6">
                                    <el-form-item label="合同号：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                v-model="form.contractNum"
                                                placeholder="合同号"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="订单号：" :label-width="formLabelWidth">
                                        <el-input v-model="form.orderNum"
                                                  disabled
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="交货日期：" :label-width="formLabelWidth">
                                        <el-date-picker
                                                disabled
                                                style="width: 100%"
                                                v-model="form.contractShipDate"
                                                type="date"
                                                placeholder="合同交货日期"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="计划日期：" :label-width="formLabelWidth">
                                        <el-date-picker
                                                disabled
                                                style="width: 100%"
                                                v-model="form.planShipDate"
                                                type="date"
                                                placeholder="合同计划日期"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="销售人员：" :label-width="formLabelWidth">
                                        <!--<el-select v-model="form.sellman"-->
                                        <!--clearable-->
                                        <!--placeholder="请选择" >-->
                                        <!--<el-option-->
                                        <!--v-for="item in allQualification"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.name" >-->
                                        <!--</el-option >-->
                                        <!--</el-select >-->
                                        <el-input
                                                disabled
                                                v-model="form.sellman"
                                                placeholder="销售人员"
                                                auto-complete="off">
                                        </el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="包装方式：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                v-model="form.packageMethod"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in packageModeList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="订机数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left;"
                                                         disabled
                                                         v-model="form.machineNum"
                                                         :step="1"
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="1000">

                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16" :offset="0">
                                    <el-form-item label="备注信息：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                type="textarea"
                                                :autosize="{ minRows: 4, maxRows: 4}"
                                                placeholder="备注信息"
                                                v-model="form.mark">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </div>

                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">客户机型信息</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="客户：" :label-width="formLabelWidth">
                                        <el-input

                                                disabled
                                                v-model="form.customer"
                                                placeholder="客户"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="国家：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                v-model="form.country"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in countryList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6" :offset="0">
                                    <el-form-item label="商标：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                v-model="form.brand"
                                                placeholder="商标"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="机型：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.machineType"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in allMachineType"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="针数：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left;"
                                                         disabled
                                                         v-model="form.needleNum"
                                                         :step="2"
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="100">

                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头数：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         disabled
                                                         v-model="form.headNum"
                                                         :step="1"
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="100">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头距：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.headDistance"
                                                         disabled
                                                         :step="1"
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="100">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="X行程：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                v-model="form.xDistance"
                                                placeholder="X行程"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="Y行程：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                v-model="form.yDistance"
                                                placeholder="Y行程"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </div>

                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">特种绣选项</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6">
                                    <el-form-item label="色数：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelColor"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTowelColorList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="D轴上：" :label-width="formLabelWidth">
                                        <el-select

                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelDaxle"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTowelDaxleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="H轴下：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelHaxle"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTowelHaxleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="主电机：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelMotor"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTowelMotorList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="盘带头：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTapingHead"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTapingHeadList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="毛巾机针：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelNeedle"
                                                clearable
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in specialTowelNeedleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                            </div>
                        </div>

                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">电气</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6">
                                    <el-form-item label="电脑：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricPc"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in pcModeList"
                                                    v-bind:value="item.text"
                                                    v-bind:label="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="语言：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.PClanguage"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in countryList"
                                                    v-bind:value="item.text"
                                                    v-bind:label="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="主电机：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricMotor"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in electricMotorList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="XY电机：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricMotorXy"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in xyMotorList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="剪线方式：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricTrim"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in trimList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="电源：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricPower"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in electricPowerList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="按钮开关：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricSwitch"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in electricSwitchList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="加油系统：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricOil"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in electricOilList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </div>


                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">上轴下轴主传动</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6">
                                    <el-form-item label="夹线器：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.axleSplit"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in axleSplitList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="面板：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.axlePanel"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in axlePanelList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="机针：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleNeedle"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleNeedleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="机头导轨：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleRail"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleRailList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="底检方式：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleDownCheck"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleDownCheckList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="旋梭：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleHook"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleHookList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="跳跃方式：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleJump"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleJumpList"
                                                    :label="item.text"
                                                    :value="item.text">

                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="面线夹持：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleUpperThread"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleUpperThreadList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="附加装置：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
                                                v-model="form.orderDetail.axleAddition"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <div style="font-family:Segoe UI;color:gray;text-align: left;margin-top: 10px">
                                        (仅销售和研发可编辑)
                                    </div>
                                </el-col>
                            </div>
                        </div>

                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">机架台板</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="机架颜色：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkColor"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkColorList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="台板：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPlaten"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkPlatenList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="台板颜色：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPlatenColor"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkPlatenColorList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="吊环：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkRing"
                                                       clearable

                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkRingList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="电脑托架：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkBracket"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkBracketList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="急停装置：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkStop"
                                                       clearable
                                                       disabled
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkStopList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="日光灯：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.frameworkLight"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in frameworkLightList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </div>

                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">驱动框架绷架</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="驱动类型：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverType" style="width: 100%;"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in driverTypeList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="驱动方式：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverMethod"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in friverMethodList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="绷孔架：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverReelHole"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in driverReelHoleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="绷架：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverReel"
                                                   clearable
                                                   disabled
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in driverReelList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="横档数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.orderDetail.driverHorizonNum"
                                                         :step="1"
                                                         disabled
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="100">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="直档数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.orderDetail.driverVerticalNum"
                                                         :step="1"
                                                         disabled
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="100">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </div>
                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">装置信息</h3>
                            </div>
                            <div class="panel-body">
                                <el-table
                                        border
                                        :data="form.equipment">
                                    <el-table-column
                                            label="装置名称"
                                            prop="name"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            label="数量"
                                            width="200"
                                            prop="number"
                                            align="center">
                                    </el-table-column>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-form>
                    <div slot="footer" class="dialog-footer" style="margin-bottom: 20px">
                        <el-button @click="addDialogVisible = false" icon="el-icon-back">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

    </el-main>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    export default {
        name: "order_manage",
        components: {},
        data () {
            _this = this;
            return {
                errorMsg: '',
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                totalRecords: 0,

                packageModeList: PackageModeList,
                orderStatusList: OrderStatusList,
                countryList: LanguageList,
                allMachineType: [],
                pcModeList: PCModeList,
                electricMotorList: ElectricMotorList,
                xyMotorList: XYMotorList,
                trimList: TrimList,
                electricPowerList: ElectricPowerList,
                electricSwitchList: ElectricSwitchList,
                electricOilList: ElectricOilList,
                axleSplitList: AxleSplitList,
                axlePanelList: AxlePanelList,
                axleNeedleList: AxleNeedleList,
                axleRailList: AxleRailList,
                axleDownCheckList: AxleDownCheckList,
                axleHookList: AxleHookList,
                axleJumpList: AxleJumpList,
                axleUpperThreadList: AxleUpperThreadList,
                frameworkColorList: FrameworkColorList,
                frameworkPlatenList: FrameworkPlatenList,
                frameworkPlatenColorList: FrameworkPlatenColorList,
                frameworkRingList: FrameworkRingList,
                frameworkBracketList: FrameworkBracketList,
                frameworkStopList: FrameworkStopList,
                frameworkLightList: FrameworkLightList,
                driverTypeList: DriverTypeList,
                friverMethodList: DriverMethodList,
                driverReelHoleList: DriverReelHoleList,
                driverReelList: DriverReelList,
                jiaZiXiuPricelList: JiaZiXiuPricelList,
                championGoldList: ChampionGoldList,
                specialTowelColorList: SpecialTowelColorList,
                specialTapingHeadList: SpecialTapingHeadList,
                specialTowelDaxleList: SpecialTowelDaxleList,
                specialTowelHaxleList: SpecialTowelHaxleList,
                specialTowelMotorList: SpecialTowelMotorList,
                specialTowelNeedleList: SpecialTowelNeedleList,

                //增加对话框
                addDialogVisible: false,
                form: {
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
                        frameworkLight: '',

                        driverType: '',
                        driverMethod: '',
                        driverReelHole: '',
                        driverReel: '',
                        driverHorizonNum: '',
                        driverVerticalNum: '',
                    },
                },
                formLabelWidth: '100px',
                filters: {
                    order_num: '',
                    contract_num: '',
                    status: '',
                    sellman: '',
                    customer: '',
                    selectDate: '',
                },
                allRoles: [],
                loadingUI: false,
                uploadDialogVisible: false,
                fileLists: [
//                    {
//                        name: 'food.jpeg',
//                        url: '',
//                    },
                ],
                uploadURL: "",
                uploadData: {},

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

            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss");
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchDetailData();
            },
            search() {
                this.onSearchDetailData();
            },
            onSearchDetailData()
            {
                var condition = {
                    order_num: _this.filters.order_num,
                    contract_num: _this.filters.contract_num,
                    status: _this.filters.status,
                    sellman: _this.filters.sellman,
                    customer: _this.filters.customer,
                    query_start_time: '',
                    query_finish_time: '',
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.query_start_time = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: HOST + "machine/order/selectOrders",
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

            onUpload(item)
            {
                _this.selectedItem = copyObject(item);
                _this.fileLists = [];
                _this.uploadData.id = _this.selectedItem.id;
                _this.uploadDialogVisible = true;
            },
            handleBefore(file)
            {
//                var xlsFile = file.name.split('.');
//                if (xlsFile[1] === "xls" || xlsFile[1] === "xlsx") {
//                    return file;
//                }
//                else {
//                    showMessage(_this, "只能上传xls/xlsx文件，请重新上传！", 0)
//                    return false;
//                }
            },

            handleFileChange(file, fileList)
            {
                var errorMsg = "";
                var xlsFile = file.name.split('.');
                if (xlsFile == null || xlsFile.length < 2) {
                    errorMsg = "上传的文件没有后缀名，不能上传！";
                }
                else if (xlsFile[1] !== "xls" && xlsFile[1] !== "xlsx") {
                    errorMsg = "只能上传xls/xlsx文件，请重新上传！";
                }
                if (!isStringEmpty(errorMsg)) {
                    var removeIndex = -1;
                    for (var i = 0; i < fileList.length; i++) {
                        if (fileList[i].name == file.name) {
                            removeIndex = i;
                            break;
                        }
                    }
                    if (removeIndex > -1) {
                        delete fileList[removeIndex];
                    }
                    fileList=[];
                    showMessage(_this, errorMsg, 0)
                }else {
                    fileList=[];
                    fileList.push(file);
                }
                _this.fileLists = fileList;
            },

            submitUpload() {
                if (_this.fileLists == null || _this.fileLists.length == 0) {
                    showMessage(_this, "上传文件不能为空！", 0)
                    return;
                }
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                _this.fileLists = fileList;
                console.log("remove file" + file.name);
            },
            handlePreview(file) {
                console.log(handlePreview);
            },
            handleSuccess(res, file, fileList)
            {
                if (res.code === 200) {
                    showMessage(_this, "上传成功！", 1)
                }
                else {
                    showMessage(_this, "上传失败！", 0)
                }
            },

            onDownload(item)
            {
                _this.selectedItem = copyObject(item);
            },

            onDetail(item) {
                _this.selectedItem = copyObject(item);
                this.form = copyObject(item);
                this.form.equipment = JSON.parse(this.form.equipment);
                this.addDialogVisible = true;
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
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterOrderStatus(id)
            {
                var result = _this.orderStatusList[0].name;
                for (var i = 0; i < _this.orderStatusList.length; i++) {
                    if (id == _this.orderStatusList[i].value) {
                        result = _this.orderStatusList[i].name;
                        break;
                    }
                }
                return result;
            },
            filterOrderStatusStyle(id)
            {
                var result = "divOrderStatusUnChecked"

                if (id == 0 || id == 5 || id == 6) {
                    result = "divOrderStatusUnChecked";
                } else if (id == 2) {
                    result = "divOrderStatusFinished";
                } else if (id == 1 || id == 3 || id == 4) {
                    result = "divOrderStatusChecking";
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
            _this.onSearchDetailData();

        },
        mounted: function () {

        },
    }

</script>
<style scope>

    /*很关键*/
    input[type="file"] {
        display: none;
    }

    .el-upload-list {
        height: 100px;
    }

    .el-upload__tip {

    }

    .breadcrumb-container {
        padding: 15px;
        background-color: #E5E9F2;
    }

    .title {
        width: 200px;
        float: left;
        color: #475669;
        font-weight: bold
    }

    .parentPart {
        width: 200px;
        color: #475669;
        font-size: medium;
        font-weight: bold
    }

    .subPart {
        width: 200px;
        color: #475669;
        font-weight: bold;
    }

    .el-select {
        width: 100%;
    }

    .el-input-number {
        width: 100%;
        float: left;
    }

    .divOrderStatusFinished {
        color: green;
    }

    .divOrderStatusChecking {
        color: darkorange;
    }

    .divOrderStatusUnChecked {
        color: red;
    }
</style>


