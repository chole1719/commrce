<template>
  <div>
<!--面包屑导航区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>
<!--卡片区域-->
  <el-card>
<!--警告区域-->
    <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
<!--商品分类区域-->
   <el-row class="cat_opt">
    <el-col>
      <span>请选择商品分类:</span>
         <el-cascader
            expand-trigger="hover"
            :options="allCataList"
            :props="allCascaderProps"
            v-model="selectedkeys"
            @change="handleChange">
          </el-cascader>
        </el-col>
    </el-row>

    <!--Tab区域-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!--添加动态参数的面板-->
    <el-tab-pane label="动态参数" name="many">
      <!--添加参数的按钮-->
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParams">添加参数</el-button>
      <!--动态参数的表格-->
      <el-table
            :data="manyTableData"
            style="width: 100%"
            border
            striped>
            <!--展开行-->
            <el-table-column type="expand" >
              <template slot-scope="scope">
                 <!--循环渲染tag标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input
                  class="input-new-tag"
                  ref="saveTagInput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                <pre>{{scope.row}}</pre>
                 </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showeditParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeeditParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
     </el-table>
    </el-tab-pane>
    <!--添加静态参数的面板-->
    <el-tab-pane label="静态参数" name="only">
       <!--添加属性的按钮-->
       <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParams">添加属性</el-button>
       <el-table
              :data="onlyTableData"
              style="width: 100%"
              border
              striped>
              <!--展开行-->
              <el-table-column type="expand" >
                <template slot-scope="scope">
                   <!--循环渲染tag标签-->
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                  <!--输入的文本框-->
                  <el-input
                    class="input-new-tag"
                    ref="saveTagInput"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  <pre>{{scope.row}}</pre>
                   </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="参数名"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showeditParams(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeeditParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
       </el-table>
    </el-tab-pane>
</el-tabs>
    </el-card>


    <!--添加参数的对话框-->
     <el-dialog
       :title="'添加'+titleText"
       :visible.sync="addParamsDialogVisible"
       width="50%"
       @closed="addParamsDialogClosed">
       <el-form ref="addParamsFormRef" :rules="addParamsFormRules" :model="addParamsForm" label-width="80px">
         <el-form-item :label="titleText" prop="attr_name">
           <el-input v-model="addParamsForm.attr_name"></el-input>
         </el-form-item>
         </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addParamsDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addParams">确 定</el-button>
       </span>
     </el-dialog>

     <!--编辑参数的对话框-->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editParamsDialogVisible"
        width="50%">
        <el-form ref="editParamsFormRef"  :rules="editParamsFormRules" :model="editParamsForm" label-width="80px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEditParams" >确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default{
    data (){
      return{
       //指定级联选择器的配置对象
       allCascaderProps:{
         value: 'cat_id',
         label: 'cat_name',
         children:'children'
       },
       //分类数据来源
       allCataList:[],
       //级联选择框双向绑定到的数组
       selectedkeys:[],
       //被激活的页签的名称
       activeName:"many",
       //静态参数的数据
       onlyTableData:[

       ],
       //动态参数的数据
       manyTableData:[

       ],
       addParamsDialogVisible:false,
       addParamsForm:{
          attr_name:""
       },
       addParamsFormRules:{
         attr_name: [
             {required: true,message: '请输入分类名称',trigger: 'blur'},
             {min: 3,max: 10,message: '长度在 3 到 10 个字符',trigger: 'blur'},
             ]
         },
        editParamsDialogVisible:false,
        editParamsForm:{
          attr_name:"",
          attr_id:""
        },
        editParamsFormRules:{
          attr_name: [
              {required: true,message: '请输入分类名称',trigger: 'blur'},
              {min: 3,max: 10,message: '长度在 3 到 10 个字符',trigger: 'blur'},
              ]
        },
        inputVisible: false,
        inputValue: ''

      }
    },
   created(){
     this.getAllCataList()
   } ,
   methods:{
     async getAllCataList(){
       const {data:res}=await this.$http.get("categories")
       if(res.meta.status!==200){return this.$message.error("获取商品分类失败")}
       this.allCataList=res.data
       //console.log(this.allCataList)
     },
     //级联选择项变化会触发这个函数
      handleChange(){
      this.getParamsList()
     },
      handleTabClick(){
       //console.log(this.activeName)
        this.getParamsList()
     },
     //获取分类参数的数据
     async getParamsList(){
       //证明不是三级分类
       if(this.selectedkeys.length!==3) {
         this.selectedkeys=[]
         this.onlyTableData=[]
         this.manyTableData=[]
         return
         }
         //证明选中时三级分类
         //根据所选分类的id和当前所处的面板获取对应的参数
         // console.log(this.selectedkeys)
         const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
           params:{sel:this.activeName}
         })
         if(res.meta.status!==200){return this.$message.error("获取参数列表失败")}
         res.data.forEach(item=>{
           item.attr_vals=item.attr_vals ? item.attr_vals.split(" ") :[],
           //控制文本框的显示与隐藏
           item.inputVisible=false
           //文本框中输入的值
           item.inputValue=""

         })
         console.log(res.data)
         if(this.activeName==="only"){
           this.onlyTableData=res.data
         }else{
           this.manyTableData=res.data
         }
     },
     showAddParams(){

       this.addParamsDialogVisible = true
     },
     //重置添加分类参数或者属性的内容
     addParamsDialogClosed(){
       this.$refs.addParamsFormRef.resetFields()
     },
     addParams(){
       this.$refs.addParamsFormRef.validate(async valid=>{
         if(!valid) return
         const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
           attr_name:this.addParamsForm.attr_name,
           attr_sel: this.activeName
         })
         if(res.meta.status!==201){return this.$message.error("添加失败")}
         this.$message.success("添加成功!")
         this.getParamsList()
         this.addParamsDialogVisible = false
     })
    },
    //展示编辑的分类参数对话框
     async showeditParams(id){
        const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
          attr_sel:this.activeName
        })
       if(res.meta.status!==200){return this.$message.error("获取失败")}
       this.editParamsForm=res.data
       this.editParamsDialogVisible = true
      },
      //保存编辑的分类参数对话框
      saveEditParams(){
        this.$refs.editParamsFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{
            attr_name:this.editParamsForm.attr_name,
            attr_sel:this.activeName
          })
          //console.log(res)
          if(res.meta.status!==200){return this.$message.error("修改参数失败")}
          this.$message.success("修改参数成功!")
          this.getParamsList()
          this.editParamsDialogVisible = false

        })

      },
      //根据id删除参数
      async removeeditParams(attr_id){
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
          const {data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          //console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败")
          }
          this.$message.success("删除用户成功")
         this.getParamsList()
      },
      // 点击按钮，展示文本书输入框
      showInput(row) {
              row.inputVisible = true
              //让文本框自动获得焦点
              //$nextTick方法的作用：就是当页面上元素被重新渲染之后才会之星回调函数的代码
            this.$nextTick(_ => {
                      this.$refs.saveTagInput.$refs.input.focus();
                    })
              },
       //文本失去焦点或者按下了enter都会触发
       handleInputConfirm(row){
         if(row.inputValue.trim().length===0){
           row.inputValue=""
           row.inputVisible = false
           return
         }
         //如果没有return，证明面输入的内容需要另外处理
         row.attr_vals.push(row.inputValue.trim())
         row.inputValue=""
         row.inputVisible = false
         //发起请求保存这次操作
         this.saveAttrVals(row)
       },
        //需要发起请求保存这次操作
        async  saveAttrVals(row){
          const {data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,
            attr_sel:this.activeName,
            //服务器只接受字符串，所以用join做拼接
            attr_vals:row.attr_vals.join(" ")
          })
          //console.log(res)
          if (res.meta.status !== 200) {
             return this.$message.error("修改参数项失败")
           }
           this.$message.success("修改参数项成功")
        },
       //删除对应的参数和选项
       async handleClose(i,row){
          row.attr_vals.splice(i,1)
          this.saveAttrVals(row)
       }
   },

   computed:{
     //如果按钮需要被禁用免责，则返回true,否则返回false
     isBtnDisabled(){
       if(this.selectedkeys.length!==3){
         return true
       }
       return false
     },
     //当前选中的三级分类id
     cateId(){
       if(this.selectedkeys.length===3){
          return this.selectedkeys[2]
       }
       return null
     },
     //动态计算标题的文本
     titleText(){
       if(this.activeName ==="many"){
         return "动态参数"
       }
       return "静态参数"
     }
   }
  }
</script>

<style lang="less" scope >
  .cat_opt{
    margin-top:15px
  }
  .el-tag{
    margin: 5px;
  }
</style>
