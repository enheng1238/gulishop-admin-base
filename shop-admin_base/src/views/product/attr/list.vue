<template>
  <div>
    <el-card>
      <!-- 三级分类的组件 -->
      <!-- 自定义事件 在父中绑定一个事件 -->
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <!-- 静态页面是为了收集数据的 -->
    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <!-- 列表数据展示的内容 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >
        <el-table border :data="attrList" style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 
          显示到别的结构了，要用插槽 
          row是谁 
          :data="attrList"  属性列表 代表的是某一个属性 是一个对象 {[attrValueList]}
          这个对象有attrName  attrValueList:[{这个属性值列表中的某一个属性值}]

          attrValueList 把每一个值遍历出来  用到tag
        -->
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改属性"
                size="mini"
                @click="showUpdateDiv(row)"
              ></HintButton>

              <el-popconfirm :title="`你确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <!-- 添加和修改的页面 -->
        <!-- :inline="true" 行内form -->
        <el-form :inline="true" :model="attr">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attr.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          :data="attr.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <!-- :data="attr.attrValueList"  row代表的是某一个属性值 -->
            <template slot-scope="{ row, $index }">
              <!-- 根据每个属性值当中的isEdit不同显示不一样的结构 -->
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 一定有template中才能用气泡 slot="reference" 具名插槽 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="attr.attrValueList.splice($index,1)">
                <!-- <el-button slot="reference">删除</el-button> -->
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性值"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attr.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,

      // 收集的数据
      attr: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },

      /*
      {
        "attrName": "string",
        "attrValueList": [
          {
            "attrId": 0,
            "id": 0,
            "valueName": "string"
          }
        ],
        "categoryId": 0,
        "categoryLevel": 0,
        "id": 0
    }
*/
    };
  },
  methods: {
    // 删除属性逻辑
    async deleteAttr(row){
      //发请求
      const result = await this.$API.attr.delete(row.id) 
      //成功
      if(result.code === 200){
        this.$message.success('删除属性成功')
        this.getAttrList()
      }else{
        //失败
        this.$message.error('删除属性失败')
      }
      
    },

    // 最终需要保存发请求
    async save(){
      //拿参数
      let attr = this.attr
      // 整理参数
            // 1.如果属性值没有值，那就是空串，删除这个属性值对象
            // 2.去除参数中多余的参数，比如自己加的isEdit
            // 3.如果属性当中属性值列表没有属性对象  不发请求
            // filter返回的是一个新数组 filter最终返回的是一个布尔值

            // filter 是个函数
            // 功能: 过滤出数组当中符合自己条件的项
            // 参数: 回调函数 回调函数的参数是(item,index,arr)  回调函数的返回值是布尔值 (true/false)
            // 返回值: fliter本身是个函数 它的返回值是个新数组 原数组中的每一项都会调用回调函数,回调函数返回为true的项组成的新数组
            attr.attrValueList = attr.attrValueList.filter(item => {
              // 过滤每一项 如果这一项的属性值名称不为空串 顺便就把这一项的isEdit删掉,然后把这一项放在新的数组当中
              if(item.valueName !== ''){
                delete item.isEdit
                return true
              }
            })

            if(attr.attrValueList.length === 0) return
      // 发请求
      const result = await this.$API.attr.addOrUpdate(attr)
     
      if(result.code === 200){
        // 成功 
          // 1.提示
          this.$message.success('保存属性成功')
          // 2.显示列表页面
          this.isShowList = true
          // 3.重新获取属性列表数据
          this.getAttrList()
       }else{
          // 失败
          // 提示
          this.$message.error('保存属性失败')
       }
      
    },


    // input失去焦点或者回车之后变为查看模式
    toLook(row) {
      // 失去焦点的时候或者回车之后我们要判断用户输入数据的合法性
      // 1.数据必须有
      if (row.valueName.trim() === "") {
        this.$message.error("输入的数据不能为空");
        row.valueName = "";
        return;
      }
      // 2.除了是自身以外,不能有相同的 some最终返回一堆true/false  判断是不是每一个项都符合条件 只要有一个符合就为true
      let isRepeat = this.attr.attrValueList.some((item) => {
        if (item !== row) {
          //除去自身
          return item.valueName === row.valueName;
        }
      });

      if (isRepeat) {
        //  提示
        this.$message.error("输入的数据不能重复");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },

    // 点击span 变为编辑模式
    toEdit(row, index) {
      row.isEdit = true;
      // 只要第一次添加时响应式,后面就可以使用点语法  也是响应式

      // 让对应的input自动获取焦点
      // $refs是一个对象，一般情况下就是 .  一个什么东西
      // 而现在 index 是一个变量  所以要用中括号语法
      // 这样就拿到了对应的input

      this.$nextTick(() => {
        this.$refs[index].focus();
      });

      /**
       * 你一点击 input在v-if
       * 要从span变成input  , 它是根据数据的改变而渲染input的
       * 也就是说我这个input还没有渲染完成，你就开始focus了,怎么能找到呢?就是你太快了
       * nextTick()等你的页面更新完成
       *
       * 让对应的input自动获取到焦点,必须在nextTick()当中去做,原因是因为页面可能还没有更新完成
       *
       */
    },

    showUpdateDiv(row) {
      this.isShowList = false;

      // this.attr = row //踩坑

      //浅拷贝
      // 基本数据值
      // 浅拷贝如果里边是基本值的时候，浅拷贝是可以达到我们的需求的
      // 但是，如果里边一旦有正向数据类型,浅拷贝就不行了
      // this.attr = {...row} //浅拷贝 这个不能玩 玩不了 因为这次的数据牵扯到了数组,而数组是个对象数据类型，得用深拷贝
      // 浅拷贝  对于属性名来说是没问题的,修改添加页面和列表页面的属性不是同一个对象，基本值也不是同一个值，但是对于属性值来说
      // 属性值是在一个数组当中的,浅拷贝的时候，不同对象拷贝内部数组还是同一个数组,也就是说两个对象内部属性值的数组是同一个地址
      // 在添加页面修改数组其实也是在修改列表页面的数组,因此浅拷贝不行，得换成深拷贝

      // 在element-ui展示数据的时候,我添加的时候把原来的数据传给我添加的数据，我添加里边一修改,列表里边页修改了，此时是需要用到深浅拷贝的，
      // 何时用到浅拷贝？对象里边如果都是基本值,拿我浅拷贝就可以搞定，如果说对象当中有对象数据类型,那我就需要深拷贝了

      // lodash 里边除了节流还有深浅拷贝的函数

      this.attr = cloneDeep(row); //深拷贝一份然后赋值给attr

      // 对修改属性的属性值对象添加isEdit,标识数据
      this.attr.attrValueList.forEach((item) => {
        //  item.isEdit = false//这样写的添加的属性不是响应式属性  后期通过.语法添加的不是响应式属性
        // 如果一上来在属性就是在data中的,那么它一定是响应式属性
        // $set 和
        // 如果想让它成为响应式 用$set
        this.$set(item, "isEdit", false);
      });
    },

    // 点击列表页的添加属性逻辑
    showAddDiv() {
      this.isShowList = false;

      // 解决添加属性值取消后数据还在的bug
      this.attr = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        // 这里的this就是vm了  收集categoryId不能在data中去写 因为data中的this不是vm
        categoryLevel: 3,
      };
    },

    // addAttrValue 点击添加属性值的回调
    // 属性值的对象  收集属性值的时候 我们的做法是先在属性值列表当中添加一个属性的对象， 然后上面table就会出现一行数据，只不过都是空的
    addAttrValue() {
      // 为什么push的时候就是响应式的了呢？
      // 只要用了push 就是响应式的了
      /**
       * 变化数组的方法
       * Vue将观察数组的变化数组方法包裹起来,以便在调用这些方法时，也能够触发视图更新,这些包裹的方法如下:
       *
       * push()
       * pop()
       * shift()
       * unshift()
       * sort()
       * reverse()
       *
       */
      this.attr.attrValueList.push({
        attrId: this.attr.id || undefined, //属性值所属属性的id
        //  id: 0,//新添加的没有id
        valueName: "", //属性值已经添加到属性值列表当中了，但是这个属性值的名称是空串是为了等待用户去输入输入
        isEdit: true, //每一个新添加的属性值对象当中都会添加这么一个属性，代表目前这个属性值是可编辑状态(显示input)
      });

      // 让对应的input自动获取焦点,其实就是新添加的那一个属性值对应的input 永远在列表的最后
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length - 1].focus();
      });
    },
    // 自定义事件 回调函数留在父中
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        // 清
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        // 清
        this.category3Id = "";
        // this.attrList = []

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 拿到了3级id  发请求
        this.getAttrList(); //发请求获取属性的数据展示
      }
    },

    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

