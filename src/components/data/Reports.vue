<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 900px;height:400px;"></div>

    </el-card>


    <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default{
data(){
  return{
    options: {
            title: {
              text: '用户来源'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#E9EEF3'
                }
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                boundaryGap: false
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ]
          }

  }
},
created(){
 //此时页面上的元素已经被渲染完毕了

},
mounted(){
  this.drawLine()
},
methods:{
 async drawLine(){
    // 3. 基于准备好的dom，初始化echarts实例
     var myChart = echarts.init(document.getElementById('main'))
     const {data: res} = await this.$http.get('reports/type/1')
     if (res.meta.status !== 200) {return this.$message.error("获取折线图失败")}
     // 4. 指定图表的配置项和数据
     const result = _.merge(res.data,this.options)
     // 5. 展示数据
     myChart.setOption(result)
  }

}
  }
</script>

<style lang="less" scope>
  .el-carousel__item h3 {
      color: #475669;
      font-size: 18px;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
</style>
