<template>
    <div id="app">
        <router-view class="router-view"></router-view>
    </div>
</template>

<script>
    import API from './api/API'
    const api = new API();
    export default {
        debug: true,
        name: 'app',
        data () {
            return {}
        },

        methods: {}
    }
</script>
<style>
    body {

        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        /*font-size: 14px;*/
        -webkit-font-smoothing: antialiased;
    }

    #app {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar {
        background: #fff;
        padding: 10px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

</style>
