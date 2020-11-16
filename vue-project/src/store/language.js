import * as types from './mutation-types';
import { setStorage,getStorage } from '../common/utils';
const language = {
   state: {
      lang: getStorage('language') || 'zh-CN'
   },
   mutations: {
      [types.SET_LANGUAGE] (state, data) {
         state.lang = data;
      }
   },
   actions: {
      setLanguage ({ commit }, data) {
         setStorage('language',data);
         commit(types.SET_LANGUAGE, data);
      }
   }
};

export default language;