<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title">
          <span>一致性 Consistency</span>
          <i class="header-icon el-icon-info"></i>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Vue from 'vue';
import routes from '../../config/routes';

let _this;
export default {
  name: 'config_manage',
  components: {},
  data() {
    _this = this;
    return {
      isError: false,
      errorMsg: '',
      form: {
        id: '',
        name: '',
        finished: 0
      },
      formLabelWidth: '100px',
      selectedItem: {},
      deleteConfirmVisible: false,
      isAdd: false
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
            _this.tableData = data.data.list;
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
      _this.fetchMachineTypes();
    },
    handleAdd() {
      this.isAdd = true;
      this.form = {
        id: '',
        name: ''
      };
      this.addDialogVisible = true;
    },

    handleEdit(item) {
      this.isAdd = false;
      this.form.id = item.id;
      this.form.name = item.name;
      this.form.finished = item.finished;
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
            showMessage(_this, '删除机型成功', 1);
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
    }
  },
  computed: {},

  filters: {},

  created: function() {},
  mounted: function() {
    _this.fetchConfigData();
  }
};
</script>
<style>
</style>
