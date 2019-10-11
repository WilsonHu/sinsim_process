<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <el-col class="well well-lg" style="background-color: white;">
      <el-row>
        <el-col>
          <el-form :model="filters" label-position="right" label-width="60px">
            <el-col :span="6">
              <el-form-item label="账号:">
                <el-input v-model="filters.account" placeholder="账号" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区域:">
                <el-input
                  v-model="filters.domesticTradeZone"
                  placeholder="区域"
                  auto-complete="off"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="3" style="margin-left: 25px">
            <el-button icon="el-icon-search" size="normal" type="primary" @click="searchData">搜索</el-button>
          </el-col>
          <div align="right" style="margin-bottom: 20px">
            <el-button icon="el-icon-plus" size="normal" type="primary" @click="handleAdd">区域</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column width="75" align="center" prop="id" label="序号">
          <template scope="scope">{{scope.$index+startRow+1}}</template>
        </el-table-column>
        <el-table-column align="center" prop="zoneName" label="区域"></el-table-column>
        <el-table-column align="center" prop="account" label="负责人">
          <template scope="scope">{{scope.row.account}}</template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template scope="scope">
            <el-button
              size="small"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: center; margin-top: 20px">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-col>
    <el-dialog :title="isAdd?'添加区域':'编辑区域'" :visible.sync="addDialogVisible" width="60%">
      <el-form :model="form">
        <el-col :span="12">
          <el-form-item label="区域：" :label-width="formLabelWidth" style="width: 80%">
            <el-input v-model="form.zoneName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人: " :label-width="formLabelWidth" style="width: 80%">
            <el-select v-model="form.ownerId" clearable>
              <el-option v-for="item in userList" :value="item.id" :label="item.account"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-alert
        v-if="isError"
        style="margin-top: 20px;padding: 5px"
        :title="errorMsg"
        type="error"
        show-icon
      ></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button>
        <el-button type="primary" @click="onAdd" icon="el-icon-check">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="20%">
      <span>
        确认要删除[
        <b>{{selectedItem.zoneName}}</b> ]的区域吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false" icon="el-icon-close" type="danger">取 消</el-button>
        <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import routes from '../../config/routes';

let _this;
export default {
  name: 'trade_zone_manage',
  components: {},
  data() {
    _this = this;
    return {
      tableData: [],
      filters: {
        account: '',
        domesticTradeZone: ''
      },
      isError: false,
      errorMsg: '',
      //分页
      totalPage: 1,
      pageSize: EveryPageNum, //每一页的num
      currentPage: 1,
      startRow: 1,
      userList: [],
      //增加对话框
      addDialogVisible: false,
      form: {
        ownerId: '',
        zoneName: ''
      },
      formLabelWidth: '100px',
      selectedItem: {},
      deleteConfirmVisible: false,
      isAdd: false
    };
  },
  methods: {
    onLoadUsers() {
      $.ajax({
        url: HOST + '/user/selectUsers',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
          if (data.code == 200) {
            _this.userList = [];
            for (var i = 0; i < data.data.list.length; i++) {
              if (
                data.data.list[i].account != 'admin' &&
                data.data.list[i].valid == 1
              ) {
                _this.userList.push(data.data.list[i]);
              }
            }
          }
        },
        error: function(data) {}
      });
    },

    searchData() {
      $.ajax({
        url: HOST + 'domestic/trade/zone/getDomesticTradeZone',
        type: 'POST',
        dataType: 'json',
        data: {
          size: _this.pageSize,
          page: _this.currentPage,
          account: _this.filters.account,
          domesticTradeZone: _this.filters.domesticTradeZone
        },
        success: function(data) {
          if (data.code == 200) {
            _this.tableData = data.data.list;
            _this.totalPage = data.data.total;
            _this.startRow = data.data.startRow;
          } else {
            showMessage(_this, data.message, 0);
          }
        },
        error: function(data) {
          showMessage(_this, '服务器访问出错', 0);
        }
      });
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      _this.searchData();
    },
    handleAdd() {
      this.isAdd = true;
      this.form = {
        id: '',
        ownerId: '',
        zoneName: ''
      };
      this.addDialogVisible = true;
    },

    onAdd() {
      if (_this.form.zoneName == '') {
        showMessage(_this, '区域不能为空！', 0);
        return;
      }
      if (_this.isAdd == true) {
        $.ajax({
          url: HOST + 'domestic/trade/zone/add',
          type: 'POST',
          dataType: 'json',
          data: {
            data: JSON.stringify({
              ownerId: _this.form.ownerId,
              zoneName: _this.form.zoneName
            })
          },
          success: function(data) {
            if (data.code == 200) {
              _this.addDialogVisible = false;
              _this.searchData();
              showMessage(_this, '添加成功', 1);
            } else {
              showMessage(_this, data.message, 0);
            }
          },
          error: function(data) {
            showMessage(_this, '服务器访问出错', 1);
          }
        });
      } else {
        $.ajax({
          url: HOST + 'domestic/trade/zone/update',
          type: 'POST',
          dataType: 'json',
          data: {
            data: JSON.stringify({
              id: _this.form.id,
              ownerId: _this.form.ownerId,
              zoneName: _this.form.zoneName
            })
          },
          success: function(data) {
            if (data.code == 200) {
              _this.addDialogVisible = false;
              _this.searchData();
              showMessage(_this, '修改成功', 1);
            } else {
              showMessage(_this, data.message, 0);
            }
          },
          error: function(data) {
            showMessage(_this, '服务器访问出错', 1);
          }
        });
      }
    },

    handleEdit(item) {
      this.isAdd = false;
      this.form.id = item.id;
      this.form.ownerId = item.ownerId;
      this.form.zoneName = item.zoneName;
      _this.addDialogVisible = true;
    },

    handleDelete(item) {
      _this.selectedItem = copyObject(item);
      this.deleteConfirmVisible = true;
    },

    onConfirmDelete() {
      this.deleteData(_this.selectedItem);
      _this.deleteConfirmVisible = false;
    },

    deleteData(item) {
      $.ajax({
        url: HOST + 'domestic/trade/zone/delete',
        type: 'POST',
        dataType: 'json',
        data: { id: item.id },
        success: function(data) {
          if (data.code == 200) {
            showMessage(_this, '删除成功', 1);
            _this.searchData();
          } else {
            showMessage(_this, data.message, 0);
          }
          _this.deleteConfirmVisible = false;
        },
        error: function(data) {
          showMessage(_this, '服务器访问出错！', 0);
          _this.deleteConfirmVisible = false;
        }
      });
    }
  },
  computed: {},

  filters: {},

  created: function() {
    _this.onLoadUsers();
  },
  mounted: function() {
    _this.searchData();
  }
};
</script>
<style>
.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
  float: left;
}
</style>
