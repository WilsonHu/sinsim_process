<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-container>
        <el-aside width="145px" >
            <el-col>
                <el-menu style="background-color: transparent" :default-active="$route.path" theme="dark" @select="handleSelect" >
                    <div v-for="root in $router.options.routes" v-if="!root.hidden">
                        <div v-for="sub in root.children" v-if="!sub.hidden">
                            <el-menu-item v-for="item in sub.children" :index="item.path"
                                          v-if="sub.path == '/home/task'"
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
    var _this

    export default {
        name: "task",
        components: {},
        data () {
            _this = this;
            return {}
        },
        methods: {

		    handleSelect(key, keyPath) {
			    _this.$router.push(key)
		    },

	    },
	    computed: {},
	    created: function () {
//		    var path = _this.$router.options.routes;
		    _this.$router.push("/home/task/task_content_manage");
//            if (window.location.hash != null) {
//                let hit = false;
//                for (let i = 0; i < _this.$router.options.routes.length; i++) {
//                    if (!_this.$router.options.routes[i].hidden && _this.$router.options.routes[i].children.length > 0) {
//                        for (let j = 0; j < _this.$router.options.routes[i].children.length; j++) {
//                            if (_this.$router.options.routes[i].children[j].path == "/home/system") {
//                                for (let k = 0; k < _this.$router.options.routes[i].children[j].children.length; k++) {
//                                    if (window.location.hash.indexOf(_this.$router.options.routes[i].children[j].children[k].path) != -1) {
//                                        hit = true;
//                                        break;
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//                if (!hit) {
//                    //TODO:跳转至第一个有权限的URL
//                    let firstPath = JSON.parse(getAuthArray(3))[0];
////          alert(firstPath)
//                    _this.$router.push(firstPath);
//                }
//            }
	    },
	    mounted: function () {

        },
    }

</script>
<style>

</style>
