<template>
  <div id="app">
    <el-table
      :data="tableData6"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="name"
        label="项目名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="task"
        label="详细任务">
      </el-table-column>
      <el-table-column
        prop="amount1"
        label="前置条件">
      </el-table-column>
      <el-table-column
        prop="amount2"
        label="前置责任人">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="工时（PD）">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="计划开始时间">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="计划完成时间">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="实际完成时间">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="备份">
      </el-table-column>
    </el-table>
    <el-button type="primary">添加项目</el-button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      tableData6: [{
        id: '12987122',
        name: 'Tom',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: 'Tom',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: 'Tom',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: 'Tom',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: 'Tom',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }]
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
