<template xmlns:v-bind="http://www.w3.org/1999/xhtml" >
    <el-container>
        <el-header  style="background: whitesmoke; height: 100px">
            <el-row style="margin-top: 20px">
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="8">
                            <div style="font-size: 20px;font-weight: bold">安装中：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 36px; font-weight: bold;">{{installing_machine}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row type="flex" justify="center">
                        <el-col :span="8">
                            <div style="font-size: 20px;font-weight: bold">异常中：</div>
                        </el-col>
                        <el-col :span="5">
                            <div style="font-size: 36px; font-weight: bold; color: #FA5555">{{abnormal_machine}}</div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row type="flex" class="row-bg" justify="center" style="margin-top: 50px">
                <el-col :sapn="6">
                    <div id="installing" style="width:100%; height:500px; "></div>
                </el-col>
                <el-col :sapn="6">
                    <div id="abnormal" style="width:100%;height: 500px;"></div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>


</template >

<script >
    var _this;
    import echarts from 'echarts';

    export default {
        name: "home_show",
        components: {},
        data () {
            _this = this;
            return {
                installing_machine: 88,
                abnormal_machine: 1,
                installData:[115, 200, 136, 100, 300, 205, 115, 200, 136, 100, 300, 205],
                abnormalData:[
                    {
                        name:'缺料',
                        type:'bar',
                        stack: '异常',
                        data:[15, 20, 12, 10, 3, 5, 15, 20, 16, 1, 3, 8],
//                        itemStyle:{
//                            normal:{color:'#FA5555'}
//                        },
                    },
                    {
                        name:'安装错误',
                        type:'bar',
                        stack: '异常',
                        data:[5, 2, 3, 10, 1, 0, 1, 6, 7, 1, 3, 8]
                    },
                    {
                        name:'检验不合格',
                        type:'bar',
                        stack: '异常',
//                        itemStyle:{
//                            normal:{color:'yellow'}
//                        },
                        data:[1, 2, 0, 3, 8, 5, 5, 10, 6, 1, 3, 4]
                    }
                ]
            }
        },
        methods: {

        },
        computed: {},
        filters: {

        },
        created: function () {

        },
        mounted: function () {
            // 基于准备好的dom，初始化echarts实例
            var installingChart = echarts.init(document.getElementById('installing'));
            var abnormalChart = echarts.init(document.getElementById('abnormal'));

            // 指定图表的配置项和数据
            var installOption = {
                color: ['#3398DB'],
                title: {
                    text: '安装台数/月'
                },
                tooltip: {},
                legend: {
                    data:['安装数']
                },
                xAxis: {
                    data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
                },
                yAxis: {},
                series: [{
                    name: '安装数',
                    type: 'bar',
                    data: _this.installData
                }]
            };

            // 指定图表的配置项和数据
            var abnormalOption = {
                title: {
                    text: '异常次数/月'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['缺料', '安装错误', '检验不合格']
                },
                xAxis: {
                    data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
                },
                yAxis: {
                    type : 'value'
                },
                series:_this.abnormalData
            };

            // 使用刚指定的配置项和数据显示图表。
            installingChart.setOption(installOption);
            abnormalChart.setOption(abnormalOption);
        },
        destroyed: function () {
        }
    }

</script >

<style lang="scss" scoped >

</style >