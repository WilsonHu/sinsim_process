<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div>
            <el-row>
                <!--<el-col :span="3">-->
                <!--<el-row type="flex" justify="center">-->
                <!--<el-col :span="19">-->
                <!--<div style="font-size: 20px;font-weight: bold; margin-top: 12px">签核中：</div>-->
                <!--</el-col>-->
                <!--<el-col :span="5">-->
                <!--<div style="font-size: 36px; font-weight: bold;">12</div>-->
                <!--</el-col>-->
                <!--</el-row>-->
                <!--</el-col>-->
                <el-col :span="2" :offset="22">
                    <el-button
                            icon="el-icon-plus"
                            size="normal"
                            type="danger"
                            @click="handleAdd">合同
                    </el-button>
                </el-col>
            </el-row>
            <el-col class="well well-lg" style="background-color: white; margin-top: 10px">
                <el-row>
                    <el-col>
                        <el-form :model="filters" label-position="right" label-width="80px">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="合同号:">
                                        <el-input v-model="filters.contractNum"
                                                  placeholder="合同号"
                                                  auto-complete="off" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="审核部门:">
                                        <el-select v-model="filters.roleName" clearable>
                                            <el-option
                                                    v-for="item in allRoles"
                                                    :key="item.id"
                                                    :value="item.roleName"
                                                    :label="item.roleName">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="审核状态:">
                                        <el-select v-model="filters.status" clearable>
                                            <el-option
                                                    v-for="item in orderStatusList"
                                                    :key="item.value"
                                                    :value="item.value"
                                                    :label="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="销售人员:">
                                        <el-input v-model="filters.sellman"
                                                  placeholder="销售人员"
                                                  auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-button
                                            icon="el-icon-search"
                                            size="normal"
                                            type="primary"
                                            @click="search">查询
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">
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
                                element-loading-text="获取数据中..."
                                :data="tableData"
                                border
                                show-overflow-tooltip="true"
                                style="width: 100%;">
                            <el-table-column
                                    align="center"
                                    width="60"
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
                            <el-table-column
                                    align="center"
                                    prop="customerName"
                                    label="客户">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    label="订单数" width="80">
                                <template scope="scope">
                                    <div v-on:click="onCourseDetail(scope.row)"
                                         style="font-weight: bold;"
                                         class="btn btn-link">
                                        {{scope.row.orderNum}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="sellman"
                                    label="销售人员">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="status"
                                    label="审核状态">
                                <template scope="scope">
                                    <div :class="scope.row.status|filterOrderStatusStyle">
                                        {{filterContractStatus(scope.row.status)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="currentStep"
                                    label="审核阶段">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="createTime"
                                    width="160"
                                    label="创建时间">
                                <template scope="scope">
                                    <div>
                                        {{formatDate(scope.row.createTime)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    width="160"
                                    label="更新时间">
                                <template scope="scope">
                                    <div>
                                        {{scope.row.updateTime != null ? formatDate(scope.row.updateTime) : ""}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    label="操作" width="280">
                                <template scope="scope">
                                    <el-button
                                            v-if="userInfo.role.roleName !='销售员'"
                                            size="small"
                                            type="primary"
                                            icon="el-icon-check"
                                            @click="handleSign(scope.$index, scope.row)">审核
                                    </el-button>
                                    <el-button
                                            v-if="userInfo.role.roleName =='销售员' || userInfo.role.id == 1"
                                            size="small"
                                            type="primary"
                                            icon="el-icon-edit"
                                            @click="handleEdit(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <!--<el-button-->
                                    <!--size="small"-->
                                    <!--type="danger"-->
                                    <!--v-if="userInfo.account=='admin'"-->
                                    <!--@click="handleDelete(scope.$index, scope.row)" >删除-->
                                    <!--</el-button >-->
                                    <el-button
                                            size="small"
                                            type="danger"
                                            icon="el-icon-download"
                                            @click="handleDownload(scope.$index, scope.row)">下载
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
                                    :total="totalNum">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </div>
        <el-dialog :visible.sync="addContractVisible" fullscreen @close="dialogCloseCallback()">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="21">
                    <div style="text-align: center; font-weight: bold; font-size: 20px; font-weight:bold;padding-bottom: 20px">
                        {{dialogTitle}}
                    </div>
                    <el-form class="panel-body">
                        <el-col :span="6">
                            <el-form-item label="合同号：" :label-width="formLabelWidth">
                                <el-input v-model="contractForm.contractNum"
                                          :disabled="changeContractContentDisable(contractForm)"
                                          placeholder="合同号"
                                          @blur="onContractInputUnfocus(contractForm.contractNum)"
                                ></el-input>
                            </el-form-item>
                            <div style="margin-top: -15px">
                                <span v-if="contractExist"
                                      style="color: red; font-size: 12px;">{{contractErrorMsg}}</span>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户：" :label-width="formLabelWidth">
                                <!-- <el-input v-model="contractForm.customerName"
                                          :disabled="changeContractContentDisable(contractForm)"
                                          placeholder="客户"
                                ></el-input> -->
                                <el-autocomplete
                                        :disabled="changeContractContentDisable(contractForm)"
                                        v-model="contractForm.customerName"
                                        :fetch-suggestions="queryCustomer"
                                        placeholder="客户"
                                >
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="销售员：" :label-width="formLabelWidth">
                                <!-- <el-input v-model="contractForm.sellman"
                                          :disabled="changeContractContentDisable(contractForm)"
                                          placeholder="销售员"
                                ></el-input> -->
                                <el-autocomplete
                                        :disabled="changeContractContentDisable(contractForm)"
                                        v-model="contractForm.sellman"
                                        :fetch-suggestions="querySearchAsync"
                                        placeholder="销售员"
                                        @select="handleSelect">
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" :offset="4"
                                v-if="haveInitialMachineOrder() && mode == EDIT_MODE">
                            <el-button
                                    size="normal"
                                    type="danger"
                                    icon="el-icon-check"
                                    @click="startToSign">提交审核
                            </el-button>
                        </el-col>
                    </el-form>
                    <el-collapse v-model="collapseActiveNames" @change="handleCollapseChange"
                                 style="margin-left: 25px;margin-right: 25px">
                        <el-collapse-item :title="collapseTitle" name="1">

                            <el-tabs v-model="editableTabsValue" type="border-card" style="padding-right: 3px"
                                     :editable="(mode == EDIT_MODE && (editContractSign.currentStep != '签核完成')) || mode == ADD_MODE"
                                     @edit="handleEditTab">
                                <el-tab-pane
                                        style="margin-left: 20px;margin-right: 20px"
                                        v-for="(item, index) in requisitionForms"
                                        :key="item.name"
                                        :label="item.title"
                                        :name="item.name">
                                    <el-form :model="item">
                                        <div>
                                            <el-card
                                                    v-if="(item.machineOrder.originalOrderId != null && item.machineOrder.originalOrderId != 0) && item.orderChangeRecord != null && (mode == CHANGE_MODE ||item.orderChangeRecord.changeReason != '')">
                                                <el-col :span="6">
                                                    <el-form-item label="原单号：" :label-width="formLabelWidth">
                                                            <span style="text-align: left; font-weight: bold;font-size: 16px; color: #409EFF">
                                                                {{filterOrderNum(item.machineOrder.originalOrderId)}}
                                                            </span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col>
                                                    <el-form-item label="改单原因：" :label-width="formLabelWidth"
                                                                  style="padding-bottom: 12px"
                                                                  prop="orderChangeRecord.changeReason"
                                                                  :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                  :rules="[
                                                                              { required: true, message: '改单原因不能为空'},
                                                                      ]">
                                                        <el-input v-model="item.orderChangeRecord.changeReason"
                                                                  type="textarea"
                                                                  auto-complete="off"
                                                                  :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                  :autosize="{ minRows: 3, maxRows: 3}"
                                                                  placeholder="改单原因"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-card>
                                            <el-card
                                                    v-if="item.machineOrder.originalOrderId != null && item.orderSplitRecord != null && (mode == SPLIT_MODE ||item.orderSplitRecord.splitReason != '')">
                                                <el-col :span="6">
                                                    <el-form-item label="原单号：" :label-width="formLabelWidth">
                                                            <span style="text-align: left; font-weight: bold;font-size: 16px; color: #409EFF">
                                                                {{filterOrderNum(item.machineOrder.originalOrderId)}}
                                                            </span>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col>
                                                    <el-form-item label="拆单原因：" :label-width="formLabelWidth"
                                                                  style="padding-bottom: 12px"
                                                                  prop="orderSplitRecord.splitReason"
                                                                  :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                  :rules="[
                                                                              { required: true, message: '拆单原因不能为空'},
                                                                      ]">
                                                        <el-input v-model="item.orderSplitRecord.splitReason"
                                                                  type="textarea"
                                                                  auto-complete="off"
                                                                  :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                  :autosize="{ minRows: 3, maxRows: 3}"
                                                                  placeholder="拆单原因"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-card>
                                            <el-row>
                                                <el-col :span="6"
                                                        style="font-size: 20px; margin-bottom: 10px;margin-top: 10px">
                                                    <el-form-item label="订单号：" :label-width="formLabelWidth">
                                                        <el-input v-model="item.machineOrder.orderNum"
                                                                  placeholder="订单号"
                                                                  :disabled="changeOrderContentDisable(item.machineOrder) || (item.machineOrder.originalOrderId != 0 && item.machineOrder.status == 3)"
                                                        ></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6" style="margin-bottom: 10px;margin-top: 10px">
                                                    <el-form-item label="填表日期：" :label-width="formLabelWidth">
                                                        <el-input v-model="item.machineOrder.createTime" disabled
                                                                  :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                  placeholder="日期"
                                                        ></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="1" :offset="2 ">
                                                    <el-button type="success" size="small" style="margin-top: 15px"
                                                               @click="handleCopyOrder(item)">复制
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="1" :offset="1">
                                                    <el-button type="danger" size="small" style="margin-top: 15px"
                                                               :disabled="changeOrderContentDisable(item.machineOrder)"
                                                               @click="handlePasteOrder(item)">粘贴
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="1" :offset="4">
                                                    <el-button type="danger" size="small" style="margin-top: 15px"
                                                               v-if="canSplitOrChangeOrder(item.machineOrder.status)"
                                                               :disabled="item.machineOrder.machineNum <= 1||editContract.status==1"
                                                               @click="handleSplitOrder(item)">拆单
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="1" :offset="1">
                                                    <el-button type="danger" size="small" style="margin-top: 15px"
                                                               v-if="canSplitOrChangeOrder(item.machineOrder.status)"
                                                               :disabled="editContract.status==1"
                                                               @click="handleChangeOrder(item)">改单
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                            <div class="panel panel-primary">
                                                <div class="panel-heading" style="text-align: left">
                                                    <h3 class="panel-title">客户机型信息</h3>
                                                </div>
                                                <div class="panel-body">
                                                    <el-col :span="6">
                                                        <el-form-item label="客户：" :label-width="formLabelWidth"
                                                                      clearable>
                                                            <el-input v-model="contractForm.customerName"
                                                                      placeholder="客户" disabled
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)"
                                                            ></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="国家：" :label-width="formLabelWidth"
                                                                      clearable>
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.machineOrder.country"
                                                                    clearable
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in countryList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>

                                                    <el-col :span="6">
                                                        <el-form-item label="商标：" :label-width="formLabelWidth"
                                                                      clearable
                                                                      :class="classWithDifferentValue(item, 'brand', false)">
                                                            <el-input v-model="item.machineOrder.brand"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                      placeholder="商标"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="机型：" :label-width="formLabelWidth"
                                                                      clearable
                                                                      :class="classWithDifferentValue(item, 'machineType', false)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.machineOrder.machineType"
                                                                    clearable
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in allMachineType"
                                                                        :key="item.id"
                                                                        :label="item.name"
                                                                        :value="item.id">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="针数：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'needleNum', false)">
                                                            <el-input-number style="float: left;"
                                                                             v-model="item.machineOrder.needleNum"
                                                                             :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                             :step="1"
                                                                             controls-position="right"
                                                                             :min="1"
                                                                             :max="100">

                                                            </el-input-number>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="头数：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'headNum',false)">
                                                            <el-input-number style="float: left"
                                                                             v-model="item.machineOrder.headNum"
                                                                             :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                             :step="1"
                                                                             controls-position="right"
                                                                             :min="1"
                                                                             :max="100">
                                                            </el-input-number>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="头距：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'headDistance', false)">
                                                            <el-input-number style="float: left"
                                                                             v-model="item.machineOrder.headDistance"
                                                                             :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                             :step="1"
                                                                             controls-position="right"
                                                                             :min="1"
                                                            >
                                                            </el-input-number>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="X行程：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'xDistance', false)">
                                                            <el-input v-model="item.machineOrder.xDistance"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                      placeholder="X行程"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="Y行程：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'yDistance', false)">
                                                            <el-input v-model="item.machineOrder.yDistance"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                      placeholder="Y行程"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </div>
                                            </div>
                                            <div class="panel panel-primary">
                                                <div class="panel-heading" style="text-align: left">
                                                    <el-row>
                                                        <el-col :span="3">
                                                            <h3 class="panel-title">特种绣选项</h3>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <el-button
                                                                    icon="el-icon-check"
                                                                    size="small"
                                                                    type="success"
                                                                    :disabled="item.machineOrder.status != 0"
                                                                    @click="onSetDefault(item.name)">默认值
                                                            </el-button>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                                <div class="panel-body">
                                                    <el-col :span="6">
                                                        <el-form-item label="色数：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTowelColor', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTowelColor"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    clearable
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTowelColorList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="D轴上：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTowelDaxle', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTowelDaxle"
                                                                    clearable
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTowelDaxleList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="H轴下：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTowelHaxle', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTowelHaxle"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    clearable
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTowelHaxleList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="主电机：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTowelMotor', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTowelMotor"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    clearable
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTowelMotorList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="盘带头：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTapingHead', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTapingHead"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    clearable
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTapingHeadList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="毛巾机针：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'specialTowelNeedle', true)">
                                                            <el-select
                                                                    style="width: 100%"
                                                                    v-model="item.orderDetail.specialTowelNeedle"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    clearable
                                                                    placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in specialTowelNeedleList"
                                                                        :key="item.text"
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
                                                        <el-form-item label="电脑：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricPc', true)">
                                                            <el-select v-model="item.orderDetail.electricPc"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in pcModeList"
                                                                        :key="item.text"
                                                                        :value="item.text"
                                                                        :label="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="语言：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricLanguage', true)">
                                                            <el-select v-model="item.orderDetail.electricLanguage"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in pcLanguageList"
                                                                        :key="item.text"
                                                                        :value="item.text"
                                                                        :label="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="主电机：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricMotor', true)">
                                                            <el-select v-model="item.orderDetail.electricMotor"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in electricMotorList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="XY电机：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricMotorXy', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.electricMotorXy"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in xyMotorList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="剪线方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricTrim', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.electricTrim"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in trimList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="电源：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricPower', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.electricPower"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in electricPowerList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="按钮开关：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricSwitch', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.electricSwitch"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in electricSwitchList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="加油系统：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'electricOil', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.electricOil"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in electricOilList"
                                                                            :key="item.text"
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
                                                        <el-form-item label="夹线器：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleSplit', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.axleSplit"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in axleSplitList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="面板：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axlePanel', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.axlePanel"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in axlePanelList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="机针：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleNeedle', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.axleNeedle"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in axleNeedleList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="机针类型：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleNeedleType', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.axleNeedleType"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
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
                                                    <el-col :span="6">
                                                        <el-form-item label="机头导轨：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleRail', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.axleRail"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in axleRailList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="底检方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleDownCheck', true)">
                                                            <el-select v-model="item.orderDetail.axleDownCheck"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in axleDownCheckList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="旋梭：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleHook', true)">
                                                            <el-select v-model="item.orderDetail.axleHook"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in axleHookList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>

                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="跳跃方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleJump', true)">
                                                            <el-select v-model="item.orderDetail.axleJump"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in axleJumpList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">

                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="面线夹持：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleUpperThread', true)">
                                                            <el-select v-model="item.orderDetail.axleUpperThread"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in axleUpperThreadList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <el-form-item label="附加装置：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'axleAddition', true)">
                                                            <el-input v-model="item.orderDetail.axleAddition"
                                                                      type="textarea"
                                                                      placeholder="附加装置，销售人员添加"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)||userInfo.role.roleName.indexOf('销售') < 0"
                                                                      :autosize="{ minRows: 10, maxRows: 10}">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </div>
                                            </div>
                                            <div class="panel panel-primary">
                                                <div class="panel-heading" style="text-align: left">
                                                    <h3 class="panel-title">机架台板</h3>
                                                </div>
                                                <div class="panel-body">
                                                    <el-col :span="6">
                                                        <el-form-item label="机架颜色：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkColor', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.frameworkColor"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkColorList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="台板：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkPlaten', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.frameworkPlaten"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkPlatenList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="台板颜色：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkPlatenColor', true)">
                                                            <template scope="scope">
                                                                <el-select
                                                                        v-model="item.orderDetail.frameworkPlatenColor"
                                                                        clearable
                                                                        :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                        placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkPlatenColorList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="吊环：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkRing', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.frameworkRing"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkRingList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="电脑托架：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkBracket', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.frameworkBracket"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkBracketList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="急停装置：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkStop', true)">
                                                            <template scope="scope">
                                                                <el-select v-model="item.orderDetail.frameworkStop"
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           placeholder="请选择">
                                                                    <el-option
                                                                            v-for="item in frameworkStopList"
                                                                            :key="item.text"
                                                                            :label="item.text"
                                                                            :value="item.text">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="日光灯：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'frameworkLight', true)">
                                                            <el-select v-model="item.orderDetail.frameworkLight"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in frameworkLightList"
                                                                        :key="item.text"
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
                                                    <el-col :span="6">
                                                        <el-form-item label="驱动类型：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverType', true)">
                                                            <el-select v-model="item.orderDetail.driverType"
                                                                       style="width: 100%;"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in driverTypeList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="驱动方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverMethod', true)">
                                                            <el-select v-model="item.orderDetail.driverMethod"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in driverMethodList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="绷架孔：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverReelHole', true)">
                                                            <el-select v-model="item.orderDetail.driverReelHole"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in driverReelHoleList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="绷架：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverReel', true)">
                                                            <el-select v-model="item.orderDetail.driverReel"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in driverReelList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="横档数量：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverHorizonNum', true)">
                                                            <el-input-number style="float: left"
                                                                             v-model="item.orderDetail.driverHorizonNum"
                                                                             :step="1"
                                                                             :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                             controls-position="right"
                                                                             :min="1"
                                                                             :max="100">
                                                            </el-input-number>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="直档数量：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'driverVerticalNum', true)">
                                                            <el-input-number style="float: left"
                                                                             v-model="item.orderDetail.driverVerticalNum"
                                                                             :step="1"
                                                                             :disabled="changeOrderContentDisable(item.machineOrder)"
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
                                                    <h3 class="panel-title">其他信息</h3>
                                                </div>
                                                <div class="panel-body">
                                                    <el-col :span="6">
                                                        <el-form-item label="包装方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'packageMethod', false)">
                                                            <el-select v-model="item.machineOrder.packageMethod"
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                       placeholder="请选择">
                                                                <el-option
                                                                        v-for="item in packageModeList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <el-form-item label="包装备注：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'packageMark', false)">
                                                            <el-input
                                                                    type="textarea"
                                                                    :autosize="{ minRows: 6, maxRows: 10}"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    placeholder="包装备注"
                                                                    v-model="item.machineOrder.packageMark">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="交货日期：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'contractShipDate', false)">
                                                            <el-date-picker
                                                                    style="width: 100%"
                                                                    v-model="item.machineOrder.contractShipDate"
                                                                    type="date"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    placeholder="合同交货日期">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>

                                                    <el-col :span="6">
                                                        <el-form-item label="订机数量：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'machineNum', false)"
                                                                      prop="machineOrder.machineNum"
                                                                      :rules="[
                                                                              { required: true, message: '订机数不能为空'},
                                                                              { type: 'number', message: '订机数必须是数字'}
                                                                            ]">
                                                            <el-input style="float: left;"
                                                                      v-model.number="item.machineOrder.machineNum"
                                                                      auto-complete="off"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder) || isFromSplit(item.machineOrder)"
                                                                      @blur="machineNumChanged(item)"
                                                                      controls-position="right">

                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="销售人员：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'sellman', false)">
                                                            <el-input v-model="contractForm.sellman"
                                                                      placeholder="销售人员"
                                                                      :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                      auto-complete="off">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-form-item label="保修方式：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'sellman', false)">
                                                            <el-select v-model="item.machineOrder.maintainType"
                                                                       placeholder=""
                                                                       clearable
                                                                       :disabled="changeOrderContentDisable(item.machineOrder)">
                                                                <el-option
                                                                        v-for="item in maintainTypeList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>

                                                    <el-col :span="6">
                                                        <el-form-item label="计划日期：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'planShipDate', false)">
                                                            <el-date-picker
                                                                    style="width: 100%"
                                                                    v-model="item.machineOrder.planShipDate"
                                                                    type="date"
                                                                    placeholder="合同计划日期">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="2" :offset="0">
                                                        <el-button
                                                                icon="el-icon-check"
                                                                size="small"
                                                                style="margin-left: 5px;"
                                                                type="success"
                                                                v-show="isShowConfirmPlanDate"
                                                                @click="handleConfirmPlanDate(item.machineOrder)">
                                                            确认
                                                        </el-button>
                                                    </el-col>

                                                    <el-col :span="24">
                                                        <el-form-item label="备注信息：" :label-width="formLabelWidth"
                                                                      :class="classWithDifferentValue(item, 'machineOrder', false)">
                                                            <el-input
                                                                    type="textarea"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    :autosize="{ minRows: 4, maxRows: 10}"
                                                                    placeholder="备注信息"
                                                                    v-model="item.machineOrder.mark">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </div>
                                            </div>
                                            <div class="panel panel-primary">
                                                <div class="panel-heading" style="text-align: left">
                                                    <h3 class="panel-title">装置信息</h3>
                                                </div>
                                                <el-row>
                                                    <el-col :span="1" :offset="22">
                                                        <el-button type="primary" size="small" class="el-icon-plus"
                                                                   style="margin: 15px"
                                                                   v-if="!changeOrderContentDisable(item.machineOrder)"
                                                                   @click="addEquipment(item.machineOrder)">
                                                            装置
                                                        </el-button>
                                                    </el-col>
                                                    <el-table
                                                            border
                                                            :data="item.machineOrder.equipment">
                                                        <el-table-column
                                                                label="装置名称"
                                                                align="center">
                                                            <template slot-scope="scope">
                                                                <el-select v-model="scope.row.name"
                                                                           placeholder=""
                                                                           clearable
                                                                           :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                           style="width: 95%">
                                                                    <el-option
                                                                            v-for="item in machineEquipmentList"
                                                                            :key="item.name"
                                                                            :label="item.name"
                                                                            :value="item.name">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                                label="数量"
                                                                width="200"
                                                                align="center">
                                                            <template slot-scope="scope">
                                                                <el-input-number style="float: left"
                                                                                 v-model="scope.row.number"
                                                                                 :step="1"
                                                                                 :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                                 controls-position="right"
                                                                                 :min="1"
                                                                                 :max="100">
                                                                </el-input-number>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                                label="单价"
                                                                width="200"
                                                                align="center"
                                                                v-if="isFinanceVisible()">
                                                            <template slot-scope="scope">
                                                                <el-input v-model="scope.row.price"
                                                                          placeholder="单价"
                                                                          :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                          auto-complete="off">
                                                                </el-input>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                                label="操作"
                                                                width="200"
                                                                align="center">
                                                            <template slot-scope="scope">
                                                                <el-button
                                                                        size="mini"
                                                                        type="danger"
                                                                        icon="el-icon-delete"
                                                                        :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                        @click="handleDeleteEquipment(item.machineOrder.equipment, scope.$index)">
                                                                    删除
                                                                </el-button>
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>

                                                </el-row>
                                                <div class="panel-body" v-if="isFinanceVisible()">
                                                    <table border="1" width="100%">
                                                        <tr>
                                                            <td colspan="2" style="font-weight: bold; font-size: 14px">
                                                                机器价格（不含装置）
                                                            </td>
                                                            <td>
                                                                <el-input-number
                                                                        style="margin: 10px;width: 95%"
                                                                        v-model="item.machineOrder.machinePrice"
                                                                        :step="1"
                                                                        :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                        controls-position="right"
                                                                        :min="0">
                                                                </el-input-number>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" style="font-weight: bold; font-size: 14px">
                                                                订单总价（含装置）
                                                            </td>
                                                            <td style="height: 56px">
                                                                <span style="margin-left: -35px;font-size: 16px; font-weight: bold; color: #409EFF">{{calculateOrderPrice(item.machineOrder)}}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                            <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 10px">
                                                需求评审单
                                            </div>
                                            <el-col :span="24">
                                                <el-table
                                                        border
                                                        :row-class-name="tableRowClassName"
                                                        :data="item.orderSign != null ? item.orderSign.signContent : []"
                                                        style="margin-bottom: 30px">
                                                    <el-table-column
                                                            align="center"
                                                            label="签核步骤"
                                                            width="80">
                                                        <template scope="scope">
                                                            <el-button style="font-size: 14px; font-weight: bold"
                                                                       type="primary" round size="mini">
                                                                {{scope.row.number}}
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            align="center"
                                                            width="150"
                                                            label="签核角色">
                                                        <template slot-scope="scope">
                                                            <span style="font-size: 14px; font-weight: bold">{{scope.row.roleId | filterRole}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            align="center"
                                                            width="150"
                                                            label="签核人">
                                                        <template slot-scope="scope">
                                                            <span style="font-size: 14px; font-weight: bold">{{scope.row.user}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            align="center"
                                                            width="180"
                                                            label="日期">
                                                        <template slot-scope="scope">
                                                    <span> {{scope.row.date != null && scope.row.date != "" ? formatDate(scope.row.date) : "未提交" }}
                                                    </span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            align="center"
                                                            label="意见">
                                                        <template slot-scope="scope">
                                                            <el-input
                                                                    :disabled="signDisable(scope.row.roleId)"
                                                                    type="textarea"
                                                                    v-model="scope.row.comment"
                                                                    auto-complete="off">
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            align="center"
                                                            label="操作"
                                                            width="200">
                                                        <template scope="scope">
                                                            <el-button type="primary"
                                                                       @click="onSubmitOrderSign(scope.row, item.orderSign)"
                                                                       icon="el-icon-check" size="small"
                                                                       :disabled="signDisable(scope.row.roleId)">同意
                                                            </el-button>
                                                            <el-button type="danger"
                                                                       @click="handleRejectOrderSign(scope.row, item.orderSign)"
                                                                       icon="el-icon-close" size="small"
                                                                       :disabled="signDisable(scope.row.roleId)">驳回
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-col>
                                        </div>
                                    </el-form>


                                </el-tab-pane>
                            </el-tabs>
                            <!--<el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"-->
                            <!--:title="errorMsg"-->
                            <!--type="error"-->
                            <!--:closable="false"-->
                            <!--show-icon >-->
                            <!--</el-alert >-->
                        </el-collapse-item>
                    </el-collapse>
                    <el-card class="box-card" style="margin: 25px">
                        <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 10px;margin-top: 20px">
                            合同评审单
                        </div>
                        <el-table
                                v-if="isFinanceVisible()"
                                border
                                :data="requisitionForms"
                                :row-class-name="tableRowDisabledClassName">
                            <el-table-column
                                    align="center"
                                    label="机器名称">
                                <template scope="scope">
                                    <span>{{scope.row.machineOrder.brand}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    label="机型">
                                <template slot-scope="scope">
                                    <span>{{scope.row.machineOrder.machineType | filterMachineTypeName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="machineNum"
                                    label="数量">
                                <template slot-scope="scope">
                                    <span> {{scope.row.machineOrder.machineNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="machinePrice"
                                    label="单价">
                                <template slot-scope="scope">
                                    <span> {{scope.row.machineOrder.machinePrice}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="machineEquipmentPrice"
                                    label="装置价格">
                                <template slot-scope="scope">
                                    <span> {{caculateOrderEquipmentPrice(scope.row.machineOrder)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    label="总价">
                                <template slot-scope="scope">
                                    <span style="font-size: larger; font-weight: bold;color: #409EFF">{{calculateOrderTotalPrice(scope.row.machineOrder)}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style="margin-top: 10px" v-if="isFinanceVisible()">
                            <el-col :span="2" :offset="18" style="font-size: 16px;font-weight: bold">总价：</el-col>
                            <el-col :span="2" :offset="1" style="font-size: 18px;font-weight: bold; color: #409EFF">
                                {{calculateTotalPrice()}}
                            </el-col>
                        </el-row>
                        <el-form style="margin-top: 10px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="付款方式：" :label-width="formLabelWidth">
                                        <el-input
                                                placeholder="付款方式"
                                                :disabled="changeContractContentDisable(contractForm)"
                                                v-model="contractForm.payMethod">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="1">
                                    <el-form-item label="合同交货日期：" :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                type="date"
                                                placeholder="合同交货日期"
                                                :disabled="changeContractContentDisable(contractForm)"
                                                v-model="contractForm.contractShipDate">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注信息：" :label-width="formLabelWidth">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 6, maxRows: 10}"
                                                :disabled="changeContractContentDisable(contractForm)"
                                                placeholder="备注信息"
                                                v-model="contractForm.mark">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-tabs v-model="editableContractTabsValue"
                                 type="border-card"
                                 style="margin-top: 20px">
                            <el-tab-pane
                                    style="margin-left: 20px;margin-right: 20px"
                                    v-for="(item, index) in contractSignForms"
                                    :key="item.name"
                                    :label="item.title"
                                    :name="item.name">
                                <div style="text-align: left;margin-bottom: 10px">
                                    <el-button style="text-align: right" type="success" round size="small"
                                               icon="el-icon-view" @click="viewContractSignHistory">历史
                                    </el-button>
                                </div>
                                <el-col :span="24">
                                    <el-table
                                            border
                                            :row-class-name="tableRowClassName"
                                            :data="item.contractSignData"
                                            style="margin-bottom: 30px">
                                        <el-table-column
                                                label="签核步骤"
                                                width="80">
                                            <template scope="scope">
                                                <el-button style="font-size: 14px; font-weight: bold" type="primary"
                                                           round size="mini">{{scope.row.number}}
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="150"
                                                align="center"
                                                label="签核角色">
                                            <template slot-scope="scope">
                                                <span style="font-size: 14px; font-weight: bold">{{scope.row.roleId | filterRole}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="150"
                                                align="center"
                                                label="签核人">
                                            <template slot-scope="scope">
                                                <span style="font-size: 14px; font-weight: bold">{{scope.row.user}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                width="180"
                                                align="center"
                                                label="日期">
                                            <template slot-scope="scope">
                                                <span> {{scope.row.date != null && scope.row.date != "" ? formatDate(scope.row.date) : "未提交" }}
                                                </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                align="center"
                                                label="意见">
                                            <template slot-scope="scope">
                                                <el-input
                                                        :disabled="signDisable(scope.row.roleId)"
                                                        type="textarea"
                                                        v-model="scope.row.comment"
                                                        auto-complete="off">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                label="操作"
                                                align="center"
                                                width="200">
                                            <template scope="scope">
                                                <el-button type="primary" @click="onSubmitContractSign(scope.row, item)"
                                                           icon="el-icon-check" size="small"
                                                           :disabled="signDisable(scope.row.roleId)">同意
                                                </el-button>
                                                <el-button type="danger"
                                                           @click="handleRejectContractSign(scope.row, item)"
                                                           icon="el-icon-close" size="small"
                                                           :disabled="signDisable(scope.row.roleId)">驳回
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" style="margin-bottom: 20px; margin-right:8%"
                 v-if="mode == EDIT_MODE || mode == CHANGE_MODE || mode == ADD_MODE || mode == SPLIT_MODE">
                <el-button @click="addContractVisible = false" icon="el-icon-back">取 消</el-button>
                <el-button v-if="mode == EDIT_MODE && haveInitialMachineOrder() || contractIsRejected()" type="primary"
                           @click="onEdit" icon="el-icon-check">保 存
                </el-button>
                <el-button v-if="mode == CHANGE_MODE" type="primary" @click="onSaveChange" icon="el-icon-check">保存改单
                </el-button>
                <el-button v-if="mode == SPLIT_MODE" type="primary" @click="onSaveSplit" icon="el-icon-check">保存拆单
                </el-button>
                <el-button v-if="mode == ADD_MODE" type="primary" @click="onAdd" icon="el-icon-check">提 交</el-button>
            </div>
            <el-dialog title="提示" :visible.sync="confirmPasteDialog" width="30%" append-to-body>
                <span style="font-size: 15px">确定要粘贴到<b style="color: #F56C6C">{{currentSelectOrder.title}}</b>吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="confirmPasteDialog = false" icon="el-icon-back">取 消</el-button>
                    <el-button type="primary" @click="onConfirmPasteOrder" icon="el-icon-check">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="提示" :visible.sync="rejectSignResultVisible" width="30%" append-to-body>
                <span style="font-size: 15px">确认驳回审核？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="rejectSignResultVisible = false" icon="el-icon-back">取 消</el-button>
                    <el-button type="primary" @click="onRejectOrderSign" icon="el-icon-check">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="提示" :visible.sync="rejectContractSignResultVisible" width="30%" append-to-body>
                <span style="font-size: 15px">确认驳回审核？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="rejectContractSignResultVisible = false" icon="el-icon-back">取 消</el-button>
                    <el-button type="primary" @click="onRejectContractSign" icon="el-icon-check">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="changeOrderVisible" width="30%" append-to-body>
                <span>确认更改订单<b style="color: #F56C6C">{{requisitionChangingItem != "" ? requisitionChangingItem.machineOrder.orderNum : ""}}</b>？</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="changeOrderVisible = false" icon="el-icon-back">取 消</el-button>
                <el-button type="primary" @click="onConfirmChange" icon="el-icon-check">确 定</el-button>
            </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="splitOrderVisible" width="50%" append-to-body>
                <span>拆分需求单<b style="color: #F56C6C">{{requisitionSplitItem != "" ? requisitionSplitItem.machineOrder.orderNum : ""}}</b></span>
                <span>，拆分出机器数:</span>
                <template>
                    <el-input-number v-model="splitNum" :min="1" size="small" style="margin-left: 10px"
                                     :max=" requisitionSplitItem != '' ? requisitionSplitItem.machineOrder.machineNum -1: 1"
                                     label="拆分机器数">
                    </el-input-number>
                    <el-table
                            border
                            ref="splitMachinesTable"
                            :data="machinesOfOrder"
                            tooltip-effect="dark"
                            :empty-text="emptyTableText"
                            style="width: 100%;margin-top: 10px"
                            @selection-change="handleMachineSelectionChange">
                        <el-table-column
                                align="center"
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="machineStrId"
                                label="机器编号">
                        </el-table-column>
                        <el-table-column
                                prop="namePlate"
                                align="center"
                                label="铭牌号">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="机器状态">
                            <template slot-scope="scope">{{ filterMachineStatus(scope.row.status) }}</template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="location"
                                label="位置">
                        </el-table-column>
                    </el-table>
                    <span style="color: #F56C6C;margin-top: 10px;font-size: 12px">注意：在不清楚如何选择拆分机器时，与生产部确认后再行选择；机器都未计划可以自由选择，但是如果机器已计划或者生产中，请务必与生产部确认！</span>
                </template>
                <span slot="footer" class="dialog-footer">
                <el-button @click="splitOrderVisible = false" icon="el-icon-back" size="small">取 消</el-button>
                <el-button type="primary" @click="onConfirmSplit" icon="el-icon-check"
                           :disabled="splitNum != splitMachinesSelected.length && machinesOfOrder.length != 0"
                           size="small">确 定</el-button>
            </span>
            </el-dialog>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" append-to-body>
            <span>确认要删除账号为[ <b style="color: #F56C6C">{{selectedItem.account}}</b> ]的用户吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
                <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="合同签核记录" :visible.sync="viewContractSignHistoryVisible" append-to-body width="65%">
            <div v-for="signItem in contractSignHistory">
                <el-table
                        border
                        :data="signItem.signContent"
                        style="margin-bottom: 30px">
                    <el-table-column
                            align="center"
                            label="签核步骤"
                            width="80">
                        <template scope="scope">
                            <el-button style="font-size: 14px; font-weight: bold" type="primary" round size="mini">
                                {{scope.row.number}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="150"
                            label="签核角色">
                        <template slot-scope="scope">
                            <span style="font-size: 14px; font-weight: bold">{{scope.row.roleId | filterRole}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="150"
                            label="签核人">
                        <template slot-scope="scope">
                            <el-input
                                    :disabled="signDisable(scope.row.roleId)"
                                    v-model="scope.row.user"
                                    auto-complete="off">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="200"
                            label="日期">
                        <template slot-scope="scope">
                                    <span> {{scope.row.date != null && scope.row.date != "" ? scope.row.date : "未提交" }}
                                    </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="意见">
                        <template slot-scope="scope">
                            <el-input
                                    :disabled="signDisable(scope.row.roleId)"
                                    type="textarea"
                                    v-model="scope.row.comment"
                                    auto-complete="off">
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Vue from "vue";
    import {Loading} from "element-ui";
    var _this;
    const DefaultOrderDetail = {
        specialTowelColor: "",
        specialTowelDaxle: "",
        specialTowelHaxle: "",
        specialTowelMotor: "",
        specialTapingHead: "",
        specialTowelNeedle: ""
    };
    export default {
        name: "contract_sign",
        components: {},
        data() {
            _this = this;
            return {
                editUrl: HOST + "machine/order/update",
                deleteUrl: HOST + "machine/order/delete",
                isError: false,
                errorMsg: "",
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
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

                machineEquipmentList: MachineEquipmentList,
                packageModeList: PackageModeList,
                maintainTypeList: MaintainTypeList,
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
                frameworkLightList: FrameworkLightList,
                driverTypeList: DriverTypeList,
                driverMethodList: DriverMethodList,
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
                addContractVisible: false,
                collapseActiveNames: ["1"],
                collapseTitle: "隐藏需求单",
                doCollapse: false,
                signProcesses: [],
                normalSignProcess: {},
                userInfo: "",

                viewContractSignHistoryVisible: false,
                contractSignHistory: [],

                //正常合同签核内容
                normalContractSignArray: [],
                //正常合同签核需求单内容
                normalOrderSignArray: [],

                //改单合同签核内容
                changeContractSignArray: [],
                //改单合同签核需求单内容
                changeOrderSignArray: [],

                //拆单合同签核内容
                splitContractSignArray: [],
                //拆单合同签核需求单内容
                splitOrderSignArray: [],

                //用于保存合同内容
                contractForm: {
                    contractNum: "",
                    customerName: "",
                    sellman: "",
                    mark: "",
                    status: CONTRACT_INITIAL,
                    payMethod: "",
                    contractShipDate: ""
                },

                //多个需求单,一下是新创建合同时候的初始值，在编辑或者签核时需要从server端加载
                editableTabsValue: "1",
                requisitionForms: [
                    {
                        title: "需求单1",
                        name: "1",
                        //保存需求单数据
                        machineOrder: {
                            machineType: '',
                            country: CountryList[0].text,
                            brand: "SINSIM电脑绣花机",
                            createTime: new Date().format("yyyy-MM-dd"),
                            equipment: [],
                            status: ORDER_INITIAL,
                            createUserId: JSON.parse(sessionStorage.getItem("user")).id
                        },
                        orderDetail: DefaultOrderDetail,
                        //每个需求单中的签核记录
                        orderSign: {}
                    }
                ],

                tabIndex: 1,

                //多个合同签核记录，第一阶段只展示1个，即：当前有效的（进行中的）合同签核记录
                editableContractTabsValue: "1",
                contractSignForms: [
                    {
                        title: "合同签核记录",
                        name: "1",
                        contractSignData: []
                    }
                ],
                contractTabIndex: 1,
                splitNum: 1,
                machinesOfOrder: [],
                splitMachinesSelected: [],
                emptyTableText: "被拆需求单未签核完毕，暂无机器记录！",

                formLabelWidth: "100px",
                longFormLabelWidth: "120px",

                mode: this.SIGN_MODE,
                //			    isEdit: false,
                //                isSign: false,
                //                isChanging: false,
                dialogTitle: "合同",
                editContract: "",
                editContractSign: "",

                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                rejectContractSignResultVisible: false,
                signResultObj: "",
                filters: {
                    contractNum: "",
                    roleName: "",
                    //默认审核中
                    status: 1,
                    sellman: "",
                    selectDate: ""
                },

                //改单相关
                changeOrderVisible: false,
                requisitionChangingItem: "",

                //拆单相关
                splitOrderVisible: false,
                requisitionSplitItem: "",
                splitNum: 1,

                allRoles: [],
                isShowConfirmPlanDate: false,

                salePersonList: [],
                timeout: null,
                customerList: [],
                customerTimeout: null,
                currentCopyItem: {
                    machineOrder: {
                        brand: "SINSIM电脑绣花机",
                        createTime: new Date().format("yyyy-MM-dd"),
                        equipment: [],
                        status: ORDER_INITIAL,
                        createUserId: JSON.parse(sessionStorage.getItem("user")).id
                    },
                    orderDetail: DefaultOrderDetail,
                },

                currentSelectOrder: {},
                confirmPasteDialog: false,
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                },
                pickerOptions2: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                    shortcuts: [
                        {
                            text: "今天",
                            onClick(picker) {
                                picker.$emit("pick", new Date());
                            }
                        }
                    ]
                },
                contractExist: false,
                contractErrorMsg: "",
            };
        },
        methods: {

            onContractInputUnfocus(contractNum) {
                if(_this.mode == _this.ADD_MODE) {
                    if (contractNum == null || contractNum == "") {
                        _this.contractExist = true;
                        _this.contractErrorMsg = "合同编号不能为空！";
                    } else {
                        $.ajax({
                            url: HOST + "contract/isContractExist",
                            type: "POST",
                            dataType: "JSON",
                            data: {
                                contractNum: contractNum
                            },
                            success: function (res) {
                                if (res.code == 200) {
                                    _this.contractExist = false;
                                } else {
                                    _this.contractExist = true;
                                    _this.contractErrorMsg = res.message;
                                }
                            }
                        });
                    }
                }
            },

            handleConfirmPlanDate(item)
            {
                $.ajax({
                    url: HOST + "machine/order/update/",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        machineOrder: JSON.stringify({
                            id: item.id,
                            planShipDate: item.planShipDate,
                        }),
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "合同计划日期确认成功！", 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            requestCustomerList() {
                $.ajax({
                    url: HOST + "contract/selectAllCustomer/",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        name: '',
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.customerList = [];
                            res.data.forEach(item => {
                                _this.customerList.push({
                                    value: item.customerName
                                });
                            });
                        }
                    }
                });
            },

            queryCustomer(queryString, check) {
                //缓存加载
                var results = _this.customerList;
                if (queryString) {
                    results = _this.customerList.filter(
                            this.createStateFilter(queryString)
                    );
                }
                clearTimeout(_this.customerTimeout);
                _this.customerTimeout = setTimeout(() => {
                    check(results);
                }, 800 * Math.random());

                /*
                 //实时加载
                 */
//                $.ajax({
//                    url: HOST + "contract/selectAllCustomer/",
//                    type: "POST",
//                    dataType: "JSON",
//                    data: {
//                        name: queryString
//                    },
//                    success: function (res) {
//                        if (res.code == 200) {
//                            _this.customerList = [];
//                            res.data.forEach(item => {
//                                _this.customerList.push({
//                                    value: item.customerName
//                                });
//                            });
//                            check(_this.customerList);
//                        }
//                    }
//                });
            },

            requestSalePersonList() {
                var roleId = 0;
                for (var i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].roleName.indexOf("销售员") > -1) {
                        roleId = _this.allRoles[i].id;
                        break;
                    }
                }

                $.ajax({
                    url: HOST + "user/selectUsers",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        roleId: roleId,//USER_ROLE.ROLE_SALEPERSON
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.salePersonList = [];
                            res.data.list.forEach(item => {
                                _this.salePersonList.push({
                                    value: item.name
                                });
                            });
                        }
                    }
                });
            },

            querySearchAsync(queryString, cb) {
                var results = _this.salePersonList;
                if (queryString) {
                    results = _this.salePersonList.filter(
                            this.createStateFilter(queryString)
                    );
                }
                clearTimeout(_this.timeout);
                _this.timeout = setTimeout(() => {
                    cb(results);
                }, 800 * Math.random());
            },
            createStateFilter(queryString) {
                return item => {
                    return (
                            item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
                    );
                };
            },
            handleSelect(item) {
                console.log(item);
            },

            onSetDefault(name) {
                for (var i = 0; i < _this.requisitionForms.length; i++) {
                    if (name === _this.requisitionForms[i].name) {
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTowelColor = DefaultSelectedValue;
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTowelDaxle = DefaultSelectedValue;
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTowelHaxle = DefaultSelectedValue;
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTowelMotor = DefaultSelectedValue;
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTapingHead = DefaultSelectedValue;
                        _this.requisitionForms[
                                i
                                ].orderDetail.specialTowelNeedle = DefaultSelectedValue;
                        break;
                    }
                }
            },

            isFinanceVisible() {
                if (
                        (this.userInfo != "" &&
                        (this.userInfo.role.roleName.indexOf("销售") != -1 ||
                        this.userInfo.role.roleName.indexOf("财务") != -1)) ||
                        this.userInfo.role.roleName.indexOf("总经理") != -1 ||
                        this.userInfo.role.id == 1
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            filterMachineStatus(status) {
                let name = "";
                for (let i = 0; i < MachineStatusList.length; i++) {
                    if (MachineStatusList[i].value == status) {
                        name = MachineStatusList[i].name;
                        break;
                    }
                }
                return name;
            },

            handleMachineSelectionChange(val) {
                if (val.length > this.splitNum) {
                    showMessage(_this, "选择机器数量大于拆分数！", 0);
                } else {
                    this.splitMachinesSelected = val;
                }
            },

            canSplitOrChangeOrder(status) {
                if (
                        this.mode != this.SIGN_MODE &&
                        this.mode != this.CHANGE_MODE &&
                        this.mode != this.SPLIT_MODE &&
                        (status == ORDER_CHECKING ||
                        status == ORDER_CHECKING_FINISHED ||
                        status == ORDER_SPLITED)
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            calculateOrderTotalPrice(item) {
                let orderTotalPrice = 0;
                if (item.status == ORDER_CHANGED || item.status == ORDER_CANCELED) {
                    orderTotalPrice = 0;
                } else {
                    orderTotalPrice =
                            parseInt(item.machinePrice) * parseInt(item.machineNum);
                    if (item.equipment != null && item.equipment != "") {
                        for (let i = 0; i < item.equipment.length; i++) {
                            orderTotalPrice =
                                    orderTotalPrice +
                                    parseInt(item.equipment[i].number) *
                                    parseInt(item.equipment[i].price);
                        }
                    }
                }
                return orderTotalPrice != null && orderTotalPrice != ""
                        ? orderTotalPrice
                        : 0;
            },

            calculateTotalPrice() {
                let total = 0;
                for (let i = 0; i < this.requisitionForms.length; i++) {
                    total =
                            total +
                            this.calculateOrderTotalPrice(this.requisitionForms[i].machineOrder);
                }
                return total;
            },

            //            getSummaries(param) {
            //                let columns = param.columns;
            //                let data = param.data;
            //                const sums = [];
            //                columns.forEach((column, index) => {
            //                    if (index === 0) {
            //                        sums[index] = '总价';
            //                        return;
            //                    }
            //                    const values = data.map(item => Number(item.machineOrder[column.property]));
            //                    if (!values.every(value => isNaN(value))) {
            //                        sums[index] = values.reduce((prev, curr) => {
            //                            const value = Number(curr);
            //                            if (!isNaN(value) && index == 5) {
            //                                return prev + curr;
            //                            } else {
            //                                return "";
            //                            }
            //                        }, 0);
            //                    }
            //                });
            //
            //                return sums;
            //            },

            handleCollapseChange() {
                _this.doCollapse = !_this.doCollapse;
                if (_this.doCollapse) {
                    _this.collapseTitle = "展开需求单";
                } else {
                    _this.collapseTitle = "隐藏需求单";
                }
            },

            viewContractSignHistory() {
                _this.contractSignHistory = []; //置空
                $.ajax({
                    url: HOST + "contract/sign/list",
                    type: "POST",
                    dataType: "json",
                    data: {contractId: _this.editContract.id},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.contractSignHistory = data.data.list;
                            for (let i = 0; i < _this.contractSignHistory.length; i++) {
                                _this.contractSignHistory[i].signContent = JSON.parse(
                                        _this.contractSignHistory[i].signContent
                                );
                            }
                            if (_this.contractSignHistory.length > 0) {
                                _this.viewContractSignHistoryVisible = true;
                            } else {
                                showMessage(_this, "暂无历史记录！", 1);
                            }
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, "服务器访问失败！", 0);
                    }
                });
            },

            haveInitialMachineOrder() {
                let result = false;
                for (let i = 0; i < this.requisitionForms.length; i++) {
                    if (
                            this.requisitionForms[i].machineOrder.status == ORDER_INITIAL ||
                            this.requisitionForms[i].machineOrder.status == ORDER_REJECTED
                    ) {
                        result = true;
                        break;
                    }
                }
                return result;
            },

            contractIsRejected() {
                return this.contractForm.status == CONTRACT_REJECTED;
            },

            handleEditTab(targetName, action) {
                if (action === "add") {
                    this.addTab(targetName);
                }
                if (action === "remove") {
                    let tabs = this.requisitionForms;
                    let hasSigned;
                    tabs.forEach(tab => {
                        if (tab.name === targetName) {
                            let signContent = tab.orderSign.signContent;
                            for (let i = 0; i < signContent.length; i++) {
                                if (signContent[i].result == 1 || signContent[i].result == 2) {
                                    hasSigned = true;
                                    break;
                                }
                            }
                        }
                    });
                    if (hasSigned) {
                        showMessage(_this, "已有签核记录，不能删除！", 0);
                    } else if (this.requisitionForms.length == 1) {
                        showMessage(_this, "不能删除最后一个需求单！", 0);
                    } else {
                        this.removeTab(targetName);
                    }
                }
            },

            addTab(targetName) {
                let newTabName = ++this.tabIndex + "";
                var newItem = {
                    title: "需求单" + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].machineOrder
                    ),
                    orderDetail: copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].orderDetail
                    ),
                    orderSign: copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].orderSign
                    ) != null
                            ? copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].orderSign
                    )
                            : {}
                };
                //设置时间
                newItem.machineOrder.createTime = new Date().format("yyyy-MM-dd");
                //清空订单号
                newItem.machineOrder.orderNum = "";
                newItem.machineOrder.originalOrderId = "";
                //清空之前的需求单中id(数据库对应)
                newItem.machineOrder.id = null;
                //为了清除前面订单签核的内容
                newItem.orderSign.signContent = _this.normalOrderSignArray;
                //清空之前的状态
                newItem.machineOrder.status = ORDER_INITIAL;
                this.requisitionForms.push(newItem);
                this.editableTabsValue = newTabName;
                //TODO:合同的签核内容此时也需要更新
                this.contractSignForms[0].contractSignData =
                        _this.normalContractSignArray;
            },

            removeTab(targetName) {
                let tabs = this.requisitionForms;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                                this.tabIndex = index;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.requisitionForms = tabs.filter(tab => tab.name !== targetName);
            },

            startToSign() {
                //alert(this.editContract.id);
                $.ajax({
                    url: HOST + "contract/startSign",
                    type: "POST",
                    dataType: "json",
                    data: {contractId: _this.editContract.id},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.addContractVisible = false;
                            _this.editContract = "";
                            showMessage(_this, "发起签核成功", 1);
                            _this.selectContracts();
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, "服务器访问失败！", 0);
                    }
                });
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss");
            },

            filterContractStatus(value) {
                let result = "";
                for (let i = 0; i < _this.orderStatusList.length; i++) {
                    if (_this.orderStatusList[i].value == value) {
                        result = _this.orderStatusList[i].name;
                        break;
                    }
                }

                return result;
            },

            onCourseDetail(item) {
                _this.selectedItem = item;
            },

            //		    onChange: function () {
            //			    if (_this.addContractVisible) {
            //				    _this.isError = _this.validateForm(_this.form, false);
            //			    }
            //			    else {
            //				    _this.isError = _this.validateForm(_this.form, true);
            //			    }
            //
            //		    },
            //TODO:由于控件的原因，直接点击加减按钮时，会出现数值不匹配的情况，点击输入框没问题，所以需要在提交后再一次检查
            machineNumChanged(item) {
                if (item.machineOrder.originalOrderId != null) {
                    if (
                            item.machineOrder.machineNum >
                            this.requisitionChangingItem.machineOrder.machineNum
                    ) {
                        //机器数增加，审核流程要变
                        item.orderSign.signContent = _this.normalOrderSignArray;
                        //原合同签核改成改单的，之前的contract sign记录需要在后台设置成拆单状态
                        this.contractSignForms[0].contractSignData =
                                _this.normalContractSignArray;
                    } else {
                        //机器数不变或者减少，变成改单签核流程
                        item.orderSign.signContent = _this.changeOrderSignArray;
                        //原合同签核改成改单的，之前的contract sign记录需要在后台设置成改单状态
                        this.contractSignForms[0].contractSignData =
                                _this.changeContractSignArray;
                    }
                }
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.selectContracts();
            },

            search() {
                this.selectContracts();
            },

            selectContracts() {
                var condition = {
                    id: _this.filters.id,
                    contractNum: _this.filters.contractNum,
                    status: _this.filters.status,
                    sellman: _this.filters.sellman,
                    roleName: _this.filters.roleName,
                    query_start_time: "",
                    query_finish_time: "",
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (
                        _this.filters.selectDate != null &&
                        _this.filters.selectDate.length > 0
                ) {
                    condition.query_start_time = _this.filters.selectDate[0].format(
                            "yyyy-MM-dd"
                    );
                    condition.query_finish_time = _this.filters.selectDate[1].format(
                            "yyyy-MM-dd"
                    );
                }
                $.ajax({
                    url: HOST + "contract/selectContracts",
                    type: "POST",
                    dataType: "json",
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
            handleCopyOrder(copyItem)
            {
                _this.currentCopyItem.machineOrder = copyObjectByJSON(copyItem.machineOrder);
                _this.currentCopyItem.orderDetail = copyObjectByJSON(copyItem.orderDetail);
                sessionStorage.setItem("copy_order_object", JSON.stringify(_this.currentCopyItem));
                showMessage(_this, copyItem.title + "拷贝成功！", 1);
            },

            handlePasteOrder(targetItem){

                var item = sessionStorage.getItem("copy_order_object");
                if (item) {
                    _this.currentCopyItem = JSON.parse(item);
                    _this.currentSelectOrder = targetItem;
                    _this.confirmPasteDialog = true;
                }
                else {
                    showMessage(_this, "没有可以粘贴的需求单！请先复制!", 0);
                }
            },

            onConfirmPasteOrder()
            {
                _this.currentSelectOrder.orderDetail = copyObjectByJSON(_this.currentCopyItem.orderDetail);

//                _this.currentSelectOrder.machineOrder.country = _this.currentCopyItem.machineOrder.country;
//                _this.currentSelectOrder.machineOrder.machineType = _this.currentCopyItem.machineOrder.machineType;
                _this.currentSelectOrder.machineOrder.brand = _this.currentCopyItem.machineOrder.brand;

                _this.currentSelectOrder.machineOrder.needleNum = _this.currentCopyItem.machineOrder.needleNum;
                _this.currentSelectOrder.machineOrder.headNum = _this.currentCopyItem.machineOrder.headNum;
                _this.currentSelectOrder.machineOrder.headDistance = _this.currentCopyItem.machineOrder.headDistance;
                _this.currentSelectOrder.machineOrder.xDistance = _this.currentCopyItem.machineOrder.xDistance;
                _this.currentSelectOrder.machineOrder.yDistance = _this.currentCopyItem.machineOrder.yDistance;
                _this.currentSelectOrder.machineOrder.packageMethod = _this.currentCopyItem.machineOrder.packageMethod;
                _this.currentSelectOrder.machineOrder.packageMark = _this.currentCopyItem.machineOrder.packageMark;
                _this.currentSelectOrder.machineOrder.maintainType = _this.currentCopyItem.machineOrder.maintainType;
                _this.currentSelectOrder.machineOrder.mark = _this.currentCopyItem.machineOrder.mark;
                _this.currentSelectOrder.machineOrder.equipment = _this.currentCopyItem.machineOrder.equipment;
                _this.currentSelectOrder.machineOrder.machinePrice = _this.currentCopyItem.machineOrder.machinePrice;
                _this.confirmPasteDialog = false;
                showMessage(_this, _this.currentSelectOrder.title + "粘贴成功！", 1);
            },


            handleSplitOrder(requisitionItem) {
                this.requisitionSplitItem = requisitionItem;

                if (
                        requisitionItem.machineOrder.orderNum == "" ||
                        requisitionItem.machineOrder.orderNum == null
                ) {
                    showMessage(this, "拆单订单编号为空！", 1);
                } else {
                    $.ajax({
                        url: HOST + "machine/selectMachines",
                        type: "POST",
                        dataType: "json",
                        data: {order_id: requisitionItem.machineOrder.id},
                        success: function (data) {
                            if (data.code == 200) {
                                _this.splitOrderVisible = true;
                                _this.machinesOfOrder = data.data.list;
                            } else {
                                showMessage(_this, data.message, 0);
                                _this.emptyTableText = "获取需求单机器时失败！";
                            }
                        },
                        error: function (data) {
                            showMessage(_this, data.message, 0);
                            _this.emptyTableText = "服务器访问失败！";
                        }
                    });
                }
            },

            isFromSplit(machineOrder) {
                let result = false;
                if (machineOrder != null && machineOrder.originalOrderId != null) {
                    for (let i = 0; i < this.requisitionForms.length; i++) {
                        if (
                                this.requisitionForms[i].machineOrder.id ==
                                machineOrder.originalOrderId &&
                                this.requisitionForms[i].machineOrder.status == ORDER_SPLITED
                        ) {
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            },

            onConfirmSplit() {
                this.mode = _this.SPLIT_MODE;
                this.tabIndex = this.requisitionForms.length;
                let newTabName = ++this.tabIndex + "";
                var newItem = {
                    title: "需求单" + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(this.requisitionSplitItem.machineOrder),
                    orderDetail: copyObjectByJSON(this.requisitionSplitItem.orderDetail),
                    orderSign: copyObjectByJSON(this.requisitionSplitItem.orderSign) != null
                            ? copyObjectByJSON(this.requisitionSplitItem.orderSign)
                            : {},
                    orderSplitRecord: {
                        splitReason: "",
                        orderId: this.requisitionSplitItem.machineOrder.id,
                        userId: this.userInfo.id
                    }
                };
                //设置时间
                newItem.machineOrder.createTime = new Date().format("yyyy-MM-dd");
                //清空订单号
                newItem.machineOrder.orderNum = "";
                //设置机器数量
                newItem.machineOrder.machineNum = this.splitNum;
                //清空之前的需求单中id(数据库对应)
                newItem.machineOrder.id = null;
                //为了清除前面订单签核的内容,先设置改单的签核流程，后面还需要监控机器数是否改变
                newItem.orderSign.signContent = _this.splitOrderSignArray;
                //添加原需求单的订单号
                newItem.machineOrder.originalOrderId = this.requisitionSplitItem.machineOrder.id;
                //新需求单的状态设置为“ORDER_INITIAL”
                newItem.machineOrder.status = ORDER_INITIAL;

                //原需求单状态需要设置成拆单状态,“4”为拆单状态
                this.requisitionSplitItem.machineOrder.status = ORDER_SPLITED;
                this.requisitionSplitItem.machineOrder.machineNum =
                        this.requisitionSplitItem.machineOrder.machineNum - this.splitNum;
                if (this.requisitionSplitItem.title.indexOf("拆单") == -1) {
                    this.requisitionSplitItem.title =
                            this.requisitionSplitItem.title + "（待拆单）";
                }

                this.contractSignForms[0].contractSignData = this.splitContractSignArray;
                this.requisitionForms.push(newItem);
                this.editableTabsValue = newTabName;
                this.splitOrderVisible = false;
            },

            handleChangeOrder(requisitionItem) {
                this.requisitionChangingItem = requisitionItem;
                this.changeOrderVisible = true;
            },

            onConfirmChange() {
                this.mode = _this.CHANGE_MODE;
                this.tabIndex = this.requisitionForms.length;
                let newTabName = ++this.tabIndex + "";
                var newItem = {
                    title: "需求单" + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(
                            this.requisitionChangingItem.machineOrder
                    ),
                    orderDetail: copyObjectByJSON(this.requisitionChangingItem.orderDetail),
                    orderSign: copyObjectByJSON(this.requisitionChangingItem.orderSign) != null
                            ? copyObjectByJSON(this.requisitionChangingItem.orderSign)
                            : {},
                    orderChangeRecord: {
                        changeReason: "",
                        orderId: this.requisitionChangingItem.machineOrder.id,
                        userId: this.userInfo.id
                    }
                };
                //设置时间
                newItem.machineOrder.createTime = new Date().format("yyyy-MM-dd");
                //沿用老的需求单号，因为实际管理中是以需求单号来沟通，所以保证之前的需求单号有效
                //newItem.machineOrder.orderNum = "";
                //清空之前的需求单中id(数据库对应)
                newItem.machineOrder.id = null;
                //为了清除前面订单签核的内容,先设置改单的签核流程，后面还需要监控机器数是否改变
                newItem.orderSign.signContent = _this.changeOrderSignArray;
                //添加原需求单的订单号
                newItem.machineOrder.originalOrderId = this.requisitionChangingItem.machineOrder.id;
                //新需求单的状态设置为“ORDER_INITIAL”
                newItem.machineOrder.status = ORDER_INITIAL;

                //原需求单状态需要设置成改单状态,“3”为改单状态
                this.requisitionChangingItem.machineOrder.status = ORDER_CHANGED;
                //更改被改需求单的单号（xxx-改-20180323）
                this.requisitionChangingItem.machineOrder.orderNum = this.requisitionChangingItem.machineOrder.orderNum + "(改-" + new Date().format("yyyyMMdd") + ")";
                if (this.requisitionChangingItem.title.indexOf("改单") == -1) {
                    this.requisitionChangingItem.title =
                            this.requisitionChangingItem.title + "（待改单）";
                }

                this.contractSignForms[0].contractSignData =
                        _this.changeContractSignArray;

                this.requisitionForms.push(newItem);
                this.editableTabsValue = newTabName;
                this.changeOrderVisible = false;
            },

            handleAdd() {
                this.mode = this.ADD_MODE;
                this.isError = false;
                this.errorMsg = "";
                this.dialogTitle = "新增合同";
                this.addContractVisible = true;
                this.editContract = "";

                _this.requisitionForms[0].orderSign.signContent =
                        _this.normalOrderSignArray;
                _this.contractSignForms[0].contractSignData =
                        _this.normalContractSignArray;
            },

            handleSign(index, item) {
                this.isError = false;
                this.errorMsg = "";
                this.dialogTitle = "签核合同";

                this.mode = this.SIGN_MODE;
                this.editContract = item;
                _this.fetchContractData(item.id);
                _this.fetchContractSignData(item.id);
                _this.fetchMachineOrdersData(item.id);
                this.addContractVisible = true;
            },

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = "";
                this.dialogTitle = "编辑合同";

                this.mode = this.EDIT_MODE;
                this.editContract = item;
                _this.fetchContractData(item.id);
                _this.fetchContractSignData(item.id);
                _this.fetchMachineOrdersData(item.id);
                this.addContractVisible = true;
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteConfirmVisible = true;
                }
            },
            handleDownload(index, item) {
                $.ajax({
                    url: HOST + "contract/buildContractExcel",
                    type: "POST",
                    dataType: "json",
                    data: {contractId: item.id, account: _this.userInfo.account},
                    success: function (data) {
                        if (data.code == 200) {
                            window.location.href = data.data;
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, "服务器访问出错", 0);
                    }
                });
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: "POST",
                    dataType: "json",
                    data: _this.selectedItem,
                    success: function (data) {
                        if (data.status > 0) {
                            var index = _this.tableData.indexOf(_this.selectedItem);
                            _this.tableData.splice(index, 1);

                            showMessage(_this, "删除成功", 1);
                        } else {
                            showMessage(_this, "删除失败", 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, "服务器访问出错", 0);
                    }
                });
            },
            addEquipment(machineOrder) {
                let equipment = {name: "", number: 1, price: 0};
                machineOrder.equipment.push(equipment);
            },

            handleDeleteEquipment(equipment, index) {
                equipment.splice(index, 1);
            },
            calculateOrderPrice(machineOrder) {
                let total = 0;
                total =
                        parseInt(machineOrder.machineNum) * parseInt(machineOrder.machinePrice);
                if (machineOrder.equipment != null && machineOrder.equipment != "") {
                    for (let i = 0; i < machineOrder.equipment.length; i++) {
                        total =
                                total +
                                parseInt(machineOrder.equipment[i].number) *
                                parseInt(machineOrder.equipment[i].price);
                    }
                }
                return total;
            },
            caculateOrderEquipmentPrice(machineOrder) {
                let total = 0;
                if (machineOrder.equipment != null && machineOrder.equipment != "") {
                    for (let i = 0; i < machineOrder.equipment.length; i++) {
                        total =
                                total +
                                parseInt(machineOrder.equipment[i].number) *
                                parseInt(machineOrder.equipment[i].price);
                    }
                }
                return total;
            },

            validContractInfo(formObj, isEdit) {
                var iserror = false;
                if (!iserror && isStringEmpty(formObj.contractNum)) {
                    iserror = true;
                    this.errorMsg = "合同号不能为空";
                }
                if (!iserror && isStringEmpty(formObj.customerName)) {
                    iserror = true;
                    this.errorMsg = "客户不能为空";
                }

                if (!iserror && isStringEmpty(formObj.sellman)) {
                    iserror = true;
                    this.errorMsg = "销售人员不能为空";
                }

                if (!iserror && formObj.contractShipDate == "") {
                    iserror = true;
                    this.errorMsg = "合同交货时间不能为空";
                }
                return iserror;
            },

            validateOrderInfo(formObj, isEdit) {
                var iserror = false;
                if (!iserror && isStringEmpty(formObj.machineOrder.orderNum)) {
                    iserror = true;
                    this.errorMsg = "订单号不能为空";
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.packageMethod)) {
                    iserror = true;
                    this.errorMsg = "请选择包装方式";
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.country)) {
                    iserror = true;
                    this.errorMsg = "请选择国家";
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.brand)) {
                    iserror = true;
                    this.errorMsg = "请选择商标";
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.machineType)) {
                    iserror = true;
                    this.errorMsg = "请选择机型";
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelDaxle)) {
                    iserror = true;
                    this.errorMsg = "D轴上不能为空";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelMotor)) {
                    iserror = true;
                    this.errorMsg = "主电机不能为空";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelMotor)) {
                    iserror = true;
                    this.errorMsg = "主电机不能为空";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTapingHead)) {
                    iserror = true;
                    this.errorMsg = "盘带头不能为空";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelNeedle)) {
                    iserror = true;
                    this.errorMsg = "毛巾机针不能为空";
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.electricPc)) {
                    iserror = true;
                    this.errorMsg = "请选择电脑";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricLanguage)) {
                    iserror = true;
                    this.errorMsg = "请选择电脑语言";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricMotor)) {
                    iserror = true;
                    this.errorMsg = "请选择主电机";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricMotorXy)) {
                    iserror = true;
                    this.errorMsg = "请选择XY电机";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricTrim)) {
                    iserror = true;
                    this.errorMsg = "请选择剪线方式";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricPower)) {
                    iserror = true;
                    this.errorMsg = "请选择电源";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricSwitch)) {
                    iserror = true;
                    this.errorMsg = "请选择按钮开关";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricOil)) {
                    iserror = true;
                    this.errorMsg = "请选择加油系统";
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.axleSplit)) {
                    iserror = true;
                    this.errorMsg = "请选择夹线器";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axlePanel)) {
                    iserror = true;
                    this.errorMsg = "请选择面板";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleNeedle)) {
                    iserror = true;
                    this.errorMsg = "请选择机针";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleNeedleType)) {
                    iserror = true;
                    this.errorMsg = "请选择机针类型";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleRail)) {
                    iserror = true;
                    this.errorMsg = "请选择机头导轨";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleDownCheck)) {
                    iserror = true;
                    this.errorMsg = "请选择底检方式";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleHook)) {
                    iserror = true;
                    this.errorMsg = "请选择旋梭";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleJump)) {
                    iserror = true;
                    this.errorMsg = "请选择跳跃方式";
                }
                if (!iserror && isStringEmpty(formObj.axleUpperThread)) {
                    iserror = true;
                    this.errorMsg = "请选择面线夹持";
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkColor)) {
                    iserror = true;
                    this.errorMsg = "请选择机架颜色";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkPlaten)) {
                    iserror = true;
                    this.errorMsg = "请选择 台板";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkPlatenColor)) {
                    iserror = true;
                    this.errorMsg = "请选择 台板颜色";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkRing)) {
                    iserror = true;
                    this.errorMsg = "请选择 吊环";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkBracket)) {
                    iserror = true;
                    this.errorMsg = "请选择 电脑托架";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkStop)) {
                    iserror = true;
                    this.errorMsg = "请选择 急停装置";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkLight)) {
                    iserror = true;
                    this.errorMsg = "请选择 日光灯";
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.driverType)) {
                    iserror = true;
                    this.errorMsg = "请选择 驱动类型";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverMethod)) {
                    iserror = true;
                    this.errorMsg = "请选择 驱动方式";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverReelHole)) {
                    iserror = true;
                    this.errorMsg = "请选择 绷架孔";
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverReel)) {
                    iserror = true;
                    this.errorMsg = "请选择 绷架";
                }

                return iserror;
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                this.contractForm = {
                    contractNum: "",
                    customerName: "",
                    sellman: "",
                    mark: "",
                    status: CONTRACT_INITIAL,
                    payMethod: "",
                    contractShipDate: ""
                };

                this.requisitionForms.splice(1);
                Vue.set(_this.requisitionForms, 0, {
                    title: "需求单1",
                    name: "1",
                    //保存需求单数据
                    machineOrder: {
                        brand: "SINSIM电脑绣花机",
                        createTime: new Date().format("yyyy-MM-dd"),
                        orderTotalPrice: 0,
                        machineNum: 1,
                        equipment: [],
                        status: ORDER_INITIAL,
                        createUserId: JSON.parse(sessionStorage.getItem("user")).id
                    },
                    orderDetail: {},
                    //每个需求单中的签核记录
                    orderSign: {}
                });

                this.tabIndex = 1;
            },

            onAdd() {
                //先校验合同的内容,再校需求单的内容
                _this.isError = this.validContractInfo(_this.contractForm, false);
                if (_this.contractExist) {
                    _this.iserror = true;
                    _this.errorMsg = "合同号已存在";
                }
                //                if(!_this.isError) {
                //                    for (let i=0; i< _this.requisitionForms.length && !_this.isError; i++) {
                //                        _this.isError = this.validateOrderInfo(_this.requisitionForms[i], false);
                //                        if(_this.isError ) {
                //                            _this.errorMsg = "需求单"+(i+1) + ":" + _this.errorMsg;
                //                        }
                //                    }
                //                }
                //Just for test
                //sessionStorage.setItem("requisitionForms", JSON.stringify(_this.requisitionForms));
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        obj[i].orderSign.signContent = JSON.stringify(
                                obj[i].orderSign.signContent
                        );
                        //将machineOrder中的装置array对象转换成Json String
                        obj[i].machineOrder.equipment = JSON.stringify(
                                obj[i].machineOrder.equipment
                        );
                        //增加销售员信息，因为之前是绑定信息是在合同contractForm里面 --No.3
                        obj[i].machineOrder.sellman = this.contractForm.sellman;
                        if (parseInt(obj[i].machineOrder.machinePrice) <= 0) {
                            showMessage(
                                    _this,
                                    "需求单" + (i + 1).toString() + "的合同价格不能为空，请检查！",
                                    0
                            );
                            return;
                        }
                    }
                    $.ajax({
                        url: HOST + "contract/add",
                        type: "POST",
                        dataType: "json",
                        data: {
                            contract: JSON.stringify(_this.contractForm),
                            contractSign: JSON.stringify(
                                    _this.contractSignForms[0].contractSignData
                            ),
                            requisitionForms: JSON.stringify(obj)
                        },
                        success: function (res) {
                            _this.isError = res.code != 200;
                            if (!_this.isError) {
                                _this.addContractVisible = false;
                                _this.editContract = "";
                                showMessage(_this, "添加成功", 1);
                                _this.selectContracts();
                            } else {
                                _this.errorMsg = res.message;
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = "服务器访问出错！";
                            _this.isError = true;
                        }
                    });
                }
            },

            onEdit() {
                _this.isError = this.validContractInfo(_this.contractForm, false);
                //                if(!_this.isError) {
                //                    for (let i=0; i< _this.requisitionForms.length && !_this.isError; i++) {
                //                        _this.isError = this.validateOrderInfo(_this.requisitionForms[i], false);
                //                        if(_this.isError ) {
                //                            _this.errorMsg = "需求单"+(i+1) + ":" + _this.errorMsg;
                //                        }
                //                    }
                //                }
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].orderSign != null) {
                            obj[i].orderSign.signContent = JSON.stringify(
                                    obj[i].orderSign.signContent
                            );
                            //将machineOrder中的装置array对象转换成Json String
                            obj[i].machineOrder.equipment = JSON.stringify(
                                    obj[i].machineOrder.equipment
                            );
                            if (parseInt(obj[i].machineOrder.machinePrice) <= 0) {
                                showMessage(
                                        _this,
                                        "需求单" + (i + 1).toString() + "的合同价格不能为空，请检查！",
                                        0
                                );
                                return;
                            }
                        }
                    }
                    $.ajax({
                        url: HOST + "contract/update",
                        type: "POST",
                        dataType: "json",
                        data: {
                            contract: JSON.stringify(_this.contractForm),
                            contractSign: JSON.stringify(
                                    _this.contractSignForms[0].contractSignData
                            ),
                            requisitionForms: JSON.stringify(obj)
                        },
                        success: function (res) {
                            _this.isError = res.code != 200;
                            if (!_this.isError) {
                                _this.addContractVisible = false;
                                _this.editContract = "";
                                showMessage(_this, "保存成功", 1);
                                _this.selectContracts();
                            } else {
                                _this.errorMsg = res.message;
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = "服务器访问出错！";
                            _this.isError = true;
                        }
                    });
                }
            },

            onSaveChange() {
                _this.isError = this.validContractInfo(_this.contractForm, false);
                if (!_this.isError) {
                    for (
                            let i = 0;
                            i < _this.requisitionForms.length && !_this.isError;
                            i++
                    ) {
                        if (
                                this.requisitionForms[i].machineOrder.originalOrderId != 0 &&
                                this.requisitionForms[i].machineOrder.status == ORDER_INITIAL
                        ) {
                            if (
                                    this.requisitionForms[i].orderChangeRecord.changeReason == null ||
                                    this.requisitionForms[i].orderChangeRecord.changeReason == ""
                            ) {
                                _this.isError = true;
                                _this.errorMsg = "改单原因不能为空！";
                            }
                        }
                    }
                }

                //                if(!_this.isError) {
                //                    for (let i=0; i< _this.requisitionForms.length && !_this.isError; i++) {
                //                        _this.isError = this.validateOrderInfo(_this.requisitionForms[i], false);
                //                        if(_this.isError ) {
                //                            _this.errorMsg = "需求单"+(i+1) + ":" + _this.errorMsg;
                //                        }
                //                    }
                //                }
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].orderSign != null) {
                            obj[i].orderSign.signContent = JSON.stringify(
                                    obj[i].orderSign.signContent
                            );
                            //将machineOrder中的装置array对象转换成Json String
                            obj[i].machineOrder.equipment = JSON.stringify(
                                    obj[i].machineOrder.equipment
                            );
                        }
                    }
                    $.ajax({
                        url: HOST + "contract/changeOrder",
                        type: "POST",
                        dataType: "json",
                        data: {
                            contract: JSON.stringify(_this.contractForm),
                            contractSign: JSON.stringify(
                                    _this.contractSignForms[0].contractSignData
                            ),
                            requisitionForms: JSON.stringify(obj)
                        },
                        success: function (res) {
                            _this.isError = res.code != 200;
                            if (!_this.isError) {
                                _this.addContractVisible = false;
                                _this.editContract = "";
                                showMessage(_this, "保存成功", 1);
                                _this.selectContracts();
                            } else {
                                _this.errorMsg = res.message;
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = "服务器访问出错！";
                            _this.isError = true;
                        }
                    });
                }
            },

            onSaveSplit() {
                _this.isError = this.validContractInfo(_this.contractForm, false);
                if (!_this.isError) {
                    for (
                            let i = 0;
                            i < _this.requisitionForms.length && !_this.isError;
                            i++
                    ) {
                        if (
                                this.requisitionForms[i].machineOrder.originalOrderId != 0 &&
                                this.requisitionForms[i].machineOrder.status == ORDER_INITIAL
                        ) {
                            if (
                                    this.requisitionForms[i].orderSplitRecord.splitReason == null ||
                                    this.requisitionForms[i].orderSplitRecord.splitReason == ""
                            ) {
                                _this.isError = true;
                                _this.errorMsg = "拆单原因不能为空！";
                            }
                        }
                    }
                }

                //                if(!_this.isError) {
                //                    for (let i=0; i< _this.requisitionForms.length && !_this.isError; i++) {
                //                        _this.isError = this.validateOrderInfo(_this.requisitionForms[i], false);
                //                        if(_this.isError ) {
                //                            _this.errorMsg = "需求单"+(i+1) + ":" + _this.errorMsg;
                //                        }
                //                    }
                //                }
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].orderSign != null) {
                            obj[i].orderSign.signContent = JSON.stringify(
                                    obj[i].orderSign.signContent
                            );
                            //将machineOrder中的装置array对象转换成Json String
                            obj[i].machineOrder.equipment = JSON.stringify(
                                    obj[i].machineOrder.equipment
                            );
                        }
                    }
                    $.ajax({
                        url: HOST + "contract/splitOrder",
                        type: "POST",
                        dataType: "json",
                        data: {
                            contract: JSON.stringify(_this.contractForm),
                            contractSign: JSON.stringify(
                                    _this.contractSignForms[0].contractSignData
                            ),
                            requisitionForms: JSON.stringify(obj),
                            splitMachines: JSON.stringify(_this.splitMachinesSelected)
                        },
                        success: function (res) {
                            _this.isError = res.code != 200;
                            if (!_this.isError) {
                                _this.addContractVisible = false;
                                _this.editContract = "";
                                showMessage(_this, "保存成功", 1);
                                _this.selectContracts();
                            } else {
                                _this.errorMsg = res.message;
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            showMessage(_this, "服务器访问出错！", 0);
                        }
                    });
                }
            },

            onSubmitOrderSign(item, signObj) {
                if (item.comment == null || item.comment == "") {
                    showMessage(_this, "审核意见不能为空！", 0);
                } else {
                    item.user = _this.userInfo.name;
                    item.date = new Date().format("yyyy-MM-dd hh:mm:ss");
                    item.result = SIGN_APPROVE;
                    $.ajax({
                        url: HOST + "order/sign/update",
                        type: "POST",
                        dataType: "json",
                        data: {
                            contractId: _this.editContract.id,
                            orderSign: JSON.stringify(signObj)
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, "提交审核成功", 1);
                                _this.addContractVisible = false;
                                _this.selectContracts();
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                        }
                    });
                }
            },
            handleRejectOrderSign(item, signObj) {
                if (item.comment == null || item.comment == "") {
                    showMessage(_this, "审核意见不能为空！", 0);
                } else {
                    this.rejectSignResultVisible = true;
                    tem.user = _this.userInfo.name;
                    item.date = new Date().format("yyyy-MM-dd hh:mm:ss");
                    item.result = SIGN_REJECT;
                    this.signResultObj = signObj;
                }
            },
            onRejectOrderSign() {
                $.ajax({
                    url: HOST + "order/sign/update",
                    type: "POST",
                    dataType: "json",
                    data: {
                        contractId: _this.editContract.id,
                        orderSign: JSON.stringify(_this.signResultObj)
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "驳回成功", 1);
                            _this.addContractVisible = false;
                            _this.selectContracts();
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
                this.rejectSignResultVisible = false;
            },
            onSubmitContractSign(rowItem, signObj) {
                if (rowItem.comment == null || rowItem.comment == "") {
                    showMessage(_this, "审核意见不能为空！", 0);
                } else {
                    rowItem.user = _this.userInfo.name;
                    rowItem.date = new Date().format("yyyy-MM-dd hh:mm:ss");
                    rowItem.result = SIGN_APPROVE;
                    _this.editContractSign.signContent = JSON.stringify(
                            signObj.contractSignData
                    );
                    //准备好数据，提交服务器
                    $.ajax({
                        url: HOST + "contract/sign/update",
                        type: "POST",
                        dataType: "json",
                        data: {contractSign: JSON.stringify(_this.editContractSign)},
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, "提交审核成功", 1);
                                _this.addContractVisible = false;
                                _this.selectContracts();
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                        }
                    });
                }
            },
            onRejectContractSign() {
                _this.editContractSign.signContent = JSON.stringify(
                        this.signResultObj.contractSignData
                );
                //准备好数据，提交服务器
                $.ajax({
                    url: HOST + "contract/sign/update",
                    type: "POST",
                    dataType: "json",
                    data: {contractSign: JSON.stringify(_this.editContractSign)},
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "驳回成功", 1);
                            _this.addContractVisible = false;
                            _this.selectContracts();
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
                this.rejectContractSignResultVisible = false;
            },
            handleRejectContractSign(item, signObj) {
                if (item.comment == null || item.comment == "") {
                    showMessage(_this, "审核意见不能为空！", 0);
                } else {
                    this.rejectContractSignResultVisible = true;
                    item.user = _this.userInfo.name;
                    item.date = new Date().format("yyyy-MM-dd hh:mm:ss");
                    item.result = SIGN_REJECT;
                    this.signResultObj = signObj;
                }
            },

            signDisable(roleId) {
                //超级管理员可以操作，或者当前合同属于“签核状态”、登陆的用户有权限签核并且合同currentStep处于属于该角色签核
                return !(
                        (roleId == _this.userInfo.role.id &&
                        this.editContract.status == 1 &&
                        this.editContract.currentStep == _this.userInfo.role.roleName) ||
                        _this.userInfo.role.id == 1
                );
            },

            changeOrderContentDisable(item) {
                return (
                        item.status == ORDER_CHANGED ||
                        item.status == ORDER_CHECKING_FINISHED ||
                        item.status == ORDER_CANCELED ||
                        item.status == ORDER_SPLITED ||
                        (item.status == ORDER_CHECKING &&
                        _this.contractForm.status == CONTRACT_CHECKING) ||
                        this.mode == this.SIGN_MODE
                );
            },

            changeContractContentDisable(item) {
                return (
                        (item.status != CONTRACT_INITIAL && item.status != CONTRACT_REJECTED) ||
                        this.mode == this.SIGN_MODE
                );
            },

            fetchContractData(contractId) {
                $.ajax({
                    url: HOST + "contract/detail",
                    type: "POST",
                    dataType: "json",
                    data: {id: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.contractForm = res.data;
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            fetchContractSignData(contractId) {
                $.ajax({
                    url: HOST + "contract/sign/detailByContractId",
                    type: "POST",
                    dataType: "json",
                    data: {contractId: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.editContractSign = res.data;
                            _this.contractSignForms[0].contractSignData = JSON.parse(
                                    res.data.signContent
                            );
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },
            fetchMachineOrdersData(contractId) {
                $.ajax({
                    url: HOST + "/machine/order/selectOrders",
                    type: "POST",
                    dataType: "json",
                    data: {contract_id: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            let tempList = res.data.list;
                            _this.requisitionForms = [];
                            for (let i = 0; i < tempList.length; i++) {
                                let newTabName = i + 1 + "";
                                let orderDetail = copyObjectByJSON(tempList[i].orderDetail);
                                let orderSign = copyObjectByJSON(tempList[i].orderSign);
                                let orderChangeRecord = copyObjectByJSON(
                                        tempList[i].orderChangeRecord
                                );
                                let orderSplitRecord = copyObjectByJSON(
                                        tempList[i].orderSplitRecord
                                );
                                if (orderSign != null) {
                                    orderSign.signContent =
                                            orderSign.signContent != null
                                                    ? JSON.parse(orderSign.signContent)
                                                    : [];
                                }
                                let machineOrder = copyObjectByJSON(tempList[i]);
                                machineOrder.machineType = machineOrder.machineType.id;
                                //由于装置中保存的是JSON字符串，需要转换成Object
                                machineOrder.equipment =
                                        machineOrder.equipment != null && machineOrder.equipment != ""
                                                ? JSON.parse(machineOrder.equipment)
                                                : [];
                                machineOrder.createTime = new Date(
                                        machineOrder.createTime
                                ).format("yyyy-MM-dd");
                                machineOrder.orderDetail = null;
                                machineOrder.orderSign = null;

                                var newItem = {
                                    //title: "需求单" + newTabName,
                                    title: machineOrder.orderNum,
                                    name: newTabName,
                                    machineOrder: machineOrder,
                                    orderDetail: orderDetail,
                                    orderSign: orderSign,
                                    orderChangeRecord: orderChangeRecord,
                                    orderSplitRecord: orderSplitRecord
                                };
                                if (machineOrder.status == ORDER_CHANGED) {
                                    newItem.title = newItem.title + "（已改单）";
                                } else if (machineOrder.status == ORDER_SPLITED) {
                                    newItem.title = newItem.title + "（已拆单）";
                                } else if (machineOrder.status == ORDER_REJECTED) {
                                    newItem.title = newItem.title + "（已驳回）";
                                } else if (machineOrder.status == ORDER_CANCELED) {
                                    newItem.title = newItem.title + "（已取消）";
                                }
                                _this.isShowConfirmPlanDate = _this.checkPlanDateIsShow(machineOrder);
                                _this.requisitionForms.push(newItem);
                                _this.editableTabsValue = newTabName;
                                _this.tabIndex = i + 1;
                            }
                        }
                    },
                    error: function (data) {
                        showMessage(_this, "服务器访问失败！", 0);
                    }
                });
            },

            checkPlanDateIsShow(item)
            {
                return (item.status == ORDER_CHECKING_FINISHED ||
                        item.status == CONTRACT_CHECKING_FINISHED ||
                        item.status == ORDER_CHECKING ||
                        _this.contractForm.status == CONTRACT_CHECKING ||
                        this.mode == this.SIGN_MODE ) &&
                        _this.userInfo.role.roleName.indexOf("PMC") > -1;

            },

            initAllRoles() {
                $.ajax({
                    url: HOST + "role/list",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                            _this.requestSalePersonList();
                        }
                    }
                });
            },

            //只有在填单员创建新的合同、改单或者拆单才会去获取签核流程，填单员（编辑）以及其他部门签核时不需要
            initSignProcesses() {
                $.ajax({
                    url: HOST + "sign/process/list",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.signProcesses = res.data.list;
                            for (let i = 0; i < _this.signProcesses.length; i++) {
                                if (_this.signProcesses[i].processName.indexOf("正常") != -1) {
                                    _this.normalSignProcess = JSON.parse(
                                            _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.normalSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.normalSignProcess[j].signType == "需求单签核") {
                                            let item = _this.normalSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.normalOrderSignArray.push(item);
                                        } else if (
                                                _this.normalSignProcess[j].signType == "合同签核"
                                        ) {
                                            let item = _this.normalSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.normalContractSignArray.push(item);
                                        }
                                    }
                                } else if (
                                        _this.signProcesses[i].processName.indexOf("改单") != -1
                                ) {
                                    _this.changeSignProcess = JSON.parse(
                                            _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.changeSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.changeSignProcess[j].signType == "需求单签核") {
                                            let item = _this.changeSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.changeOrderSignArray.push(item);
                                        } else if (
                                                _this.changeSignProcess[j].signType == "合同签核"
                                        ) {
                                            let item = _this.changeSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.changeContractSignArray.push(item);
                                        }
                                    }
                                } else if (
                                        _this.signProcesses[i].processName.indexOf("拆单") != -1
                                ) {
                                    _this.splitSignProcess = JSON.parse(
                                            _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.splitSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.splitSignProcess[j].signType == "需求单签核") {
                                            let item = _this.splitSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.splitOrderSignArray.push(item);
                                        } else if (_this.splitSignProcess[j].signType == "合同签核") {
                                            let item = _this.splitSignProcess[j];
                                            item.date = "";
                                            item.user = "";
                                            item.result = SIGN_INITIAL;
                                            item.comment = "";
                                            _this.splitContractSignArray.push(item);
                                        }
                                    }
                                }
                            }
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            initMachineType() {
                //TODO：更新机型时必须清除缓存，需要设置一个有失效时间的缓存
                //_this.allMachineType = JSON.parse(sessionStorage.getItem("allMachineType"));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
                        type: "POST",
                        dataType: "json",
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                //sessionStorage.setItem("allMachineType",JSON.stringify(res.data.list));
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                        }
                    });
                }
            },

            tableRowDisabledClassName({row, rowIndex}) {
                if (
                        row.machineOrder.status == ORDER_CANCELED ||
                        row.machineOrder.status == ORDER_CHANGED
                ) {
                    return "warning-row";
                }
                return "";
            },

            classWithDifferentValue(item, type, isDetail) {
                let comparedItem = "";
                if (item.machineOrder.originalOrderId != 0) {
                    for (let i = 0; i < _this.requisitionForms.length; i++) {
                        if (
                                item.machineOrder.originalOrderId ==
                                _this.requisitionForms[i].machineOrder.id
                        ) {
                            if (isDetail) {
                                comparedItem = copyObjectByJSON(
                                        _this.requisitionForms[i].orderDetail
                                );
                            } else {
                                comparedItem = copyObjectByJSON(
                                        _this.requisitionForms[i].machineOrder
                                );
                            }
                            break;
                        }
                    }
                    if (comparedItem != "" && !isUndefined(comparedItem[type])) {
                        if (isDetail) {
                            if (item.orderDetail[type] != comparedItem[type]) {
                                return "different-value";
                            } else {
                                return "";
                            }
                        } else {
                            if (item.machineOrder[type] != comparedItem[type]) {
                                return "different-value";
                            } else {
                                return "";
                            }
                        }
                    }
                } else {
                    return "";
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (row.result == SIGN_REJECT) {
                    return "warning-row";
                }
                return "";
            },
            filterOrderNum(originalId) {
                let result = "";
                for (let i = 0; i < _this.requisitionForms.length; i++) {
                    if (_this.requisitionForms[i].machineOrder.id == originalId) {
                        result = _this.requisitionForms[i].machineOrder.orderNum;
                        break;
                    }
                }
                return result;
            }
        },
        computed: {},
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

            filterMachineTypeName(id) {
                let result = "";
                for (let i = 0; i < _this.allMachineType.length; i++) {
                    if (_this.allMachineType[i].id == id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            },
            filterOrderStatusStyle(id) {
                var result = "divOrderStatusUnChecked";

                if (id == 0 || id == 5 || id == 6) {
                    result = "divOrderStatusUnChecked";
                } else if (id == 2) {
                    result = "divOrderStatusFinished";
                } else if (id == 1 || id == 3 || id == 4) {
                    result = "divOrderStatusChecking";
                }
                return result;
            }
        },
        created: function () {
            _this.userInfo = JSON.parse(sessionStorage.getItem("user"));
            if (isNull(_this.userInfo)) {
                this.$router.push({path: "/login"});
                return;
            }
            _this.requestCustomerList();
            _this.initAllRoles();
            _this.initMachineType();
            _this.selectContracts();
            _this.initSignProcesses();
        },
        mounted: function () {
        }
    };
</script>
<style>
    .el-table .warning-row {
        background: #909399;
    }

    .el-table .success-row {
        background: #f0f9eb;
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

    .divOrderStatusUnChecked {
        color: red;
    }

    .my-autocomplete {
        width: 100%;
    }
</style>
