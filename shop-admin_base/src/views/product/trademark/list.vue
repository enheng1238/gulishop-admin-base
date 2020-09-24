<template>
  <div>
    <!-- 1.添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- 2.表格  element-ui table 看列(序号列) -->
    <!-- 2.1写静态页面 先把动态数据全部干掉 -->
    <!-- 
      table 不需要写v-for 它自带循环
      你把数据给它，它会每一列每一列进行for循环 ,按列走
      每一列每一列循环的时候会去拿相应的字段去循显示,
      然后你把那个字段去显示

      列的内部在v-for 在展示数据
      而外部在写
      作用域插槽 :内部用来展示数据,但是展示数据它的结构由外部决定
      看到table 数据显示和结构不一定 用插槽

      不能变：
      row 代表某一个trademarkList对象
      $index 
      用到作用域插槽 prop可以不写

      table是用来展示数据的  且是用来展示列表数据的 给一个数组 这个数组要在table中的data属性中去写 
      这个data属性用来接收传过来的数组的,当你把你的数组给了这个data之后,就不需要操心人家是怎么去遍历、循环的,
      因为列表身上已经有循环了,这个循环在每一个列身上,data给每一个列都传了一份 ,
      每一个列拿到data数据之后会对每一个数据进行遍历，内部进行遍历

    -->
    <el-table
      :data="trademarkList"
      style="width: 100%; margin: 20px 0"
      border
      stripe
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt style="width: 100px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <!-- deleteTrademark(row) 删除哪一个要告诉我 所以要传row -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 3.分页器 -->
    <!-- 3.1先写静态页面先把动态数据干掉 -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="100"
    ></el-pagination>

    <!-- 
      table用来展示数据 form用来收集数据  .sync 父子组件同步 解决右侧叉号
    
      table  data 要求传一个数组
      form {} 收集数据
      v-model  收集数据
       
    -->
    <!-- 增加和修改的dialog -->
    <el-dialog
      :title="form.id ? '修改品牌' : '添加品牌'"
      :visible.sync="isShowDialog"
    >
      <el-form :model="form" :rules="rules" style="width: 80%" ref="form">
        <el-form-item label="品牌名称" :label-width="'100px'" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'" prop="logoUrl">
          <!-- action 上传图片的时候的上传接口 -->
          <!-- 
            POST /admin/product/fileUpload 
            /dev-api
             target: 'http://182.92.128.115', 目标服务器地址 说的就是协议ip端口

            一旦代理发现你的路径是以 /dev-api 开头的,在本机发请求默认先往本机发
            /admin/product/fileUpload 报错
            http://localhost:9528/admin/product/fileUpload 404  默认发的

            http://localhost:9528 /dev-api/admin/product/fileUpload 代理

            代理看的是路径 如果是以/dev-api开头,会把target替换
            经历代理  路径就变成
            http://182.92.128.115/dev-api/admin/product/fileUpload 真实服务器
            
            changeOrigin 支不支持跨域 而且是协议ip端口任意一个不同就跨域
            pathRewrite 重写 
            http://182.92.128.115/admin/product/fileUpload 真实路径 最后所需要发的路径

            show-file-list 针对照片墙 是否上传多张的数组 可以一次性上传多张图片

            1.上传前对图片限制
            2.上传成功后要赶紧收集返回的图片真实路径
            3.上传成功后,upload当中img的显示
          -->

          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />

            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    // 定义一个函数
    // value 就是你输入的值 你准备要验证的那个值
    // callback 通过还是不通过 放行还是不放行
    // callback 如果不传任何东西 就是放行
    // 验证通过不通过都是通过callback来决定的
    // 如果传进去一个错误信息 那就代表不通过
    // 如果里边什么都没写 那就代表通过

    // validateTmName 这个函数也可以定义在methods里边
    // var validateTmName = (rule, value, callback) => {
    //  if(value.length < 2 || value.length > 10 ){
    //    callback(new Error('输入的名字必须是2-10个字符'))
    //  }else if(value.trim() === ''){
    //    callback(new Error('请输入合法的名称不能为空'))
    //  }else{
    //   //  验证通过 直接放行
    //    callback()
    //  }
    // };

    return {
      page: 1,
      limit: 3,
      // trademarkInfo:{},
      trademarkList: [],
      total: 0,
      isShowDialog: false,
      //  imageUrl: '',
      form: {
        tmName: "",
        logoUrl: "",
      },

      rules: {
        tmName: [
          // trigger 验证规则的触发实际 1. blur:鼠标失去焦点  2.change:内容发生改变 3.最后点击确定时 整体进行验证
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },

          //自定义验证规则
          // validateTmName 函数 --- 自己定义函数的功能
          // { validator: validateTmName, trigger: "change" },
           { validator: this.validateTmName, trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请上传图片", trigger: "change" },
          // 这块 无论写change还是blur 都显示不出图片 最后点击确定进行整体验证的时候才能看到图片
          // trigger: 'change' 对upload来说看不到这个效果,必须是整体验证的时候才能有验证的错误提示
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 放在methods里边也可以 
    validateTmName :(rule, value, callback) => {
     if(value.length < 2 || value.length > 10 ){
       callback(new Error('输入的名字必须是2-10个字符'))
     }else if(value.trim() === ''){
       callback(new Error('请输入合法的名称不能为空'))
     }else{
      //  验证通过 直接放行
       callback()
     }
    },

    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        // this.trademarkInfo = result.data
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 点击添加按钮
    showAddDialog() {
      this.isShowDialog = true;
      // 最后添加这个解决完成后数据依然存在在form当中的bug
      this.form = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 点击修改按钮
    showUpdateDialog(row) {
      /**
       * row是trademarkList 里面的一个对象,用来展示在页面上的
       * 我们把row的地址给力form一份  row和form就指向同一个对象,以后修改form就是在修改row,row改了，页面就会改
       *
       *
       * 深浅拷贝 :
       *  拷贝 --- 有另外一个内存出来 有另外一个地址出来
       * 看对象内部的数据 如果对象内部的数据类型是基本数据类型 就没必要深拷贝
       * 如果对象内部有个数组 那对象内部存这个数组的时候一定不是存的这个数组本身 而是数组的地址
       * 只要数据还是同一个 那就不叫深拷贝
       * 浅拷贝拷贝的是值 不管是什么值 地址值也是值
       * 深拷贝拷贝的是内存
       * 只要有关拷贝，一定新出来个内存
       *
       */

      this.isShowDialog = true;
      // this.form = row//row里边会多一个id  因为数据是从数据库拿过来的
      this.form = { ...row };
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // 上传成功的回调
    /**
     * res 返回的响应
     * 上传成功后,会返回上传成功的图片的真实的路径
     * 我们需要做的很简单 就是把这个图片的路径赶紧收集起来
     * console.log(res,file,URL.createObjectURL(file,raw))
     *
     * this.form.logoURL = res.data
     *
     * this.imageUrl = URL.createObjectURL(file.raw)  拿的是图片的本地路径,假的路径
     */
    handleAvatarSuccess(res, file) {
      // console.log(res,file,URL.createObjectURL(file.raw))
      this.form.logoUrl = res.data;
    },
    // 上传之前的回调
    beforeAvatarUpload(file) {
      const typeArr = ["image/jpeg", "image/png"];
      const isJPGOrPNG = typeArr.some((item) => item === file.type);
      const isLt500K = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传头像图片大小不能超过 500K!");
      }
      return isJPGOrPNG && isLt500K;
    },
    // 点击确定按钮添加或者修改trademark的请求逻辑
    addOrUpdateTrademark() {
      // 验证规则

      // this.$refs[formName] formName---指的是form的名字 form身上有form这个方法
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 获取参数
          let trademark = this.form;
          // 整理参数

          // 发请求
          const result = await this.$API.trademark.addOrUpdate(trademark);

          if (result.code === 200) {
            // 成功干啥
            // 1.提示 添加或者修改成功
            this.$message.success(`${trademark.id ? "修改" : "添加"}品牌成功`);
            // 2.关闭dialog
            this.isShowDialog = false;
            // 3.重新获取列表数据展示
            // 如果是添加 我们默认是添加在最后一页 重新获取数据也是默认拿的是第一页
            // 但是修改  重新获取数据也应该是获取修改的那一页
            this.getTrademarkList(trademark.id ? this.page : 1);
          } else {
            // 失败干啥
            // 提示添加或者修改失败
            this.$message.error(`${trademark.id ? "修改" : "添加"}品牌失败`);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 点击删除按钮  messagebox
    deleteTrademark(row) {
      // messagebox
      this.$confirm(`你确定删除${row.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.delete(row.id);
          if (result.code === 200) {
            //  1.提示
            this.$message.success("删除品牌成功");
            // 2.重新发请求 重新获取列表数据
            // 重新获取数据需要判断当前也数据是不是一个 如果不是那就获取当前也,如果是那就获取前一页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } else {
            this.$message.success("删除品牌失败");
          }
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
