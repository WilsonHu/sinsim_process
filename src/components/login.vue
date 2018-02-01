<template>
    <div class="bg">
        <div class="login-container">

            <h3 class="title">系统登录</h3>
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="60px">

                <el-form-item label="账号:" prop="account">
                    <el-input type="text"
                              prefix-icon="el-icon-tickets"
                              v-model="ruleForm2.account" auto-complete="off" placeholder="账号"
                              @change="onChange"></el-input>
                </el-form-item>
                <!--<el-form-item label="姓名:" prop="name" >-->
                <!--<el-input type="text" disabled v-model="ruleForm2.name" auto-complete="off" ></el-input >-->
                <!--</el-form-item >-->
                <el-form-item label="密码:" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"
                              prefix-icon="el-icon-goods"
                              @focus="onKeyup"></el-input>
                </el-form-item>
                <div class="alert alert-danger" v-if="isError" style="margin-top: 10px;padding: 5px;">
                    {{errorMsg}}!
                </div>
                <div style="text-align: center; margin-left: 20px">
                    <el-button type="primary" style="width:35%;" @click.native.prevent="reset"
                    >重置
                    </el-button>
                    <el-button type="primary" style="width:35%;" @click.native.prevent="login"
                    >登录
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>

</template>

<script>
    var _this;
    import "../assets/js/util"
    export default {
        data() {
            _this = this;
            return {
                submitUrl: HOST + "user/requestLogin", //HOME + "User/ajaxLogin",
                ruleForm2: {
                    account: '',
                    name: "",
                    password: ''
                }
                ,
                rules2: {}
                ,
                checked: true,
                isError: false,
                errorMsg: '',
            }
                    ;
        },
        methods: {
            validateForm()
            {
                this.errorMsg = '';
                var iserror = false;
                if (isStringEmpty(this.ruleForm2.account)) {
                    iserror = true;
                    this.errorMsg = '账号不能为空';
                }
                if (!iserror && isStringEmpty(this.ruleForm2.password)) {
                    iserror = true;
                    this.errorMsg = '密码不能为空';
                }
                return iserror;
            },

            onChange: function () {
                this.ruleForm2.name = '';
                this.isError = this.validateForm();
            },

            onKeyup: function () {
                if (isStringEmpty(_this.ruleForm2.name) && !isStringEmpty(_this.ruleForm2.account)) {
//				    $.ajax({
//					    url: this.submitUrl, //this.queryUserUrl,
//					    type: 'POST',
//					    dataType: 'json',
//					    data: {account: _this.ruleForm2.account},
//					    success: function (res) {
//						    _this.isError = res.status == 0;
//						    if (!_this.isError) {
//							    _this.ruleForm2.name = res.info.name;//res.data.name;
//						    }
//						    else {
//							    _this.errorMsg = '未找到匹配的姓名！'
//						    }
//					    },
//					    error: function (info) {
//						    _this.errorMsg = '服务器访问出错';
//						    _this.isError = true;
//					    }
//				    });
                }
                this.isError = this.validateForm();
            },
            reset: function () {
                this.ruleForm2.account = "";
                this.ruleForm2.name = "";
                this.ruleForm2.password = "";
            },

            login: function () {
                this.isError = this.validateForm();
                if (!_this.isError) {
                    $.ajax({
                        url: _this.submitUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "account": this.ruleForm2.account,
                            "password": this.ruleForm2.password,
                        },
                        success: function (res) {
                            _this.isError = res.code != 200;
                            if (!_this.isError) {
                                sessionStorage.setItem('user', JSON.stringify(res.data));//res.data
                                _this.$router.push("/home");
                            }
                            else {
                                _this.errorMsg = res.message;// '请输入正确的用户名和密码！'
                            }
                        },
                        error: function (info) {
                            _this.errorMsg = '服务器访问出错';
                            _this.isError = true;
                        }
                    });
//				    api.post(
//						    {
//							    api: _this.submitUrl,
//							    data: {
//								    "account": _this.ruleForm2.account,
//								    "password": _this.ruleForm2.password,
//								    "type": "login"
//							    },
//						    })
//						    .then(function (res) {
//							    _this.isError = data.status == 0;
//							    if (!_this.isError) {
//								    sessionStorage.setItem('user', JSO-N.stringify(data.info));
//								    _this.$router.push("/home");
//							    }
//							    else {
//								    _this.errorMsg = '请输入正确的用户名和密码！'
//							    }
//						    })
//						    .catch(function (error) {
//							    console.log(error);
//							    _this.isError = true;
//                                _this.errorMsg = '请输入正确的用户名和密码！'
//                                api.reqFail(_this, "服务器访问出错");
//						    })
                }
            },
            onkeydown: function (e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode == 13) {//enter key
                    _this.login();
                }

            },
        },
        mounted: function () {
            window.addEventListener('keydown', _this.onkeydown);
        },
        destroyed: function () {
            console.log("destroyed vue");
            window.removeEventListener('keydown', _this.onkeydown);

        },
    }

</script>

<style lang="scss" scoped>
    .bg {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height: 100%;
        /*background: url(assets/bg1.jpg) center !important;
        background-size: cover;*/
        background-image: url("../assets/img/background.jpg");
        filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
        -moz-background-size: 100% 100%;
        background-size: 100% 100%;
        background-attachment: fixed;
        -webkit-font-smoothing: antialiased;
    }

    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-bottom: 20px;
        background-color: #F9FAFC;
        margin: 180px auto;
        border: 2px solid #8492A6;
        width: 450px;
        padding: 35px 35px 15px 35px;
    }

    .title {
        width: 380px;
        margin-bottom: 40px;
        text-align: center;
        color: #505458;
        font-weight: bold;
    }
</style>