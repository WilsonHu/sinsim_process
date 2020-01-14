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
              <span v-for="(item, index) in orderStatusForFilterList">
                <el-button
                        size="mini"
                        :type="item.choosed ? 'primary': '' "
                        style="margin-left: 8px"
                        @click="chooseCurrentSignStep(index)"
                >{{item.name}}</el-button>
              </span>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="left" style="margin-top: 10px">
                        <el-col :span="2">
                            <div style="font-size: 14px; color: #909399">审核部门：</div>
                        </el-col>
                        <el-col style="text-align: left">
              <span v-for="(item, index) in normalSignRoleList">
                <el-button
                        size="mini"
                        :type="item.choosed ? 'primary': '' "
                        style="margin-left: 8px"
                        :disabled="!filterIsSigning()"
                        @click="chooseCurrentSignDepartment(index)"
                >{{item.name}}</el-button>
              </span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col
                        :span="2"
                        :offset="2"
                        v-if="userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1"
                >
                    <el-button icon="el-icon-plus" size="normal" type="danger" @click="handleAdd">合同</el-button>
                </el-col>
            </el-row>
            <el-col class="well well-lg" style="background-color: white; margin-top: 10px">
                <el-row>
                    <el-col>
                        <el-form :model="filters" label-position="right" label-width="80px">
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="合同号:">
                                        <el-input
                                                v-model="filters.contractNum"
                                                placeholder="合同号"
                                                auto-complete="off"
                                                clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="4">-->
                                <!--<el-form-item label="审核部门:">-->
                                <!--<el-select v-model="filters.roleName" clearable>-->
                                <!--<el-option-->
                                <!--v-for="item in allRoles"-->
                                <!--:key="item.id"-->
                                <!--:value="item.roleName"-->
                                <!--:label="item.roleName">-->
                                <!--</el-option>-->
                                <!--</el-select>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="4">-->
                                <!--<el-form-item label="审核状态:">-->
                                <!--<el-select v-model="filters.status" clearable>-->
                                <!--<el-option-->
                                <!--v-for="item in orderStatusList"-->
                                <!--:key="item.value"-->
                                <!--:value="item.value"-->
                                <!--:label="item.name">-->
                                <!--</el-option>-->
                                <!--</el-select>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="4">
                                    <el-form-item label="销售人员:">
                                        <el-input
                                                v-model="filters.sellman"
                                                placeholder="销售人员"
                                                auto-complete="off"
                                                clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="录单人:">
                                        <el-input
                                                v-model="filters.recordUser"
                                                placeholder="录单人"
                                                auto-complete="off"
                                                clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="创建日期:">
                                        <el-date-picker
                                                v-model="filters.selectDate"
                                                type="daterange"
                                                align="left"
                                                unlink-panels
                                                range-separator="—"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                :picker-options="pickerOptions"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" :offset="5">
                                    <el-button
                                            icon="el-icon-search"
                                            size="normal"
                                            style="float: right; margin-right: -12px"
                                            type="primary"
                                            @click="search"
                                    >查询
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table
                                element-loading-text="获取数据中..."
                                :data="tableData"
                                border
                                show-overflow-tooltip="true"
                                style="width: 100%;"
                        >
                            <el-table-column align="center" width="50" label="序号">
                                <template scope="scope">{{scope.$index+startRow}}</template>
                            </el-table-column>
                            <el-table-column align="center" prop="contractNum" min-width="85"
                                             label="合同号"></el-table-column>
                            <el-table-column align="center" min-width="110" prop="customerName"
                                             label="客户"></el-table-column>
                            <el-table-column align="center" label="订单号" min-width="145">
                                <template scope="scope">
                                    <div
                                            v-on:click="handleSign(scope.$index, scope.row)"
                                            style="font-weight: bold;"
                                            class="btn btn-link"
                                    >{{scope.row.orderNum}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="sellman" label="销售人员"></el-table-column>
                            <el-table-column align="center" prop="status" label="审核状态">
                                <template scope="scope">
                                    <div
                                            :class="scope.row.status|filterOrderStatusStyle"
                                    >{{filterContractStatus(scope.row.status)}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="recordUser" label="录单人"></el-table-column>
                            <el-table-column align="center" prop="currentStep" label="审核阶段"></el-table-column>
                            <el-table-column align="center" prop="createTime" width="100" label="创建时间">
                                <template scope="scope">
                                    <div>{{formatDate(scope.row.createTime)}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="100" label="更新时间">
                                <template scope="scope">
                                    <div>{{scope.row.updateTime != null ? formatDate(scope.row.updateTime) : ""}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="240">
                                <template scope="scope">
                                    <el-tooltip placement="top">
                                        <div slot="content">审核</div>
                                        <el-button
                                                v-show="userInfo.role.roleName !='销售员'"
                                                size="mini"
                                                type="success"
                                                icon="el-icon-check"
                                                @click="handleSign(scope.$index, scope.row)"
                                        ></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">编辑</div>
                                        <el-button
                                                v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)"
                                                size="mini"
                                                type="primary"
                                                icon="el-icon-edit"
                                                @click="handleEdit(scope.$index, scope.row)"
                                        ></el-button>
                                    </el-tooltip>

                                    <el-tooltip placement="top">
                                        <div slot="content">下载</div>
                                        <el-button
                                                size="mini"
                                                type="info"
                                                icon="el-icon-download"
                                                @click="handleDownload(scope.$index, scope.row)"
                                        ></el-button>
                                    </el-tooltip>
                                    <el-tooltip placement="top">
                                        <div slot="content">删除</div>
                                        <el-button
                                                v-show="(userInfo.role.roleName.indexOf('销售') != -1 || userInfo.role.id == 1)&&(scope.row.status>=5||scope.row.status==0)"
                                                size="mini"
                                                type="danger"
                                                icon="el-icon-delete"
                                                @click="handleDelete(scope.$index, scope.row)"
                                        ></el-button>
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
        <el-dialog :visible.sync="addContractVisible" fullscreen @close="dialogCloseCallback()">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="24">
                    <div
                            style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px"
                    >{{dialogTitle}}
                    </div>
                    <el-form class="panel-body">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item label="合同号：" :label-width="formLabelWidth">
                                    <el-input
                                            v-model="contractForm.contractNum"
                                            :readonly="changeContractContentDisable(contractForm)"
                                            placeholder="合同号"
                                            @blur="onContractInputUnfocus(contractForm.contractNum)"
                                    ></el-input>
                                </el-form-item>
                                <div style="margin-top: -15px">
                  <span
                          v-if="contractExist"
                          style="color: red; font-size: 12px;"
                  >{{contractErrorMsg}}</span>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="客户：" :label-width="formLabelWidth">
                                    <!-- <el-input v-model="contractForm.customerName"
                                          :readonly="changeContractContentDisable(contractForm)"
                                          placeholder="客户"
                  ></el-input>-->
                                    <el-autocomplete
                                            :readonly="changeContractContentDisable(contractForm)"
                                            v-model="contractForm.customerName"
                                            :fetch-suggestions="queryCustomer"
                                            placeholder="客户"
                                    ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="国内区域：" :label-width="formLabelWidth">
                                    <el-autocomplete
                                            :readonly="changeContractContentDisable(contractForm)"
                                            v-model="contractForm.domesticTradeZone"
                                            :fetch-suggestions="queryDomesticTradeZone"
                                            placeholder="国外不填"
                                    ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="销售员：" :label-width="formLabelWidth">
                                    <!-- <el-input v-model="contractForm.sellman"
                                          :readonly="changeContractContentDisable(contractForm)"
                                          placeholder="销售员"
                  ></el-input>-->
                                    <el-autocomplete
                                            :readonly="changeContractContentDisable(contractForm)"
                                            v-model="contractForm.sellman"
                                            :fetch-suggestions="querySearchAsync"
                                            placeholder="销售员"
                                            @select="handleSelect"
                                    ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="录单人：" :label-width="formLabelWidth">
                                    <el-input v-model="contractForm.recordUser" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2" :offset="21" v-if="haveInitialMachineOrder() && mode == EDIT_MODE">
                                <el-button
                                        size="normal"
                                        type="danger"
                                        icon="el-icon-check"
                                        @click="startToSign"
                                >提交审核
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>

                    <el-card class="box-card" style="margin: 25px" v-if="isFinanceVisible()">
                        <div
                                style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 10px;margin-top: 20px"
                        >合同概要信息
                        </div>
                        <el-table
                                border
                                :data="requisitionForms|filterContractInfo"
                                :row-class-name="tableRowDisabledClassName"
                        >
                            <el-table-column align="center" width="120" label="订单名">
                                <template scope="scope">
                                    <span>{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <!--<el-table-column-->
                            <!--align="center"-->
                            <!--width="125"-->
                            <!--prop="machineName"-->
                            <!--label="机器">-->
                            <!--&lt;!&ndash;<template scope="scope">&ndash;&gt;-->
                            <!--&lt;!&ndash;<span>{{scope.row.machineOrder.machineType | filterMachineTypeName}}</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</template>&ndash;&gt;-->
                            <!--</el-table-column>-->
                            <el-table-column align="center" width="250" label="机器信息">
                                <template slot-scope="scope">
                                    <span v-html="scope.row.machineInfo"></span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="machinePrice" width="100px" label="单价">
                                <template slot-scope="scope">
                  <span
                          style="font-size: 16px;font-weight: bold;color: #409EFF"
                  >{{scope.row.machinePrice}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="380px" label="装置">
                                <template slot-scope="item">
                                    <el-table border :data="item.row.machineOrder.equipment">
                                        <el-table-column label="装置名称" align="center">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.name}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="数量" align="center">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.number}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="单价" align="center">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.price}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="装置总价" align="center">
                                            <template slot-scope="scope">
                        <span
                                style="font-weight: bold;color: #409EFF"
                        >{{scope.row.price*scope.row.number}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <!--<span> {{caculateOrderEquipmentPrice(scope.row.machineOrder)}}</span>-->
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="60px" prop="machineNum" label="数量">
                                <template slot-scope="scope">
                                    <span>{{scope.row.machineNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="machinePrice" width="100px" label="单台价格">
                                <template slot-scope="scope">
                  <span
                          style="font-size: 16px;font-weight: bold;color: #409EFF"
                  >{{calculateMachineTotalPrice(scope.row.machineOrder)}}</span>
                                </template>
                            </el-table-column>
                            <!--<el-table-column-->
                            <!--align="center"-->
                            <!--width="70px"-->
                            <!--label="居间费用 / 台">-->
                            <!--<template slot-scope="scope">-->
                            <!--<span style="font-size: 16px;font-weight: bold;color: #409EFF"> {{scope.row.machineOrder.intermediaryPrice}}</span>-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                            <!--align="center"-->
                            <!--width="70px"-->
                            <!--label="居间费用总计">-->
                            <!--<template slot-scope="scope">-->
                            <!--<span style="font-size: 16px;font-weight: bold;color: #409EFF"> {{scope.row.machineOrder.intermediaryPrice * scope.row.machineNum}}</span>-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                            <!--align="center"-->
                            <!--width="70px"-->
                            <!--label="优惠价格 / 台">-->
                            <!--<template slot-scope="scope">-->
                            <!--<span style="font-size: 16px;font-weight: bold;color: #409EFF"> {{scope.row.machineOrder.discounts}}</span>-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                            <el-table-column align="center" width="100px" label="优惠总额">
                                <template slot-scope="scope">
                  <span
                          style="font-size: 16px;font-weight: bold;color: #409EFF"
                  >{{scope.row.machineOrder.discounts * scope.row.machineNum + scope.row.machineOrder.orderTotalDiscounts}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="120px" label="订单总价">
                                <template slot-scope="scope">
                  <span
                          style="font-size:20px; font-weight: bold;color: #F56C6C"
                  >{{calculateOrderTotalPrice(scope.row.machineOrder)}}</span>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-row style="margin-top: 10px" v-show="isFinanceVisible()">
                            <el-col
                                    :span="3"
                                    :offset="18"
                                    style="font-size: 16px;font-weight: bold;text-align: right;"
                            >优惠总价({{contractForm.currencyType}})：
                            </el-col>
                            <el-col
                                    :span="2"
                                    :offset="1"
                                    style="font-size: 24px;font-weight: bold; color: #409EFF"
                            >{{calculateTotalDiscount()}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 10px" v-show="isFinanceVisible()">
                            <el-col
                                    :span="3"
                                    :offset="18"
                                    style="font-size: 16px;font-weight: bold;text-align: right;"
                            >合同总价({{contractForm.currencyType}})：
                            </el-col>
                            <el-col
                                    :span="2"
                                    :offset="1"
                                    style="font-size: 28px;font-weight: bold; color: #F56C6C"
                            >{{calculateTotalPrice()}}
                            </el-col>
                        </el-row>
                        <br/>
                        <br/>
                        <el-form style="margin-top: 10px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="付款币种：" :label-width="formLabelWidth">
                                        <el-select
                                                v-model="contractForm.currencyType"
                                                :readonly="changeContractContentDisable(contractForm)"
                                                clearable
                                        >
                                            <el-option
                                                    v-for="item in currencyTypeList"
                                                    v-bind:value="item.text"
                                                    v-bind:label="item.text"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="1">
                                    <el-form-item label="合同交货日期：" :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                type="date"
                                                placeholder="合同交货日期"
                                                :readonly="changeContractContentDisable(contractForm)"
                                                v-model="contractForm.contractShipDate"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="付款方式：" :label-width="formLabelWidth">
                                        <el-input
                                                placeholder="付款方式"
                                                type="textarea"
                                                :autosize="{ minRows: 3}"
                                                :readonly="changeContractContentDisable(contractForm)"
                                                v-model="contractForm.payMethod"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注信息：" :label-width="formLabelWidth">
                                        <el-input
                                                type="textarea"
                                                :autosize="{ minRows: 3}"
                                                :readonly="changeContractContentDisable(contractForm)"
                                                v-model="contractForm.mark"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <!--
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
                                                         :readonly="signDisable(scope.row.roleId)"
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
            </el-tabs>-->
                    </el-card>

                    <!--<el-collapse v-model="collapseActiveNames" @change="handleCollapseChange"-->
                    <!--style="margin-left: 25px;margin-right: 25px">-->
                    <!--<el-collapse-item :title="collapseTitle" name="1">-->

                    <el-tabs
                            v-model="editableTabsValue"
                            type="border-card"
                            style="padding-right: 3px"
                            :editable="(mode == EDIT_MODE && (editContractSign.currentStep != '签核完成')) || mode == ADD_MODE"
                            @edit="handleEditTab"
                    >
                        <el-tab-pane
                                style="margin-left: 20px;margin-right: 20px"
                                v-for="(item, index) in requisitionForms"
                                :key="item.name"
                                :label="item.title"
                                :name="item.name"
                        >
                            <el-form :model="item">
                                <div>
                                    <el-card
                                            v-if="(item.machineOrder.originalOrderId != null && item.machineOrder.originalOrderId != 0) && item.orderChangeRecord != null && (mode == CHANGE_MODE ||item.orderChangeRecord.changeReason != '')"
                                    >
                                        <el-row>
                                            <el-col :span="2">
                                                <el-form-item label="原单号：" :label-width="formLabelWidth"></el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="text-align: left;margin-top: 5px">
                        <span
                                style="font-weight: bold;font-size: 16px; color: #409EFF"
                        >{{filterOrderNum(item.machineOrder.originalOrderId)}}</span>
                                            </el-col>
                                        </el-row>
                                        <el-col>
                                            <el-form-item
                                                    label="改单原因："
                                                    :label-width="formLabelWidth"
                                                    style="padding-bottom: 12px"
                                                    prop="orderChangeRecord.changeReason"
                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    :rules="[
                                                                              { required: true, message: '改单原因不能为空'},
                                                                      ]"
                                            >
                                                <el-input
                                                        v-model="item.orderChangeRecord.changeReason"
                                                        type="textarea"
                                                        auto-complete="off"
                                                        :readonly="changeOrderContentDisable(item.machineOrder)"
                                                        :autosize="{ minRows: 3, maxRows: 3}"
                                                        placeholder="改单原因"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-card>
                                    <el-card
                                            v-if="item.machineOrder.originalOrderId != null && item.orderSplitRecord != null && (mode == SPLIT_MODE ||item.orderSplitRecord.splitReason != '')"
                                    >
                                        <el-row>
                                            <el-col :span="2">
                                                <el-form-item label="原单号：" :label-width="formLabelWidth"></el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="text-align: left;margin-top: 5px">
                        <span
                                style="font-weight: bold;font-size: 16px; color: #409EFF"
                        >{{filterOrderNum(item.machineOrder.originalOrderId)}}</span>
                                            </el-col>
                                        </el-row>
                                        <el-col>
                                            <el-form-item
                                                    label="拆单原因："
                                                    :label-width="formLabelWidth"
                                                    style="padding-bottom: 12px"
                                                    prop="orderSplitRecord.splitReason"
                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                            >
                                                <el-input
                                                        v-model="item.orderSplitRecord.splitReason"
                                                        type="textarea"
                                                        auto-complete="off"
                                                        :readonly="changeOrderContentDisable(item.machineOrder)"
                                                        :autosize="{ minRows: 3, maxRows: 3}"
                                                        placeholder="拆单原因"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-card>
                                    <el-row>
                                        <el-col :span="5" style="font-size: 20px; margin-bottom: 10px;margin-top: 10px">
                                            <el-form-item label="订单号：" :label-width="formLabelWidth">
                                                <el-input
                                                        v-model="item.machineOrder.orderNum"
                                                        placeholder="订单号"
                                                        :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                        :readonly="changeOrderContentDisable(item.machineOrder) || (item.machineOrder.originalOrderId != 0 && mode == 4)"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" style="margin-bottom: 10px;margin-top: 10px">
                                            <el-form-item label="填表日期：" :label-width="formLabelWidth">
                                                <el-input
                                                        v-model="item.machineOrder.createTime"
                                                        :readonly="changeOrderContentDisable(item.machineOrder)"
                                                        :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                        placeholder="日期"
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <!--<el-col :span="2" style="margin-bottom: 10px;margin-top: 10px">-->
                                        <!--<el-form-item label="订单加急：" :label-width="formLabelWidth">-->
                                        <!--<el-checkbox-->
                                        <!--style="margin-left: 1px"-->
                                        <!--v-model="item.machineOrder.allUrgent"-->
                                        <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                        <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                        <!--&gt;-->
                                        <!--&lt;!&ndash;{{item.machineOrder.allUrgent}}&ndash;&gt;-->
                                        <!--</el-checkbox>-->
                                        <!--</el-form-item>-->
                                        <!--</el-col>-->
                                        <el-col :span="1">
                                            <el-button
                                                    type="success"
                                                    size="small"
                                                    style="margin-top: 15px"
                                                    @click="handleCopyOrder(item)"
                                            >复制
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button
                                                    type="danger"
                                                    size="small"
                                                    style="margin-top: 15px"
                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                    @click="handlePasteOrder(item)"
                                            >粘贴
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1" :offset="10">
                                            <el-button
                                                    type="danger"
                                                    size="small"
                                                    style="margin-top: 15px"
                                                    v-if="showSplitOrChangeOrder(item.machineOrder.status)"
                                                    :disabled="item.machineOrder.machineNum <= 1 || !allContactListPassed(item.machineOrder.contactFormDetailList)"
                                                    @click="handleSplitOrder(item)"
                                            >拆单
                                            </el-button>
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button
                                                    type="danger"
                                                    size="small"
                                                    style="margin-top: 15px"
                                                    v-if="showSplitOrChangeOrder(item.machineOrder.status)"
                                                    :disabled="!allContactListPassed(item.machineOrder.contactFormDetailList)"
                                                    @click="handleChangeOrder(item)"
                                            >改单
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="2" style="font-size: 20px; margin-bottom: 10px;margin-top: 10px">
                                            <el-form-item label="联系单：" :label-width="formLabelWidth">

                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="22" style="text-align: left">
                                          <span v-for="contact in item.machineOrder.contactFormDetailList">
                                             <el-button type="warning" plain size="medium"
                                                        style="margin: 10px;font-size: 20px;font-weight: bold" @click="handleViewContact(contact.id)">{{contact.num}}</el-button>
                                          </span>
                                        </el-col>
                                    </el-row>
                                    <div class="panel panel-primary">
                                        <div class="panel-heading" style="text-align: left">
                                            <h3 class="panel-title">客户机型信息</h3>
                                        </div>
                                        <div class="panel-body">
                                            <el-col :span="6">
                                                <el-form-item label="客户：" :label-width="formLabelWidth" clearable>
                                                    <el-input
                                                            v-model="contractForm.customerName"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            placeholder="客户"
                                                            readonly
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="国家："
                                                        :label-width="formLabelWidth"
                                                        clearable
                                                        :class="classWithDifferentValue(item, 'country', false)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.machineOrder.country"
                                                            clearable
                                                            filterable
                                                            :filter-method="filterCountry"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in countryListTmp"
                                                                :key="item.value"
                                                                :label="item.cn"
                                                                :value="item.cn"
                                                        >
                                                            <span style="float: left">{{ item.cn }}</span>
                                                            <span
                                                                    style="float: right; color: #8492a6; font-size: 13px"
                                                            >{{ item.en }}</span>
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="6">
                                                <el-form-item
                                                        label="商标："
                                                        :label-width="formLabelWidth"
                                                        clearable
                                                        :class="classWithDifferentValue(item, 'brand', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.brand"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            placeholder="商标"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="机型："
                                                        :label-width="formLabelWidth"
                                                        clearable
                                                        :class="classWithDifferentValue(item, 'machineType', false)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.machineOrder.machineType"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in allMachineType"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="针数："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'needleNum', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.needleNum"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="头数："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'headNum',false)"
                                                >
                                                    <el-input
                                                            style="float: left"
                                                            v-model="item.machineOrder.headNum"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="头距："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'headDistance', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.headDistance"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="X行程："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'xDistance', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.xDistance"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="X行程"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="Y行程："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'yDistance', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.yDistance"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="Y行程"
                                                    ></el-input>
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
                                                            @click="onSetDefault(item.name)"
                                                    >默认值
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </div>
                                        <div class="panel-body">
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="色数："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTowelColor', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTowelColor"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            clearable
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTowelColorList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="D轴上："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTowelDaxle', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTowelDaxle"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTowelDaxleList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="H轴下："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTowelHaxle', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTowelHaxle"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            clearable
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTowelHaxleList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="主电机："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTowelMotor', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTowelMotor"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            clearable
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTowelMotorList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="盘带头："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTapingHead', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTapingHead"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            clearable
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTapingHeadList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="毛巾机针："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'specialTowelNeedle', true)"
                                                >
                                                    <el-select
                                                            style="width: 100%"
                                                            v-model="item.orderDetail.specialTowelNeedle"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            clearable
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in specialTowelNeedleList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
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
                                                <el-form-item
                                                        label="电脑："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricPc', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.electricPc"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in pcModeList"
                                                                :key="item.text"
                                                                :value="item.text"
                                                                :label="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="语言："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricLanguage', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.electricLanguage"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in pcLanguageList"
                                                                :key="item.text"
                                                                :value="item.text"
                                                                :label="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="主电机："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricMotor', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.electricMotor"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in electricMotorList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="XY电机："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricMotorXy', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.electricMotorXy"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in xyMotorList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="剪线方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricTrim', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.electricTrim"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in trimList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="电源："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricPower', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.electricPower"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in electricPowerList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <!--<el-form-item label="按钮开关：" :label-width="formLabelWidth"-->
                                                <!--:class="classWithDifferentValue(item, 'electricSwitch', true)">-->
                                                <!--<template scope="scope">-->
                                                <!--<el-select v-model="item.orderDetail.electricSwitch"-->
                                                <!--clearable-->
                                                <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                                <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                                <!--placeholder="请选择">-->
                                                <!--<el-option-->
                                                <!--v-for="item in electricSwitchList"-->
                                                <!--:key="item.text"-->
                                                <!--:label="item.text"-->
                                                <!--:value="item.text">-->
                                                <!--</el-option>-->
                                                <!--</el-select>-->
                                                <!--</template>-->
                                                <!--</el-form-item>-->
                                                <el-form-item
                                                        label="换色方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'colorChangeMode', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.colorChangeMode"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in colorChangeModeList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="加油系统："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'electricOil', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.electricOil"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in electricOilList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
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
                                                <el-form-item
                                                        label="夹线器："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleSplit', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.axleSplit"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in axleSplitList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <!--<el-col :span="6" >-->
                                            <!--<el-form-item label="面板：" :label-width="formLabelWidth"-->
                                            <!--:class="classWithDifferentValue(item, 'axlePanel', true)" >-->
                                            <!--<template scope="scope" >-->
                                            <!--<el-select v-model="item.orderDetail.axlePanel"-->
                                            <!--clearable-->
                                            <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                            <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                            <!--placeholder="请选择" >-->
                                            <!--<el-option-->
                                            <!--v-for="item in axlePanelList"-->
                                            <!--:key="item.text"-->
                                            <!--:label="item.text"-->
                                            <!--:value="item.text" >-->
                                            <!--</el-option >-->
                                            <!--</el-select >-->
                                            <!--</template >-->
                                            <!--</el-form-item >-->
                                            <!--</el-col >-->
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="机针："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleNeedle', true)"
                                                >
                                                    <el-input
                                                            v-model="item.orderDetail.axleNeedle"
                                                            style="width: 100%;"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    ></el-input>
                                                    <!--<template scope="scope">-->
                                                    <!--<el-select v-model="item.orderDetail.axleNeedle"-->
                                                    <!--clearable-->
                                                    <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                                    <!--placeholder="请选择">-->
                                                    <!--<el-option-->
                                                    <!--v-for="item in axleNeedleList"-->
                                                    <!--:key="item.text"-->
                                                    <!--:label="item.text"-->
                                                    <!--:value="item.text">-->
                                                    <!--</el-option>-->
                                                    <!--</el-select>-->
                                                    <!--</template>-->
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="机针类型："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleNeedleType', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.axleNeedleType"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in axleNeedleTypeList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <!--<el-col :span="6">-->
                                            <!--<el-form-item label="机头导轨：" :label-width="formLabelWidth"-->
                                            <!--:class="classWithDifferentValue(item, 'axleRail', true)">-->
                                            <!--<template scope="scope">-->
                                            <!--<el-select v-model="item.orderDetail.axleRail"-->
                                            <!--clearable-->
                                            <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                            <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                            <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                            <!--v-for="item in axleRailList"-->
                                            <!--:key="item.text"-->
                                            <!--:label="item.text"-->
                                            <!--:value="item.text">-->
                                            <!--</el-option>-->
                                            <!--</el-select>-->
                                            <!--</template>-->
                                            <!--</el-form-item>-->
                                            <!--</el-col>-->
                                            <!--<el-col :span="6">-->
                                            <!--<el-form-item label="底检方式：" :label-width="formLabelWidth"-->
                                            <!--:class="classWithDifferentValue(item, 'axleDownCheck', true)">-->
                                            <!--<el-select v-model="item.orderDetail.axleDownCheck"-->
                                            <!--clearable-->
                                            <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                            <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                            <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                            <!--v-for="item in axleDownCheckList"-->
                                            <!--:key="item.text"-->
                                            <!--:label="item.text"-->
                                            <!--:value="item.text">-->
                                            <!--</el-option>-->
                                            <!--</el-select>-->
                                            <!--</el-form-item>-->
                                            <!--</el-col>-->
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="旋梭："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleHook', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.axleHook"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in axleHookList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="跳跃方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleJump', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.axleJump"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in axleJumpList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="面线夹持："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleUpperThread', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.axleUpperThread"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in axleUpperThreadList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
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
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="机架颜色："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkColor', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkColor"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkColorList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="台板："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkPlaten', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkPlaten"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkPlatenList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="台板颜色："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkPlatenColor', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkPlatenColor"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkPlatenColorList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="吊环："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkRing', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkRing"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkRingList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="电脑托架："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkBracket', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkBracket"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkBracketList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="急停装置："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkStop', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkStop"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkStopList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="立柱高度："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'frameworkPoleHeight', true)"
                                                >
                                                    <template scope="scope">
                                                        <el-select
                                                                v-model="item.orderDetail.frameworkPoleHeight"
                                                                clearable
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                placeholder="请选择"
                                                        >
                                                            <el-option
                                                                    v-for="item in frameworkPoleHeightList"
                                                                    :key="item.text"
                                                                    :label="item.text"
                                                                    :value="item.text"
                                                            ></el-option>
                                                        </el-select>
                                                    </template>
                                                </el-form-item>
                                            </el-col>
                                            <!--<el-col :span="6">-->
                                            <!--<el-form-item label="日光灯：" :label-width="formLabelWidth"-->
                                            <!--:class="classWithDifferentValue(item, 'frameworkLight', true)">-->
                                            <!--<el-select v-model="item.orderDetail.frameworkLight"-->
                                            <!--clearable-->
                                            <!--:disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"-->
                                            <!--:readonly="changeOrderContentDisable(item.machineOrder)"-->
                                            <!--placeholder="请选择">-->
                                            <!--<el-option-->
                                            <!--v-for="item in frameworkLightList"-->
                                            <!--:key="item.text"-->
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
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="驱动类型："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverType', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.driverType"
                                                            style="width: 100%;"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in driverTypeList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="驱动方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverMethod', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.driverMethod"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in driverMethodList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="绷架孔："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverReelHole', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.driverReelHole"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in driverReelHoleList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="绷架："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverReel', true)"
                                                >
                                                    <el-select
                                                            v-model="item.orderDetail.driverReel"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in driverReelList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="横档数量："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverHorizonNum', true)"
                                                >
                                                    <el-input-number
                                                            style="float: left"
                                                            v-model="item.orderDetail.driverHorizonNum"
                                                            :step="1"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            :min="0"
                                                            controls-position="right"
                                                    ></el-input-number>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="直档数量："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'driverVerticalNum', true)"
                                                >
                                                    <el-input-number
                                                            style="float: left"
                                                            v-model="item.orderDetail.driverVerticalNum"
                                                            :step="1"
                                                            :min="0"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            controls-position="right"
                                                    ></el-input-number>
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
                                                <el-form-item
                                                        label="包装方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'packageMethod', false)"
                                                >
                                                    <el-select
                                                            v-model="item.machineOrder.packageMethod"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in packageModeList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="绕线机配备："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'wrapMachine', false)"
                                                >
                                                    <el-select
                                                            v-model="item.machineOrder.wrapMachine"
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="请选择"
                                                    >
                                                        <el-option
                                                                v-for="item in wrapMachineList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="绕线机置换："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'wrapMachineChange', false)"
                                                >
                                                    <el-input
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            v-model="item.machineOrder.wrapMachineChange"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item
                                                        label="包装备注："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'packageMark', false)"
                                                >
                                                    <el-input
                                                            type="textarea"
                                                            :autosize="{ minRows: 6, maxRows: 10}"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            v-model="item.machineOrder.packageMark"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="交货日期："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'contractShipDate', false)"
                                                >
                                                    <el-date-picker
                                                            style="width: 100%"
                                                            v-model="item.machineOrder.contractShipDate"
                                                            type="date"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            placeholder="合同交货日期"
                                                    ></el-date-picker>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="6">
                                                <el-form-item
                                                        label="订机数量："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'machineNum', false)"
                                                        prop="machineOrder.machineNum"
                                                        :rules="[
                                                                              { required: true, message: '订机数不能为空'},
                                                                              { type: 'number', message: '订机数必须是数字'}
                                                                            ]"
                                                >
                                                    <el-input
                                                            style="float: left;"
                                                            v-model.number="item.machineOrder.machineNum"
                                                            auto-complete="off"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder) || isFromSplit(item.machineOrder)"
                                                            @blur="machineNumChanged(item)"
                                                            controls-position="right"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="保修人员："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'sellman', false)"
                                                >
                                                    <el-input
                                                            v-model="item.machineOrder.maintainPerson"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            auto-complete="off"
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item
                                                        label="保修方式："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'maintainType', false)"
                                                >
                                                    <el-select
                                                            v-model="item.machineOrder.maintainType"
                                                            placeholder
                                                            clearable
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                    >
                                                        <el-option
                                                                v-for="item in maintainTypeList"
                                                                :key="item.text"
                                                                :label="item.text"
                                                                :value="item.text"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="6">
                                                <el-form-item
                                                        label="计划日期："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'planShipDate', false)"
                                                >
                                                    <el-date-picker
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            style="width: 100%"
                                                            v-model="item.machineOrder.planShipDate"
                                                            type="date"
                                                            placeholder="合同计划日期"
                                                    ></el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2" :offset="0">
                                                <el-button
                                                        icon="el-icon-check"
                                                        size="small"
                                                        style="margin-left: 5px;"
                                                        type="success"
                                                        v-show="isShowConfirmPlanDate"
                                                        @click="handleConfirmPlanDate(item.machineOrder)"
                                                >确认
                                                </el-button>
                                            </el-col>

                                            <el-col :span="24">
                                                <el-form-item
                                                        label="备注信息："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'mark', false)"
                                                >
                                                    <el-input
                                                            type="textarea"
                                                            :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                            :readonly="changeOrderContentDisable(item.machineOrder)"
                                                            :autosize="{ minRows: 3}"
                                                            v-model="item.machineOrder.mark"
                                                    ></el-input>
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
                                                <el-button
                                                        type="primary"
                                                        size="small"
                                                        class="el-icon-plus"
                                                        style="margin: 15px"
                                                        :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                        v-if="!changeOrderContentDisable(item.machineOrder)"
                                                        @click="addEquipment(item.machineOrder)"
                                                >装置
                                                </el-button>
                                            </el-col>
                                            <div :class="equipmentValueDifferentClass(item)">
                                                <el-table border :data="item.machineOrder.equipment">
                                                    <el-table-column label="装置名称" width="300" align="center">
                                                        <template slot-scope="scope">
                                                            <el-select
                                                                    v-model="scope.row.name"
                                                                    placeholder
                                                                    clearable
                                                                    :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                    style="width: 95%"
                                                            >
                                                                <el-option
                                                                        v-for="item in machineEquipmentList"
                                                                        :key="item.text"
                                                                        :label="item.text"
                                                                        :value="item.text"
                                                                ></el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="型号" align="center">
                                                        <template slot-scope="scope">
                                                            <el-input
                                                                    style="float: left"
                                                                    v-model="scope.row.type"
                                                                    :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                    controls-position="right"
                                                            ></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="数量" width="200" align="center">
                                                        <template slot-scope="scope">
                                                            <el-input-number
                                                                    style="float: left"
                                                                    v-model="scope.row.number"
                                                                    :step="1"
                                                                    :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                    controls-position="right"
                                                                    :min="1"
                                                            ></el-input-number>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                            label="单价"
                                                            width="200"
                                                            align="center"
                                                            v-if="isFinanceVisible()"
                                                    >
                                                        <template slot-scope="scope">
                                                            <el-input
                                                                    v-model="scope.row.price"
                                                                    placeholder="单价"
                                                                    :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                    :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                    auto-complete="off"
                                                            ></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="操作" width="200" align="center">
                                                        <template slot-scope="scope">
                                                            <el-button
                                                                    size="mini"
                                                                    type="danger"
                                                                    icon="el-icon-delete"
                                                                    :disabled="changeOrderContentDisable(item.machineOrder)"
                                                                    @click="handleDeleteEquipment(item.machineOrder.equipment, scope.$index)"
                                                            >删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>

                                            <el-col :span="24" style="margin-top: 10px">
                                                <el-form-item
                                                        label="附加装置："
                                                        :label-width="formLabelWidth"
                                                        :class="classWithDifferentValue(item, 'axleAddition', true)"
                                                >
                                                    <div style="margin-top: 10px;margin-right: 10px">
                                                        <tinymce
                                                                ref="editor"
                                                                v-model="item.orderDetail.axleAddition"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)
                                                                  ||(userInfo.role.roleName.indexOf('销售') < 0 && userInfo.role.roleName.indexOf('超级管理员') < 0)"
                                                        ></tinymce>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <div class="panel-body" v-if="isFinanceVisible()">
                                            <table border="1" width="100%">
                                                <tr>
                                                    <td colspan="2" style="font-weight: bold; font-size: 14px">
                                                        机器价格（不含装置）
                                                    </td>
                                                    <td :class="classWithDifferentValue(item, 'machinePrice', false)">
                                                        <el-input-number
                                                                style="margin: 10px;width: 95%"
                                                                v-model="item.machineOrder.machinePrice"
                                                                :step="1"
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                controls-position="right"
                                                                :min="0"
                                                        ></el-input-number>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="font-weight: bold; font-size: 14px">居间费用 /
                                                        台
                                                    </td>
                                                    <td :class="classWithDifferentValue(item, 'intermediaryPrice', false)">
                                                        <el-input-number
                                                                style="margin: 10px;width: 95%"
                                                                v-model="item.machineOrder.intermediaryPrice"
                                                                :step="1"
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                controls-position="right"
                                                                :min="0"
                                                        ></el-input-number>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="font-weight: bold; font-size: 14px">优惠金额 /
                                                        台
                                                    </td>
                                                    <td :class="classWithDifferentValue(item, 'discounts', false)">
                                                        <el-input-number
                                                                style="margin: 10px;width: 95%"
                                                                v-model="item.machineOrder.discounts"
                                                                :step="1"
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                controls-position="right"
                                                                :min="0"
                                                        ></el-input-number>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="font-weight: bold; font-size: 14px">优惠金额</td>
                                                    <td :class="classWithDifferentValue(item, 'orderTotalDiscounts', false)">
                                                        <el-input-number
                                                                style="margin: 10px;width: 95%"
                                                                v-model="item.machineOrder.orderTotalDiscounts"
                                                                :step="1"
                                                                :disabled="(mode == 4 || mode == 5) && item.machineOrder.status != 0"
                                                                :readonly="changeOrderContentDisable(item.machineOrder)"
                                                                controls-position="right"
                                                                :min="0"
                                                        ></el-input-number>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="font-weight: bold; font-size: 14px">
                                                        订单总价（含装置）
                                                    </td>
                                                    <td style="height: 56px">
                            <span
                                    style="margin-left: -20px;font-size: 16px; font-weight: bold; color: #409EFF"
                            >{{calculateOrderPrice(item.machineOrder)}}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                            style="text-align: center; font-size: 18px;font-weight: bold;margin-bottom: 10px"
                                    >需求评审单
                                    </div>
                                    <el-col :span="24">
                                        <el-table
                                                border
                                                :row-class-name="tableRowClassName"
                                                :data="item.orderSign != null ? item.orderSign.signContent : []"
                                                style="margin-bottom: 30px"
                                        >
                                            <el-table-column align="center" label="签核步骤" width="80">
                                                <template scope="scope">
                                                    <el-button
                                                            style="font-size: 14px; font-weight: bold"
                                                            type="primary"
                                                            round
                                                            size="mini"
                                                    >{{scope.row.number}}
                                                    </el-button>
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
                                                            :readonly="signDisable(item.orderSign.signContent,scope.row,item.machineOrder.status)"
                                                            type="textarea"
                                                            v-model="scope.row.comment"
                                                            auto-complete="off"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="操作" width="200">
                                                <template scope="scope">
                                                    <el-button
                                                            type="primary"
                                                            @click="onSubmitOrderSign(scope.row, item.orderSign)"
                                                            icon="el-icon-check"
                                                            size="small"
                                                            :disabled="signDisable(item.orderSign.signContent,scope.row,item.machineOrder.status)"
                                                    >同意
                                                    </el-button>
                                                    <el-button
                                                            type="danger"
                                                            @click="handleRejectOrderSign(scope.row, item.orderSign)"
                                                            icon="el-icon-close"
                                                            size="small"
                                                            :disabled="signDisable(item.orderSign.signContent,scope.row,item.machineOrder.status)"
                                                    >驳回
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
                    <!--</el-collapse-item>-->
                    <!--</el-collapse>-->
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" style="margin-top: -20px; margin-right:2%">
                <el-button @click="dialogClose()" icon="el-icon-back" type="info">关 闭</el-button>
                <el-button
                        v-show="mode == EDIT_MODE && haveInitialMachineOrder() || contractHasRejectedOrder()"
                        type="primary"
                        @click="onEdit"
                        icon="el-icon-check"
                        :disabled="editButtonDisabled"
                >保 存
                </el-button>
                <el-button
                        v-show="mode == CHANGE_MODE"
                        type="primary"
                        @click="onSaveChange"
                        icon="el-icon-check"
                        :disabled="changeButtonDisabled"
                >保存改单
                </el-button>
                <el-button
                        v-show="mode == SPLIT_MODE"
                        type="primary"
                        @click="onSaveSplit"
                        icon="el-icon-check"
                        :disabled="splitButtonDisabled"
                >保存拆单
                </el-button>
                <el-button
                        v-show="mode == ADD_MODE"
                        type="primary"
                        @click="onAdd"
                        icon="el-icon-check"
                        :disabled="addButtonDisabled"
                >保 存
                </el-button>
            </div>
            <el-dialog title="提示" :visible.sync="confirmPasteDialog" width="30%" append-to-body>
        <span style="font-size: 15px">
          确定要粘贴到
          <b style="color: #F56C6C">{{currentSelectOrder.title}}</b>吗？
        </span>
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

            <el-dialog
                    title="提示"
                    :visible.sync="rejectContractSignResultVisible"
                    width="30%"
                    append-to-body
            >
                <span style="font-size: 15px">确认驳回审核？</span>
                <span slot="footer" class="dialog-footer">
          <el-button @click="rejectContractSignResultVisible = false" icon="el-icon-back">取 消</el-button>
          <el-button type="primary" @click="onRejectContractSign" icon="el-icon-check">确 定</el-button>
        </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="changeOrderVisible" width="30%" append-to-body>
        <span>
          确认更改订单
          <b
                  style="color: #F56C6C"
          >{{requisitionChangingItem != "" ? requisitionChangingItem.machineOrder.orderNum : ""}}</b>？
        </span>
                <span slot="footer" class="dialog-footer">
          <el-button @click="changeOrderVisible = false" icon="el-icon-back">取 消</el-button>
          <el-button type="primary" @click="onConfirmChange" icon="el-icon-check">确 定</el-button>
        </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="splitOrderVisible" width="50%" append-to-body>
                <el-row>
                    <el-col :span="5">
            <span>
              拆分需求单:
              <b
                      style="color: #F56C6C;font-weight: bold"
              >{{requisitionSplitItem != "" ? requisitionSplitItem.machineOrder.orderNum : ""}}</b>
            </span>
                    </el-col>
                    <el-col :span="3">
                        <span>拆分出机器数:</span>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number
                                v-model="splitNum"
                                :min="1"
                                size="small"
                                style="margin-top: -5px"
                                :max=" requisitionSplitItem != '' ? requisitionSplitItem.machineOrder.machineNum -1: 1"
                                label="拆分机器数"
                        ></el-input-number>
                    </el-col>
                </el-row>
                <template>
                    <el-table
                            border
                            ref="splitMachinesTable"
                            :data="machinesOfOrder"
                            tooltip-effect="dark"
                            :empty-text="emptyTableText"
                            style="width: 100%;margin-top: 10px"
                            @selection-change="handleMachineSelectionChange"
                    >
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <el-table-column align="center" prop="machineStrId" label="机器编号"></el-table-column>
                        <el-table-column prop="namePlate" align="center" label="铭牌号"></el-table-column>
                        <el-table-column align="center" label="机器状态">
                            <template slot-scope="scope">{{ filterMachineStatus(scope.row.status) }}</template>
                        </el-table-column>
                        <el-table-column align="center" prop="location" label="位置"></el-table-column>
                    </el-table>
                    <span
                            style="color: #F56C6C;margin-top: 10px;font-size: 12px"
                    >注意：在不清楚如何选择拆分机器时，与生产部确认后再行选择；机器都未计划可以自由选择，但是如果机器已计划或者生产中，请务必与生产部确认！</span>
                </template>
                <span slot="footer" class="dialog-footer">
          <el-button @click="splitOrderVisible = false" icon="el-icon-back" size="small">取 消</el-button>
          <el-button
                  type="primary"
                  @click="onConfirmSplit"
                  icon="el-icon-check"
                  :disabled="splitNum != splitMachinesSelected.length && machinesOfOrder.length != 0"
                  size="small"
          >确 定</el-button>
        </span>
            </el-dialog>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="deleteConfirmVisible" width="30%" append-to-body>
      <span style="font-size: 22px">
        确认要删除编号为[
        <b style="color: #F56C6C;font-weight: bold">{{selectedItem.orderNum}}</b> ]的需求单吗？
      </span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false" icon="el-icon-back">取 消</el-button>
        <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog
                title="合同签核记录"
                :visible.sync="viewContractSignHistoryVisible"
                append-to-body
                width="65%"
        >
            <div v-for="signItem in contractSignHistory">
                <el-table border :data="signItem.signContent" style="margin-bottom: 30px">
                    <el-table-column align="center" label="签核步骤" width="80">
                        <template scope="scope">
                            <el-button
                                    style="font-size: 14px; font-weight: bold"
                                    type="primary"
                                    round
                                    size="mini"
                            >{{scope.row.number}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="150" label="签核角色">
                        <template slot-scope="scope">
                            <span style="font-size: 14px; font-weight: bold">{{scope.row.roleId | filterRole}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="150" label="签核人">
                        <template slot-scope="scope">
                            <el-input
                                    :readonly="signDisable(signItem.signContent,scope.row,item.machineOrder.status)"
                                    v-model="scope.row.user"
                                    auto-complete="off"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="200" label="日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.date != null && scope.row.date != "" ? scope.row.date : "未提交" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="意见">
                        <template slot-scope="scope">
                            <el-input
                                    :readonly="signDisable(signItem.signContent,scope.row,item.machineOrder.status)"
                                    type="textarea"
                                    v-model="scope.row.comment"
                                    auto-complete="off"
                            ></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="addLxdVisible" fullscreen @close="contactDialogCloseCallback()">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="24">
                    <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
                        联系单
                    </div>
                    <el-form :model="lxdForm.contactForm" :rules="rules" ref="ruleForm">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="联系单类型：" :label-width="longFormLabelWidth" prop="contactType">
                                    <el-select v-model="lxdForm.contactForm.contactType" placeholder="选择不同类型，会有不同的内容" clearable
                                               disabled>
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
                                              disabled clearable
                                              placeholder="联系单号："></el-input>
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
                                    <el-form-item label="申请日期：" prop="createDate"
                                                  :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                disabled
                                                type="date"
                                                placeholder="申请日期"
                                                v-model="lxdForm.contactForm.createDate">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="2" v-show="isShowChangeContactForm">
                                    <el-form-item label="ECO希望日期：" prop="hopeDate" :label-width="longFormLabelWidth">
                                        <el-date-picker
                                                disabled
                                                type="date"
                                                placeholder="ECO希望完成日期"
                                                v-model="lxdForm.contactForm.hopeDate">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6" :offset="1" v-show="isShowChangeContactForm">
                                    <el-form-item label="订单号: " :label-width="longFormLabelWidth" prop="orderNum">
                                        <el-input
                                                disabled
                                                v-model="lxdForm.contactForm.orderNum"
                                                clearable
                                                filterable
                                                placeholder="订单号">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col  :span="20" style="margin-top:10px;">
                                    <el-form-item label="变更主题：" :label-width="longFormLabelWidth" prop="contactTitle">
                                        <el-input type="textarea" v-model="lxdForm.contactForm.contactTitle"  clearable
                                                  :rows="1" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-show="isShowChangeContactForm">
                                <el-row :span="2"  style="margin-top:10px;">
                                    <el-form-item label="变更内容：" :label-width="longFormLabelWidth" prop="contactContent">
                                        <el-checkbox-group  v-model="checkedChangeTypes"
                                                            disabled
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
                                                      disabled>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-row>
                            <el-row v-show="isShowWorkContactForm">
                                <el-col :span="20" style="margin-top:10px;">
                                    <el-form-item label="变更内容：" :label-width="longFormLabelWidth" prop="contactContent">
                                        <el-input type="textarea" v-model="lxdForm.contactForm.contactContent"
                                                  :rows="5"  disabled>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row v-show="isShowChangeContactForm" >
                                    <span v-for="item in lxdForm.changeItemList" style="margin-top:10px;">
                                        <el-col :span="8">
                                            <el-form-item label="旧状态：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.oldInfo" placeholder="输入变更前的状态" clearable  disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="新状态：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.newInfo" placeholder="输入变更后的状态" clearable  disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="备注：" :label-width="longFormLabelWidth">
                                                <el-input v-model="item.remarks" placeholder="输入备注" clearable  disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-button
                                                    disabled
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
                                                        :disabled="lxdSignDisable(scope.row)"
                                                        v-model="scope.row.comment"
                                                        auto-complete="off"
                                                ></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" width="220">
                                            <template scope="scope" >
                                                <el-tooltip placement="top" content="同意"  v-show="isRowHasPermissionToShow(scope.row)">
                                                    <el-button
                                                            :disabled="lxdSignDisable(scope.row)"
                                                            type="success"
                                                            icon="el-icon-check"
                                                            size="mini"
                                                            @click="handleSubmitLxdSign(scope.row)"
                                                    ></el-button>
                                                </el-tooltip>
                                                <el-tooltip placement="top" content="驳回"  v-show="isRowHasPermissionToShow(scope.row)">
                                                    <el-button
                                                            :disabled="lxdSignDisable(scope.row)"
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
                            <el-button @click="contactDialogCloseCallback()" icon="el-icon-back" type="info"
                                       offset="120">关 闭
                            </el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Loading} from 'element-ui';
    import Tinymce from '../Tinymce/index.vue';
    import {ConfigData} from '../../config/dataconfig';

    var _this;
    const DefaultOrderDetail = {
        specialTowelColor: '',
        specialTowelDaxle: '',
        specialTowelHaxle: '',
        specialTowelMotor: '',
        specialTapingHead: '',
        specialTowelNeedle: '',
        driverHorizonNum: 0,
        driverVerticalNum: 0
    };
    export default {
        name: 'contract_sign',
        components: {
            Tinymce,
            ConfigData
        },
        data() {
            _this = this;
            return {
                editUrl: HOST + 'machine/order/update',
                deleteUrl: HOST + 'machine/order/updateValid',
                isError: false,
                errorMsg: '',
                totalRecords: 0,
                selectedItem: {},
                deleteConfirmVisible: false,
                queryUserRoleUrl: HOST + 'role/list',
                queryMachineTypeURL: HOST + 'machine/type/list',
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
                currencyTypeList: CurrencyTypeList,
                machineEquipmentList: MachineEquipmentList,
                packageModeList: PackageModeList,
                wrapMachineList: WrapMachineList,
                maintainTypeList: MaintainTypeList,
                orderStatusList: OrderStatusList,
                countryList: CountryList,
                countryListTmp: CountryList,
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
                driverMethodList: DriverMethodList,
                driverReelHoleList: DriverReelHoleList,
                driverReelList: DriverReelList,
                jiaZiXiuPricelList: JiaZiXiuPricelList,
                championGoldList: ChampionGoldList,
                specialTowelColorList: [],
                specialTapingHeadList: SpecialTapingHeadList,
                specialTowelDaxleList: SpecialTowelDaxleList,
                specialTowelHaxleList: SpecialTowelHaxleList,
                specialTowelMotorList: SpecialTowelMotorList,
                specialTowelNeedleList: SpecialTowelNeedleList,
                colorChangeModeList: ColorChangeModeList,

                //增加对话框
                addContractVisible: false,
                collapseActiveNames: ['1'],
                collapseTitle: '隐藏需求单',
                doCollapse: false,
                signProcesses: [],
                normalSignProcess: {},
                userInfo: '',

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
                    contractNum: '',
                    customerName: '',
                    sellman: '',
                    recordUser: '',
                    mark: '',
                    status: CONTRACT_INITIAL,
                    payMethod: '',
                    contractShipDate: ''
                },

                addButtonDisabled: false,
                editButtonDisabled: false,
                changeButtonDisabled: false,
                splitButtonDisabled: false,

                //多个需求单,一下是新创建合同时候的初始值，在编辑或者签核时需要从server端加载
                editableTabsValue: '1',
                requisitionForms: [
                    {
                        title: '需求单1',
                        name: '1',
                        //保存需求单数据
                        machineOrder: {
                            machineType: '',
                            country: CountryList[0].text,
                            brand: 'SINSIM',
                            createTime: new Date().format('yyyy-MM-dd'),
                            equipment: [],
                            status: ORDER_INITIAL,
                            createUserId: JSON.parse(sessionStorage.getItem('user')).id,
                            packageMark: ''
                        },
                        orderDetail: copyObjectByJSON(DefaultOrderDetail),
                        //每个需求单中的签核记录
                        orderSign: {},

                        lxdPassed: false
                    }
                ],

                tabIndex: 1,

                //多个合同签核记录，第一阶段只展示1个，即：当前有效的（进行中的）合同签核记录
                editableContractTabsValue: '1',
                contractSignForms: [
                    {
                        title: '合同签核记录',
                        name: '1',
                        contractSignData: []
                    }
                ],
                contractTabIndex: 1,
                splitNum: 1,
                machinesOfOrder: [],
                splitMachinesSelected: [],
                emptyTableText: '被拆需求单未签核完毕，暂无机器记录！',

                formLabelWidth: '100px',
                longFormLabelWidth: '125px',

                mode: this.SIGN_MODE,
                //			    isEdit: false,
                //                isSign: false,
                //                isChanging: false,
                dialogTitle: '合同',
                editContract: '',
                editContractSign: '',

                submitSignResultVisible: false,
                rejectSignResultVisible: false,
                rejectContractSignResultVisible: false,
                signResultObj: '',
                filters: {
                    contractNum: '',
                    roleName: '',
                    //默认审核中
                    status: 1,
                    sellman: '',
                    recordUser: '',
                    selectDate: ''
                },

                //改单相关
                changeOrderVisible: false,
                requisitionChangingItem: '',

                //拆单相关
                splitOrderVisible: false,
                requisitionSplitItem: '',
                splitNum: 1,

                allRoles: [],
                isShowConfirmPlanDate: false,

                salePersonList: [],
                timeout: null,
                customerList: [],
                domesticTradeZoneList: [],
                customerTimeout: null,
                domesticTradeZoneTimeout: null,
                currentCopyItem: {
                    machineOrder: {
                        brand: 'SINSIM',
                        createTime: new Date().format('yyyy-MM-dd'),
                        equipment: [],
                        status: ORDER_INITIAL,
                        createUserId: JSON.parse(sessionStorage.getItem('user')).id,
                        packageMark: ''
                    },
                    orderDetail: copyObjectByJSON(DefaultOrderDetail)
                },

                currentSelectOrder: {},
                confirmPasteDialog: false,
                pickerOptions: {
                    shortcuts: [
                        {
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
                        return time.getTime() < Date.now();
                    },
                    shortcuts: [
                        {
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            }
                        }
                    ]
                },
                contractExist: false,
                contractErrorMsg: '',
                normalSignRoleList: [],
                orderStatusForFilterList: [],
                configList: [],
                userDomesticTradeZoneListStr: '',
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
                lxdStatusForFilterList: [],

                lxdStatusList: LxdStatusList,

                lxdTypes: ["变更", "工作"],
                //变更联系单的变更类型(变更内容)
                lxdChangeTypes: [
                    "设计变更","材料变更","工艺变更","模具设备", "工艺夹具","制造场所", "新供应商","包装运输","检验方法","其他变更，需说明",
                ],
                checkedChangeTypes:[],
                //增加对话框
                addLxdVisible: false,
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
            };
        },
        methods: {
            onContractInputUnfocus(contractNum) {
                if (_this.mode == _this.ADD_MODE) {
                    if (contractNum == null || contractNum == '') {
                        _this.contractExist = true;
                        _this.contractErrorMsg = '合同编号不能为空！';
                    } else {
                        $.ajax({
                            url: HOST + 'contract/isContractExist',
                            type: 'POST',
                            dataType: 'JSON',
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

            handleConfirmPlanDate(item) {
                $.ajax({
                    url: HOST + 'machine/order/update/',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        machineOrder: JSON.stringify({
                            id: item.id,
                            planShipDate: item.planShipDate
                        })
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, '合同计划日期确认成功！', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            requestCustomerList() {
                $.ajax({
                    url: HOST + 'contract/selectAllCustomer/',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        name: ''
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

            requestDomesticTradeZoneList() {
                $.ajax({
                    url: HOST + 'domestic/trade/zone/list/',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        name: ''
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            _this.domesticTradeZoneList = [];
                            res.data.forEach(item => {
                                _this.domesticTradeZoneList.push({
                                    value: item.zoneName
                                });
                            });
                        }
                    }
                });
            },
            queryDomesticTradeZone(queryString, check) {
                //缓存加载
                var results = _this.domesticTradeZoneList;
                if (queryString) {
                    results = _this.domesticTradeZoneList.filter(
                        this.createStateFilter(queryString)
                    );
                }
                clearTimeout(_this.domesticTradeZoneTimeout);
                _this.domesticTradeZoneTimeout = setTimeout(() => {
                    check(results);
                }, 800 * Math.random());
            },
            requestSalePersonList() {
                var roleId = 0;
                for (var i = 0; i < _this.allRoles.length; i++) {
                    if (_this.allRoles[i].roleName.indexOf('销售员') > -1) {
                        roleId = _this.allRoles[i].id;
                        break;
                    }
                }

                $.ajax({
                    url: HOST + 'user/selectUsers',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        roleId: roleId //USER_ROLE.ROLE_SALEPERSON
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
                    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0;
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

            filterMachineStatus(status) {
                let name = '';
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
                    showMessage(_this, '选择机器数量大于拆分数！', 0);
                } else {
                    this.splitMachinesSelected = val;
                }
            },

            //查询该订单对于的联系单
            // fetchRelatedLxd(orderNum) {
            //     $.ajax({
            //         url: HOST + 'contact/form/selectContacts',
            //         type: 'POST',
            //         dataType: 'json',
            //         data: orderNum,
            //         success: function (data) {
            //             if (data.code == 200) {
            //                 _this.allRelatedContactOrderList = data.data.list;
            //                 if (_this.allRelatedContactOrderList.length < 1) {
            //                     console.log("小于1，没有联系单");
            //                 } else {
            //                     var allPassed = true;
            //                     for (let i = 0; i < _this.allRelatedContactOrderList.length; i++) {
            //                         if(_this.allRelatedContactOrderList.get(i).status != "联系单审核完成") {
            //                             allPassed == false;
            //                             break;
            //                         }
            //                     }
            //                     if(allPassed) {
            //                         console.log(orderNum + ": "+ "最后的联系单状态为 [完成]");
            //                     } else {
            //                         console.log(orderNum + ": "+ "最后的联系单状态为 [未完成]");
            //                     }
            //                 }
            //             }
            //         },
            //
            //         error: function (data) {
            //             showMessage(_this, '服务器访问失败！', 0);
            //             return false;
            //         }
            //     });
            //
            // },

          //是否显示拆单改单按钮
            showSplitOrChangeOrder(status) {
                if (
                    this.mode != this.SIGN_MODE &&
                    this.mode != this.CHANGE_MODE &&
                    this.mode != this.SPLIT_MODE &&
                    (status == ORDER_CHECKING_FINISHED || status == ORDER_SPLITED
                    || status == ORDER_SPLIT_FINISHED || status == ORDER_CHANGE_FINISHED)  //允许二次多次改单拆单
                       && _this.contractForm.recordUser == _this.userInfo.account
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            calculateMachineTotalPrice(item) {
                let machineTotalPrice = 0;
                if (item.status == ORDER_CHANGED || item.status == ORDER_CANCELED) {
                    machineTotalPrice = 0;
                } else {
                    machineTotalPrice = parseInt(item.machinePrice);
                    if (item.equipment != null && item.equipment != '') {
                        for (let i = 0; i < item.equipment.length; i++) {
                            machineTotalPrice =
                                machineTotalPrice +
                                parseInt(item.equipment[i].number) *
                                parseInt(item.equipment[i].price);
                        }
                    }
                }
                return machineTotalPrice != null && machineTotalPrice != ''
                    ? machineTotalPrice
                    : 0;
            },

            calculateOrderTotalPrice(item) {
                let discounts = 0;
                if (item.status == ORDER_CHANGED || item.status == ORDER_CANCELED) {
                    discounts = 0;
                } else {
                    discounts =
                        parseInt(item.discounts) * item.machineNum +
                        parseInt(item.orderTotalDiscounts);
                }
                return (
                    this.calculateMachineTotalPrice(item) * parseInt(item.machineNum) -
                    parseInt(discounts)
                );
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

            calculateTotalDiscount() {
                let total = 0;
                for (let i = 0; i < this.requisitionForms.length; i++) {
                    let discounts = 0;
                    var item = this.requisitionForms[i].machineOrder;
                    if (item.status == ORDER_CHANGED || item.status == ORDER_CANCELED) {
                        discounts = 0;
                    } else {
                        discounts =
                            parseInt(item.discounts) * item.machineNum +
                            parseInt(item.orderTotalDiscounts);
                    }
                    total += discounts;
                }
                return total;
            },

            handleCollapseChange() {
                _this.doCollapse = !_this.doCollapse;
                if (_this.doCollapse) {
                    _this.collapseTitle = '展开需求单';
                } else {
                    _this.collapseTitle = '隐藏需求单';
                }
            },

            viewContractSignHistory() {
                _this.contractSignHistory = []; //置空
                $.ajax({
                    url: HOST + 'contract/sign/list',
                    type: 'POST',
                    dataType: 'json',
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
                                showMessage(_this, '暂无历史记录！', 1);
                            }
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问失败！', 0);
                    }
                });
            },

            haveInitialMachineOrder() {
                let result = false;
                for (let i = 0; i < this.requisitionForms.length; i++) {
                    if (this.requisitionForms[i].machineOrder.status == ORDER_INITIAL) {
                        result = true;
                        break;
                    }
                }
                return result;
            },

            contractHasRejectedOrder() {
                let result = false;
                for (let i = 0; i < this.requisitionForms.length; i++) {
                    if (
                        this.requisitionForms[i].machineOrder.status == ORDER_REJECTED &&
                        _this.contractForm.recordUser == _this.userInfo.account
                    ///驳回以后，只允许录单人自己才可以修改，才显示保存按钮。
                    ) {
                        result = true;
                        break;
                    }
                }
                return result;
            },

            handleEditTab(targetName, action) {
                if (action === 'add') {
                    this.addTab(targetName);
                }
                if (action === 'remove') {
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
                        showMessage(_this, '已有签核记录，不能删除！', 0);
                    } else if (this.requisitionForms.length == 1) {
                        showMessage(_this, '不能删除最后一个需求单！', 0);
                    } else {
                        this.removeTab(targetName);
                    }
                }
            },

            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                var newItem = {
                    title: '需求单' + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(
                        this.requisitionForms[this.tabIndex - 2].machineOrder
                    ),
                    orderDetail: copyObjectByJSON(
                        this.requisitionForms[this.tabIndex - 2].orderDetail
                    ),
                    orderSign:
                        copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].orderSign
                        ) != null
                            ? copyObjectByJSON(
                            this.requisitionForms[this.tabIndex - 2].orderSign
                            )
                            : {}
                };
                resetObject(newItem);
                newItem.title = '需求单' + newTabName;
                newItem.name = newTabName;
                newItem.machineOrder.equipment = [];
                newItem.machineOrder.createUserId = _this.userInfo.id;
                newItem.machineOrder.sellman = this.contractForm.sellman;
                newItem.machineOrder.packageMark = '';
                //设置时间
                newItem.machineOrder.createTime = new Date().format('yyyy-MM-dd');
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
                $.ajax({
                    url: HOST + 'contract/startSign',
                    type: 'POST',
                    dataType: 'json',
                    data: {contractId: _this.editContract.id},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.addContractVisible = false;
                            _this.editContract = '';
                            showMessage(_this, '发起签核成功', 1);
                            _this.selectContracts();
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问失败！', 0);
                    }
                });
            },

            formatDate(timeStamp) {
                return new Date(timeStamp).format('yyyy-MM-dd');
            },
            filterCountry(value) {
                if (value != null && value != '') {
                    this.countryListTmp = _this.countryList.filter(item => {
                        return (
                            item.cn.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                            item.en.toLowerCase().indexOf(value.toLowerCase()) > -1
                        );
                    });
                } else {
                    this.countryListTmp = copyObjectByJSON(_this.countryList);
                }
            },
            filterContractStatus(value) {
                let result = '';
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

            //根据登录者的账号，得到对应的内贸区域
            //如果是内贸经理，则有对应的内贸区域(可多个)
            //其他的账号（比如外贸经理等），则为空

            getUserDomesticTradeZoneListStr() {
                if (_this.userInfo.marketGroupName == '内贸部') {
                    //根据账号返回内贸区域
                    $.ajax({
                        url: HOST + 'domestic/trade/zone/getDomesticTradeZone',
                        type: 'POST',
                        dataType: 'json',
                        data: {account: _this.userInfo.account},
                        success: function (data) {
                            if (data.code == 200) {
                                for (let k = 0; k < data.data.size; k++) {
                                    if (_this.userDomesticTradeZoneListStr == '') {
                                        _this.userDomesticTradeZoneListStr =
                                            data.data.list[k].zoneName;
                                    } else {
                                        _this.userDomesticTradeZoneListStr =
                                            _this.userDomesticTradeZoneListStr +
                                            ';' +
                                            data.data.list[k].zoneName;
                                    }
                                }
                                _this.selectContracts();
                                return _this.userDomesticTradeZoneListStr;
                            }
                        },
                        error: function (data) {
                            showMessage(_this, '服务器访问失败！', 0);
                        }
                    });
                    return '';
                } else {
                    return '';
                }
            },
            selectContracts() {
                var condition = {
                    id: _this.filters.id,
                    contractNum: _this.filters.contractNum,
                    status: _this.filters.status,
                    sellman: _this.filters.sellman,
                    marketGroupName: _this.userInfo.marketGroupName,
                    roleName: _this.filters.roleName,
                    recordUser: _this.filters.recordUser,
                    query_start_time: '',
                    query_finish_time: '',
                    //确定是哪个内贸区域,格式：用分号隔开的字符串
                    userDomesticTradeZoneListStr: _this.userDomesticTradeZoneListStr,

                    page: _this.currentPage,
                    size: _this.pageSize
                };
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
                    url: HOST + 'contract/selectContracts',
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
            handleCopyOrder(copyItem) {
                _this.currentCopyItem.machineOrder = copyObjectByJSON(
                    copyItem.machineOrder
                );
                _this.currentCopyItem.orderDetail = copyObjectByJSON(
                    copyItem.orderDetail
                );
                sessionStorage.setItem(
                    'copy_order_object',
                    JSON.stringify(_this.currentCopyItem)
                );
                showMessage(_this, copyItem.title + '拷贝成功！', 1);
            },

            handlePasteOrder(targetItem) {
                var item = sessionStorage.getItem('copy_order_object');
                if (item) {
                    _this.currentCopyItem = JSON.parse(item);
                    _this.currentSelectOrder = targetItem;
                    _this.confirmPasteDialog = true;
                } else {
                    showMessage(_this, '没有可以粘贴的需求单！请先复制!', 0);
                }
            },

            onConfirmPasteOrder() {
                _this.currentSelectOrder.orderDetail = copyObjectByJSON(
                    _this.currentCopyItem.orderDetail
                );

                //                _this.currentSelectOrder.machineOrder.country = _this.currentCopyItem.machineOrder.country;
                //                _this.currentSelectOrder.machineOrder.machineType = _this.currentCopyItem.machineOrder.machineType;
                _this.currentSelectOrder.machineOrder.brand =
                    _this.currentCopyItem.machineOrder.brand;

                _this.currentSelectOrder.machineOrder.needleNum =
                    _this.currentCopyItem.machineOrder.needleNum;
                _this.currentSelectOrder.machineOrder.headNum =
                    _this.currentCopyItem.machineOrder.headNum;
                _this.currentSelectOrder.machineOrder.headDistance =
                    _this.currentCopyItem.machineOrder.headDistance;
                _this.currentSelectOrder.machineOrder.xDistance =
                    _this.currentCopyItem.machineOrder.xDistance;
                _this.currentSelectOrder.machineOrder.yDistance =
                    _this.currentCopyItem.machineOrder.yDistance;
                _this.currentSelectOrder.machineOrder.packageMethod =
                    _this.currentCopyItem.machineOrder.packageMethod;
                _this.currentSelectOrder.machineOrder.maintainType =
                    _this.currentCopyItem.machineOrder.maintainType;
                _this.currentSelectOrder.machineOrder.mark =
                    _this.currentCopyItem.machineOrder.mark;
                _this.currentSelectOrder.machineOrder.equipment =
                    _this.currentCopyItem.machineOrder.equipment;
                _this.currentSelectOrder.machineOrder.machinePrice =
                    _this.currentCopyItem.machineOrder.machinePrice;
                _this.currentSelectOrder.machineOrder.packageMark =
                    _this.currentCopyItem.machineOrder.packageMark;
                _this.confirmPasteDialog = false;
                showMessage(_this, _this.currentSelectOrder.title + '粘贴成功！', 1);
            },

            handleSplitOrder(requisitionItem) {
                this.requisitionSplitItem = requisitionItem;

                if (
                    requisitionItem.machineOrder.orderNum == '' ||
                    requisitionItem.machineOrder.orderNum == null
                ) {
                    showMessage(this, '拆单订单编号为空！', 1);
                } else {
                    $.ajax({
                        url: HOST + 'machine/selectMachines',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                          order_id: requisitionItem.machineOrder.id,
                          //查询订单id号，不能模糊查询，否则可能返回不属于本订单的机器，比如，订单id为12，可能返回订单号为120 121等的机器
                          is_fuzzy: false
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                _this.splitOrderVisible = true;
                                _this.machinesOfOrder = data.data.list;
                            } else {
                                showMessage(_this, data.message, 0);
                                _this.emptyTableText = '获取需求单机器时失败！';
                            }
                        },
                        error: function (data) {
                            showMessage(_this, data.message, 0);
                            _this.emptyTableText = '服务器访问失败！';
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
                let newTabName = ++this.tabIndex + '';
                var newItem = {
                    title: '需求单' + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(this.requisitionSplitItem.machineOrder),
                    orderDetail: copyObjectByJSON(this.requisitionSplitItem.orderDetail),
                    orderSign:
                        copyObjectByJSON(this.requisitionSplitItem.orderSign) != null
                            ? copyObjectByJSON(this.requisitionSplitItem.orderSign)
                            : {},
                    orderSplitRecord: {
                        splitReason: '',
                        originalOrderId: this.requisitionSplitItem.machineOrder.id,
                        userId: this.userInfo.id
                    }
                };
                //设置时间
                newItem.machineOrder.createTime = new Date().format('yyyy-MM-dd');
                //清空订单号
                newItem.machineOrder.orderNum = '';
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
                if (this.requisitionSplitItem.title.indexOf('拆单') == -1) {
                    this.requisitionSplitItem.title =
                        this.requisitionSplitItem.title + '（待拆单）';
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
                let newTabName = ++this.tabIndex + '';
                var newItem = {
                    title: '订单' + newTabName,
                    name: newTabName,
                    machineOrder: copyObjectByJSON(
                        this.requisitionChangingItem.machineOrder
                    ),
                    orderDetail: copyObjectByJSON(this.requisitionChangingItem.orderDetail),
                    orderSign:
                        copyObjectByJSON(this.requisitionChangingItem.orderSign) != null
                            ? copyObjectByJSON(this.requisitionChangingItem.orderSign)
                            : {},
                    orderChangeRecord: {
                        changeReason: '',
                        orderId: this.requisitionChangingItem.machineOrder.id,
                        userId: this.userInfo.id
                    }
                };
                //设置时间
                newItem.machineOrder.createTime = new Date().format('yyyy-MM-dd');
                //沿用老的需求单号，因为实际管理中是以需求单号来沟通，所以保证之前的需求单号有效
                newItem.machineOrder.orderNum =
                    this.requisitionChangingItem.machineOrder.orderNum +
                    '(改-' +
                    new Date().format('yyyyMMdd') +
                    ')';
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
                this.requisitionChangingItem.machineOrder.orderNum =
                    this.requisitionChangingItem.machineOrder.orderNum + '(已改单)';
                if (this.requisitionChangingItem.title.indexOf('改单') == -1) {
                    this.requisitionChangingItem.title =
                        this.requisitionChangingItem.title + '（待改单）';
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
                this.errorMsg = '';
                this.dialogTitle = '新增合同';
                this.addContractVisible = true;
                this.editContract = '';
                _this.contractForm.recordUser = _this.userInfo.account;
                Vue.set(_this.requisitionForms, 0, {
                    title: '需求单1',
                    name: '1',
                    //保存需求单数据
                    machineOrder: {
                        brand: 'SINSIM',
                        createTime: new Date().format('yyyy-MM-dd'),
                        orderTotalPrice: 0,
                        machineNum: 1,
                        equipment: [],
                        status: ORDER_INITIAL,
                        createUserId: JSON.parse(sessionStorage.getItem('user')).id,
                        packageMark: ''
                    },
                    orderDetail: copyObjectByJSON(DefaultOrderDetail),
                    //每个需求单中的签核记录
                    orderSign: {
                        signContent: _this.normalOrderSignArray
                    }
                });

                this.tabIndex = 1;
                _this.contractSignForms[0].contractSignData =
                    _this.normalContractSignArray;
            },

            handleSign(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '签核合同';
                this.mode = this.SIGN_MODE;
                this.editContract = item;
                _this.fetchContractData(item.id);
                _this.fetchContractSignData(item.id);
                _this.fetchMachineOrdersData(item.id);
                //                _this.contractForm.recordUser = _this.userInfo.account;
                this.addContractVisible = true;
            },

            handleEdit(index, item) {
                this.isError = false;
                this.errorMsg = '';
                this.dialogTitle = '编辑合同';

                this.mode = this.EDIT_MODE;
                this.editContract = item;
                _this.fetchContractData(item.id);
                _this.fetchContractSignData(item.id);
                _this.fetchMachineOrdersData(item.id);
                //                _this.contractForm.recordUser = _this.userInfo.account;
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
                    url: HOST + 'contract/buildContractExcel',
                    type: 'POST',
                    dataType: 'json',
                    data: {contractId: item.id, account: _this.userInfo.account},
                    success: function (data) {
                        if (data.code == 200) {
                            window.location.href = data.data;
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },

            onConfirmDelete: function () {
                _this.deleteConfirmVisible = false;
                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        orderId: _this.selectedItem.orderId
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            //                            var index = _this.tableData.indexOf(_this.selectedItem);
                            //                            _this.tableData.splice(index, 1);
                            _this.selectContracts();
                            showMessage(_this, '删除需求单成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    },
                    error: function (info) {
                        showMessage(_this, '服务器访问出错', 0);
                    }
                });
            },
            addEquipment(machineOrder) {
                let equipment = {name: '', type: '', number: 1, price: 0};
                machineOrder.equipment.push(equipment);
            },

            handleDeleteEquipment(equipment, index) {
                equipment.splice(index, 1);
            },
            calculateOrderPrice(machineOrder) {
                let total = 0;
                total = parseInt(machineOrder.machinePrice);
                if (machineOrder.equipment != null && machineOrder.equipment != '') {
                    for (let i = 0; i < machineOrder.equipment.length; i++) {
                        total =
                            total +
                            parseInt(machineOrder.equipment[i].number) *
                            parseInt(machineOrder.equipment[i].price);
                    }
                }
                //total = total - parseInt(machineOrder.discounts);
                total =
                    parseInt(machineOrder.machineNum) * total -
                    parseInt(machineOrder.discounts) * machineOrder.machineNum -
                    parseInt(machineOrder.orderTotalDiscounts);
                return total;
            },
            caculateOrderEquipmentPrice(machineOrder) {
                let total = 0;
                if (machineOrder.equipment != null && machineOrder.equipment != '') {
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
                    this.errorMsg = '合同号不能为空';
                }
                if (!iserror && isStringEmpty(formObj.customerName)) {
                    iserror = true;
                    this.errorMsg = '客户不能为空';
                }

                if (!iserror && isStringEmpty(formObj.sellman)) {
                    iserror = true;
                    this.errorMsg = '销售人员不能为空';
                }
                if (!iserror && isStringEmpty(formObj.payMethod)) {
                    iserror = true;
                    this.errorMsg = '付款方式不能为空';
                }
                if (!iserror && isStringEmpty(formObj.currencyType)) {
                    iserror = true;
                    this.errorMsg = '付款币种不能为空';
                }
                if (!iserror && formObj.contractShipDate == '') {
                    iserror = true;
                    this.errorMsg = '合同交货时间不能为空';
                }
                return iserror;
            },

            validateOrderInfo(formObj, isEdit) {
                var iserror = false;
                if (!iserror && isStringEmpty(formObj.machineOrder.orderNum)) {
                    iserror = true;
                    this.errorMsg = '订单号不能为空';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.country)) {
                    iserror = true;
                    this.errorMsg = '请选择国家';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.brand)) {
                    iserror = true;
                    this.errorMsg = '请选择商标';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.machineType)) {
                    iserror = true;
                    this.errorMsg = '请选择机型';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.needleNum)) {
                    iserror = true;
                    this.errorMsg = '请填写针数';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.headNum)) {
                    iserror = true;
                    this.errorMsg = '请填写头数';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.headDistance)) {
                    iserror = true;
                    this.errorMsg = '请填写头距';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.xDistance)) {
                    iserror = true;
                    this.errorMsg = '请填写X行程';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.yDistance)) {
                    iserror = true;
                    this.errorMsg = '请填写Y行程';
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelColor)) {
                    iserror = true;
                    this.errorMsg = '色数不能为空';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelDaxle)) {
                    iserror = true;
                    this.errorMsg = 'D轴上不能为空';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelHaxle)) {
                    iserror = true;
                    this.errorMsg = 'H轴下不能为空';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelMotor)) {
                    iserror = true;
                    this.errorMsg = '主电机不能为空';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTapingHead)) {
                    iserror = true;
                    this.errorMsg = '盘带头不能为空';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.specialTowelNeedle)) {
                    iserror = true;
                    this.errorMsg = '毛巾机针不能为空';
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.electricPc)) {
                    iserror = true;
                    this.errorMsg = '请选择电脑';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricLanguage)) {
                    iserror = true;
                    this.errorMsg = '请选择电脑语言';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricMotor)) {
                    iserror = true;
                    this.errorMsg = '请选择主电机';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricMotorXy)) {
                    iserror = true;
                    this.errorMsg = '请选择XY电机';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricTrim)) {
                    iserror = true;
                    this.errorMsg = '请选择剪线方式';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricPower)) {
                    iserror = true;
                    this.errorMsg = '请选择电源';
                }
                //                if (!iserror && isStringEmpty(formObj.orderDetail.electricSwitch)) {
                //                    iserror = true;
                //                    this.errorMsg = "请选择按钮开关";
                //                }
                if (!iserror && isStringEmpty(formObj.orderDetail.colorChangeMode)) {
                    iserror = true;
                    this.errorMsg = '请选择换色方式';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.electricOil)) {
                    iserror = true;
                    this.errorMsg = '请选择加油系统';
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.axleSplit)) {
                    iserror = true;
                    this.errorMsg = '请选择夹线器';
                }
                // if (!iserror && isStringEmpty(formObj.orderDetail.axlePanel)) {
                //    iserror = true;
                //    this.errorMsg = "请选择面板";
                // }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleNeedle)) {
                    iserror = true;
                    this.errorMsg = '请选择机针';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleNeedleType)) {
                    iserror = true;
                    this.errorMsg = '请选择机针类型';
                }
                //                if (!iserror && isStringEmpty(formObj.orderDetail.axleRail)) {
                //                    iserror = true;
                //                    this.errorMsg = "请选择机头导轨";
                //                }
                //                if (!iserror && isStringEmpty(formObj.orderDetail.axleDownCheck)) {
                //                    iserror = true;
                //                    this.errorMsg = "请选择底检方式";
                //                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleHook)) {
                    iserror = true;
                    this.errorMsg = '请选择旋梭';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleJump)) {
                    iserror = true;
                    this.errorMsg = '请选择跳跃方式';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.axleUpperThread)) {
                    iserror = true;
                    this.errorMsg = '请选择面线夹持';
                }

                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkColor)) {
                    iserror = true;
                    this.errorMsg = '请选择机架颜色';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkPlaten)) {
                    iserror = true;
                    this.errorMsg = '请选择台板';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkPlatenColor)) {
                    iserror = true;
                    this.errorMsg = '请选择台板颜色';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkRing)) {
                    iserror = true;
                    this.errorMsg = '请选择吊环';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkBracket)) {
                    iserror = true;
                    this.errorMsg = '请选择电脑托架';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkStop)) {
                    iserror = true;
                    this.errorMsg = '请选择急停装置';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkPoleHeight)) {
                    iserror = true;
                    this.errorMsg = '请选择立柱高度';
                }
                //                if (!iserror && isStringEmpty(formObj.orderDetail.frameworkLight)) {
                //                    iserror = true;
                //                    this.errorMsg = "请选择 日光灯";
                //                }

                if (!iserror && isStringEmpty(formObj.orderDetail.driverType)) {
                    iserror = true;
                    this.errorMsg = '请选择驱动类型';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverMethod)) {
                    iserror = true;
                    this.errorMsg = '请选择驱动方式';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverReelHole)) {
                    iserror = true;
                    this.errorMsg = '请选择绷架孔';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverReel)) {
                    iserror = true;
                    this.errorMsg = '请选择绷架';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverHorizonNum)) {
                    iserror = true;
                    this.errorMsg = '请选择横档数量';
                }
                if (!iserror && isStringEmpty(formObj.orderDetail.driverVerticalNum)) {
                    iserror = true;
                    this.errorMsg = '请选择直档数量';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.packageMethod)) {
                    iserror = true;
                    this.errorMsg = '请选择包装方式';
                }
                //                if (!iserror && isStringEmpty(formObj.machineOrder.wrapMachine)) {
                //                    iserror = true;
                //                    this.errorMsg = "请选择绕线机配置";
                //                }
                //                if (!iserror && isStringEmpty(formObj.machineOrder.wrapMachineChange)) {
                //                    iserror = true;
                //                    this.errorMsg = "绕线机置换不能为空";
                //                }
                if (!iserror && formObj.machineOrder.contractShipDate == null) {
                    iserror = true;
                    this.errorMsg = '交货日期不能为空';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.machineNum)) {
                    iserror = true;
                    this.errorMsg = '机器数量能为空';
                }
                if (!iserror && isStringEmpty(formObj.machineOrder.maintainType)) {
                    iserror = true;
                    this.errorMsg = '保修方式不能为空';
                }
                if (!iserror && formObj.machineOrder.planShipDate == null) {
                    iserror = true;
                    this.errorMsg = '计划日期不能为空';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.machinePrice)) {
                    iserror = true;
                    this.errorMsg = '机器价格不能为空';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.intermediaryPrice)) {
                    iserror = true;
                    this.errorMsg = '居间费用/台 不能为空';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.discounts)) {
                    iserror = true;
                    this.errorMsg = '优惠金额/台 不能为空';
                }

                if (!iserror && isStringEmpty(formObj.machineOrder.orderTotalDiscounts)) {
                    iserror = true;
                    this.errorMsg = '优惠金额 不能为空';
                }

                return iserror;
            },

            dialogCloseCallback() {
                //reset after dialog closed
                //用于保存合同内容
                this.contractForm = {
                    contractNum: '',
                    customerName: '',
                    marketGroupName: '',
                    sellman: '',
                    mark: '',
                    status: CONTRACT_INITIAL,
                    payMethod: '',
                    contractShipDate: ''
                };
                //修复T第一次打开对话框，Tinymce中无法显示的问题，主要原因tab container中的tab没有被remove，导致tinymce组件不会被destroy
                //再一次打开就不会执行mounted，editor中的内容就无法显示
                this.requisitionForms.splice(0, this.requisitionForms.length);
                // Vue.set(_this.requisitionForms, 0, {
                //    title: "需求单1",
                //    name: "1",
                //    //保存需求单数据
                //    machineOrder: {
                //     brand: "SINSIM电脑绣花机",
                //     createTime: new Date().format("yyyy-MM-dd"),
                //     orderTotalPrice: 0,
                //     machineNum: 1,
                //     equipment: [],
                //     status: ORDER_INITIAL,
                //     createUserId: JSON.parse(sessionStorage.getItem("user")).id
                //    },
                //    orderDetail: {},
                //    //每个需求单中的签核记录
                //    orderSign: {}
                // });

                //this.tabIndex = 1;
                _this.selectContracts();
            },

            onAdd() {
                //先校验合同的内容,再校需求单的内容
                _this.isError = this.validContractInfo(_this.contractForm, false);
                if (_this.contractExist) {
                    _this.iserror = true;
                    _this.errorMsg = '合同号已存在';
                }
                if (!_this.isError) {
                    for (
                        let i = 0;
                        i < _this.requisitionForms.length && !_this.isError;
                        i++
                    ) {
                        _this.isError = this.validateOrderInfo(
                            _this.requisitionForms[i],
                            false
                        );
                        if (_this.isError) {
                            _this.errorMsg = '需求单' + (i + 1) + ':' + _this.errorMsg;
                        }
                    }
                }
                //Just for test
                //sessionStorage.setItem("requisitionForms", JSON.stringify(_this.requisitionForms));
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        if (
                            obj[i].orderSign.signContent != null &&
                            obj[i].orderSign.signContent.length == 0
                        ) {
                            showMessage(
                                _this,
                                '需求单' +
                                obj[i].machineOrder.orderNum +
                                '的签核为空！若改需求单新创建，请删除后再次创建；若该需求单已签核，请联系管理员！',
                                0
                            );
                            return;
                        }
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
                                '需求单' + (i + 1).toString() + '的合同价格不能为空，请检查！',
                                0
                            );
                            return;
                        }
                    }
                    //设置合同属于哪一个销售组
                    //（销售员和国内销售区域不绑定，所以不根据销售员来定内贸区域）
                    if (_this.userInfo != null) {
                        _this.contractForm.marketGroupName =
                            _this.userInfo.marketGroupName != ''
                                ? _this.userInfo.marketGroupName
                                : '';
                    }

                    $.ajax({
                        url: HOST + 'contract/add',
                        type: 'POST',
                        dataType: 'json',
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
                                //_this.addContractVisible = false;
                                _this.contractForm.id = res.data;
                                _this.resetAfterSubmit();
                                showMessage(_this, '添加成功', 1);
                                _this.selectContracts();
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
                    _this.addButtonDisabled = true;
                    setTimeout(() => {
                        _this.addButtonDisabled = false;
                    }, 2000);
                }
            },

            onEdit() {
                _this.isError = this.validContractInfo(_this.contractForm, false);
                if (!_this.isError) {
                    for (
                        let i = 0;
                        i < _this.requisitionForms.length && !_this.isError;
                        i++
                    ) {
                        _this.isError = this.validateOrderInfo(
                            _this.requisitionForms[i],
                            false
                        );
                        if (_this.isError) {
                            _this.errorMsg = '需求单' + (i + 1) + ':' + _this.errorMsg;
                        }
                    }
                }
                if (_this.isError) {
                    showMessage(_this, _this.errorMsg, 0);
                } else {
                    //由于signContent在DB中是以String方式存储的，防止Server端解析失败，需要在前端转成String形式，而不是array
                    let obj = copyObjectByJSON(_this.requisitionForms);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].orderSign != null) {
                            if (
                                obj[i].orderSign.signContent != null &&
                                obj[i].orderSign.signContent.length == 0
                            ) {
                                showMessage(
                                    _this,
                                    '需求单' +
                                    obj[i].machineOrder.orderNum +
                                    '的签核不能为空！请删除后再次创建；若该需求单已签核，请联系管理员！',
                                    0
                                );
                                return;
                            }
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
                                    '需求单' + (i + 1).toString() + '的合同价格不能为空，请检查！',
                                    0
                                );
                                return;
                            }
                        }
                    }
                    _this.contractForm.recordUser = _this.userInfo.account;
                    $.ajax({
                        url: HOST + 'contract/update',
                        type: 'POST',
                        dataType: 'json',
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
                                //_this.addContractVisible = false;
                                _this.editContract = '';
                                showMessage(_this, '保存成功', 1);
                                _this.selectContracts();
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
                    _this.editButtonDisabled = true;
                    setTimeout(() => {
                        _this.editButtonDisabled = false;
                    }, 2000);
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
                                this.requisitionForms[i].orderChangeRecord.changeReason == ''
                            ) {
                                _this.isError = true;
                                _this.errorMsg = '改单原因不能为空！';
                            }
                            if (
                                this.requisitionForms[i].machineOrder.orderNum == null ||
                                this.requisitionForms[i].machineOrder.orderNum == ''
                            ) {
                                _this.isError = true;
                                _this.errorMsg = '改单编号不能为空！';
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
                    _this.changeButtonDisabled = true;
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
                    _this.contractForm.recordUser = _this.userInfo.account;
                    $.ajax({
                        url: HOST + 'contract/changeOrder',
                        type: 'POST',
                        dataType: 'json',
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
                                // 改单时，是新增订单，所以要关闭，否则再次点击保存又会新增一个订单。
                                //_this.addContractVisible = false;
                                _this.resetAfterSubmit();
                                showMessage(_this, '保存改单成功', 1);
                                _this.selectContracts();
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
                    setTimeout(() => {
                        _this.changeButtonDisabled = false;
                    }, 2000);
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
                                this.requisitionForms[i].orderSplitRecord.splitReason == ''
                            ) {
                                _this.isError = true;
                                _this.errorMsg = '拆单原因不能为空！';
                            }
                            if (
                                this.requisitionForms[i].machineOrder.orderNum == null ||
                                this.requisitionForms[i].machineOrder.orderNum == ''
                            ) {
                                _this.isError = true;
                                _this.errorMsg = '拆单编号不能为空！';
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
                    _this.contractForm.recordUser = _this.userInfo.account;
                    $.ajax({
                        url: HOST + 'contract/splitOrder',
                        type: 'POST',
                        dataType: 'json',
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
                                //_this.addContractVisible = false;
                               _this.resetAfterSubmit();
                                showMessage(_this, '保存拆单成功', 1);
                                _this.selectContracts();
                            } else {
                                _this.errorMsg = res.message;
                                showMessage(_this, _this.errorMsg, 0);
                            }
                        },
                        error: function (info) {
                            showMessage(_this, '服务器访问出错！', 0);
                        }
                    });
                    _this.splitButtonDisabled = true;
                    setTimeout(() => {
                        _this.splitButtonDisabled = false;
                    }, 2000);
                }
            },

            resetAfterSubmit()
            {
                //新需求，保存操作之后，不需要关闭页面。
                _this.isError = false;
                _this.errorMsg = '';
                _this.dialogTitle = '编辑合同';
                _this.mode = _this.EDIT_MODE;
                _this.editContract=_this.contractForm;
                _this.fetchContractData(_this.contractForm.id);
                _this.fetchContractSignData(_this.contractForm.id);
                _this.fetchMachineOrdersData(_this.contractForm.id);
                setTimeout(() => {
                    _this.tabIndex=0;
                    this.editableTabsValue = this.requisitionForms[_this.tabIndex].name;
                }, 1000);
                
            },

            onSubmitOrderSign(item, signObj) {
                if (
                    item.comment == null ||
                    item.comment == '' ||
                    allCharactersAreStr(item.comment)
                ) {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    item.result = SIGN_APPROVE;
                    $.ajax({
                        url: HOST + 'order/sign/update',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            contractId: _this.editContract.id,
                            orderSign: JSON.stringify(signObj)
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, '提交审核成功', 1);
                                //_this.addContractVisible = false;
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                        }
                    });
                }
            },
            handleRejectOrderSign(item, signObj) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    this.rejectSignResultVisible = true;
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    item.result = SIGN_REJECT;
                    this.signResultObj = signObj;
                }
            },
            onRejectOrderSign() {
                $.ajax({
                    url: HOST + 'order/sign/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        contractId: _this.editContract.id,
                        orderSign: JSON.stringify(_this.signResultObj)
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, '驳回成功', 1);
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
                this.rejectSignResultVisible = false;
            },
            onSubmitContractSign(rowItem, signObj) {
                if (rowItem.comment == null || rowItem.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    rowItem.user = _this.userInfo.name;
                    rowItem.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    rowItem.result = SIGN_APPROVE;
                    _this.editContractSign.signContent = JSON.stringify(
                        signObj.contractSignData
                    );
                    //准备好数据，提交服务器
                    $.ajax({
                        url: HOST + 'contract/sign/update',
                        type: 'POST',
                        dataType: 'json',
                        data: {contractSign: JSON.stringify(_this.editContractSign)},
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, '提交审核成功', 1);
                                //_this.addContractVisible = false;
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
                    url: HOST + 'contract/sign/update',
                    type: 'POST',
                    dataType: 'json',
                    data: {contractSign: JSON.stringify(_this.editContractSign)},
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, '驳回成功', 1);
                            //_this.addContractVisible = false;
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
                this.rejectContractSignResultVisible = false;
            },
            handleRejectContractSign(item, signObj) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    this.rejectContractSignResultVisible = true;
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    item.result = SIGN_REJECT;
                    this.signResultObj = signObj;
                }
            },

            signDisable(signContentList, row, status) {
                //超级管理员可以操作，或者当前合同属于“签核状态”、登陆的用户有权限签核并且合同currentStep处于属于该角色签核
                //修改：下一个签核人未签核的状态下，允许修改。
                if (_this.userInfo.role.id == 1) {
                    return false;
                }
                if (row.roleId == _this.userInfo.role.id && status == 1) {
                    if (_this.editContract.currentStep == _this.userInfo.role.roleName) {
                        return false;
                    } else if (row.result > 0 && signContentList[row.number].result == 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
                // return !(
                //     (roleId == _this.userInfo.role.id &&
                //         status == 1 &&
                //         this.editContract.currentStep == _this.userInfo.role.roleName) ||
                //     _this.userInfo.role.id == 1
                // );
            },


            lxdSignDisable(row) {
                //超级管理员可以操作，或者当前合同属于“签核状态”、登陆的用户有权限签核并且合同currentStep处于属于该角色签核
                //修改：不分先后，只要最后一步没有完成，都可以审核操作。

                // if (_this.userInfo.role.id == 1) {
                //     return false;
                // }
                //&& _this.lxdForm.contactForm.status.indexOf("审核中")>=0
                if (row.roleId == _this.userInfo.role.id && _this.lxdForm.contactForm.status.indexOf("审核中") >= 0 && row.shenHeEnabled) {
                    return false;
                } else {
                    return true;
                }
            },

            changeOrderContentDisable(item) {
                return (
                    item.status == ORDER_CHANGED ||
                    item.status == ORDER_CHECKING_FINISHED ||
                    item.status == ORDER_CANCELED ||
                    item.status == ORDER_SPLITED ||
                    item.status == ORDER_CHECKING ||
                    this.mode == this.SIGN_MODE
                );
            },

            changeContractContentDisable(item) {
                return (
                    (item.status != CONTRACT_INITIAL &&
                        item.status != CONTRACT_REJECTED &&
                        item.status != CONTRACT_SPLITED &&
                        item.status != CONTRACT_CHANGED) ||
                    this.mode == this.SIGN_MODE
                );
            },

            fetchContractData(contractId) {
                $.ajax({
                    url: HOST + 'contract/detail',
                    type: 'POST',
                    dataType: 'json',
                    data: {id: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.contractForm = res.data;
                            //对于旧的合同，没有DomesticTradeZone,默认为null
                            if (_this.contractForm.domesticTradeZone == 0) {
                                _this.contractForm.domesticTradeZone = null;
                            }
                        } else {
                            showMessage(_this, res.message, 0);
                        }
                    }
                });
            },

            fetchContractSignData(contractId) {
                $.ajax({
                    url: HOST + 'contract/sign/detailByContractId',
                    type: 'POST',
                    dataType: 'json',
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
                    url: HOST + '/machine/order/selectOrders',
                    type: 'POST',
                    dataType: 'json',
                    data: {contract_id: contractId},
                    success: function (res) {
                        if (res.code == 200) {
                            let tempList = res.data.list;
                            _this.requisitionForms = [];
                            for (let i = 0; i < tempList.length; i++) {
                                let newTabName = i + 1 + '';
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
                                    machineOrder.equipment != null && machineOrder.equipment != ''
                                        ? JSON.parse(machineOrder.equipment)
                                        : [];
                                machineOrder.createTime = new Date(
                                    machineOrder.createTime
                                ).format('yyyy-MM-dd');
                                machineOrder.orderDetail = null;
                                machineOrder.orderSign = null;
//              if (tempList[i].allUrgent == 1) {
//                machineOrder.allUrgent = true;
//              }

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
                                //                                if (machineOrder.status == ORDER_CHANGED) {
                                //                                    newItem.title = newItem.title + "（已改单）";
                                //                                } else if (machineOrder.status == ORDER_SPLITED) {
                                //                                    newItem.title = newItem.title + "（已拆单）";
                                //                                } else
                                if (machineOrder.status == ORDER_REJECTED) {
                                    newItem.title = newItem.title + '（已驳回）';
                                } else if (machineOrder.status == ORDER_CANCELED) {
                                    newItem.title = newItem.title + '（已取消）';
                                }
                                _this.isShowConfirmPlanDate = _this.checkPlanDateIsShow(
                                    machineOrder
                                );
                                _this.requisitionForms.push(newItem);
                                if (_this.editContract.orderNum == machineOrder.orderNum) {
                                    _this.editableTabsValue = newTabName;
                                }
                                _this.tabIndex = i + 1;
                            }
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问失败！', 0);
                    }
                });
            },

            checkPlanDateIsShow(item) {
                return (
                    (item.status == ORDER_CHECKING_FINISHED ||
                        item.status == CONTRACT_CHECKING_FINISHED ||
                        item.status == ORDER_CHECKING ||
                        _this.contractForm.status == CONTRACT_CHECKING ||
                        this.mode == this.SIGN_MODE) &&
                    _this.userInfo.role.roleName.indexOf('PMC') > -1
                );
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
                            _this.requestSalePersonList();
                            _this.fetchSignProcesses();
                        }
                    }
                });
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
                        success: function (data) {
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
                                        sessionStorage.setItem(
                                            'contract_config',
                                            JSON.stringify(_this.configList)
                                        );
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
                        error: function (data) {
                            showMessage(_this, '服务器访问出错', 0);
                        }
                    });
                }
            },

            //只有在填单员创建新的合同、改单或者拆单才会去获取签核流程，填单员（编辑）以及其他部门签核时不需要
            initSignProcesses() {
                $.ajax({
                    url: HOST + 'sign/process/list',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.signProcesses = res.data.list;
                            for (let i = 0; i < _this.signProcesses.length; i++) {
                                if (_this.signProcesses[i].processName.indexOf('正常') != -1) {
                                    _this.normalSignProcess = JSON.parse(
                                        _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.normalSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.normalSignProcess[j].signType == '需求单签核') {
                                            let item = _this.normalSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
                                            _this.normalOrderSignArray.push(item);
                                        } else if (
                                            _this.normalSignProcess[j].signType == '合同签核'
                                        ) {
                                            let item = _this.normalSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
                                            _this.normalContractSignArray.push(item);
                                        }
                                    }
                                } else if (
                                    _this.signProcesses[i].processName.indexOf('改单') != -1
                                ) {
                                    _this.changeSignProcess = JSON.parse(
                                        _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.changeSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.changeSignProcess[j].signType == '需求单签核') {
                                            let item = _this.changeSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
                                            _this.changeOrderSignArray.push(item);
                                        } else if (
                                            _this.changeSignProcess[j].signType == '合同签核'
                                        ) {
                                            let item = _this.changeSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
                                            _this.changeContractSignArray.push(item);
                                        }
                                    }
                                } else if (
                                    _this.signProcesses[i].processName.indexOf('拆单') != -1
                                ) {
                                    _this.splitSignProcess = JSON.parse(
                                        _this.signProcesses[i].processContent
                                    );
                                    for (let j = 0; j < _this.splitSignProcess.length; j++) {
                                        //初始化需求单
                                        if (_this.splitSignProcess[j].signType == '需求单签核') {
                                            let item = _this.splitSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
                                            _this.splitOrderSignArray.push(item);
                                        } else if (_this.splitSignProcess[j].signType == '合同签核') {
                                            let item = _this.splitSignProcess[j];
                                            item.date = '';
                                            item.user = '';
                                            item.result = SIGN_INITIAL;
                                            item.comment = '';
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
                        type: 'POST',
                        dataType: 'json',
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
                    return 'warning-row';
                }
                return '';
            },

            classWithDifferentValue(item, type, isDetail) {
                let comparedItem = '';
                if (
                    !isUndefined(item.machineOrder.originalOrderId) &&
                    item.machineOrder.originalOrderId != 0
                ) {
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
                    if (comparedItem != '' && !isUndefined(comparedItem[type])) {
                        if (isDetail) {
                            if (item.orderDetail[type] != comparedItem[type]) {
                                return 'different-value';
                            } else {
                                return '';
                            }
                        } else {
                            //此处加判断是因为当改变时间后，绑定的是date对象，所以需要进行转换成时间戳后再进行比较，否则就算改回改单前的时间
                            //相比较的话也是不一样（date对象和时间戳相比较）
                            if (type == 'contractShipDate' || type == 'planShipDate') {
                                if (item.machineOrder[type] instanceof Date) {
                                    item.machineOrder[type] = Number(item.machineOrder[type]);
                                }
                            }
                            if (item.machineOrder[type] != comparedItem[type]) {
                                return 'different-value';
                            } else {
                                return '';
                            }
                        }
                    }
                } else {
                    return '';
                }
            },
            equipmentValueDifferentClass(item) {
                let comparedItem = '';
                if (
                    !isUndefined(item.machineOrder.originalOrderId) &&
                    item.machineOrder.originalOrderId != 0
                ) {
                    for (let i = 0; i < _this.requisitionForms.length; i++) {
                        if (
                            item.machineOrder.originalOrderId ==
                            _this.requisitionForms[i].machineOrder.id
                        ) {
                            comparedItem = copyObjectByJSON(
                                _this.requisitionForms[i].machineOrder
                            );
                            break;
                        }
                    }
                    //有改单
                    if (comparedItem != '') {
                        if (
                            isUndefined(item.machineOrder.equipment) &&
                            isUndefined(comparedItem.equipment)
                        ) {
                            return '';
                        } else {
                            if (
                                (isUndefined(item.machineOrder.equipment) &&
                                    !isUndefined(comparedItem.equipment)) ||
                                (!isUndefined(item.machineOrder.equipment) &&
                                    isUndefined(comparedItem.equipment))
                            ) {
                                return 'different-value';
                            } else {
                                if (
                                    JSON.stringify(item.machineOrder.equipment) !=
                                    JSON.stringify(comparedItem.equipment)
                                ) {
                                    return 'different-value';
                                } else {
                                    return '';
                                }
                            }
                        }
                    }
                } else {
                    return '';
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (row.result == SIGN_REJECT) {
                    return 'warning-row';
                }
                return '';
            },
            filterOrderNum(originalId) {
                let result = '';
                for (let i = 0; i < _this.requisitionForms.length; i++) {
                    if (_this.requisitionForms[i].machineOrder.id == originalId) {
                        result = _this.requisitionForms[i].machineOrder.orderNum;
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
                                    tmpList[i].processName.indexOf('正常') != -1
                                ) {
                                    _this.normalSignRoleList.push({
                                        roleId: '',
                                        name: '全部',
                                        choosed: _this.filters.roleName == '' ? true : false
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
                    error: function (data) {
                        showMessage(_this, '服务器访问出错', 0);
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
            chooseCurrentSignDepartment(index) {
                for (let i = 0; i < _this.normalSignRoleList.length; i++) {
                    if (index == i) {
                        _this.normalSignRoleList[i].choosed = true;
                        _this.filters.roleName = _this.getRoleNameById(
                            _this.normalSignRoleList[i].roleId
                        );
                    } else {
                        _this.normalSignRoleList[i].choosed = false;
                    }
                }
                _this.selectContracts();
            },
            chooseCurrentSignStep(index) {
                for (let i = 0; i < _this.orderStatusForFilterList.length; i++) {
                    if (index == i) {
                        _this.orderStatusForFilterList[i].choosed = true;
                        _this.filters.status = _this.orderStatusForFilterList[i].value;
                    } else {
                        _this.orderStatusForFilterList[i].choosed = false;
                    }
                }

                if (_this.orderStatusForFilterList[index].value != 1) {
                    for (let i = 0; i < _this.normalSignRoleList.length; i++) {
                        if (0 == i) {
                            _this.normalSignRoleList[i].choosed = true;
                        } else {
                            _this.normalSignRoleList[i].choosed = false;
                        }
                    }
                    _this.filters.roleName = '';
                }
                _this.selectContracts();
            },
            filterIsSigning() {
                let result = false;
                for (
                    let i = 0;
                    i < _this.orderStatusForFilterList.length && !result;
                    i++
                ) {
                    if (_this.orderStatusForFilterList[i].choosed) {
                        if (_this.orderStatusForFilterList[i].value == 1) {
                            result = true;
                        }
                    }
                }
                return result;
            },
            dialogClose() {
                _this.addContractVisible = false;
                _this.selectContracts();
            },
            allContactListPassed(contactList) {
                let passed = true;
                if(contactList == null || contactList.length == 0) {
                    passed = false;
                } else {
                    for (let i = 0; i < contactList.length; i++) {
                        if (contactList[i].status != "联系单审核完成") {
                            passed = false;
                            break;
                        }
                    }
                }
                return passed;
            },
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
            //组建变更内容的类型，用逗号分隔
            getLxdChangeTypes() {
                if (_this.checkedChangeTypes == null || _this.checkedChangeTypes.length == 0) {
                    return "";
                }
                //内容之间 用逗号隔开
                return _this.checkedChangeTypes.join(",");
            },
            getContactAllData(formId) {
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
            handleViewContact(id) {
                _this.getContactAllData(id);
                this.addLxdVisible = true;
            },
            contactDialogCloseCallback() {
                _this.addLxdVisible = false;

            },
            isRowHasPermissionToShow(row) {
                if (row.shenHeEnabled) {
                    return row.roleId == this.userInfo.role.id;
                }
                return false;
            },
            // “同意”按钮
            handleSubmitLxdSign(item) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    item.result = SIGN_APPROVE;
                    for (let i = 0; i < _this.lxdForm.contactSign.signContent.length; i++) {
                        if (_this.lxdForm.contactSign.signContent[i].number == item.number) {
                            _this.lxdForm.contactSign.signContent[i] = item;
                            break;
                        }
                    }
                    $.ajax({
                        url: HOST + 'contact/sign/update',
                        type: 'POST',
                        dataType: 'json',
                        data: {contactSign: JSON.stringify(_this.lxdForm.contactSign)},
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, '提交审核成功', 1);
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                            _this.addLxdVisible = false;
                        }
                    });
                }
            },

            handleRejectLxdSign(item) {
                if (item.comment == null || item.comment == '') {
                    showMessage(_this, '审核意见不能为空！', 0);
                } else {
                    item.user = _this.userInfo.name;
                    item.date = new Date().format('yyyy-MM-dd hh:mm:ss');
                    item.result = SIGN_REJECT;
                    for (let i = 0; i < _this.lxdForm.contactSign.signContent.length; i++) {
                        if (_this.lxdForm.contactSign.signContent[i].number == item.number) {
                            _this.lxdForm.contactSign.signContent[i] = item;
                            break;
                        }
                    }
                    //准备好数据，提交服务器
                    $.ajax({
                        url: HOST + 'contact/sign/update',
                        type: 'POST',
                        dataType: 'json',
                        data: {contactSign: JSON.stringify(_this.lxdForm.contactSign)},
                        success: function (res) {
                            if (res.code == 200) {
                                showMessage(_this, '驳回成功', 1);
                            } else {
                                showMessage(_this, res.message, 0);
                            }
                            _this.rejectSignResultVisible = false;
                        }
                    });
                }
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
        },
	
        computed: {
            isShowChangeContactForm: function(){//test为计算属性，调用时和调用属性一样调用test即可
                let res=_this.lxdForm.contactForm.contactType.indexOf("变更")>=0;
                //_this.rules.hopeDate[0].required=res;
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

            filterMachineTypeName(id) {
                let result = '';
                for (let i = 0; i < _this.allMachineType.length; i++) {
                    if (_this.allMachineType[i].id == id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            },
            filterOrderStatusStyle(id) {
                var result = 'divOrderStatusUnChecked';

                if (id == 0 || id == 5 || id == 6) {
                    result = 'divOrderStatusUnChecked';
                } else if (id == 2 || id == 7 || id == 8) {
                    result = 'divOrderStatusFinished';
                } else if (id == 1 || id == 3 || id == 4) {
                    result = 'divOrderStatusChecking';
                }
                return result;
            },
            filterContractInfo(formsData) {
                var resData = [];
                for (var i = 0; i < formsData.length; i++) {
                    var item = formsData[i];
                    var newItem = {};
                    newItem.machineOrder = copyObjectByJSON(item.machineOrder);
                    newItem.title = item.title;
                    newItem.machineInfo = '';
                    newItem.machineName = item.machineOrder.brand;
                    for (let i = 0; i < _this.allMachineType.length; i++) {
                        if (_this.allMachineType[i].id == item.machineOrder.machineType) {
                            newItem.machineInfo += `<span class="scopeMachine">${_this.allMachineType[i].name}</span>`;
                            break;
                        }
                    }
                    if (!isUndefined(item.machineOrder.needleNum)) {
                        newItem.machineInfo += `<br /><span class="scopeMachine">${item.machineOrder.needleNum}</span>`;
                    }
                    if (!isUndefined(item.machineOrder.headNum)) {
                        newItem.machineInfo += `/<span class="scopeMachine">${item.machineOrder.headNum}</span>`;
                    }
                    if (!isUndefined(item.machineOrder.headDistance)) {
                        newItem.machineInfo += `/<span class="scopeMachine">${item.machineOrder.headDistance}</span>`;
                    }
                    if (!isUndefined(item.machineOrder.xDistance)) {
                        newItem.machineInfo += `/<span class="scopeMachine">${item.machineOrder.xDistance}</span>`;
                    }
                    if (!isUndefined(item.machineOrder.yDistance)) {
                        newItem.machineInfo += `/<span class="scopeMachine">${item.machineOrder.yDistance}</span>`;
                    }

                    if (!isUndefined(item.orderDetail.electricTrim)) {
                        newItem.machineInfo += `/<span class="scopeMachine">${item.orderDetail.electricTrim}</span>`;
                    }
                    if (!isUndefined(item.orderDetail.electricPc)) {
                        newItem.machineInfo += `<br />电脑:<span class="scopeMachine">${item.orderDetail.electricPc}</span>`;
                    }
                    newItem.machineNum = item.machineOrder.machineNum;
                    newItem.machinePrice = item.machineOrder.machinePrice;
                    resData.push(newItem);
                }
                return resData;
            }
        },
        created: function () {
            _this.initConfigData();
            _this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(_this.userInfo)) {
                this.$router.push({path: '/login'});
                return;
            }
            //不是销售员，不是管理员
            if (
                this.userInfo.role.roleName != null &&
                this.userInfo.role.roleName.indexOf('销售员') == -1 &&
                this.userInfo.role.id != 1
            ) {
                _this.filters.roleName = this.userInfo.role.roleName;
            }

            this.orderStatusForFilterList[0] = {
                name: '全部',
                value: '',
                choosed: false
            };

            for (let i = 0; i < _this.orderStatusList.length; i++) {
                this.orderStatusForFilterList.push({
                    name: this.orderStatusList[i].name,
                    value: this.orderStatusList[i].value,
                    choosed: this.orderStatusList[i].value == 1 ? true : false
                });
            }
            _this.requestCustomerList();
            _this.initAllRoles();
            _this.initMachineType();
            /**
             * 如果是内贸部的销售经理，需要确保在获取销售经理的区域之后再查询
             * 在getUserDomesticTradeZoneListStr内部 selectContracts
             */
            if (
                this.userInfo.role.roleName == '销售部经理' &&
                this.userInfo.marketGroupName == '内贸部'
            ) {
                //该用户的审批区域，只有国内 销售经理才有。
                _this.userDomesticTradeZoneListStr = _this.getUserDomesticTradeZoneListStr();
            } else {
                this.selectContracts();
            }
            _this.initSignProcesses();
            _this.requestDomesticTradeZoneList();
        },
        mounted: function () {
        }
    };

    function allCharactersAreStr(strs) {
        if (strs == null || strs == '' || strs.length == 0) {
            return true;
        } else {
            let count = 0;
            for (let i = 0; i < strs.length; i++) {
                if (strs[i] == ' ') {
                    count++;
                }
            }
            if (count == strs.length) {
                return true;
            } else {
                return false;
            }
        }
    }
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

    .divOrderStatusUnChecked {
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
</style>
