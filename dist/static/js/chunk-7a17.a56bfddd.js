(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-7a17"],{"7ODy":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n(a("P2sY")),r=a("xCek"),l=n(a("vDqi"));function n(e){return e&&e.__esModule?e:{default:e}}var i=a("wd/R");t.default={props:["saved","loading","formData","roleOptions"],data:function(){return{disabledSave:!0,dialogVisible:!1,data:{},control:{},resellertypes:[]}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{data:{handler:function(e){e.resellerPackage&&""!==e.resellerPackage&&e.url_id&&""!==e.url_id&&e.resellerActiveFrom&&""!==e.resellerActiveFrom&&e.resellerActiveUntil&&""!==e.resellerActiveUntil?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(e){!0===e&&(this.data={},this.disabledSave=!0)},deep:!0},formData:{handler:function(e){this.data=e},deep:!0,immediate:!0}},methods:{searchResellerTypes:function(e){var t=this;this.control.searchingResellerTypes=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"reseller/type"),params:{search:e},headers:a}).then(function(e){t.resellertypes=e.data.data,t.control.searchingResellerTypes=!1}).catch(function(){t.control.searchingResellerTypes=!1,t.resellertypes=[]})},cancel:function(){this.data={},this.$emit("cancel")},save:function(){this.disabledSave=!0;var e=(0,s.default)({},this.data);e.resellerActiveFrom=i(e.resellerActiveFrom).format("DD-MMM-YYYY"),e.resellerActiveUntil=i(e.resellerActiveUntil).format("DD-MMM-YYYY"),this.$emit("save",e)},remove:function(){this.$emit("remove",{id:this.data.id})}}}},"7flW":function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return r});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[a("div",{attrs:{slot:"header"},slot:"header"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:12}},[e.data.reseller_store_id?[e._v("\n            "+e._s(e.lang.edit)+":\n            "),a("h4",[e._v(e._s(e.data.name))])]:[a("h4",[e._v(e._s(e.lang.add_reseller))])]],2),e._v(" "),a("el-col",{staticClass:"text-right",attrs:{md:12}},[a("el-button",{attrs:{size:"small",type:"info"},on:{click:e.cancel}},[e._v("\n            "+e._s(e.lang.cancel)+"\n          ")]),e._v(" "),a("el-button",{attrs:{disabled:e.disabledSave,size:"small",type:"success",icon:"el-icon-check"},on:{click:e.save}},[e._v("\n            "+e._s(e.lang.save)+"\n          ")])],1)],1)],1),e._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{attrs:{"label-width":"140px"},model:{value:e.data,callback:function(t){e.data=t},expression:"data"}},[a("el-form-item",{attrs:{label:this.$lang[e.langId].url_id,required:!0}},[a("el-input",{attrs:{type:"text"},model:{value:e.data.url_id,callback:function(t){e.$set(e.data,"url_id",t)},expression:"data.url_id"}}),e._v(" "),a("p",{staticClass:"input-desc oldgrey size-12"},[e._v("\n            "+e._s(e.lang.url_id)+"\n          ")])],1),e._v(" "),a("el-form-item",{attrs:{label:e.lang.reseller_type,required:!0}},[a("el-select",{attrs:{filterable:"",remote:"",placeholder:this.$lang[e.langId].please_input+e.lang.reseller_type,"reserve-keyword":"",loading:e.control.searchingResellerTypes,"remote-method":e.searchResellerTypes},model:{value:e.data.resellerPackage,callback:function(t){e.$set(e.data,"resellerPackage",t)},expression:"data.resellerPackage"}},e._l(e.resellertypes,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:e.lang.active_date,required:!0}},[a("el-date-picker",{attrs:{type:"date",placeholder:this.$lang[e.langId].pick_a_day},model:{value:e.data.resellerActiveFrom,callback:function(t){e.$set(e.data,"resellerActiveFrom",t)},expression:"data.resellerActiveFrom"}})],1),e._v(" "),a("el-form-item",{attrs:{label:e.lang.end_date,required:!0}},[a("el-date-picker",{attrs:{type:"date",placeholder:this.$lang[e.langId].pick_a_day},model:{value:e.data.resellerActiveUntil,callback:function(t){e.$set(e.data,"resellerActiveUntil",t)},expression:"data.resellerActiveUntil"}})],1)],1)],1)])],1)},r=[]},PBSS:function(e,t,a){"use strict";a.r(t);var s=a("7ODy"),r=a.n(s);for(var l in s)["default"].indexOf(l)<0&&function(e){a.d(t,e,function(){return s[e]})}(l);t.default=r.a},XlUH:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(a("P2sY")),r=a("xCek"),l=i(a("vDqi")),n=i(a("z//K"));function i(e){return e&&e.__esModule?e:{default:e}}t.default={data:function(){return{loading:!0,loadingItems:!1,saved:!1,data:[],isEditing:[],showForm:!1,disabledButton:!1,tmp:{},status:[{id:"A",label:"ACTIVE"},{id:"I",label:"INACTIVE"},{id:"P",label:"PENDING"}],pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows}],params:{search:"",per_page:10}}},components:{GroupForm:n.default},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},disabledSave:function(){return!!this.loading}},watch:{"$store.getters.selectedStore":function(){this.getData()}},methods:{getData:function(){var e=this;this.loading=!0,this.isEditing=[];var t={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"reseller/"),params:this.params,headers:t}).then(function(t){e.data=t.data.data,e.data.map(function(t){e.isEditing.push({editing:!1}),t.resellerPackage=t.type_name,t.resellerActiveFrom=t.active_from,t.resellerActiveUntil=t.active_until}),e.params.total=t.data.meta.total,e.loading=!1}).catch(function(t){e.loading=!1,e.params.total=0,e.$notify({type:"warning",title:"Error",message:t.response.data.error.error})})},add:function(){this.showForm=!0},save:function(e){var t=this,a="POST",s="store",n="";e.reseller_store_id&&(a="PUT",s="update",n=e.reseller_store_id),this.loading=!0;var i={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:a,url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"reseller/"+s+"/"+n),headers:i,data:e}).then(function(e){t.saved=!0,t.showForm=!1,t.tmp={},t.getData(),t.$message({type:"success",message:"saved"})}).catch(function(e){t.saved=!1,t.loading=!1,t.isEditing=[],t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},saveStatus:function(e,t){var a=this;this.loading=!0;var s={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"PUT",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"reseller/updatestatus/"+e.reseller_store_id),headers:s,data:e}).then(function(e){a.cancelManageItems(t),a.getData(),a.$message({type:"success",message:"saved"})}).catch(function(e){a.loading=!1,a.isEditing=[],a.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},changePageTable:function(e){this.params.per_page=e,this.getData()},handleSearch:function(e){this.params.page=1,this.params.currentPage=1,this.params.search_text="",this.params.search_column=null,this.params.search=this.searchValue,this.getData()},changeSortTable:function(e){"ascending"===e.order&&(e.order="asc"),"descending"===e.order&&(e.order="desc"),this.params.sort_type=e.order,this.params.sort_column=e.prop,this.getData()},changeCurrentPage:function(e){this.params.currentPage=e,this.params.page=e,this.getData()},edit:function(e){this.tmp={},this.tmp=(0,s.default)({},e),this.showForm=!0},editField:function(e,t){this.isEditing.map(function(e){e.editing=!1}),this.tmp={},this.tmp=(0,s.default)({},e),"ACTIVE"===this.tmp.status?this.tmp.status="A":"PENDING"===this.tmp.status?this.tmp.status="P":"INACTIVE"===this.tmp.status&&(this.tmp.status="I"),this.isEditing[t].editing=!0},remove:function(e){var t=this;this.loadingItems=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"DELETE",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"reseller/delete/"+e.id),headers:a}).then(function(a){t.data.map(function(a,s){a.id===e.id&&t.data.splice(s,1)}),t.loadingItems=!1,t.$message({type:"success",message:a.data.data.message})}).catch(function(e){t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loadingItems=!1})},cancel:function(){this.tmp={},this.showForm=!1},cancelManageItems:function(e){this.isEditing[e].editing=!1,this.tmp={}}},mounted:function(){this.getData()}}},kZkJ:function(e,t,a){"use strict";a.r(t);var s=a("XlUH"),r=a.n(s);for(var l in s)["default"].indexOf(l)<0&&function(e){a.d(t,e,function(){return s[e]})}(l);t.default=r.a},pCE5:function(e,t,a){"use strict";a.r(t);var s=a("ySZG"),r=a("kZkJ");for(var l in r)["default"].indexOf(l)<0&&function(e){a.d(t,e,function(){return r[e]})}(l);var n=a("KHd+"),i=Object(n.a)(r.default,s.a,s.b,!1,null,null,null);i.options.__file="Index.vue",t.default=i.exports},ySZG:function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return r});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e.showForm?e._e():a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:12}},[a("h4",[e._v(e._s(e.lang.resellers))]),e._v(" "),a("p",[e._v(e._s(e.params.total)+" "+e._s(e.lang.resellers))])]),e._v(" "),a("el-col",{staticClass:"text-right",attrs:{md:12}},[a("el-button",{attrs:{disabled:e.disabledSave,size:"small",type:"success",icon:"el-icon-plus"},on:{click:e.add}},[e._v("\n            "+e._s(e.lang.add)+"\n          ")])],1)],1)],1),e._v(" "),a("div",{staticClass:"card-body"},[a("div",{staticClass:"table-handler"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{md:7}},[a("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:e.lang.please_select,size:"small"},on:{change:e.changePageTable},model:{value:e.params.per_page,callback:function(t){e.$set(e.params,"per_page",t)},expression:"params.per_page"}},e._l(e.pages,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-col",{staticClass:"text-right",attrs:{md:17}},[a("el-input",{staticClass:"inline-form",attrs:{clearable:"",placeholder:e.lang.search,"prefix-icon":"el-icon-search",size:"small"},on:{change:e.handleSearch},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}})],1)],1)],1),e._v(" "),a("el-table",{attrs:{data:e.data,stripe:""}},[a("el-table-column",{attrs:{prop:"name",label:e.lang.name,width:"180"}}),e._v(" "),a("el-table-column",{attrs:{label:this.$lang[e.langId].url_id,prop:"url_id",width:"180"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.type,prop:"type_name",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.status,prop:"status",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.isEditing[t.$index]&&!e.isEditing[t.$index].editing&&"PENDING"!==t.row.status?a("span",{staticClass:"editable",on:{click:function(a){return e.editField(t.row,t.$index)}}},[e._v("\n              "+e._s(t.row.status)+"\n            ")]):a("span",[e._v("\n              "+e._s(t.row.status)+"\n            ")]),e._v(" "),e.isEditing[t.$index]&&e.isEditing[t.$index].editing?a("div",{staticClass:"form-in-cell"},[a("el-select",{attrs:{size:"mini"},model:{value:e.tmp.status,callback:function(t){e.$set(e.tmp,"status",t)},expression:"tmp.status"}},[a("el-option",{attrs:{value:"A",label:"ACTIVE"}}),e._v(" "),a("el-option",{attrs:{value:"I",label:"INACTIVE"}})],1),e._v(" "),a("el-button",{attrs:{size:"mini",icon:"el-icon-close",type:"info"},on:{click:function(a){return e.cancelManageItems(t.$index)}}}),e._v(" "),a("el-button",{attrs:{size:"mini",icon:"el-icon-check",type:"success"},on:{click:function(a){return e.saveStatus(e.tmp,t.$index)}}})],1):e._e()]}}],null,!1,3282294812)}),e._v(" "),a("el-table-column",{attrs:{label:this.$lang[e.langId].active,prop:"active_from",width:"140"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.end,width:"140",prop:"active_until"}}),e._v(" "),a("el-table-column",{attrs:{label:this.$lang[e.langId].action},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticClass:"btn-plain",attrs:{type:"info",icon:"el-icon-edit",size:"mini"},on:{click:function(a){return e.edit(t.row)}}})]}}],null,!1,1844496832)})],1),e._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("el-pagination",{attrs:{"current-page":e.params.currentPage,"page-size":e.params.per_page,layout:"prev, pager, next, jumper",total:e.params.total},on:{"size-change":e.changePageTable,"current-change":e.changeCurrentPage,"update:currentPage":function(t){return e.$set(e.params,"currentPage",t)},"update:current-page":function(t){return e.$set(e.params,"currentPage",t)}}})],1)],1)]),e._v(" "),e.showForm?a("group-form",{attrs:{saved:e.saved,loading:e.loading,"form-data":e.tmp},on:{save:e.save,cancel:e.cancel}}):e._e()],1)},r=[]},"z//K":function(e,t,a){"use strict";a.r(t);var s=a("7flW"),r=a("PBSS");for(var l in r)["default"].indexOf(l)<0&&function(e){a.d(t,e,function(){return r[e]})}(l);var n=a("KHd+"),i=Object(n.a)(r.default,s.a,s.b,!1,null,null,null);i.options.__file="Form.vue",t.default=i.exports}}]);