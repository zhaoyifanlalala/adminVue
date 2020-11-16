import * as types from '@/store/mutation-types';
import router from '@/router';
import  { login }  from '@/request/login';
import { setStorage } from '@/common/utils';

const actions =  {

   // async login ({ commit }){

   //    try {

   //       commit(types.SHOW_LOADING);
   //       //   router.push('/restaurant');
   //    } catch (error) {

   //       console.log(error);
   //    }finally{
   //       commit(types.HIDE_LOADING);
   //    }
   // },
   async login ({ commit },{ username,password }){
      const user = await login({ username,password });
      commit(types.SAVE_USERINFO,user );
      setStorage('userInfo',user);
      router.push('/admin');
   },
};

// function sleep (time){

//    return new Promise((res)=>{

//       setTimeout(()=>{
//          res();
//       },time);
//    });
// }

export default actions;