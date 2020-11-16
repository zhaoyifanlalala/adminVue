<template>
  <div class="restaurant-container">
    <!-- <button @click="test">
      test
    </button> -->
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
            :disabled="isEmployee === true ? true : false"
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
            :disabled="isEmployee === true ? true : false"
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
    <el-dialog
      :title="title[`${defaultlang}`]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="餐馆名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="name[`${defaultlang}`]"
            class="input-select"
          >
            <el-select
              slot="prepend"
              v-model="defaultlang"
              style=" width :100px"
              value="zh-CN"
              placeholder="请选择语言"
              @change="changeLanguage"
            >
              <el-option
                v-for="item in language"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          label="餐馆标签"
          :label-width="formLabelWidth"
          prop="tags"
        >
          <el-select
            v-model="tag"
            filterable
            allow-create
            default-first-option
            @change="addTags"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-tag
            v-for="item in modalTag"
            :key="item.value"
            effect="plain"
            class="restTags"
            size="small"
            closable
            @close="deleteTags(item)"
          >
            {{ item.toUpperCase() }}
          </el-tag>
        </el-form-item>

        <!-- 开门时间 -->
        <el-form-item
          label="开门时间"
          :label-width="formLabelWidth"
          prop="hours"
        >
          <div>
            <span>纽约当地时间：{{ newYork }}</span>
          </div>
          <div
            v-for="(item,index) in hours"
            :key="index.id"
          >
            <el-input
              :model="item.day"
              :style="{width: '100px'}"
              :disabled="true"
              :placeholder="item.day"
            >
            </el-input>
            <el-time-picker
              v-model="item.time"
              arrow-control
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              @change="(v)=>{changeHour(v,index)}"
            >
            </el-time-picker>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="save"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex';
import {changeRestInfo} from '../../request/restaurant'
import './restaurant.scss';
import _ from 'lodash';
import Moment from 'moment-timezone';
Moment.locale('zh-cn'); 
import { getStorage } from '@/common/utils';

export default {
   data () {
      return {
        value:'',
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {},
        title:'',
        language: [
            { value: 'zh-CN',label: '中文' },
            { value: 'en-US',label: '英文' }
        ],
        defaultlang: 'zh-CN',
        name:'',
        tag:'noodle',
        modalTag:[],
        // 纽约时间
        newYork: '',
        
        // 开店时间
        hours:[],
        newHours:[],
        id:''
      };
   },
    methods: {
        ...mapActions([
        'setRestList','loadTags','changeRestModel',
    ]),

        // 点击编辑按钮
        handleEdit (index, row) {
          this.dialogFormVisible = true;
          this.title = JSON.parse(JSON.stringify(row.name));
          this.name = JSON.parse(JSON.stringify(row.name));
          this.modalTag = (index, row).tags;
          this.id = row._id
          this.getWeeks((index,row).hours);
        },
        // test(){
        //   console.log(this.list);
        // },

        // 显示日期
        getWeeks(hours){
          const weekDay = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期日' ];
          this.hours = _(weekDay).map((v,index)=>{
            const start = _.get(hours[index], 'start');
            const end = _.get(hours[index], 'end');
            return{
              day:v,
              time : [ 
                Moment().startOf('day').add(start,'minutes').toDate(), 
                Moment().startOf('day').add(end,'minutes').toDate()
              ]
              
            }
          }).value();
          console.log('xxxxx',this.hours);
          this.newHours = hours;
        },

        // 改变开门时间
        changeHour (v,index){
          const start = this.getMinute(v[0]);
          const end = this.getMinute(v[1]);

          this.newHours[index].start = start;
          this.newHours[index].end = end;

          console.log('start',start);
        },
        getMinute (time){
          return Moment(time).hours() * 60 + Moment(time).minute();
        },

        // 改变语言
        changeLanguage (val){
          this.defaultlang = val;
        },

        // 选择tags后，在旁边添加tags  tags去重
        addTags(val){
          if (!_.includes(this.modalTag,val)) {
            this.modalTag.push(val);
          }
        },

        // 移除标签
        deleteTags(value){
          this.modalTag.splice(this.modalTag.indexOf(value), 1);
        },

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

        // save
        save(){
          this.dialogFormVisible = false;

          const data = {
            id:this.id,
            data:{
              name:this.name,
              tags:this.modalTag,
              hours:this.newHours
            }
          }
          this.changeRestModel(data)
        }
    },

   computed: {
      ...mapState({
        'list': state => state.restaurant.restList,
        //  'lang': state => state.language.lang
        'tags':state => state.tags.tags
      }),

      isEmployee (){
         if(_.get(getStorage('userInfo'),'role') === 'employee'){
            return true;
         }else{
            return false;
         }
      }
      
   },

   created () {
      this.setRestList();
      this.loadTags();

      let timer = setInterval(() =>{
        const date = new Date();
        this.newYork = Moment.tz(date,"America/New_York").format('YYYY-MM-DD HH:mm:ss dddd');
      }, 1000);
   },
   destroy () {
      clearInterval(timer);
   },

};
</script>
