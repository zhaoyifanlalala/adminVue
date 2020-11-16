import Vue from 'vue';
import VueRouter from 'vue-router';

import { getStorage } from '@/common/utils';
import _ from 'lodash';

Vue.use(VueRouter);

const routes = [
   {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/Login.vue'),
      beforeEnter: (to, from, next) => {
         if(_.get(getStorage('userInfo'),'role')) {
            next({
               path:'/admin/restaurant'
            });
         }else{
            next();
         }
      }
   },
   // {
   //    path: '/',
   //    name: '/',
   //    redirect: '/login',
   // },
   {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/restaurant',
      component: () => import('../views/Admin/Admin'),
      children: [
         { path: 'restaurant', name: 'Restaurant', component: () => import('../views/Restaurant/Restaurant.vue') },
         { path: 'menu', name: 'Menu', component: () => import('../views/Menu/Menu.vue') },
         {
            path: 'order', name: 'Order', component: () => import('../views/Order/Order.vue'),
            beforeEnter: (to, from, next) => {
               if((_.get(getStorage('userInfo'),'role')) === 'visitor') {
                  next({
                     path:'/admin/restaurant'
                  });
               }else{
                  next();
               }
            }
         }
      ]
   },

];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

// 路由守卫：拦截 去登录和注册之外的页面，判断是否登录，登录放行，否则强制跳到登录
router.beforeEach((to, from, next) => {
   if((to.name == 'Login') ){
      next();
   }else{
      /* 需要检测是否登录 */
      if(!_.get(getStorage('userInfo'),'role')){
         next({
            name: 'Login'
         });
      }else{
         next();
      }
   }
});
export default router;

