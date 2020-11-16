<template>
  <div class="order">
    <el-date-picker
      v-model="orderValue"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="dateChange"
    >
    </el-date-picker>

    <div class="line">
      <div
        id="lineOptions"
        :style="{width: '800px', height: '300px'}"
      ></div>
      <div
        class="pieChart"
        :style="{width: '800px',height:'250px'}"
      ></div>
    </div>
    <div class="pie">
      <div
        id="pieOptions"
        :style="{width: '800px', height: '300px'}"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import './order.scss';
import { getAllDate } from '@/common/utils.js'; '';
import moment from 'moment';
import _ from 'lodash';
import { computeArr } from '@/common/utils.js';
/* eslint-disable */
export default {
   computed:{
      ...mapState({
         'list': state=>state.order.list
      }),
   },
   data () {
      return {
         orderValue:'',
         date:[],
         pieData: [],
         seriesData: [],
         start:'',
         end:'',



         pickerOptions: {
            shortcuts: [ {
               text: '最近一周',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近一个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近三个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [ start, end ]);
               }
            } ]
         },

      };
   },

    mounted(){
      this.drawLine();
    },


   methods: {
     ...mapActions(['loadOrder']),

      async dateChange (value){
        console.log('value',value);
        this.start = moment(value[0]).format("YYYY-MM-DD");
        this.end = moment(value[1]).format("YYYY-MM-DD");

        await this.loadOrder({
          start:value[0].toString(),
          end:value[1].toString(),
        })
        this.dailyOrder();
        this.pieChart()
        // console.log(test);
        // console.log(_.map(this.dailyOrder(),(item)=>item.count))
      },

      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let lineOptions = this.$echarts.init(document.getElementById('lineOptions'))
        // 绘制图表
        lineOptions.setOption({
            title: { 
                text: '订单' 
            },
            xAxis: {
                type: 'category',
                data: this.date
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'line',
                data: this.seriesData
            }]
        });
      },

      pieChart () {
         let pieChart = this.$echarts.init(document.getElementsByClassName('pieChart')[0]);
         let option = {
            series: [
               {
                  type: 'pie',
                  radius: '55%',
                  center: [ '40%', '50%' ],
                  data: this.seriesData,
               }
            ]
         };
         pieChart.setOption(option);
      },

      daily() {
        // console.log('========in======')
        let dateArr = getAllDate(this.start, this.end);
        // console.log(dateArr)
        let newDataArr = _.map(dateArr, i => {
          return { date: i };
        });
        this.date = dateArr;
        // console.log(this.date)
        this.pieData = newDataArr
      },
      
      dailyOrder(){
        this.daily();
        console.log("x轴的日期====>", this.date);
        let arr = _.map(this.list, item => {
          return {
            count: _.get(item, "cart", "").length,
            date: moment(item.createdAt).format("YYYY-MM-DD")
          };
        });

        let map = {},
        newArr = [];
        for (let i = 0; i < arr.length; i++) {
          let ai = arr[i];
          if (!map[ai.date]) {
            newArr.push({
              date: ai.date,
              count: ai.count
            });
            map[ai.date] = ai;
          } else {
            for (let j = 0; j < newArr.length; j++) {
              let dj = newArr[j];
              if (dj.date == ai.date) {
                dj.count = dj.count + ai.count;
                break;
              }
            }
          }
        }
        console.log("订单量====>", newArr);
        console.log('datedatedatedate',this.date)
        let arr2 = [];
      _.forEach(this.date, i => {
        _.forEach(newArr, j => {
          if (j.date === i) {
            arr2.push({
              date: i,
              count: j.count
            });
          } else {
            arr2.push({
              date: i,
              count: 0
            });
          }
        });
      });
      // console.log(arr2)
      let a = computeArr(arr2);
      console.log("处理过的最终数据=====.>", a);
    
        // return newArr
        this.seriesData=_.map(computeArr(arr2),item=>item.count)


        this.drawLine()
      },


   },
  //  watch:{
  //    seriesData:{
  //      handler:(newP,oldP)=>{
  //        console.log(newP);
  //      },
  //      immediate:true
  //    }
  //  }

};
</script>


