<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div>
            <el-row>
                <el-col :span="20">
                    <el-row type="flex" justify="left">
                        <el-col :span="2">
                            <div style="font-size: 14px;color: #909399">审核状态：</div>
                        </el-col>
                        <el-col style="text-align: left">
                            <span v-for="(item, index) in lxdStatusForFilterList">
                            <el-button
                                    size="mini"
                                    :type="item.choosed ? 'primary': '' "
                                    style="margin-left: 8px"
                                    @click="chooseCurrentStatus(index)"
                            >{{item.name}}</el-button>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="left" style="margin-top: 10px">
                        <el-col :span="2">
                            <div style="font-size: 14px; color: #909399">审核部门：</div>
                        </el-col>
                        <el-col style="text-align: left">
                            <span v-for="(item, index) in lxdSignRoleList">
                                <el-button
                                        size="mini"
                                        :type="item.choosed ? 'primary': '' "
                                        style="margin-left: 8px"
                                        :disabled="!filterIsSigning()"
                                        @click="chooseCurrentSignStep(index)"
                                >{{item.name}}</el-button>
                          </span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="2" :offset="2">
                    <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">联系单</el-button>
                </el-col>
            </el-row>
            <el-col class="well well-lg" style="background-color: white; margin-top: 10px">
                <el-row>
                    <el-col>
                        <el-form :model="filters" label-position="right" label-width="80px">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="联系单号:">
                                        <el-input v-model="filters.num" placeholder="联系单号" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="主题:">
                                        <el-input v-model="filters.contactTitle" placeholder="主题" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="发起人:">
                                        <el-input v-model="filters.applicantPerson" placeholder="发起人"
                                                  auto-complete="off" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="类型:">
                                        <el-input v-model="filters.contactType" placeholder="类型" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="订单号:">
                                        <el-input v-model="filters.orderNum" placeholder="订单号" auto-complete="off"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="发起部门:">
                                        <el-input v-model="filters.applicantDepartment" placeholder="发起部门"
                                                  auto-complete="off" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="创建日期:">
                                        <el-date-picker v-model="filters.selectDate" type="daterange" align="left"
                                                        unlink-panels range-separator="—" start-placeholder="开始日期"
                                                        end-placeholder="结束日期"
                                                        :picker-options="pickerOptions"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" :offset="5">
                                    <el-button icon="el-icon-search" size="normal"
                                               style="float: right; margin-right: -12px" type="primary" @click="search">
                                        查询
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table element-loading-text="获取数据中..." :data="tableData" border show-overflow-tooltip="true"
                                  style="width: 100%;">
                            <el-table-column align="center" width="50" label="序号">
                                <template scope="scope">{{scope.$index+startRow}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="55" prop="contactType"
                                             label="类型"></el-table-column>
                            <el-table-column align="center" label="订单号" min-width="110">
                                <template scope="scope">
                                    <div   v-if="isBianGengLxd(scope.row)" style="font-weight: bold;">
                                        {{scope.row.orderNum}}
                                    </div>
                                    <div v-else>
                                        N/A
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="联系单号" min-width="100">
                                <template scope="scope">
                                    <div v-on:click="handleSign(scope.$index, scope.row)" style="font-weight: bold;"
                                         class="btn btn-link">
                                        {{scope.row.num}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="变更主题" min-width="175">
                                <template scope="scope">
                                    <div style="font-weight: bold;">
                                        {{scope.row.contactTitle}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="applicantDepartment" label="发起部门"></el-table-column>
                            <el-table-column align="center" prop="applicantPerson" label="发起人"></el-table-column>
                            <el-table-column align="center" prop="status" label="审核状态">
                                <template scope="scope">
                                    <div :class="scope.row.status|filterStatusStyle">
                                        {{scope.row.status}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="currentStep" label="审核阶段"></el-table-column>
                            <el-table-column align="center" prop="createDate" width="95" label="创建时间">
                                <template scope="scope">
                                    <div>
                                        {{formatDate(scope.row.createDate)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="95" label="更新时间">
                                <template scope="scope">
                                    <div>
                                        {{scope.row.updateTime != null ? formatDate(scope.row.updateTime) : "/"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="240">
                                <template scope="scope">
                                    <el-tooltip placement="top">
                                        <div slot="content">审核</div>
                                        <el-button size="mini" type="success"
                                                icon="el-icon-check"
                                                v-show="userInfo.role.roleName !='销售员'"
                                                @click="handleSign(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">编辑</div>
                                        <el-button
                                                v-show="!notWritterRow(scope.row)"
                                                size="mini" type="primary" icon="el-icon-edit"
                                                @click="handleEdit(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">下载</div>
                                        <el-button
                                                size="mini" type="info" icon="el-icon-download"
                                                @click="handleDownload(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">删除</div>
                                        <el-button
                                                v-show="!notWritterRow(scope.row)"
                                                size="mini" type="danger" icon="el-icon-delete"
                                                @click="handleDelete(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
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
                                    :total="totalNum"
                            ></el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </div>
        <el-dialog :visible.sync="addLxdVisible" fullscreen @close="dialogCloseCallback()">
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
                                        @click="onSubmitToSign"
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
                                                                && (lxdForm.contactForm.orderNum != null)
                                                                && (lxdForm.contactForm.orderNum.length != 0)">
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
                                                    :disabled="notWritterForAttachedFile()||mode==SIGN_MODE"
                                                    size="small"
                                                    type="success"
                                                    style="float:left; margin-left:5px;"
                                                    icon="el-icon-upload"
                                                    @click="onUpload(1)">上传
                                            </el-button>
                                        </el-col>
                                        <el-col :span="2" style="margin-left:20px;">
                                            <el-button
                                                    size="small"
                                                    type="success"
                                                    icon="el-icon-download"
                                                    :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedFile)"
                                                    @click="onAttachedDownload(lxdForm.contactForm, LXD_ATTACHED_FILE_BY_CREATER)">下载
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

                            <el-row style="margin-top:10px;">
                                <div>
                                    <el-col :span="2">
                                        <el-form-item label="签核附件: " :label-width="longFormLabelWidth">
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="margin-left:20px;">
                                        <el-button
                                                :disabled="notWritterForAttachedFileDuringSign() "
                                                size="small"
                                                type="success"
                                                style="float:left; margin-left:5px;"
                                                icon="el-icon-upload"
                                                @click="onUpload(2)">上传
                                        </el-button>
                                    </el-col>
                                    <el-col :span="2" style="margin-left:20px;">
                                        <el-button
                                                size="small"
                                                type="success"
                                                icon="el-icon-download"
                                                :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedDuringSign)"
                                                @click="onAttachedDownload(lxdForm.contactForm, LXD_ATTACHED_FILE_DURING_SIGN)">下载
                                        </el-button>
                                    </el-col>
                                    <el-col :span="2" style="margin-left:20px;">
                                        <el-button
                                                size="small"
                                                type="danger"
                                                icon="el-icon-delete"
                                                :disabled=" haveNoAttachedFile(lxdForm.contactForm.attachedDuringSign)||notWritter()||mode==SIGN_MODE"
                                                @click="handAttachedDelete(lxdForm.contactForm)">删除
                                        </el-button>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-form-item label="" :label-width="formLabelWidth">
                                            <span style="float:left;">
                                                上传人：{{(lxdForm.contactForm.attachedDuringSignMan)}}
                                            </span>
                                        </el-form-item>
                                    </el-col>
                                    <!--<el-col :span="5">-->
                                        <!--<el-form-item label="(签核过程中添加)" >-->
                                        <!--</el-form-item>-->
                                    <!--</el-col>-->
                                </div>
                            </el-row>
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item label="" :label-width="longFormLabelWidth">
                                            <span style="float:left;">
                                                {{removeAbsolutePath(lxdForm.contactForm.attachedDuringSign)}}
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
                                                  :rows="5"  :disabled="fulfillNotWrite()">
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
                                                    :disabled="fulfillNotWrite()"
                                                    inactive-color="gray">
                                            </el-switch>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-form>
                    <el-dialog title="提示" :visible.sync="rejectSignResultVisible" width="30%" append-to-body>
                        <span style="font-size: 15px">确认驳回该联系单吗？</span>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="rejectSignResultVisible = false" icon="el-icon-back">取 消</el-button>
                        <el-button type="success" @click="onRejectSign" icon="el-icon-check">确 定</el-button>
                        </span>
                    </el-dialog>
                    <el-dialog title="提示" :visible.sync="submitSignResultVisible" width="30%" append-to-body>
                        <span style="font-size: 15px">确认批准该联系单吗？</span>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="submitSignResultVisible = false" icon="el-icon-back">取 消</el-button>
                        <el-button type="success" @click="onSubmitSign" icon="el-icon-check">确 定</el-button>
                        </span>
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

                    <!--使用新的dialog,而非共用，可以省掉非常多的逻辑！ 还是不用。。。 -->

                    <el-dialog title="删除附件" :visible.sync="attachedDeleteConfirmVisible" width="30%" append-to-body>
                        <span style="font-size: 22px">
                            确认要删除该附件吗？
                        </span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="attachedDeleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
                            <el-button type="primary" @click="onConfirmDeleteAttached" icon="el-icon-check">确 定</el-button>
                        </span>
                    </el-dialog>

                    <el-form>
                        <div>
                            <el-button @click="dialogClose()" icon="el-icon-back" type="info" offset="120">关 闭
                            </el-button>
                            <el-button
                                    v-show="showSaveButton()"
                                    type="primary"
                                    @click="onAddOrEdit('ruleForm')"
                                    icon="el-icon-check"
                            >保 存
                            </el-button>
                               <el-button
                                    v-show="isShowSubmitSign()"
                                    type="success"
                                    @click="onSubmitToSign()"
                                    icon="el-icon-check"
                            >提交审核
                            </el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="删除" :visible.sync="deleteConfirmVisible" width="30%" append-to-body>
                        <span style="font-size: 22px">
                            确认要删除编号为[
                            <b style="color: #F56C6C;font-weight: bold">{{selectedItem.num}}</b> ]的联系单吗？
                        </span>
            <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
                            <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
                        </span>
        </el-dialog>
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
    import Tinymce from '../Tinymce/index.vue';
    import {ConfigData} from '../../config/dataconfig';

    var _this;

    export default {
        name: 'contact_sign',
        components: {
            Tinymce,
            ConfigData
        },
        data() {
            _this = this;
            return {
                fulfillStatusList: constFulfillStatusList,
                LXD_ATTACHED_FILE_BY_CREATER: STRING_LXD_ATTACHED_FILE_BY_CREATER,
                LXD_ATTACHED_FILE_DURING_SIGN: STRING_LXD_ATTACHED_FILE_DURING_SIGN,

                editUrl: HOST + 'contact/form/update',
                deleteUrl: HOST + 'contact/form/delete',
                isError: false,
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
                attachedDeleteConfirmVisible: false,
                SIGN_MODE: 1,
                ADD_MODE: 2,
                EDIT_MODE: 3,
                tableData: [],
                //分页
                totalNum: 1,
                pageSize: EveryPageNum, //每一页的num
                currentPage: 1,
                startRow: 1,

                //增加对话框
                addLxdVisible: false,
                signProcesses: [],
                userInfo: '',

                
                //联系单内容
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
                        attachedDuringSign:"",      //签核过程中的附件
                        attachedDuringSignMan:'',   //签核过程中，上传/更新了附件的人
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
                fulfillManList:[],
                normalSignProcess:[],
                defaultSignProcess:[],

                formLabelWidth: '100px',
                longFormLabelWidth: '140px',

                mode: 1,

                dialogTitle: '联系单',
                editContract: '',

                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                rejectContractSignResultVisible: false,
                filters: {
                    contactType: '',
                    orderNum: '',
                    //默认审核中
                    roleName:'',
                    status:1,
                    applicantDepartment: '',
                    applicantPerson: '',
                    selectDate: ''
                },

                allRoles: [],

                timeout: null,

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                pickerOptions2: {
                    disabledDate(time) {
                        if(time==null)
                        {
                            return false;
                        }
                        return time.getTime() < Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }]
                },
                lxdSignRoleList: [],
                lxdStatusForFilterList: [],

                lxdStatusList: LxdStatusList,

                lxdTypes: ["变更", "工作"],
                //变更联系单的变更类型(变更内容)
                lxdChangeTypes: [
                    "设计变更","材料变更","工艺变更","模具设备", "工艺夹具","制造场所", "新供应商","包装运输","检验方法","其他变更，需说明", 
                ],
                checkedChangeTypes:[],
                uploadDialogVisible:false,

                //是哪种附件： 创建人的附件或签核过程的附件
                attachedFileType:'',
                fileLists:[],
                uploadForm:{},
                uploadURL: HOST + "contact/form/uploadAttachedFile",
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
                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                signContentObj:{},
                allOrderList:[],
                //查看订单页面
                addContractVisible:false,

                //订单页面, 包括了订单细节
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

                orderChangeRecord: "",
                orderSplitRecord: "" ,

                userInfo: '',

                //给后端保存文件命名用。
                uploadFileType: '',
            };

        },
        methods: {

            fetchFulfillManList() {
                $.ajax({
                    url: HOST + 'user/selectUsers',
                    type: 'POST',
                    dataType: 'json',
                    data: {roleId: 10}, //技术员
                    success: function (res) {
                        if (res.code == 200) {
                            _this.fulfillManList = res.data.list;
                        }
                    }
                });
            },
            handleDownload(index, item) {
                $.ajax({
                    url: HOST + 'contact/form/buildLxdExcel',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        contact_form_id: item.id, 
                        account: _this.userInfo.account
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            var downLoadURL = DOWNLOADPATH_LXD + res.data;
                            _this.downloadFile(downLoadURL);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },

            resetStatus(){
               _this.checkedChangeTypes=[];
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
                formData.append("lxdNum", _this.lxdForm.contactForm.num);
                formData.append("type", _this.uploadFileType);
                formData.append("uploadMan", _this.userInfo.account);


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
                            if(_this.uploadFileType == "联系单附件") {
                                _this.lxdForm.contactForm.attachedFile=res.data;
                            }  else if(_this.uploadFileType == "联系单签核过程附件") {
                                _this.lxdForm.contactForm.attachedDuringSignMan = _this.userInfo.account;
                                _this.lxdForm.contactForm.attachedDuringSign=res.data;
                            }

                            showMessage(_this, "附件上传/更新成功！", 1);

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

            onAttachedDownload(item, theFlag)
            {
                _this.selectedItem = copyObject(item);
                $.ajax({
                    url: HOST + "contact/form/getLxdAttachedFile",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        contact_form_id: _this.selectedItem.id,
                        flag: theFlag, // 签核过程中上传的附件
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
            
            onConfirmDeleteAttached(item){
                _this.attachedDeleteConfirmVisible = false;
                if( _this.attachedFileType.indexOf(_this.LXD_ATTACHED_FILE_BY_CREATER) >= 0){
                    _this.lxdForm.contactForm.attachedFile = "";
                } else if ( _this.attachedFileType.indexOf(_this.LXD_ATTACHED_FILE_DURING_SIGN) >= 0){
                    _this.lxdForm.contactForm.attachedDuringSign = "";
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
                            if( _this.attachedFileType.indexOf(_this.LXD_ATTACHED_FILE_BY_CREATER) >= 0) {
                                showMessage(_this, '附件删除成功', 1);
                            } else if ( _this.attachedFileType.indexOf(_this.LXD_ATTACHED_FILE_DURING_SIGN) >= 0){
                                showMessage(_this, '签核附件删除成功', 1);
                            }
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

            downloadFile(url)
            {
                console.log("downloadFile url: " + url);
                var form = $("<form>");
                form.attr("style", "display:none");
                form.attr("method", "get");
                form.attr("action", url);
                $("body").append(form);
                form.submit();
            },

            isHasPermissionToSign()
            {
                let res=false;
                
                for(let i=0;i<_this.lxdForm.contactSign.signContent.length;i++) 
                {
                    if(_this.lxdForm.contactSign.signContent[i].roleId== this.userInfo.role.id)
                    {
                        res=true;
                        break;
                    }
                }
                return res;
            },

            isRowHasPermissionToShow(row)
            {
                if(_this.mode==_this.SIGN_MODE)
                {
                    if(row.shenHeEnabled)
                    {
                        return row.roleId== this.userInfo.role.id;
                    }
                    return false;
                }
                else{ //非签核模式，即新增和编辑模式都允许显示
                    return true;
                }
                
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

            showSaveButton(){
                if(_this.mode==_this.ADD_MODE ||_this.mode == _this.EDIT_MODE)
                {
                    return true;
                }
                //联系单的落实，需要技术部经理编辑联系单的落实信息
                if(_this.userInfo.role.id == 8){
                  return true;
                }

                return false;
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

            //落实单的不可写
            fulfillNotWrite(){
                if(_this.lxdForm.contactFulfill.status.indexOf('落实完成') >=0 ){
                    //落实完成，所以不可改
                    return true;
                }
//                console.log("_this.lxdForm.contactFulfill.status：" + _this.lxdForm.contactFulfill.status)
                if (this.userInfo!= null) {
                    if(this.userInfo.role.id != 8 && this.userInfo.role.id != 1) {
                        //不是技术部经理，也不是管理员，所以不可改
                        return true;
                    }
                }
                //其他情况，可改
                return false;
            },

            notWritterRow(row)
            {
              if (this.userInfo!= null) {
                    //是管理员， 允许修改，
                  if(this.userInfo.role.id == 1 ){
                      return false;
                  } else {
                      //不是管理员， 就看登录账号是否等于联系单申请者
                      return this.userInfo.account != row.applicantPerson;
                  }
                }
                return true;
            },

            notWritterForAttachedFile()
            {
                //审核开始了，不应该再修改除了审核部门之外内容，否则审核没意义。--> 允许改附件
                //驳回的话，应该允许修改。
//                if(_this.lxdForm.contactSign.currentStep !="" && _this.lxdForm.contactForm.status.indexOf("联系单审核被拒") == -1 ){
//                    return true;
//                }

                //审核完成了就不要修改了。
                 if(_this.lxdForm.contactSign.currentStep.indexOf("签核完成") >=0 ){
                     return true;
                }

                if (this.userInfo!= null) {
                    return this.userInfo.account!=_this.lxdForm.contactForm.applicantPerson;
                }
                return true;
            },

            notWritterForAttachedFileDuringSign()
            {
                //审核没有开始 则不允许上传，开始之后，无论是谁都可以
                if(_this.lxdForm.contactSign.currentStep ==""  ){
                    return true;
                }

                return false;
            },

            onUpload(type)
            {
                _this.fileLists = [];

                if(type == 1) {
                    _this.uploadFileType = "联系单附件";
                } else if(type == 2) {
                    _this.uploadFileType = "联系单签核过程附件";
                } else {
                    _this.uploadFileType = "其他";
                }
                _this.uploadDialogVisible = true;
            },

            addChangeItem() {
                _this.lxdForm.changeItemList.push({
                    id:'',
                    contactFormId:"",
                    oldInfo: '',
                    newInfo: '',
                    remarks: ''
                });
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format('yyyy-MM-dd');
            },
            filterContactStatus(value) {
                let result = '';
                for (let i = 0; i < _this.lxdStatusList.length; i++) {
                    if (_this.lxdStatusList[i].value == value) {
                        result = _this.lxdStatusList[i].name;
                        break;
                    }
                }

                return result;
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.selectContacts();
            },

            search() {
                this.selectContacts();
            },
            selectContacts() {
                var condition = {
                    contactNum:_this.filters.num,
                    contactTitle: _this.filters.contactTitle,
                    contactType: _this.filters.contactType,
                    orderNum: _this.filters.orderNum,
                    applicantDepartment: '',
                    applicantPerson: _this.filters.applicantPerson,
                    status:_this.filters.status,
                    currentStep:_this.filters.roleName,
                    queryStartTime: '',
                    queryFinishTime: '',
                    isFuzzy:true,
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

//                if(_this.userInfo.role.roleName == "销售部经理") {
//                    condition.applicantDepartment = _this.userInfo.marketGroupName;
//                } else {
//                    condition.applicantDepartment = '';
//                }

                condition.applicantDepartment = _this.filters.applicantDepartment;
                $.ajax({
                    url: HOST + 'contact/form/selectContacts',
                    type: 'POST',
                    dataType: 'json',
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
            tableRowClassName({ row, rowIndex }) {
                if (row.result == SIGN_REJECT) {
                  return 'warning-row';
                }
                return '';
            },

            handleAdd() {
                this.dialogTitle = '新增联系单';
                _this.mode = this.ADD_MODE;
                _this.lxdForm.contactForm.num = this.createLxdNum();

//                //销售部要具体分开，所以用 marketGroupName
//                if(this.userInfo.role.roleName == "销售部经理" || this.userInfo.role.roleName == "销售员") {
//
//                    _this.lxdForm.contactForm.applicantDepartment = this.userInfo.marketGroupName;// this.userInfo.role.roleName;
//                } else {
//                    _this.lxdForm.contactForm.applicantDepartment = this.userInfo.role.roleName;
//                }
                ///2020-0303 销售组 改为 部门，代码里名称不改。
                _this.lxdForm.contactForm.applicantDepartment = this.userInfo.marketGroupName;
                _this.lxdForm.contactForm.applicantPerson = this.userInfo.account;
                _this.lxdForm.contactForm.contactType = _this.lxdTypes[0];
                //_this.lxdForm.contactForm.createDate = new Date().format('yyyy-MM-dd hh:mm:ss');
                _this.lxdForm.changeItemList=[];
                _this.lxdForm.contactSign.signContent=[];
                for(let i=0;i<_this.defaultSignProcess.length;i++)
                {
                    let item={
                        shenHeEnabled:true,
                        signType: "",
                        date: "",
                        user: "",
                        result: "",
                        comment: "",
                    };
                    Object.assign(item,_this.defaultSignProcess[i]);
                    item.roleName=_this.getRoleNameById(item.roleId);
                    _this.lxdForm.contactSign.signContent.push(item);
                }
                this.addLxdVisible = true;
                _this.mode = _this.ADD_MODE;

                this.resetStatus();
            },
//            综合管理部 -- 综
//            销售服务部 -- 售
//            研发部   -- 研
//            财务部   -- 财
//            总经办   -- 总
//            人事部   -- 人
//            品质部   -- 品
//            仓储部   -- 仓
//            采购部   -- 采
//            计划部   -- 计
//            技术部   -- 技
//            生产部   -- 生
//            内贸部   -- 内
//            外贸一部  -- 外1
//            外贸二部  -- 外2
            createLxdNum(){
                let department = "";
                switch (this.userInfo.marketGroupName) {
                    case "综合管理部":
                        department = "综";
                        break;
                    case "销售服务部":
                        department = "售";
                        break;
                    case "研发部":
                        department = "研";
                        break;
                    case "财务部":
                        department = "财";
                        break;
                    case "总经办":
                        department = "总";
                        break;
                    case "人事部":
                        department = "人";
                        break;

                    case "品质部":
                        department = "品";
                        break;

                    case "仓储部":
                        department = "仓";
                        break;

                    case "采购部":
                        department = "采";
                        break;

                    case "计划部":
                        department = "计";
                        break;

                    case "技术部":
                        department = "技";
                        break;
                    case "生产部":
                        department = "生";
                        break;
                    case "内贸部":
                        department = "内";
                        break;

                    case "外贸一部":
                        department = "外1";
                        break;
                    case "外贸二部":
                        department = "外2";
                        break;

                    default:
                        department = "其";
                        break;

                }
                //流水号： 部门和年份为单位 比如 外1-20-111 表示 外贸一部 2020年 第111个联系单
                //为允许多个联系单同时在编辑，把流水号后端放在生成。也避免了点击了新建联系单但是又没保存的情况
                //部门代表字 + 年份（2位） + 部门内部流水号
               return  department + "-" + new Date().format('yy') + "-" + "xxx";
            },

            handleSign(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '签核联系单';
                this.mode = this.SIGN_MODE;
                this.selectedItem = copyObject(item);
                _this.fetchLxdData(item.id);
                this.addLxdVisible = true;
            },

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑联系单';

                this.mode = this.EDIT_MODE;
                this.selectedItem = copyObject(item);
                _this.fetchLxdData(item.id);
                this.addLxdVisible = true;
            },

            handleDelete(index, item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.deleteConfirmVisible = true;
                }
            },

            // 附件删除
            handAttachedDelete(item) {
                this.selectedItem = copyObject(item);
                if (this.selectedItem) {
                    _this.attachedDeleteConfirmVisible = true;
                }
            },

            changeUIMode()
            {
                _this.isError = false;
                _this.errorMsg = '';
                if(_this.mode == _this.EDIT_MODE)
                {
                    _this.dialogTitle = '编辑联系单';
                }else if(_this.mode == _this.SIGN_MODE)
                {
                    _this.dialogTitle = '签核联系单';
                }else{
                    _this.dialogTitle = '新增联系单';
                }
            },

            onDeleteChangeItem(item) {
                for (var i = 0; i < _this.lxdForm.changeItemList.length; i++) {
                    if (_this.lxdForm.changeItemList[i]== item) {
                        _this.lxdForm.changeItemList.splice(i, 1);
                        break;
                    }
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
                            _this.selectContacts();
                            showMessage(_this, '删除联系单成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
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
                        attachedDuringSign:"",      //签核过程中的附件
                        attachedDuringSignMan:"",
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
                _this.selectContacts();
            },

            onAddOrEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    //在此检查变更内容
                    _this.isError = this.validContactContent();
                    if (valid) {
                        if (_this.isError) {
                            showMessage(_this, _this.errorMsg, 0);
                        } else {

                            if (_this.mode == _this.ADD_MODE) {
                                _this.onAdd();
                            }
                            // 允许技术部经理在旧联系单上指定落实信息
                            else if (_this.mode == _this.EDIT_MODE
                                    || (_this.mode == _this.SIGN_MODE && _this.userInfo.role.roleName == '技术部经理' )) {
                                _this.onEdit();
                            }
                        }
                    } else {
                        console.log('提交的表单有问题，error submit!!');
                        showMessage(_this, _this.errorMsg, 0);
                        return false;
                    }
                });
              
            },

            validContactContent(){
                var iserror = false;
                if(_this.lxdForm.contactForm.contactType.indexOf("变更")>=0)//变更
                {
                    _this.lxdForm.contactForm.contactContent = _this.getLxdChangeTypes();
                }

                //给用户弹框提示信息
                if(_this.lxdForm.contactForm.contactType.indexOf("变更")>=0)//类型：变更联系单
                { ///只要有任意一个为空都会提示
                    if(_this.lxdForm.contactForm.createDate == null || _this.lxdForm.contactForm.createDate.length ==0 ){
                        iserror = true;
                        this.errorMsg = '申请日期不能为空';
                    } else if(_this.lxdForm.contactForm.hopeDate == null || _this.lxdForm.contactForm.hopeDate.length ==0){
                        iserror = true;
                        this.errorMsg = 'ECO希望日期不能为空';
                    } else if(_this.lxdForm.contactForm.orderNum == null || _this.lxdForm.contactForm.orderNum.length ==0){
                        iserror = true;
                        this.errorMsg = '订单号不能为空';
                    } else if(_this.lxdForm.contactForm.contactTitle == null || _this.lxdForm.contactForm.contactTitle.length ==0){
                        iserror = true;
                        this.errorMsg = '联络主题不能为空';
                    } else if(_this.lxdForm.contactForm.contactContent == null || _this.lxdForm.contactForm.contactContent.length ==0){
                        iserror = true;
                        this.errorMsg = '变更内容不能为空';
                    }

                }
                else if (_this.lxdForm.contactForm.contactType.indexOf("工作")>=0)//类型： 工作联系单
                {
                    if(_this.lxdForm.contactForm.createDate == null || _this.lxdForm.contactForm.createDate.length == 0){
                        iserror = true;
                        this.errorMsg = '申请日期不能为空';
                    } else if(_this.lxdForm.contactForm.contactTitle == null || _this.lxdForm.contactForm.contactTitle.length == 0 ){
                        iserror = true;
                        this.errorMsg = '联络主题不能为空';
                    } else if(_this.lxdForm.contactForm.contactContent == null || _this.lxdForm.contactForm.contactContent.length == 0 ){
                        iserror = true;
                        this.errorMsg = '变更内容不能为空';
                    }
                }
                return iserror;
            },

            onAdd()
            {
                let submitData=JSON.stringify(_this.lxdForm);
                $.ajax({
                    url: HOST + 'contact/form/add',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        jsonContactFormAllInfo:submitData,
                    },
                    success: function (res) {
                        _this.isError = res.code != 200;
                        if (!_this.isError) {
                            //_this.addLxdVisible = false;
                            showMessage(_this, '添加成功', 1);
                            //新需求:赋值主键ID,UI不关闭，继续可编辑，变成更新页面
                            _this.lxdForm.contactForm.id = res.data; 
                            _this.mode = _this.EDIT_MODE;  
                            _this.changeUIMode();  
                            _this.fetchLxdData(res.data);  
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

            //组建变更内容的类型，用逗号分隔
            getLxdChangeTypes(){
                if(_this.checkedChangeTypes==null||_this.checkedChangeTypes.length==0)
                {
                    return "";
                }
                //内容之间 用逗号隔开
                return _this.checkedChangeTypes.join(",");
            },

            onEdit() {
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

            signDisable(row) {
                //超级管理员可以操作，在某些情况下需要由管理员来改签核意见等。
                if (_this.userInfo.role.id == 1) {
                    return false;
                }
                if(_this.mode != _this.SIGN_MODE)
                {
                    return true;
                }

                //轮到当前角色审核， 且当前联系单属于“审核中”、登陆的用户有权限签核 并且合同currentStep处于属于该角色签核
                if (row.roleId == _this.userInfo.role.id
                        && _this.lxdForm.contactForm.status.indexOf("审核中")>=0
                        && row.shenHeEnabled
                        && _this.lxdForm.contactSign.currentStep == _this.userInfo.role.roleName
                ) {
                   return false;
                } else {
                    return true;
                }
            },

            //提交审核按钮
            onSubmitToSign()
            {
                $.ajax({
                    url: HOST + 'contact/form/startSign',
                    type: 'POST',
                    dataType: 'json',
                    data: { lxdId: _this.lxdForm.contactForm.id },
                    success: function(res) {
                        if (res.code == 200) {
                            showMessage(_this, '提交审核成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                        _this.addLxdVisible = false;
                    }
                });
            },

            //同意的“确认”按钮
            onSubmitSign()
            {
                if (_this.signContentObj.comment == null || _this.signContentObj.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                    return;
                } 
                _this.signContentObj.result = SIGN_APPROVE;
                for(let i=0;i<_this.lxdForm.contactSign.signContent.length;i++)
                {
                    if(_this.lxdForm.contactSign.signContent[i].number==_this.signContentObj.number)
                    {
                        _this.lxdForm.contactSign.signContent[i]=_this.signContentObj;
                        break;
                    }
                }
                $.ajax({
                    url: HOST + 'contact/sign/update',
                    type: 'POST',
                    dataType: 'json',
                    data: { contactSign: JSON.stringify(_this.lxdForm.contactSign) },
                    success: function(res) {
                        if (res.code == 200) {
                            showMessage(_this, '提交审核成功', 1);
                        } else {
                        showMessage(_this, res.message, 0);
                        }
                        _this.submitSignResultVisible = false;
                    }
                });
            },

            // “同意”按钮
            handleSubmitSign(item) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    this.submitSignResultVisible = true;
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    _this.signContentObj=item;
                }
            },

            handleRejectSign(item) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    this.rejectSignResultVisible = true;
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    _this.signContentObj=item;
                }
            },

            onRejectSign() {
                if (_this.signContentObj.comment == null || _this.signContentObj.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                    return;
                } 
                _this.signContentObj.result = SIGN_REJECT;
                for(let i=0;i<_this.lxdForm.contactSign.signContent.length;i++)
                {
                    if(_this.lxdForm.contactSign.signContent[i].number==_this.signContentObj.number)
                    {
                        _this.lxdForm.contactSign.signContent[i]=_this.signContentObj;
                        break;
                    }
                }
                //准备好数据，提交服务器
                $.ajax({
                    url: HOST + 'contact/sign/update',
                    type: 'POST',
                    dataType: 'json',
                    data: { contactSign: JSON.stringify(_this.lxdForm.contactSign) },
                    success: function(res) {
                        if (res.code == 200) {
                            showMessage(_this, '驳回成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                        _this.rejectSignResultVisible = false;
                    }
                });
            },

            fetchLxdData(formId) {
                _this.getContactAllData(formId);
            },

            getContactAllData(formId)
            {
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

            initAllRoles() {
                $.ajax({
                    url: HOST + 'role/list',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                            _this.fetchSignProcesses();
                        }
                    }
                });
            },

            getRoleNameById(id) {
                let result = '';
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },
            //获取所有签核流程
            fetchSignProcesses() {
                $.ajax({
                    url: HOST + 'sign/process/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            let tmpList = data.data.list;
                            for (let i = 0; i < tmpList.length; i++) {
                                if (
                                    tmpList[i].processName != null &&
                                    tmpList[i].processName.indexOf('联系单') != -1
                                ) {
                                    _this.lxdSignRoleList.push({
                                        roleId: '',
                                        name: '全部',
                                        choosed:_this.filters.roleName==null||_this.filters.roleName.length==0,
                                    });
                                    var temp = JSON.parse(tmpList[i].processContent);
                                    if (temp != null && temp.length > 0) {
                                        for (let j = 0; j < temp.length; j++) {
                                            _this.lxdSignRoleList.push({
                                                roleId: temp[j].roleId,
                                                name: _this.getRoleNameById(temp[j].roleId),
                                                choosed: _this.filters.roleName == _this.getRoleNameById(temp[j].roleId)
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
                    error: function (data) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },
            chooseCurrentSignStep(index) {
                for (let i = 0; i < _this.lxdSignRoleList.length; i++) {
                    if (index == i) {
                        _this.lxdSignRoleList[i].choosed = true;
                        _this.filters.roleName = _this.getRoleNameById(
                            _this.lxdSignRoleList[i].roleId
                        );
                    } else {
                        _this.lxdSignRoleList[i].choosed = false;
                    }
                }
                _this.selectContacts();
            },
            chooseCurrentStatus(index) {
                for (let i = 0; i < _this.lxdStatusForFilterList.length; i++) {
                    if (index == i) {
                        _this.lxdStatusForFilterList[i].choosed = true;
                        _this.filters.status = _this.lxdStatusForFilterList[i].value;
                    } else {
                        _this.lxdStatusForFilterList[i].choosed = false;
                    }
                }

                if (_this.lxdStatusForFilterList[index].value != 1) {
                    for (let i = 0; i < _this.lxdSignRoleList.length; i++) {
                        if (0 == i) {
                            _this.lxdSignRoleList[i].choosed = true;
                        } else {
                            _this.lxdSignRoleList[i].choosed = false;
                        }
                    }
                    _this.filters.roleName = '';
                }
                _this.selectContacts();
            },
            filterIsSigning() {
                let result = false;
                for (
                    let i = 0; i < _this.lxdStatusForFilterList.length && !result; i++
                ) {
                    if (_this.lxdStatusForFilterList[i].choosed) {
                        if (_this.lxdStatusForFilterList[i].value == 1) {
                            result = true;
                        }
                    }
                }
                return result;
            },
            dialogClose() {
                _this.addLxdVisible = false;
                _this.selectContacts();
            },
            initSignProcesses()
            {
                $.ajax({
                    url: HOST + 'sign/process/list',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function(res) {
                      if (res.code == 200) {
                        _this.signProcesses = res.data.list;
                        for (let i = 0; i < _this.signProcesses.length; i++) {
                            if (_this.signProcesses[i].processName.indexOf('联系单') != -1) {
                                _this.normalSignProcess = JSON.parse(
                                  _this.signProcesses[i].processContent
                                );
                              for (let j = 0; j < _this.normalSignProcess.length; j++) {
                                  if (_this.normalSignProcess[j].signType == '联系单签核') {
                                          let item = _this.normalSignProcess[j];
                                          item.date = '';
                                          item.user = '';
                                          item.result = SIGN_INITIAL;
                                          item.comment = '';
                                          _this.defaultSignProcess.push(item);
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

            isBianGengLxd(row){
                //变更联系单才有订单号
                if(row.contactType.indexOf("变更")>=0){
                    return true;
                } else {
                    return false;
                }
            },

            getLxdTypeLabel(type) {
                if(type == '变更') {
                    return "联络主题：";
                } else {
                    return "工作主题：";
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

            haveNoAttachedFile(fullPath){
                if (fullPath == null || fullPath == "") {
                    return true;
                } else {
                    return false;
                }
            },

            handleCheckedChange(checkedChangeTypes, item){
                //改变的项是"其他变更，需说明"
                if (item.indexOf("其他变更，需说明") >= 0) {
                    if (checkedChangeTypes.length != 0) {
                        if(_this.lxdForm.contactForm.contactContentElseIsChecked){
                            _this.lxdForm.contactForm.contactContentElseIsChecked = false
                            _this.rules.contactContentElse[0].required = false;
                            _this.lxdForm.contactForm.contactContentElse = "";
                        } else {
                            _this.lxdForm.contactForm.contactContentElseIsChecked =true;
                            _this.rules.contactContentElse[0].required = true;
                        }
                    }
                }
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

            isFinanceVisible() {
                if (
                        (this.userInfo != '' &&
                        (this.userInfo.role.roleName.indexOf('销售') != -1 ||
                        this.userInfo.role.roleName.indexOf('财务') != -1)) ||
                        this.userInfo.role.roleName.indexOf('总经理') != -1 ||
                        this.userInfo.role.roleName.indexOf('成本核算') != -1 ||
                        this.userInfo.role.id == 1
                ) {
                    return true;
                } else {
                    return false;
                }
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
            filtlerFulfillStatus(statusStr){
                if( statusStr.indexOf('落实完成') != -1 ){
                    return 1;
                } else {
                    return 0;
                }
            },

            filterRole(id) {
                let result = '';
                for (let i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].id == id) {
                        result = _this.allRoles[i].roleName;
                        break;
                    }
                }
                return result;
            },

            filterStatusStyle(status) {
                // // 创建完成，未提交审核
                //  LXD_INITIAL = 0;
                // //审核中
                //  LXD_CHECKING = 1;
                // //审核完成
                //  LXD_CHECKING_FINISHED = 2;
                // //已驳回
                //  LXD_REJECTED = 3;
                // //已取消
                //  LXD_CANCELED = 4;

                var result = 'divStatusUnChecked';
                if (status.indexOf("完成")>=0) {
                    result = 'divOrderStatusFinished';
                } else if (status.indexOf("审核中")>=0) {
                    result = 'divOrderStatusChecking';
                }
                return result;
            },

        },
        created: function () {
            _this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(_this.userInfo)) {
                this.$router.push({path: '/login'});
                return;
            }
            _this.initSignProcesses();
            _this.filters.roleName = this.userInfo.role.roleName;
            //销售员 默认只看自己部门发起的
            if(this.userInfo.role.roleName == '销售员') {
                _this.filters.applicantDepartment = this.userInfo.marketGroupName;
            }
            //获取用户所在部门 ///2020-0303 销售组 改为 部门，代码里名称不改。
            _this.lxdForm.contactForm.applicantDepartment = this.userInfo.marketGroupName;
            if(this.userInfo.marketGroupName == null || this.userInfo.marketGroupName.length ==0){
                _this.lxdForm.contactForm.applicantDepartment = "其";
            } else {
                _this.lxdForm.contactForm.applicantDepartment = this.userInfo.marketGroupName;
            }
            _this.lxdForm.contactForm.applicantPerson = this.userInfo.account;


            this.lxdStatusForFilterList[0] = {
                name: '全部',
                value: '',
                choosed: false
            };

            for (let i = 0; i < _this.lxdStatusList.length; i++) {
                this.lxdStatusForFilterList.push({
                    name: this.lxdStatusList[i].name,
                    value: this.lxdStatusList[i].value,
                    choosed: this.lxdStatusList[i].value == 1
                });
            }
            _this.initAllRoles();
            _this.fetchFulfillManList();
        },
        mounted: function () {
            _this.selectContacts();
            _this.fetchAllOrderList();
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
     /*很关键*/
    input[type="file"] {
        display: none;
    }
    /*很关键 ??? todo: 两个附件连续上传会有问题*/
    input[type="filesDuringSign"] {
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
    /*input[type=checkbox] { */
        /*-webkit-text-fill-color: black;*/
    /*}*/

</style>
