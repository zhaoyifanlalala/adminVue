import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { getStorage } from '@/common/utils';
/* 引入 vue-i18n */
import VueI18n from 'vue-i18n';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入echarts
import echarts from 'echarts';
// import { from } from 'core-js/fn/array';
Vue.prototype.$echarts = echarts;

// import ECharts from 'vue-echarts';
// Vue.component('v-chart', ECharts);

Vue.prototype.$permission = function (){
   const role = getStorage('userInfo').role;
   if(role !== 'admin'){
      return true;
   }
};

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueI18n);

export const i18n = new VueI18n({
   locale: JSON.parse(localStorage.getItem('language')) || 'zh-CN',
   messages: {
      'zh-CN': require('./common/i18n/zh-CN.json'),
      'en-US': require('./common/i18n/en-US.json')
   },

});

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');
