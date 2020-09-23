<template>
<div>
  <!-- 1.添加按钮 -->
   <el-button type="primary" icon="el-icon-plus">添加</el-button>

   <!-- 2.表格  element-ui table 看列(序号列) -->
   <!-- 2.1写静态页面 先把动态数据全部干掉 -->
   <el-table style="width:100%;margin:20px 0;" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width"></el-table-column>
   </el-table>
   
   <!-- 3.分页器 -->
   <!-- 3.1先写静态页面先把动态数据干掉 -->
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align:center"
      :current-page="1"
      :page-sizes="[10, 20, 50]"
      :page-size="10"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="100">
    </el-pagination>
</div>
  
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page:1,
      limit:3,
      trademarkList:[]
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods:{
    getTrademarkList(){
      this.$API.trademark.getPageList(this.page,this.limit)
    }
  }

}
</script>

<style scoped>

</style>
