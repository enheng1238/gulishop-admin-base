<template>
  <el-form :inline="true" :model="cform" class="demo-form-inline">
  <!-- form 一定要指定一个对象model   用来收集数据 -->
    <el-form-item label="一级分类">
      <el-select v-model="cform.category1Id" placeholder="请选择">
        <!-- 
          select 收集的数据是选中的那个value值
          select本身并没有value值 它的value值是他选中的option的value值
          select收集的是他选中的某一项的value值
          收集是选中的那一项的id 后期要通过id去发请求 拿数据
          value值拿到就是某一个一级分类的id
         -->
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    
  </el-form>
</template>


<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      //定义cform
      cform:{
        category1Id:''
      }
    }
  },
};
</script>



 
 
