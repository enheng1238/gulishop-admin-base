<template>
<div>
  <!-- 1.添加按钮 -->
   <el-button type="primary" icon="el-icon-plus">添加</el-button>

   <!-- 2.表格  element-ui table 看列(序号列) -->
   <!-- 2.1写静态页面 先把动态数据全部干掉 -->
   <el-table style="width:100%" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width"></el-table-column>
   </el-table>
   
</div>
  
</template>

<script>
export default {
  name: 'Trademark',
}
</script>

<style scoped>

</style>
