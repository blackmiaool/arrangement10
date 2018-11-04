
<template>
    <el-dialog title="导出" :visible.sync="dialogVisible" width="90%">
        <div style="overflow:auto;">
            <div v-html="html" contenteditable="contenteditable">

            </div>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
        </span>
    </el-dialog>
</template>

<script>
import generateTable from "@/tools/table-generator";

export default {
    name: "ExportDialog",
    data() {
        return {
            dialogVisible: false,
            html: ""
        };
    },
    methods: {
        show(tableData) {
            this.html = generateTable(tableData);
            this.dialogVisible = true;
        }
    }
};
</script>
<style scoped>
table,th,td{
    border: 1px solid #ebeef5;
}
</style>
