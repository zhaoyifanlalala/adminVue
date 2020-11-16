import * as types from '@/store/mutation-types';
import { menu } from '@/request/menu';
import { restaurant } from '@/request/restaurant';
import { changeFood } from '@/request/menu';
import _ from 'lodash';

const actions = {

   async getMenu ({ commit }){
      commit(types.SHOW_LOADING);
      try{
         const result = await restaurant();
         const categories = _.map(result.list,(item)=>{
            return {
               id:item._id,
               name:item.name['zh-CN']
            };
         });
         commit(types.SET_MENU,{ name:categories });
      }catch(error){
         this._vm.$message.error(error.message);
      }finally{
         commit(types.HIDE_LOADING);
      }

   },

   async loadFood ({ commit },{ id,page,limit,keyword }){

      try {
         commit(types.SHOW_LOADING);
         /* 加载食物 */
         const result = await menu({ id,page,limit,keyword });
         commit(types.LOAD_FOOD,{
            foods:result.list,
            count:result.count
         });
      } catch (error) {
         // this._vm.$message.error(error.message);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },

   async updateFood ({ commit },{ id,data }){

      try {
         commit(types.SHOW_LOADING);
         await changeFood({
            id,
            data
         });
      } catch (error) {
         this._vm.$message.error(error.message);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },
};
export default actions;