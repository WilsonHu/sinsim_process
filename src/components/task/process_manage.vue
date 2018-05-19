<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <el-col class="well well-lg" style="background-color: white;" v-show="!addDialogVisible">
            <div align="right" style="margin-bottom: 20px">
                <el-button
                        icon="el-icon-plus"
                        size="normal"
                        type="primary"
                        @click="addDialogShow">安装流程
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading">
                <!--<el-table-column-->
                <!--type="selection"-->
                <!--align="center"-->
                <!--width="55">-->
                <!--</el-table-column>-->
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">{{ scope.$index+startRow}}</template>
                </el-table-column>
                <el-table-column label="流程名称" align="center">
                    <template scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                        width="120"
                        label="创建日期"
                        align="center">
                    <template slot-scope="scope">
		                    <span>
			                    {{(scope.row.createTime)|filterDateString}}
		                    </span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120"
                        label="修改日期"
                        align="center">
                    <template slot-scope="scope">
                                <span>
                                    {{(scope.row.updateTime)|filterDateString}}
                                </span>
                    </template>
                </el-table-column>
                <el-table-column label="编辑" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-edit"
                                :disabled="cantEdit"
                                @click="editWithItem(scope.$index, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="删除" width="100" align="center">
                    <template scope="scope" style="text-align: center">
                        <el-button
                                size="small"
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteWithItem(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <div class="block" align="center">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="totalNum">
                </el-pagination>
            </div>
            <br>
        </el-col>
        <el-dialog title="提示" :visible.sync="deleteConfirmVisible"
                   append-to-body>
            <span>确认要删除选定的工作过程信息吗？</span>
            <span slot="footer" class="dialog-footer">
	      <el-button @click="deleteConfirmVisible = false" icon="el-icon-close">取 消</el-button>
	      <el-button type="primary" @click="onConfirmDelete" icon="el-icon-check">确 定</el-button>
	      </span>
        </el-dialog>
        <el-dialog :visible.sync="addDialogVisible" fullscreen
                   :title="dialogTitle"
                   @open="onopened">
            <table style="width: 100%">
                <tr style="width: 100%;vertical-align: text-top;">
                    <td>
                        <el-row>
                            <el-form :model="addForm"
                                     style="vertical-align: text-top;padding-right: 10px">
                                <el-col :span="24">
                                    <el-form-item label="工作内容名称：">
                                        <el-input type="text" style="width: 100%"
                                                  autosize v-model="addForm.name" auto-complete="off"
                                                  placeholder="工作内容名称">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <br>
                        <el-row>
                            <el-button
                                    icon="el-icon-check"
                                    size="small"
                                    type="primary"
                                    @click="onSave">保存
                            </el-button>
                            <el-button
                                    icon="el-icon-close"
                                    size="small"
                                    type="danger"
                                    @click="onClose">关闭
                            </el-button>
                        </el-row>
                    </td>
                    <td style="width: 80%">
                        <div id="sample">
                            <div style="width:100%; white-space:nowrap; ">
                                <span style="display: inline-block; vertical-align: top; width: 15%;">
                                  <div id="myPaletteDiv" style="border: solid 1px black;"></div>
                                </span>
                                <span style="display: inline-block; vertical-align: top; text-align: center;width:85%">
			                        <div id="myDiagramDiv" style="border: solid 1px black;"></div>
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
    import Vue from 'vue';
    import {Notification} from 'element-ui';
    import {Loading} from 'element-ui';
    var _this;
    var myDiagram;
    var myPalette;
    var subParts = new go.List();
    export default {
        name: "process_manage",
        components: {},
        data () {
            _this = this;
            return {
                userInfo: {},
                deleteUrl: HOST + "process/delete",
                addUrl: HOST + "process/add",
                editProcessUrl: HOST + "process/update",
                taskContentNameUrl: HOST + "task/list",
                groupUrl: HOST + "/install/group/list",
                listLoading: false,
                groupList: [],
                tableData: [],
                multipleSelection: [],

                pageSize: EveryPageNum,//每一页的num
                currentPage: 1,
                startRow: 1,
                totalNum: 0,

                modifyDialogVisible: false,
                isEdit: false,
                addDialogVisible: false,
                cantEdit: false,
                modifyForm: {},
                addForm: {
                    name: "",
                    taskList: "",
                },
                dialogLoading: true,
                deleteConfirmVisible: false,
                deletedItem: {
                    data: [],
                },
                selectedItem: {},
                errorMsg: '',
                isError: false,
                loadingInstance: {},
                dialogTitle: '新增工作流程',
            }

        },
        methods: {
            getGroupData()
            {
                //_this.groupList = JSON.parse(sessionStorage.getItem('groupList'));
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
                            //sessionStorage.setItem('groupList', JSON.stringify(_this.groupList));
                        }
                    },
                })
            },

            handleSelectionChange(val) {
                if (val.length <= 0) {
                    this.cantEdit = false;
                } else {
                    this.cantEdit = true;
                }
                this.multipleSelection = val;
            },


            handleCurrentChange(val) {
                this.currentPage = val;
                this.getProcessData();
            },

            getTaskContentName(){
                $.ajax({
                    url: _this.taskContentNameUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: null,
                    success: function (res) {
                        if (res.code == 200) {
                            jsonArray = [];
                            for (var i = res.data.list.length - 1; i >= 0; i--) {
                                var str = {
                                    "text": res.data.list[i].taskName,
                                    "taskStatus": "0",
                                    "beginTime": "",
                                    "endTime": "",
                                    "leader": "",
                                    "workList": "",
                                };
                                jsonArray.push(str);
                            }
                        }
                        else {

                        }
                    }
                })
            },
            getProcessData() {

                $.ajax({
                    url: HOST + "process/list",
                    type: 'POST',
                    dataType: 'json',
                    data: {page: _this.currentPage, size: _this.pageSize},
                    success: function (res) {
                        if (res.code == 200) {
                            _this.tableData = res.data.list;
                            //倒序排序方法
                            _this.tableData.sort(function (a, b) {
                                return a.createTime < b.createTime;
                            });
                            _this.totalNum = res.data.total;
                            _this.startRow = res.data.startRow;
                        } else {
                            // _this.tableData = data.info
                            _this.tableData = [];
                        }
                    }
                })
            },
            deleteWithItem(data){
//                _this.deletedItem.data = [];
//                if (_this.multipleSelection.length >= 1) {
//                    for (var i = _this.multipleSelection.length - 1; i >= 0; i--) {
//                        _this.deletedItem.data.push(_this.multipleSelection[i].id);
//                    }
//                } else {
//                    _this.deletedItem.data.push(data.id);
//                }

                _this.selectedItem = copyObject(data);
                _this.deleteConfirmVisible = true;

            },
            onConfirmDelete(){
                _this.deleteConfirmVisible = false;

                $.ajax({
                    url: _this.deleteUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: parseInt(_this.selectedItem.id)
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "删除成功", 1)
                            _this.getProcessData();
                        } else {
                            showMessage(_this, "删除失败", 0)
                        }
                    }
                })
            },

            editWithItem(index, data){
                _this.dialogTitle = '修改工作流程';
                _this.selectedItem = copyObject(data);
                _this.addDialogVisible = true;
                _this.isEdit = true;
                _this.addForm = data;
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
                }, 1200);
            },

            addDialogShow(){
                _this.dialogTitle = '新增工作流程';
                _this.isEdit = false;
                _this.addDialogVisible = true;
            },
            onSubmitAsEdit(){

                $.ajax({
                    url: _this.editProcessUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: _this.addForm.id,
                        name: _this.addForm.name,
//                            createTime: '',
                        updateTime: new Date(),
                        taskList: _this.addForm.taskList,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "修改成功", 1)
                            _this.getProcessData();

                        } else {
                            showMessage(_this, "修改失败", 0)
                        }
                        _this.addDialogVisible = false;
                        _this.isEdit = false;
                    },
                })
            },
            onSubmitAsNew(){
                var d = new Date().format("yyyy-MM-dd hh:mm:ss");
                $.ajax({
                    url: _this.addUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: _this.addForm.name,
                        createTime: new Date(),
                        updateTime: new Date(),
                        taskList: _this.addForm.taskList,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            showMessage(_this, "添加成功", 1)
                            _this.getProcessData();
                        } else {
                            showMessage(_this, "添加失败", 0)
                        }
                        _this.addDialogVisible = false;
                    },
                })
            },
            onSave(){
                _this.addForm.taskList = myDiagram.model.toJson();
                if (_this.addForm.name == "") {
                    showMessage(_this, "请填写流程名称！", 0)
                } else {
                    if (_this.isEdit == true) {
                        _this.onSubmitAsEdit();
                    } else {
                        _this.onSubmitAsNew();
                    }
                }
            },
            onClose(){
                _this.addDialogVisible = false;
            },

            // Show the diagram's model in JSON format that the user may edit
            save() {
                document.getElementById("mySavedModel").value = myDiagram.model.toJson();
                myDiagram.isModified = false;
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
        filters: {
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
            filterDateString(strDate)
            {
                var resDate = new Date(strDate);
                return resDate.format("yyyy-MM-dd");
            },

        },
        computed: {
            isNotAdmin() {
                var userinfo = JSON.parse(sessionStorage.getItem('user'));
                return userinfo.account != "admin";
            }
        },

        created: function () {
            _this.getGroupData();
            _this.getTaskContentName();
            _this.getProcessData();
        },
        mounted: function () {

        },
        destroyed: function () {
        }
    }
    var jsonArray = [];
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
                                            editable: false,
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
                                        {minSize: new go.Size(48, 48), fill: "#DC3C00", stroke: null}),
                                $(go.TextBlock, "End",
                                        {
                                            font: "bold 11pt Helvetica, Arial, sans-serif",
                                            stroke: lightText,
                                            editable: false,
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
                                    maxSize: new go.Size(220, NaN),
                                    minSize: new go.Size(160, 30),
                                    wrap: go.TextBlock.WrapFit,
                                    textAlign: "center",
                                    editable: false,
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
                {"category": "Start", "text": "Start", "key": -1, "loc": "208 40"},
                {"category": "End", "text": "End", "key": -4, "loc": "208 216"}
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
                            model: new go.GraphLinksModel(jsonArray)
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

        document.getElementById("myDiagramDiv").style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + "px";
        document.getElementById("myPaletteDiv").style.height = document.getElementById("myDiagramDiv").style.height;
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
    .process_container {
        background-color: whitesmoke;
        position: absolute;
        overflow-y: scroll;
        width: 65%;
        height: 90%;
        padding: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 30%;
    }

    .other_container {
        background-color: whitesmoke;
        position: absolute;
        overflow-y: scroll;
        width: 30%;
        height: 90%;
        padding: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .all_container {
        background-color: whitesmoke;
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 5px;

    }

    .close_button {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        padding: 10px;
        /*margin-right: 10px;*/
        /*margin-top: 80%;*/
    }
</style>
