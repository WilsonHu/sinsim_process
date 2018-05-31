<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <div >
        <el-col class="well well-lg" style="background-color: white;" >
            <div align="right" style="margin-bottom: 20px" >
                <el-button
		                icon="el-icon-plus"
		                size="normal"
		                type="primary"
		                @click="handleAdd" >机型</el-button >
            </div >

            <el-table
		            :data="tableData"
		            border
		            style="width: 100%" >
                <el-table-column
		                width="75"
		                align="center"
		                prop="id"
		                label="序号" >
                        <template scope="scope" >
                            {{scope.$index+startRow}}
                        </template >
                </el-table-column >
                <el-table-column
		                align="center"
		                prop="name"
		                label="机型名称" >
                </el-table-column >

                <el-table-column
		                align="center"
		                label="操作"
		                width="200" >
                    <template scope="scope" >
                        <el-button
		                        size="small"
		                        icon="el-icon-edit"
		                        type="primary"
		                        @click="handleEdit(scope.row)" >编辑</el-button >
                        <el-button
		                        size="small"
		                        icon="el-icon-delete"
		                        type="danger"
		                        @click="handleDelete(scope.row)" >删除</el-button >
                    </template >
                </el-table-column >
            </el-table >
            <div class="block" style="text-align: center; margin-top: 20px" >
                <el-pagination
		                background
		                @current-change="handleCurrentChange"
		                :current-page="currentPage"
		                :page-size="pageSize"
		                layout="total, prev, pager, next, jumper"
		                :total="totalPage" >
                </el-pagination >
            </div >
        </el-col >
        <el-dialog :title="isAdd?'添加机型':'编辑机型'" :visible.sync="addDialogVisible" width="40%" >
            <el-form :model="form" >
                <el-col :span="24" >
                    <el-form-item label="机型名称：" :label-width="formLabelWidth" style="width: 60%" >
                        <el-input v-model="form.name" ></el-input >
                    </el-form-item >
                </el-col >
            </el-form >
            <el-alert v-if="isError" style="margin-top: 10px;padding: 5px"
                      :title="errorMsg"
                      type="error"
                      show-icon >
            </el-alert >
            <div slot="footer" class="dialog-footer" >
                <el-button @click="addDialogVisible = false" icon="el-icon-close" type="danger" >取 消</el-button >
                <el-button type="primary" @click="addMachineType" icon="el-icon-check" >确 定</el-button >
            </div >
        </el-dialog >
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="20%" >
		  <span >确认要删除[ <b >{{selectedItem.name}}</b > ]的机型吗？</span >
		  <span slot="footer" class="dialog-footer" >
		    <el-button @click="deleteConfirmVisible = false" icon="el-icon-close" type="danger" >取 消</el-button >
		    <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check" >确 定</el-button >
		  </span >
		</el-dialog >
    </div >
</template >

<script >
    import Vue from 'vue'
    import routes from '../../config/routes'
    let _this;
    export default {
	    name: "MachineType_manage",
	    components: {},
	    data () {
		    _this = this;
		    return {
			    tableData: [],

			    isError: false,
			    errorMsg: '',
			    //分页
			    totalPage: 1,
			    pageSize: EveryPageNum,//每一页的num
			    currentPage: 1,
			    startRow: 1,

			    //增加对话框
			    addDialogVisible: false,
			    form: {
				    id: "",
				    name: "",
			    },
			    formLabelWidth: '100px',
			    selectedItem: {},
			    deleteConfirmVisible: false,
			    isAdd: false,
		    }
	    },
	    methods: {
		    //获取所有MachineType
		    fetchMachineTypes(){
			    $.ajax({
				    url: HOST + "machine/type/list",
				    type: 'POST',
				    dataType: 'json',
				    data: {"size": _this.pageSize, "page": _this.currentPage},
				    success: function (data) {
					    if (data.code == 200) {
						    _this.tableData = data.data.list;
						    _this.totalPage = data.data.total;
						    _this.startRow = data.data.startRow;
					    } else {
						    showMessage(_this, data.message, 0);
					    }
				    },
				    error: function (data) {
					    showMessage(_this, '服务器访问出错', 0);
				    }
			    })
		    },

		    handleCurrentChange(val) {
			    this.currentPage = val;
			    _this.fetchMachineTypes();
		    },
		    handleAdd() {
			    this.isAdd = true;
			    this.form = {
				    id: "",
				    name: "",
			    };
			    this.addDialogVisible = true;
		    },

		    addMachineType() {

			    if (_this.form.name == "") {
				    showMessage(_this, "机型不能为空！", 0);
				    return;
			    }
			    if (_this.isAdd == true) {
				    $.ajax({
					    url: HOST + "machine/type/add",
					    type: 'POST',
					    dataType: 'json',
					    data: {'machineType': JSON.stringify(_this.form)},
					    success: function (data) {
						    if (data.code == 200) {
							    _this.addDialogVisible = false;
							    _this.fetchMachineTypes();
							    showMessage(_this, '添加机型成功', 1);
						    } else {
							    showMessage(_this, data.message, 0);
						    }
					    },
					    error: function (data) {
						    showMessage(_this, '服务器访问出错', 1);
					    }
				    })
			    } else {
				    $.ajax({
					    url: HOST + "machine/type/update",
					    type: 'POST',
					    dataType: 'json',
					    data: {'machineType': JSON.stringify(_this.form)},
					    success: function (data) {
						    if (data.code == 200) {
							    _this.addDialogVisible = false;
							    _this.fetchMachineTypes();
							    showMessage(_this, '修改机型成功', 1);
						    } else {
							    showMessage(_this, data.message, 0);
						    }
					    },
					    error: function (data) {
						    showMessage(_this, '服务器访问出错', 1);
					    }
				    })
			    }


		    },

		    handleEdit(item) {
			    this.isAdd = false;
			    this.form.id = item.id;
			    this.form.name = item.name;
			    _this.addDialogVisible = true;
		    },


		    handleDelete(item) {
			    _this.selectedItem = copyObject(item);
			    this.deleteConfirmVisible = true;
		    },

		    onConfirmDelete() {
			    this.deleteData(_this.selectedItem);
			    _this.deleteConfirmVisible = false;
		    },

		    deleteData(item) {
			    $.ajax({
				    url: HOST + "machine/type/delete",
				    type: 'POST',
				    dataType: 'json',
				    data: {"id": item.id},
				    success: function (data) {
					    if (data.code == 200) {
						    showMessage(_this, '删除机型成功', 1);
						    _this.fetchMachineTypes();
					    } else {
						    showMessage(_this, data.message, 0);
					    }
					    _this.deleteConfirmVisible = false;
				    },
				    error: function (data) {
					    showMessage(_this, '服务器访问出错！', 0);
					    _this.deleteConfirmVisible = false;
				    }
			    })
		    },

	    },
	    computed: {},

	    filters: {},

	    created: function () {

	    },
	    mounted: function () {
		    _this.fetchMachineTypes();
	    }
    }
</script >
<style >

</style >
