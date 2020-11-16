import request from '../common/request';
import { host } from '../common/config';

export async function menu ({ id,page,limit,keyword }) {

   const result = await request({
      url:`${host}/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`,
      method:'get',
   });
   console.log('menu',result);
   return result;
}

// 加载食物
export async function food (data) {
   const result = await request({
      url:`${host}/food`,
      method:'post',
      data
   });
   return result;
}

// 更新状态
export async function changeFood (data){
   const result = await request({
      url:`${host}/food`,
      method:'post',
      data
   });

   return result;
}