<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索框区域-->
      <el-row >
        <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        </el-col>
      </el-row>

      <!--table区域-->
      <el-table
       :data="orderlist"
       border
       striped
       style="width: 100%"
       >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
          {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox(scope.row.order_id)"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox" ></el-button>
          </template>
        </el-table-column>
      </el-table>

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

     <!--展示修改地址的对话框-->
     <el-dialog
       title="修改地址"
       :visible.sync="adressVisible"
       width="50%"
       @close="addAdressClosed">
       <el-form
       ref="adressFormRef"
       :model="editAdressForm"
       :rules="editAdressFormrules">
         <el-form-item label="省市区/县" prop="adress1">
            <el-cascader
               expand-trigger="hover"
               :options="cityData"
               v-model="selectedOptions2"
               @change="handleChange">
             </el-cascader>
         </el-form-item >
         <el-form-item label="详细地址" prop="adress2">
           <el-input v-model="editAdressForm.adress2"> </el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="adressVisible = false">取 消</el-button>
         <el-button type="primary" @click="adressVisible = false">确 定</el-button>
       </span>
     </el-dialog>

     <!--展示修改物流进度的对话框-->
     <el-dialog
       title="物流进度"
       :visible.sync="progressVisible"
       width="50%">
         <!--时间线-->
         <el-timeline>
           <el-timeline-item
             v-for="(activity, index) in progressInfo"
             :key="index"
             :timestamp="activity.time">
             {{activity.context}}
           </el-timeline-item>
         </el-timeline>

     </el-dialog>

  </div>
</template>

<script>
  import cityData from './citydata.js'
  export default{
    data(){
      return{
        queryInfo:{
          //查询参数
          query:"",
          //当前页码
          pagenum:1,
          //每页显示条数
          pagesize:5
        },
        orderlist:[],
        total:0,
        adressVisible:false,
        editAdressForm:{
          adress1:"",
          adress2:""
        },
        editAdressFormrules:{
          adress1:[{
              required: true,
              message: '请选择正确地址',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }],
          adress2:[{
                required: true,
                message: '请填写详情地址',
                trigger: 'blur'
              },
              {
                min: 3,
                max: 10,
                message: '长度在 3 到 10 个字符',
                trigger: 'blur'
              }]
        },
        cityData,
        progressVisible:false,
        progressInfo:[],
        options:[],
        selectedOptions2:[]
      }
    },
    created(){
        this.getOrderlist()
    },
    methods:{
      //获取订单数据列表
     async getOrderlist(){
        const {data:res}= await this.$http.get("orders",{
          params:this.queryInfo
        })
        if(res.meta.status!==200){ return this.$message.error("获取订单数据列表失败")}
        console.log(res.data.goods)
        this.orderlist=res.data.goods
        this.total=res.data.total
        this.$message.success("获取订单数据列表成功！")
         },
         //监听每页显示条数
         handleSizeChange(newSize){
            this.queryInfo.pagesize= newSize
            this.getOrderlist()
         },
         //监听当前页码
         handleCurrentChange(newPage){
            this.queryInfo.pagenum= newPage
            this.getOrderlist()
         },
         //展示修改对话框
         async showBox(id){
          const {data:res}= await this.$http.get("orders/"+id)
           this.adressVisible = true
           console.log(res.data.consignee_addr)
         },
         //修改地址对话框的关闭
         addAdressClosed(){
           this.$refs.adressFormRef.resetFields()
         },
         //展示修改物流状态的对话框
         async showProgressBox(){
           const {data:res}= await this.$http.get(`/kuaidi/1106975712662`)
           if(res.meta.status!==200){ return this.$message.error("获取物流进度失败")}
           this.progressInfo=res.data
           this.progressVisible = true
           console.log(this.progressInfo)

         },
         //级联选择器发生变化触发
         handleChange(){

         }


    }
  }
</script>

<style lang="less" scope>

</style>
