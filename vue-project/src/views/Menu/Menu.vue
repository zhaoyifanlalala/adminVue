<template>
  <div>
    <div class="search-container">
      <el-select
        v-model="restaurant"
        filterable
        placeholder="请选择"
        @change="getFood"
      >
        <el-option
          v-for="item in names"
          :key="item.key"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <!-- Menu 菜单表格 -->
    <div class="table-content">
      <el-table
        :data="foods"
        style="width : 100%idth"
      >
        <el-table-column
          prop="name.zh-CN"
          label="菜品"
          width="auto"
        >
          <template slot="header">
            <span>菜品</span>
            <input
              ref="searchValue"
              v-model="keyword"
              placeholder="请输入关键字"
              class="searchInput"
              @keyup.enter="searchFood"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="auto"
        >
          <template slot-scope="scope">
            <span>
              $ {{ scope.row.price | formatPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="available"
          label="状态"
          width="auto"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              :disabled="isEmployee === true ? true : false"
              @change="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      align="center"
      background
      :page-size="pageSize"
      layout="prev, pager, next,sizes"
      :total="count"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState,mapActions } from 'vuex';
import { getStorage, setStorage } from '../../common/utils';
import './menu.scss';

export default {
   data () {
      return {
         restaurant:'',
         // name:[],

         currentPage:1,
         pageSize:20,
         keyword:'',

         id:'',

      };
   },
   filters:{
      formatPrice (price){
         price = (price / 100).toFixed(2);
         return price;
      }
   },
   methods:{
      ...mapActions([ 'getMenu', 'loadFood', 'updateFood' ]),

      getFood(val){
         // const id = val
         // setStorage('resId',id);
         this.id = val
         this.keyword = '';
         this.tableData();
         this.$refs.searchValue.value = "";
         console.log('val',val);
      },

      tableData(){
         this.loadFood(
            { 
               // id:getStorage('resId'),
               id:this.id,
               page:this.currentPage,
               limit:this.pageSize,
               keyword:this.keyword 
            }
         )
      },
      handleSwitch(row) {
         if (row.available === false) {
            this.updateFood({
               id: row._id,
               data: {
                  available: false
               }
            });

         } else {
            this.updateFood({
               id: row._id,
               data: {
                  available: true
               }
            });
         }
      },

      handleCurrentChange (val){
         this.currentPage = val;
         this.tableData();
      },
      handleSizeChange (val){
         this.pageSize = val;
         this.currentPage = 1;
         this.tableData();
      },

      searchFood(){
         this.tableData();
      }
   },
   
   computed: {
      ...mapState({
         // 'lang': state => state.language.lang,
         // 种类
         'names':state=>state.menu.categories,
         // 菜单详情 
         'foods':state=>state.menu.foods,
         'count':state=>state.menu.count
      }),

      // 判断是否为员工身份
      isEmployee (){
         if(_.get(getStorage('userInfo'),'role') === ('employee' || 'visitor')){
            return true;
         }else{
            return false;
         }
      }
   },
   created () {
      // 根据餐馆名获取menu 
      this.getMenu();
      // this.tableData();
   },
};
</script>
