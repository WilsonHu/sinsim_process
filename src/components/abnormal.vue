<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-container>
        <el-aside style="width:145px;">
            <el-col>
                <el-menu style="background-color: transparent" :default-active="$route.path" @select="handleSelect">
                    <div v-for="root in $router.options.routes" v-if="!root.hidden">
                        <div v-for="sub in root.children" v-if="!sub.hidden">
                            <el-menu-item v-for="item in sub.children" :index="item.path"
                                          v-if="sub.path == '/home/abnormal' && showSubMenu(item.path)"
                                          style="text-align: center; font-size: 14px; font-weight: bold">
                                {{item.meta}}
                            </el-menu-item>
                        </div>
                    </div>
                </el-menu>
            </el-col>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue'
    var _this;
    export default {
        name: "abnormal",
        components: {},
        data () {
            _this = this;
            return {
                userinfo: {},
                currentUserRoleScope: {}
            }
        },
        methods: {

            handleSelect(key, keyPath) {
                _this.$router.push(key)
            },
            //是否显示子menu
            showSubMenu(path) {
                //path格式/home/contract/contract_sign
                let pathList = path.split("/");
                if (pathList != null && pathList.length == 4 && _this.currentUserRoleScope[pathList[2]] != null) {
                    let relatedScopeList = _this.currentUserRoleScope[pathList[2]];
                    for (let j = 0; j < relatedScopeList.length; j++) {
                        if (relatedScopeList[j] == path) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return false;
                }
            },
            fetchUserRoleScope(roleId) {
                $.ajax({
                    url: HOST + "role/detail",
                    type: 'POST',
                    dataType: 'json',
                    data: {"id": roleId},
                    success: function (data) {
                        if (data.code == 200) {
                            _this.currentUserRoleScope = JSON.parse(data.data.roleScope);
                        } else {
                            showMessage(_this, data.message, 0);
                        }
                    },
                    error: function (data) {
                        showMessage(_this, '服务器访问出错！', 0);
                    }
                })
            }

        },
        computed: {},
        created: function () {
            _this.$router.push("/home/abnormal/abnormal_statistic_manage");
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            this.fetchUserRoleScope(this.userinfo.role.id);
        },
        mounted: function () {
        },
    }

</script>

