<template>
   <div class="container">
      <div class="timeForm">
         <input type="text" v-model="description" class="description form-control" placeholder="Type Your Work Name">
         <div class="runningTime">
            <span class="hours">{{hours}}:</span>
            <span class="mins">{{mins}}:</span>
            <span v-if="">{{secs}}</span>
         </div>
         <button class="count-start" @click="startTrack" v-if="!startTrackTime">ON</button>
         <button class="count-end" @click="stoptrack" v-if="startTrackTime">OFF</button>
         <span class="deletebtn" v-if="startTrackTime" @click="removeTracking"><img src="../assets/delete.png" alt=""></span>
      </div>
      
      <div class="tracking-sngle-item">
         <table class="table">
            <thead>
               <tr>
                  <th>Description</th>
                  <th>Start to End</th>
                  <th>Duration</th>
                  <th class="option"></th>
               </tr>
            </thead>
            <tbody>
               <tr class="single-track-row" v-for="list in trackingList">
                  <td class="task-name">{{list.description}}</td>
                  <td class="startTOend">{{startToend(list)}}</td>
                  <td class="Duration">{{duration(list)}}</td>
                  <td >
                     <button class="dropdown-btn btn" type="button" data-toggle="dropdown">
                        <span class="icon"></span>
                     </button>
                     <ul class="dropdown-menu">
                        <li @click="editTrack(list)">Edit</li>
                        <li @click="removeSingleTrack(list)">Remove</li>
                     </ul>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
      <div class="updateTime" v-if="updateBox">
         <div class="timeForm">
            <input type="text" v-model="updated.description" class="description form-control" placeholder="Type Your Work Name">
            <datetime type="datetime" v-model="updated.startTime" use12-hour></datetime><datetime type="datetime" v-model="updated.endTime" use12-hour></datetime>
            <button class="count-start" @click="updateComplete()">UPDATE</button>
         </div>
         <div class="cancel" @click="hideUpdateBox">X</div>
      </div>
   </div>
</template>


<script>
   var moment = require('moment')
   import datePicker from 'vuejs-datepicker';
   import { Datetime } from 'vue-datetime';
   export default {
      components: {
         datePicker,
         datetime: Datetime
     },
      data() {
         return {
            description: '',
            startTime: '',
            startTrackTime: false,
            updateBox: false,
            trackingList: [],
            updated: {},
            secs: 0,
            mins: 0,
            hours: 0,
            id: null
         }
      },

      methods:{
         getData(){
            this.$http.get('http://localhost:3000/posts')
               .then((response)=>{
                  this.trackingList = response.body
               })
               .catch()
         },
         startTrack(){
            this.startTime = new Date()
            this.startCount = false
            this.startTrackTime = true
         },
         stoptrack(){
            var postData = {
               description: this.description,
               startTime: this.startTime,
               endTime: new Date()
            }
            this.$http.post('http://localhost:3000/posts', postData)
               .then((response) => {
                  this.getData()
               })
               .catch()

            this.secs = '0' + 0
            this.startTrackTime = false
            this.description = ''
         },
         hideUpdateBox(){
            this.updateBox = false
            this.updateData = {}
         },
         editTrack(list){
            this.updateBox = true
            this.id = list.id
            this.updated = list
         },
         updateComplete(){
            this.updateBox = false
            var updateData = {
               startTime: this.updated.startTime,
               endTime: this.updated.endTime,
               description: this.updated.description
            }
            this.$http.put('http://localhost:3000/posts/' + this.id, updateData)
               .then((response) => {
                  this.$http.get('http://localhost:3000/posts')
                     .then((response)=>{
                        this.trackingList = response.body
                     })
                     .catch()
               })
               .catch()
         },
         runningTime(){
            if(this.startTrackTime){
               this.secs ++
               if(this.secs < 10){
                  this.secs = '0' + this.secs
               }
               if(this.secs == 60){
                  this.secs = '0'+0
                  this.mins ++
                  if(this.mins < 10){
                     this.mins = '0' + this.mins
                  }
                  if(this.mins == 60){
                     this.mins = '0'+0
                     this.hours ++
                     if(this.hours < 10){
                        this.hours = '0' + this.hours
                     }
                  }
               }
            }else{
               this.secs = '0' + 0
               this.mins = '0' + 0
               this.hours = '0' + 0
            }
         },
         startToend(list){
            return moment(list.startTime).format('hh : mm : A') + ' - ' + moment(list.endTime).format('hh : mm : A')
         },
         duration(list){
            var startTime = new Date(list.startTime).getTime(),
               endTime = new Date(list.endTime).getTime(),
               diff = endTime - startTime;
               
            var hours = diff / 3600000,
               h  = Math.abs(Math.round(hours)),
               exH = hours - h;

            var min = exH * 60,
               m = Math.abs(Math.round(min)),
               exM = min - m;
               
            var s = Math.abs(Math.round(exM * 60)).toString().slice(0,2);
            function duration(){
               if(h < 10){
                  h = '0' + h
               }
               if(m < 10){
                  m = '0' + m
               }
               if(s < 10){
                  s = '0' + s
               }
               return h + ':' + m + ':' + s
            }

            return duration()
         },
         removeTracking(){
            this.startTrackTime = false
            this.secs = '0'+0
         },
         removeSingleTrack(list){
            this.$http.delete('http://localhost:3000/posts/' + list.id)
            .then((response) => {
               var index = this.trackingList.indexOf(list);
               this.trackingList.splice(index,1)
            })
            .catch()
         }
      },
      mounted(){
         setInterval(this.runningTime,1000)
         this.$http.get('http://localhost:3000/posts')
         .then((response)=>{
            this.trackingList = response.body
         })
         .catch()
      }
   };
</script>

<style>
   .timeForm{
      margin-top: 30px;
      padding: 10px 10px;
      background: #eee;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      display: flex;
   }
   
   .timeForm .runningTime{
      display: inline-block;
      background: #fff;
      padding: 7px 0;
      text-align: center;
      width: 120px;
      height: 38px;
      font-weight: bold;
   }
   .timeForm input{
      border-color: transparent;
      margin-right: 10px;
      height: 38px;
      width: 100%;
   }
   .timeForm button{
      display: inline-block;
      height: 38px;
      width: 80px;
      cursor: pointer;
      color: #fff;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      margin-left: 10px;
   }
   .timeForm img{
      height: 38px;
      opacity: .6;
      cursor: pointer;
   }
   .timeForm img:hover{
      opacity: 1;
   }
   button.count-start{
      background: #4BC800;
   }
   button.count-end{
      background: #E20505;
   }

   .table thead th{
      border-top: none !important;
   }
   .table .task-name{
      width: 55%;
   }
   .single-track-row{
      position: relative;
   }
   .single-track-row:hover .dropdown-btn{
      opacity: 1;
   }
   .dropdown-btn:focus,
   .dropdown-btn[aria-expanded="true"]{
      outline: none;
      box-shadow: none;
      opacity: 1;
   }
   .dropdown-menu{
      padding: 0;
   }
   .dropdown-menu li{
      cursor: pointer;
      transition: all .3s;
      padding: 5px;
   }
   .dropdown-menu li:hover{
      background: #f8f8f8;
   }
   .dropdown-btn{
      padding: 3px 6px;
      background: transparent;
      border: none;
      opacity: 0;
      transition: all .3s;
   }
   .icon{
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #888;
      position: relative;
      vertical-align: middle;
      margin-bottom: 5px;
   }
   .icon:after, .icon:before{
      content: '';
      position: absolute;
      display: inline-block;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #888;
   }
   .icon:before{
      top: -8px;
   }
   .icon:after{
      bottom: -8px;
   }
   .option{
      width: 10px;
   }
   .updateTime{
      position: fixed;
      width: 72%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 40px 10px;
      background: #888;
   }
   .updateTime .timeForm{
      position: relative;
      margin: 0;
   }
   .updateTime .cancel{
      position: absolute;
      right: 10px;
      top: 10px;
      color: red;
      background: #fff;
      font-weight: bold;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 1.3;
      border-radius: 4px;
      cursor: pointer;
      transition: all .3s;
   }
   .updateTime .cancel:hover{
      background: red;
      color: #fff
   }
   .vdatetime{
      min-width: 200px;
      margin-right: 10px;
   }
   .vdatetime input{
      padding: 0 12px;
   }
</style>
