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
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="searchDesignList">查询 </el-button>
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
                            <div slot="content">装车单</div>
                            <el-button size="mini" type="info" icon="el-icon-download"
                                       @click="onDownload(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">编辑</div>
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <div slot="content">删除</div>
                            <el-button size="mini" type="danger" icon="el-icon-delete"
                                       :disabled="!modifyAllowed"
                                       @click="handleDelete(scope.$index, scope.row)"></el-button>
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
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    订单信息
                                </div>
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
                                    <el-col :span="6"  v-show=" (designForm.orderNum != null)
                                                                && (designForm.orderNum.length != 0)">
                                        <el-button type="warning" plain size="medium"
                                                   @click="handleViewContract(designForm.orderNum)">查看订单 {{designForm.orderNum}}</el-button>

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
                                            <el-input v-model="designForm.guestName" clearable></el-input>
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
                                            <el-input v-model="designForm.orderSignStatus" clearable></el-input>
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
                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    设计准备
                                </div>
                                <el-row>
                                    <el-col :span="6"  >
                                        <el-form-item label="设计人员:" :label-width="longFormLabelWidth" prop="orderNum">
                                            <el-select
                                                    :disabled="notWritter() "
                                                    v-model="designForm.designer"
                                                    clearable
                                                    filterable >
                                                <el-option
                                                        v-for="item in disgnerList"
                                                        :label="item.account"
                                                        :value="item.account">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :offset="0">
                                    <el-form-item label="日期：" prop="createdDate"
                                                  :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                :disabled="notWritter()||mode==VIEW_MODE"
                                                type="date"
                                                v-model="designForm.createdDate">
                                        </el-date-picker>
                                    </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-row>
                                        <el-col :span="23" :offset="1">
                                            <el-form-item label="设计规格："   >
                                                <el-input type="textarea" v-model="designForm.machineSpec" :rows="2" clearable></el-input>
                                            </el-form-item >
                                        </el-col >
                                    </el-row>
                                    <el-row>
                                        <el-col :span="23" :offset="1">
                                            <el-form-item label="关键字："   >
                                                <el-input type="textarea" v-model="designForm.keywords" :rows="2" clearable></el-input>
                                            </el-form-item >
                                        </el-col >
                                    </el-row>
                                </el-row>


                            </el-card>
                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    设计进度
                                </div>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="图纸、装车单：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-form-item label="附件 " :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload()">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.drawingLoadingFiles)"
                                                    @click="onAttachedDownload(designForm.drawingLoadingFiles)">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.drawingLoadingFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.drawingLoadingFiles)">删除
                                            </el-button>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth" prop="orderNum">
                                            <el-switch
                                                    v-model="designForm.drawingLoadingDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="点孔、方管：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-form-item label="附件 " :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload()">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.holeTubeFiles)"
                                                    @click="onAttachedDownload(designForm.holeTubeFiles)">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.holeTubeFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.holeTubeFiles)">删除
                                            </el-button>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth" prop="orderNum">
                                                <el-switch
                                                        v-model="designForm.holeTubeDone"
                                                        active-color="#13ce66"
                                                        inactive-color="gray">
                                                </el-switch>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <!---->
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

        <!-- 在设计里面跳转到对应订单-->
        <el-dialog title="查看订单" :visible.sync="addContractVisible" fullscreen  @close="contractDialogCloseCallback()">
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
                                    <el-form-item label="合同号：" prop="contractNum" :label-width="formLabelWidth" >
                                        <el-input
                                                readonly disabled
                                                v-model="form.contractNum"
                                                placeholder="合同号"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="订单号：" prop="orderNum" :label-width="formLabelWidth" >
                                        <el-input v-model="form.orderNum"
                                                  disabled
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="订机数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left;"

                                                         v-model="form.machineNum"
                                                         :step="1"
                                                         controls-position="right"
                                                         :min="1" disabled
                                                         :max="1000">

                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="交货日期：" :label-width="formLabelWidth">
                                        <el-date-picker

                                                style="width: 100%"
                                                v-model="form.contractShipDate"
                                                type="date"
                                                disabled
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
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="包装备注：" :label-width="formLabelWidth"
                                    >
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 3, maxRows: 6}"
                                                disabled
                                                placeholder="包装备注"
                                                v-model="form.packageMark">
                                        </el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" :offset="0">
                                    <el-form-item label="备注信息：" :label-width="formLabelWidth">
                                        <el-input
                                                disabled
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
                                            <!--<el-option-->
                                            <!--v-for="item in countryList"-->
                                            <!--:label="item.text"-->
                                            <!--:value="item.text">-->
                                            <!--</el-option>-->
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
                                                v-model="form.machineType.id"
                                                clearable
                                                placeholder="请选择">
                                            <!--<el-option-->
                                            <!--v-for="item in allMachineType"-->
                                            <!--:label="item.name"-->
                                            <!--:value="item.id">-->
                                            <!--</el-option>-->
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="针数：" :label-width="formLabelWidth">
                                        <el-input style="float: left;"
                                                  disabled
                                                  v-model="form.needleNum">

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头数：" :label-width="formLabelWidth">
                                        <el-input style="float: left"
                                                  disabled
                                                  v-model="form.headNum">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="头距：" :label-width="formLabelWidth">
                                        <el-input style="float: left"
                                                  v-model="form.headDistance"
                                                  disabled>
                                        </el-input>
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
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="D轴上：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelDaxle"
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="H轴下：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelHaxle"
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="主电机：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelMotor"
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="盘带头：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTapingHead"
                                                placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="毛巾机针：" :label-width="formLabelWidth">
                                        <el-select
                                                disabled
                                                style="width: 100%"
                                                v-model="form.orderDetail.specialTowelNeedle"
                                                placeholder="请选择">
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
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="语言：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricLanguage"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="主电机：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricMotor"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="XY电机：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricMotorXy"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="剪线方式：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricTrim"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="电源：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.electricPower"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="换色方式：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.colorChangeMode"
                                                       disabled>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="加油系统：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.electricOil"
                                                       disabled
                                                       placeholder="请选择">
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
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="机针：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleNeedle"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="机针类型：" :label-width="formLabelWidth"
                                    >
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.axleNeedleType"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="旋梭：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleHook"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="跳跃方式：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleJump"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="面线夹持：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.axleUpperThread"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
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
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="台板：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPlaten"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="台板颜色：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPlatenColor"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="吊环：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkRing"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="电脑托架：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkBracket"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="急停装置：" :label-width="formLabelWidth">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkStop"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="立柱高度：" :label-width="formLabelWidth" prop="frameworkPoleHeight">
                                        <template scope="scope">
                                            <el-select v-model="form.orderDetail.frameworkPoleHeight"
                                                       disabled
                                                       placeholder="请选择">
                                            </el-select>
                                        </template>
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
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="驱动方式：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverMethod"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="绷架孔：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverReelHole"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="绷架：" :label-width="formLabelWidth">
                                        <el-select v-model="form.orderDetail.driverReel"
                                                   disabled
                                                   placeholder="请选择">
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="横档数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.orderDetail.driverHorizonNum"
                                                         disabled
                                                         controls-position="right">
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" :offset="0">
                                    <el-form-item label="直档数量：" :label-width="formLabelWidth">
                                        <el-input-number style="float: left"
                                                         v-model="form.orderDetail.driverVerticalNum"
                                                         disabled
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
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" style="margin-top: -20px; margin-right:2%">
                <el-button @click="contractDialogCloseCallback()" icon="el-icon-back" type="info">关闭订单页面</el-button>
            </div>
        </el-dialog>
        <el-dialog title="附件上传" :visible.sync="uploadDialogVisible"
                   width="35%" right @close="fileLists=[]" :modal="false">
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
                            >
                                <el-button slot="trigger" size="small"
                                           plain
                                           type="primary">选取文件
                                </el-button>
                                <el-button style="margin-left: 10px;" size="small"
                                           icon="el-icon-upload"
                                           :disabled="fileLists.length==0"
                                           type="success" @click="submitUpload(1)">
                                    上传到服务器
                                </el-button>
                                <div slot="tip" class="el-upload__tip"
                                     style="font-size: 12px;color: gray">
                                    上传文件
                                </div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-bottom: 30px">
                <el-col :span="24" style="margin-bottom: 30px;">
                    <el-button icon="el-icon-close"
                               size="normal"
                               type="danger"
                               @click="uploadDialogVisible = false">关 闭
                    </el-button>
                </el-col>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    var _this;

    export default {
        name: 'design_dep_manage',
        data() {
            _this = this;
            return {

                uploadDialogVisible: false,
                uploadURL: HOST + "contact/form/uploadDesignFiles",
                fileLists:[],
                //查看订单页面
                addContractVisible:false,
                orderChangeRecord: "",
                orderSplitRecord: "" ,//订单页面, 包括了订单细节
//                formList:[],
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

                allOrderList:[],
                disgnerList:[],
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
                //增加对话框 或者编辑
                addDesignVisible: false,
                dialogTitle: '设计',

                mode: 1,
                ADD_MODE: 1,
                EDIT_MODE: 2,
                VIEW_MODE: 3,
                formLabelWidth: '100px',
                longFormLabelWidth: '125px',
                formLabelWidthMiddle: '80px',
                formLabelWidthSmall: '60px',


                //用于保存设计内容
                designForm: {

                    orderNum: '',
                    order_id: '', ////
                    saleman: '',
                    guestName: '',
                    country: '',
                    machineNum: '',
                    remark: '',
                    orderStatus: CONTRACT_INITIAL,

                    designer: '',
//                    designCreatedDate: new Date(),
                    machineSpec: '',
                    keywords: '',
                    drawingLoadingDone: 0,
                    drawingLoadingiles:'',
//                    drawing_loading_done: 0,
                    holeTubeDone: 0,
                    holeTubeFiles:'',
//                    hole_tube_done: '',
                    bomDone: 0,
                    coverDone: 0,
                    coverFile:'',
                    createdDate: new Date(),
                    updatedDate: new Date(),

                    orderSignStatus: 0
                },

                designExist: false,
                rules: {
                    orderNum: [
//                        {  type: 'string',required: true, message: '请填写订单号!', trigger: 'change' }
                    ],
                },

                selectedItem: {},
            };
        },
        methods: {
            
            onUpload()
            {
                _this.fileLists = [];
                _this.uploadDialogVisible = true;
            },

            handleFileChange(file, fileList)
            {
                var errorMsg = "";
                var xlsFile = file.name.split('.');
                if (xlsFile == null || xlsFile.length < 2) {
                    errorMsg = "上传的文件没有后缀名，不能上传！";
                }
                // else if (xlsFile[1] !== "xls" && xlsFile[1] !== "xlsx") {
                //     errorMsg = "只能上传xls/xlsx文件，请重新上传！";
                // }
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

            handleRemove(file, fileList) {
                _this.fileLists = fileList;
                console.log("remove file" + file.name);
            },

            handlePreview(file) {
                console.log(handlePreview);
            },
            handleBefore(file)
            {
                console.log(handleBefore);
            },

            submitUpload(type){
                if (_this.fileLists == null || _this.fileLists.length == 0) {
                    showMessage(_this, "上传文件不能为空！", 0)
                    return;
                }
                var formData = new FormData($("#uploadForm")[0]);
                formData.append("file", _this.fileLists[0].name);
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
//                            if (_this.designForm.drawingLoadingFiles != null &&_this.lxdForm.contactForm.attachedFile .length> 0) {
//                                showMessage(_this, "附件更新成功！", 1);
//                            }
//                            else
                                {
                                showMessage(_this, "附件上传/更新成功！", 1);
                            }
                            _this.designForm.attachedFile=res.data;
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

            haveNoAttachedFile(fullPath){
                if (fullPath == null || fullPath == "") {
                    return true;
                } else {
                    return false;
                }
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

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑';
                this.mode = this.EDIT_MODE;
                this.selectedItem = copyObject(item);
                _this.fetchDesignData(item.id);
                this.addDesignVisible = true;
            },

            fetchDesignData(formId) {
                $.ajax({
                    url: HOST + 'design/dep/info/detail',
                    type: 'POST',
                    dataType: 'json',
                    data: {id: formId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.designForm=res.data;
//                            if(_this.lxdForm.contactForm.contactType.indexOf("变更")>=0)//变更
//                            {
//                                _this.checkedChangeTypes=_this.lxdForm.contactForm.contactContent.split(",");
//                                if(_this.lxdForm.contactForm.contactContentElse != "" ){
//                                    _this.lxdForm.contactForm.contactContentElseIsChecked = true;
//                                }
//                            }

                        } else {
                            console.log("fetchDesignData:" + res.message);
                        }
                    }
                });
            },

            modifyAllowed()
            {
                if (this.userInfo!= null) {
                    //是管理员， 允许修改，
                    if(this.userInfo.role.id == 1){
                        return true;
                    } else if(this.userInfo.role.id == 8) {
                        //技术部经理 8
                        return true;
                    }
                }
                return false;
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
            onAdd()
            {
                //先获取 order_id
                $.ajax({
                    url: HOST + 'machine/order/selectOrders',
                    type: 'POST',
                    dataType: 'json',
                    data: {order_num: _this.designForm.orderNum},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.designForm.order_id = res.data.list[0].id;
                            console.log("_this.designForm.order_id :" + _this.designForm.order_id );
                        } else {
                            console.log("getMachineOrderData err:" + res.message);
                            _this.errorMsg = '获取order_id出错！';
                            _this.isError = true;
                        }
                    },
                    error: function (info) {
                        _this.errorMsg = '服务器访问出错！';
                        _this.isError = true;
                    }
                });

                let submitData=JSON.stringify(_this.designForm);
                $.ajax({
                    url: HOST + 'design/dep/info/add',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonDesignDepInfoFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            //_this.addLxdVisible = false;
                            showMessage(_this, '添加成功', 1);
                            //新需求:赋值主键ID,UI不关闭，继续可编辑，变成更新页面
                            _this.designForm.id = res.data;
                            _this.mode = _this.EDIT_MODE;
                            _this.changeUIMode();
//                            _this.fetchLxdData(res.data);
//                            _this.selectContacts();
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
            },

            changeUIMode()
            {
                _this.isError = false;
                _this.errorMsg = '';
                if(_this.mode == _this.EDIT_MODE)
                {
                    _this.dialogTitle = '编辑设计';
                }else{
                    _this.dialogTitle = '新增设计';
                }
            },

            onEdit() {
                _this.designForm.updatedDate = new Date();
                let submitData=JSON.stringify(_this.designForm);
                $.ajax({
                    url: HOST + 'design/dep/info/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonDesignDepInfoFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            //_this.addLxdVisible = false;
                            showMessage(_this, '更新成功', 1);
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
            },

            validDesignContent(){
                //todo
                return false;
            },

            onAddOrEdit(formName) {

                //在此检查变更内容
                _this.isError = this.validDesignContent();
                if (_this.isError) {
                    console.log('提交的表单有问题，error submit!!');
                    return false;
                    showMessage(_this, _this.errorMsg, 0);
                } else {

                    if (_this.mode == _this.ADD_MODE) {
                        _this.onAdd();
                    }
                    else if (_this.mode == _this.EDIT_MODE) {
                        _this.onEdit();
                    }
                }
            },


            getMachineOrderData(orderNum) {
                $.ajax({
                    url: HOST + 'machine/order/selectOrders',
                    type: 'POST',
                    dataType: 'json',
                    data: {order_num: orderNum},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.form = copyObject(res.data.list[0]);
                        } else {
                            console.log("getMachineOrderData err:"+res.message);
                        }
                    }
                });
            },
            handleViewContract(orderNum){
                this.isError = false;
                this.errorMsg = '';
                this.getMachineOrderData(orderNum);
                _this.addContractVisible = true;
            },
            contractDialogCloseCallback() {
                _this.addContractVisible = false;
            },

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
                            _this.designForm.guestName = res.data.list[0].customer;
                            _this.designForm.country = res.data.list[0].country;
                            _this.designForm.machineNum = res.data.list[0].machineNum;
                            _this.designForm.orderstatus = res.data.list[0].status;
                            _this.designForm.orderId = res.data.id;
                            console.log(' 200, 获取 订单信息 OK');
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
                this.resetDesignFormEmpty();

            },

            resetDesignFormEmpty(){
                _this.designForm =  {
                    orderNum: '',
                            order_id: '', ////
                            saleman: '',
                            guestName: '',
                            country: '',
                            machineNum: '',
                            remark: '',
                            orderStatus: CONTRACT_INITIAL,

                            designer: '',
                            machineSpec: '',
                            keywords: '',
                            drawingLoadingDone: 0,
                            drawing_loading_done: 0,
                            holeTubeDone: 0,
                            bomDone: 0,
                            coverDone: 0,
                            createdDate: new Date(),
                            updatedDate: new Date(),

                            orderSignStatus: 0
                };
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                _this.resetDesignFormEmpty();
                _this.addDesignVisible = false;
                _this.selectContracts();
            },
            dialogClose() {
                _this.addDesignVisible = false;
                _this.searchDesignList();
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
            searchDesignList() {
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
            _this.searchDesignList();
            _this.fetchAllOrderList();
            _this.fetchDisgnerList();
        }
    };
</script>

<style scoped>
</style>
