import * as types from '@/store/mutation-types';
import { tags } from '@/request/tags';

const actions =  {
   async loadTags ({ commit }){
      const data = await tags();
      commit(types.LOAD_TAGS,data);
   },
};

export default actions;