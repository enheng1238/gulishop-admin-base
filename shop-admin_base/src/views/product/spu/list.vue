<template>
  <div>
     <el-card>
       <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
     </el-card>

     <el-card style="margin-top:20px">
       <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
       <el-table
         :data="spuList"
         border
         style="width: 100%">
         <el-table-column
           align="center"
           type="index"
           label="序号"
           width="80">
         </el-table-column>
         <el-table-column
           prop="spuName"
           label="SPU名称"
           width="width">
         </el-table-column>
         <el-table-column
           prop="description"
           label="SPU描述"
           width="width">
         </el-table-column>
         <el-table-column
           label="操作"
           width="width">
           <template slot="{row,$index}">
             <HintButton icon="el-icon-plus" type="primary" size="mini" title="添加SKU"></HintButton>
             <HintButton icon="el-icon-edit" type="warning" size="mini" title="修改SPU"></HintButton>
             <HintButton icon="el-icon-info" type="info" size="mini" title="查看SPU所有的SKU"></HintButton>
             <HintButton icon="el-icon-delete" type="danger" size="mini" title="删除SPU"></HintButton>
           </template>
         </el-table-column>
       </el-table>

         <!-- @size-change="handleSizeChange"
         @current-change="handleCurrentChange" -->
         <!-- 分页器居中  -->
       <el-pagination
          style="text-align:center"
         :current-page="1"
         :page-sizes="[3, 5, 10]"
         :page-size="5"
         layout="prev, pager, next, jumper,->, sizes,total"
         :total="0">
       </el-pagination>
     </el-card>
  </div>
</template>

<script>
export default {
  name: 'Spu',
  data() {
    return {
      isShowList:true,
      category1Id:'',
      category2Id:'',
      category3Id:'',
      spuList:[],
      page:1,
      limit:3,
      total:0
    }
  },
  methods:{
    handlerCategory({categoryId,level}){
      if(level === 1){
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
        this.category1Id = categoryId
      }else if(level === 2){
        this.category3Id = ''
        this.spuList = []
        this.category2Id = categoryId
      }else{
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(){
      let {page,limit,category3Id} = this
      const result = await this.$API.spu.getList(page,limit,category3Id)
      if(result.code === 200){
        this.spuList = result.data.records
        this.total = result.data.total
      }
    }
  }
}
</script>

