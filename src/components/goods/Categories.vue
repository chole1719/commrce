<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-button type="primary" @click="showCataDialog">添加分类</el-button>

   <!--表格区域-->
          <tree-table
            class="treetable"
            :data="cataList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            :show-row-hover="false">
            <!--是否有效-->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
              <i class="el-icon-error"   v-else style="color: lightgreen;"></i>
            </template>
            <!--排序-->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <!--操作-->
            <template slot="opt" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCataDialog(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCataDialog(scope.row.cat_id)">删除</el-button>
            </template>

          </tree-table>
      <!--分页区域-->

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
    </el-card>

    <!--添加分类的对话框-->
     <el-dialog
       title="添加分类"
       :visible.sync="addCataDialogVisible"
       width="50%"
       @close="addCataDiaglogClosed">
       <el-form ref="addCataFormRef" :rules="addCataFormRules" :model="cataForm" label-width="80px">
         <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="cataForm.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类">
           <!-- options用来指定数据源
                props指定级联选择器的配置对象
            -->
            <el-cascader
               expand-trigger="hover"
               :options="parentCataList"
               :props="cascaderProps"
               v-model="selectedkeys"
               @change="ParentCataChanged"
               clearable
               change-on-select>
             </el-cascader>
         </el-form-item>
         </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addCataDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addCata" >确 定</el-button>
       </span>
     </el-dialog>



     <!--修改分类的对话框-->
      <el-dialog
        title="修改分类"
        :visible.sync="editCataDialogVisible"
        width="50%">
        <el-form ref="editCataFormRef" :rules="editCataFormRules" :model="editCataForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCataForm.cat_name"></el-input>
          </el-form-item>

          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEditCata">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  export default{
data (){
    return{
      //商品分类的数据列表，赋值给cataList
       cataList:[],
       //总数据条数
       total:0,
       queryInfo:{
       type:3,
        //当前页
       pagenum: 1,
       //每页显示的个数
       pagesize: 5
       },
       //显示的列的属性
       columns:[{
         label:"分类名称",
         prop: "cat_name"
       },
       {
         label:"是否有效",
         //表示将当前列定义为模版列
         type:"template",
         //表示当前这一列试用模版名称
         template:"isok"
       },
       {
         label:"排序",
         //表示将当前列定义为模版列
         type:"template",
         //表示当前这一列试用模版名称
         template:"order"
       },
       {
         label:"操作",
         //表示将当前列定义为模版列
         type:"template",
         //表示当前这一列试用模版名称
         template:"opt"
       }],
       addCataDialogVisible:false,
       cataForm:{
         cat_name:"aaaa",
         cat_pid:0,
         cat_level:0
       },
       addCataFormRules:{
         cat_name: [
           {required: true,message: '请输入分类名称',trigger: 'blur'},
           {min: 1,max: 10,message: '长度在 1 到 10 个字符',trigger: 'blur'}]
       },
       parentCataList:[],
       //指定级联选择器的配置对象
       cascaderProps:{
         value:"cat_id",
         label:"cat_name",
         children:"children"
       },
       //选中的父级分类的id数组
       selectedkeys:[

       ],
       editCataDialogVisible:false,
       
       editCataForm:{
         cat_name:"",
         cat_id:""
       },
       editCataFormRules:{
         cat_name: [
           {required: true,message: '请输入分类名称',trigger: 'blur'},
           {min: 1,max: 10,message: '长度在 1 到 10 个字符',trigger: 'blur'}]
       }
    }
   },
created(){
     this.getCataList()
   },
methods:{
     //获取当前的商品分类列表
     async  getCataList(){
       const {data:res}=await this.$http.get("categories",{
         params: this.queryInfo
       })
       //console.log(res)
       //数据列表，赋值给cataList
       this.cataList=res.data.result
       //为总数据条数赋值
       this.total=res.data.total
     },
     //监听当前页的变化
     handleSizeChange(newSize){
       this.queryInfo.pagesize=newSize
       this.getCataList()
     },
     //监听当前显示页数的变化
     handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getCataList()
     },
     //展示添加分类的对话框
     async showCataDialog(){
       this.addCataDialogVisible = true
       this.getParentCataList()
     },
     //获取父级分类的数据列表
     async getParentCataList(){
       const {data:res}=await this.$http.get("categories",{
         params:{type:2}
       })
       //console.log(res)
       this.parentCataList=res.data
     },

     //选择项变化出发这个函数
     ParentCataChanged(){
      //如果selesctedkeys中的数组length>0,证明选中父级分类，反之没有选中任何父级分类
      if(this.selectedkeys.length>0){
        //为当前的父类id赋值
        this.cataForm.cat_pid=this.selectedkeys[this.selectedkeys.length-1]
        //为当前分类的层级赋值
        this.cataForm.cat_level=this.selectedkeys.length
        return
      } else{
        this.cataForm.cat_pid=0

        this.cataForm.cat_level=0
      }
     },
     //点击按钮，保存添加的分类
      addCata(){
       this.$refs.addCataFormRef.validate(async valid=>{
         if(!valid) return
         const {data:res}=await this.$http.post("categories",this.cataForm)
         if(res.meta.status!==201){return this.$message.error("添加分类失败")}
         this.$message.success("添加分类成功！")
         this.getCataList()
         this.addCataDialogVisible =false
       })


     },
     //关闭对话框重置表单
     addCataDiaglogClosed(){
       this.$refs.addCataFormRef.resetFields()
       this.selectedkeys=0
       this.cataForm.cat_pid=0
       this.cataForm.cat_level=0
     },
     //展示分类名称的编辑对话框
    async showEditCataDialog(cataInfo){
      this.editCataForm.cat_name=cataInfo.cat_name
      this.editCataForm.cat_id=cataInfo.cat_id
      //console.log(this.editCataForm.cat_name)
      this.editCataDialogVisible=true
     },
     //保存修改的分类名称
    async saveEditCata(){
      this.$refs.editCataFormRef.validate(async valid => {
        if (!valid) return
      const {data:res}=await this.$http.put("categories/"+this.editCataForm.cat_id,{
       cat_name:this.editCataForm.cat_name
      })
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户数据失败")
      }

      this.$message.success("更新用户数据成功")
      this.editCataDialogVisible=false
      this.getCataList()
      })
     },
     //监听删除按钮的事件
    async delCataDialog(id){
       const confirmResult = await this.$confirm(
         '此操作将永久删除该用户, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }
       ).catch(err => err)
       if (confirmResult !== "confirm") {
           return this.$message.info("已取消删除")
         }
         const {data: res } = await this.$http.delete("categories/" + id)
         console.log(res)
         if (res.meta.status !== 200) {
           return this.$message.error("删除失败")
         }
         this.$message.success("删除用户成功")
         this.getCataList()
       }
     }
   }

</script>

<style lang="less" scope>
  .treetable{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
