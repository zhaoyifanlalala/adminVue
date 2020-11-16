<template>
  <div class="admin">
    <el-container>
      <el-aside
        width="200px"
        :style="{ width: isCollapse ? '65px' : '' }"
      >
        <div class="logo">
          <img
            src="../../assets/logo.png"
            alt=""
            class="logoImg"
          >
        </div>

        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          text-color="#fff"
          :style="{ height: isCollapse ? '600px' : '' }"
        >
          <router-link to="/admin/restaurant">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">
                餐馆
              </span>
            </el-menu-item>
          </router-link>
          <router-link to="/admin/menu">
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span slot="title">
                菜单
              </span>
            </el-menu-item>
          </router-link>
          <router-link to="/admin/order">
            <el-menu-item
              v-if="isVisitor === false"
              index="3"
            >
              <i class="el-icon-document"></i>
              <span slot="title">
                订单
              </span>
            </el-menu-item>
          </router-link>
          <el-button
            class="logout-btn"
            @click="logout"
          >
            登出
          </el-button>
        </el-menu>

        <div class="radio-btn">
          <el-radio-group
            v-model="isCollapse"
            style="margin-bottom : 20px;"
          >
            <el-radio-button
              v-if="isCollapse"
              :label="false"
            >
              <span>&gt;</span>
            </el-radio-button>
            <el-radio-button
              :label="true"
            >
              <div>
                <span>&lt;</span>
              </div>
            </el-radio-button>
          </el-radio-group>
        </div>
      </el-aside>
      <el-container>
        <el-header></el-header>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              Admin
            </el-breadcrumb-item>
            <el-breadcrumb-item class="router-name">
              {{ routeName }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import './admin.scss';
import _ from 'lodash';
import { getStorage,setStorage } from '@/common/utils';

export default {
   name: 'Admin',
   components: {
      // Aside,
   },
   data () {
      return {
         isCollapse: false,
      };
   },
   computed: {
      routeName (){
         return this.$route.name;
      },
      isVisitor (){
         if(_.get(getStorage('userInfo'),'role') === 'visitor'){
            return true;
         }else{
            return false;
         }
      }
   },
   methods: {
      logout (){
         setStorage('userInfo',null);
         this.$router.push('/login');
      }
   }
};
</script>
