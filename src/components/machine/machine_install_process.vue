<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div style="text-align: left;">
            待配置安装流程机器
        </div>
        <el-col class="well well-lg" style="background-color: white;">
            <el-form :model="filters" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单号:">
                            <el-input v-model="filters.orderNum"
                                      placeholder="订单号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同编号:">
                            <el-input v-model="filters.contract_num"
                                      placeholder="合同编号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="配置状态:">
                            <el-select v-model="filters.configStatus" clearable>
                                <el-option
                                        v-for="item in configStatusList"
                                        :value="item.value"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button
                                icon="el-icon-search"
                                size="normal"
                                type="primary"
                                @click="search">查询
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="机器编号:">
                            <el-input v-model="filters.machine_id"
                                      placeholder="机器编号"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="选择日期:">
                            <el-date-picker
                                    v-model="filters.selectDate"
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
                </el-row>
            </el-form>
            <el-table
                    v-loading="loadingUI"
                    element-loading-text="获取数据中..."
                    :data="tableData"
                    border
                    empty-text="暂无数据..."
                    show-overflow-tooltip="true"
                    style="width: 100%; ">
                <el-table-column
                        width="75"
                        align="center"
                        label="序号">
                    <template scope="scope">
                        {{scope.$index+startRow}}
                    </template>
                </el-table-column>
                <el-table-column label="订单号"
                                 align="center"
                                 prop="orderNum">
                    <template scope="scope">
                        <div>
                            {{scope.row.orderNum}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="contractNum"
                        label="合同号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="machineId"
                        label="机器编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="nameplate"
                        label="铭牌号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="location"
                        label="位置">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="machineType"
                        label="机型">
                    <template scope="scope">
                        <div>
                            {{scope.row.machineType|filterMachineType}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        align="center"
                        label="配置状态">
                    <template scope="scope">
                        <div v-if="scope.row.processRecordId!=''"
                             style="color: #2b542c"
                        >
                            已配置
                        </div>
                        <div v-else style="color: darkred">
                            未配置
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        label="创建时间">
                    <template slot-scope="scope">
                        <span>
                            {{(scope.row.createTime)|filterDateString}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="shipTime"
                        label="发货时间">
                    <template slot-scope="scope">
                        <span>
                            {{(scope.row.shipTime)|filterDateString}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="操作" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="primary"
                                :disabled="cantEdit"
                                @click="editWithItem(scope.$index, scope.row)">配置流程
                        </el-button>
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
                        :total="totalRecords">
                </el-pagination>
            </div>
        </el-col>

        <el-dialog title="机器配置流程" :visible.sync="addDialogVisible"
                   fullscreen
                   @open="onopened">
            <table style="width: 100%">
                <tr style="width: 100%;vertical-align: text-top;">
                    <td style="width: 20%; padding-right: 5px">
                        <el-row>
                            <el-form :model="addForm">
                                <el-col :span="24">
                                    <el-form-item label="机器编号：">
                                        <el-input type="text"
                                                  disabled
                                                  v-model="addForm.machineId"
                                                  style="width:100%"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" :offset="0">
                                    <el-form-item label="机型：">
                                        <el-input type="text"
                                                  disabled
                                                  v-model="addForm.machineType|filterMachineType"
                                                  style="width:100%"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" :offset="0">
                                    <el-form-item label="流程模板：">
                                        <el-select
                                                :clearable="true"
                                                v-model="addForm.groupId"
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in groupList"
                                                    :label="item.groupName"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <br>
                        <el-row>
                            <el-button
                                    icon="check"
                                    size="normal"
                                    type="primary"
                                    @click="onSubmit">保存
                            </el-button>
                            <el-button
                                    icon="close"
                                    size="normal"
                                    type="danger"
                                    @click="addDialogVisible = false">关闭
                            </el-button>
                        </el-row>
                    </td>
                    <td style="width: 80%">
                        <div id="sample">
                            <div style="width:100%; white-space:nowrap; ">
			                <span style="display: inline-block; vertical-align: top; width:20%">
			                  <div id="myPaletteDiv" style="border: solid 1px black; height:720px;"></div>
			                </span>
                                <span style="display: inline-block; vertical-align: top; text-align: center;width:80%">
			                    <div id="myDiagramDiv" style="border: solid 1px black;height:720px; "></div>
			                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Loading} from 'element-ui';
    var _this;
    var myDiagram;
    var myPalette;
    var subParts = new go.List();
    export default {
        name: "machine_config_process",
        components: {},
        data () {
            _this = this;
            return {
                queryDataUrl: HOST + "machine/selectConfigMachine",
                taskContentNameUrl: HOST + "task/list",
                errorMsg: '',
                selectedItem: {},
                queryUserRoleUrl: HOST + "role/list",
                queryMachineTypeURL: HOST + "machine/type/list",
                tableData: [],
                //分页
                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 0,
                totalRecords: 0,
                configStatusList: ConfigStatusList,
                filters: {
                    machine_id: '',
                    contract_num: '',
                    order_status: '',
                    orderNum: '',
                    configStatus: 1,
                    selectDate: '',
                },

                allRoles: [],
                loadingUI: false,
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
                addForm: {},
                selectedItem: {},
                cantEdit: false,
                addDialogVisible: false,
                isError: false,
            }

        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.startRow = this.pageSize * (this.currentPage - 1)
            },
            search() {
                this.onSearchDetailData();
            },
            onSearchDetailData()
            {
                var condition = {
                    machine_id: _this.filters.machine_id,
                    orderNum: _this.filters.orderNum,
                    contract_num: _this.filters.contract_num,
                    query_start_time: '',
                    query_finish_time: '',
                    configStatus: _this.filters.configStatus,
//                    page:_this.currentPage,
//                    size:_this.pageSize
                };
                if (_this.filters.selectDate != null && _this.filters.selectDate.length > 0) {
                    condition.query_start_time = _this.filters.selectDate[0].format("yyyy-MM-dd");
                    condition.query_finish_time = _this.filters.selectDate[1].format("yyyy-MM-dd");
                }
                $.ajax({
                    url: _this.queryDataUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: condition,
                    success: function (res) {
                        if (res.code == 200) {
                            _this.totalRecords = res.data.total;
                            _this.tableData = res.data.list;
                            _this.startRow = res.data.startRow;
                        }
                        _this.loadingUI = false;
                    }
                })
            },

            editWithItem(index, data){
                _this.selectedItem = data;
                _this.isError = false;
                _this.addForm = _this.selectedItem;
                _this.addDialogVisible = true;
            },

            onSubmit()
            {
                if (isStringEmpty(this.addForm.taskName)) {
                    showMessage(_this, "作业内容不能为空", 0)
                    _this.isError = true;
                    return;
                }

            },
            initAllRoles()
            {
                $.ajax({
                    url: _this.queryUserRoleUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.allRoles = res.data.list;
                        }
                    }
                })
            },

            initMachineType()
            {
                _this.allMachineType = JSON.parse(sessionStorage.getItem('allMachineType'));
                if (_this.allMachineType == null || _this.allMachineType.length == 0) {
                    $.ajax({
                        url: _this.queryMachineTypeURL,
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        success: function (res) {
                            if (res.code == 200) {
                                _this.allMachineType = res.data.list;
                                sessionStorage.setItem('allMachineType', JSON.stringify(res.data.list));
                            }
                        }
                    })
                }
            },

            getTaskContentName(){
                $.ajax({
                    url: _this.taskContentNameUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: null,
                    success: function (res) {
                        if (res.code == 200) {
                            taskContentArray = [];
                            for (var i = res.data.list.length - 1; i >= 0; i--) {
                                var str = {
                                    "text": res.data.list[i].taskName,
                                    "task_status": "0",
                                    "begin_time": "",
                                    "end_time": "",
                                    "group_id": res.data.list[i].groupId,
                                    "group_name": _this.filterGroup(res.data.list[i].groupId),
                                };
                                taskContentArray.push(str);
                            }
                        }
                        else {

                        }
                    }
                })
            },

            getGroupData()
            {
                _this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
                if (_this.groupList != null && _this.groupList.length > 0) {
                    return;
                }
                $.ajax({
                    url: _this.groupUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.groupList = res.data.list;
                            sessionStorage.setItem('groupList', JSON.stringify(_this.groupList));
                        }
                    },
                })
            },
            onopened()
            {
                _this.isError = false;
                _this.errorMsg = '';
                resetDiagram();
                _this.loadingInstance = Loading.service(
                        {
                            fullscreen: true,
                            text: "正在加载中，请稍后..."
                        });

                window.setTimeout(()=> {
                    try {
                        init();
                        if (_this.isEdit == false) {//add
                            _this.addForm = {};
                            myDiagram.model = go.Model.fromJson({
                                "class": "go.GraphLinksModel",
                                "linkFromPortIdProperty": "fromPort",
                                "linkToPortIdProperty": "toPort",
                                "nodeDataArray": [
                                    {
                                        "category": "Start",
                                        "text": "开始",
                                        "key": -1,
                                        "loc": "207 39.99999999999999"
                                    },
                                    {
                                        "category": "End",
                                        "text": "结束",
                                        "key": -4,
                                        "loc": "207 216.26768871290687"
                                    }
                                ],
                                "linkDataArray": []
                            });
                        } else {//edit
                            myDiagram.model = go.Model.fromJson(_this.addForm.taskList);
                        }
                    } catch (ex) {
                        console.log(ex.toString());
                    } finally {
                        _this.loadingInstance.close();
                    }
                }, 1200)
            },
            filterGroup(id) {
                let result = "";
                for (let i = 0; i < _this.groupList.length; i++) {
                    if (_this.groupList[i].id == id) {
                        result = _this.groupList[i].groupName;
                        break;
                    }
                }
                return result;
            },
        },
        computed: {},
        filters: {
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

            filterConfigStatus(id)
            {

                var result = _this.configStatusList[0].name;
                for (var i = 0; i < _this.configStatusList.length; i++) {
                    if (id == _this.configStatusList[i].value) {
                        result = _this.configStatusList[i].name;
                        break;
                    }
                }
                return result;
            },
            filterMachineType(id)
            {
                var result = '';
                for (var i = 0; i < _this.allMachineType.length; i++) {
                    if (id == _this.allMachineType[i].id) {
                        result = _this.allMachineType[i].name;
                        break;
                    }
                }
                return result;
            },

        },
        created: function () {
            this.userinfo = JSON.parse(sessionStorage.getItem('user'));
            if (isNull(this.userinfo)) {
                this.$router.push({path: '/Login'});
                return;
            }
            _this.initAllRoles();
            _this.initMachineType();
            _this.getGroupData();
            _this.getTaskContentName();
//            _this.getProcessData();

        },
        mounted: function () {
            _this.filters.configStatus = 1;
            _this.search();
        },
    }

    var taskContentArray = [];
    function resetDiagram() {
        var objDiagram = document.getElementById("myDiagramDiv");
        try {
            var childList = objDiagram.childNodes;
            if (childList != null && childList.length > 0) {
                for (var i = childList.length - 1; i >= 0; i--) {
                    document.getElementById("myDiagramDiv").removeChild(childList[i]);
                }
            }
            var objPalette = document.getElementById("myPaletteDiv");
            var childList2 = objPalette.childNodes;
            if (childList2 != null && childList2.length > 0) {
                for (var i = childList2.length - 1; i >= 0; i--) {
                    document.getElementById("myPaletteDiv").removeChild(childList2[i]);
                }
            }
            if (myDiagram != null) {
                myDiagram.div = null;
            }
        } catch (ex) {
            console.log(ex.toString());
        }
    }
    function init() {
//        resetDiagram();
        //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make;  // for conciseness in defining templates

        myDiagram =
                $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                        {
                            initialContentAlignment: go.Spot.Top,
                            allowDrop: true,  // must be true to accept drops from the Palette
                            "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                            "LinkRelinked": showLinkLabel,
                            "animationManager.duration": 100, // slightly longer than default (600ms) animation
                            "undoManager.isEnabled": true  // enable undo & redo
                        });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", function (e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        // helper definitions for node templates

        function nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Top,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function (e, obj) {
                        showPorts(obj.part, false);
                    }
                }
            ];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Circle",
                    {
                        fill: "transparent",
                        stroke: null,  // this is changed to "white" in the showPorts function
                        desiredSize: new go.Size(6, 6),
                        alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                        portId: name,  // declare this object to be a "port"
                        fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                        cursor: "pointer"  // show a different cursor to indicate potential link point
                    });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "#00A9C9", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));
        myDiagram.nodeTemplateMap.add("Working",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                                $(go.Shape, "Rectangle",
                                        {fill: "yellow", stroke: null},
                                        new go.Binding("figure", "figure")),
                                $(go.TextBlock,
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: "black",
                                            margin: 8,
//                                            maxSize: new go.Size(160, NaN),
                                            maxSize: new go.Size(160, 160),
                                            wrap: go.TextBlock.WrapFit,
                                            editable: false,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                ));

        myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                                $(go.Shape, "Circle",
                                        {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                                $(go.TextBlock, "Start",
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            editable: true,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the top, all output only:
                        makePort("L", go.Spot.Left, true, false),
                        makePort("R", go.Spot.Right, true, false),
                        makePort("B", go.Spot.Bottom, true, false)
                ));

        myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                                $(go.Shape, "Circle",
                                        {minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null}),
                                $(go.TextBlock, "End",
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText,
                                            textAlign: 'center',
                                            isMultiline: true
                                        },
                                        new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the bottom, all input only:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, false, true),
                        makePort("R", go.Spot.Right, false, true)
                ));

        myDiagram.nodeTemplateMap.add("Comment",
                $(go.Node, "Auto", nodeStyle(),
                        $(go.Shape, "File",
                                {fill: "#EFFAB4", stroke: null}),
                        $(go.TextBlock,
                                {
                                    margin: 5,
                                    maxSize: new go.Size(200, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    textAlign: "center",
                                    editable: true,
                                    font: "bold 12pt Helvetica, Arial, sans-serif",
                                    stroke: '#454545'
                                },
                                new go.Binding("text").makeTwoWay())
                        // no ports, because no links are allowed to connect with a comment
                ));


        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5, toShortLength: 4,
                            relinkableFrom: true,
                            relinkableTo: true,
                            reshapable: true,
                            resegmentable: true,
                            // mouse-overs subtly highlight links:
                            mouseEnter: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                            },
                            mouseLeave: function (e, link) {
                                link.findObject("HIGHLIGHT").stroke = "transparent";
                            }
                        },
                        new go.Binding("points").makeTwoWay(),
                        $(go.Shape,  // the highlight shape, normally transparent
                                {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
                        $(go.Shape,  // the link path shape
                                {isPanelMain: true, stroke: "gray", strokeWidth: 3}),
                        $(go.Shape,  // the arrowhead
                                {toArrow: "standard", stroke: null, fill: "gray"}),
                        $(go.Panel, "Auto",  // the link label, normally not visible
                                {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                                new go.Binding("visible", "visible").makeTwoWay(),
                                $(go.Shape, "RoundedRectangle",  // the label shape
                                        {fill: "#F8F8F8", stroke: null}),
                                $(go.TextBlock, "Yes",  // the label
                                        {
                                            textAlign: "center",
                                            font: "10pt helvetica, arial, sans-serif",
                                            stroke: "#333333",
                                            editable: true
                                        },
                                        new go.Binding("text").makeTwoWay())
                        )
                );

        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        //load();  // load an initial diagram from some JSON text
        myDiagram.model = go.Model.fromJson({
            "class": "go.GraphLinksModel",
            "linkFromPortIdProperty": "fromPort",
            "linkToPortIdProperty": "toPort",
            "nodeDataArray": [
                {"category": "Start", "text": "Start", "key": -1, "loc": "207.15625000000003 39.99999999999999"},
                {"category": "End", "text": "End", "key": -4, "loc": "208.5960057626528 216.26768871290687"}
            ],
            "linkDataArray": []
        });
        if (myPalette != null) {
            myPalette.div = null;
        }
        myPalette =
                $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                        {
                            "animationManager.duration": 100, // slightly longer than default (600ms) animation
                            nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                            model: new go.GraphLinksModel(taskContentArray)
                        });

        // The following code overrides GoJS focus to stop the browser from scrolling
        // the page when either the Diagram or Palette are clicked or dragged onto.

        function customFocus() {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            go.Diagram.prototype.doFocus.call(this);
            window.scrollTo(x, y);
        }

        myDiagram.doFocus = customFocus;
        myPalette.doFocus = customFocus;
        document.getElementById("myPaletteDiv").style.height = document.body.scrollHeight + "px";

        myDiagram.isReadOnly = _this.isNotAdmin;  // Disable the diagram!
        myPalette.isReadOnly = _this.isNotAdmin;  // Disable the diagram!

        if (document.body.scrollHeight == 0) {
            document.getElementById("myDiagramDiv").style.height = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) + "px";
            document.getElementById("myPaletteDiv").style.height = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) + "px";
        }


    } // end init

    // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "white" : null);
        });
    }

</script>
<style>
    .el-select {
        width: 100%;
    }

    .el-input-number {
        width: 100%;
        float: left;
    }

</style>


