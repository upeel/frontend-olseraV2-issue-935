(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-e521"],{"6r34":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("xCek"),s=function(e){return e&&e.__esModule?e:{default:e}}(a("vDqi"));t.default={name:"ReturnOrder",data:function(){return{loading:!1,showTable:!1,dateFilterValue:"",returnOrderData:[],pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows},{value:50,label:"50 "+this.$store.state.userStores.lang.rows},{value:100,label:"100 "+this.$store.state.userStores.lang.rows}],params:{search:null,total:null,currentPage:1,sort_column:"return_no",sort_type:"desc",per_page:20,page:1,store:null,search_column:null,search_text:"",status:null},searchValue:""}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]}},watch:{"$store.getters.selectedStore":function(){this.getReturnOrder()}},methods:{getReturnOrder:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"salesreturn"),params:this.params,headers:t}).then(function(t){e.returnOrderData=t.data.data,e.params.total=t.data.meta.total,e.loading=!1,e.showTable=!0}).catch(function(t){e.loading=!1,e.returnOrderData=[],e.params.total=0})},changePageTable:function(e){this.params.per_page=e,this.getReturnOrder()},handleSearch:function(e){this.params.page=1,this.params.currentPage=1,this.params.per_page=100,this.params.search_text="",this.params.search_column=null,this.params.search=this.searchValue,this.getReturnOrder()},changeSortTable:function(e){"ascending"===e.order&&(e.order="asc"),"descending"===e.order&&(e.order="desc"),console.log(e),this.params.sort_type=e.order,this.params.sort_column=e.prop,this.getReturnOrder()},changeCurrentPage:function(e){this.params.currentPage=e,this.params.page=e,this.getReturnOrder()},rowClick:function(e){this.$router.push({path:"/sales/returnorder/"+e.id})}},mounted:function(){this.getReturnOrder()}}},CwDQ:function(e,t,a){"use strict";a.r(t);var r=a("6r34"),s=a.n(r);for(var n in r)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return r[e]})}(n);t.default=s.a},cdvk:function(e,t,a){"use strict";a.d(t,"a",function(){return r}),a.d(t,"b",function(){return s});var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("h4",[e._v(e._s(e.lang.return_orders))]),e._v(" "),e.showTable?a("p",[e._v(e._s(e.params.total)+" "+e._s(e.lang.orders))]):a("p",[e._v("0 "+e._s(e.lang.orders))])]),e._v(" "),a("div",[a("router-link",{attrs:{to:{name:"Return Order Create"}}},[a("button-action-authenticated",{attrs:{permission:["sales/salesreturns","store"],type:"primary",icon:"el-icon-plus"}},[e._v("\n            "+e._s(e.lang.add)+"\n          ")])],1)],1)]),e._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticClass:"table-handler-flex mb-16"},[a("div",{staticClass:"mb-4",staticStyle:{"flex-grow":"1"}},[a("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:e.lang.please_select,size:"small"},on:{change:e.changePageTable},model:{value:e.params.per_page,callback:function(t){e.$set(e.params,"per_page",t)},expression:"params.per_page"}},e._l(e.pages,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("div",{staticClass:"mb-4"},[a("el-input",{staticClass:"inline-form input-search",attrs:{clearable:"",placeholder:e.lang.search+" "+e.lang.orders,"prefix-icon":"el-icon-search",size:"small"},on:{change:e.handleSearch},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}})],1)]),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"sales-table-max-height mobile-fix-height-unset",attrs:{data:e.returnOrderData,stripe:"",border:""},on:{"sort-change":e.changeSortTable,"row-click":e.rowClick}},[a("el-table-column",{attrs:{label:e.lang.order_no,sortable:"",prop:"return_no","min-width":"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",[a("router-link",{attrs:{to:{path:"/sales/returnorder/"+t.row.id}}},[e._v("\n                "+e._s(t.row.return_no)+"\n              ")])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.date,sortable:"",prop:"freturn_date","min-width":"110"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.freturn_date?a("div",[a("p",[e._v(e._s(t.row.freturn_date))])]):a("div",[a("p",[e._v("-")])])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.customer,sortable:"",prop:"customer_text","min-width":"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.customer_text?a("div",[a("p",[e._v(e._s(t.row.customer_text))])]):a("div",[a("p",[e._v("-")])])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.amount,sortable:"",prop:"ftotal_amount","min-width":"150"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.status,sortable:"","min-width":"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.status?a("div",["A"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini"}},[e._v(e._s(e.rootLang.has_confirm))])],1):e._e(),e._v(" "),"D"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini",type:"info"}},[e._v(e._s(e.rootLang.draft))])],1):e._e(),e._v(" "),"P"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini",type:"warning"}},[e._v(e._s(e.rootLang.pending))])],1):e._e(),e._v(" "),"R"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini"}},[e._v(e._s(e.lang.received))])],1):e._e(),e._v(" "),"S"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini"}},[e._v(e._s(e.rootLang.being_sent))])],1):e._e(),e._v(" "),"T"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini",type:"success"}},[e._v(e._s(e.lang.delivered))])],1):e._e(),e._v(" "),"X"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini",type:"danger"}},[e._v(e._s(e.lang.cancel))])],1):e._e(),e._v(" "),"Z"===t.row.status?a("div",[a("el-tag",{attrs:{size:"mini",type:"success"}},[e._v(e._s(e.rootLang.complete))])],1):e._e()]):a("div",[a("p",[e._v("-")])])]}}])})],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.params.currentPage,"page-size":e.params.per_page,layout:"prev, pager, next, jumper",total:e.params.total},on:{"size-change":e.changePageTable,"current-change":e.changeCurrentPage,"update:currentPage":function(t){return e.$set(e.params,"currentPage",t)},"update:current-page":function(t){return e.$set(e.params,"currentPage",t)}}})],1)],1)])],1)},s=[]},"ekO+":function(e,t,a){"use strict";a.r(t);var r=a("cdvk"),s=a("CwDQ");for(var n in s)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return s[e]})}(n);var l=a("KHd+"),o=Object(l.a)(s.default,r.a,r.b,!1,null,null,null);o.options.__file="ReturnOrderList.vue",t.default=o.exports}}]);