import * as types from '../../../store/mutation-types';
const mutations = {
   [types.SET_REST_LIST] (state, data) {
      state.restList = data.list;
   },
   [types.SAVE_REST_LIST] (state,data){
      state.restaurant = data.restaurant;
   }
};

export default mutations;