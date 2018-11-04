<template>
    <div ref="wrapper">
        <div :key="tableKey">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/*
only for el-table
must be used as:
<SortableTable>
    <el-table ...>
        ...
    </el-table>
</SortableTable>
*/


import sortable from "sortablejs";

export default {
    name: "SortableTable",
    data() {
        return {
            tableKey: 0
        };
    },
    props: ["checkDrag"],
    methods: {
        makeTableSortAble() {
            const table = this.$children[0].$el.querySelector(
                ".el-table__body-wrapper tbody"
            );
            const that=this;
            sortable.create(table, {
                handle: ".handle",
                dragClass: "sortable-dragging",
                animation: 150,
                onStart(){
                    that.$emit('update:dragging',true);
                },
                onEnd: ({ newIndex, oldIndex }) => {
                    that.$emit('update:dragging',false);
                    if (this.checkDrag) {
                        const result = this.checkDrag(newIndex, oldIndex);
                        if (!result) {                            
                            this.tableKey = Math.random();
                            return false;
                        }
                        if (result.msg) {
                            this.$message.error(result.msg);
                            this.tableKey = Math.random();
                            return false;
                        }
                    }
                    
                    this.keepWrapperHeight(true);
                    this.tableKey = Math.random();
                    const arr = this.$children[0].data;
                    const targetRow = arr.splice(oldIndex, 1)[0];
                    arr.splice(newIndex, 0, targetRow);
                }
            });
        },
        keepWrapperHeight(keep) {
            const wrapper = this.$refs.wrapper;
            if (keep) {
                wrapper.style.minHeight = `${wrapper.clientHeight}px`;
            } else {
                wrapper.style.minHeight = `auto`;
            }
        }
    },
    mounted() {
        this.makeTableSortAble();
    },
    watch: {
        tableKey() {
            this.$nextTick(() => {
                this.makeTableSortAble();
                this.keepWrapperHeight(false);
            });
        }
    }
};
</script>
