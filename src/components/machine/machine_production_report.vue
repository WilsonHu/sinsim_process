<template>
    <div>
        <el-form>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="生产日期:">
                        <el-date-picker
                                type="daterange"
                                align="left"
                                unlink-panels
                                range-separator="—"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button
                            icon="el-icon-search"
                            size="normal"
                            type="primary"
                            @click="search">查询
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="安装组">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="完成数量">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="安装中数量">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    var _this;

    export default {
        name: "machine_production_report",
        data() {
            _this = this;
            return {
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
        }
    }
</script>

<style scoped>

</style>