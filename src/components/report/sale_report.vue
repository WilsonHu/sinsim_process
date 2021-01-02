<template>
  <div>
    <el-col class="well well-lg" style="background-color: white;">
      <el-form :model="filters" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户:">
              <el-input v-model="filters.customer" placeholder="客户" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="合同号:">
              <el-input
                      v-model="filters.contract_num"
                      placeholder="合同号"
                      auto-complete="off"
                      clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号:">
              <el-input v-model="filters.orderNum" placeholder="订单号" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" >
            <el-form-item label="机型:">
              <el-input
                      v-model="filters.machineTypeName"
                      placeholder="机型"
                      auto-complete="off"
                      clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下单日期:">
              <el-date-picker
                style="float:left;"
                v-model="filters.selectDate"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="—"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="2" :offset="8">
            <el-button icon="el-icon-search" size="normal" type="primary" @click="search">查询</el-button>
          </el-col>
          <el-col :span="2" :offset="0">
            <el-button icon="el-icon-share" size="normal" type="danger" @click="onExport">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loadingUI"
        element-loading-text="获取数据中..."
        :data="tableData"
        border
        empty-text="暂无数据..."
        ref="singleTable"
        highlight-current-row
        show-overflow-tooltip="true"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; "
      >
        <el-table-column width="55" align="center" label="序号">
          <template scope="scope">{{scope.$index+startRow}}</template>
        </el-table-column>
        <el-table-column align="center" prop="contractNum" min-width="85" label="合同号"></el-table-column>
        <el-table-column align="center" min-width="110" prop="customer" label="客户"></el-table-column>
        <el-table-column align="center" label="订单号" min-width="145">
          <template scope="scope">
            <span>{{scope.row.orderNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="毛利率" min-width="145">
          <template scope="scope">
            <span>{{scope.row.grossProfit}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="machineType" label="机器信息"min-width="145">
          <template scope="scope">
            <div>{{scope.row.machineType.name +"/"
              + scope.row.needleNum +"/"
              + scope.row.headNum +"/"
              + scope.row.headDistance +"/"
              + scope.row.xDistance +"/"
              + scope.row.yDistance +"/"
              + scope.row.electricTrim +"/"
              + scope.row.electricPc}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="equipment" label="装置" width="150">
          <template scope="scope">
            <el-tag
              v-for="equip in getEquipmentFromJSON(scope.row.equipment)"
              :key="equip.name"
            >{{equip.name}}:{{equip.number}}个</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="装置金额" width="80">
          <template scope="scope">
            <span>{{getEquipmentAmount(scope.row.equipment)|filterNumberFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="machinePrice" label="机器单价" width="80">
          <template scope="scope">
            <span>{{scope.row.machinePrice|filterNumberFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="machineNum" label="机器台数"></el-table-column>
        <el-table-column align="center" prop="orderTotalDiscounts" label="优惠金额" width="80" />
        <el-table-column align="center" label="订单总价" width="100">
          <template scope="scope">
            <span>{{getTotalAmount(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currencyType" label="币种" />
      </el-table>
      <div class="block" style="text-align: center; margin-top: 20px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecords"
        ></el-pagination>
      </div>
    </el-col>
  </div>
</template>
<script>
var _this;

export default {
  name: 'SaleReport',
  data() {
    _this = this;
    return {
      onSearchDetailDataUrl: HOST + '/machine/order/selectOrders',
      queryMachineTypeURL: HOST + 'machine/type/list',
      allMachineType: [],
      workTaskList: [],
      filters: {
        customer: '',
        machineType: '',
        selectDate: '',
        machineTypeName: '',
        contract_num: '',
        order_num: ''
      },
      tableData: [],
      pageSize: EveryPageNum, //每一页的num
      currentPage: 1,
      startRow: 0,
      totalRecords: 0,
      totalEquipmentsAtThisPage: 0, //注意：后续这些都是本页的数据，不是全部，不包括其他页
      totalMachineNumAtThisPage: 0,   //本页台数
      totalDiscountsAtThisPage: 0,    //本页优惠
      totalAmountAtThisPage: 0,    //本页总价
      loadingUI: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    getEquipmentAmount(strData) {
      let dataArray = _this.getEquipmentFromJSON(strData);
      var res = 0;
      for (var i = 0; i < dataArray.length; i++) {
        res += parseInt(dataArray[i].price) * dataArray[i].number;
      }
      return res;
    },

    //计算当前页的各种总计
    calculateTotal(){
      var tmp1 = 0;

      //计算装备
      for (var i = 0; i <_this.tableData.length; i++)
      {
        tmp1 += this.getEquipmentAmount(_this.tableData[i].equipment);
      }
      _this.totalEquipmentsAtThisPage = tmp1;

      tmp1 = 0;
      //计算机器台数
      for (var i = 0; i <_this.tableData.length; i++)
      {
        tmp1 += _this.tableData[i].machineNum;
      }
      _this.totalMachineNumAtThisPage = tmp1;

      tmp1 = 0;
      //计算 优惠
      for (var i = 0; i <_this.tableData.length; i++)
      {
        tmp1 +=  parseInt( _this.tableData[i].orderTotalDiscounts);
      }
      _this.totalDiscountsAtThisPage = tmp1;

      tmp1 = 0;
      //计算 总价
      for (var i = 0; i <_this.tableData.length; i++)
      {
        tmp1 += _this.getTotalAmountWithInteger(_this.tableData[i]) ;//_this.tableData[i].equipment;
      }
      _this.totalAmountAtThisPage = tmp1;

    },

    getTotalAmountWithInteger(data) {
      let totalAmount = 0;
      let equipAmount = _this.getEquipmentAmount(data.equipment); //装置总金额
      //总金额=（装置总金额+机器单价）* 机器数量-优惠总金额
      totalAmount =
              [equipAmount + parseInt(data.machinePrice)] *
              parseInt(data.machineNum) -
              parseInt(data.orderTotalDiscounts);
      return  totalAmount ;
    },

    getTotalAmount(data) {
      let totalAmount = 0;
      let equipAmount = _this.getEquipmentAmount(data.equipment); //装置总金额
      //总金额=（装置总金额+机器单价）* 机器数量-优惠总金额
      totalAmount =
        [equipAmount + parseInt(data.machinePrice)] *
          parseInt(data.machineNum) -
        parseInt(data.orderTotalDiscounts);
      return number_format(totalAmount, 2, '.', ' ');
    },

    getEquipmentFromJSON(strData) {
      let res = [];
      if (strData != null && strData.length > 0) {
        res = JSON.parse(strData);
      }
      return res;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = '合计';
      sums[1] = '总数：';
      sums[2] = _this.totalRecords;
      sums[6] = '后面是本页数据：';
      sums[7] = _this.totalEquipmentsAtThisPage;
      sums[9] = _this.totalMachineNumAtThisPage;
      sums[10] = _this.totalDiscountsAtThisPage;
      sums[11] = _this.totalAmountAtThisPage;
      return sums;
    },
    handleCurrentChange(val) {
      _this.currentPage = val;
      _this.onSearchDetailData();
    },
    search() {
      _this.currentPage = 1;
      _this.onSearchDetailData();
    },
    onSearchDetailData() {
      var condition = {
        customer: _this.filters.customer,
        contract_num: _this.filters.contract_num,
        order_num: _this.filters.orderNum,
        marketGroupName: '',
        query_start_time: '',
        query_finish_time: '',
        machine_name: _this.filters.machineTypeName, //这个是机型
        is_fuzzy: true,
        page: _this.currentPage,
        size: _this.pageSize
      };
      //marketGroupName已经改用，作为部门了，只有销售才需要传部门，后端做可见限制。
      if( _this.userinfo.role.id == 7 || _this.userinfo.role.id == 9){
        condition.marketGroupName = _this.userinfo.marketGroupName;
      }
      if (
        _this.filters.selectDate != null &&
        _this.filters.selectDate.length > 0
      ) {
        condition.query_start_time = _this.filters.selectDate[0].format(
          'yyyy-MM-dd'
        );
        condition.query_finish_time = _this.filters.selectDate[1].format(
          'yyyy-MM-dd'
        );
      }
      $.ajax({
        url: _this.onSearchDetailDataUrl,
        type: 'POST',
        dataType: 'json',
        data: condition,
        success: function(res) {
          if (res.code == 200) {
            _this.totalRecords = res.data.total;
            _this.tableData = res.data.list;
            _this.startRow = res.data.startRow;
            _this.calculateTotal();

          }
          _this.loadingUI = false;
        }
      });
    },

    onExport() {
      var condition = {
        customer: _this.filters.customer,
        order_num: _this.filters.orderNum,
        query_start_time: '',
        query_finish_time: '',
        is_fuzzy: true
      };
      if (
        _this.filters.selectDate != null &&
        _this.filters.selectDate.length > 0
      ) {
        condition.queryStartTime = _this.filters.selectDate[0].format(
          'yyyy-MM-dd'
        );
        condition.queryFinishTime = _this.filters.selectDate[1].format(
          'yyyy-MM-dd'
        );
      }
      if (
        _this.filters.selectDate != null &&
        _this.filters.selectDate.length > 0
      ) {
        condition.query_start_time = _this.filters.selectDate[0].format(
          'yyyy-MM-dd'
        );
        condition.query_finish_time = _this.filters.selectDate[1].format(
          'yyyy-MM-dd'
        );
      }
      $.ajax({
        url: HOST + '/machine/order/exportToSaleExcel',
        type: 'POST',
        dataType: 'json',
        data: condition,
        success: function(data) {
          if (data.code == 200) {
            window.location.href = data.data;
            showMessage(_this, '报表导出成功！', 1);
          } else {
            showMessage(_this, '报表导出失败！', 0);
          }
          _this.loadingUI = false;
        },
        error: function(data) {
          showMessage(_this, data.message, 0);
        }
      });
    },
    initMachineType() {
      if (_this.allMachineType == null || _this.allMachineType.length == 0) {
        $.ajax({
          url: _this.queryMachineTypeURL,
          type: 'POST',
          dataType: 'json',
          data: {},
          success: function(res) {
            if (res.code == 200) {
              _this.allMachineType = res.data.list;
            }
          }
        });
      }
    }
  },

  filters: {
    filterMachineType(id) {
      var result = '';
      for (var i = 0; i < _this.allMachineType.length; i++) {
        if (id == _this.allMachineType[i].id) {
          result = _this.allMachineType[i].name;
          break;
        }
      }
      return result;
    },
    filterNumberFormat(ndata) {
      return number_format(ndata, 0, '.', ' ');
    }
  },
  created: function() {
    this.userinfo = JSON.parse(sessionStorage.getItem('user'));
    if (isNull(this.userinfo)) {
      this.$router.push({ path: '/Login' });
      return;
    }
    _this.initMachineType();
  },
  mounted: function() {
    _this.search();
  }
};
</script>

<style scoped>
.el-tag {
  margin-top: 5px;
}
</style>
