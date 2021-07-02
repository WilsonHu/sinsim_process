<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <div >
		<el-row>
			<el-col :span="3">
				<el-row type="flex" justify="center">
					<el-col :span="19">
						<div style="font-size: 20px;font-weight: bold; margin-top: 12px">待签核：</div>
					</el-col>
					<el-col :span="5">
						<div style="font-size: 36px; font-weight: bold;">12</div>
					</el-col>
				</el-row>
			</el-col>
            <el-col :span="2" :offset="19">
                <el-button
                        icon="el-icon-plus"
                        size="normal"
                        type="danger"
                        @click="handleAdd" >签核
                </el-button >
            </el-col >
		</el-row>
        <el-col class="well well-lg" style="background-color: white; margin-top: 10px" >
            <el-row >
                <el-col >
                    <el-form :model="filters" label-position="right" label-width="80px" >
	                    <el-row >
	                        <el-col :span="6" >
	                            <el-form-item label="订单号:" >
	                                <el-input v-model="filters.id"
	                                          placeholder="订单号"
	                                          auto-complete="off" ></el-input >
	                            </el-form-item >
	                        </el-col >
	                        <el-col :span="4" >
	                            <el-form-item label="审核部门:" >
	                                <el-select v-model="filters.role_name" clearable >
	                                    <el-option
			                                    v-for="item in allRoles"
			                                    v-bind:value="item.role_name"
			                                    v-bind:label="item.name" >
	                                    </el-option >
	                                </el-select >
	                            </el-form-item >
	                        </el-col >
		                    <el-col :span="4" >
	                            <el-form-item label="审核状态:" >
	                                <el-select v-model="filters.order_status" clearable >
	                                    <el-option
			                                    v-for="item in orderStatusList"
			                                    v-bind:value="item.value"
			                                    v-bind:label="item.text" >
	                                    </el-option >
	                                </el-select >
	                            </el-form-item >
	                        </el-col >
		                    <el-col :span="4" >
	                            <el-form-item label="销售人员:" >
	                                <el-input v-model="filters.sellman"
	                                          placeholder="销售人员"
	                                          auto-complete="off" ></el-input >
	                            </el-form-item >
	                        </el-col >
                            <el-col :span="6" >
                                <el-button
		                                icon="el-icon-search"
		                                size="normal"
		                                type="primary"
		                                @click="search" >查询
                                </el-button >
                            </el-col >
	                    </el-row >
	                    <el-row >
		                    <el-col :span="6" >
	                            <el-form-item label="合同号:" >
	                                <el-input v-model="filters.contract_num"
	                                          placeholder="合同号"
	                                          auto-complete="off" ></el-input >
	                            </el-form-item >
	                        </el-col >
		                    <el-col :span="6" >
			                   <el-form-item label="选择日期:" >
				                   <el-date-picker
						                   v-model="filters.selectDate"
						                   type="daterange"
						                   align="left"
						                   unlink-panels
						                   range-separator="—"
						                   start-placeholder="开始日期"
						                   end-placeholder="结束日期"
						                   :picker-options="pickerOptions" >
				                   </el-date-picker >
			                   </el-form-item >
		                    </el-col >

						   <!--<el-col :span="2" style="float: right" >-->
							   <!--<el-button style="float: right;"-->
							              <!--icon="el-icon-plus"-->
							              <!--size="normal"-->
							              <!--type="primary"-->
							              <!--@click="handleAdd" >-->
								   <!--添加-->
							   <!--</el-button >-->
						   <!--</el-col >-->

	                    </el-row >
                    </el-form >


                    <el-table
		                    v-loading="loadingUI"
		                    element-loading-text="获取数据中..."
		                    :data="tableData"
		                    border
		                    show-overflow-tooltip="true"
		                    style="width: 100%;" >
                        <el-table-column
		                        width="75"
		                        label="序号" >
                            <template scope="scope" >
                                {{scope.$index+1}}
                            </template >
                        </el-table-column >
	                     <el-table-column label="订单号" >
		                     <template scope="scope" >
			                     <div v-on:click="onCourseDetail(scope.row)"
			                          style="font-weight: bold;"
			                          class="btn btn-link" >
                                        {{scope.row.id}}
			                     </div >
		                     </template >
                        </el-table-column >
                        <el-table-column
		                        prop="contractNum"
		                        label="合同号" >
                        </el-table-column >
	                    <el-table-column
			                    prop="customer"
			                    label="客户" >
                        </el-table-column >
	                    <el-table-column
			                    prop="brand"
			                    label="商标" >
                        </el-table-column >
                        <el-table-column
		                        prop="machineType"
		                        label="机型" >
                        </el-table-column >

	                    <el-table-column
			                    prop="status"
			                    label="审核状态" >
                        </el-table-column >
	                    <el-table-column
			                    prop="role_name"
			                    label="审核阶段" >
                        </el-table-column >
	                    <el-table-column
			                    prop="contractShipDate"
			                    label="合同交货日期" >
                        </el-table-column >
	                    <el-table-column
			                    prop="planShipDate"
			                    label="计划交货日期" >
                        </el-table-column >
	                    <el-table-column
			                    prop="sellman"
			                    label="销售人员" >
                        </el-table-column >
                        <el-table-column
		                        prop="createTime"
		                        label="填表日期" >
                        </el-table-column >
                        <el-table-column label="操作" width="160px" >
                            <template scope="scope" >
                                <el-button
		                                size="small"
		                                type="primary"
		                                @click="handleEdit(scope.$index, scope.row)" >编辑
                                </el-button >
                                <el-button
		                                size="small"
		                                type="danger"
		                                :disabled="scope.row.account=='admin'"
		                                @click="handleDelete(scope.$index, scope.row)" >删除
                                </el-button >
                            </template >
                        </el-table-column >
                    </el-table >
                    <div class="block" style="text-align: center; margin-top: 20px" >
                        <el-pagination
		                        @current-change="handleCurrentChange"
		                        :current-page="currentPage"
		                        :page-size="pageSize"
		                        layout="prev, pager, next, jumper"
		                        :total="totalRecords" >
                        </el-pagination >
                    </div >
                </el-col >
            </el-row >
        </el-col >
        <el-dialog title="新增订单" :visible.sync="addDialogVisible" :fullscreen="true" >
            <el-form :model="form" >
	            <div class="panel panel-primary" >
	                <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >订单信息</h3 >
	                </div >
	                <div class="panel-body" >
						<el-col :span="6" >
			                <el-form-item label="合同号：" :label-width="formLabelWidth" >
				                <el-input v-model="form.contractNum"
				                          placeholder="合同号"
				                ></el-input >
			                </el-form-item >
		                </el-col >
		                <!--<el-col :span="6" :offset="0" >-->
		                <!--<el-form-item label="订单号：" :label-width="formLabelWidth" >-->
		                <!--<el-input v-model="form.id"-->
		                <!--placeholder="订单号"-->
		                <!--&gt;</el-input >-->
		                <!--</el-form-item >-->
		                <!--</el-col >-->
		                <el-col :span="6" :offset="0" >
				            <el-form-item label="交货日期：" :label-width="formLabelWidth" >
								<el-date-picker
										style="width: 100%"
										v-model="form.contractShipDate"
										type="date"
										placeholder="合同交货日期"
								>
                                </el-date-picker >
				            </el-form-item >
			            </el-col >
		                <el-col :span="6" :offset="0" >
				            <el-form-item label="计划日期：" :label-width="formLabelWidth" >
					            <el-date-picker
							            style="width: 100%"
							            v-model="form.planShipDate"
							            type="date"
							            placeholder="合同计划日期"
					            >
                                </el-date-picker >
				            </el-form-item >
			            </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="销售人员：" :label-width="formLabelWidth" >
			                    <!--<el-select v-model="form.sellman"-->
			                    <!--clearable-->
			                    <!--placeholder="请选择" >-->
			                    <!--<el-option-->
			                    <!--v-for="item in allQualification"-->
			                    <!--:label="item.name"-->
			                    <!--:value="item.name" >-->
			                    <!--</el-option >-->
			                    <!--</el-select >-->
			                     <el-input v-model="form.sellman"
			                               placeholder="销售人员"
			                               auto-complete="off" >
			                     </el-input >

		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="包装方式：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.packageMethod"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in packageModeList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" >
							<el-form-item label="订机数量：" :label-width="formLabelWidth" >
								<el-input-number style="float: left;"
								                 v-model="form.machineNum"
								                 :step="1"
								                 controls-position="right"
								                 :min="1"
								                 :max="1000" >

								</el-input-number >
							</el-form-item >
						</el-col >
		                <el-col :span="16" :offset="0" >
				            <el-form-item label="备注信息：" :label-width="formLabelWidth" >
								<el-input
										type="textarea"
										:autosize="{ minRows: 4, maxRows: 4}"
										placeholder="备注信息"
										v-model="form.mark" >
								</el-input >
				            </el-form-item >
			            </el-col >
	                </div >
	            </div >

	            <div class="panel panel-primary" >
	                <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >客户机型信息</h3 >
	                </div >
	                <div class="panel-body" >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="客户：" :label-width="formLabelWidth" >
		                        <el-input v-model="form.customer"
		                                  placeholder="客户"
		                        ></el-input >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="国家：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.country"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in countryList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                 </el-col >

						<el-col :span="6" :offset="0" >
							<el-form-item label="商标：" :label-width="formLabelWidth" >
							<el-input v-model="form.brand"
							          placeholder="商标"
							          @change="onChange" ></el-input >
							</el-form-item >
						</el-col >
						<el-col :span="6" >
							<el-form-item label="机型：" :label-width="formLabelWidth" >
								<el-select
										style="width: 100%"
										v-model="form.machineType"
										clearable
										placeholder="请选择" >
						                    <el-option
								                    v-for="item in allMachineType"
								                    :label="item.name"
								                    :value="item.id" >
						                    </el-option >
								</el-select >
							</el-form-item >
						</el-col >
						<el-col :span="6" :offset="0" >
							<el-form-item label="平绣针数：" :label-width="formLabelWidth" >
							<el-input-number style="float: left;"
							                 v-model="form.needleNum"
							                 :step="2"
							                 controls-position="right"
							                 :min="1"
							                 :max="100" >

							</el-input-number >
							</el-form-item >
						</el-col >
			            <el-col :span="6" :offset="0" >
							<el-form-item label="头数：" :label-width="formLabelWidth" >
							<el-input-number style="float: left"
							                 v-model="form.headNum"
							                 :step="1"
							                 controls-position="right"
							                 :min="1"
							                 :max="100" >
							</el-input-number >
							</el-form-item >
						</el-col >
			            <el-col :span="6" :offset="0" >
							<el-form-item label="头距：" :label-width="formLabelWidth" >
								<el-input-number style="float: left"
								                 v-model="form.headDistance"
								                 :step="1"
								                 controls-position="right"
								                 :min="1"
								                 :max="100" >
								</el-input-number >
							</el-form-item >
						</el-col >
			            <el-col :span="6" >
							<el-form-item label="X行程：" :label-width="formLabelWidth" >
							<el-input v-model="form.xDistance"
							          placeholder="X行程"
							          @change="onChange" ></el-input >
							</el-form-item >
						</el-col >
			            <el-col :span="6" :offset="0" >
							<el-form-item label="Y行程：" :label-width="formLabelWidth" >
							<el-input v-model="form.yDistance"
							          placeholder="Y行程"
							          @change="onChange" ></el-input >
							</el-form-item >
						</el-col >
	                </div >
	            </div >

	            <div class="panel panel-primary" >
	                <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >特种绣选项</h3 >
	                </div >
	                <div class="panel-body" >
		                <el-col :span="6" >
							<el-form-item label="毛巾色数：" :label-width="formLabelWidth" >
							<el-input-number style="float: left;"
							                 v-model="form.specialTowelColor"
							                 :step="2"
							                 controls-position="right"
							                 :min="1"
							                 :max="100" >

							</el-input-number >
							</el-form-item >
						</el-col >
		                <el-col :span="6" :offset="0" >
				            <el-form-item label="D轴上：" :label-width="formLabelWidth" >
								<el-input v-model="form.specialTowelDaxle"
								          placeholder="D轴上"
								></el-input >
				            </el-form-item >
			            </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="H轴下：" :label-width="formLabelWidth" >
		                        <el-input v-model="form.specialTowelHaxle"
		                                  placeholder="H轴下"
		                        ></el-input >
		                    </el-form-item >
		                </el-col >
						<el-col :span="6" :offset="0" >
							<el-form-item label="主电机：" :label-width="formLabelWidth" >
							<el-input v-model="form.specialTowelMotor"
							          placeholder="主电机"
							></el-input >
							</el-form-item >
						</el-col >
		                <el-col :span="6" >
							<el-form-item label="盘带头：" :label-width="formLabelWidth" >
							<el-input v-model="form.specialTapingHead"
							          placeholder="盘带头"
							></el-input >
							</el-form-item >
						</el-col >
		                <el-col :span="6" :offset="0" >
							<el-form-item label="毛巾机针：" :label-width="formLabelWidth" >
							<el-input v-model="form.specialTowelNeedle"
							          placeholder="毛巾机针" >
							</el-input >
							</el-form-item >
						</el-col >

	                </div >
		        </div >

	            <div class="panel panel-primary" >
	                <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >电气</h3 >
	                </div >
	                <div class="panel-body" >
		                <el-col :span="6" >
		                    <el-form-item label="电脑：" :label-width="formLabelWidth" >
		                        <el-select v-model="form.electricPc"
		                                   clearable
		                                   placeholder="请选择" >
		                            <el-option
				                            v-for="item in pcModeList"
				                            v-bind:value="item.text"
				                            v-bind:label="item.text" >
		                            </el-option >
		                        </el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="主电机：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.electricMotor"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in electricMotorList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="XY电机：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.electricMotorXy"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in xyMotorList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="剪线方式：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.electricTrim"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in trimList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" >
		                    <el-form-item label="电源：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.electricPower"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in electricPowerList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="按钮开关：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.electricSwitch"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in electricSwitchList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="加油系统：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.electricOil"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in electricOilList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
	                </div >
	            </div >


	            <div class="panel panel-primary" >
	                <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >上轴下轴主传动</h3 >
	                </div >
	                <div class="panel-body" >
		                <el-col :span="6" >
		                    <el-form-item label="夹线器：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.axleSplit"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axleSplitList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="面板：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.axlePanel"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axlePanelList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="机针：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.axleNeedle"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axleNeedleList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="机头导轨：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.axleRail"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axleRailList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="底检方式：" :label-width="formLabelWidth" >
									<el-select v-model="form.axleDownCheck"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axleDownCheckList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="旋梭：" :label-width="formLabelWidth" >
									<el-select v-model="form.axleHook"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in axleHookList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >

		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="跳跃方式：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.axleJump"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in axleJumpList"
						                    :label="item.text"
						                    :value="item.text" >

				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="6" :offset="0" >
		                    <el-form-item label="面线夹持：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.axleUpperThread"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in axleUpperThreadList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="12" >
		                    <el-form-item label="附加装置：" :label-width="formLabelWidth" >
			                    <el-input v-model="form.axleAddition" @change="onChange" ></el-input >
		                    </el-form-item >
		                </el-col >
		                <el-col :span="10" >
		                    <div style="font-family:Segoe UI;color:gray;text-align: left;margin-top: 10px" >
			                    (仅销售和研发可编辑)
		                    </div >
		                </el-col >
	                </div >
	            </div >

	            <div class="panel panel-primary" >
		             <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >机架台板</h3 >
	                 </div >
	                 <div class="panel-body" >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="机架颜色：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkColor"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkColorList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="台板：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkPlaten"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkPlatenList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="台板颜色：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkPlatenColor"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkPlatenColorList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="吊环：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkRing"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkRingList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
			             <el-col :span="6" :offset="0" >
		                    <el-form-item label="电脑托架：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkBracket"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkBracketList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="急停装置：" :label-width="formLabelWidth" >
								<template scope="scope" >
									<el-select v-model="form.frameworkStop"
									           clearable
									           placeholder="请选择" >
										<el-option
												v-for="item in frameworkStopList"
												:label="item.text"
												:value="item.text" >
										</el-option >
									</el-select >
								</template >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="日光灯：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.frameworkLight"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in frameworkLightList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                 </el-col >
	                 </div >
	            </div >

	            <div class="panel panel-primary" >
		             <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >驱动框架绷架</h3 >
	                 </div >
	                 <div class="panel-body" >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="驱动类型：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.driverType" style="width: 100%;"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in driverTypeList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                     </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="驱动方式：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.driverMethod"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in friverMethodList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="绷孔架：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.driverReelHole"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in driverReelHoleList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
		                    <el-form-item label="绷架：" :label-width="formLabelWidth" >
			                    <el-select v-model="form.driverReel"
			                               clearable
			                               placeholder="请选择" >
				                    <el-option
						                    v-for="item in driverReelList"
						                    :label="item.text"
						                    :value="item.text" >
				                    </el-option >
			                    </el-select >
		                    </el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
							<el-form-item label="横档数量：" :label-width="formLabelWidth" >
							<el-input-number style="float: left"
							                 v-model="form.driverHorizonNum"
							                 :step="1"
							                 controls-position="right"
							                 :min="1"
							                 :max="100" >
							</el-input-number >
							</el-form-item >
		                 </el-col >
		                 <el-col :span="6" :offset="0" >
							<el-form-item label="直档数量：" :label-width="formLabelWidth" >
							<el-input-number style="float: left"
							                 v-model="form.driverVerticalNum"
							                 :step="1"
							                 controls-position="right"
							                 :min="1"
							                 :max="100" >
							</el-input-number >
							</el-form-item >
						</el-col >
	                 </div >
	            </div >


	            <div class="panel panel-primary" >
		            <div class="panel-heading" style="text-align: left" >
	                    <h3 class="panel-title" >价格信息</h3 >
	                </div >
	                <div class="panel-body" >
						<table border="1" width="100%" >
							<tr >
								<td rowspan="2" width="20%" >
									装置
								</td >
								<td width="100px" >
									冠军金片
								</td >
								<td >
									<el-select
											style="margin: 10px;margin: 10px;width: 90%"
											v-model="form.champion"
											clearable
											placeholder="请选择" >
						                    <el-option
								                    v-for="item in championGoldList"
								                    :label="item.text"
								                    :value="item.text" >
						                    </el-option >
			                        </el-select >
								</td >
								<td >
										<el-input-number
												style="float: left;margin: 10px;width: 90%"
												v-model="form.championPrice"
												:step="1"
												controls-position="right"
												:min="1"
												:max="100" >
										</el-input-number >
								</td >
								<td >
									<div >
										元
									</div >
								</td >
							</tr >
							<tr >
								<td >
									佳字绳绣
								</td >
								<td >
									<el-select
											style="margin: 10px;margin: 10px;width: 90%"
											v-model="form.jiazixiu"
											clearable
											placeholder="请选择" >
					                    <el-option
							                    v-for="item in jiaZiXiuPricelList"
							                    :label="item.text"
							                    :value="item.text" >
					                    </el-option >
			                        </el-select >
								</td >
									<td >
										<el-input-number
												style="float: left;margin: 10px;width: 90%"
												v-model="form.jiaziPrice"
												:step="1"
												controls-position="right"
												:min="1"
										>
										</el-input-number >
								</td >
								<td >
									<div >
										元
									</div >
								</td >
							</tr >
							<tr >
								<td colspan="3" >
									机器价格
								</td >
								<td >
									<el-input-number
											style="float: left;margin: 10px;width: 90%"
											v-model="form.machinePrice"
											:step="1"
											controls-position="right"
											:min="1"
									>
									</el-input-number >
								</td >
								<td >
									元
								</td >
							</tr >
							<tr >
								<td colspan="3" >
									订单总价
								</td >
								<td >
									<el-input-number
											style="float: left;margin: 10px;width: 90%"
											v-model="form.orderPrice"
											:step="1"
											:format="00"
											controls-position="right"
											:min="1"
									>
									</el-input-number >
								</td >
								<td >
									元
								</td >
							</tr >
						</table >
	                </div >
	            </div >
            </el-form >

            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px;"
                      :title="errorMsg"
                      type="error"
                      :closable="false"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer" style="margin-bottom: 20px" >
                <el-button @click="addDialogVisible = false" icon="el-icon-back" >取 消</el-button >
                <el-button type="primary" @click="onAdd" icon="el-icon-check" >确 定</el-button >
            </div >
        </el-dialog >

        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" >
            <span >确认要删除账号为[ <b >{{selectedItem.account}}</b > ]的用户吗？</span >
            <span slot="footer" class="dialog-footer" >
	    <el-button @click="deleteConfirmVisible = false" icon="el-icon-back" >取 消</el-button >
	    <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check" >确 定</el-button >
	  </span >
        </el-dialog >
    </div >
</template >

<script >
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    export default {
	    name: "order_manage",
	    components: {},
	    data () {
		    _this = this;
		    return {
			    addUrl: HOST + "machine/order/add",
			    editUrl: HOST + "machine/order/update",
			    deleteUrl: HOST + "machine/order/delete",
			    queryCountUrl: HOST + "machine/order/selectOrderCount",
			    queryDataUrl: HOST + "machine/order/selectOrders",
			    isError: false,
			    errorMsg: '',
			    totalRecords: 0,
			    selectedItem: {},
			    deleteConfirmVisible: false,
			    queryUserRoleUrl: HOST + "role/list",
			    queryMachineTypeURL: HOST + "machine/type/list",
			    tableData: [],
			    //分页
			    pageSize: EveryPageNum,//每一页的num
			    currentPage: 1,
			    startRecord: 0,

			    packageModeList: PackageModeList,
			    orderStatusList: OrderStatusList,
			    countryList: CountryList,
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


			    //增加对话框
			    addDialogVisible: false,
			    form: {
				    account: "",
				    card_id: '',
				    name: "",
				    password: "",
				    confirmpwd: "",
				    role_id: "",
				    role_name: "",
				    qualification: [],
			    },
			    formLabelWidth: '100px',

			    isEdit: false,
			    modifyForm: {
				    id: '',
				    account: "",
				    card_id: '',
				    name: "",
				    password: "",
				    confirmpwd: "",
				    role_id: "",
				    role_name: "",
				    qualification: [],
			    },
			    filters: {
				    name: "",
				    account: "",
				    role_id: "",
				    role_name: "",
				    selectDate: "",
			    },
			    allRoles: [],
			    loadingUI: false,


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

		    onCourseDetail(item)
		    {
			    _this.selectedItem = item;

		    },

		    onChange: function () {
			    if (_this.addDialogVisible) {
				    _this.isError = _this.validateForm(_this.form, false);
			    }
			    else {
				    _this.isError = _this.validateForm(_this.form, true);
			    }

		    },

		    handleCurrentChange(val) {
			    this.currentPage = val;
			    this.startRecord = this.pageSize * (this.currentPage - 1)
			    this.onSearchDetailData();
		    },
		    search() {
			    _this.filters.role_id = _this.roleNametoID(_this.filters.role_name);
			    _this.onSearchRecordCounts();
		    },
		    onSearchDetailData()
		    {
			    _this.filters.start_record = _this.startRecord;
			    _this.filters.page_size = _this.pageSize;
			    $.ajax({
				    url: _this.queryDataUrl,
				    type: 'POST',
				    dataType: 'json',
				    data: _this.filters,
				    success: function (res) {
					    if (res.code == 200) {
						    var dataList = res.data.list;
						    //list.splice(0, 1);//remove 1 element from index 0
						    _this.tableData = dataList;
						    //console.log(_this.tableData);
					    }
					    _this.loadingUI = false;
				    }
			    })
		    },

		    onSearchRecordCounts()
		    {
			    _this.tableData = new Array();
			    _this.loadingUI = true;
			    $.ajax({
				    url: _this.queryDataUrl,
				    type: 'POST',
				    dataType: 'json',
				    data: _this.filters,
				    success: function (res) {
					    if (res.code == 200) {
						    _this.totalRecords = parseInt(res.totalconunt);
						    _this.onSearchDetailData();
					    }
				    },
			    })
		    },


		    handleAdd() {
			    this.form = {
				    id: '',
				    account: "",
				    name: "",

			    };
			    this.isEdit = false;
			    this.isError = false;
			    this.errorMsg = '';
			    this.addDialogVisible = true;
		    },

		    handleEdit(index, item) {
			    this.isError = false;
			    this.errorMsg = '';
			    this.selectedItem = item;
			    this.form = copyObject(this.selectedItem);
			    this.isEdit = true;
			    this.addDialogVisible = true;
		    },

		    handleDelete(index, item) {
			    this.selectedItem = copyObject(item);
			    if (this.selectedItem) {
				    _this.deleteConfirmVisible = true;
			    }
		    },

		    onConfirmDelete: function () {
			    _this.deleteConfirmVisible = false;
			    $.ajax({
				    url: _this.deleteUrl,
				    type: 'POST',
				    dataType: 'json',
				    data: _this.selectedItem,
				    success: function (data) {
					    if (data.status > 0) {
						    var index = _this.tableData.indexOf(_this.selectedItem);
						    _this.tableData.splice(index, 1);

						    _this.onSearchRecordCounts();

						    showMessage(_this, '删除成功', 1);
					    } else {
						    showMessage(_this, '删除失败', 0);
					    }
				    },
				    error: function (info) {
					    showMessage(_this, '服务器访问出错', 0);
				    }
			    })
		    },

		    validateForm(formObj, isEdit)
		    {
			    var iserror = false;
			    if (!iserror && isStringEmpty(formObj.contractNum)) {
				    iserror = true;
				    this.errorMsg = '合同号不能为空';
			    }
//			    if (!iserror && isStringEmpty(formObj.id)) {
//				    iserror = true;
//				    this.errorMsg = '订单号不能为空';
//			    }
			    if (!iserror && isStringEmpty(formObj.sellman)) {
				    iserror = true;
				    this.errorMsg = '销售人员不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.packageMethod)) {
				    iserror = true;
				    this.errorMsg = '请选择包装方式';
			    }


			    if (!iserror && isStringEmpty(formObj.customer)) {
				    iserror = true;
				    this.errorMsg = '客户不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.country)) {
				    iserror = true;
				    this.errorMsg = '请选择国家';
			    }
			    if (!iserror && isStringEmpty(formObj.brand)) {
				    iserror = true;
				    this.errorMsg = '请选择商标';
			    }
			    if (!iserror && isStringEmpty(formObj.machineType)) {
				    iserror = true;
				    this.errorMsg = '请选择机型';
			    }


			    if (!iserror && isStringEmpty(formObj.specialTowelDaxle)) {
				    iserror = true;
				    this.errorMsg = 'D轴上不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.specialTowelMotor)) {
				    iserror = true;
				    this.errorMsg = '主电机不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.specialTowelMotor)) {
				    iserror = true;
				    this.errorMsg = '主电机不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.specialTapingHead)) {
				    iserror = true;
				    this.errorMsg = '盘带头不能为空';
			    }
			    if (!iserror && isStringEmpty(formObj.specialTowelNeedle)) {
				    iserror = true;
				    this.errorMsg = '毛巾机针不能为空';
			    }


			    if (!iserror && isStringEmpty(formObj.electricPc)) {
				    iserror = true;
				    this.errorMsg = '请选择电脑';
			    }
			    if (!iserror && isStringEmpty(formObj.electricMotor)) {
				    iserror = true;
				    this.errorMsg = '请选择主电机';
			    }
			    if (!iserror && isStringEmpty(formObj.electricMotorXy)) {
				    iserror = true;
				    this.errorMsg = '请选择XY电机';
			    }
			    if (!iserror && isStringEmpty(formObj.electricTrim)) {
				    iserror = true;
				    this.errorMsg = '请选择剪线方式';
			    }
			    if (!iserror && isStringEmpty(formObj.electricPower)) {
				    iserror = true;
				    this.errorMsg = '请选择电源';
			    }
			    if (!iserror && isStringEmpty(formObj.electricSwitch)) {
				    iserror = true;
				    this.errorMsg = '请选择按钮开关';
			    }
			    if (!iserror && isStringEmpty(formObj.electricOil)) {
				    iserror = true;
				    this.errorMsg = '请选择加油系统';
			    }


			    if (!iserror && isStringEmpty(formObj.axleSplit)) {
				    iserror = true;
				    this.errorMsg = '请选择夹线器';
			    }
			    if (!iserror && isStringEmpty(formObj.axlePanel)) {
				    iserror = true;
				    this.errorMsg = '请选择面板';
			    }
			    if (!iserror && isStringEmpty(formObj.axleNeedle)) {
				    iserror = true;
				    this.errorMsg = '请选择机针';
			    }
			    if (!iserror && isStringEmpty(formObj.axleRail)) {
				    iserror = true;
				    this.errorMsg = '请选择机头导轨';
			    }
			    if (!iserror && isStringEmpty(formObj.axleDownCheck)) {
				    iserror = true;
				    this.errorMsg = '请选择底检方式';
			    }
			    if (!iserror && isStringEmpty(formObj.axleHook)) {
				    iserror = true;
				    this.errorMsg = '请选择旋梭';
			    }
			    if (!iserror && isStringEmpty(formObj.axleJump)) {
				    iserror = true;
				    this.errorMsg = '请选择跳跃方式';
			    }
			    if (!iserror && isStringEmpty(formObj.axleUpperThread)) {
				    iserror = true;
				    this.errorMsg = '请选择面线夹持';
			    }

			    if (!iserror && isStringEmpty(formObj.frameworkColor)) {
				    iserror = true;
				    this.errorMsg = '请选择机架颜色';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkPlaten)) {
				    iserror = true;
				    this.errorMsg = '请选择 台板';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkPlatenColor)) {
				    iserror = true;
				    this.errorMsg = '请选择 台板颜色';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkRing)) {
				    iserror = true;
				    this.errorMsg = '请选择 吊环';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkBracket)) {
				    iserror = true;
				    this.errorMsg = '请选择 电脑托架';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkStop)) {
				    iserror = true;
				    this.errorMsg = '请选择 急停装置';
			    }
			    if (!iserror && isStringEmpty(formObj.frameworkLight)) {
				    iserror = true;
				    this.errorMsg = '请选择 日光灯';
			    }


			    if (!iserror && isStringEmpty(formObj.driverType)) {
				    iserror = true;
				    this.errorMsg = '请选择 驱动类型';
			    }
			    if (!iserror && isStringEmpty(formObj.driverMethod)) {
				    iserror = true;
				    this.errorMsg = '请选择 驱动方式';
			    }
			    if (!iserror && isStringEmpty(formObj.driverReelHole)) {
				    iserror = true;
				    this.errorMsg = '请选择 绷孔架';
			    }
			    if (!iserror && isStringEmpty(formObj.driverReel)) {
				    iserror = true;
				    this.errorMsg = '请选择 绷架';
			    }


			    return iserror;
		    },

		    onAdd() {
			    _this.isError = this.validateForm(this.form, false);

			    if (!_this.isError) {
				    $.ajax({
					    url: _this.addUrl,
					    type: 'POST',
					    dataType: 'json',
					    data: {
						    machineOrder: {
							    createUserId:_this.userinfo.id,
							    customer: _this.form.customer,
							    contractNum: _this.form.contractNum,
							    contractShipDate: _this.form.contractShipDate,
							    planShipDate: _this.form.planShipDate,
							    sellman: _this.form.sellman,
							    packageMethod: _this.form.packageMethod,
							    machineNum: _this.form.machineNum,
							    mark: _this.form.mark,
							    country: _this.form.country,
							    brand: _this.form.brand,
							    machineType: _this.form.machineType,
							    needleNum: _this.form.needleNum,
							    headNum: _this.form.headNum,
							    headDistance:_this.form.headDistance,
							    xDistance:_this.form.xDistance,
							    yDistance:_this.form.yDistance,
						    },
						    orderDetail: {
							    specialTowelColor:_this.form.specialTowelColor,
							    specialTowelDaxle:_this.form.specialTowelDaxle,
							    specialTowelHaxle:_this.form.specialTowelHaxle,
							    specialTowelMotor:_this.form.specialTowelMotor,
							    specialTapingHead:_this.form.specialTapingHead,
							    specialTowelNeedle:_this.form.specialTowelNeedle,

							    electricPc:_this.form.electricPc,
							    electricMotor:_this.form.electricMotor,
							    electricMotorXy:_this.form.electricMotorXy,
							    electricTrim:_this.form.electricTrim,
							    electricPower:_this.form.electricPower,
							    electricSwitch:_this.form.electricSwitch,
							    electricOil:_this.form.electricOil,


							    axleSplit:_this.form.axleSplit,
							    axlePanel:_this.form.axlePanel,
							    axleNeedle:_this.form.axleNeedle,
							    axleRail:_this.form.axleRail,
							    axleDownCheck:_this.form.axleDownCheck,
							    axleHook:_this.form.axleHook,
							    axleJump:_this.form.axleJump,
							    axleUpperThread:_this.form.axleUpperThread,
							    axleAddition:_this.form.axleAddition,


							    frameworkColor:_this.form.frameworkColor,
							    frameworkPlaten:_this.form.frameworkPlaten,
							    frameworkPlatenColor:_this.form.frameworkPlatenColor,
							    frameworkRing:_this.form.frameworkRing,
							    frameworkBracket:_this.form.frameworkBracket,
							    frameworkStop:_this.form.frameworkStop,
							    frameworkLight:_this.form.frameworkLight,

							    driverType:_this.form.driverType,
							    driverMethod:_this.form.driverMethod,
							    driverReelHole:_this.form.driverReelHole,
							    driverReel:_this.form.driverReel,
							    driverHorizonNum:_this.form.driverHorizonNum,
							    driverVerticalNum:_this.form.driverVerticalNum,

						    },
					    },
					    success: function (res) {
						    _this.isError = res.code != 200;
						    if (!_this.isError) {
							    _this.addDialogVisible = false;
							    _this.onSearchRecordCounts();
							    showMessage(_this, '添加成功', 1);
						    } else {
							    _this.errorMsg = res.message;
							    showMessage(_this, _this.errorMsg, 0);
						    }
					    },
					    error: function (info) {
						    _this.errorMsg = '服务器访问出错！';
						    _this.isError = true;
					    }
				    })
			    }

		    },
		    onEidt() {
			    //this.modifyForm.confirmPwd = this.modifyForm.password;
			    this.modifyForm.role_id = this.roleNametoID(this.modifyForm.role_name);

			    this.isError = this.validateForm(this.modifyForm, false);
			    if (!_this.isError) {
				    $.ajax({
					    url: _this.editUrl,
					    type: 'POST',
					    dataType: 'json',
					    data: _this.modifyForm,
					    success: function (data) {
						    if (!isUndefined(data.info.errorMsg)) {
							    _this.errorMsg = data.info.errorMsg;
							    _this.isError = true;
							    showMessage(_this, _this.errorMsg, 0);//error
						    }
						    else {
							    _this.modifyDialogVisible = false;
							    _this.onSearchDetailData();
							    showMessage(_this, '修改成功', 1);
						    }
					    },
					    error: function (info) {
						    _this.errorMsg = '服务器访问出错！';
						    _this.isError = true;
					    }
				    })
			    }
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

		    _toString_ (val){
			    return val == null
					    // 如果是null就返回空字符串
					    ? ''
					    : typeof val === 'object'
					    // 如果是object就转成json
					    // 这里比较特殊的是在调用stringify时除了要转换的值，还多传了两个参数，其中第二个参数用来过滤数据，第三个参数用来控制内容的缩进
					    ? JSON.stringify(val, null, 2)
					    // 其他的都是用String来转换为字符串，其实跟调用对象的toString是一样的吧？
					    : String(val);
		    },

		    roleNametoID(rolename)
		    {
			    if (isStringEmpty(rolename)) {
				    return '';
			    }
			    var x;
			    var roleid = '';

			    for (x in _this.allRoles) {
				    if (rolename.indexOf(_this.allRoles[x].role_name) == 0 && _this.allRoles[x].role_name.indexOf(rolename) == 0) {
					    roleid = _this.allRoles[x].id;
				    }
			    }

			    return _this._toString_(roleid);//roleid.toString();
		    }
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
	    },
	    created: function () {
		    this.userinfo = JSON.parse(sessionStorage.getItem('user'));
		    if (isNull(this.userinfo)) {
			    this.$router.push({path: '/Login'});
			    return;
		    }
		    this.initAllRoles();
		    _this.initMachineType();
		    this.onSearchDetailData();

	    },
	    mounted: function () {
		    this.onSearchRecordCounts();
	    },
    }

</script >
<style >
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
</style >
