import * as types from '../../../store/mutation-types';

const mutations = {
   /* menu 数据存放到 vuex */
   [types.SET_MENU] (state,data){
      state.categories = data.name;
   },
   [types.LOAD_FOOD] (state,data){
      state.foods = data.foods;
      state.count = data.count;
   }
};

export default mutations;