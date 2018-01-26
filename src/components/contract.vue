<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-container>
        <el-aside  width="145px" >
            <el-col >
                <el-menu style="background-color: transparent" :default-active="$route.path"  @select="handleSelect" >
                    <div v-for="root in $router.options.routes" v-if="!root.hidden" >
                        <div v-for="sub in root.children" v-if="!sub.hidden" >
                            <el-menu-item v-for="item in sub.children" :index="item.path"
                                          v-if="sub.path == '/home/contract'"
                                          style="text-align: center; font-size: 14px; font-weight: bold">
                                {{item.meta}}
                            </el-menu-item >
                        </div >
                    </div >
                </el-menu >
            </el-col >
        </el-aside>
        <el-main>
            <router-view ></router-view >
        </el-main >
    </el-container>
</template >

<script >
    import Vue from 'vue'
    var _this;
    export default {
	    name: "contract",
	    components: {},
	    data () {
		    _this = this;
		    return {

            }
	    },
	    methods: {

		    handleSelect(key, keyPath) {
			    _this.$router.push(key)
		    },

	    },
	    computed: {},
	    created: function () {
		    _this.$router.push("/home/contract/contract_sign");
	    },
	    mounted: function () {

	    },
    }

</script >

