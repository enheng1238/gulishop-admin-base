<template>
  <div>
    <!-- 1.添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

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
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
    <el-dialog title="添加品牌" :visible.sync="isShowDialog">
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
             <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
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
    return {
      page: 1,
      limit: 3,
      // trademarkInfo:{},
      trademarkList: [],
      total: 0,
      isShowDialog: true,
       imageUrl: '',
      form: {
        tmName: "",
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
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
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
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
    border-color: #409EFF;
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
