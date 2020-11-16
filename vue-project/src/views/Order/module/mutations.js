import * as types from '@/store/mutation-types';

const mutations = {

   /* 加载饭店 */
   [types.LOAD_ORDER] (state,data){
      state.list = data.list;
      console.log(',,,,',state.list);
   }
};

export default mutations;