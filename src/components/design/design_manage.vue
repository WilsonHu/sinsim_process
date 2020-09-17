<template>
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="thisFilters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="订单号:">
                            <el-input v-model="thisFilters.orderNum" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="销售员:">
                            <el-input v-model="thisFilters.saleman" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="客户:">
                            <el-input v-model="thisFilters.customer" placeholder="" auto-complete="off" clearable></el-input>
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
                            <el-select v-model="thisFilters.orderStatus" clearable>
                                <el-option
                                        v-for="item in orderStatusList"
                                        :value="item.value"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="图纸状态:">
                            <el-select v-model="thisFilters.drawingLoadingDoneStatus" clearable>
                                <el-option
                                        v-for="item in drawingLoadingDoneStatusList"
                                        :value="item.value"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="4">
                        <el-form-item label="设备规格:">
                            <el-input v-model="thisFilters.machineSpec" placeholder="" auto-complete="off" clearable
                                      placeholder="1-2-3*4">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="关键字:">
                            <el-input v-model="thisFilters.keywords" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="设计人员:">
                            <el-input v-model="thisFilters.designer" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="更新日期:">
                            <el-date-picker v-model="thisFilters.selectDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="0" >
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="searchDesignList">查询 </el-button>
                    </el-col>

                    <!--<el-col :span="2" :offset="0">-->
                        <!--<el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">设计</el-button>-->
                    <!--</el-col>-->
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
                <el-table-column align="center" label="订单号" min-width="105">
                    <template scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="80" prop="orderSignStatus" label="审核状态">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderSignStatus|filterOrderStatus}}
                            <!--{{scope.row.orderSignStatus}}-->
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" prop="updatedDate" min-width="95" label="订单审核更新">-->
                    <!--<template scope="scope">-->
                        <!--{{(scope.row.updateTime)|filterDateString}}-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column align="center" prop="nameplate" min-width="125" label="设备规格">
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

                <el-table-column align="center" prop="drawingFileDone" min-width="65" label="图纸">
                    <template scope="scope">
                        {{(scope.row.drawingFileDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="bomDone" min-width="65" label="BOM" >
                    <template scope="scope">
                        {{(scope.row.bomDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="holeDone" min-width="65" label="点孔" >
                    <template scope="scope">
                        {{(scope.row.holeDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="coverDone" min-width="65" label="罩盖" >
                    <template scope="scope">
                        {{(scope.row.coverDone)|filterDone }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="designStatus" label="当前状态" >
                    <template scope="scope">
                        {{(scope.row.designStatus) }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="95" label="设计更新">
                    <template scope="scope">
                        {{(scope.row.updatedDate)|filterDateString}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="240">
                    <template scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content">装车单</div>
                            <el-button size="mini" type="info" icon="el-icon-download"
                                       :disabled="scope.row.loadingFiles==null||scope.row.loadingFiles==''"
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
                                       :disabled="!deleteAllowedRow(scope.row)"
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
                        <el-form :model="designForm" :rules="rules" ref="ruleForm">

                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    订单信息
                                </div>
                                <el-row>
                                    <el-col :span="6"  >
                                        <el-form-item label="订单号:" :label-width="longFormLabelWidth" >
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
                                        <el-form-item label="设计人员:" :label-width="longFormLabelWidth" >
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
                                            <el-form-item label="设备规格："   >
                                                <el-input type="textarea" v-model="designForm.machineSpec"
                                                          :rows="2" clearable>
                                                </el-input>
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
                                        <el-col :span="5" :offset="3"  >
                                            <el-form-item label="文 件"
                                                          :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" :offset="1"  >
                                            <el-form-item label="更新日期"
                                                          :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label="更新人"
                                                          :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="图纸：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(1)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.drawingFiles)"
                                                    @click="onAttachedDownload(designForm, '图纸')">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.drawingFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.drawingFiles)">删除
                                            </el-button>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.drawingUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.drawingMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.drawingFileDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="装车单：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(2)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.loadingFiles)"
                                                    @click="onAttachedDownload(designForm, '装车单')">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.loadingFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.loadingFiles)">删除
                                            </el-button>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.loadingUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.loadingMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.loadingFileDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="点孔：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(3)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.holeFiles)"
                                                    @click="onAttachedDownload(designForm, '点孔')">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.holeFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.holeFiles)">删除
                                            </el-button>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.holeUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.holeMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.holeDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="方管：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(4)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.tubeFiles)"
                                                    @click="onAttachedDownload(designForm, '方管')">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.tubeFiles)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.tubeFiles)">删除
                                            </el-button>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.tubeUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.tubeMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.tubeDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="罩盖：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <!--<el-col :span="2">-->
                                        <!--<el-form-item label="文件 " :label-width="longFormLabelWidth">-->
                                        <!--</el-form-item>-->
                                        <!--</el-col>-->
                                        <el-col :span="1" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==VIEW_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(5)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(designForm.coverFile)"
                                                    @click="onAttachedDownload(designForm, '罩盖')">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" style="margin-left:40px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(designForm.coverFile)||notWritter()||mode==VIEW_MODE"
                                                    @click="handAttachedDelete(designForm.coverFile)">删除
                                            </el-button>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.coverUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.coverMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.coverDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="BOM表、轴单：" :label-width="longFormLabelWidth">
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" :offset="5"  >
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-date-picker
                                                        type="date"
                                                        :disabled = "true"
                                                        v-model="designForm.bomUpdateTime">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-left:20px;">
                                            <el-form-item label=""
                                                          :label-width="longFormLabelWidth">
                                                <el-input
                                                        :disabled = "true"
                                                        v-model="designForm.bomMan">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                    <el-col :span="2"   >
                                        <el-form-item label="是否完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="designForm.bomDone"
                                                    active-color="#13ce66"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-card>

                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    联系单信息
                                </div>
                                <el-row>
                                    <el-col :span="22" style="text-align: left">
                                          <span v-for="contact in form.contactFormDetailList">
                                            <el-button
                                                    type="warning"
                                                    plain
                                                    size="medium"
                                                    @click="handleViewContact(contact.id)"
                                                    style="margin: 10px;font-size: 20px;font-weight: bold">
                                                {{stringMake(contact.num, contact.status)}}
                                            </el-button>
                                          </span>
                                    </el-col>
                                </el-row> 
                                <div   v-if="contactFormDetailListIsEmpty(form.contactFormDetailList)">
                                    无联系单
                                </div>
                            </el-card>
                        </el-form>

                        <el-form>
                            <div>
                                <el-button @click="dialogClose()" icon="el-icon-back" type="info" offset="120">
                                    关 闭
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

                        <el-dialog title="文件上传" :visible.sync="uploadDialogVisible"
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
                                                           type="success" @click="submitUpload">
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
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog title="删除" :visible.sync="deleteConfirmVisible" width="30%" append-to-body>
                <span style="font-size: 22px">
                           确认要删除订单号为[
                            <b style="color: #F56C6C;font-weight: bold">{{selectedItem.orderNum}}</b> ] 的该设计单吗？
                </span>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
                            <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
                        </span>
            </el-dialog>

            <el-dialog title="删除附件" :visible.sync="attachedDeleteConfirmVisible" width="30%" append-to-body>
                        <span style="font-size: 22px">
                            确认要删除该附件吗？
                        </span>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="attachedDeleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
                            <el-button type="primary" @click="onConfirmDeleteAttached(selectedItem)" icon="el-icon-check">确 定</el-button>
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

        <!-- 跳转到联系单-->
        <el-dialog :visible.sync="addLxdVisible" fullscreen @close="contactDialogCloseCallback()">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="24">
                    <div
                            style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px"
                    >联系单</div>
                    <el-form :model="lxdForm.contactForm" :rules="rules" ref="ruleForm">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="联系单类型：" :label-width="longFormLabelWidth" prop="contactType">
                                    <el-select
                                            v-model="lxdForm.contactForm.contactType"
                                            placeholder="选择不同类型，会有不同的内容"
                                            clearable
                                            disabled
                                    >
                                        <el-option v-for="item in lxdTypes" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联系单号：" :label-width="longFormLabelWidth" prop="num">
                                    <el-input
                                            v-model="lxdForm.contactForm.num"
                                            disabled
                                            clearable
                                            placeholder="联系单号："
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-card class="box-card" style="margin: 25px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="提出部门：" :label-width="longFormLabelWidth">
                                        <el-input v-model="lxdForm.contactForm.applicantDepartment" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="提出人：" :label-width="formLabelWidth">
                                        <el-input v-model="lxdForm.contactForm.applicantPerson" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="申请日期：" prop="createDate" :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                disabled
                                                type="date"
                                                placeholder="申请日期"
                                                v-model="lxdForm.contactForm.createDate"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="2" v-show="isShowChangeContactForm">
                                    <el-form-item label="ECO希望日期：" prop="hopeDate" :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                disabled
                                                type="date"
                                                placeholder="ECO希望完成日期"
                                                v-model="lxdForm.contactForm.hopeDate"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6" :offset="1" v-show="isShowChangeContactForm">
                                    <el-form-item label="订单号: " :label-width="longFormLabelWidth" prop="orderNum">
                                        <el-input
                                                disabled
                                                v-model="lxdForm.contactForm.orderNum"
                                                clearable
                                                filterable
                                                placeholder="订单号"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="20" style="margin-top:10px;">
                                    <el-form-item label="变更主题：" :label-width="longFormLabelWidth" prop="contactTitle">
                                        <el-input
                                                type="textarea"
                                                v-model="lxdForm.contactForm.contactTitle"
                                                clearable
                                                :rows="1"
                                                disabled
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-show="isShowChangeContactForm">
                                <el-row :span="2" style="margin-top:10px;">
                                    <el-form-item
                                            label="变更内容："
                                            :label-width="longFormLabelWidth"
                                            prop="contactContent"
                                    >
                                        <el-checkbox-group
                                                v-model="checkedChangeTypes"
                                                disabled
                                                style="margin-left:0px;float:left;"
                                        >
                                            <el-checkbox
                                                    v-for="item in lxdChangeTypes"
                                                    :label="item"
                                                    :key="item"
                                                    @change="handleCheckedChange(checkedChangeTypes,item)"
                                            >{{item}}</el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-row>
                                <el-row>
                                    <el-col
                                            :span="20"
                                            style="margin-top:10px;"
                                            v-show="isShowChangeContactForm &&lxdForm.contactForm.contactContentElseIsChecked"
                                    >
                                        <el-form-item
                                                label="其他变更："
                                                :label-width="longFormLabelWidth"
                                                prop="contactContentElse"
                                        >
                                            <el-input
                                                    v-model="lxdForm.contactForm.contactContentElse"
                                                    placeholder="选中”其他变更”时输入"
                                                    clearable
                                                    disabled
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-row>
                            <el-row v-show="isShowWorkContactForm">
                                <el-col :span="20" style="margin-top:10px;">
                                    <el-form-item
                                            label="变更内容："
                                            :label-width="longFormLabelWidth"
                                            prop="contactContent"
                                    >
                                        <el-input
                                                type="textarea"
                                                v-model="lxdForm.contactForm.contactContent"
                                                :rows="5"
                                                disabled
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row v-show="isShowChangeContactForm">
                <span v-for="item in lxdForm.changeItemList" style="margin-top:10px;">
                  <el-col :span="8">
                    <el-form-item label="旧状态：" :label-width="longFormLabelWidth">
                      <el-input v-model="item.oldInfo" placeholder="输入变更前的状态" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="新状态：" :label-width="longFormLabelWidth">
                      <el-input v-model="item.newInfo" placeholder="输入变更后的状态" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="备注：" :label-width="longFormLabelWidth">
                      <el-input v-model="item.remarks" placeholder="输入备注" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                            disabled
                            size="mini"
                            type="danger"
                            class="el-icon-delete"
                            @click="onDeleteChangeItem(item)"
                            style="margin-top: 5px;"
                    ></el-button>
                  </el-col>
                </span>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <div>
                                    <el-col :span="2">
                                        <el-form-item label="附件: " :label-width="longFormLabelWidth"></el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="margin-left:20px;">
                                        <el-button
                                                size="small"
                                                type="success"
                                                icon="el-icon-download"
                                                :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedFile)"
                                                @click="onAttachedDownload(lxdForm.contactForm)"
                                        >下载</el-button>
                                    </el-col>
                                </div>
                            </el-row>
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item label :label-width="longFormLabelWidth">
                    <span
                            style="float:left;"
                    >{{removeAbsolutePath(lxdForm.contactForm.attachedFile)}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-card>

                        <el-card class="box-card" style="margin: 25px">
                            <div
                                    style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;"
                            >联系单审批</div>
                            <el-row>
                                <el-col :span="24">
                                    <el-table
                                            border
                                            :row-class-name="tableRowClassName"
                                            :data="lxdForm.contactSign.signContent"
                                            style="margin-bottom: 20px;margin-top: 20px;"
                                    >
                                        <el-table-column align="center" label="签核步骤" width="80">
                                            <template scope="scope">
                                                <div v-if="scope.row.shenHeEnabled" style="color: darkorange">
                                                    <el-button
                                                            style="font-size: 14px; font-weight: bold"
                                                            type="primary"
                                                            round
                                                            size="mini"
                                                    >{{scope.row.number}}</el-button>
                                                </div>

                                                <div v-else>
                                                    <el-button
                                                            style="font-size: 14px; font-weight: bold"
                                                            type="info"
                                                            round
                                                            disabled
                                                            size="mini"
                                                    >{{scope.row.number}}</el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" width="150" label="签核角色">
                                            <template slot-scope="scope">
                        <span
                                style="font-size: 14px; font-weight: bold"
                        >{{scope.row.roleId | filterRole}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" width="150" label="签核人">
                                            <template slot-scope="scope">
                                                <span style="font-size: 14px; font-weight: bold">{{scope.row.user}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" width="180" label="日期">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.date != null && scope.row.date != "" ? formatDate(scope.row.date) : "未提交" }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="意见">
                                            <template slot-scope="scope">
                                                <el-input
                                                        type="textarea"
                                                        clearable
                                                        :disabled="true"
                                                        v-model="scope.row.comment"
                                                        auto-complete="off"
                                                ></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" width="220">
                                            <template scope="scope">
                                                <el-tooltip
                                                        placement="top"
                                                        content="同意"
                                                        v-show="isRowHasPermissionToShow(scope.row)"
                                                >
                                                    <el-button
                                                            :disabled="true"
                                                            type="success"
                                                            icon="el-icon-check"
                                                            size="mini"
                                                            @click="handleSubmitLxdSign(scope.row)"
                                                    ></el-button>
                                                </el-tooltip>

                                                <el-tooltip
                                                        placement="top"
                                                        content="驳回"
                                                        v-show="isRowHasPermissionToShow(scope.row)"
                                                >
                                                    <el-button
                                                            :disabled="true"
                                                            type="danger"
                                                            icon="el-icon-close"
                                                            size="mini"
                                                            @click="handleRejectLxdSign(scope.row)"
                                                    ></el-button>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-form>
                    <el-form>
                        <div>
                            <el-button
                                    @click="contactDialogCloseCallback()"
                                    icon="el-icon-back"
                                    type="info"
                                    offset="120"
                            >关 闭</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
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

                orderStatusList: OrderStatusList,
                drawingLoadingDoneStatusList:doneStatusList,
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
                fileLists:[],
                //查看订单页面
                addContractVisible:false,
                orderChangeRecord: "",
                orderSplitRecord: "" ,//订单页面, 包括了订单细节
//                formList:[],
                form: {
                    contactFormDetailList:[],
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
                queryMachineTypeURL: HOST + 'machine/type/list',
                deleteUrl: HOST + 'design/dep/info/delete',
                allMachineType: [],

                thisFilters: {
                    customer: '',
                    contract_num: '',
                    orderNum: '',
                    //machineLength: '',
                    sellman: '',
                    selectDate:'' , //默认查询当天 [new Date(), new Date()]
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
                    drawingMan:'', //图纸更新人
                    loadingMan:'', //装车单更新人
                    tubeMan:'', //方管 的更新人
                    holeMan:'',
                    bomMan:'',
                    coverMan:'',
//                    designCreatedDate: new Date(),
                    machineSpec: '',
                    keywords: '',
                    drawingFileDone: 0,
                    loadingFileDone: 0,
                    drawingLoadingiles:'',
                    bomRequired:0,
                    holeDone: 0,
                    tubeDone: 0,
                    drawingFiles:'',
                    loadingFiles:'',
                    holeFiles:'',
                    tubeFiles:'',
//                    hole_tube_done: '',
                    bomDone: 0,
                    coverDone: 0,
                    coverFile:'',
                    createdDate: new Date(),
                    updatedDate: new Date(),

                    orderSignStatus: 0,

                    //更新时间会在后台完成，然后
                    drawingUpdateTime: new Date(),
                    loadingUpdateTime: new Date(),
                    holeUpdateTime: new Date(),
                    tubeUpdateTime: new Date(),
                    bomUpdateTime: new Date(),
                    coverUpdateTime: new Date(),
                },

                lxdForm: {
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
                    changeItemList: [
                        {
                            //变更单内容
                            id: "",
                            contactFormId: "",
                            oldInfo: "",
                            newInfo: "",
                            remarks: ""
                        }
                    ],
                    contactSign: {
                        id: "",
                        contactFormId: "",
                        currentStep: "",
                        createTime: "",
                        signContent: [
                            {
                                number: "",
                                roleId: "",
                                signType: "",
                                date: "",
                                user: "",
                                result: "",
                                comment: "",
                                shenHeEnabled: true
                            }
                        ]
                    }
                },
                designExist: false,
                rules: {
                    orderNum: [
//                        {  type: 'string',required: true, message: '请填写订单号!', trigger: 'change' }
                    ],
                },

                selectedItem: {},
                //给后端保存文件命名用。
                uploadFileType: '',
                deleteConfirmVisible: false,
                attachedDeleteConfirmVisible: false,
                deleteType:'',
            };
        },
        methods: {

            // 附件删除
            handAttachedDelete(item) {
                _this.attachedDeleteConfirmVisible = true;

                if(item.indexOf("图纸") >= 0){
                    _this.deleteType = "图纸";
                } else if(item.indexOf("装车单") >= 0){
                    _this.deleteType = "装车单";
                } else if(item.indexOf("点孔") >= 0){
                    _this.deleteType = "点孔";
                } else if(item.indexOf("方管") >= 0){
                    _this.deleteType = "方管";
                } else if(item.indexOf("罩盖") >= 0){
                    _this.deleteType = "罩盖";
                }

            },

            onConfirmDeleteAttached(item){
                _this.attachedDeleteConfirmVisible = false;
                if(_this.deleteType.indexOf("图纸") >=0 ) {
                    _this.designForm.drawingFiles = "";
                } else if(_this.deleteType.indexOf("装车单") >=0 ) {
                    _this.designForm.loadingFiles = "";
                } else if(_this.deleteType.indexOf("点孔") >=0 ) {
                    _this.designForm.holeFiles = "";
                } else if(_this.deleteType.indexOf("方管") >=0 ) {
                    _this.designForm.tubeFiles = "";
                } else if(_this.deleteType.indexOf("罩盖") >=0 ) {
                    _this.designForm.coverFile = "";
                }

                    let submitData=JSON.stringify(_this.designForm);
                $.ajax({
                    url: HOST + 'design/form/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonOptimizeFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            //_this.addLxdVisible = false;
                            showMessage(_this, '附件删除成功', 1);
                            _this.onSearchDetailData();
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

            contactFormDetailListIsEmpty(contactFormDetailList){
                if(contactFormDetailList == null || contactFormDetailList =='' || contactFormDetailList.isEmpty){
                    return true;
                } else {
                    return false;
                }
            },

            //filter里才用到
//            filterOrderStatus(id)
//            {
//                var result = _this.orderStatusList[0].name;
//                for (var i = 0; i < _this.orderStatusList.length; i++) {
//                    if (id == _this.orderStatusList[i].value) {
//                        result = _this.orderStatusList[i].name;
//                        break;
//                    }
//                }
//                return result;
//            },

            handleViewContact(id) {
                _this.getContactAllData(id);
                this.addLxdVisible = true;
            },

            contactDialogCloseCallback() {
                _this.addLxdVisible = false;
            },

            removeAbsolutePath(fullPath) {
                if (fullPath == null || fullPath == "") {
                    return "无附件";
                } else {
                    return fullPath.split("/")[fullPath.split("/").length - 1];
                }
            },

            stringMake(contactNum, contactStatus){
                return contactNum+ "(" + contactStatus.slice(3) + ")";
            },

            tableRowClassName({ row, rowIndex }) {
                if (row.result == SIGN_REJECT) {
                    return "warning-row";
                }
                return "";
            },

            isRowHasPermissionToShow(row) {
                return false;
            },

            initAllRoles() {
                $.ajax({
                    url: HOST + "role/list",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                        }
                    }
                });
            },

            getRoleNameById(id) {
                let result = "";
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },

            getContactAllData(formId) {
                $.ajax({
                    url: HOST + "contact/form/getAllInfo",
                    type: "POST",
                    dataType: "json",
                    data: {
                        contactFormId: formId
                    },
                    success: function(res) {
                        if (res.code == 200) {
                            res.data.contactSign.signContent = JSON.parse(
                                    res.data.contactSign.signContent
                            );
                            _this.lxdForm = res.data;
                            if (_this.lxdForm.contactForm.contactType.indexOf("变更") >= 0) {
                                //变更
                                _this.checkedChangeTypes = _this.lxdForm.contactForm.contactContent.split(
                                        ","
                                );
                                if (_this.lxdForm.contactForm.contactContentElse != "") {
                                    _this.lxdForm.contactForm.contactContentElseIsChecked = true;
                                }
                            }
                        } else {
                            console.log("getContactAllData:" + res.message);
                        }
                    }
                });
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd");
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteConfirmVisible = true;
                } else{
                }
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: _this.selectedItem.id
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.searchDesignList();
                            showMessage(_this, '删除设计单成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },

            onUpload(type)
            {
                _this.fileLists = [];
                if(type == 1) {
                    _this.uploadFileType = "图纸";
                } else if(type == 2) {
                    _this.uploadFileType = "装车单";
                } else if(type == 3) {
                    _this.uploadFileType = "点孔";
                } else if(type == 4) {
                    _this.uploadFileType = "方管";
                } else if(type == 5) {
                    _this.uploadFileType = "罩盖";
                } else {
                    _this.uploadFileType = "其他";
                }
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
            
            submitUpload(){
                if (_this.fileLists == null || _this.fileLists.length == 0) {
                    showMessage(_this, "上传文件不能为空！", 0)
                    return;
                }
                var formData = new FormData($("#uploadForm")[0]);
                formData.append("file", _this.fileLists[0].name);
                formData.append("orderNum", _this.designForm.orderNum);
                formData.append("type", _this.uploadFileType);

                //在第一次新建时上传文件，designDepInfoID为空，需要把日期在前端准备好
                if(_this.designForm.id == null) {
                    _this.designForm.drawingUpdateTime = new Date();
                    _this.designForm.loadingUpdateTime = new Date();
                    _this.designForm.holeUpdateTime = new Date();
                    _this.designForm.tubeUpdateTime = new Date();
                    _this.designForm.bomUpdateTime = new Date();
                    _this.designForm.coverUpdateTime = new Date();
                } else {
                    // 在编辑时，设计页已经保存过了，只需要上传ID，让后端设定更新时间
                    formData.append("designDepInfoID", _this.designForm.id);
                }

                $.ajax({
                    url:  HOST + "design/dep/info/uploadDesignFile",// 需要链接到服务器地址
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.code === 200) {

                            if(_this.uploadFileType == "图纸") {
                                _this.designForm.drawingFiles = res.data;
                                _this.designForm.drawingUpdateTime = new Date();
                                _this.designForm.drawingMan = _this.userInfo.account;
                            }  else if(_this.uploadFileType == "装车单") {
                                _this.designForm.loadingFiles = res.data;
                                _this.designForm.loadingMan = _this.userInfo.account;
                                _this.designForm.loadingUpdateTime = new Date();
                            } else if(_this.uploadFileType == "点孔") {
                                _this.designForm.holeFiles = res.data;
                                _this.designForm.holeUpdateTime = new Date();
                                _this.designForm.holeMan = _this.userInfo.account;
                            }  else if(_this.uploadFileType == "方管") {
                                _this.designForm.tubeFiles = res.data;
                                _this.designForm.tubeUpdateTime = new Date();
                                _this.designForm.tubeMan = _this.userInfo.account;
                            } else if(_this.uploadFileType == "罩盖") {
                                _this.designForm.coverFile = res.data;
                                _this.designForm.coverMan = _this.userInfo.account;
                                _this.designForm.coverUpdateTime = new Date();
                            }  else if(_this.uploadFileType == "BOM") {
                                //BOM 没附件
                                _this.designForm.bomUpdateTime = new Date();
                            }

                            showMessage(_this, "文件上传/更新成功！", 1);

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
                                var downLoadURL = DOWNLOADPATH_DESIGN + res.data;
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

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑';
                this.mode = this.EDIT_MODE;
                this.selectedItem = copyObject(item);
                _this.fetchDesignData(item.id);

                //联系单信息也会用到
                _this.getMachineOrderData(item.orderNum);
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

            deleteAllowedRow(row)
            {
                if (this.userInfo!= null) {
                    //是管理员， 允许修改，
                    if(this.userInfo.role.id == 1){
                        return true;
                    } else if(this.userInfo.role.id == 8) {
                        //技术部经理 8
                        return true;
                    } else {
                        // 即使是被指定的人员 不允许删除
                        return false;
                    }
                }
                return false;
            },

            onAdd()
            {
//                //先获取 order_id
//                $.ajax({
//                    url: HOST + 'machine/order/selectOrders',
//                    type: 'POST',
//                    dataType: 'json',
//                    data: {order_num: _this.designForm.orderNum},
//                    success: function (res) {
//                        if (res.code == 200) {
//                            _this.designForm.order_id = res.data.list[0].id;
//                            console.log("_this.designForm.order_id :" + _this.designForm.order_id );
//                        } else {
//                            console.log("getMachineOrderData err:" + res.message);
//                            _this.errorMsg = '获取order_id出错！';
//                            _this.isError = true;
//                        }
//                    },
//                    error: function (info) {
//                        _this.errorMsg = '服务器访问出错！';
//                        _this.isError = true;
//                    }
//                });

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
                            _this.searchDesignList();
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
                            _this.form.contactFormDetailList = res.data.list[0].contactFormDetailList;
                        } else {
                            console.log("getMachineOrderData err:"+res.message);
                        }
                    }
                });
            },
            handleViewContract(orderNum){
                this.isError = false;
                this.errorMsg = '';
                _this.addContractVisible = true;
            },
            contractDialogCloseCallback() {
                _this.addContractVisible = false;
            },

            onOrderChanged(orderNum)
            {
                //获取 订单的销售员等, 以及对应联系单信息
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
                            _this.designForm.order_id = res.data.list[0].id;
                            _this.designForm.orderSignStatus = res.data.list[0].status;
                            _this.form.contactFormDetailList = res.data.list[0].contactFormDetailList;
                            console.log(' 200, 获取 订单信息 OK, orderSignStatus:' + _this.designForm.orderSignStatus);
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
                    drawingMan:'', //图纸更新人
                    loadingMan:'', //装车单更新人
                    tubeMan:'', //方管 的更新人
                    holeMan:'',
                    bomMan:'',
                    coverMan:'',
                    machineSpec: '',
                    keywords: '',
                    drawingFileDone: 0,
                    loadingFileDone: 0,
                    holeDone: 0,
                    tubeDone: 0,
                    bomDone: 0,
                    bomRequired: 0,
                    drawingFiles:'',
                    loadingFiles:'',
                    holeFiles:'',
                    tubeFiles:'',
//                    hole_tube_done: '',
                    coverDone: 0,
                    coverFile:'',
                    createdDate: new Date(),
                    updatedDate: new Date(),

                    orderSignStatus: 0,
                      //更新时间会在后台完成，然后
                    drawingUpdateTime: new Date(),
                    loadingUpdateTime: new Date(),
                    holeUpdateTime: new Date(),
                    tubeUpdateTime: new Date(),
                    bomUpdateTime: new Date(),
                    coverUpdateTime: new Date(),
                };
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                _this.resetDesignFormEmpty();
                _this.addDesignVisible = false;
//                _this.selectContracts();
            },
            dialogClose() {
                _this.addDesignVisible = false;
                _this.resetDesignFormEmpty();
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
                    guestName: _this.thisFilters.customer,
                    contract_num: _this.thisFilters.contract_num,
                    orderNum: _this.thisFilters.orderNum,
                    is_fuzzy: true,
                    saleman: _this.thisFilters.saleman,
                    orderStatus:_this.thisFilters.orderStatus,
                    drawingLoadingDoneStatus:_this.thisFilters.drawingLoadingDoneStatus,
                    machineSpec: _this.thisFilters.machineSpec,
                    keywords: _this.thisFilters.keywords,
                    designer: _this.thisFilters.designer,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                        _this.thisFilters.selectDate != null &&
                        _this.thisFilters.selectDate.length > 0
                ) {
                    condition.updateDateStart = _this.thisFilters.selectDate[0].format(
                            'yyyy-MM-dd'
                    );
                    condition.updateDateEnd = _this.thisFilters.selectDate[1].format(
                            'yyyy-MM-dd'
                    );
                }
                $.ajax({
                    url: HOST + 'design/dep/info/selectDesignDepInfo',
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
                    customer: _this.thisFilters.customer,
                    contract_num: _this.thisFilters.contract_num,
                    order_num: _this.thisFilters.orderNum,
                    is_fuzzy: true,
                    sellman: _this.thisFilters.sellman,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                        _this.thisFilters.selectDate != null &&
                        _this.thisFilters.selectDate.length > 0
                ) {
                    condition.queryStartTime = _this.thisFilters.selectDate[0].format(
                            'yyyy-MM-dd'
                    );
                    condition.queryFinishTime = _this.thisFilters.selectDate[1].format(
                            'yyyy-MM-dd'
                    );
                }
                if (
                        _this.thisFilters.selectDate != null &&
                        _this.thisFilters.selectDate.length > 0
                ) {
                    condition.query_start_time = _this.thisFilters.selectDate[0].format(
                            'yyyy-MM-dd'
                    );
                    condition.query_finish_time = _this.thisFilters.selectDate[1].format(
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
        computed: {
            isShowChangeContactForm: function() {
                //test为计算属性，调用时和调用属性一样调用test即可
                let res = _this.lxdForm.contactForm.contactType.indexOf("变更") >= 0;
                //_this.rules.hopeDate[0].required=res;
                return res;
            },

            isShowWorkContactForm: function() {
                //test为计算属性，调用时和调用属性一样调用test即可
                let res = _this.lxdForm.contactForm.contactType.indexOf("工作") >= 0;
                if (res) {
                    /// 这是一个workAround, 因为工作联系单里本来是不需要hopeDate
                    _this.lxdForm.contactForm.hopeDate = new Date();
                }
                return res;
            }
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
                return resDate.format("yyyy-MM-dd");
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
//                console.log("status:" + status);
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
            _this.initAllRoles();
        },

        mounted: function () {
//        _this.selectContacts();
            _this.searchDesignList();
            _this.fetchAllOrderList();
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
