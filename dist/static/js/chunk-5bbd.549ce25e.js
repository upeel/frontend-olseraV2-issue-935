(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5bbd"],{"3uLa":function(t,e,i){"use strict";i.r(e);var s=i("dBI3"),a=i.n(s);for(var n in s)["default"].indexOf(n)<0&&function(t){i.d(e,t,function(){return s[t]})}(n);e.default=a.a},DChC:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(i("QbLZ")),a=n(i("Ljqw"));function n(t){return t&&t.__esModule?t:{default:t}}var o={mixins:[i("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return a.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(i){e.includes(i.store_id)||i.is_store_active&&(t.push((0,s.default)({},i)),e.push(i.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=o},PiC5:function(t,e,i){"use strict";i.r(e);var s=i("howS"),a=i("3uLa");for(var n in a)["default"].indexOf(n)<0&&function(t){i.d(e,t,function(){return a[t]})}(n);var o=i("KHd+"),l=Object(o.a)(a.default,s.a,s.b,!1,null,null,null);l.options.__file="working-hours.vue",e.default=l.exports},dBI3:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=l(i("+5/E")),a=l(i("DA24")),n=i("xCek"),o=l(i("vDqi"));function l(t){return t&&t.__esModule?t:{default:t}}var r=i("wd/R");e.default={name:"WorkingHours",components:{FloatingDiv:s.default,DeleteButton:a.default},data:function(){return{closeDate:{start_date:"",end_date:"",notes:""},dialogEdit:!1,dialogAddClose:!1,countTime:[{fstart_time:"08:00",fend_time:"17:00"}],isEdit:!1,dataClose:1,loading:!1,dataWorkingHours:[],tempWorking:[],dataCloseDate:[],editCloseDate:!1,day:[!1,!1,!1,!1,!1,!1,!1],tempDayId:0,tempTable:[]}},computed:{lang:function(){return this.$store.state.userStores.lang},token:function(){return this.$store.state.user.token},selectedStore:function(){return this.$store.getters.selectedStore},langId:function(){return this.$store.state.userStores.langId},bannerOrder:function(){var t=this.$store.state.bannerOnlineOrder.working_hours;if(t)return parseInt(t)},computedRes:function(){return"max-width: "+document.getElementsByClassName("tab-content")[0].offsetWidth+"px; padding-right: unset !important"}},watch:{"$store.getters.selectedStore":function(){1===this.$store.getters.selectedStore.pos_freemium?this.$router.push("/online-order/delivery"):(this.getWorkingHours(),this.getCloseDate())}},mounted:function(){this.getWorkingHours(),this.getCloseDate()},methods:{getWorkingHours:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/workinghours"),headers:e,params:{sort_type:"asc",sort_column:"day_id"}}).then(function(e){t.dataWorkingHours=e.data.data,t.dataWorkingHours.map(function(e,i){if(1===e.enabled?t.day[i]=!0:t.day[i]=!1,e.times.length>0){var s=[];e.times.map(function(t){t.fstart_time=r("08/05/2015 "+t.fstart_time).format(),t.fend_time=r("08/05/2015 "+t.fend_time).format(),s.push({start_time:t.start_time,end_time:t.end_time})}),t.tempWorking.push({day_id:e.day_id,enabled:e.enabled,times:s})}else t.tempWorking.push({day_id:e.day_id,enabled:e.enabled,times:e.times})}),t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loading=!1})},getCloseDate:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/closingdate"),headers:e}).then(function(e){console.log("data",e.data.data),t.dataCloseDate=e.data.data,t.dataClose=1,t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.dataClose=0,t.loading=!1})},updateWorkingHours:function(t){var e=this;this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token};t={workinghours:this.tempWorking};(0,o.default)({method:"PUT",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/workinghours"),headers:i,data:t}).then(function(t){e.getWorkingHours(),e.isEdit=!1,e.loading=!1}).catch(function(t){404!==t.response.data.error.status_code&&e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.loading=!1})},addCloseDate:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/closingdate"),headers:e,data:this.closeDate}).then(function(e){t.closeDate={start_date:"",end_date:"",notes:""},t.dialogAddClose=!1,t.editCloseDate=!1,t.getCloseDate(),t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.dialogAddClose=!1,t.editCloseDate=!1,t.loading=!1})},updateCloseDate:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"PUT",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/closingdate/"+this.closeDate.id),headers:e,data:this.closeDate}).then(function(e){t.closeDate={start_date:"",end_date:"",notes:""},t.dialogAddClose=!1,t.editCloseDate=!1,t.getCloseDate(),t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.dialogAddClose=!1,t.editCloseDate=!1,t.loading=!1})},deleteCloseDate:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"DELETE",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"online/closingdate/"+this.closeDate.id),headers:e,data:this.closeDate}).then(function(e){t.closeDate={start_date:"",end_date:"",notes:""},t.dialogAddClose=!1,t.editCloseDate=!1,t.getCloseDate(),t.loading=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.dialogAddClose=!1,t.editCloseDate=!1,t.loading=!1})},showDialogClose:function(t){0===t?(this.dialogAddClose=!0,this.editCloseDate=!1):(this.closeDate.start_date=t.start_date,this.closeDate.end_date=t.end_date,this.closeDate.notes=t.notes,this.closeDate.id=t.id,this.dialogAddClose=!0,this.editCloseDate=!0)},saveCloseDate:function(){this.editCloseDate?this.updateCloseDate():this.addCloseDate()},handleSelectionChange:function(t,e){t?this.tempWorking.map(function(t){t.day_id===e.day_id&&(t.enabled=1)}):this.tempWorking.map(function(t){t.day_id===e.day_id&&(t.enabled=0)}),this.isEdit=!0},editHours:function(t){this.tempTable=this.dataWorkingHours,this.tempDayId=t.day_id,0!==t.times.length?(this.countTime=t.times,this.countTime.map(function(t){t.fend_time=r(t.fend_time).format(),t.fstart_time=r(t.fstart_time).format()})):this.countTime=[{fend_time:null,fstart_time:null}],this.dialogEdit=!0},addTime:function(){var t=new Date(this.countTime[this.countTime.length-1].fend_time),e=r(t).add(1,"h").toDate(),i=(r(t).add(75,"m").toDate(),r(t).subtract(15,"m").toDate());this.countTime[this.countTime.length-1].break="1 "+this.lang.hour,this.countTime.push({fstart_time:r(e).format(),min_time:r(i).format()})},breakTime:function(t,e){var i=new Date(t),s=new Date(e).getTime()-i.getTime(),a=Math.floor(s/1e3/60/60);s-=1e3*a*60*60;var n=Math.floor(s/1e3/60);return 0!==a?0!==n?this.$lang[this.langId].break+" "+a+" "+this.lang.hour+" "+n+" "+this.$lang[this.langId].minute:this.$lang[this.langId].break+" "+a+" "+this.lang.hour:0!==n?this.$lang[this.langId].break+" "+n+" "+this.$lang[this.langId].minute:this.$lang[this.langId].no_break},handleChangeTime:function(t){var e=this.countTime;this.countTime=[];var i=new Date("08/05/2015 "+e[t-1].fend_time),s=new Date("08/05/2015 "+e[t].fstart_time).getTime()-i.getTime(),a=Math.floor(s/1e3/60/60);s-=1e3*a*60*60;var n=Math.floor(s/1e3/60);e[t-1].break=0!==a?0!==n?a+" "+this.lang.hour+" "+n+" "+this.$lang[this.langId].minute:a+" "+this.lang.hour:n+" "+this.$lang[this.langId].minute,this.countTime=e},handleDelTime:function(t){this.countTime.splice(t+1,1)},handleCancelTime:function(){this.countTime=[{fstart_time:"08:00",fend_time:"17:00"}],this.dialogEdit=!1,this.getWorkingHours()},handleSaveTime:function(){var t=this,e=[];this.countTime.map(function(t){e.push({start_time:r(t.fstart_time).format("HH:mm"),end_time:r(t.fend_time).format("HH:mm")})}),this.countTime=[{fstart_time:"08:00",fend_time:"17:00"}],this.tempWorking.map(function(i){i.day_id===t.tempDayId&&(i.times=e)}),this.updateWorkingHours(),this.dialogEdit=!1},setCancel:function(){this.isEdit=!1},handleCloseDialog:function(){this.dialogAddClose=!1,this.closeDate={}},handleBanner:function(){this.$store.commit("SET_BANNER_ORDER",{id:1,value:0})},getTimeFormat:function(t,e){return r(t).format("HH:mm")+" - "+r(e).format("HH:mm")}}}},howS:function(t,e,i){"use strict";i.d(e,"a",function(){return s}),i.d(e,"b",function(){return a});var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"shippings"},[t.bannerOrder?s("div",{staticClass:"card_banner",staticStyle:{"background-image":"url('/static/img/info-working-hours.svg')"}},[s("div",{staticClass:"text_banner"},[s("span",{staticClass:"title"},[t._v(t._s(t.$lang[t.langId].title_banner_working_hours))]),t._v(" "),s("div",{staticClass:"subtitle"},[t._v(t._s(t.$lang[t.langId].subtitle_banner_working_hours))])]),t._v(" "),s("el-button",{staticClass:"button-close-banner",attrs:{type:"text",icon:"el-icon-close"},on:{click:t.handleBanner}})],1):t._e(),t._v(" "),s("el-card",{staticClass:"box-card"},[s("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{stripe:"",data:t.dataWorkingHours,"show-header":!1}},[s("el-table-column",{attrs:{width:"55"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-checkbox",{on:{change:function(i){return t.handleSelectionChange(t.day[e.$index],e.row)}},model:{value:t.day[e.$index],callback:function(i){t.$set(t.day,e.$index,i)},expression:"day[scope.$index]"}})]}}])}),t._v(" "),s("el-table-column",{attrs:{label:"Day",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.day_name))]}}])}),t._v(" "),s("el-table-column",{attrs:{property:"working_hours",label:"Working Hours",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[0===e.row.enabled?s("div",[t._l(e.row.times,function(e,i){return s("el-tag",{key:i,staticStyle:{color:"#000000","margin-right":"5px"},attrs:{color:"#F5F5F5"}},[t._v(t._s(t.getTimeFormat(e.fstart_time,e.fend_time)))])}),t._v(" "),s("el-button",{attrs:{type:"text",icon:"el-icon-edit",circle:""},on:{click:function(i){return t.editHours(e.row)}}})],2):s("div",[t._l(e.row.times,function(e,i){return s("el-tag",{key:i,staticStyle:{color:"#000000","margin-right":"5px"},attrs:{color:"#E4F8FF"}},[t._v(t._s(t.getTimeFormat(e.fstart_time,e.fend_time)))])}),t._v(" "),s("el-button",{attrs:{type:"text",icon:"el-icon-edit",circle:""},on:{click:function(i){return t.editHours(e.row)}}})],2)]}}])})],1)],1),t._v(" "),s("el-card",{staticClass:"card_close_date box-card"},[s("div",{staticClass:"header"},[s("span",{staticClass:"title"},[t._v(t._s(t.$lang[t.langId].closing_date))]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("el-button",{staticStyle:{background:"#F5F5F5","font-weight":"bold"},on:{click:function(e){return t.showDialogClose(0)}}},[t._v(t._s(t.lang.add))])],1)]),t._v(" "),s("div",{staticStyle:{"text-align":"center"}},[1!==t.dataClose?s("div",[s("img",{staticClass:"image",staticStyle:{"margin-top":"32px"},attrs:{src:i("i53T")}}),t._v(" "),s("div",{staticClass:"no_close"},[t._v(t._s(t.$lang[t.langId].no_closing_date))]),t._v(" "),s("span",{staticStyle:{"font-size":"14px"}},[t._v(t._s(t.$lang[t.langId].no_closing_date_info))])]):s("div",[s("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{stripe:"",data:t.dataCloseDate,"show-header":!1},on:{"selection-change":t.handleSelectionChange}},[s("el-table-column",{attrs:{label:"Day"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("div",{staticClass:"close_date"},[t._v(" "+t._s(e.row.fstart_date)+" - "+t._s(e.row.fend_date))]),t._v(" "),s("span",{staticClass:"close_note"},[t._v(t._s(e.row.notes))])]}}])}),t._v(" "),s("el-table-column",{attrs:{property:"working_hours",label:"Working Hours",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-button",{attrs:{type:"text",icon:"el-icon-edit",circle:""},on:{click:function(i){return t.showDialogClose(e.row)}}})]}}])})],1)],1)])]),t._v(" "),t.isEdit?s("div",{staticClass:"floating_div",style:t.computedRes},[s("floating-div",{on:{confirm:t.updateWorkingHours,cancel:t.setCancel}})],1):t._e(),t._v(" "),s("el-dialog",{attrs:{visible:t.dialogEdit,"show-close":!1,"custom-class":"dialog-card"},on:{"update:visible":function(e){t.dialogEdit=e}}},[s("div",{staticClass:"flex-container",attrs:{slot:"title"},slot:"title"},[s("div",{staticClass:"full-width"},[s("h4",{staticClass:"dialog-title"},[t._v(t._s(t.lang.edit+" "+t.$lang[t.langId].working_hours))])]),t._v(" "),s("div",{staticClass:"full-width text-right"},[s("el-button",{attrs:{type:"info"},on:{click:t.handleCancelTime}},[t._v(t._s(t.lang.cancel))]),t._v(" "),s("el-button",{attrs:{type:"success"},on:{click:t.handleSaveTime}},[t._v(t._s(t.lang.save))])],1)]),t._v(" "),t._l(t.countTime,function(e,i){return s("div",{key:i,staticClass:"working_hours_input"},[s("el-row",{attrs:{gutter:10}},[s("el-col",{attrs:{sm:12}},[s("div",[t._v(t._s(t.lang.start))]),t._v(" "),s("el-time-picker",{staticStyle:{width:"100%"},attrs:{"picker-options":{maxTime:t.countTime[i].fend_time,format:"HH:mm"},placeholder:t.lang.start_time},model:{value:e.fstart_time,callback:function(i){t.$set(e,"fstart_time",i)},expression:"i.fstart_time"}})],1),t._v(" "),s("el-col",{attrs:{sm:12}},0===i?[s("div",[t._v(t._s(t.lang.end))]),t._v(" "),t.countTime.length>1?s("el-time-picker",{staticStyle:{width:"100%"},attrs:{placeholder:t.lang.end_time,"picker-options":{minTime:e.fstart_time,maxTime:t.countTime[i+1].fstart_time,format:"HH:mm"}},model:{value:e.fend_time,callback:function(i){t.$set(e,"fend_time",i)},expression:"i.fend_time"}}):s("el-time-picker",{staticStyle:{width:"100%"},attrs:{placeholder:t.lang.end_time,"picker-options":{minTime:e.fstart_time,format:"HH:mm"}},model:{value:e.fend_time,callback:function(i){t.$set(e,"fend_time",i)},expression:"i.fend_time"}})]:[s("div",[t._v(t._s(t.lang.end))]),t._v(" "),t.countTime.length>i+1?s("el-time-picker",{staticStyle:{width:"100%"},attrs:{placeholder:t.lang.end_time,"picker-options":{minTime:e.fstart_time,maxTime:t.countTime[i+1].fstart_time,format:"HH:mm"}},model:{value:e.fend_time,callback:function(i){t.$set(e,"fend_time",i)},expression:"i.fend_time"}}):s("el-time-picker",{staticStyle:{width:"100%"},attrs:{placeholder:t.lang.end_time,"picker-options":{minTime:e.fstart_time,format:"HH:mm"}},model:{value:e.fend_time,callback:function(i){t.$set(e,"fend_time",i)},expression:"i.fend_time"}})],1)],1),t._v(" "),t.countTime.length>1&&i!==t.countTime.length-1?s("div",[s("el-tag",{staticClass:"tag_break",attrs:{color:"#F5F5F5"}},[t.breakTime(t.countTime[i].fend_time,t.countTime[i+1].fstart_time)!=="0 "+t.$lang[t.langId].minute?s("svg-icon",{attrs:{"icon-class":"break"}}):t._e(),t._v("\n          "+t._s(t.breakTime(t.countTime[i].fend_time,t.countTime[i+1].fstart_time))+"\n\n          "),s("el-button",{staticStyle:{color:"#000000"},attrs:{type:"text"},on:{click:function(e){return t.handleDelTime(i)}}},[t._v("X")])],1)],1):t._e()],1)}),t._v(" "),t.countTime.length<5&&"23:45"!==t.countTime[t.countTime.length-1].fend_time?s("el-button",{staticClass:"btn_add_break",on:{click:t.addTime}},[t._v(t._s(t.lang.add)+" "+t._s(t.$lang[t.langId].working_time))]):t._e()],2),t._v(" "),s("el-dialog",{attrs:{visible:t.dialogAddClose,"show-close":!1,"custom-class":"dialog-card"},on:{"update:visible":function(e){t.dialogAddClose=e}}},[s("div",{staticClass:"flex-container",attrs:{slot:"title"},slot:"title"},[s("h4",{staticClass:"dialog-title"},[t._v(t._s(t.lang.edit+" "+t.$lang[t.langId].close_date))]),t._v(" "),s("div",{staticClass:"btn_save_dialog"},[s("el-button",{attrs:{type:"info"},on:{click:t.handleCloseDialog}},[t._v(t._s(t.lang.cancel))]),t._v(" "),s("el-button",{attrs:{type:"success"},on:{click:t.saveCloseDate}},[t._v(t._s(t.lang.save))])],1)]),t._v(" "),s("el-row",{attrs:{gutter:10}},[s("el-col",{attrs:{md:12}},[s("div",[t._v(t._s(t.lang.start))]),t._v(" "),s("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd",type:"date"},model:{value:t.closeDate.start_date,callback:function(e){t.$set(t.closeDate,"start_date",e)},expression:"closeDate.start_date"}})],1),t._v(" "),s("el-col",{attrs:{md:12}},[s("div",[t._v(t._s(t.lang.end))]),t._v(" "),s("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd",type:"date"},model:{value:t.closeDate.end_date,callback:function(e){t.$set(t.closeDate,"end_date",e)},expression:"closeDate.end_date"}})],1)],1),t._v(" "),s("div",{staticStyle:{"margin-top":"16px"}},[t._v(t._s(t.lang.notes))]),t._v(" "),s("el-input",{attrs:{placeholder:"Please input"},model:{value:t.closeDate.notes,callback:function(e){t.$set(t.closeDate,"notes",e)},expression:"closeDate.notes"}}),t._v(" "),t.closeDate.id?s("div",[s("delete-button",{on:{confirm:t.deleteCloseDate}})],1):t._e()],1)],1)},a=[]},i53T:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzYxLjAzIiBoZWlnaHQ9IjIyNy41IiB2aWV3Qm94PSIwIDAgMzYxLjAzIDIyNy41Ij48ZGVmcz48c3R5bGU+LmEsLmZ7c3Ryb2tlOnJnYmEoMCwwLDAsMCk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fS5he2ZpbGw6dXJsKCNhKTt9LmJ7b3BhY2l0eTowO30uY3tmaWxsOnVybCgjYik7fS5ke2ZpbGw6dXJsKCNjKTt9LmV7ZmlsbDojNmZjZmVlO30uZntmaWxsOnVybCgjZik7fS5ne2ZpbGw6I2ZmZjt9Lmh7ZmlsbDp1cmwoI2spO30uaXtmaWxsOiMzMjNlMmE7fS5qe2ZpbGw6I2VhZWFlYTt9Lmt7ZmlsdGVyOnVybCgjbCk7fS5se2ZpbHRlcjp1cmwoI2kpO30ubXtmaWx0ZXI6dXJsKCNnKTt9Lm57ZmlsdGVyOnVybCgjZCk7fTwvc3R5bGU+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMC41IiB5MT0iLTAuMzM0IiB4Mj0iMC41IiB5Mj0iMSIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZmY2ZlZSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMC40NjQiIHkxPSIwLjIyMyIgeDI9IjAuNTg5IiB5Mj0iMC42MTIiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjAuNzE4IiBzdG9wLWNvbG9yPSIjZjZmNmY2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjJmM2YzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjFmMmYyIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwLjM5OSIgeTE9IjAuNDY4IiB4Mj0iMC41MzEiIHkyPSIwLjg2MyIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMC41NzMiIHN0b3AtY29sb3I9IiNlOGY2ZmIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkZGYyZmEiLz48L2xpbmVhckdyYWRpZW50PjxmaWx0ZXIgaWQ9ImQiIHg9IjIwLjUzIiB5PSI2My41IiB3aWR0aD0iMTM0LjcyIiBoZWlnaHQ9IjExNi43NzEiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlT2Zmc2V0IGR4PSIzIiBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgcmVzdWx0PSJlIi8+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4wMiIvPjxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iZSIvPjxmZUNvbXBvc2l0ZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0iZiIgeDE9IjAuNjA0IiB5MT0iMC4zMDEiIHgyPSIwLjg3IiB5Mj0iMC41NDYiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L2xpbmVhckdyYWRpZW50PjxmaWx0ZXIgaWQ9ImciIHg9IjE3NS42NDgiIHk9Ijc1Ljg4NCIgd2lkdGg9IjEzNi42NjkiIGhlaWdodD0iMTQwLjE0IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZU9mZnNldCBkeD0iLTMiIGR5PSIzIiBpbnB1dD0iU291cmNlQWxwaGEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzIiByZXN1bHQ9ImgiLz48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwLjAyIi8+PGZlQ29tcG9zaXRlIG9wZXJhdG9yPSJpbiIgaW4yPSJoIi8+PGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iaSIgeD0iNzIuNTMiIHk9IjM5LjUiIHdpZHRoPSIxODgiIGhlaWdodD0iMTg4IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZU9mZnNldCBkeD0iLTMiIGR5PSIzIiBpbnB1dD0iU291cmNlQWxwaGEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzIiByZXN1bHQ9ImoiLz48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwLjAyIi8+PGZlQ29tcG9zaXRlIG9wZXJhdG9yPSJpbiIgaW4yPSJqIi8+PGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+PC9maWx0ZXI+PGxpbmVhckdyYWRpZW50IGlkPSJrIiB4MT0iMS41OCIgeTE9IjAuMTAyIiB4Mj0iMi4xNTYiIHkyPSIxLjAxNCIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZkZmVmZSIvPjxzdG9wIG9mZnNldD0iMC41NzciIHN0b3AtY29sb3I9IiNmOWZhZmEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMWYyZjIiLz48L2xpbmVhckdyYWRpZW50PjxmaWx0ZXIgaWQ9ImwiIHg9IjIyNS4xNDIiIHk9IjUwLjM3OSIgd2lkdGg9IjEwOC44NDIiIGhlaWdodD0iMTA0LjEzNiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVPZmZzZXQgZHg9Ii0zIiBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgcmVzdWx0PSJtIi8+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4wMiIvPjxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0ibSIvPjxmZUNvbXBvc2l0ZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmlsdGVyPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTI3LjMyMSAtOTYuNTI3KSI+PHBhdGggY2xhc3M9ImEiIGQ9Ik0zLjY2NCwxMzkuNjg5Qy00LjI3Niw5Ni4wNC40OTQsNDguMzY5LDE5LjksMTEuMTA3YzU5Ljk4My0xMTUuMTksMjUxLjY3OS0xMTUuMjU5LDMxNi4xODgsMEMzNTEuNjc5LDM4Ljk2OSwzNTkuOTI4LDczLjcyMiwzNjAsMTA4LjM4NHYuOTIxYTIxMy43NjQsMjEzLjc2NCwwLDAsMS0yLjIxMiwzMC4zODRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjcuODUxIDE3Mi4zMzgpIi8+PGcgY2xhc3M9ImIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3My43NjkgMTYwLjYwNCkiPjxwYXRoIGNsYXNzPSJjIiBkPSJNNDQxLjgyMywzODkuNDIzYzEwLjcxMy0xNy45ODUsMTUuMjE0LTM5LjU2MiwxNC4wNjItNjAuODE1LTc1LjQ0My01MC4zNTItMjIyLjY2Ni00Mi43NjEtMjcyLjcwNSwyMi42ODYtLjA1NC4wNy0uMS4xNDItLjE1OC4yMTJBMTEzLjgzNywxMTMuODM3LDAsMCwwLDIwMS41LDM5Ni4xNTRDMjUzLjIzMiw0NjkuMjYzLDM5Ny44LDQ2My4zNCw0NDEuODIzLDM4OS40MjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTgzLjAyMyAtMjk1Ljc4NCkiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4yNjggOSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OC41ODMgMTczLjQ0OCkgcm90YXRlKC05KSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSI+PGcgY2xhc3M9Im4iIHRyYW5zZm9ybT0ibWF0cml4KDAuOTksIDAuMTYsIC0wLjE2LCAwLjk5LCAtMTIuNzYsIC04OS4wMSkiPjxwYXRoIGNsYXNzPSJkIiBkPSJNMTA0LjU4OSw3Ni45MjNDMTA0LjgwOCw3NS4wMzMsMTA4LjcsMzYuOSw4NS44LDE0LDY1LjgyOC01Ljk3MywzNS41NDMtNC4yOTMsMTYuOCwxNy4yMjksMi42NDQsMzMuNDgzLTMuMDQ1LDU4Ljg5MSwxLjU3NCw4My4zNzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi41MyA4NS45Mikgcm90YXRlKC05KSIvPjwvZz48L2c+PHBhdGggY2xhc3M9ImUiIGQ9Ik0zOC40ODUsMjcuNTc1LDEuOTM2LDI5LjMyOFMtMi45LDE4LjMyMiwyLjcxOSw5LjA4M0M3Ljc0OS44MTcsMTYuODI1LjIzMSwxOS4yMDguMDc3LDIxLjU3NS0uMDc2LDMwLjQ3LS42NSwzNi4yLDYuNTQ3LDQxLjEsMTIuNjkxLDM4LjQ4NSwyNy41NzUsMzguNDg1LDI3LjU3NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyLjg5NCA1Mi4wNikiLz48L2c+PGcgY2xhc3M9Im0iIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDEyMi4wNSwgODcuNTMpIj48cGF0aCBjbGFzcz0iZiIgZD0iTTUyMC4yNCwzOTguNDY5YzExLjIxNy02LDM2LjYzOC04LjQ3NSw1MC44NzEsMS4wODEsMjUuMTYxLDE2Ljg5MywxOS41LDU4LjE4MywxMi44MDgsNzYuMzQtNC4yMTYsMTEuNDM3LTEwLjUsNDQuNzYtMzguNDczLDM3LjM0OHMtNjIuMzYxLTM4LjYtNzMuNDA2LTY2Ljk5NEM0NzUuOTY5LDQ0MC4xMzYsNTA1LjI4LDQwNi40NzIsNTIwLjI0LDM5OC40NjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjgzLjgzIC0zMTAuNzgpIi8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNi41ODMgMTMzLjAyNykiPjxnIGNsYXNzPSJsIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtODQuNTMsIC00NS41KSI+PGNpcmNsZSBjbGFzcz0iZyIgY3g9Ijg1IiBjeT0iODUiIHI9Ijg1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4NC41MyA0NS41KSIvPjwvZz48cGF0aCBjbGFzcz0iZSIgZD0iTTc3LjAxLDI4LjI2MUgyLjEyQTIuMTI2LDIuMTI2LDAsMCwxLDAsMjYuMTQxVjE5Ljc4M0E4LjQ4LDguNDgsMCwwLDEsOC40NzgsMTEuM2g4LjQ3OFYyLjEyQTIuMTI2LDIuMTI2LDAsMCwxLDE5LjA3NiwwaDcuMDY1YTIuMTI2LDIuMTI2LDAsMCwxLDIuMTIsMi4xMlYxMS4zSDUwLjg2OVYyLjEyQTIuMTI2LDIuMTI2LDAsMCwxLDUyLjk4OSwwaDcuMDY1YTIuMTI2LDIuMTI2LDAsMCwxLDIuMTIsMi4xMlYxMS4zaDguNDc4YTguNDgsOC40OCwwLDAsMSw4LjQ3OCw4LjQ3OHY2LjM1OUEyLjEyNiwyLjEyNiwwLDAsMSw3Ny4wMSwyOC4yNjFaTTIuMTIsMzMuOTEzSDc3LjAxYTIuMTI2LDIuMTI2LDAsMCwxLDIuMTIsMi4xMlY4MS45NTZhOC40OCw4LjQ4LDAsMCwxLTguNDc4LDguNDc4SDguNDc4QTguNDgsOC40OCwwLDAsMSwwLDgxLjk1NlYzNi4wMzJBMi4xMjYsMi4xMjYsMCwwLDEsMi4xMiwzMy45MTNaTTQ3LjU2Niw2Mi4xNzRsOC41LTguNWEyLjEyMSwyLjEyMSwwLDAsMCwwLTNsLTUtNWEyLjEyMSwyLjEyMSwwLDAsMC0zLDBsLTguNSw4LjUtOC41LTguNWEyLjEyMSwyLjEyMSwwLDAsMC0zLDBsLTUsNWEyLjEyMSwyLjEyMSwwLDAsMCwwLDNsOC41LDguNS04LjUsOC41YTIuMTIxLDIuMTIxLDAsMCwwLDAsM2w1LDVhMi4xMjEsMi4xMjEsMCwwLDAsMywwbDguNS04LjUsOC41LDguNWEyLjEyMSwyLjEyMSwwLDAsMCwzLDBsNS01YTIuMTIxLDIuMTIxLDAsMCwwLDAtM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1IDQwKSIvPjwvZz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjk5NiwgMC4wODcsIC0wLjA4NywgMC45OTYsIDM2Ni4wODcsIDE0My45MDYpIj48ZyBjbGFzcz0iayIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgLTAuMDksIDAuMDksIDEsIC0yNDguMDIsIC0zNC45KSI+PHBhdGggY2xhc3M9ImgiIGQ9Ik01OTEuNzIyLDM2Ny40MjRzLTIuMSwxNC4wNjEtLjIyMSwyNC43NTMsNi4wMzksMjkuMDQxLDIxLjQ2MSwzMy40MTMsMjguNzA2LTYuNzQ2LDM3LjI2My0xNC43NjcsMTQuODg3LTIxLjg3MiwxNC44ODctMjEuODcyLDExLjk2My03LjUsOS41NTktMTUuNTcxLTE2LjgxMi00LjkzMS0xNi44MTItNC45MzEtNC42Mi0xMS45NzUtMjIuMS0xNi4zODUtMjUuOSwyLjMtMjUuOSwyLjMtMTAuNTE2LTkuNjQxLTE1Ljg1Mi02LjA5MlM1OTEuNzIyLDM2Ny40MjQsNTkxLjcyMiwzNjcuNDI0WiIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMC4wOSwgLTAuMDksIDEsIC0zMTQuMTUsIC0zNDEuMjcpIi8+PC9nPjxwYXRoIGNsYXNzPSJpIiBkPSJNNjQ0Ljk4OCw0NDYuOWMtLjQ3NiwxLjYyMy43NzUsOC40MDYsNC41NzQsOS41MnM5LjExOS00LjEzMiw5LjEwOC01LjkyNS0xLjExLTQuNDIzLTUuNTY1LTUuNzNTNjQ1LjQ2NCw0NDUuMjgxLDY0NC45ODgsNDQ2LjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjIzLjE4OCAtMzk0Ljg4NCkiLz48cGF0aCBjbGFzcz0iaSIgZD0iTTE1LjEsMy42M2MtLjY2OS45MjktMi43OSwyLjgyNS04LjU1NSwyLjIxM1MtLjQ4OC45MjguMTQ5LjA0NGMuMjg4LS40LDIuMjMzLDIuMDYxLDYuNiwzUzE1LjQ3LDMuMTIxLDE1LjEsMy42M1oiIHRyYW5zZm9ybT0ibWF0cml4KDAuOTk4LCAtMC4wNywgMC4wNywgMC45OTgsIDE4LjY5OSwgNjQuODkpIi8+PHBhdGggY2xhc3M9ImkiIGQ9Ik0yLjkxNSwwQTIuOTE1LDIuOTE1LDAsMSwxLDAsMi45MTUsMi45MTUsMi45MTUsMCwwLDEsMi45MTUsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLjAzMiAyNi4yNjkpIi8+PHBhdGggY2xhc3M9ImkiIGQ9Ik02OTguNDQ0LDQyNy4wNzRhMi45NzcsMi45NzcsMCwxLDEtMi4wMTgtMy42OTRBMi45NzcsMi45NzcsMCwwLDEsNjk4LjQ0NCw0MjcuMDc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY0Ni45MTkgLTM4OS4yNzgpIi8+PHBhdGggY2xhc3M9ImoiIGQ9Ik02MDQuMTY0LDM1OC45MzFjLTEuNzEyLDEuMTIzLTEuMzUyLDYuOTg1LDEuNTY5LDcuOTM3LDIuMDM4LjY2NSw0Ljk2Ni0xLjE3Niw1LjIyMy0zLjE2MUM2MTEuMzMxLDM2MC44LDYwNS45NCwzNTcuNzY1LDYwNC4xNjQsMzU4LjkzMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01OTcuNTY4IC0zNTMuNjU3KSIvPjxwYXRoIGNsYXNzPSJqIiBkPSJNNzU0LjgzNSw0MDcuMDA1Yy44MzQsMS44Ny0yLjYzNSw2LjYwOC01LjYwOCw1LjgzMi0yLjA3NC0uNTQxLTMuNTQ0LTMuNjcyLTIuNjg3LTUuNDgxQzc0Ny43OTUsNDA0LjcsNzUzLjk2OSw0MDUuMDY0LDc1NC44MzUsNDA3LjAwNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NzYuNTI4IC0zNzkuNDYpIi8+PC9nPjwvZz48L2c+PC9zdmc+"}}]);