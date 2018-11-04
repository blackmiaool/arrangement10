<template>
    <div id="app" @mouseup="dragging=false">
        <div>
            <el-form :inline="true" :model="config" class="demo-form-inline">
                <el-form-item label="皮肤">
                    <ColorSelector :colors="colors" v-model="config.selectingColor" />
                </el-form-item>
                <el-form-item label="中文名" :required="true">
                    <el-input v-model="config.name"></el-input>
                </el-form-item>

                <el-tag v-if="unsaved" type="danger" style="float:right;">未保存</el-tag>
            </el-form>
            <!-- <span>
                小屏模式：
                <el-switch v-model="config.smallScreen">
                </el-switch>
            </span> -->

        </div>
        <SortableTable :dragging.sync="dragging" :checkDrag="checkDrag">
            <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;" :header-row-style="getHeaderStyle" @cell-click="onCellClick">
                <el-table-column prop="project" label="项目名称" width="120">
                    <template slot-scope="scope">
                        <span @click="editProject(scope.row)">{{scope.row.project}}</span>
                        <div>
                            <el-button @click.native.prevent="deleteRow(scope.row,scope.$index)" size="small" type="danger">
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
                <el-table-column prop="status" label="状态" width="110">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.status" placeholder="状态选择">
                            <el-option label="未开始" value="未开始">
                            </el-option>
                            <el-option label="进行中" value="进行中">
                            </el-option>
                            <el-option label="完成" value="完成">
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
        <el-button type="success" @click="exportTable">导出</el-button>
        <el-button type="success" @click="save">保存</el-button>
    </div>
</template>

<script>
import ColorSelector from "@/components/color-selector";
import SortableTable from "@/components/sortable-table";
import getStorage from "@/tools/get-storage";

const colors = [
    {
        title: "标准颜色",
        title_color: "#fff",
        bg_color: "rgb(66,66,66)"
    },
    {
        title: "蓝色",
        title_color: "#fff",
        bg_color: "#409eff"
    },
    {
        title: "绿色",
        title_color: "#fff",
        bg_color: "#67c23a"
    },
    {
        title: "橙色",
        title_color: "#fff",
        bg_color: "#E6A23C"
    },
    {
        title: "红色",
        title_color: "#fff",
        bg_color: "#F56C6C"
    },
    {
        title: "灰色",
        title_color: "#fff",
        bg_color: "#909399"
    },
    {
        title: "PMO最爱",
        title_color: "#000",
        bg_color: "rgb(146,208,80)"
    }
];
function getNextMonday(time) {
    const bias = 8 * 36e5 + 3 * 24 * 36e5;
    const weekTime = Math.ceil((time + bias) / 24 / 36e5 / 7);
    return new Date((weekTime * 7 * 24 + 9) * 36e5 - bias);
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
        comment: ""
    };
    return Object.assign(empty, assigned);
}

const { setter: setConfig, getter: getConfig } = getStorage(
    "arragement10-config",
    {
        selectingColor: colors[0],
        smallScreen: false,
        name: true
    }
);

const { setter: setTableData, getter: getTableData } = getStorage(
    "arragement10-table",
    []
);

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
            console.log("sdf", this.unsaved);
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

                tableData.forEach((row, i) => {
                    if (!row.task) {
                        return;
                    }
                    //last row
                    if (i === tableData.length - 1) {
                        if (row.task) {
                            tableData.push(getTask({ project: row.project }));
                        }
                    } else {
                        if (
                            row.task &&
                            row.project !== tableData[i + 1].project
                        ) {
                            tableData.splice(
                                i + 1,
                                0,
                                getTask({ project: row.project })
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
        exportTable() {},
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
                            project: value
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
            // if (columnIndex === 0) {
            //     if (
            //         rowIndex !== this.tableData.length - 1 &&
            //         this.tableData[rowIndex + 1].project ===
            //             this.tableData[rowIndex].project
            //     ) {
            //         return {
            //             rowspan: 0,
            //             colspan: 0
            //         };
            //     } else {
            //         let cnt = 0;
            //         for (let i = 0; i < this.tableData.length; i++) {
            //             if (
            //                 this.tableData[i].project ===
            //                 this.tableData[rowIndex].project
            //             ) {
            //                 cnt++;
            //             }
            //         }
            //         console.log("cnt", cnt, this.tableData[rowIndex].project,this.tableData);
            //         return {
            //             rowspan: -cnt,
            //             colspan: 1
            //         };
            //     }
            // }
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
    components: { ColorSelector, SortableTable }
};
</script>

<style>
body {
    font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
}
.el-table th {
    background-color: inherit !important;
}
.sortable-dragging td:first-child:not([rowspan="1"]) {
    display: none;
}
</style>
