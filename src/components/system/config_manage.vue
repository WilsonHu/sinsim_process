<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item :name="item.item" v-for="item in configList">
        <template slot="title">
          <span :style="item|computestyle">{{item.text}}</span>
        </template>
        <el-button
          style="float: right;"
          icon="el-icon-plus"
          size="normal"
          type="warning"
          @click="handleAdd"
        >
          <span style="font-size:16px; color:#000000FF;">{{item.text}}</span>
        </el-button>
        <el-table
          element-loading-text="获取数据中..."
          :data="item.data"
          border
          empty-text="暂无数据..."
          ref="singleTable"
          highlight-current-row
          show-overflow-tooltip="true"
          style="width: 100%;top:20px; "
        >
          <el-table-column width="55" align="center" label="序号">
            <template scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置项" align="center" prop="text" span="2">
            <template scope="scope">
              <span>{{scope.row.text}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="操作" align="center">
            <template scope="scope" style="text-align: center">
              <el-tooltip placement="left" content="修改">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row)"
                ></el-button>
              </el-tooltip>
              <!-- <el-tooltip placement="right">
                <div slot="content">删除</div>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="cancelMachine(scope.row)"
                ></el-button>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <el-dialog :title="formTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="dataForm">
        <el-col :span="24">
          <el-form-item label="配置名称：" :label-width="formLabelWidth" style="width: 100%">
            <el-input v-model="dataForm.text" clearable placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-alert
        v-if="errorMsg.length>0"
        style="margin-top: 10px;padding: 5px"
        :title="errorMsg"
        type="error"
        show-icon
      ></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" icon="el-icon-close" type="danger">取 消</el-button>
        <el-button type="primary" @click="onSave" icon="el-icon-check">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ConfigData } from '../../config/dataconfig';
let _this;
export default {
  name: 'config_manage',
  components: { ConfigData },
  data() {
    _this = this;
    return {
      rootData: {},
      activeNames: '',
      configList: [],
      errorMsg: '',
      dataForm: {
        text: ''
      },
      formTitle: '添加配置',
      formLabelWidth: '100px',
      selectedItem: {},
      currentData: {},
      isAdd: false,
      addDialogVisible: false,
      deleteConfirmVisible: false,
      isSaveNew: false
    };
  },
  methods: {
    //获取data
    fetchConfigData() {
      $.ajax({
        url: HOST + 'data/config/list',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
          if (data.code == 200) {
            try {
              let list = [];
              if (data.data.list.length == 0) {
                _this.isSaveNew = true;
                list = ConfigData;
                _this.rootData.data = JSON.stringify(list);
              } else {
                _this.rootData = data.data.list[0]; //数据库的数据
                try {
                  list = JSON.parse(_this.rootData.data); //取数据库data字段为JSON字符,再转为对象数组
                } catch (ex) {
                  list = ConfigData;
                  _this.rootData.data = JSON.stringify(list);
                }
                _this.isSaveNew = false;
              }
              if (list != null && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                  if (list[i].item == 'contract') {
                    //目前只支持合同页面数据配置
                    _this.configList = list[i].data;
                    break;
                  }
                }
              }
            } catch (ex) {
              console.log(ex);
            }
          } else {
            showMessage(_this, data.message, 0);
          }
        },
        error: function(data) {
          showMessage(_this, '服务器访问出错', 0);
        }
      });
    },

    handleChange(activeItem) {
      if (activeItem.length > 0) {
        for (let i = 0; i < _this.configList.length; i++) {
          if (_this.configList[i].item == activeItem) {
            //activeItem.length - 1最后一次激活选中的面板数据
            _this.selectedItem = _this.configList[i].data;
            break;
          }
        }
      }

      console.log(activeItem);
    },
    handleAdd() {
      _this.errorMsg = '';
      _this.isAdd = true;
      _this.formTitle = '添加配置';
      _this.dataForm = {
        text: ''
      };
      _this.addDialogVisible = true;
    },

    onSave() {
      for (let i = 0; i < _this.selectedItem.length; i++) {
        if (_this.isAdd) {
          if (_this.selectedItem[i].text == _this.dataForm.text) {
            _this.errorMsg = '设置的项名称已存在，请重新输入';
            break;
          }
        } else {
          if (
            _this.selectedItem[i].text == _this.dataForm.text &&
            _this.currentData.text != _this.dataForm.text
          ) {
            _this.errorMsg = '设置的项名称已存在，请重新输入';
            break;
          }
        }
      }
      if (_this.errorMsg.length > 0) {
        return;
      }

      let newData = Object.assign({}, _this.dataForm);
      for (let i = 0; i < _this.configList.length; i++) {
        if (_this.configList[i].item == _this.activeNames) {
          //activeNames.length - 1最后一次激活选中的面板数据
          if (_this.isAdd) {
            _this.configList[i].data.push(newData);
            showMessage(_this, '添加成功', 1);
          } else {
            for (let j = 0; j < _this.configList[i].data.length; j++) {
              if (_this.configList[i].data[j].text == _this.currentData.text) {
                _this.configList[i].data[j].text = _this.dataForm.text;
                _this.currentData = Object.assign({}, _this.dataForm);
                showMessage(_this, '修改成功', 1);
                break;
              }
            }
          }
          _this.selectedItem = _this.configList[i].data;
          break;
        }
      }
      _this.submitData(); //提交整个JSON数据到数据库
      _this.addDialogVisible = false;
    },

    submitData() {
      if (_this.configList == null || _this.configList.length == 0) {
        return;
      }
      let list = JSON.parse(_this.rootData.data);
      for (let i = 0; i < list.length; i++) {
        if (list[i].item == 'contract') {
          //目前只支持合同页面数据配置
          list[i].data = _this.configList;
          break;
        }
      }
      sessionStorage.setItem(
        'contract_config',
        JSON.stringify(_this.configList)
      ); //更新本地session
      _this.rootData.data = JSON.stringify(list);
      if (_this.isSaveNew) {
        $.ajax({
          url: HOST + 'data/config/add',
          type: 'POST',
          dataType: 'json',
          data: { data: _this.rootData.data },
          success: function(data) {
            if (data.code == 200) {
              console.log('添加成功');
            } else {
              console.log(`${data.message}`);
            }
          },
          error: function(data) {
            console.log(`服务器访问出错！`);
          }
        });
      } else {
        $.ajax({
          url: HOST + 'data/config/update',
          type: 'POST',
          dataType: 'json',
          data: { id: _this.rootData.id, data: _this.rootData.data },
          success: function(data) {
            if (data.code == 200) {
              console.log('修改成功');
              //showMessage(_this, '提交成功', 1);
            } else {
              console.log(`${data.message}`);
              showMessage(_this, '提交失败', 1);
            }
          },
          error: function(data) {
            console.log(`服务器访问出错！`);
          }
        });
      }
    },

    handleEdit(item) {
      _this.currentData = Object.assign({}, item);
      _this.errorMsg = '';
      _this.isAdd = false;
      _this.dataForm.text = item.text;
      _this.formTitle = '修改配置';
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
        url: HOST + 'machine/type/delete',
        type: 'POST',
        dataType: 'json',
        data: { id: item.id },
        success: function(data) {
          if (data.code == 200) {
            showMessage(_this, '删除成功', 1);
            _this.fetchMachineTypes();
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
    },

    getColorRandom() {
      return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
  },
  computed: {},

  filters: {
    computestyle: function(item) {
      let fontcolor = _this.getColorRandom();
      return `font-size:14px;color:${fontcolor}`;
    }
  },

  created: function() {},
  mounted: function() {
    _this.fetchConfigData();
  },
  destroyed: function() {
    //_this.submitData(); //提交整个JSON数据到数据库
  }
};
</script>
<style>
</style>
