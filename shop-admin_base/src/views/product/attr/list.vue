<template>
  <div>
    <el-card>
      <!-- 三级分类的组件 -->
      <!-- 自定义事件 在父中绑定一个事件 -->
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 列表数据展示的内容 -->
      列表数据数据
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[]
    }
  },
  methods:{
    // 自定义事件 回调函数留在父中
    handlerCategory({categoryId,level}){
      if(level === 1){
        // 清
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []

        this.category1Id = categoryId
      }else if(level === 2){
        // 清
        this.category3Id = ''
        this.attrList = []

        this.category2Id = categoryId
      }else{
        this.category3Id = categoryId
        // 拿到了3级id  发请求
        this.getAttrList()  //发请求获取属性的数据展示
      }
    },

    async getAttrList(){
      let {category1Id,category2Id,category3Id} = this
      const result = await this.$API.attr.getList(category1Id,category2Id,category3Id)
      if(result.code === 200){
        this.attrList = result.data

      }
    }
  
  
  }
}
</script>

