<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="项目名称:">
                            <el-input v-model="filters.projectName" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="优化部件:">
                            <el-input v-model="filters.optimizePart" placeholder="" auto-complete="off" clearable></el-input>
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
                        <el-form-item label="机型:">
                            <el-select v-model="filters.machineType" clearable filterable>
                                <el-option
                                        v-for="item in allMachineType"
                                        :value="item.id"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="目的:">
                            <el-input v-model="filters.purpose" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="负责人:">
                            <el-input v-model="filters.owner" placeholder="" auto-complete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="更新日期:">
                            <el-date-picker v-model="filters.selectUpdateDate" type="daterange" align="left" unlink-panels range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="0" >
                        <el-button icon="el-icon-search" size="normal" type="primary" @click="searchOptimizeList">查询 </el-button>
                    </el-col>
                    <el-col :span="2" :offset="0">
                        <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">试验</el-button>
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
                <el-table-column align="center" label="项目名称" min-width="105">
                    <template scope="scope">
                        <!--<span>{{scope.row.projectName}}</span>-->
                        <div v-on:click="handleReadOnly(scope.$index, scope.row)" style="font-weight: bold;"
                             class="btn btn-link">
                            {{scope.row.projectName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="80" prop="orderSignStatus" label="优化部件">
                    <template scope="scope">
                        <div>
                            {{scope.row.optimizePart}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="95" label="订单号">
                    <template scope="scope">
                        {{(scope.row.orderNum)}}
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="nameplate" min-width="125" label="机型">
                    <template scope="scope">
                        <div>{{scope.row.machineType}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="工时">
                    <template scope="scope">
                        <div>{{scope.row.workingHours}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="负责人">
                    <template scope="scope">
                        {{(scope.row.owner)}}
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="updatedDate" min-width="95" label="创建日期">
                    <template scope="scope">
                        {{(scope.row.createDate)|filterDateString}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updatedDate" min-width="95" label="更新日期">
                    <template scope="scope">
                        {{(scope.row.updateDate)|filterDateString}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="240">
                    <template scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content">附件</div>
                            <el-button size="mini" type="info" icon="el-icon-download"
                                       :disabled="scope.row.files==null||scope.row.files==''"
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

            <el-dialog :visible.sync="addOptimizeVisible" fullscreen @close="dialogCloseCallback()">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
                            {{dialogTitle}}
                        </div>
                        <el-form :model="optimizeForm" :rules="rules" ref="ruleForm">

                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    订单信息
                                </div>
                                <el-row>
                                    <el-col :span="6"  >
                                        <el-form-item label="订单号:" :label-width="longFormLabelWidth" prop="orderNum">
                                            <el-select
                                                    :disabled="notWritter() "
                                                    v-model="optimizeForm.orderNum"
                                                    @change="onOrderChanged(optimizeForm.orderNum)"
                                                    clearable
                                                    placeholder="请选择订单号"
                                                    filterable >
                                                <el-option
                                                        v-for="item in allOrderList"
                                                        :label="item.orderNum"
                                                        :value="item.orderNum">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4" :offset="1">
                                        <el-form-item label="机型："  :label-width="formLabelWidthSmall">
                                            <el-input v-model="optimizeForm.machineType" clearable>
                                            </el-input>
                                        </el-form-item >
                                    </el-col >
                                    <el-col :span="6"  v-show=" (optimizeForm.orderNum != null)
                                                                && (optimizeForm.orderNum.length != 0)">
                                        <el-button type="warning" plain size="medium"
                                                   @click="handleViewContract(optimizeForm.orderNum)">查看订单 {{optimizeForm.orderNum}}</el-button>

                                    </el-col>
                                </el-row>
                                <el-row>

                                </el-row>
                            </el-card>
                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    优化试验
                                </div>
                                <el-row>
                                    <el-col  :span="12" style="margin-top:10px;">
                                        <el-form-item label="项目名称" :label-width="longFormLabelWidth"  >
                                            <el-input type="textarea" v-model="optimizeForm.projectName"
                                                      clearable
                                                      :rows="1"
                                                      :disabled="notWritter()">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col  :span="6"  >
                                        <el-form-item label="优化部件" :label-width="longFormLabelWidth"  >
                                            <el-input type="textarea" v-model="optimizeForm.optimizePart"
                                                      clearable
                                                      :rows="1"
                                                      :disabled="notWritter()">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col  :span="6"  >
                                        <el-form-item label="工时" :label-width="longFormLabelWidth"  >
                                            <el-input type="textarea" v-model="optimizeForm.workingHours"
                                                      clearable
                                                      :rows="1"
                                                      :disabled="notWritter()">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6"  >
                                        <el-form-item label="负责人:" :label-width="longFormLabelWidth" >
                                            <el-select
                                                    :disabled="notWritter() "
                                                    v-model="optimizeForm.owner"
                                                    clearable
                                                    filterable >
                                                <el-option
                                                        v-for="item in ownerList"
                                                        :label="item.account"
                                                        :value="item.account">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-row>
                                        <el-col :span="22" :offset="1">
                                            <el-form-item label="优化目的："   >
                                                <el-input type="textarea" v-model="optimizeForm.purpose"
                                                          :rows="5" clearable>
                                                </el-input>
                                            </el-form-item >
                                        </el-col >
                                    </el-row>

                                    <el-row>
                                        <el-col :span="6" >
                                            <el-form-item label="创建日期" :label-width="longFormLabelWidth"  >
                                                <el-date-picker
                                                        :disabled="notWritter() "
                                                        style="width: 100%"
                                                        v-model="optimizeForm.createDate"
                                                        type="date"
                                                >
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6" >
                                            <el-form-item label="更新日期" :label-width="longFormLabelWidth"  >
                                                <el-date-picker
                                                        :disabled="notWritter() "
                                                        style="width: 100%"
                                                        v-model="optimizeForm.updateDate"
                                                        type="date"
                                                >
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row style="margin-top:10px;">
                                        <div>
                                            <el-col :span="2">
                                                <el-form-item label="附 件 : " :label-width="longFormLabelWidth">
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2" style="margin-left:20px;">
                                                <el-button
                                                        :disabled="notWritter()"
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
                                                        :disabled=" haveNoAttachedFile(optimizeForm.files)"
                                                        @click="onAttachedDownload(optimizeForm)">下载
                                                </el-button>
                                            </el-col>
                                            <el-col :span="2" style="margin-left:20px;">
                                                <el-button
                                                        size="small"
                                                        type="danger"
                                                        icon="el-icon-delete"
                                                        :disabled=" haveNoAttachedFile(optimizeForm.files)||notWritter()"
                                                        @click="handAttachedDelete(optimizeForm)">删除
                                                </el-button>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item label="" :label-width="longFormLabelWidth">
                                            <span style="float:left;">
                                                {{removeAbsolutePath(optimizeForm.files)}}
                                            </span>
                                                </el-form-item>
                                            </el-col>
                                        </div>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="22" :offset="1">
                                            <el-form-item label="效果结论："   >
                                                <el-input type="textarea" v-model="optimizeForm.results"
                                                          :rows="5" clearable>
                                                </el-input>
                                            </el-form-item >
                                        </el-col >
                                    </el-row>
                                </el-row>
                            </el-card>
                        </el-form>

                        <el-form>
                            <div>
                                <el-button @click="dialogClose()" icon="el-icon-back" type="info" offset="120">
                                    关 闭
                                </el-button>
                                <el-button
                                        v-show="showSaveButton()"
                                        type="primary"
                                        @click="onAddOrEdit()"
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
                            <b style="color: #F56C6C;font-weight: bold">{{selectedItem.orderNum}}</b> ] 的该优化记录吗？
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
                            <el-button type="primary" @click="onConfirmDeleteAttached" icon="el-icon-check">确 定</el-button>
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


    </div>
</template>
<script>
    var _this;

    export default {
        name: 'optimize_test',
        data() {
            _this = this;
            return {

                normalSignRoleList: [],
                uploadDialogVisible: false,
//                差一个字符，会导致”blocked by CORS policy: No 'Access-Control-Allow-Origin' “错误，小心被误导。
                uploadURL: HOST + "optimize/test/uploadOptimizeFile",
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
                ownerList:[],
                queryMachineTypeURL: HOST + 'machine/type/list',
                allMachineType: [],
                filters: {
                    projectName: '',
                    optimizePart: '',
                    orderNum: '',
                    machineType: '',
                    purpose: '',
                    owner:'',
                    selectCreateDate: '',
                    selectUpdateDate:''//默认查询当天  [new Date(), new Date()]
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
                addOptimizeVisible: false,
                dialogTitle: '优化试验',

                mode: 1,
                ADD_MODE: 1,
                EDIT_MODE: 2,
                READ_ONLY_MODE:3,
                formLabelWidth: '100px',
                longFormLabelWidth: '125px',
                verylongFormLabelWidth: '185px',
                formLabelWidthMiddle: '80px',
                formLabelWidthSmall: '60px',

                //用于保存设计内容
                optimizeForm: {
                    projectName: '',
                    optimizePart: '',
                    orderNum: '',
                    machineType: '',
                    purpose: '',
                    owner: '',

                    workingHours:'', //工时
                    results:'', //效果
                    files:'', //附件

                    createDate: new Date(),
                    updatedDate: new Date()
                },

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
            };
        },
        methods: {

            showSaveButton(){
                if(_this.mode==_this.ADD_MODE )
                {
                    return true;
                } else if(_this.mode == _this.EDIT_MODE
                        &&( _this.userInfo.account == _this.optimizeForm.owner || _this.userInfo.role.id == 8||_this.userInfo.role.id == 1))
                { //编辑模式，也只负责人，技术部经理，有管理员才可以编辑-保存。
                    return true;
                }

                return false;
            },

            // 附件删除
            handAttachedDelete(item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.attachedDeleteConfirmVisible = true;
                }
            },

            onConfirmDeleteAttached(item){
                _this.attachedDeleteConfirmVisible = false;
                _this.optimizeForm.files = "";

                let submitData=JSON.stringify(_this.optimizeForm);
                $.ajax({
                    url: HOST + 'optimize/test/update',
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
//                            _this.requestSalePersonList();
                            _this.fetchSignProcesses();
                        }
                    }
                });
            },
            fetchSignProcesses() {
                $.ajax({
                    url: HOST + "sign/process/list",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        if (data.code == 200) {
                            let tmpList = data.data.list;
                            for (let i = 0; i < tmpList.length; i++) {
                                if (
                                        tmpList[i].processName != null &&
                                        tmpList[i].processName.indexOf("正常") != -1
                                ) {
                                    _this.normalSignRoleList.push({
                                        roleId: "",
                                        name: "全部",
                                        choosed: _this.filters.roleName == "" ? true : false
                                    });
                                    var temp = JSON.parse(tmpList[i].processContent);
                                    if (temp != null && temp.length > 0) {
                                        for (let j = 0; j < temp.length; j++) {
                                            _this.normalSignRoleList.push({
                                                roleId: temp[j].roleId,
                                                name: _this.getRoleNameById(temp[j].roleId),
                                                choosed:
                                                        _this.filters.roleName ==
                                                        _this.getRoleNameById(temp[j].roleId)
                                                                ? true
                                                                : false
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
                    error: function(data) {
                        showMessage(_this, "服务器访问出错", 0);
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

            formatDate(timeStamp) {
                return new Date(timeStamp).format("yyyy-MM-dd");
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    console.log("ooooooo");
                    _this.deleteConfirmVisible = true;
                } else{
                    console.log("aaaaaaa");
                }
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url:  HOST + 'optimize/test/delete',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: _this.selectedItem.id
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.searchOptimizeList();
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
                formData.append("orderNum", _this.optimizeForm.orderNum);

                //在第一次新建时上传文件，optimizeTestID为空，需要把日期在前端准备好
                if(_this.optimizeForm.id == null) {
                    _this.optimizeForm.createDate = new Date();
                }

                $.ajax({
                    url:  HOST + "optimize/test/uploadOptimizeFile",// 需要链接到服务器地址
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.code === 200) {
                            showMessage(_this, "文件上传/更新成功！", 1);
                            _this.optimizeForm.files = res.data;
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

            onAttachedDownload(item)
            {
                _this.selectedItem = copyObject(item);
                $.ajax({
                    url: HOST + "optimize/test/getOptimizeAttachedFile",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        optimizeTestId: _this.selectedItem.id,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            if (res.data.length > 0) {
                                var downLoadURL = DOWNLOADPATH_OPTIMIZE + res.data;
                                _this.downloadFile(downLoadURL);
                            }
                        }
                    }
                })
            },

            onDownload(item)
            {
                _this.onAttachedDownload( item);
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
                _this.fetchOptimizeData(item.id);

                //联系单信息也会用到
                _this.getMachineOrderData(item.orderNum);
                this.addOptimizeVisible = true;
            },
            handleReadOnly(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '查看';
                this.mode = this.READ_ONLY_MODE;
                this.selectedItem = copyObject(item);
                _this.fetchOptimizeData(item.id);

                //联系单信息也会用到
                _this.getMachineOrderData(item.orderNum);
                this.addOptimizeVisible = true;
            },
            fetchOptimizeData(formId) {
                $.ajax({
                    url: HOST + 'optimize/test/detail',
                    type: 'POST',
                    dataType: 'json',
                    data: {id: formId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.optimizeForm=res.data;
                        } else {
                            console.log("fetchOptimizeData:" + res.message);
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
                        //除了管理员和技术部经理，负责人只能改自己的东西
                        return this.userInfo.account == row.owner;
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
                        // 即使是被指定的落实人员 不允许删除
                        return false;
                    }
                }
                return false;
            },

            onAdd()
            {
                let submitData=JSON.stringify(_this.optimizeForm);
                $.ajax({
                    url: HOST + 'optimize/test/add',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonOptimizeFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            showMessage(_this, '添加成功', 1);
                            //新需求:赋值主键ID,UI不关闭，继续可编辑，变成更新页面
                            _this.optimizeForm.id = res.data;
                            _this.mode = _this.EDIT_MODE;
                            _this.changeUIMode();
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
                    _this.dialogTitle = '编辑优化';
                }else{
                    _this.dialogTitle = '新增优化';
                }
            },

            onEdit() {
                _this.optimizeForm.updatedDate = new Date();
                let submitData=JSON.stringify(_this.optimizeForm);
                $.ajax({
                    url: HOST + 'optimize/test/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonOptimizeFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            showMessage(_this, '更新成功', 1);
                            _this.searchOptimizeList();
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

            onAddOrEdit() {

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
                this.getMachineOrderData(orderNum);
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
                            _this.optimizeForm.machineType = res.data.list[0].machineType.name;
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

            fetchOwnerList() {
                $.ajax({
                    url: HOST + 'user/selectUsers',
                    type: 'POST',
                    dataType: 'json',
                    data: {roleId: 10},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.ownerList = res.data.list;
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
                this.dialogTitle = '新增优化测试项目';
                this.addOptimizeVisible = true;
                this.resetOptimizeFormEmpty();

            },

            resetOptimizeFormEmpty(){
                _this.optimizeForm =  {
                    projectName: '',
                    optimizePart: '',
                    orderNum: '',
                    machineType: '',
                    purpose: '',
                    owner: '',

                    workingHours:'', //工时
                    results:'', //效果
                    files:'', //附件

                    createDate: new Date(),
                    updatedDate: new Date(),

                };
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                _this.resetOptimizeFormEmpty();
                _this.addOptimizeVisible = false;
//                _this.selectContracts();
            },
            dialogClose() {
                _this.addOptimizeVisible = false;
                _this.resetOptimizeFormEmpty();
                _this.searchOptimizeList();
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
            searchOptimizeList() {
                _this.currentPage = 1;
                _this.onSearchDetailData();
            },

            onSearchDetailData() {
                var condition = {
                    projectName: _this.filters.projectName,
                    optimizePart: _this.filters.optimizePart,
                    orderNum: _this.filters.orderNum,
                    machineType: _this.filters.machineType,
                    purpose: _this.filters.purpose,
                    owner:_this.filters.owner,
                    page: _this.currentPage,
                    size: _this.pageSize
                };
                if (_this.filters.selectCreateDate != null &&
                        _this.filters.selectCreateDate.length > 0) {
                    condition.queryStartTimeCreate = _this.filters.selectCreateDate[0].format('yyyy-MM-dd');
                    condition.queryFinishTimeCreate = _this.filters.selectCreateDate[1].format('yyyy-MM-dd');
                }

                if (_this.filters.selectUpdateDate != null &&
                        _this.filters.selectUpdateDate.length > 0) {
                    condition.queryStartTimeUpdate = _this.filters.selectUpdateDate[0].format('yyyy-MM-dd');
                    condition.queryFinishTimeUpdate = _this.filters.selectUpdateDate[1].format('yyyy-MM-dd');
                }
                $.ajax({
                    url: HOST + 'optimize/test/selectOptimizeList',
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
            _this.searchOptimizeList();
            _this.fetchAllOrderList();
            _this.fetchOwnerList();
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
