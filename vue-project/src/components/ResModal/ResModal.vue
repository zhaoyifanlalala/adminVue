<template>
  <el-dialog
    :title="title[`${defaultlang}`]"
    :visible.sync="isVisible"
    @close="closeResModal"
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
      <el-button @click="closeResModal">
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
</template>

<script>
import _ from 'lodash';
import Moment from 'moment-timezone';
Moment.locale('zh-cn');
// import { getStorage } from '@/common/utils';
import { mapActions } from 'vuex';

export default {
   name:'ResModal',
   props:{
      form:{
         type:Object,
         required:true
      },
      dialogFormVisible:{
         type:Boolean,
         required:true
      },
      tags:{
         type:Array,
         required:true
      }
   },
   data () {
      return {
         //   dialogFormVisible: false,
         formLabelWidth: '120px',
         //  form: {},
         title:'',
         language: [
            { value: 'zh-CN',label: '中文' },
            { value: 'en-US',label: '英文' }
         ],
         defaultlang: 'zh-CN',
         name:'',
         tag:'noodle',
         modalTag:[],

         timer:'',
         // 纽约时间
         newYork: '',

         // 开店时间
         hours:[],
         newHours:[],
         id:'',
         isVisible:false
      };
   },
   watch:{
      dialogFormVisible (v){
         //  console.log(' in=====> ',v);
         this.isVisible = v;
      },
      form (v){
         //  console.log('v ===>',v);
         //  if(v !== undefined){
         this.title = JSON.parse(JSON.stringify(v.name));
         this.name = JSON.parse(JSON.stringify(v.name));
         this.modalTag = JSON.parse(JSON.stringify(v.tags));
         this.id = v._id;
         this.getWeeks(v.hours);
         //  }

      }
   },
   methods: {
      ...mapActions([
         'changeRestModel',
      ]),

      // 显示日期
      getWeeks (hours){
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

            };
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
      addTags (val){
         if (!_.includes(this.modalTag,val)) {
            this.modalTag.push(val);
         }
      },

      // 移除标签
      deleteTags (value){
         this.modalTag.splice(this.modalTag.indexOf(value), 1);
      },

      // 关闭模态框
      closeResModal (){
         this.$emit('closeResModal1');
      },

      //   save
      save (){
         const data = {
            id:this.id,
            data:{
               name:this.name,
               tags:this.modalTag,
               hours:this.newHours
            }
         };

         console.log('data ===>',data);
         this.changeRestModel(data);
         //  this.$emit('closeResModal1');
         this.closeResModal();

      }
   },
   /* eslint-disable */
   created () {

       console.log('created ====');
      

      this.timer = setInterval(() =>{
         const date = new Date();
         this.newYork = Moment.tz(date,'America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');
      }, 1000);
   },
   destroy () {
      clearInterval(this.timer);
   },

};
</script>

<style>

</style>