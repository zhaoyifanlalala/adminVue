import * as types from '@/store/mutation-types';
import { order } from '@/request/order';

const actions = {
   async loadOrder ({ commit },{ start,end }){
      try {
         const result = await order( start,end );
         commit(types.LOAD_ORDER,result);
      } catch (error) {
         this._vm.$message.error(error.message);
      }
   },
};
export default actions;