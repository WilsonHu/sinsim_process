<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="bg">
    <el-container>
      <el-header style="background-color: steelblue">
        <el-row>
          <el-col :span="2">
            <span
              style="cursor: pointer;color: #409eff;font-size: 26px; font-weight: bolder; float: left"
              @click="goToHome()"
            >
              <img src="../assets/img/sinsim_logo.png" style="height: 30px; margin-left: 10px" />
            </span>
          </el-col>
          <el-col :span="17">
            <el-menu
              background-color="#4682B4"
              text-color="#2D2F33"
              active-text-color="white"
              style="background-color: transparent;"
              mode="horizontal"
              :default-active="filterParentPath($route.path)"
              @select="handleSelect"
            >
              <template v-for="item in $router.options.routes" v-if="!item.hidden">
                  <el-menu-item
                          v-for="child in item.children"
                          :index="child.path"
                          v-show="!child.hidden && child.meta && showMenu(child.path)"
                          style="font-size: 17px;font-weight: bold">
                      <el-badge :value="toSignCount" :max="99" v-if="child.path == '/home/contract'">
                      {{child.meta}}
                    </el-badge>
                    <p v-else="child.path != '/home/contract'">{{child.meta}}</p>

                  </el-menu-item>
              </template>
            </el-menu>
          </el-col>
          <el-col :span="4">
            <div>
              <label style="font-size: 15px;color: #f4f4f4;font-weight: normal;">欢迎您</label>
              <label
                style="font-size: 26px;
                                    color: #f4f4f4;
                                    cursor: pointer;
                                    font-style: italic;font-weight: normal;
                                    padding-left: 10px"
                @click="showUserInfo"
              >{{userinfo.name}}</label>
              <label
                style="font-size: 16px;color: #3c3c3c;font-weight: bold; padding-left: 10px"
              >{{userinfo.role.roleName}}</label>
            </div>
          </el-col>
          <el-col :span="1">
            <button type="button" class="btn btn-link" v-on:click="logout" style="color: white;">
              <span class="glyphicon glyphicon-log-out"></span> 退出
            </button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <router-view></router-view>
      </el-container>
      <!--<el-footer >Footer</el-footer >-->
    </el-container>
    <el-dialog title="用户密码修改" :visible.sync="userInfoDialog" size="tiny">
      <el-row>
        <el-form>
          <el-col :span="20">
            <el-form-item label="帐号：" :label-width="formLabelWidth">
              <el-input type="text" disabled v-model="submitUser.account" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="用户名：" :label-width="formLabelWidth">
              <el-input type="text" disabled v-model="submitUser.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="原密码：" :label-width="formLabelWidth">
              <el-input
                type="password"
                autofocus
                v-model="submitUser.oldPassword"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="新密码：" :label-width="formLabelWidth">
              <el-input
                v-if="!isShowPwd"
                type="password"
                autofocus
                v-model="submitUser.password"
                auto-complete="off"
              ></el-input>
              <el-input v-else type="text" v-model="submitUser.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-checkbox v-model="isShowPwd" style="margin-top: 6px;margin-left: 3px;">显示密码</el-checkbox>
          </el-col>
        </el-form>
      </el-row>
      <el-alert :title="errorMsg" v-show="isError" type="error" show-icon></el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInfoDialog = false">取 消</el-button>
        <el-button
          type="success"
          @click="onConfirmUpdate"
          :disabled="validateUserPwd(submitUser)"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div class="modal fade" id="logOutConfirmMsg" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header" style="text-align: left">
            <h3>提示</h3>
          </div>
          <div class="modal-body" style="font-size: 18px;font-family: FontAwesome">
            <!-- 加上<form>标签可以使得modal窗口在点击按钮都自动dismiss-->
            确认要注销登录吗？
            <button
              type="button"
              style="margin-top: 50px;font-size: 18px"
              class="btn btn-danger btn-block"
              v-on:click="onConfirmLogOut"
            >确 定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
var _this;
$(function() {
  $('#modifyPwdDialog').on('hidden.bs.modal', function() {
    _this.onConfirmLogOut();
  });
});
export default {
  name: 'home',
  components: {},
  data() {
    _this = this;
    return {
      system_name: SYSTEMNAME,
      currentSec: 3,
      timerDestroyed: false,
      current_time: '',
      activeIndex: '1',
      userinfo: {},
      subDepartments: [],
      isError: false,
      errorMsg: '',
      currentUserRoleScope: {},
      formLabelWidth: '100px',
      userInfoDialog: false,
      submitUser: {
        account: '',
        name: '',
        oldPassword: '',
        password: ''
      },
      isShowPwd: false,
        toSignCount: 0,
        userDomesticTradeZoneListStr:""
    };
  },
  methods: {
    loadconfigData() {
      sessionStorage.removeItem('contract_config');
      $.ajax({
        url: HOST + 'data/config/list',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
          if (data.code == 200) {
            try {
              let list = [];
              if (data.data.list.length > 0) {
                try {
                  list = JSON.parse(data.data.list[0].data); //取数据库data字段为JSON字符,再转为对象数组
                } catch (ex) {}
              }
              let configList = [];
              if (list != null && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                  if (list[i].item == 'contract') {
                    //目前只支持合同页面数据配置
                    configList = list[i].data;
                    break;
                  }
                }
                if (configList.length > 0) {
                  sessionStorage.setItem(
                    'contract_config',
                    JSON.stringify(configList)
                  );
                }
              }
            } catch (ex) {
              console.log(ex);
            }
          } else {
            showMessage(_this, data.message, 0);
          }
        },
        error: function(data) {
          showMessage(_this, '服务器访问出错', 0);
        }
      });
    },
    goToHome() {
      _this.$router.push('/home');
    },

    validateUserPwd(userObj) {
      return (
        isStringEmpty(userObj.password) || isStringEmpty(userObj.oldPassword)
      );
    },

    showUserInfo() {
      _this.submitUser.account = _this.userinfo.account;
      _this.submitUser.name = _this.userinfo.name;
      _this.submitUser.password = '';
      _this.submitUser.oldPassword = '';
      _this.isShowPwd = false;
      _this.isError = false;
      _this.userInfoDialog = true;
    },

    submitNewPassword: function() {
      $.ajax({
        url: HOST + 'user/update',
        type: 'POST',
        dataType: 'json',
        data: {
          user: JSON.stringify({
            id: _this.userinfo.id,
            password: _this.submitUser.password
          })
        },
        success: function(data) {
          if (data.code == 200) {
            _this.userInfoDialog = false;
            showMessage(_this, '密码修改成功', 1);
          } else {
            _this.errorMsg = '密码修改失败';
            showMessage(_this, _this.errorMsg, 0);
          }
        },
        error: function(error) {
          console.log(error);
          showMessage(_this, error, 0);
        }
      });
    },

    onConfirmUpdate() {
      $.ajax({
        url: HOST + 'user/requestLogin',
        type: 'POST',
        dataType: 'json',
        data: {
          account: _this.submitUser.account,
          password: _this.submitUser.oldPassword
        },
        success: function(data) {
          if (data.code == 200) {
            _this.submitNewPassword();
          } else {
            _this.errorMsg = '原密码不正确，请重新输入!';
            _this.isError = true;
            //                            showMessage(_this, "原密码不正确，请重新输入!", 0);
          }
        },
        error: function(error) {
          _this.errorMsg = '原密码不正确，请重新输入!';
          _this.isError = true;
          //                        showMessage(_this, "原密码不正确，请重新输入!", 0);
        }
      });
    },
    getCurrentDate: function() {
      var cdata = new Date();
      this.current_time = cdata.toLocaleTimeString('yyyy-MM-dd HH:mm:ss');
    },

    logout: function() {
      $('#logOutConfirmMsg').modal();
    },
    onConfirmLogOut: function() {
      //sessionStorage.removeItem('user');
      _this.$router.push('/login');
    },

    handleSelect(key, keyPath) {
      _this.$router.push(key);
    },

    //根据子路径找到父路径
    filterParentPath(childPath) {
      let path = '/home'; //default
      for (let i = 0; i < _this.$router.options.routes.length; i++) {
        if (
          !_this.$router.options.routes[i].hidden &&
          _this.$router.options.routes[i].children.length > 0
        ) {
          for (
            let j = 0;
            j < _this.$router.options.routes[i].children.length;
            j++
          ) {
            if (
              childPath.indexOf(
                _this.$router.options.routes[i].children[j].path
              ) != -1
            ) {
              path = _this.$router.options.routes[i].children[j].path;
              break;
            }
          }
        }
      }
      return path;
    },

    //是否显示主menu
    showMenu(path) {
      //path格式/home/contract
      let pathList = path.split('/');
      if (
        pathList != null &&
        pathList.length == 3 &&
        _this.currentUserRoleScope[pathList[2]] != null
      ) {
        return true;
      } else {
        return false;
      }
    },

    fetchUserRoleScope(roleId) {
      $.ajax({
        url: HOST + 'role/detail',
        type: 'POST',
        dataType: 'json',
        data: { id: roleId },
        success: function(data) {
          if (data.code == 200) {
            _this.currentUserRoleScope = JSON.parse(data.data.roleScope);
          } else {
            showMessage(_this, data.message, 0);
          }
        },
        error: function(data) {
          showMessage(_this, '服务器访问出错！', 0);
        }
      });
    },
      getUserDomesticTradeZoneListStr() {
          if (_this.userinfo.marketGroupName == '内贸部') {
              //根据账号返回内贸区域
              $.ajax({
                  url: HOST + 'domestic/trade/zone/getDomesticTradeZone',
                  type: 'POST',
                  dataType: 'json',
                  data: { account: _this.userinfo.account},
                  success: function(data) {
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
                  error: function(data) {
                      showMessage(_this, '服务器访问失败！', 0);
                  }
              });
              return '';
          } else {
              _this.selectContracts();
              return '';
          }
      },

      selectContracts() {
          var condition = {
              status: 1,
              marketGroupName: '',
              userDomesticTradeZoneListStr: _this.userDomesticTradeZoneListStr,
          };
          if( _this.userinfo.role.roleName != "超级管理员") {
              condition.roleName = _this.userinfo.role.roleName;
          }
        //marketGroupName已经改用，作为部门了，只有销售才需要传部门，后端做可见限制。
        if( _this.userInfo.role.id == 7 || _this.userInfo.role.id == 9){
          condition.marketGroupName = _this.userInfo.marketGroupName;
        }
          $.ajax({
              url: HOST + 'contract/selectContracts',
              type: 'POST',
              dataType: 'json',
              data: condition,
              success: function(data) {
                  if (data.code == 200) {
                      _this.toSignCount = data.data.total;
                    //应该在获取合同待签核数之后再发起查询联系单待签核数
                    _this.selectLxd();
                  }
              }
          });
      },

    selectLxd() {
      var condition = {
        status: 1, //LXD_CHECKING
      };
      if( _this.userinfo.role.roleName != "超级管理员") {
        condition.currentStep = _this.userinfo.role.roleName;
      }
      $.ajax({
        url: HOST + 'contact/form/selectContacts',
        type: 'POST',
        dataType: 'json',
        data: condition,
        success: function(data) {
          if (data.code == 200) {
            _this.toSignCount  = _this.toSignCount + data.data.total;
          }
        }
      });
    },
  },
  computed: {},
  filters: {},
  created: function() {
    _this.userinfo = JSON.parse(sessionStorage.getItem('user'));
    _this.fetchUserRoleScope(this.userinfo.role.id); 
    _this.getUserDomesticTradeZoneListStr();
    _this.loadconfigData();
  },
  mounted: function() {
    //		    setInterval(function getDate() {
    //			    var date = new Date();
    //			    _this.current_time = date.format("yyyy-MM-dd hh:mm:ss");
    //		    }, 1000);//定时器
  },
  destroyed: function() {
    window.clearInterval(this.reduceTime);
  }
};
</script>
<style>
.bg {
  overflow-y: scroll;
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  color: #333;
  text-align: center;
}
.el-badge__content.is-fixed {
  position: absolute;
  top: 15px;
  right: 15px;
  -webkit-transform: translateY(-50%) translateX(100%);
  transform: translateY(-50%) translateX(100%);
}
</style>
