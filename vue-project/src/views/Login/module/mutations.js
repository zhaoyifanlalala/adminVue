import * as types from '@/store/mutation-types';

const mutations = {
   [types.SAVE_USERINFO] (state,data){
      state.user = data;
   },
   [types.CLEAR_USERINFO] (state){
      state.user = [];
   },
};

export default mutations;