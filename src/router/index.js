import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/product',
    component: Layout,
    redirect: 'noredirect',
    name: 'product',
    meta: {
      title: '商品管理',
      icon: 'component'
    },
    children: [
      { path: 'productList', component: _import('product/productList'), name: 'markdown-demo', meta: { title: '商品列表' }},
      { path: 'back-to-top', component: _import('product/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: '报表管理',
      icon: 'chart'
    },
    children: [
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/table/complex-table',
    name: 'order',
    meta: {
      title: '订单管理 ',
      icon: 'example'
    },
    children: [
      {
        path: '/order/table',
        component: _import('order/table/index'),
        redirect: '/order/table/complex-table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'complex-table', component: _import('order/table/complexTable'), name: 'complexTable', meta: { title: '订单列表' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('order/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'excel'
    },
    children: [
      { path: 'userList', component: _import('user/userList'), name: 'userList', meta: { title: '用户列表' }},
      { path: 'upload-excel', component: _import('user/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
