(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1cc5"],{"9d1h":function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return r});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"main-content",attrs:{shadow:"never"}},[a("div",{staticClass:"table-handler-flex"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("h4",{staticClass:"main-content__title"},[e._v(e._s(e.$lang[e.langId].list)+" "+e._s(e.lang.featured_product))]),e._v(" "),a("p",{staticClass:"main-content__subtitle"},[e._v(e._s(e.params.total)+" "+e._s(e.lang.featured_product))])]),e._v(" "),e.checkCustomPermission("catalog/featured","store")?a("div",[a("el-button",{attrs:{type:"primary",icon:"el-icon-plus",disabled:e.disabledButton},on:{click:e.dialogAddData}},[e._v("\n          "+e._s(e.lang.add)+"\n        ")])],1):e._e()]),e._v(" "),a("div",[a("div",{staticClass:"table-handler-flex"},[a("div",{staticClass:"mb-4",staticStyle:{"flex-grow":"1"}},[a("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:e.lang.please_select,size:"small"},on:{change:e.changePageTable},model:{value:e.params.per_page,callback:function(t){e.$set(e.params,"per_page",t)},expression:"params.per_page"}},e._l(e.pages,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("div",{staticClass:"mb-4"},[a("el-input",{staticClass:"inline-form input-search",attrs:{clearable:"",placeholder:e.lang.search_products,"prefix-icon":"el-icon-search",size:"small"},on:{change:e.handleSearch},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}})],1)]),e._v(" "),a("el-divider"),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.tableData,stripe:""},on:{"sort-change":e.changeSortTable}},[a("el-table-column",{attrs:{label:e.lang.name,"max-width":"200",sortable:"",prop:"name"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"flex-container"},[t.row.photo_xs?a("el-image",{staticStyle:{width:"50px",height:"50px","border-radius":"50%","margin-right":"8px"},attrs:{src:t.row.photo_xs,fit:"cover"}}):e._e(),e._v(" "),a("strong",[e._v(e._s(t.row.name))])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.sku,prop:"sku",sortable:"",width:"160"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.group,prop:"product_group_name",sortable:"",width:"160"}}),e._v(" "),e.checkCustomPermission("catalog/featured","destroy")?a("el-table-column",{attrs:{label:e.$lang[e.langId].action},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticClass:"btn-plain",attrs:{disabled:e.disabledButton,type:"danger",icon:"el-icon-delete"},on:{click:function(a){return e.removeItem(t.row.id)}}})]}}],null,!1,540752108)}):e._e()],1),e._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("el-pagination",{attrs:{"current-page":e.params.currentPage,"page-size":e.params.per_page,total:e.params.total,layout:"prev, pager, next, jumper"},on:{"update:currentPage":function(t){return e.$set(e.params,"currentPage",t)},"update:current-page":function(t){return e.$set(e.params,"currentPage",t)},"size-change":e.changePageTable,"current-change":e.changeCurrentPage}})],1)],1)]),e._v(" "),a("el-dialog",{attrs:{title:e.lang.add,visible:e.visibleDialogAddData,"close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(t){e.visibleDialogAddData=t}}},[a("el-form",{attrs:{model:e.form}},[a("el-form-item",{attrs:{"label-width":"180px",label:e.lang.product}},[a("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:e.lang.info_auto_complete_product,"remote-method":e.searchProducts,loading:e.searchingProducts,filterable:"",multiple:"",remote:"","reserve-keyword":""},on:{change:e.inputProduct},model:{value:e.form.ids,callback:function(t){e.$set(e.form,"ids",t)},expression:"form.ids"}},e._l(e.searchResultProducts,function(e){return a("el-option",{key:e.product_id,attrs:{label:e.name,value:e.product_id}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{"label-width":"140px"}},[a("el-button",{attrs:{disabled:e.disabledButton,type:"info",icon:"el-icon-close"},on:{click:e.resetState}},[e._v("\n          "+e._s(e.lang.cancel)+"\n        ")]),e._v(" "),a("el-button",{attrs:{disabled:e.disabledButtonAdd,type:"success",icon:"el-icon-check"},on:{click:e.addData}},[e._v("\n          "+e._s(e.lang.save)+"\n        ")])],1)],1)],1)],1)},r=[]},NDLM:function(e,t,a){"use strict";a.r(t);var s=a("jczG"),r=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return s[e]})}(n);t.default=r.a},jczG:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(a("m1cH")),r=i(a("QbLZ")),n=a("xCek"),o=i(a("vDqi")),l=a("6y4V");function i(e){return e&&e.__esModule?e:{default:e}}t.default={mixins:[l.checkCustomPermission],data:function(){return{loading:!0,tableData:[],statusValue:null,searchValue:null,pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows}],params:{search:null,per_page:5,sort_column:"published_date",sort_type:"desc"},disabledButton:!1,disabledButtonAdd:!0,visibleDialogAddData:!1,form:{},searchResultProducts:[],searchingProducts:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()},form:function(e){e.ids&&(this.disabledButton=!1)}},mounted:function(){this.getData()},methods:{getData:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"product-unggulan"),params:this.params,headers:t}).then(function(t){e.tableData=t.data.data,e.params.total=t.data.meta.total,e.loading=!1}).catch(function(t){e.loading=!1,e.tableData=[],e.params.total=0,404!==t.response.data.error.status_code&&e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},changePageTable:function(e){this.params.page=1,this.params.currentPage=1,this.params.per_page=e,this.getData()},handleSearch:function(e){this.params.page=1,this.params.currentPage=1,this.params.search_text="",this.params.search_column=null,this.params.search=this.searchValue,this.getData()},changeSortTable:function(e){"ascending"===e.order&&(e.order="asc"),"descending"===e.order&&(e.order="desc"),console.log(e),this.params.sort_type=e.order,this.params.sort_column=e.prop,this.getData()},changeCurrentPage:function(e){this.params.currentPage=e,this.params.page=e,this.getData()},searchProducts:function(e){var t=this;this.searchingProducts=!0;var a={Authorization:"Bearer "+this.token.access_token},s={search_column:"name",search_text:e,sort_column:"name",sort_type:"desc"};e.length>0?(0,o.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"productsearch"),headers:a,params:s}).then(function(e){t.searchingProducts=!1,t.searchResultProducts=e.data.data.map(function(e){return e})}).catch(function(){t.searchingProducts=!1,t.searchResultProducts=[]}):(this.searchResultProducts=[],this.searchingProducts=!1)},dialogAddData:function(){this.visibleDialogAddData=!0},addData:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token},a=(0,r.default)({},this.form);a.ids=[].concat((0,s.default)(this.form.ids)),a.ids=a.ids.join(","),(0,o.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"product-unggulan/add"),data:a,headers:t}).then(function(){e.visibleDialogAddData=!1,e.disabledButton=!1,e.form={},e.$message({type:"success",message:"Success"}),e.getData(),e.disabledButtonAdd=!0}).catch(function(t){e.loading=!1,e.disabledButton=!1,e.disabledButtonAdd=!0,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},removeItem:function(e){var t=this;this.disabledButton=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"DELETE",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"product-unggulan/destroy/"+e),headers:a}).then(function(e){t.disabledButton=!1,t.params.search=null,t.getData(),t.$message({message:"Success",type:"success"})}).catch(function(e){t.disabledButton=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},resetState:function(){this.visibleDialogAddData=!1,this.form.ids=[],this.searchResultProducts=[]},inputProduct:function(e){e.length>0&&(this.disabledButtonAdd=!1)}}}},o5AA:function(e,t,a){"use strict";a.r(t);var s=a("9d1h"),r=a("NDLM");for(var n in r)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return r[e]})}(n);var o=a("KHd+"),l=Object(o.a)(r.default,s.a,s.b,!1,null,null,null);l.options.__file="Index.vue",t.default=l.exports}}]);