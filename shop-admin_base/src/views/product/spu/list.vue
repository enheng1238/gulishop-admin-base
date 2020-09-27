<template>
  <div>
    <el-card>
      <CategorySelector
        @handlerCategory="handlerCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                icon="el-icon-plus"
                type="primary"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-edit"
                type="warning"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-info"
                type="info"
                size="mini"
                title="查看SPU所有的SKU"
              ></HintButton>
              <HintButton
                icon="el-icon-delete"
                type="danger"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器居中  -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 写成两个组件  -->
      <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm" ref="spu"></SpuForm>
      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->
      <!-- 

       -->
  
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>

  
</template>

<script>
import SkuForm from '@/views/product/components/SkuForm' 
import SpuForm from '@/views/product/components/SpuForm'
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 这个数据就是用来控制三级分类可操作性的
      isShowList: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,

      isShowSpuForm:false,
      isShowSkuForm:false
    };
  },
  methods: {
    // 点击修改spu按钮逻辑
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
      // 初始化页面数据请求获取 父  数据是在子组件中的
       this.$refs.spu.initUpdateSpuFormData(row)
      //在父组件中拿到子组件操作它里边的数据 还可以调用它里边的函数
      // 在父中调子里的函数 然后在子里边的函数中发请求

      /**
       * 如果是在这list.vue(父)发请求 数据全都保存在父组件 到时候子(SpuForm)组件要显示 需要一个一个传
       * 有没有方法让它在子(SpuForm)组件发请求？
       * 
       * 点按钮之后才发请求而不是一上来就发请求
       * SpuForm不是路由组件 也就是说当我页面一打开的时候 这个子组件就创建了 
       * 如果是在mounted中发请求的话 页面就算不点击也应该就发请求了
       * 
       * 所以  怎么让子组件发请求?
       * 父
       * <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm" ref="spu"></SpuForm>
       * ref="spu"
       * 
       * this.$refs.spu.initAddsSpuFormData()
       * 在父组件中拿到子组件操作它里边的数据 还可以调用它里边的函数
       * 在父中调子里的函数 然后在子里边的函数中发请求
       * 
       * this.$refs.spu --- 直接拿到子组件对象 想拿它的数据拿它的数据 想玩它的方法玩它的方法 任何东西都可以
       * 
       * 子
       *   initAddSpuFormData(){
       *       //   通过点击父组件当中的添加spu按钮,父组件当中会调用这个函数
       *   },
       *  
       */
     
    },
    
    // 点击添加spu按钮逻辑
    showAddSpuForm(){
      this.isShowSpuForm = true

      // 初始化页面数据请求获取
      this.$refs.spu.initAddSpuFormData()
    },
   
   // 点击添加sku按钮逻辑
    showAddSkuForm(row){
      this.isShowSkuForm = true
    },
  
 
   handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.spuList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pagee = 1) {
      this.page = pagee;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList(this.page);
    },
  },
};
</script>

