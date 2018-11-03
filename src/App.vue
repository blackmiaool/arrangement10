<template>
    <div id="app">
        <div>
            皮肤：
            <ColorSelector :colors="colors" v-model="selectingColor" />
        </div>

        <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px" :header-row-style="getHeaderStyle" @cell-click="onCellClick">
            <el-table-column prop="project" label="项目名称" width="120">
                <template slot-scope="scope">
                    <span @click="editProject(scope.row)">{{scope.row.project}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="task" label="详细任务">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.task"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="precondition" label="前置条件">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.precondition"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="dependency" label="前置责任人" width="100">
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
                    <el-date-picker v-model="scope.row.startTime" type="date" placeholder="Pick a day" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column prop="finishTime" label="计划完成时间" width="121">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.finishTime" type="date" placeholder="Pick a day" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column prop="actualFinishTime" label="实际完成时间" width="121">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.actualFinishTime" type="date" placeholder="Pick a day" :picker-options="pickerOptions" style="width:100px;" format="MM-dd">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.labour"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="add">添加项目</el-button>
        <el-button type="success" @click="exportTable">导出</el-button>
    </div>
</template>

<script>
import ColorSelector from "@/components/color-selector";

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
export default {
    name: "app",
    mounted() {},
    data() {
        return {
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
            selectingColor: colors[0],
            colors,
            tableData: [
                {
                    project: "proj1",
                    task: "task1",
                    precondition: "condition1",
                    dependency: "people1",
                    labour: 2,
                    status: "完成",
                    startTime: 1540997086733,
                    finishTime: 1540997104842,
                    actualFinishTime: 1540997104842,
                    comment: "备注1"
                },
                {
                    project: "proj1",
                    task: "task2",
                    precondition: "condition1",
                    dependency: "people1",
                    labour: 2,
                    status: "未开始",
                    startTime: 1540997086733,
                    finishTime: 1540997104842,
                    actualFinishTime: 1540997104842,
                    comment: "备注2"
                },
                {
                    project: "proj2",
                    task: "task3",
                    precondition: "condition1",
                    dependency: "people1",
                    labour: 2,
                    status: "完成",
                    startTime: 1540997086733,
                    finishTime: 1540997104842,
                    actualFinishTime: 1540997104842,
                    comment: "备注1"
                },
                {
                    project: "proj2",
                    task: "task4",
                    precondition: "condition1",
                    dependency: "people1",
                    labour: 2,
                    status: "未开始",
                    startTime: 1540997086733,
                    finishTime: 1540997104842,
                    actualFinishTime: 1540997104842,
                    comment: "备注2"
                },
                {
                    project: "proj2",
                    task: "task4",
                    precondition: "condition1",
                    dependency: "people1",
                    labour: 2,
                    status: "未开始",
                    startTime: 1540997086733,
                    finishTime: 1540997104842,
                    actualFinishTime: 1540997104842,
                    comment: "备注2"
                }
            ]
        };
    },
    watch: {
        tableData: {
            deep: true,
            immediate: true,
            handler(tableData) {
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
                "background-color": this.selectingColor.bg_color,
                color: this.selectingColor.title_color
            };
        },
        objectSpanMethod({ rowIndex, columnIndex }) {
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
    components: { ColorSelector }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
    margin-top: 60px;
}
.el-table th {
    background-color: inherit !important;
}
</style>
