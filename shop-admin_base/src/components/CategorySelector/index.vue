<template>
  <el-form :inline="true" :model="cform">
  <!-- form 一定要指定一个对象model   用来收集数据 -->
    <el-form-item label="一级分类">
      <el-select v-model="cform.category1Id" placeholder="请选择">
        <!-- 
          select 收集的数据是选中的那个value值
          select本身并没有value值 它的value值是他选中的option的value值
          select收集的是他选中的某一项的value值
          收集是选中的那一项的id 后期要通过id去发请求 拿数据
          value值拿到就是某一个一级分类的id

          一级分类一上来就有数据,因此在mounted中发请求
          选中一级的时候二级才有数据
          选中二级的时候三级才有数据
         -->
        <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
        
      </el-select>
    </el-form-item>
    
      <el-form-item label="二级分类">
      <el-select v-model="cform.category2Id" placeholder="请选择">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="三级分类">
      <el-select v-model="cform.category3Id" placeholder="请选择">
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
        category1Id:'',
        category2Id:'',
        category3Id:''
      },
      category1List:[],
      category2List:[],
      category3List:[]
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods:{
    async getCategoryList(){
      const result = await this.$API.category.getCategorys1()

      if(result.code === 200){
        this.category1List = result.data
      }
    }
  }
};
</script>



 
 
