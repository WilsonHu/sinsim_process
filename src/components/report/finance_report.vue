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
          <el-col :span="11">
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
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="订单号:">
              <el-input v-model="filters.orderNum" placeholder="订单号" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售员:">
              <el-input v-model="filters.sellman" placeholder="销售员" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新日期:">
              <el-date-picker
                      style="float:left;"
                      v-model="filters.selectDateSign"
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
          <el-col :span="2" :offset="0">
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
        <el-table-column align="center" min-width="110" prop="customer" label="客户"></el-table-column>
        <el-table-column align="center" prop="contractNum" min-width="85" label="合同号"></el-table-column>
        <el-table-column align="center" label="订单号" min-width="145">
          <template scope="scope">
            <span>{{scope.row.orderNum}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" prop="nameplate" label="铭牌号">-->
          <!--<template scope="scope">-->
            <!--<div>{{scope.row.nameplate}}</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!-- <el-table-column align="center" prop="nameplate" label="机器编号">
          <template scope="scope">
            <div>{{scope.row.nameplate}}</div>
          </template>
        </el-table-column>-->
        <!--<el-table-column align="center"   label="机型">-->
          <!--<template scope="scope">-->
            <!--<div>{{scope.row.machineType.name}}</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
        <el-table-column align="center" prop="" label="机架长度" >
          <template scope="scope">
            <span>{{scope.row.machineFrameLength}}</span>
          </template>
        </el-table-column>
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
        <!-- 这个 装置金额 前面已经有了 装置总价-->
        <!--<el-table-column align="center" label="装置金额" width="150">-->
          <!--<template scope="scope">-->
            <!--<span>{{getEquipmentAmount(scope.row.equipment)|filterNumberFormat}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="" label="机器单价" width="80">
          <template scope="scope">
            <div v-if="scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5"  >
            <span>{{0}}</span>
              </div>
            <div v-else>
              <!--<span>{{scope.row.machinePrice|filterNumberFormat}}</span>-->
              <span>{{scope.row.machinePrice}}</span>
              </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="单台价格" width="80">
          <template scope="scope">
            <div v-if="scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5"  >
              <span>{{0}}</span>
            </div>
            <div v-else>
              <span>{{calculateMachineTotalPrice(scope.row)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="机器台数" width="80">
          <template scope="scope">
          <div v-if="scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5"  >
            <span>{{0}}</span>
          </div>
          <div v-else>
            <span>{{scope.row.machineNum}}</span>
          </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="优惠金额" width="80" >
          <template scope="scope">
            <div v-if="scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5"  >
              <span>{{0}}</span>
            </div>
            <div v-else>
              <span>{{scope.row.orderTotalDiscounts|filterNumberFormat}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单总价" width="100">
          <template scope="scope">
            <div v-if="scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5"  >
              <span>{{0}}</span>
            </div>
            <div v-else>
              <span>{{getTotalAmount(scope.row)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currencyType" label="币种" />
        <el-table-column align="center" prop=" " label="业务费">
          <template scope="scope">
            <span>{{scope.row.businessExpense}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="warrantyFee" label="保修费"></el-table-column>
        <el-table-column align="center" prop="maintainPerson" label="保修人员"></el-table-column>
        <el-table-column align="center" prop="sellman" label="销售人员"></el-table-column>
        <el-table-column align="center" prop=" " label="填表日期">
          <!-- (改单拆单的创建，是在联系单审核之后才创建，所以填表日期 在终审日期之后或同一天)-->
          <template scope="scope">
            <span>{{scope.row.createTime|filterDateString}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop=" " label="终审日期">
          <template scope="scope">
            <span>{{scope.row.orderSign.updateTime|filterDateString}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop=" " label="合同交货日期">
        <template scope="scope">
          <span>{{scope.row.contractShipDate|filterDateString}}</span>
        </template>
      </el-table-column>
        <el-table-column align="center" prop=" " label="地区">
        <template scope="scope">
          <span>{{scope.row.domesticTradeZone}}</span>
        </template>
      </el-table-column>
        <el-table-column align="center" prop="payMethod" label="付款方式" width="200"></el-table-column>
        <!--<el-table-column align="center" prop=" " label="定金率"></el-table-column>-->
        <el-table-column align="center" prop=" " label="毛利">
          <template scope="scope">
            <span>{{scope.row.grossProfit}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="orderType" label="订单类型"></el-table-column>
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
        sellman: '',
        selectDate: "",     //这个查 创建日期
        selectDateSign: ""  //这个查 签核更新日期
      },
      tableData: [],
      pageSize: EveryPageNum, //每一页的num
      currentPage: 1,
      startRow: 0,
      totalRecords: 0,
      totalEquipmentsAtThisPage: 0, //注意：后续这些都是本页的数据，不是全部，不包括其他页
      totalMachineNumAtThisPage: 0,   //本页台数， 不包括已改单、已拆单、已取消
      totalDiscountsAtThisPage: 0,    //本页优惠
      totalAmountAtThisPage: 0,    //本页总价
      loadingUI: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
    };
  },
  methods: {

    getEquipmentAmount(strData) {
      let dataArray = _this.getEquipmentFromJSON(strData);
      var res = 0;
      for (var i = 0; i < dataArray.length; i++) {
        res += parseFloat(dataArray[i].price) * dataArray[i].number;
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
        tmp1 +=  parseFloat( _this.tableData[i].orderTotalDiscounts);
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
              [equipAmount + parseFloat(data.machinePrice)] *
              parseFloat(data.machineNum) -
              parseFloat(data.orderTotalDiscounts);
      return  totalAmount ;
    },

    getTotalAmount(data) {
      let totalAmount = 0;
      let equipAmount = _this.getEquipmentAmount(data.equipment); //装置总金额
      //总金额=（装置总金额+机器单价）* 机器数量-优惠总金额
      totalAmount =
        [equipAmount + parseFloat(data.machinePrice)] *
        parseFloat(data.machineNum) -
        parseFloat(data.orderTotalDiscounts);
      return number_format(totalAmount, 2, '.', ' ');
    },

    // 单台价格: 机器单价 + 该机器配的配件总价
    calculateMachineTotalPrice(item) {  // item.row.equipment
      let machineTotalPrice = 0;
      if (item.status == ORDER_CHANGED || item.status == ORDER_CANCELED) {
        machineTotalPrice = 0;
      } else {
        machineTotalPrice = parseFloat(item.machinePrice);

        let equipAmount = _this.getEquipmentAmount(item.equipment); //装置总金额
        machineTotalPrice = machineTotalPrice + equipAmount
      }
      return machineTotalPrice != null && machineTotalPrice != ""
              ? machineTotalPrice
              : 0;
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
      sums[7] = '注意，后面都是本页数据： ' + _this.totalEquipmentsAtThisPage;
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
        is_fuzzy: true,
        sellman: _this.filters.sellman,
        //只筛选 审核中、审核完成、拆单 不必再审核、改单 不必再审核。     不包含：已改单，已拆单，已取消，已驳回
        status: ORDER_CHECKING + "," + ORDER_CHECKING_FINISHED + "," + ORDER_SPLIT_FINISHED + "," + ORDER_CHANGE_FINISHED,
        page: _this.currentPage,
        size: _this.pageSize,
      };
      if (
              _this.filters.selectDate != null &&
              _this.filters.selectDate.length > 0
      ) {
        condition.query_start_time = _this.filters.selectDate[0].format(
                "yyyy-MM-dd"
        );
        condition.query_finish_time = _this.filters.selectDate[1].format(
                "yyyy-MM-dd"
        );
      }

      if (
              _this.filters.selectDateSign != null &&
              _this.filters.selectDateSign.length > 0
      ) {
        condition.queryStartTimeSign = _this.filters.selectDateSign[0].format(
                "yyyy-MM-dd"
        );
        condition.queryFinishTimeSign = _this.filters.selectDateSign[1].format(
                "yyyy-MM-dd"
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
        contract_num: _this.filters.contract_num,
        order_num: _this.filters.orderNum,
        is_fuzzy: true,
        sellman: _this.filters.sellman,
        //只筛选 审核中、审核完成、拆单 不必再审核、改单 不必再审核，不管已改单，已拆单，已取消，已驳回
        status: ORDER_CHECKING + "," + ORDER_CHECKING_FINISHED + "," + ORDER_SPLIT_FINISHED + "," + ORDER_CHANGE_FINISHED,
        page: _this.currentPage,
        size: _this.pageSize,
      };
      if (
              _this.filters.selectDate != null &&
              _this.filters.selectDate.length > 0
      ) {
        condition.query_start_time = _this.filters.selectDate[0].format(
                "yyyy-MM-dd"
        );
        condition.query_finish_time = _this.filters.selectDate[1].format(
                "yyyy-MM-dd"
        );
      }

      if (
              _this.filters.selectDateSign != null &&
              _this.filters.selectDateSign.length > 0
      ) {
        condition.queryStartTimeSign = _this.filters.selectDateSign[0].format(
                "yyyy-MM-dd"
        );
        condition.queryFinishTimeSign = _this.filters.selectDateSign[1].format(
                "yyyy-MM-dd"
        );
      }
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
    },

      filterDateString(strDate) {
        //为空的时间不要显示为1970xxxx，而是显示横杠就好
        if(strDate == null){
          return "-";
        }
        var resDate = new Date(strDate);
        return resDate.format("yyyy-MM-dd");
      },
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
