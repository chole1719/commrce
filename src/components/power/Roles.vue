<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>

      <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
         <!--角色列表区域-->
        <el-table :data="roleList"  stripe border >
          <el-table-column  type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom',i1===0 ? 'bdtop' :'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id" >
                <!--渲染一级权限-->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>

                <!--渲染二级和三级权限-->
                <el-col :span="19">
                  <!--渲染二级权限-->
                  <el-row  :class="['bdbottom',i2===0 ? 'bdtop' :'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                   <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                   </el-col>

                   <el-col :span="18">
                     <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                   </el-col>
                  </el-row>
                </el-col>

              </el-row>
               <!--渲染二级和三级权限<pre>{{scope.row}}</pre>-->
              
            </template>
          </el-table-column>
          <el-table-column  prop="roleid" type="index" label="#"></el-table-column>
          <el-table-column  prop="roleName"  label="角色名称" ></el-table-column>
          <el-table-column  prop="roleDesc" label="角色描述" ></el-table-column>
          <el-table-column  label="操作" width="400px">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="getEitRoleInfo(scope.row.id)" size="mini">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="delEitRoleById(scope.row.id)">删除</el-button>

             <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)" >分配权限</el-button>
           </template>
          </el-table-column>
        </el-table>

    </el-card>
   <!--添加角色的对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="resetRoleInfo">
      <el-form ref="addRoleFormRef" :model="roleForm" :rules="roleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text"  v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="text" v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

   <!--修改角色的对话框-->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="resetEditRoleInfo">
      <el-form ref="editRoleFormRef" :rules="editRoleFormRules" :model="editRoleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRoleInfo" >确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialog"
      width="50%"
      @close="setRightDialogClosed">
    <!--树形控件-->
      <el-tree
       node-key="id"
      :data="rightslist"
      :props="treeProps"
       show-checkbox
       default-expand-all
      :default-checked-keys="defkeys"
       ref="treeRef"
       ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
data(){
      return {
        roleList:[],
        roleForm:{
          roleId:"",
          roleName:"",
          roleDesc:""
        },
        roleFormRules:{
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max:30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ]
        },
        addRoleDialogVisible:false,
        editRoleDialogVisible:false,
        editRoleForm:{
          roleId:"",
          roleName:"",
          roleDesc:""
        },
        editRoleFormRules:{
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ]
        },
        setRightDialog:false,
        //所有权限的数据
        rightslist:[],
        //树形控件的属性绑定对象
        treeProps: {
                  children: 'children',
                  label: 'authName'
                },
        //默认选中的id值数组
        defkeys: [],
        //当前即将分配权限的角色id
        roleId:""
    }
},
created(){
  this.getRoleList();
},
methods:{
     //重置添加角色表单
       resetRoleInfo(){
         this.$refs.addRoleFormRef.resetFields();
       },
     //监听添加角色事件
      addRoleInfo(){
       this.$refs.addRoleFormRef.validate(async valid=>{
         if(!valid){return this.$message.error("数据书写错误")}
         const {data:res} = await this.$http.post("roles",{
            roleName:this.roleForm.roleName,
            roleDesc:this.roleForm.roleDesc
            })
            if(res.meta.status!==201){ return this.$message.error("添加角色失败")}
            this.roleForm=res.data
            this.$message.success("添加角色成功！")
            this.addRoleDialogVisible=false
            this.getRoleList()
            //console.log(res);
       })
       },
     //获取角色列表
     async  getRoleList(){
        const {data:res}=await this.$http.get("roles")
        if(res.meta.status!==200){return this.$message.error("获取角色失败")}
        this.roleList=res.data
        //console.log(res)
       },
      //重置修改角色表单
      resetEditRoleInfo() {
        this.$refs.editRoleFormRef.resetFields()
      },
    //展示编辑按钮的角色信息
      async  getEitRoleInfo(roleId){
         const {data:res}=await this.$http.get("roles/"+roleId)
         console.log(res)
         this.editRoleForm=res.data

         this.editRoleDialogVisible=true
    },
    //保存修改的角色信息
      saveEditRoleInfo(){
        this.$refs.editRoleFormRef.validate(async valid=>{
         if(!valid)return
       const {data:res} = await this.$http.put("roles/"+this.editRoleForm.roleId,
       { roleName:this.editRoleForm.roleName,
         roleDesc:this.editRoleForm.roleDesc })
          //console.log(res)
          if(res.meta.status!==200){ return this.$message.error("修改角色失败") }
          this.$message.success("修改角色成功！")
           this.editRoleDialogVisible=false
           this.getRoleList()
        })
     },
   //通过id删除角色
   async  delEitRoleById(id){
    const confirmResult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).catch(err=>err)
            if(confirmResult!=="confirm"){return this.$message.info("已取消删除")}
       const {data:res}=await this.$http.delete("roles/"+id)
       if(res.meta.status!==200){ return this.$message.error("删除角色失败") }
       this.$message.success("删除角色成功！")
       this.getRoleList()
       },
    //通过id删除角色权限
    async removeRightById(role,rightId){
      const confirmResult =await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning'
                 }).catch(err=>err)
          if(confirmResult!=="confirm"){return this.$message.info("已取消删除")}
         const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
         if(res.meta.status!==200){ return this.$message.error("删除权限失败") }
         this.$message.success("删除权限成功！")
         role.children=res.data
       },

    //展示分配权限的对话框
    async   showSetRightDialog(role){
         this.roleId=role.id
         const {data:res}=await this.$http.get("rights/tree")
         if(res.meta.status!==200){ return this.$message.error("获取权限失败") }
         this.rightslist=res.data
         //获取三级节点的id
         this.defLeafKeys(role,this.defkeys)
         this.setRightDialog=true
         //console.log(this.rightslist)
       },
       //通过递归的形式获取角色下所有三级权限的id，并保存到defkeys数组中
    async  defLeafKeys(node,arr){
       //如果当前node节点不包含children,则是三级节点
      if(!node.children){
         return arr.push(node.id)
      }
      //递归所有arr
      node.children.forEach(item=>
        this.defLeafKeys(item,arr) )
    },
    //监听分配对话框的关闭事件
    async setRightDialogClosed(){
      this.defkeys=[]
    },
    //监听分配对话框的关闭事件
    async allotRights(){
      const keys= [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200){ return this.$message.error("分配权限失败") }
      this.$message.success("分配权限成功！")
      this.getRoleList()
      this.setRightDialog=false
       console.log(res)
     }
     }
  }
</script>

<style lang="less" scoped>
  .el-table{
    margin-top: 20px;
  }
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .el-tag{
    margin: 7px;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
