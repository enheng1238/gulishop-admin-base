<template>
  <el-form >
      <!-- :inline="true" 说的是项和项在同一行 -->
    <el-form-item label="SPU名称" label-width="100px">
      <el-input placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌" label-width="100px">
      <el-select placeholder="请选择品牌" value="">
        <el-option value=""></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" label-width="100px">
      <el-input placeholder="SPU描述" type="textarea" rows="4"></el-input>
    </el-form-item>


        <!-- :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove" -->
    <el-form-item label="SPU图片" label-width="100px">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- :visible.sync="dialogVisible" -->
      <!-- :src="dialogImageUrl" -->
      <!-- dialog 是点击+时放大 -->
      <el-dialog >
        <img width="100%"  alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性" label-width="100px">
        <el-select  placeholder="还有3没选择" value="">
            <el-option value=""></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
            border
            style="width: 100%;margin-top:20px">
            <el-table-column
                align="center"
                type="index"
                label="序号"
                width="80">
            </el-table-column>

            <el-table-column
                prop="prop"
                label="属性名"
                width="150">
            </el-table-column>

            <el-table-column
                prop="prop"
                label="属性值名称列表"
                width="width">
            </el-table-column>

            <el-table-column
                label="操作"
                width="150">
            </el-table-column>
        </el-table>
    </el-form-item>

    <!-- 想要对齐  就又用了一个item -->
    <el-form-item label-width="100px">
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible',false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props:['visible'],
  data() {
      return {
          dialogImageUrl:"",
          dialogVisble:false,
          // data:{}
          spuInfo:{},
          spuImageList:[],
          trademarkList:[],
      }
  },
  methods: {
      async initAddSpuFormData(){
        //   通过点击父组件当中的添加spu按钮,父组件当中会调用这个函数
         // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
        const trademarkListResult = await this.$API.trademark.getList()//获取所有的品牌列表
        if(trademarkListResult.code === 200){
          this.trademarkList = trademarkListResult.data
        }

        // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
        const baseSaleAttrListResult = await this.$API.spu.getSaleList() 
        if(baseSaleAttrListResult.code === 200){
          this.baseSaleAttrList = baseSaleAttrListResult.data
        }



      },

      async initUpdateSpuFormData(row){
        // http://localhost:9529/dev-api/admin/product/getSpuById/1507
        // 获取指定id的SPU信息（获取某一个spu详情）get(id)
        const result = await this.$API.spu.get(row.id) //获取当前修改的这个spu的详情
        if(result.code === 200){
          this.spuInfo = result.data
        }

        // http://localhost:9529/dev-api/admin/product/spuImageList/1507
        // 获取指定SPU的id对应的图片列表getSpuImageList (skuId)
        const imageListResult = await this.$API.sku.getSpuImageList(row.id)//获取当前SPU的图片列表
        if(imageListResult.code === 200){
          this.spuImageList = imageListResult.data
        }

        // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
        const trademarkListResult = await this.$API.trademark.getList()//获取所有的品牌列表
        if(trademarkListResult.code === 200){
          this.trademarkList = trademarkListResult.data
        }

        // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
        const baseSaleAttrListResult = await this.$API.spu.getSaleList() 
        if(baseSaleAttrListResult.code === 200){
          this.baseSaleAttrList = baseSaleAttrListResult.data
        }
      },

      handleRemove(file,fileList){
          console.log(file,fileList)
      },
      handlePictureCardPreview(){
          this.dialogImageUrl = file.dialogImageUrl
          this.dialogVisble = true
      }
  },
};

/**
 * 如何点取消回去？？？？ 回到列表页
 * 让当前的SpuForm从true变成false
 * 
 * SpuForm是在子组件  而isShowSpuForm是在父组件当中的
 * 我们要修改的isShowSpuForm是在父组件当中的
 * 
 * 用组件间通信
 * 
 * 子组件要改父组件当中的东西 需要子组件通知父组件把东西给改了
 * 子  ---- > 父
 * 自定义事件 
 * props
 * 全局事件总线
 * PubSub
 * vuex
 * $parent  想要改父组件中的东西 子改父
 * ($parent和$children尽量别用)
 * .sync 父子同步
 * 
 * ref是父改子的东西
 * 
 * 
 * 模拟dialog 品牌管理 dialog 点击修改或者点击添加有一个dialog  
 * 点击×号其实是在子组件里边操作父组件的数据 一点就会关闭？？？
 * 
 * 点击添加弹出dialog 点击外部也可以关闭？？？
 * 
 * 因为在dialog子组件内部做了.sync的逻辑,用了父子同步
 * 点击外部或者点击那个×号，他其实是把子组件内部传递的那个值改成了false
 * 
 * 父组件
 * <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm"></SpuForm>
 * 
 * 原理:
 * <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm>
 * 父组件中写 :visible="isShowSpuForm"  相当于在传递一个属性 传递到子组件内部
 * 
 * 子组件里边一定接收了这个visible  
 * props:['visible']
 * 也就是说子组件内部一定是拿到这个值了，至于拿到这个值有用没用不清楚
 * 
 *  @update:visible="isShowSpuForm = $event"  这个事件是等待子组件触发这个事件，在点击取消按钮的时候触发
 * 
 * <el-button @click="$emit('update:visible',false)">取消</el-button> 当你一旦点击取消 就可以触发update:visible这个事件 
 * 这个事件要传过去一个值false,
 * 这个false就传到父组件中的
 * <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm>
 * @update:visible="isShowSpuForm = $event" 
 * 把false传给$event 然后赋值给isShowSpuForm,
 * isShowSpuForm就被改成了false
 * 
 * :visible="isShowSpuForm" 父传给子代表props:['visible']中的visible也就变成了false
 * 所以说它在父子数据同步
 * 
 * .sync做的事情？
 * :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"
 * 1.把isShowSpuForm传给子组件 
 * 2.给子组件绑定事件@update:visible="isShowSpuForm = $event"
 * 子组件当中一旦触发了这个事件,也就是点击了取消按钮,
 * 它会触发@update:visible="isShowSpuForm = $event"这个事件
 * 在这个事件里边它会把isShowSpuForm的值改成传过来的值
 * 父组件中的isShowSpuForm的值一改 父组件的:visible="isShowSpuForm"又会传给它一个新的值，达到父子同步
 * 
 * 父子同步 首先数据是在父里边
 * 父子如何同步？
 * 首先父得把数据传过去,它传的这一下子就叫父子同步
 * 怎么能达到父子同步呢?
 * 绑定了一个事件@update:visible="isShowSpuForm = $event"
 * 
 * 子一改 父就变
 * 父变了 重新再传过去
 * 
 * 子里边数据哪来的？ 父给它传的
 * 
 * 1.子得通知父把它(子)的数据改成false
 * 2.子通知父改父的数据
 * 父把它的数据改了之后
 * 3.父重新给子传修改后的数据
 * 
 * 
 * 
 * 
 * 
 */

</script>

