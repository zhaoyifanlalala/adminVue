import * as types from '@/store/mutation-types';
import { restaurant,changeRestInfo } from '@/request/restaurant';

import _ from 'lodash';
// import router from '@/router';
// import { setStorage } from '@/common/utils';

const actions = {
   async setRestList ({ commit }){
      commit(types.SHOW_LOADING);
      try {
         const { list } = await restaurant();
         const result = _.map(list,(v)=>{
            if(v.closed === undefined || v.closed === null){
               v.isClosed = false;
            }else{
               v.isClosed = true;
            }
            // console.log('close',list);
            return v;
         });
         commit(types.SET_REST_LIST,{ result });
         commit(types.SET_REST_LIST,{ list });
      } catch (error) {
         this._vm.$modal.show('error',{ message:error.message });
      }finally{
         commit(types.HIDE_LOADING);
      }
   },

   async changeRestModel ({ commit,dispatch },data){
      commit(types.SHOW_LOADING);
      try {
         await changeRestInfo(data);
         // commit(types.SET_REST_LIST,result);
      } catch (error) {
         // this._vm.$message('error',{ message:error.message });
      }finally{
         await dispatch('setRestList');
         commit(types.HIDE_LOADING);
      }
   }

};

export default actions;