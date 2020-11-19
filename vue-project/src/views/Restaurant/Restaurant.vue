<template>
  <div class="restaurant-container">
    <el-table
      :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      style="width : 100%ththththth"
    >
      <el-table-column
        ref="restName"
        fixed
        prop="name.zh-CN"
        label="餐馆"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="address.formatted"
        label="地址"
        width="auto"
      >
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="300"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tags in scope.row.tags"
            :key="tags.key"
            effect="plain"
            class="restTags"
          >
            {{ tags.toUpperCase() }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="$permission()"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="手动关闭"
        width="145"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            :disabled="$permission()"
            @change="(v)=>{changeSwitch(v,scope.row._id)}"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="block"
      style=" margin-top :25px"
    >
      <el-pagination
        align="center"
        background
        yout="total,prev, pager, next,jumper"
        :total="list.length"
        :data="list.length"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- Form -->
    <ResModal
      :form="form"
      :tags="tags"
      :dialog-form-visible="dialogFormVisible"
      @closeResModal1="test"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex';
import {changeRestInfo} from '../../request/restaurant'
import './restaurant.scss';

import ResModal from '@/components/ResModal/ResModal';

export default {
   name: 'Restaurant',
   components: {
      ResModal
   },
   data () {
      return {
        value:'',
        dialogFormVisible: false,
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数,
        form:{}
      };
   },
    methods: {
        ...mapActions([
        'setRestList','loadTags','changeRestModel',
    ]),

        test(){
          this.dialogFormVisible = false;
        },
        // 点击编辑按钮
        handleEdit (index, row) {
          this.dialogFormVisible = true;
          this.form = JSON.parse(JSON.stringify(row));
        },
        // test(){
        //   console.log(this.list);
        // },

        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        },

        // Switch开关
        async changeSwitch (v,id){
          let closed = v ? { closed:true } : null;
          const data =  await changeRestInfo({
              id,
              data:{ closed }
          });
          if(data){
              console.log('closed',data);
          }
      },
    },

   computed: {
      ...mapState({
        'list': state => state.restaurant.restList,
        'tags':state => state.tags.tags
      }),

   },

   created () {
      this.setRestList();
      this.loadTags();

   },

};
</script>
