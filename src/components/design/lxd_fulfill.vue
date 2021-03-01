<template xmlns:v-on="http://www.w3.org/1999/xhtml">
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
                            <el-date-picker v-model="filters.selectCreateDate" type="daterange"
                                            align="left" unlink-panels range-separator="—"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :picker-options="pickerOptions"></el-date-picker>
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
                            <el-date-picker v-model="filters.selectUpdateDate" type="daterange" align="left"
                                            unlink-panels range-separator="—" start-placeholder="开始日期"
                                            end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
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
                        <!--<span>{{scope.row.contactForm.num}}</span>-->
                        <div v-on:click="handleReadOnly(scope.$index, scope.row)" style="font-weight: bold;"
                             class="btn btn-link">
                            {{scope.row.contactForm.num}}
                        </div>
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


                <el-table-column align="center" label="操作" width="140">
                    <template scope="scope">
                        <!--<el-tooltip placement="top">-->
                            <!--<div slot="content">装车单</div>-->
                            <!--<el-button size="mini" type="info" icon="el-icon-download"-->
                                       <!--@click="onDownload(scope.row)"></el-button>-->
                        <!--</el-tooltip>-->
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

            <el-dialog title="新增落实单" :visible.sync="addFulfillVisible" width="30%" append-to-body>
                <span style="font-size: 22px">
                          请到具体的联系单里进行操作
                </span>
                <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="addFulfillVisible = false" icon="el-icon-check">OK</el-button>
                        </span>
            </el-dialog>

            <!--这里是编辑-->
            <el-dialog :visible.sync="editFulfillVisible" fullscreen @close="dialogCloseCallback()">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
                            {{dialogTitle}}
                        </div>
                        <el-form :model="lxdForm.contactForm" :rules="rules" ref="ruleForm">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="联系单类型：" :label-width="longFormLabelWidth" prop="contactType">
                                        <el-select v-model="lxdForm.contactForm.contactType" placeholder="选择不同类型，会有不同的内容" clearable
                                                   :disabled="notWritter()||mode!=ADD_MODE">
                                            <el-option
                                                    v-for="item in lxdTypes"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="联系单号：" :label-width="longFormLabelWidth" prop="num">
                                        <el-input v-model="lxdForm.contactForm.num"
                                                  disabled
                                                  clearable
                                                  placeholder="联系单号："></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="(保存联系单时确定流水号)"
                                                  v-show="mode==ADD_MODE">
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="8">
                                    <el-button
                                            style="float:right;margin-right:30px;"
                                            v-show="isShowSubmitSign()"
                                            type="success"
                                            icon="el-icon-check"
                                    >提交审核
                                    </el-button>
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
                                    <el-col :span="6">
                                        <el-form-item label="申请日期：" prop="createDate"
                                                      :label-width="longFormLabelWidth">
                                            <el-date-picker
                                                    :disabled="notWritter()||mode==SIGN_MODE"
                                                    type="date"
                                                    placeholder="申请日期"
                                                    v-model="lxdForm.contactForm.createDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6"  v-show="isShowChangeContactForm">
                                        <el-form-item label="ECO希望日期：" prop="hopeDate" :label-width="longFormLabelWidth">
                                            <el-date-picker
                                                    :disabled="notWritter()||mode==SIGN_MODE"
                                                    type="date"
                                                    placeholder="ECO希望完成日期"
                                                    v-model="lxdForm.contactForm.hopeDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" v-show="isShowChangeContactForm">
                                        <el-form-item label="订单号: " :label-width="longFormLabelWidth" prop="orderNum">
                                            <el-select
                                                    :disabled="notWritter()||mode==SIGN_MODE"
                                                    v-model="lxdForm.contactForm.orderNum"
                                                    clearable
                                                    filterable
                                                    placeholder="订单号">
                                                <el-option
                                                        v-for="item in allOrderList"
                                                        :label="item.orderNum"
                                                        :value="item.orderNum">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6"  v-show="isShowChangeContactForm
                                                                && (lxdForm.contactForm.orderNum != null)">
                                        <el-button type="warning" plain size="medium"
                                                   @click="handleViewContract(lxdForm.contactForm.orderNum)">查看订单 {{lxdForm.contactForm.orderNum}}</el-button>

                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col  :span="20" style="margin-top:10px;">
                                        <el-form-item :label="getLxdTypeLabel(lxdForm.contactForm.contactType)" :label-width="longFormLabelWidth" prop="contactTitle">
                                            <el-input type="textarea" v-model="lxdForm.contactForm.contactTitle"  clearable
                                                      :rows="1" :disabled="notWritter()||mode==SIGN_MODE"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row v-show="isShowChangeContactForm">
                                    <el-row :span="2"  style="margin-top:10px;">
                                        <el-form-item label="变更内容：" :label-width="longFormLabelWidth" prop="contactContent">
                                            <el-checkbox-group  v-model="checkedChangeTypes"
                                                                :disabled="notWritter()||mode==SIGN_MODE"
                                                                style="margin-left:0px;float:left;">
                                                <el-checkbox v-for="item in lxdChangeTypes" :label="item" :key="item"
                                                             @change="handleCheckedChange(checkedChangeTypes,item)">
                                                    {{item}}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-form-item>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="20" style="margin-top:10px;" v-show="isShowChangeContactForm &&lxdForm.contactForm.contactContentElseIsChecked">
                                            <el-form-item label="其他变更：" :label-width="longFormLabelWidth" prop="contactContentElse">
                                                <el-input v-model="lxdForm.contactForm.contactContentElse" placeholder="选中”其他变更”时输入" clearable
                                                          :disabled="notWritter()||mode==SIGN_MODE">
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-row>
                                <el-row v-show="isShowChangeContactForm">
                                    <el-col :span="4" :offset="20" style="margin-top:10px;margin-bottom:10px;">
                                        <el-button
                                                :disabled="notWritter()||mode==SIGN_MODE"
                                                type="primary"
                                                class="el-icon-plus"
                                                style="float:right"
                                                @click="addChangeItem()">变更条目
                                        </el-button>
                                    </el-col>
                                </el-row>

                                <el-row v-show="isShowWorkContactForm">
                                    <el-col :span="20" style="margin-top:10px;">
                                        <el-form-item label="工作内容：" :label-width="longFormLabelWidth" prop="contactContent">
                                            <el-input type="textarea" v-model="lxdForm.contactForm.contactContent"
                                                      :rows="5"  :disabled="notWritter()||mode==SIGN_MODE">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row v-show="isShowChangeContactForm" >
                                    <span v-for="item in lxdForm.changeItemList" style="margin-top:10px;">
                                        <el-col :span="8">
                                            <el-form-item label="旧状态：" :label-width="longFormLabelWidth">
                                                <el-input type="textarea" :rows="5" v-model="item.oldInfo" placeholder="输入变更前的状态" clearable  :disabled="notWritter()||mode==SIGN_MODE"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="新状态：" :label-width="longFormLabelWidth">
                                                <el-input type="textarea" :rows="5" v-model="item.newInfo" placeholder="输入变更后的状态" clearable  :disabled="notWritter()||mode==SIGN_MODE"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="备注：" :label-width="longFormLabelWidth">
                                                <el-input type="textarea" :rows="5" v-model="item.remarks" placeholder="输入备注"
                                                          clearable  :disabled="notWritter()||mode==SIGN_MODE"
                                                          v-if="isFinanceVisible()"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-button
                                                    :disabled="notWritter()||mode==SIGN_MODE"
                                                    size="mini"
                                                    type="danger"
                                                    class="el-icon-delete"
                                                    @click="onDeleteChangeItem(item)" style="margin-top: 5px;"></el-button>
                                        </el-col>
                                    </span>
                                </el-row>
                                <el-row style="margin-top:10px;">
                                    <div>
                                        <el-col :span="2">
                                            <el-form-item label="附件: " :label-width="longFormLabelWidth">

                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    :disabled="notWritter()||mode==SIGN_MODE"
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
                                                    :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedFile)"
                                                    @click="onAttachedDownload(lxdForm.contactForm)">下载
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedFile)||notWritter()||mode==SIGN_MODE"
                                                    @click="handAttachedDelete(lxdForm.contactForm)">删除
                                            </el-button>
                                        </el-col>
                                    </div>
                                </el-row>
                                <el-row>
                                    <el-col :span="20">
                                        <el-form-item label="" :label-width="longFormLabelWidth">
                                            <span style="float:left;">
                                                {{removeAbsolutePath(lxdForm.contactForm.attachedFile)}}
                                            </span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-card>

                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    联系单审批
                                </div>
                                <el-row>
                                    <el-col :span="24">
                                        <el-table
                                                border
                                                :row-class-name="tableRowClassName"
                                                :data="lxdForm.contactSign.signContent"
                                                style="margin-bottom: 20px;margin-top: 20px;">
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
                                                <template slot-scope="scope" >
                                                    <span style="font-size: 14px; font-weight: bold">{{scope.row.user}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" width="180" label="日期"  >
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.date != null && scope.row.date != "" ? formatDate(scope.row.date) : "未提交" }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="意见" >
                                                <template slot-scope="scope" >
                                                    <el-input
                                                            type="textarea"
                                                            clearable
                                                            :disabled="signDisable(scope.row)"
                                                            v-model="scope.row.comment"
                                                            auto-complete="off"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="操作" width="220">
                                                <template scope="scope" >
                                                    <el-tooltip placement="top" content="同意"  v-show="isRowHasPermissionToShow(scope.row)">
                                                        <el-button
                                                                :disabled="signDisable(scope.row)"
                                                                type="success"
                                                                icon="el-icon-check"
                                                                size="mini"
                                                                @click="handleSubmitSign(scope.row)"
                                                        > </el-button>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" content="驳回"  v-show="isRowHasPermissionToShow(scope.row)">
                                                        <el-button
                                                                :disabled="signDisable(scope.row)"
                                                                type="danger"
                                                                icon="el-icon-close"
                                                                size="mini"
                                                                @click="handleRejectSign(scope.row)"
                                                        > </el-button>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" content="是否启用该流程审核"
                                                                v-show="(mode == ADD_MODE||mode==EDIT_MODE) && isRowHasPermissionToShow(scope.row)">
                                                        <el-switch
                                                                v-show="!notWritter()"
                                                                v-model="scope.row.shenHeEnabled"
                                                                active-color="#13ce66"
                                                                inactive-color="gray">
                                                        </el-switch>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </el-card>

                            <!--联系单的落实-->
                            <el-card class="box-card" style="margin: 25px">
                                <div style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 20px;">
                                    联系单落实跟踪
                                </div>
                                <el-row>

                                    <el-col :span="6"  >
                                        <el-form-item label="指定落实人员:" :label-width="longFormLabelWidth" >
                                            <el-select
                                                    :disabled="fulfillNotWrite()  "
                                                    v-model="lxdForm.contactFulfill.fulfillMan"
                                                    clearable
                                                    filterable >
                                                <el-option
                                                        v-for="item in fulfillManList"
                                                        :label="item.account"
                                                        :value="item.account">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="20"  >
                                        <el-form-item label="意见/信息：" :label-width="longFormLabelWidth" >
                                            <el-input type="textarea" v-model="lxdForm.contactFulfill.message"
                                                      :rows="5"  :disabled="fulfillNotWrite()">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <!--<el-col :span="6"  v-show="true">-->
                                    <!--<el-form-item label="开始日期：" :label-width="longFormLabelWidth">-->
                                    <!--<el-date-picker-->
                                    <!--:disabled="fulfillNotWrite()"-->
                                    <!--type="date"-->
                                    <!--v-model="lxdForm.contactFulfill.createDate">-->
                                    <!--</el-date-picker>-->
                                    <!--</el-form-item>-->
                                    <!--</el-col>-->
                                    <el-col :span="6"  v-show="true" :offset = "0">
                                        <el-form-item label="期望完成日期：" :label-width="longFormLabelWidth">
                                            <el-date-picker
                                                    :disabled="fulfillNotWrite()"
                                                    type="date"
                                                    v-model="lxdForm.contactFulfill.hopeDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="20"  >
                                        <el-form-item label="反馈信息：" :label-width="longFormLabelWidth" >
                                            <el-input type="textarea" v-model="lxdForm.contactFulfill.feedback"
                                                      placeholder="落实人员填写"
                                                      :rows="5"  :disabled="fulfillFeedbackNotWrite()">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3"  >
                                        <el-form-item label="是否已完成:" :label-width="longFormLabelWidth">
                                            <el-switch
                                                    v-model="lxdForm.contactFulfill.filfullSuccess"
                                                    active-color="#13ce66"
                                                    :disabled="fulfillFeedbackNotWrite()"
                                                    inactive-color="gray">
                                            </el-switch>
                                        </el-form-item>
                                    </el-col>
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
                                        @click="onEdit('ruleForm')"
                                        icon="el-icon-check"
                                >保 存
                                </el-button>
                                <el-button
                                        v-show="isShowSubmitSign()"
                                        type="success"
                                        icon="el-icon-check"
                                >提交审核
                                </el-button>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog title="删除" :visible.sync="deleteFulfillVisible" width="30%" append-to-body>
                <span style="font-size: 22px">
                           确认要删除该落实信息吗？
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

                STR_FULFILL_STATUS_FULFILLING: CONST_STR_FULFILL_STATUS_FULFILLING,
                STR_FULFILL_STATUS_DONE: CONST_STR_FULFILL_STATUS_DONE,
                fulfillManList:[],
                fulfillStatusList: constFulfillStatusList,
                editFulfillVisible: false,
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
                    applicantPerson: '',
                    applicantDepartment: '',
                    orderNum: '',
                    queryStartTimeCreate: '',
                    queryFinishTimeCreate: '',
                    fulfillMan: '',
                    fulfillStatus: '',
                    contactFormNum: '',
                    queryStartTimeUpdate: [new Date(), new Date()], //默认查询当天,
                    queryFinishTimeUpdate: [new Date(), new Date()] //默认查询当天
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
                    contactType: [
                        { type: 'string', required: true, message: '请选择联系单类型!', trigger: 'change' }
                    ],
                    num: [
                        { type: 'string', required: true, message: '请填写联系单号!', trigger: 'change' }
                    ],
                    createDate: [
                        {  type: 'date',required: true, message: '请选择申请日期!', trigger: 'change' }
                    ],
                    hopeDate: [
                        {  type: 'date',required: true, message: '请选择ECO希望完成日期!', trigger: 'change' }
                    ],
                    //后面有更新
                    orderNum: [
                        {  type: 'string',required: false, message: '请填写订单号!', trigger: 'change' }
                    ],
                    contactTitle: [
                        {  type: 'string',required: true, message: '请填写变更主题!', trigger: 'change' }
                    ],
                    //在后面有检查
//                    contactContent: [
//                        {  type: 'string',required: true, message: '请选择变更内容：!', trigger: 'change' }
//                    ]
                    //后面有更新
                    contactContentElse: [
                        {  type: 'string',required: false, message: '选择了其他变更，需填写具体内容!', trigger: 'change' }
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

                //联系单内容，包括了落实信息
                lxdForm: {
                    contactForm:{
                        id:'',
                        num:'',
                        orderNum:'',
                        contactTitle:"",
                        contactType: "",
                        applicantDepartment: "",
                        createDate:new Date(),
                        hopeDate:'',
                        applicantPerson: "",
                        status: 0,
                        contactContent: "", //工作联系单内容
                        attachedFile:"",
                        contactContentElse: "", // 选中“其他变更”时的输入
                        contactContentElseIsChecked: false, // “其他变更” 是否被选中。
                    },
                    changeItemList: [{ //变更单内容
                        id:'',
                        contactFormId:"",
                        oldInfo: "",
                        newInfo: "",
                        remarks: ""
                    }],
                    //落实单
                    contactFulfill:{
//                        id: "",
                        fulfillMan: "",
                        message: "",
                        createDate: new Date(),
                        updateDate: '',
                        hopedate: '',
                        feedback: '',
                        status:'',
                        filfullSuccess:''
                    },
                    contactSign:{
                        id:'',
                        contactFormId:'',
                        currentStep:'',
                        createTime:'',
                        signContent:[{
                            number: "",
                            roleId: "",
                            signType: "",
                            date: "",
                            user: "",
                            result: "",
                            comment: "",
                            shenHeEnabled:true,
                        }]
                    },
                },
            };
        },

        methods: {

            handleReadOnly(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '查看联系单的落实';

                this.mode = this.VIEW_MODE;
                this.selectedItem = copyObject(item);
                _this.getContactAllData(item.contactFormId);
                this.editFulfillVisible = true;
            },
            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑联系单的落实';

                this.mode = this.EDIT_MODE;
                this.selectedItem = copyObject(item);
                _this.getContactAllData(item.contactFormId);
                this.editFulfillVisible = true;
            },
            getContactAllData(formId)
            {
                console.log("aaaaaaaaa");
                $.ajax({
                    url: HOST + 'contact/form/getAllInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: {contactFormId: formId},
                    success: function (res) {
                        if (res.code == 200) {
                            res.data.contactSign.signContent=JSON.parse(res.data.contactSign.signContent);
                            _this.lxdForm=res.data;
                            if(_this.lxdForm.contactForm.contactType.indexOf("变更")>=0)//变更
                            {
                                _this.checkedChangeTypes=_this.lxdForm.contactForm.contactContent.split(",");
                                if(_this.lxdForm.contactForm.contactContentElse != "" ){
                                    _this.lxdForm.contactForm.contactContentElseIsChecked = true;
                                }
                            }

                            //成本核算员跟财务经理的意见,只给销售人员和王总看。
                            if( _this.userInfo.role.roleName != "成本核算员"
                                    && _this.userInfo.role.roleName != "财务经理"
                                    && _this.userInfo.role.roleName != "销售部经理"
                                    && _this.userInfo.role.roleName != "外贸总监"
                                    && _this.userInfo.role.roleName != "总经理"
                                    && _this.userInfo.role.roleName != "超级管理员" ){

                                //目前 signContent中有时候有roleName，少部分没有roleName只有roleId。
                                for(let i=0; i<_this.lxdForm.contactSign.signContent.length; i++) {
                                    if (_this.lxdForm.contactSign.signContent[i].roleName == '成本核算员'
                                            || _this.lxdForm.contactSign.signContent[i].roleName == '财务经理'
                                            || _this.lxdForm.contactSign.signContent[i].roleId == 13
                                            || _this.lxdForm.contactSign.signContent[i].roleId == 14) {
                                        if (_this.lxdForm.contactSign.signContent[i].comment.length != 0) {
                                            _this.lxdForm.contactSign.signContent[i].comment = "-";
                                        }
                                    }
                                }
                            }
                        } else {
                            console.log("getContactAllData:"+res.message);
                        }
                    }
                });
            },

            notWritter()
            {
                //审核开始了，不应该再修改除了审核部门之外内容，否则审核没意义。
                //驳回的话，应该允许修改。
                if(_this.lxdForm.contactSign.currentStep !="" && _this.lxdForm.contactForm.status.indexOf("联系单审核被拒") == -1 ){
                    return true;
                }

                if (this.userInfo!= null) {
                    return this.userInfo.account!=_this.lxdForm.contactForm.applicantPerson;
                }
                return true;
            },

            //是否显示 “提交审核”按钮
            isShowSubmitSign()
            {
                if(_this.mode==_this.ADD_MODE||_this.notWritter())
                {
                    return false;
                }
                if(_this.lxdForm.contactForm.status==0||_this.lxdForm.contactForm.status.indexOf("初始化")>=0)
                {
                    return true;
                }

                //驳回以后，允许再次提交
                if(_this.lxdForm.contactForm.status.indexOf("联系单审核被拒")>= 0)
                {
                    return true;
                }
                return false;
            },

            getLxdTypeLabel(type) {
                if(type == '变更') {
                    return "联络主题：";
                } else {
                    return "工作主题：";
                }
            },

            haveNoAttachedFile(fullPath){
                if (fullPath == null || fullPath == "") {
                    return true;
                } else {
                    return false;
                }
            },

            //不要显示完整路径 /opt/sinsim/output/lxdAttached/lxd_lxd1111_lxdAttached__0.xls
            removeAbsolutePath(fullPath){
                if (fullPath == null || fullPath == "") {
                    return "无附件";
                } else {
                    return fullPath.split("/")[fullPath.split("/").length - 1];
                }
            },

            //落实单的不可写
            fulfillNotWrite(){
                if(_this.lxdForm.contactFulfill.status.indexOf('落实完成') >=0 ){
                    //落实完成，所以不可改
                    return true;
                }
//                console.log("_this.lxdForm.contactFulfill.status：" + _this.lxdForm.contactFulfill.status)
                if (this.userInfo!= null) {
                    if(this.userInfo.role.id != 8 && this.userInfo.role.id != 1 ) {
                        //不是技术部经理，也不是管理员, 也不是被指定的落实人员，所以不可改
                        return true;
                    }
                }
                //其他情况，可改
                return false;
            },

            fulfillFeedbackNotWrite(){

                //允许管理员和技术部经理 修改结果
                if(this.userInfo.role.roleName.indexOf('超级管理员') >=0 || this.userInfo.role.roleName.indexOf('技术部经理') >=0){
                    return false;
                }

//                console.log("_this.lxdForm.contactFulfill.status：" + _this.lxdForm.contactFulfill.status)
                if (this.userInfo!= null) {
                    if( this.userInfo.role.id != 1 && this.userInfo.account != this.lxdForm.contactFulfill.fulfillMan) {
                        //不是管理员, 也不是被指定的落实人员，所以不可改
                        return true;
                    }
                }

                if(_this.lxdForm.contactFulfill.status.indexOf('落实完成') >=0 ){
                    //落实完成，所以不可改
                    return true;
                }
                //其他情况，可改
                return false;
            },

            isFinanceVisible() {
                if (
                        (this.userInfo != '' &&
                        (this.userInfo.role.roleName.indexOf('销售') != -1 ||
                        this.userInfo.role.roleName.indexOf('财务') != -1)) ||
                        this.userInfo.role.roleName.indexOf('总经理') != -1 ||
                        this.userInfo.role.roleName.indexOf('成本核算') != -1 ||
                        this.userInfo.role.roleName.indexOf("外贸总监") != -1 ||
                        this.userInfo.role.id == 1
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            showSaveButton(){
                if(_this.mode==_this.ADD_MODE ||_this.mode == _this.EDIT_MODE)
                {
                    return true;
                }
                //联系单的落实，需要技术部经理编辑联系单的落实信息
                if(_this.userInfo.role.id == 8 ){
                    return true;
                }

                return false;
            },

            fetchFulfillManList() {
                $.ajax({
                    url: HOST + 'user/selectUsers',
                    type: 'POST',
                    dataType: 'json',
                    data: {roleId: 27}, //设计员
                    success: function (res) {
                        if (res.code == 200) {
                            _this.fulfillManList = res.data.list;
                        }
                    }
                });
            },

            tableRowClassName({ row, rowIndex }) {
                if (row.result == SIGN_REJECT) {
                    return 'warning-row';
                }
                return '';
            },

            onEdit() {

                if(_this.lxdForm.contactFulfill.filfullSuccess == true) {
                    _this.lxdForm.contactFulfill.status = CONST_STR_FULFILL_STATUS_DONE;
                } else if(_this.lxdForm.contactFulfill.fulfillMan == null || _this.lxdForm.contactFulfill.fulfillMan == ''){
                    _this.lxdForm.contactFulfill.status = CONST_STR_FULFILL_STATUS_UN_ASSIGN;
                } else {
                    _this.lxdForm.contactFulfill.status = CONST_STR_FULFILL_STATUS_FULFILLING;
                }
                let submitData=JSON.stringify(_this.lxdForm);
                $.ajax({
                    url: HOST + 'contact/form/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonContactFormAllInfo:submitData,
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

            dialogCloseCallback() {
                _this.lxdForm={
                    contactForm:{
                        id:'',
                        num:'',
                        orderNum:'',
                        contactTitle:"",
                        contactType: "",
                        applicantDepartment: "",
                        createDate:"",
                        hopeDate:'',
                        applicantPerson: "",
                        status: 0,
                        contactContent: "", //工作联系单内容
                        attachedFile:"",
                    },
                    //落实单
                    contactFulfill:{
//                        id: "",
                        fulfillMan: "",
                        message: "",
                        createDate: new Date(),
                        updateDate: '',
                        hopedate: '',
                        feedback: '',
                        status:'',
                        filfullSuccess:''
                    },
                    changeItemList: [],
                    contactSign:{
                        id:'',
                        contactFormId:'',
                        currentStep:'',
                        createTime:'',
                        signContent:[
                        ]
                    },
                },
                        _this.searchFulfillList();//
            },


            dialogClose() {
                _this.editFulfillVisible = false;
                _this.searchFulfillList();
            },

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
                        //除了管理员和技术部经理，被指定的落实人员 能改自己的东西
                        return this.userInfo.account == row.fulfillMan;
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
                    applicantPerson: _this.filters.applicantPerson,
                    applicantDepartment:  _this.filters.applicantDepartment,
                    orderNum:  _this.filters.orderNum,
                    fulfillMan:  _this.filters.fulfillMan,
                    fulfillStatus:  _this.filters.fulfillStatus,
                    contactFormNum:  _this.filters.contactFormNum,

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
            isShowChangeContactForm: function(){//test为计算属性，调用时和调用属性一样调用test即可
                let res=_this.lxdForm.contactForm.contactType.indexOf("变更")>=0;
                _this.rules.hopeDate[0].required=res;
                _this.rules.orderNum[0].required=res;
                return  res;
            },

            isShowWorkContactForm: function(){//test为计算属性，调用时和调用属性一样调用test即可
                let res=_this.lxdForm.contactForm.contactType.indexOf("工作")>=0;
                if(res)
                { /// 这是一个workAround, 因为工作联系单里本来是不需要hopeDate
                    _this.lxdForm.contactForm.hopeDate=new Date();
                }
                return res;
            },

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
            _this.searchFulfillList();
            _this.fetchDisgnerList();
            _this.fetchFulfillManList();
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
