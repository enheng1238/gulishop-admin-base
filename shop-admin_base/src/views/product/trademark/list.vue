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
     -->
    <el-table :data="trademarkList" style="width:100%;margin:20px 0;" border stripe>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt style="width:100px;height:60px;">
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="width"></el-table-column>
    </el-table>

    <!-- 3.分页器 -->
    <!-- 3.1先写静态页面先把动态数据干掉 -->
    <!--   @size-change="handleSizeChange"
      @current-change="getTrademarkList" -->

    <el-pagination
    
      style="text-align:center"
      :current-page="1"
      :page-sizes="[10, 20, 50]"
      :page-size="10"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="100"
    ></el-pagination>
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
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page
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
  },
};
</script>

<style scoped>
</style>
