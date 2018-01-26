<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <div class="bg">
        <el-container >
            <el-header style="background-color: steelblue">
                <el-row>
                    <el-col :span="2">
                        <span style="cursor: pointer;color: #409eff;font-size: 26px; font-weight: bolder; float: left" @click="goToHome()">
                            <img src="/src/assets/img/sinsim_logo.png" style="height: 30px; margin-left: 10px">
                        </span>
                    </el-col >
                    <el-col :span="16">
                        <el-menu   background-color="#4682B4"
                                   text-color="#2D2F33"
                                   active-text-color="white" style="background-color: transparent;" mode="horizontal" :default-active="$route.path | filterParentPath" @select="handleSelect">
                            <template v-for="item in $router.options.routes" v-if="!item.hidden" >
                                <el-menu-item
                                        v-for="child in item.children"
                                        :index="child.path"
                                        v-show="!child.hidden && child.meta"
                                        style="font-size: 17px;font-weight: bold" >
                                    {{child.meta}}
                                </el-menu-item >
                            </template >
                        </el-menu >
                    </el-col>
                    <el-col :span="5">
                        <div>
                            <label style="font-size: 15px;color: #f4f4f4;font-weight: normal;" >
                                欢迎您
                            </label>
                            <label style="font-size: 18px;color: #f4f4f4;font-style: italic;font-weight: normal; padding-left: 10px" >
                                {{userinfo.name}}
                            </label >
                            <label style="font-size: 16px;color: #3c3c3c;font-weight: bold; padding-left: 10px">{{userinfo.role.roleName}}</label>
                        </div >
                    </el-col >
                    <el-col :span="1" >
                         <button type="button" class="btn btn-link" v-on:click="logout"
                                 style="color: white;" >
                                 <span class="glyphicon glyphicon-log-out" ></span > 退出
                        </button >
                    </el-col >
                </el-row >
            </el-header >
            <el-container>
                <router-view></router-view >
            </el-container>
            <!--<el-footer >Footer</el-footer >-->
        </el-container >
        <div class="modal fade" id="logOutConfirmMsg" role="dialog" >
            <div class="modal-dialog" >
                <!-- Modal content-->
                <div class="modal-content" >
                    <div class="modal-header" style="text-align: left" >
                        <h3 >提示</h3 >
                    </div >
                    <div class="modal-body" style="font-size: 18px;font-family: FontAwesome" >
                        <!-- 加上<form>标签可以使得modal窗口在点击按钮都自动dismiss-->
                        确认要注销登录吗？
                        <button type="button" style="margin-top: 50px;font-size: 18px" class="btn btn-danger btn-block"
                                v-on:click="onConfirmLogOut" >确 定
                        </button >
                    </div >
                </div >
            </div >
        </div >
    </div >
</template >

<script >
    import Vue from 'vue'
    var _this
    $(function () {
	    $('#modifyPwdDialog').on('hidden.bs.modal', function () {
		    _this.onConfirmLogOut();
	    })
    });
    export default {
	    name: "home",
	    components: {},
	    data () {
		    _this = this
		    return {
			    system_name: SYSTEMNAME,
			    currentSec: 3,
			    timerDestroyed: false,
			    fetchSubDepartmentsURL: HOME + "DepartmentInfo/fetchSubDepartments",
			    current_time: '',
			    activeIndex: "1",
			    userinfo: {}
			    ,
			    subDepartments: [],
			    isError: false,
			    errorMsg: '',
			    isErrorPwd: false,
			    errorPwdMsg: '',
			    editUrl: HOME + "User/modifyUserInfo",
			    submitData: {
				    account: '',
				    name: '',
				    oldPwd: '',
				    newPwd: "",
				    confirmNewPwd: '',
			    }
			    ,
			    modifyInfo: {
				    account: '',
				    name: '',
				    department_name: '',
				    work_post: "",
				    phone: '',
				    short_number: '',
			    }
			    ,
			    dialogDetailVisible: false,
		    }
	    },
	    methods: {
            goToHome() {
                _this.$router.push("/home");
            },

		    onUserInfo()
		    {
			    _this.dialogDetailVisible = true;
		    },

		    onModifyInfo()
		    {
			    this.verifyInfo();
			    if (!this.isError) {
				    $.ajax({
					    url: this.editUrl,
					    type: 'POST',
					    dataType: 'json',
					    data: {
						    id: _this.userinfo.id,
						    phone: _this.modifyInfo.phone,
						    short_number: _this.modifyInfo.short_number,
					    },
					    success: function (data) {
						    _this.isError = data.status == 0;
						    if (!_this.isError) {
							    _this.dialogDetailVisible = false;
							    showMessage(_this, '修改成功', 1);
						    }
						    else {
							    _this.errorMsg = '修改失败';
							    showMessage(_this, _this.errorMsg, 0);
						    }
					    },
					    error: function (info) {
						    showMessage(_this, '服务器访问出错', 0);
					    }
				    })
			    }
		    },

		    onModifyPwd()
		    {
			    this.verifyPwd();
			    if (!this.isErrorPwd) {
				    $.ajax({
					    url: this.editUrl,
					    type: 'POST',
					    dataType: 'json',
					    data: {
						    id: _this.userinfo.id,
						    password: _this.submitData.newPwd,
					    },
					    success: function (data) {
						    _this.isErrorPwd = data.status == 0;
						    if (!_this.isErrorPwd) {
							    _this.dialogDetailVisible = false;
							    //window.setInterval(_this.reduceTime, 1000)
							    $("#modifyPwdDialog").modal();
							    //showMessage(_this, '修改成功', 1);
						    }
						    else {
							    _this.errorPwdMsg = '修改失败';
							    showMessage(_this, _this.errorPwdMsg, 0);
						    }
					    },
					    error: function (info) {
						    showMessage(_this, '服务器访问出错', 0);
					    }
				    })
			    }
		    },

		    onKeyUp: function () {
			    this.verifyPwd();
		    },

		    verifyPwd: function () {
			    this.isErrorPwd = false;
			    if (isStringEmpty(this.submitData.newPwd)) {
				    this.isErrorPwd = true;
				    this.errorPwdMsg = '新密码不能为空';
			    } else if (this.submitData.newPwd != this.submitData.confirmNewPwd) {
				    this.isErrorPwd = true;
				    this.errorPwdMsg = '新密码和确认新密码不一致';
			    }

			    if (isStringEmpty(this.submitData.oldPwd)) {
				    this.isErrorPwd = true;
				    this.errorPwdMsg = '请输入正确的原密码';
			    }
		    },

		    verifyInfo: function () {
			    this.isError = false;
			    this.errorMsg = '';

			    if (this.modifyInfo.phone != '' && !regIsPhone(this.modifyInfo.phone)) {
				    this.isError = true;
				    this.errorMsg = '请输入正确的手机';
			    }
		    },


		    getCurrentDate: function () {
			    var cdata = new Date();
			    this.current_time = cdata.toLocaleTimeString("yyyy-MM-dd HH:mm:ss");
		    },

		    logout: function () {
			    $("#logOutConfirmMsg").modal();

		    },
		    onConfirmLogOut: function () {
			    sessionStorage.removeItem('user');
			    _this.$router.push("/login");
		    },

		    handleSelect(key, keyPath) {

			    _this.$router.push(key)
		    },


	    },
	    computed: {},
	    filters: {
		    //根据子路径找到父路径
		    filterParentPath(childPath) {
			    let path = "/home";//default
			    for (let i = 0; i < _this.$router.options.routes.length; i++) {
				    if (!_this.$router.options.routes[i].hidden && _this.$router.options.routes[i].children.length > 0) {
					    for (let j = 0; j < _this.$router.options.routes[i].children.length; j++) {
						    if (childPath.indexOf(_this.$router.options.routes[i].children[j].path) != -1) {
							    path = _this.$router.options.routes[i].children[j].path;
							    break;
						    }
					    }
				    }
			    }
			    return path;
		    },
	    },
	    created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
	    },
	    mounted: function () {
//		    setInterval(function getDate() {
//			    var date = new Date();
//			    _this.current_time = date.format("yyyy-MM-dd hh:mm:ss");
//		    }, 1000);//定时器
	    },
	    destroyed: function () {
		    window.clearInterval(this.reduceTime)
	    }
    }

</script >
<style >
    .bg {
        overflow-y: scroll;
        height: 100%;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        color: #333;
        text-align: center;
    }

</style >
