(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-75c9"],{"42g7":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("xCek"),o=i(a("vDqi")),r=a("sFg5"),n=i(a("ksP6"));a("Hj/Q");var l=i(a("DChC"));function i(t){return t&&t.__esModule?t:{default:t}}e.default={components:{vueDropzone:n.default,tokenc:""},mixins:[l.default],data:function(){return{loading:!0,tableData:[],statusValue:null,searchValue:null,importDialog:!1,dropdownForm:!0,pages:[5,10,20],statusSelect:[{value:"",label:this.$store.state.userStores.lang.all},{value:"Pending",label:this.$lang[this.$store.state.userStores.langId].pending},{value:"Shipping",label:this.$lang[this.$store.state.userStores.langId].has_confirm},{value:"Shipped",label:this.$store.state.userStores.lang.delivered}],params:{search:null,total:null,currentPage:1,sort_column:"date",sort_type:"desc",per_page:10,page:1},labelRow:[],loadingExport:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,o.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"stockopname"),params:this.params,headers:e}).then(function(e){t.tableData=e.data.data,t.tableData.map(function(t){t.loadingPost=!1}),t.params.total=e.data.meta.total,t.loading=!1}).catch(function(e){t.loading=!1,t.params.total=0,404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},changePageTable:function(t){this.params.per_page=t,this.getData()},handleSearch:function(t){this.params.page=1,this.params.currentPage=1,this.params.search_text="",this.params.search_column=null,this.params.search=this.searchValue,this.getData()},changeSortTable:function(t){"ascending"===t.order&&(t.order="asc"),"descending"===t.order&&(t.order="desc"),null===t.order&&(t.order=this.params.sort_type),console.log(t),this.params.sort_type=t.order,this.params.sort_column=t.prop,this.getData()},changeCurrentPage:function(t){this.params.currentPage=t,this.params.page=t,this.getData()},addData:function(){this.$router.push({path:"/inventory/stocksopname/create"})},afterComplete:function(t,e){console.log(e),0===e.error&&(this.$notify({title:"Sukses",message:e.data+" Produk."}),this.importDialog=!1,this.$router.push({path:"/inventory/stocksopname/"+e.id}))},failed:function(t,e,s){console.log("file",t),console.log("message",e),console.log("xhr",s),a("EVdn")(".dz-error-message span").text(e.error.error)},removeAllFiles:function(){this.$refs.dropzone.removeAllFiles()},goToSinglePage:function(t){this.$router.push({path:"/inventory/stocksopname/"+t.id})},handleClick:function(t){var e=this;this.loadingExport=!0;var a={p:t.key,type:"csv"};(0,r.importTemplateOpname)(a).then(function(t){var a=window.URL.createObjectURL(new Blob([t.data])),s=document.createElement("a");s.href=a,s.setAttribute("download","stockopname_template__.csv"),document.body.appendChild(s),s.click(),e.loadingExport=!1}).catch(function(t){e.loadingExport=!1})},postDataToProfitLoss:function(t,e){var a=this;this.tableData[e].loadingPost=!0,(0,r.postProfitloss)(t).then(function(t){a.getData(),a.tableData[e].loadingPost=!1,a.$notify({type:"success",title:"Success",message:"Sukses post ke laba rugi"})}).catch(function(t){a.tableData[e].loadingPost=!1,404!==t.response.data.error.status_code&&a.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})}},mounted:function(){this.getData();for(var t=[],e=0,a=0,s=1;s<=200;s++)e=500*s-499,a=500*s,t.push({value:e+" - "+a,key:s-1,string:e+"_"+a});this.labelRow=t}}},"97p4":function(t,e,a){"use strict";a.r(e);var s=a("YhLo"),o=a("Bq9d");for(var r in o)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return o[t]})}(r);var n=a("KHd+"),l=Object(n.a)(o.default,s.a,s.b,!1,null,null,null);l.options.__file="Index.vue",e.default=l.exports},Bq9d:function(t,e,a){"use strict";a.r(e);var s=a("42g7"),o=a.n(s);for(var r in s)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return s[t]})}(r);e.default=o.a},DChC:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(a("QbLZ")),o=r(a("Ljqw"));function r(t){return t&&t.__esModule?t:{default:t}}var n={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return o.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(a){e.includes(a.store_id)||a.is_store_active&&(t.push((0,s.default)({},a)),e.push(a.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=n},YhLo:function(t,e,a){"use strict";a.d(e,"a",function(){return s}),a.d(e,"b",function(){return o});var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"main-content"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("h4",{staticClass:"main-content__title"},[t._v(t._s(t.lang.stock_opname))]),t._v(" "),a("p",{staticClass:"main-content__subtitle"},[t._v(t._s(t.params.total)+" "+t._s(t.lang.stock_opname))])]),t._v(" "),a("div",[a("button-action-authenticated",{attrs:{permission:["inventory/stockopname","store"],icon:"el-icon-upload"},on:{click:function(e){t.importDialog=!0}}},[t._v("\n          "+t._s(t.lang.import)+"\n        ")]),t._v(" "),a("button-action-authenticated",{attrs:{permission:["inventory/stockopname","store"],type:"primary",icon:"el-icon-plus"},on:{click:t.addData}},[t._v("\n          "+t._s(t.lang.add)+"\n        ")])],1)]),t._v(" "),a("div",{staticClass:"table-handler-flex mb-16"},[a("div",{staticClass:"mb-4",staticStyle:{"flex-grow":"1"}},[a("el-select",{staticClass:"inline-form",attrs:{filterable:"",placeholder:t.lang.please_select,size:"small"},on:{change:t.changePageTable},model:{value:t.params.per_page,callback:function(e){t.$set(t.params,"per_page",e)},expression:"params.per_page"}},t._l(t.pages,function(e){return a("el-option",{key:e,attrs:{value:e,label:e+" "+t.lang.rows}})}),1)],1),t._v(" "),a("div",{staticClass:"mb-4"},[a("el-input",{staticClass:"inline-form input-search",attrs:{clearable:"",placeholder:t.lang.search+" "+t.lang.stock_opname_no,"prefix-icon":"el-icon-search",size:"small"},on:{change:t.handleSearch},model:{value:t.searchValue,callback:function(e){t.searchValue=e},expression:"searchValue"}})],1)]),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{data:t.tableData,stripe:"",border:""},on:{"sort-change":t.changeSortTable}},[a("el-table-column",{attrs:{label:t.$lang[t.langId].number,sortable:"",prop:"trans_no",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("router-link",{attrs:{to:{path:"/inventory/stocksopname/"+e.row.id}}},[t._v("\n            "+t._s(e.row.trans_no)+"\n          ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.date,sortable:"",prop:"date",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s(e.row.fdate)+"\n        ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.notes,sortable:"",prop:"note",width:"200"}}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.status,prop:"status",sortable:"",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return["D"===e.row.status?a("el-tag",{attrs:{size:"mini",type:"warning"}},[t._v("\n            "+t._s(e.row.status_desc)+"\n          ")]):"P"===e.row.status?a("el-tag",{attrs:{size:"mini",type:"success"}},[t._v("\n            "+t._s(e.row.status_desc)+"\n          ")]):"X"===e.row.status?a("el-tag",{attrs:{size:"mini",type:"danger"}},[t._v(t._s(e.row.status_desc)+"\n          ")]):a("el-tag",{attrs:{size:"mini"}},[t._v("\n            "+t._s(e.row.status_desc)+"\n          ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.received_by,sortable:"",prop:"modified_by"}}),t._v(" "),t.wejayafoodAccessByStore.includes(t.selectedStore.url_id)?a("el-table-column",{attrs:{width:"200",label:t.rootLang.post_to_profitloss,prop:"already_post_to_profitloss"},scopedSlots:t._u([{key:"default",fn:function(e){return["D"!==e.row.status?a("div",{staticClass:"full-width"},[0===e.row.already_post_to_profitloss?a("el-button",{staticClass:"btn-block",attrs:{type:"primary",loading:e.row.loadingPost},on:{click:function(a){return t.postDataToProfitLoss(e.row.id,e.$index)}}},[t._v("Post")]):t._e()],1):t._e()]}}],null,!1,1328340577)}):t._e()],1),t._v(" "),a("el-pagination",{attrs:{"current-page":t.params.currentPage,"page-size":t.params.per_page,layout:"prev, pager, next, jumper",total:t.params.total},on:{"size-change":t.changePageTable,"current-change":t.changeCurrentPage,"update:currentPage":function(e){return t.$set(t.params,"currentPage",e)},"update:current-page":function(e){return t.$set(t.params,"currentPage",e)}}})],1),t._v(" "),a("el-dialog",{attrs:{title:t.lang.import,visible:t.importDialog,"max-width":"760px"},on:{"update:visible":function(e){t.importDialog=e}}},[a("div",[a("div",{staticClass:"mb-16"},["setdemo1"!==t.selectedStore.url_id?a("a",{staticClass:"btn btn-default",attrs:{href:t.baseURL+"olsera_stockopname_import_template.csv"}},[t._v("\n          "+t._s(t.lang.download_template)+"\n        ")]):a("el-dropdown",{on:{command:t.handleClick}},[a("el-button",{attrs:{loading:t.loadingExport}},[t._v("\n            "+t._s(t.lang.download_template)+" "),a("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),t._v(" "),a("el-dropdown-menu",{staticStyle:{"overflow-y":"scroll",height:"300px"},attrs:{slot:"dropdown"},slot:"dropdown"},t._l(t.labelRow,function(e){return a("el-dropdown-item",{key:e.key,attrs:{command:e}},[t._v(t._s(t.lang.rows)+" "+t._s(e.value))])}),1)],1)],1),t._v(" "),a("div",{staticClass:"full-width"},[t.dropdownForm?a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v(t._s(t.lang.import_from_csv_info))])]),t._v(" "),a("vue-dropzone",{ref:"dropzone",attrs:{options:{url:t.baseURL+"api/"+this.selectedStore.url_id+"/admin/v1/"+this.langId+"/stockopname/importfromcsv",headers:{Authorization:"Bearer "+this.token.access_token,"Cache-Control":null},method:"post",acceptedFiles:".csv"}},on:{"vdropzone-success":t.afterComplete,"vdropzone-error":t.failed}}),t._v(" "),a("el-button",{staticStyle:{"margin-top":"8px"},on:{click:t.removeAllFiles}},[t._v("\n            "+t._s(t.$lang[t.langId].remove_all_file)+"\n          ")])],1):t._e()],1)])])],1)},o=[]},sFg5:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.importTemplateOpname=function(t){return(0,s.service)({url:"/stockopname/templateimport",responseType:"blob",params:t})},e.postProfitloss=function(t){return(0,s.service)({url:"/stockopname/postprofitloss/"+t,method:"post"})};var s=a("xCek")}}]);