(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-c4b2"],{PZZN:function(t,e,a){"use strict";a.d(e,"a",function(){return r}),a.d(e,"b",function(){return s});var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("h4",[t._v(t._s(t.lang.closed_orders))]),t._v(" "),t.showTable?a("p",[t._v(t._s(t.params.total)+" "+t._s(t.lang.orders))]):a("p",[t._v("0 "+t._s(t.lang.orders))])])]),t._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticClass:"table-handler-flex mb-16"},[a("div",{staticClass:"mb-4",staticStyle:{"flex-grow":"1"}},[a("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:t.lang.please_select,size:"small"},on:{change:t.changePageTable},model:{value:t.params.per_page,callback:function(e){t.$set(t.params,"per_page",e)},expression:"params.per_page"}},t._l(t.pages,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1),t._v(" "),a("div",{staticClass:"mb-4",staticStyle:{"flex-grow":"1"}},[a("date-range-picker",{attrs:{"init-date":t.initParamDate,attendance:!0},on:{picked:t.datePicked}})],1),t._v(" "),a("div",{staticClass:"mb-4"},[t.labelTag?a("el-tag",{attrs:{type:"info",closable:""},on:{close:t.closeTagLabel}},[t._v("\n            "+t._s(t.labelTag)+"\n          ")]):t._e(),t._v(" "),a("el-input",{staticClass:"inline-form input-search",attrs:{placeholder:t.lang.search+" "+t.lang.orders,size:"small","prefix-icon":"el-icon-search",clearable:""},on:{change:t.handleSearch},model:{value:t.searchValue,callback:function(e){t.searchValue=e},expression:"searchValue"}})],1)]),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"sales-table-max-height mobile-fix-height-unset",attrs:{data:t.closeOrderData,stripe:"",border:""},on:{"sort-change":t.changeSortTable,"row-click":t.rowClick}},[a("el-table-column",{attrs:{label:t.lang.order_no,sortable:"",prop:"order_no","min-width":"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[a("router-link",{attrs:{to:{path:"/sales/completeorder/"+e.row.id}}},[t._v("\n                "+t._s(e.row.order_no)+"\n              ")])],1)]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.order_date,sortable:"",prop:"order_date","min-width":"130"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.forder_date?a("div",[a("p",[t._v(t._s(e.row.forder_date))])]):a("div",[a("p",[t._v("-")])])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.customer,sortable:"","min-width":"180",prop:"customer_name"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.customer_text?a("div",[a("p",[t._v(t._s(e.row.customer_text))])]):a("div",[a("p",[t._v("-")])])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.shipping_to,sortable:"","min-width":"170"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.shipping_text?a("div",[a("p",[t._v(t._s(e.row.shipping_text))])]):a("div",[a("p",[t._v("-")])])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.total,sortable:"",prop:"ftotal_amount"}}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.paid,prop:"is_paid",sortable:"",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[0===e.row.is_paid?a("div",[a("el-tag",{attrs:{size:"mini",type:"danger"}},[t._v(t._s(t.lang.not_yet))])],1):t._e(),t._v(" "),1===e.row.is_paid?a("div",[a("el-tag",{attrs:{size:"mini",type:"success"}},[t._v(t._s(t.rootLang.done))])],1):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.last_modified,sortable:"",prop:"modified_time",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.modified_time?a("div",[a("p",[t._v(t._s(e.row.modified_time))])]):a("div",[a("p",[t._v("-")])])]}}])})],1),t._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":t.params.currentPage,"page-size":t.params.per_page,layout:"prev, pager, next, jumper",total:t.params.total},on:{"size-change":t.changePageTable,"current-change":t.changeCurrentPage,"update:currentPage":function(e){return t.$set(t.params,"currentPage",e)},"update:current-page":function(e){return t.$set(t.params,"currentPage",e)}}})],1)],1)]),t._v(" "),a("el-dialog",{staticClass:"complete-order",attrs:{visible:t.filterDialog,title:t.$lang[t.langId].filter,"before-close":t.closeFilter,width:"360px"},on:{"update:visible":function(e){t.filterDialog=e}}},[a("div",{staticClass:"text-center"},[a("ul",{staticClass:"list-unstyled"},[a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("today")}}},[t._v(t._s(t.$lang[t.langId].today))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("yesterday")}}},[t._v(t._s(t.$lang[t.langId].yesterday))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("weekago")}}},[t._v(t._s(t.$lang[t.langId].a_week_ago))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("monthago")}}},[t._v(t._s(t.$lang[t.langId].a_month_ago))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("thismonth")}}},[t._v(t._s(t.$lang[t.langId].this_month))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("lastmonth")}}},[t._v(t._s(t.$lang[t.langId].last_month))])],1),t._v(" "),a("li",{staticStyle:{"border-bottom":"1px solid #eee"}},[a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.filterDate("custom")}}},[t._v(t._s(t.$lang[t.langId].custom))])],1)])]),t._v(" "),a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{span:12}},[a("p",[t._v(t._s(t.lang.from))]),t._v(" "),a("el-date-picker",{staticStyle:{width:"100% !important"},attrs:{disabled:t.disableDate,placeholder:t.$lang[t.langId].pick_a_day,type:"date",format:"dd-MM-yyyy","value-format":"yyyy-MM-dd"},model:{value:t.formFilter.startDate,callback:function(e){t.$set(t.formFilter,"startDate",e)},expression:"formFilter.startDate"}})],1),t._v(" "),a("el-col",{attrs:{span:12}},[a("p",[t._v(t._s(t.$lang[t.langId].to_date))]),t._v(" "),a("el-date-picker",{staticStyle:{width:"100% !important"},attrs:{placeholder:t.$lang[t.langId].pick_a_day,disabled:t.disableDate,type:"date",format:"dd-MM-yyyy","value-format":"yyyy-MM-dd"},model:{value:t.formFilter.endDate,callback:function(e){t.$set(t.formFilter,"endDate",e)},expression:"formFilter.endDate"}})],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"danger"},on:{click:t.resetFilter}},[t._v(t._s(t.lang.reset))]),t._v(" "),t.formFilter.startDate&&t.formFilter.endDate?a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.saveFilter(t.formFilter.labelForDate)}}},[t._v(t._s(t.$lang[t.langId].apply))]):a("el-button",{attrs:{type:"info",disabled:""}},[t._v(t._s(t.$lang[t.langId].apply))])],1)],1)],1)},s=[]},"k+gZ":function(t,e,a){"use strict";a.r(e);var r=a("ozHB"),s=a.n(r);for(var l in r)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return r[t]})}(l);e.default=s.a},kxAc:function(t,e,a){"use strict";a.r(e);var r=a("PZZN"),s=a("k+gZ");for(var l in s)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return s[t]})}(l);var o=a("KHd+"),i=Object(o.a)(s.default,r.a,r.b,!1,null,null,null);i.options.__file="CompleteOrderList.vue",e.default=i.exports},ozHB:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("xCek"),s=i(a("vDqi")),l=i(a("wd/R")),o=i(a("hogc"));function i(t){return t&&t.__esModule?t:{default:t}}e.default={name:"CompleteOrder",components:{dateRangePicker:o.default},data:function(){return{loading:!1,showTable:!1,filterDialog:!1,disableDate:!0,dateFilterValue:"",closeOrderData:[],labelTag:"",pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows},{value:50,label:"50 "+this.$store.state.userStores.lang.rows},{value:100,label:"100 "+this.$store.state.userStores.lang.rows}],params:{start_date:"",end_date:"",search:null,total:null,currentPage:1,sort_column:"order_date",sort_type:"desc",per_page:20,page:1,store:null,search_column:null,search_text:"",status:null},formFilter:{startDate:"",endDate:"",labelForDate:""},searchValue:"",initParamDate:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]}},watch:{"$store.getters.selectedStore":function(t){this.getCloseOrder()}},methods:{getDate:function(){this.params.end_date=(0,l.default)().format("YYYY-MM-DD"),this.params.start_date=(0,l.default)().subtract(6,"d").format("YYYY-MM-DD"),this.initParamDate=[this.params.start_date,this.params.end_date]},getCloseOrder:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"closeorder"),params:this.params,headers:e}).then(function(e){t.closeOrderData=e.data.data,t.params.total=e.data.meta.total,t.loading=!1,t.showTable=!0}).catch(function(){t.showTable=!1,t.closeOrderData=[],t.params.total=0,t.loading=!1})},changePageTable:function(t){this.params.per_page=t,this.getCloseOrder()},handleSearch:function(t){this.params.page=1,this.params.currentPage=1,this.params.search_text="",this.params.per_page=100,this.params.search_column=null,this.params.search=this.searchValue,this.getCloseOrder()},changeSortTable:function(t){"ascending"===t.order&&(t.order="asc"),"descending"===t.order&&(t.order="desc"),console.log(t),this.params.sort_type=t.order,this.params.sort_column=t.prop,this.getCloseOrder()},changeCurrentPage:function(t){this.params.currentPage=t,this.params.page=t,this.getCloseOrder()},showFilter:function(){this.formFilter.startDate="",this.formFilter.endDate="",this.formFilter.labelForDate=this.labelTag,this.filterDialog=!0},filterDate:function(t){"today"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().format("YYYY-MM-DD"),this.formFilter.labelForDate="today"):"yesterday"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().subtract(1,"d").format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().subtract(1,"d").format("YYYY-MM-DD"),this.formFilter.labelForDate="yesterday"):"weekago"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().subtract(7,"d").format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().format("YYYY-MM-DD"),this.formFilter.labelForDate="weekago"):"monthago"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().subtract(30,"d").format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().format("YYYY-MM-DD"),this.formFilter.labelForDate="monthago"):"thismonth"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().startOf("month").format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().format("YYYY-MM-DD"),this.formFilter.labelForDate="thismonth"):"lastmonth"===t?(this.disableDate=!0,this.formFilter.startDate=(0,l.default)().subtract(1,"month").startOf("month").format("YYYY-MM-DD"),this.formFilter.endDate=(0,l.default)().subtract(1,"month").endOf("month").format("YYYY-MM-DD"),this.formFilter.labelForDate="lastmonth"):"custom"===t&&(this.formFilter.labelForDate="custom",this.formFilter.startDate="",this.formFilter.endDate="",this.disableDate=!1),"custom"!==t&&this.saveFilter(this.formFilter.labelForDate)},closeFilter:function(){this.filterDialog=!1,this.formFilter.startDate="",this.formFilter.endDate="",this.formFilter.labelForDate="",this.disableDate=!0},saveFilter:function(t){this.params.start_date=this.formFilter.startDate,this.params.end_date=this.formFilter.endDate,"today"===t?this.labelTag=this.$lang[this.langId].today:"yesterday"===t?this.labelTag=this.$lang[this.langId].yesterday:"weekago"===t?this.labelTag=this.$lang[this.langId].a_week_ago:"monthago"===t?this.labelTag=this.$lang[this.langId].a_month_ago:"thismonth"===t?this.labelTag=this.$lang[this.langId].this_month:"lastmonth"===t?this.labelTag=this.$lang[this.langId].last_month:"custom"===t&&(this.labelTag=this.$lang[this.langId].custom),this.getCloseOrder(),this.filterDialog=!1,this.disableDate=!0},resetFilter:function(){this.formFilter.startDate="",this.formFilter.endDate="",this.formFilter.labelForDate="",this.disableDate=!0},closeTagLabel:function(){this.labelTag="",this.getDate(),this.getCloseOrder()},rowClick:function(t){this.$router.push({path:"/sales/completeorder/"+t.id})},datePicked:function(t){console.log("picked",t),this.params.page=1,t?(this.params.start_date=t.start_date,this.params.end_date=t.end_date,this.getCloseOrder()):this.getCloseOrder()}},mounted:function(){this.getDate(),this.getCloseOrder()}}}}]);