import Vue from 'vue';
import Vuex from 'vuex';

/* global */
import loading from './loading';
import language from './language';

/* page */
import login from '@/views/Login/module/index';
import restaurant from '@/views/Restaurant/module/index';
import menu from '@/views/Menu/module/index';
import tags from '@/views/Tags/module/index';
import order from '@/views/Order/module/index';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
   },
   mutations: {
   },
   actions: {
   },
   modules: {
      loading,
      language,
      restaurant,
      menu,
      tags,
      order,
      login
   }
});
