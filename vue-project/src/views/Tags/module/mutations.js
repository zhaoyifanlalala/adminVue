import * as types from '@/store/mutation-types';
const mutations = {
   [types.LOAD_TAGS] (state,data){
      state.tags = data.list;
   }
};

export default mutations;