import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Roles from '@/components/power/Roles'
import Rights from '@/components/power/Rights'
import Goods from '@/components/goods/Goods'
import Params from '@/components/goods/Params'
import Add from '@/components/goods/Add'
import Categories from '@/components/goods/Categories'
import Orders from '@/components/order/Orders'
import Reports from '@/components/data/Reports'

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        },
        {
          path: '/add',
          component: Add
        }

      ]
    }


  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪一个路径跳转而来
  //next 是一个函数，表示放行
  //next() 放行 next("/logon") 强制跳转
  if(to.path ==="/login") return next()
  //获取token
 const tokenstr= window.sessionStorage.getItem('token')
 if(!tokenstr) return next('/login')
 next()
})

export default router
