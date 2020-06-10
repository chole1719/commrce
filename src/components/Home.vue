<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
       <!--侧边栏-->
      <el-aside :width="isCollapase?'64px' :'200px'">
        <div class="toggle-button" @click="togglaCollapse">|||</div>
        <!--侧边栏菜单区域-->
         <el-menu
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#409EFF"
              unique-opened
              :collapse="isCollapase"
              :collapse-transition="false"
              router
              :default-active="activePath">
           <!--一级菜单-->
              <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!--一级菜单的模版区域-->
                <template slot="title">
                   <!--图标-->
                  <i :class="iconsObj[item.id]"></i>
                  <!--文本-->
                  <span>{{item.authName}}</span>
                </template>

                <!--二级菜单-->
                 <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                 <template slot="title">
                    <!--图标-->
                   <i class="el-icon-menu"></i>
                   <!--文本-->
                   <span>{{subItem.authName}}</span>
                 </template></el-menu-item>


              </el-submenu>
            </el-menu>
      </el-aside>
      <!--右侧内容区域-->
      <el-main><router-view></router-view></el-main>

    </el-container>
  </el-container>

</template>

<script>
  export default {
    data(){
      return{
        //做出菜单数据
        menulist:[],
        iconsObj:{
          '125':"iconfont icon-user",
          '103':"iconfont icon-tijikongjian",
          '101':"iconfont icon-shangpin",
          '102':"iconfont icon-danju",
          '145':"iconfont icon-baobiao"
        },
        //被激活的链接地址
        activePath:"",
        //是否折叠
        isCollapase:false
      }
    },
    //获取所有的菜单
    created(){
        this.getMenuList();
        //刷新页面的时候获取到上一次页面的activePath
        this.activePath=window.sessionStorage.getItem("activePath")
      },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      async getMenuList(){
        const {data:res}= await this.$http.get("menus");
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.menulist=res.data;
        //console.log(res)

      },
      //点击按钮切菜单的折叠与展开
      togglaCollapse(){
          this.isCollapase=!this.isCollapase;
      },
      //保存连接的激活状态
      saveNavState(activePath){
        window.sessionStorage.setItem("activePath",activePath);
        this.activePath=activePath
      }

    }
  }
</script>

<style lang="less" scoped>
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    border-right: 0;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .home-container{
    height: 100%;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    texsaveNavStatet-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>'/'+subitem.path
