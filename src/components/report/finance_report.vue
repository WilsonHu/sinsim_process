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
          <el-col :span="6">
            <el-form-item label="机架长度:">
              <el-input
                v-model="filters.machineLength"
                placeholder="机架长度"
                auto-complete="off"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售员:">
              <el-input v-model="filters.sellman" placeholder="销售员" auto-complete="off" clearable></el-input>
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
        <el-table-column width="75" align="center" label="序号">
          <template scope="scope">{{scope.$index+startRow}}</template>
        </el-table-column>
        <el-table-column align="center" min-width="110" prop="customer" label="客户"></el-table-column>
        <el-table-column align="center" prop="contractNum" min-width="85" label="合同号"></el-table-column>
        <el-table-column align="center" label="订单号" min-width="145">
          <template scope="scope">
            <span>{{scope.row.orderNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nameplate" label="机器名">
          <template scope="scope">
            <div>{{scope.row.nameplate}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="nameplate" label="机器编号">
          <template scope="scope">
            <div>{{scope.row.nameplate}}</div>
          </template>
        </el-table-column>-->
        <el-table-column align="center" prop="machineType" label="机型">
          <template scope="scope">
            <div>{{scope.row.machineType.name}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sellman" label="机架长度" />
        <el-table-column align="center" prop="packageMethod" label="包装方式" />
        <el-table-column align="center" prop="equipment" label="装置" width="380">
          <template slot-scope="item">
            <el-table border :data="getEquipmentFromJSON(item.row.equipment)">
              <el-table-column label="装置名称" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.number}}</span>
                </template>
              </el-table-column>
              <el-table-column label="单价" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.price|filterNumberFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="装置总价" align="center">
                <template slot-scope="scope">
                  <span
                    style="font-weight: bold;color: #409EFF"
                  >{{(scope.row.price*scope.row.number)|filterNumberFormat}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-tag
              v-for="equip in getEquipmentFromJSON(scope.row.equipment)"
              :key="equip.name"
            >{{equip.name}}:{{equip.number}}个</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="装置金额" width="150">
          <template scope="scope">
            <span>{{getEquipmentAmount(scope.row.equipment)|filterNumberFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="machineNum" label="机器台数"></el-table-column>
        <el-table-column align="center" prop="machinePrice" label="单价" width="150">
          <template scope="scope">
            <span>{{scope.row.machinePrice|filterNumberFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderTotalDiscounts" label="优惠金额" width="150" />
        <el-table-column align="center" label="销售费" width="150">
          <template scope="scope">
            <span>{{getTotalAmount(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currencyType" label="币种" />
        <el-table-column align="center" prop=" " label="保修费"></el-table-column>
        <el-table-column align="center" prop="maintainPerson" label="保修人员"></el-table-column>
        <el-table-column align="center" prop="sellman" label="销售人员"></el-table-column>
        <el-table-column align="center" prop="payMethod" label="付款方式" width="200"></el-table-column>
        <el-table-column align="center" prop=" " label="定金率"></el-table-column>
        <el-table-column align="center" prop=" " label="毛利"></el-table-column>
      </el-table>
      <div class="block" style="text-align: center; margin-top: 20px">
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
  name: 'FinanceReport',
  data() {
    _this = this;
    return {
      onSearchDetailDataUrl: HOST + '/machine/order/selectOrders',
      queryMachineTypeURL: HOST + 'machine/type/list',
      allMachineType: [],
      filters: {
        customer: '',
        contract_num: '',
        orderNum: '',
        //machineLength: '',
        sellman: ''
      },
      tableData: [],
      pageSize: EveryPageNum, //每一页的num
      currentPage: 1,
      startRow: 0,
      totalRecords: 0,
      loadingUI: false
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
        is_fuzzy: true,
        sellman: _this.filters.sellman,
        page: _this.currentPage,
        size: _this.pageSize
      };
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
          }
          _this.loadingUI = false;
        }
      });
    },

    onExport() {
      var condition = {
        customer: _this.filters.customer,
        contract_num: _this.filters.contract_num,
        order_num: _this.filters.orderNum,
        is_fuzzy: true,
        sellman: _this.filters.sellman
      };

      $.ajax({
        url: HOST + '/machine/order/exportToFinaceExcel',
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
    filterNumberFormat(ndata) {
      return number_format(ndata, 2, '.', ' ');
    },
    filterMachineType(id) {
      var result = '';
      for (var i = 0; i < _this.allMachineType.length; i++) {
        if (id == _this.allMachineType[i].id) {
          result = _this.allMachineType[i].name;
          break;
        }
      }
      return result;
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
