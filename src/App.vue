<template>
    <div id="app" @mouseup="dragging=false">
        <div>
            <el-form :inline="true" :model="config" class="demo-form-inline">
                <div class="form-wrap">

                    <el-form-item label="中文名" :required="true">
                        <el-input v-model="config.name"></el-input>
                    </el-form-item>
                    <el-form-item label="皮肤">
                        <ColorSelector :colors="colors" v-model="config.selectingColor" />
                    </el-form-item>
                    <el-select v-model="config.job" placeholder="选择角色" style="margin-right:10px;">
                        <el-option key="developer" label="程序员" value="developer"></el-option>
                        <el-option key="pm" label="产品经理" value="pm"></el-option>
                    </el-select>
                    <el-switch v-model="config.bossMode" active-text="Boss模式">
                    </el-switch>
                    <el-tag v-if="unsaved" type="danger" style="position:absolute;top:0;bottom:0;right:0;margin:auto;">未保存</el-tag>
                </div>

            </el-form>
            <!-- <span>
                小屏模式：
                <el-switch v-model="config.smallScreen">
                </el-switch>
            </span> -->

        </div>
        <SortableTable :dragging.sync="dragging" :checkDrag="checkDrag" style="margin-bottom:10px;">
            <el-table empty-text="点击‘添加项目’按钮开始使用" :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;" :header-row-style="getHeaderStyle" @cell-click="onCellClick" :style="{borderColor:config.selectingColor.border_color,color:config.selectingColor.content_color}">
                <el-table-column prop="project" label="项目名称" width="120">
                    <template slot-scope="scope">
                        <span @click="editProject(scope.row)">{{scope.row.project}}</span>
                        <div>
                            <el-button @click.native.prevent.stop="deleteProject(scope.row,scope.$index)" size="small" type="danger">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="50" align="center">
                    <template slot-scope="scope">
                        <i v-if="scope.row.task" class="el-icon-sort handle" style="font-size:20px;cursor:grab;cursor:-webkit-grab;"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="task" label="详细任务" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.task" type="textarea"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="precondition" label="前置条件" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.precondition" type="textarea"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="dependency" label="前置责任人" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dependency"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="labour" label="工时（PD）" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.labour" type="number"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==='未开始'" class="status-icon">👤</span>
                        <span v-if="scope.row.status==='进行中'" class="status-icon">👨🏼‍💻</span>
                        <span v-if="scope.row.status==='完成'" class="status-icon">🙏</span>
                        <el-select v-model="scope.row.status" placeholder="状态选择" style="width: 90px;">
                            <el-option v-for="state in stateList[config.job]" :label="state" :key="state" :value="state">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="计划开始时间" width="121">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startTime" type="date" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="finishTime" label="计划完成时间" width="121">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.finishTime" type="date" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="actualFinishTime" label="实际完成时间" width="121">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.actualFinishTime" type="date" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.comment" type="textarea"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="config.bossMode" prop="owner" label="负责人" min-width="200">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteRow(scope.row,scope.$index)" size="small" type="danger">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </SortableTable>
        <el-button type="primary" @click="add">添加项目</el-button>
        <el-button type="warning" @click="importTable">导入</el-button>
        <el-button type="success" @click="exportTable">导出</el-button>
        <el-button type="success" @click="save">保存</el-button>
        <ExportDialog ref="exportDialog" />
        <ImportDialog ref="importDialog"/>
    </div>
</template>

<script>
import ColorSelector from "@/components/color-selector";
import SortableTable from "@/components/sortable-table";
import getStorage from "@/tools/get-storage";
import ExportDialog from "@/components/export-dialog";
import ImportDialog from "@/components/import-dialog";

const colors = [
    {
        title: "标准颜色",
        title_color: "#fff",
        bg_color: "rgb(66,66,66)",
        border_color: "#000",
        content_color: "#000"
    },
    {
        title: "蓝色",
        title_color: "#fff",
        bg_color: "#409eff",
        border_color: "#ebeef5",
        content_color: "#606266"
    },
    {
        title: "绿色",
        title_color: "#fff",
        bg_color: "#67c23a",
        border_color: "#ebeef5",
        content_color: "#606266"
    },
    {
        title: "橙色",
        title_color: "#fff",
        bg_color: "#E6A23C",
        border_color: "#ebeef5",
        content_color: "#606266"
    },
    {
        title: "红色",
        title_color: "#fff",
        bg_color: "#F56C6C",
        border_color: "#ebeef5",
        content_color: "#606266"
    },
    {
        title: "灰色",
        title_color: "#fff",
        bg_color: "#909399",
        border_color: "#ebeef5",
        content_color: "#606266"
    },
    {
        title: "PMO最爱",
        title_color: "#000",
        bg_color: "rgb(146,208,80)",
        border_color: "#000",
        content_color: "#000"
    }
];
function getNextMonday(time) {
    const bias = 8 * 36e5 + 3 * 24 * 36e5;
    const weekTime = Math.ceil((time + bias) / 24 / 36e5 / 7);
    return new Date((weekTime * 7 * 24 + 9) * 36e5 - bias);
}
function isEmptyTask(task){
    return !task.task&&!task.precondition&&!task.labour&&!task.comment;
}
function getTask(assigned = {}) {
    const empty = {
        project: "",
        task: "",
        precondition: "",
        dependency: "",
        labour: null,
        status: "未开始",
        startTime: null,
        finishTime: null,
        actualFinishTime: null,
        comment: "",
        owner:''
    };
    return Object.assign(empty, assigned);
}

const { setter: setConfig, getter: getConfig } = getStorage(
    "arragement10-config",
    {
        selectingColor: colors[0],
        smallScreen: false,
        name: "",
        bossMode: false,
        job: "developer"
    }
);

const { setter: setTableData, getter: getTableData } = getStorage(
    "arragement10-table",
    []
);
Date.prototype.format = function(format) {
    const zeros = ["", "0", "00", "000", "0000"];
    const c = {
        "Y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
        );
    }
    for (const k in c) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? c[k]
                    : (zeros[RegExp.$1.length] + c[k]).substr(`${c[k]}`.length)
            );
        }
    }
    return format;
};
export default {
    name: "app",
    beforeMount() {
        this.config = getConfig();
        this.tableData = getTableData();
        setTimeout(() => {
            this.ready = true;
            this.unsaved = false;
        });

        window.addEventListener("beforeunload", e => {
            if (this.unsaved) {
                //useless
                e.returnValue = "有未保存内容，是否退出？";
            }
        });
    },
    data() {
        return {
            ready: false,
            dragging: false,
            config: null,
            unsaved: false,
            stateList: {
                pm: [
                    "需求规划",
                    "需求分析",
                    "UI设计",
                    "需求待评审",
                    "待排期",
                    "待开发",
                    "开发中",
                    "待提测",
                    "待测试",
                    "测试中",
                    "待验收",
                    "待上线",
                    "已上线",
                    "暂停"
                ],
                developer: ["未开始", "进行中", "完成"]
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            picker.$emit(
                                "pick",
                                new Date(
                                    Math.floor(
                                        (Date.now() + 8 * 36e5) / (24 * 36e5)
                                    ) *
                                        24 *
                                        36e5 +
                                        1 * 36e5
                                )
                            );
                        }
                    },
                    {
                        text: "明天",
                        onClick(picker) {
                            picker.$emit(
                                "pick",
                                new Date(
                                    Math.floor(
                                        (Date.now() + (8 + 24) * 36e5) /
                                            (24 * 36e5)
                                    ) *
                                        24 *
                                        36e5 +
                                        1 * 36e5
                                )
                            );
                        }
                    },
                    {
                        text: "下周一",
                        onClick(picker) {
                            picker.$emit("pick", getNextMonday(Date.now()));
                        }
                    }
                ]
            },
            colors,
            tableData: []
        };
    },
    watch: {
        config: {
            deep: true,
            handler(config) {
                setConfig(config);
            }
        },
        tableData: {
            deep: true,
            immediate: true,
            handler(tableData) {
                if (this.ready) {
                    this.unsaved = true;
                }
                //merge projects
                const shouldMerge=tableData.some((row,rowIndex)=>{
                    // last row of a project
                    const currentProj=row.project;
                    if(tableData[rowIndex+1] && currentProj!==tableData[rowIndex+1].project){                        
                        for(let followingIndex=rowIndex+1;followingIndex<tableData.length;followingIndex++){
                            const followingProj=tableData[followingIndex].project;
                            if(followingProj===currentProj){
                                return true;
                            }
                        }
                    }
                });
                if(shouldMerge){
                    const newTable=[];
                    tableData.forEach((li)=>{
                        const insertIndex=newTable.findIndex((row,i)=>{
                            return i===newTable.length-1||row.project!==newTable[i+1].project;
                        });
                        if(insertIndex===-1){
                            newTable.push(li);
                        }else{
                            newTable.splice(insertIndex+1,0,li);
                        }
                    });
                    this.tableData=newTable;
                    tableData=newTable;
                }
                tableData.forEach((row, i) => {
                    if (!row.task) {
                        return;
                    }
                    //last row
                    if (i === tableData.length - 1) {
                        if (row.task) {
                            tableData.push(getTask({ project: row.project,owner:this.config.name }));
                        }
                    } else {
                        if (
                            row.task &&
                            row.project !== tableData[i + 1].project
                        ) {
                            tableData.splice(
                                i + 1,
                                0,
                                getTask({ project: row.project,owner:this.config.name })
                            );
                        }
                    }
                });
            }
        }
    },
    computed: {},
    methods: {
        save() {
            this.unsaved = false;
            setTableData(this.tableData);
        },
        checkDrag(newIndex, oldIndex) {
            const newPositionData = this.tableData[newIndex];
            const oldPositionData = this.tableData[oldIndex];
            if (
                newPositionData.project !== oldPositionData.project ||
                !newPositionData.task
            ) {
                return false;
            }
            return true;
        },
        deleteProject(row){
            this.$confirm("是否确定删除项目：" + row.project, "danger", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.tableData=this.tableData.filter((li)=>{
                        return li.project!==row.project;
                    });
                })
                .catch(() => {
                    //nothing
                });
        },
        deleteRow(row, index) {
            this.$confirm("是否确定删除任务：" + row.task, "Warning", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.tableData.splice(index, 1);
                })
                .catch(() => {
                    //nothing
                });
        },
        onCellClick(row, cell) {
            if (cell.label === "项目名称") {
                this.editProject(row);
            }
        },
        editProject(row) {
            const initialProject = row.project;
            this.$prompt("", "项目名称", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                inputValue: initialProject
            })
                .then(({ value }) => {
                    if (!value) {
                        return;
                    }
                    this.tableData.forEach(row => {
                        if (row.project === initialProject) {
                            row.project = value;
                        }
                    });
                })
                .catch(() => {});
        },
        importTable() {
            this.$refs.importDialog.show().then(({list})=>{
                this.tableData.push(...list);
                this.tableData=this.tableData.filter((li)=>{
                    return !isEmptyTask(li);
                });
            });
        },
        exportTable() {
            this.$refs.exportDialog.show(this.tableData, {
                skin: this.config.selectingColor,
                bossMode:this.config.bossMode,
                name: this.config.name || ""
            });
        },
        add() {
            this.$prompt("", "项目名称", {
                confirmButtonText: "确认",
                cancelButtonText: "取消"
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: "Invalid Email"
            })
                .then(({ value }) => {
                    if (!value) {
                        return;
                    }
                    this.tableData.push(
                        getTask({
                            project: value,
                            owner:this.config.name
                        })
                    );
                })
                .catch(() => {});
        },
        getHeaderStyle() {
            return {
                "background-color": this.config.selectingColor.bg_color,
                color: this.config.selectingColor.title_color
            };
        },
        objectSpanMethod({ rowIndex, columnIndex }) {
            if (this.dragging) {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            }
            if (columnIndex === 0) {
                if (
                    rowIndex !== 0 &&
                    this.tableData[rowIndex - 1].project ===
                        this.tableData[rowIndex].project
                ) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else {
                    let cnt = 0;
                    for (let i = rowIndex; i < this.tableData.length; i++) {
                        if (
                            this.tableData[i].project ===
                            this.tableData[rowIndex].project
                        ) {
                            cnt++;
                        }
                    }
                    return {
                        rowspan: cnt,
                        colspan: 1
                    };
                }
            }
        }
    },
    components: { ColorSelector, SortableTable, ExportDialog, ImportDialog }
};
</script>

<style lang="less">
body {
    font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    color: #2c3e50;
}
#app {
    padding: 0 10px;
}
.el-table th {
    background-color: inherit !important;
}
.sortable-dragging td:first-child:not([rowspan="1"]) {
    display: none;
}
.el-table.el-table--border {
    .el-table__header-wrapper,
    .el-table__body-wrapper,
    .el-table__fixed-body-wrapper,
    .el-table__fixed-right,
    tbody,
    table,
    td,
    tr,
    th,
    th.is-leaf {
        border-color: inherit;
        line-height: 1.3;
    }
    td {
        div.cell {
            text-overflow: unset;
        }
    }
    input,
    textarea {
        color: inherit;
    }
}
.form-wrap {
    display: flex;
    align-items: center;
    padding: 10px 0;
    position: relative;
    .el-form-item {
        margin: 0;
    }
}
.status-icon{
    margin-right: 10px;
    font-size:20px;
}
</style>
