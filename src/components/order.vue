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
                            <el-form-item label="创建日期:">
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
                        highlight-current-row
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
                            sortable
                            prop="contractNum"
                            label="合同号">
                    </el-table-column>
                    <el-table-column label="订单号"
                                     min-width="150"
                                     sortable
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
                            width="80"
                            align="center"
                            prop="machineNum"
                            label="机器数量">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="status"
                            sortable
                            label="审核状态">
                        <template scope="scope">
                            <div :class="scope.row.status|filterOrderStatusStyle">
                                {{scope.row.status|filterOrderStatus}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="审核阶段">
                        <template scope="scope">
                            <div >
                                {{scope.row.orderSign.currentStep}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="customer"
                            sortable
                            label="客户">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="sellman"
                            sortable
                            label="销售人员">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="创建日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.createTime)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="合同交货日期">
                        <template slot-scope="scope">
                            <span>
                                {{(scope.row.contractShipDate)|filterDateString}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
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
                                    :disabled="notTechnicalTeam()"
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
                   width="35%" right @close="fileLists=[]">
            <el-form id="uploadForm">
                <el-row>
                    <el-form-item>
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
                                    :file-list="fileLists"
                                    :auto-upload="false"
                                    :limit="1"
                                    :data="uploadData">
                                <el-button slot="trigger" size="small"
                                           plain
                                           type="primary">选取文件
                                </el-button>
                                <el-button style="margin-left: 10px;" size="small"
                                           icon="el-icon-upload"
                                           :disabled="fileLists.length==0"
                                           type="success" @click="submitUpload">
                                    上传到服务器
                                </el-button>
                                <div slot="tip" class="el-upload__tip"
                                     style="font-size: 12px;color: gray">
                                    只能上传xls/xlsx文件
                                </div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
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
                    <el-form>
                        <el-card v-if="orderChangeRecord != ''">
                            <el-col>
                                <el-form-item label="改单原因：" :label-width="formLabelWidth"
                                              style="padding-bottom: 12px">
                                    <el-input v-model="orderChangeRecord.changeReason"
                                              type="textarea"
                                              auto-complete="off"
                                              readonly
                                              :autosize="{ minRows: 3, maxRows: 3}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-card>
                        <el-card v-if="orderSplitRecord != ''">
                            <el-col>
                                <el-form-item label="拆单原因：" :label-width="formLabelWidth"
                                              style="padding-bottom: 12px">
                                    <el-input v-model="orderSplitRecord.splitReason"
                                              type="textarea"
                                              auto-complete="off"
                                              readonly
                                              :autosize="{ minRows: 3, maxRows: 3}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-card>
                    </el-form>
                    <el-form :model="form" style="margin-top: 10px">
                        <div class="panel panel-primary">
                            <div class="panel-heading" style="text-align: left">
                                <h3 class="panel-title">订单信息</h3>
                            </div>
                            <div class="panel-body">
                                <el-col :span="6">
                                    <el-form-item label="合同号：" :label-width="formLabelWidth">
                                        <el-input
                                                readonly
                                                v-model="form.contractNum"
                                                placeholder="合同号"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="订单号：" :label-width="formLabelWidth">
                                        <el-input v-model="form.orderNum"
                                                  readonly
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="订机数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left;"
                                                         readonly
                                                         v-model="form.machineNum"
                                                         :step="1"
                                                         controls-position="right"
                                                         :min="1"
                                                         :max="1000">

                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="交货日期：" :label-width="formLabelWidth">
                                        <el-date-picker
                                                readonly
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
                                                readonly
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
                                        <el-input
                                                readonly
                                                v-model="form.sellman"
                                                placeholder="销售人员"
                                                auto-complete="off">
                                        </el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="包装方式：" :label-width="formLabelWidth">
                                        <el-select
                                                readonly
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
                                <el-col :span="24">
                                    <el-form-item label="包装备注：" :label-width="formLabelWidth"
                                    >
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 3, maxRows: 6}"
                                                readonly
                                                placeholder="包装备注"
                                                v-model="form.packageMark">
                                        </el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" :offset="0">
                                    <el-form-item label="备注信息：" :label-width="formLabelWidth">
                                        <el-input
                                                readonly
                                                type="textarea"
                                                :autosize="{ minRows: 3, maxRows: 10}"
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

                                                readonly
                                                v-model="form.customer"
                                                placeholder="客户"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="国家：" :label-width="formLabelWidth">
                                        <el-select
                                                readonly
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
                                                readonly
                                                v-model="form.brand"
                                                placeholder="商标"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="机型：" :label-width="formLabelWidth">
                                        <el-select
                                                readonly
                                                style="width: 100%"
                                                v-model="form.machineType.id"
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
                                        <el-input style="float: left;"
                                                  readonly
                                                 v-model="form.needleNum">

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头数：" :label-width="formLabelWidth">
                                        <el-input style="float: left"
                                                  readonly
                                                 v-model="form.headNum">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头距：" :label-width="formLabelWidth">
                                        <el-input style="float: left"
                                                 v-model="form.headDistance"
                                                  readonly>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="X行程：" :label-width="formLabelWidth">
                                        <el-input
                                                readonly
                                                v-model="form.xDistance"
                                                placeholder="X行程"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="Y行程：" :label-width="formLabelWidth">
                                        <el-input
                                                readonly
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
                                                readonly
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

                                                readonly
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
                                                readonly
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
                                                readonly
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
                                                readonly
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
                                                readonly
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
                                                   readonly
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
                                        <el-select v-model="form.orderDetail.electricLanguage"
                                                   clearable
                                                   readonly
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in pcLanguageList"
                                                    :key="item.text"
                                                    :value="item.text"
                                                    :label="item.text" >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="主电机：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricMotor"
                                                   clearable
                                                   readonly
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
                                                       readonly
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
                                                       readonly
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
                                                   readonly
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in electricPowerList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="6" :offset="0">-->
                                    <!--<el-form-item label="按钮开关：" :label-width="formLabelWidth">-->
                                        <!--<el-select v-model="form.orderDetail.electricSwitch"-->
                                                   <!--clearable-->
                                                   <!--readonly-->
                                                   <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                                    <!--v-for="item in electricSwitchList"-->
                                                    <!--:label="item.text"-->
                                                    <!--:value="item.text">-->
                                            <!--</el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="换色方式：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.colorChangeMode"
                                                       readonly>
                                                <el-option
                                                        v-for="item in colorChangeModeList"
                                                        :key="item.text"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="加油系统：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricOil"
                                                       clearable
                                                       readonly
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
                                                       readonly
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
                                <!--<el-col :span="6" :offset="0">-->
                                    <!--<el-form-item label="面板：" :label-width="formLabelWidth">-->
                                        <!--<template scope="scope">-->
                                            <!--<el-select v-model="form.orderDetail.axlePanel"-->
                                                       <!--clearable-->
                                                       <!--readonly-->
                                                       <!--placeholder="请选择">-->
                                                <!--<el-option-->
                                                        <!--v-for="item in axlePanelList"-->
                                                        <!--:label="item.text"-->
                                                        <!--:value="item.text">-->
                                                <!--</el-option>-->
                                            <!--</el-select>-->
                                        <!--</template>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="机针：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleNeedle"
                                                   clearable
                                                   readonly
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleNeedleList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="机针类型：" :label-width="formLabelWidth"
                                    >
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.axleNeedleType"
                                                       clearable
                                                       readonly
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in axleNeedleTypeList"
                                                        :key="item.text"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="6" :offset="0">-->
                                    <!--<el-form-item label="机头导轨：" :label-width="formLabelWidth">-->
                                        <!--<el-select v-model="form.orderDetail.axleRail"-->
                                                   <!--clearable-->
                                                   <!--readonly-->
                                                   <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                                    <!--v-for="item in axleRailList"-->
                                                    <!--:label="item.text"-->
                                                    <!--:value="item.text">-->
                                            <!--</el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="6" :offset="0">-->
                                    <!--<el-form-item label="底检方式：" :label-width="formLabelWidth">-->
                                        <!--<el-select v-model="form.orderDetail.axleDownCheck"-->
                                                   <!--clearable-->
                                                   <!--readonly-->
                                                   <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                                    <!--v-for="item in axleDownCheckList"-->
                                                    <!--:label="item.text"-->
                                                    <!--:value="item.text">-->
                                            <!--</el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="旋梭：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleHook"
                                                   clearable
                                                   readonly
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
                                                   readonly
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
                                                   readonly
                                                   placeholder="请选择">
                                            <el-option
                                                    v-for="item in axleUpperThreadList"
                                                    :label="item.text"
                                                    :value="item.text">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="24">-->
                                    <!--<el-form-item label="附加装置：" :label-width="formLabelWidth">-->
                                        <!--<el-input-->
                                                <!--type="textarea"-->
                                                <!--readonly-->
                                                <!--v-model="form.orderDetail.axleAddition"-->
                                                <!--:autosize="{ minRows: 3, maxRows: 10}">-->
                                        <!--</el-input>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
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
                                                       readonly
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
                                                       readonly
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
                                                       readonly
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

                                                       readonly
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
                                                       readonly
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
                                                       readonly
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
                                    <el-form-item label="立柱高度：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPoleHeight"
                                                       clearable
                                                       readonly
                                                       placeholder="请选择">
                                                <el-option
                                                        v-for="item in frameworkPoleHeightList"
                                                        :label="item.text"
                                                        :value="item.text">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="6" :offset="0">-->
                                    <!--<el-form-item label="日光灯：" :label-width="formLabelWidth">-->
                                        <!--<el-select v-model="form.orderDetail.frameworkLight"-->
                                                   <!--clearable-->
                                                   <!--readonly-->
                                                   <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                                    <!--v-for="item in frameworkLightList"-->
                                                    <!--:label="item.text"-->
                                                    <!--:value="item.text">-->
                                            <!--</el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
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
                                                   readonly
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
                                                   readonly
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
                                    <el-form-item label="绷架孔：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverReelHole"
                                                   clearable
                                                   readonly
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
                                                   readonly
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
                                                         readonly
                                                         controls-position="right">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="直档数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.orderDetail.driverVerticalNum"
                                                         readonly
                                                         controls-position="right">
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
                                </el-table>
                                <el-col :span="24" style="margin-top: 10px">
                                    <el-form-item label="附加装置：" :label-width="formLabelWidth">
                                        <tinymce style="margin-top: 10px" ref="editor" v-model="form.orderDetail.axleAddition" :readonly="true">
                                        </tinymce>
                                    </el-form-item >
                                </el-col >
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
    import Tinymce from "./Tinymce/index.vue"
    import { ConfigData } from '../config/dataconfig';
    var _this;
    export default {
        name: "order_manage",
        components: {
            Tinymce,
            ConfigData
        },
        data () {
            _this = this;
            return {
                configList: [],
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
                countryList: CountryList,
                allMachineType: [],
                pcModeList: PCModeList,
                pcLanguageList: LanguageList,
                electricMotorList: ElectricMotorList,
                xyMotorList: XYMotorList,
                trimList: TrimList,
                electricPowerList: ElectricPowerList,
                electricSwitchList: ElectricSwitchList,
                electricOilList: ElectricOilList,
                axleSplitList: AxleSplitList,
                axlePanelList: AxlePanelList,
                axleNeedleList: AxleNeedleList,
                axleNeedleTypeList: AxleNeedleTypeList,
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
                frameworkPoleHeightList: FrameworkPoleHeightList,
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
                colorChangeModeList: ColorChangeModeList,

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
                orderChangeRecord: "",
                orderSplitRecord: "" ,
                loadingUI: false,
                uploadDialogVisible: false,
                fileLists: [
//                    {
//                        name: 'food.jpeg',
//                        url: '',
//                    },
                ],
                uploadURL: HOST + "order/loading/list/upload/",
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
            notTechnicalTeam() {
                if (this.userinfo.role != null && this.userinfo.role.roleName != null) {
                    if (this.userinfo.role.roleName.indexOf("技术") != -1) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss");
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.onSearchDetailData();
            },
            search() {
                this.currentPage = 1;
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
                    marketGroupName: _this.userinfo.marketGroupName,
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
                _this.uploadData.orderId = _this.selectedItem.id;
                _this.uploadData.orderNum = _this.selectedItem.orderNum;
                _this.uploadData.type = 1;//1-装车单，2-联系单
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
                        fileList.splice(removeIndex, 1);
                    }
                    fileList = [];
                    showMessage(_this, errorMsg, 0)
                } else {
                    fileList = [];
                    fileList.push(file);
                }
                _this.fileLists = fileList;
            },

            submitUpload() {
                if (_this.fileLists == null || _this.fileLists.length == 0) {
                    showMessage(_this, "上传文件不能为空！", 0)
                    return;
                }
                _this.uploadData.createTime = new Date();
                var formData = new FormData($("#uploadForm")[0]);
                formData.append("uploadData", JSON.stringify(_this.uploadData));
                formData.append("orderNum", _this.uploadData.orderNum);
                $.ajax({
                    url: _this.uploadURL,// 需要链接到服务器地址
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.code === 200) {
                            if (_this.selectedItem.orderLoadingList != null && parseInt(_this.selectedItem.orderLoadingList.id) != 0) {
                                showMessage(_this, "装车单更新成功！", 1);
                            }
                            else {
                                //更新数据
                                _this.tableData.forEach(item=> {
                                    if (item.id == _this.selectedItem.id) {
                                        if (item.orderLoadingList != null) {
                                            item.orderLoadingList.id = res.data;
                                        }
                                        else {
                                            item.orderLoadingList = {
                                                id: res.data
                                            };
                                        }
                                        return;
                                    }
                                });
                                showMessage(_this, "装车单上传成功！", 1);
                            }
                            _this.uploadDialogVisible = false;
                        }
                        else {
                            showMessage(_this, '上传失败！', 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '上传失败！', 0);
                    }
                });
            },
            handleRemove(file, fileList) {
                _this.fileLists = fileList;
                console.log("remove file" + file.name);
            },
            handlePreview(file) {
                console.log(handlePreview);
            },

            onDownload(item)
            {
                _this.selectedItem = copyObject(item);
                $.ajax({
                    url: HOST + "order/loading/list/selectOrderLoadingFileNameByOrderId",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        order_id: _this.selectedItem.id,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data.length > 0) {
                                var downLoadURL = DOWNLOADPATH + res.data[res.data.length - 1];
                                _this.downloadFile(downLoadURL);
                            }
                        }
                    }
                })
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

            onDetail(item) {
                _this.selectedItem = copyObject(item);
                //reset
                this.orderChangeRecord = "";
                this.orderSplitRecord = "";
                this.form = copyObject(item);
                try {
                    if (this.form.equipment != null && this.form.equipment.length > 0) {
                        this.form.equipment = JSON.parse(this.form.equipment);
                    }
                } catch (ex) {
                    console.log(ex);
                }
                if(this.form.status == ORDER_CHANGED) {
                    $.ajax({
                        url: HOST + "order/change/record/getChangeRecordList",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            id: "",
                            orderId:_this.form.id + ""
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                let tmpList = res.data.list;
                                if(tmpList.length == 1) {
                                    _this.orderChangeRecord = tmpList[0];
                                }
                            }
                        }
                    })
                } else if(this.form.originalOrderId != null){
                    $.ajax({
                        url: HOST + "order/split/record/getSplitRecordList",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            id: "",
                            orderId:_this.form.id + ""
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                let tmpList = res.data.list;
                                if(tmpList.length == 1) {
                                    _this.orderSplitRecord = tmpList[0];
                                }
                            }
                        }
                    })
                }
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
                //_this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                //sessionStorage.setItem('allMachineType', JSON.stringify(res.data.list));
                            }
                        }
                    })
                }
            },

            initConfigData() {
                let configstring = sessionStorage.getItem('contract_config');
                if (configstring != null && configstring.length > 0) {
                    _this.configList = JSON.parse(configstring);
                    for (let i = 0; i < _this.configList.length; i++) {
                    _this[_this.configList[i].item] = _this.configList[i].data;
                    }
                } else {
                    $.ajax({
                    url: HOST + 'data/config/list',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function(data) {
                        if (data.code == 200) {
                        try {
                            let list = [];
                            if (data.data.list.length == 0) {
                            list = ConfigData;
                            } else {
                            try {
                                list = JSON.parse(data.data.list[0].data); //取数据库data字段为JSON字符,再转为对象数组
                            } catch (ex) {
                                list = ConfigData;
                            }
                            }
                            if (list != null && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].item == 'contract') {
                                //目前只支持合同页面数据配置
                                _this.configList = list[i].data;
                                break;
                                }
                            }
                            sessionStorage.setItem("contract_config",JSON.stringify(_this.configList))
                            for (let i = 0; i < _this.configList.length; i++) {
                                _this[_this.configList[i].item] = _this.configList[i].data;
                            }
                            }
                        } catch (ex) {
                            console.log(ex);
                        }
                        } else {
                        showMessage(_this, data.message, 0);
                        }
                    },
                    error: function(data) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                    });
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
            _this.initConfigData();
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            var oc = JSON.parse(sessionStorage.getItem('order_recorder'));//
            if (!isUndefined(oc) && oc != null) {
                _this.filters.order_num = oc.orderNum;
                sessionStorage.removeItem('order_recorder');
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


