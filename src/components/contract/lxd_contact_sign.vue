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
                            <el-table-column align="center" min-width="125" prop="contactType"
                                             label="类型"></el-table-column>
                            <el-table-column align="center" label="订单号" min-width="125">
                                <template scope="scope">
                                    <div   v-if="isBianGengLxd(scope.row)" style="font-weight: bold;">
                                        {{scope.row.orderNum}}
                                    </div>
                                    <div v-else>
                                        N/A
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="联系单号" min-width="125">
                                <template scope="scope">
                                    <div v-on:click="handleSign(scope.$index, scope.row)" style="font-weight: bold;"
                                         class="btn btn-link">
                                        {{scope.row.num}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="变更主题" min-width="125">
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
                            <el-table-column align="center" prop="createDate" width="100" label="创建时间">
                                <template scope="scope">
                                    <div>
                                        {{formatDate(scope.row.createDate)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="100" label="更新时间">
                                <template scope="scope">
                                    <div>
                                        {{scope.row.updateDate != null ? formatDate(scope.row.updateDate) : "/"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="200">
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
                                              :disabled="notWritter()||mode!=ADD_MODE" clearable
                                              placeholder="联系单号："></el-input>
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
                                    <el-col :span="6" :offset="2" v-show="isShowChangeContactForm">
                                        <el-form-item label="ECO希望日期：" prop="hopeDate" :label-width="longFormLabelWidth">
                                            <el-date-picker
                                                :disabled="notWritter()||mode==SIGN_MODE"
                                                type="date"
                                                placeholder="ECO希望完成日期"
                                                v-model="lxdForm.contactForm.hopeDate">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" style="margin-left:20px;" v-show="isShowChangeContactForm">
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
                                </el-row>

                                <el-row>
                                    <el-col  :span="20" style="margin-top:10px;">
                                        <el-form-item label="变更主题：" :label-width="longFormLabelWidth" prop="contactTitle">
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
                                        <el-form-item label="变更内容：" :label-width="longFormLabelWidth" prop="contactContent">
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
                                                <el-input v-model="item.oldInfo" placeholder="输入变更前的状态" clearable  :disabled="notWritter()||mode==SIGN_MODE"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="新状态：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.newInfo" placeholder="输入变更后的状态" clearable  :disabled="notWritter()||mode==SIGN_MODE"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="备注：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.remarks" placeholder="输入备注" clearable  :disabled="notWritter()||mode==SIGN_MODE"></el-input>
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
                                                        type="primary"
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
                    </el-form>
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
                editUrl: HOST + 'contact/form/update',
                deleteUrl: HOST + 'contact/form/delete',
                isError: false,
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
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
                    
                },
                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                signContentObj:{},
                allOrderList:[]
            };

        },
        methods: {

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
                            if (_this.lxdForm.contactForm.attachedFile != null &&_this.lxdForm.contactForm.attachedFile .length> 0) {
                                showMessage(_this, "附件更新成功！", 1);
                            }
                            else {
                                showMessage(_this, "附件上传成功！", 1);
                            }
                            _this.lxdForm.contactForm.attachedFile=res.data;
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

            onAttachedDownload(item)
            {
                _this.selectedItem = copyObject(item);
                $.ajax({
                    url: HOST + "contact/form/getLxdAttachedFile",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        contact_form_id: _this.selectedItem.id,
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

            notWritter()
            {
              if (this.userInfo!= null) {
                    return this.userInfo.account!=_this.lxdForm.contactForm.applicantPerson;
                }
                return true;
            },

            notWritterRow(row)
            {
              if (this.userInfo!= null) {
                    return this.userInfo.account!=row.applicantPerson;
                }
                return true;
            },
            onUpload()
            {
                _this.fileLists = [];
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
                    contactType: _this.filters.contactType,
                    orderNum: _this.filters.orderNum,
                    applicantDepartment: _this.filters.applicantDepartment,
                    //applicantPerson: _this.userInfo.account,
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
                _this.lxdForm.contactForm.applicantDepartment = this.userInfo.role.roleName;
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
                    if (valid) {
                        //在此检查变更内容
                        _this.isError = this.validContactContent();
                        if (_this.isError) {
                            showMessage(_this, _this.errorMsg, 0);
                        } else {

                            if (_this.mode == _this.ADD_MODE) {
                                _this.onAdd();
                            }
                            else if (_this.mode == _this.EDIT_MODE) {
                                _this.onEdit();
                            }
                        }
                    } else {
                        console.log('提交的表单有问题，error submit!!');
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
                if(_this.lxdForm.contactForm.contactContent == null || _this.lxdForm.contactForm.contactContent.length ==0){
                    iserror = true;
                    this.errorMsg = '联系单内容不能为空';
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
                            _this.addLxdVisible = false;
                            showMessage(_this, '添加成功', 1);
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
                            _this.addLxdVisible = false;
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
                //超级管理员可以操作，或者当前合同属于“签核状态”、登陆的用户有权限签核并且合同currentStep处于属于该角色签核
                //修改：不分先后，只要最后一步没有完成，都可以审核操作。
                if(_this.mode != _this.SIGN_MODE)
                {
                    return true;
                }
                // if (_this.userInfo.role.id == 1) {
                //     return false;
                // }
                //&& _this.lxdForm.contactForm.status.indexOf("审核中")>=0
                if (row.roleId == _this.userInfo.role.id&& _this.lxdForm.contactForm.status.indexOf("审核中")>=0 && row.shenHeEnabled) {
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
                                        choosed:true
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
                        } else {
                            _this.lxdForm.contactForm.contactContentElseIsChecked =true;
                        }
                    }
                }
            },
            fetchAllOrderList() {
                $.ajax({
                    url: HOST + 'machine/order/list',
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

        },
        computed: {
            isShowChangeContactForm: function(){//test为计算属性，调用时和调用属性一样调用test即可
                let res=_this.lxdForm.contactForm.contactType.indexOf("变更")>=0;
                _this.rules.hopeDate[0].required=res;
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

            //获取用户所在部门
            _this.lxdForm.contactForm.applicantDepartment = this.userInfo.role.roleName;
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

    .el-upload-list {
        height: 100px;
    }

    .el-upload__tip {

    }
</style>
