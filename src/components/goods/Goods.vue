<template>
  <div>
  <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!--卡片区域-->
  <el-card>
    <!--输入添加区域-->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" type="text" v-model="queryInfo.query" clearable @clear="getgGoodsList">
           <el-button slot="append" icon="el-icon-search"  @click="getgGoodsList"></el-button>
         </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="btn" @click="goAddpage">添加商品</el-button>
      </el-col>
    </el-row>


      <!--表格区域-->
        <el-table
              :data="goodslist"
              style="width: 100%"
              striped
              border>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
              <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
              <el-table-column prop="goods_weight" label="商品重量(ml)" width="120px"></el-table-column>
              <el-table-column prop="add_time"  label="创建时间" width="200px">
                <template slot-scope="scope">
                  {{scope.row.add_time | dateFormat}}
                </template>
              </el-table-column>
              <el-table-column  label="操作" width="300px" >
               <template slot-scope="scope" >
                 <el-button type="primary" icon="el-icon-edit"  size="mini" @click="getOneGoodList(scope.row.goods_id)" >编辑</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsList(scope.row.goods_id)">删除</el-button>
               </template>
              </el-table-column>
          </el-table>

          <!--分页区域-->
          <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>

              <!--修改商品的对话框-->
      <el-dialog title="修改商品信息" :visible.sync="editGoodsDialogVisible" width="50%">
        <el-form
          ref="editGoodsFormRef"
          :model="editGoodsForm"
          :rules="editGoodsFormRules"
          label-width="80px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_weight">
            <el-input v-model="editGoodsForm.goods_weight" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品重量" prop="goods_price" >
            <el-input v-model="editGoodsForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number" >
            <el-input v-model="editGoodsForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goods_introduce" >
            <el-input v-model="editGoodsForm.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="add_time">
            <el-input v-model="add_time"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEditGoods">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>


 </div>
</template>

<script>
  export default{
    data(){
      return{
        //获取商品列表的参数对象
        queryInfo:{
          //查询参数
          query:"",
          //当前页码
          pagenum:1,
          //每页显示的个数
          pagesize:10
        },
        //用于获取商品列表的数据
        goodslist:[],
        total:1,
        editGoodsForm: {
        goods_id:"",
        goods_name: "",
        goods_weight: "",
        goods_price: "",
        add_time: "",
        goods_introduce:""
        },
        editGoodsDialogVisible:false,
        editGoodsFormRules:{
          goods_name:[
              {required: true,message: '请输入商品名称',trigger: 'blur'},
              {min: 1,max: 60,message: '长度在 1 到 60 个字符',trigger: 'blur'},
              ]
        }
      }
    },
    created(){
      this.getgGoodsList()
    },
    methods:{
      //获取商品列表
     async getgGoodsList(){
        const {data:res}=await this.$http.get("goods",{
          params:this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品列表失败！")
        }
        //console.log(res.data.goods)
        this.goodslist=res.data.goods
        this.total=res.data.total
        this.$message.success("获取商品列表成功")
        //console.log(this.total)
      },
      //监听当前页的变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getgGoodsList()
      },
      //监听每页显示的页数的变化
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getgGoodsList()
      },
      //显示商品信息的对话框
    async getOneGoodList(id) {
      const { data: res } = await this.$http.get(`goods/${id}`);
      this.editGoodsForm = res.data;
      console.log(res);
      this.editGoodsDialogVisible = true;
    },
    //保存修改的商品信息
    async saveEditGoods(){
     const { data: res } = await this.$http.put(`goods/${this.editGoodsForm.goods_id}`,this.editGoodsForm) 
      if(res.meta.status!==200){ return this.$message.error("修改商品失败")}
      this.getgGoodsList()
      this.$message.success("修改商品成功！")
      this.editGoodsDialogVisible=false
     },
      //监听删除按钮，删当前数据
     async removeGoodsList(id){
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
         if(confirmResult !== "confirm") {return this.$message.info("已取消删除")}
         const {data:res}=await this.$http.delete("goods/"+id)
         //console.log(res)
         if(res.meta.status!==200){ return this.$message.error("删除商品失败")}

         this.getgGoodsList()
         this.$message.success("删除商品成功！")
      },
      //点击添加商品按钮，跳转
      goAddpage(){
        this.$router.push("/Add")
      }


     },
     computed: {
    add_time() {
        let date = new Date(this.editGoodsForm.add_time);
        let y = date.getFullYear();
        let m = (date.getMonth() + 1 + "").padStart("2", "0");
        let d = (date.getDate() + "").padStart("2", "0");
        let hh = (date.getHours() + "").padStart("2", "0");
        let mm = (date.getMinutes() + "").padStart("2", "0");
        let ss = (date.getSeconds() + "").padStart("2", "0");
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
  }
  }
</script>

<style lang="less" scope>
  .btn{
    margin-left: 20px;
  }
  .el-table{
    margin-top: 15px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>
