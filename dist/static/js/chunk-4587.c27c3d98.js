(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-4587"],{NNVs:function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return r});var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"main-content"},[a("div",{staticClass:"table-handler-flex"},[a("div",{staticClass:"flex-grow-1"},[a("h4",{staticClass:"main-content__title"},[e._v(e._s(e.$lang[e.langId].list)+" "+e._s(e.lang.page))]),e._v(" "),a("p",{staticClass:"mbin-content__subtitle"},[e._v(e._s(e.params.total)+" "+e._s(e.lang.page))])]),e._v(" "),a("button-action-authenticated",{attrs:{permission:["website/pages","store"],type:"success",icon:"el-icon-plus"},on:{click:function(t){return e.formHandle("add")}}},[e._v("\n      "+e._s(e.lang.add)+"\n    ")])],1),e._v(" "),a("div",{staticClass:"table-handler-flex"},[a("div",{staticClass:"mb-4 flex-grow-1"},[a("el-select",{attrs:{placeholder:e.lang.please_select,size:"small",filterable:""},on:{change:e.changePageTable},model:{value:e.params.per_page,callback:function(t){e.$set(e.params,"per_page",t)},expression:"params.per_page"}},e._l(e.pages,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("div",{staticClass:"mb-4"},[a("el-input",{attrs:{clearable:"",placeholder:e.lang.search,"prefix-icon":"el-icon-search",size:"small"},on:{change:e.handleSearch},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}})],1)]),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"pointer",attrs:{data:e.tableData,stripe:"",border:""},on:{"row-click":function(t){return e.formHandle("detail",t)},"sort-change":e.changeSortTable}},[a("el-table-column",{attrs:{label:e.lang.title,sortable:"",prop:"title"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"flex-container"},[a("div",{staticClass:"mr-4"},[t.row.photo_xs?a("el-avatar",{attrs:{src:t.row.photo_xs,alt:t.row.name,shape:"square"}}):e._e()],1),e._v(" "),a("strong",[e._v(e._s(t.row.title))])])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"Page Builder",prop:"use_builder"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.use_builder?a("el-tag",[e._v("Active")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"published",sortable:"",label:e.lang.publish},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.published?e._e():a("el-tag",{attrs:{type:"warning"}},[e._v(e._s(e.rootLang.draft))]),e._v(" "),1===t.row.published?a("p",[e._v(e._s(e.lang.published)+" "+e._s(t.row.fcreated_time))]):a("p",[e._v(e._s(e.lang.not_published_yet))])]}}])})],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.params.currentPage,"page-size":e.params.per_page,total:e.params.total,layout:"prev, pager, next, jumper"},on:{"update:currentPage":function(t){return e.$set(e.params,"currentPage",t)},"update:current-page":function(t){return e.$set(e.params,"currentPage",t)},"size-change":e.changePageTable,"current-change":e.changeCurrentPage}})],1)],1)},r=[]},kyzS:function(e,t,a){"use strict";a.r(t);var s=a("oNGk"),r=a.n(s);for(var n in s)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return s[e]})}(n);t.default=r.a},me5n:function(e,t,a){"use strict";a.r(t);var s=a("NNVs"),r=a("kyzS");for(var n in r)["default"].indexOf(n)<0&&function(e){a.d(t,e,function(){return r[e]})}(n);var l=a("KHd+"),o=Object(l.a)(r.default,s.a,s.b,!1,null,null,null);o.options.__file="Index.vue",t.default=o.exports},oNGk:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("xCek"),r=o(a("vDqi")),n=o(a("sS+i")),l=a("6y4V");function o(e){return e&&e.__esModule?e:{default:e}}t.default={components:{ItemForm:n.default},mixins:[l.checkCustomPermission],data:function(){return{loading:!1,showForm:!1,tableData:[],tmp:{},searchValue:null,pages:[{value:5,label:"5 "+this.$store.state.userStores.lang.rows},{value:10,label:"10 "+this.$store.state.userStores.lang.rows},{value:20,label:"20 "+this.$store.state.userStores.lang.rows}],params:{per_page:5},saved:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang},rootLang:function(){return this.$lang[this.$store.state.userStores.langId]}},watch:{"$store.getters.selectedStore":function(){this.getData()}},mounted:function(){this.getData()},methods:{getData:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,r.default)({method:"GET",url:(0,s.baseApi)(this.selectedStore.url_id,this.langId,"page/"),headers:t,params:this.params}).then(function(t){e.tableData=t.data.data,e.params.total=t.data.meta.total,e.loading=!1}).catch(function(t){e.loading=!1,e.params.total=0,404!==t.response.data.error.status_code&&e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},changePageTable:function(e){this.params.per_page=e,this.getData()},handleSearch:function(e){this.params.page=1,this.params.search=this.searchValue,this.getData()},changeSortTable:function(e){"ascending"===e.order&&(e.order="asc"),"descending"===e.order&&(e.order="desc"),this.params.sort_type=e.order,this.params.sort_column=e.prop,this.getData()},changeCurrentPage:function(e){this.params.currentPage=e,this.params.page=e,this.getData()},formHandle:function(e,t){"add"===e?this.$router.push({path:"/website/pages/static/create"}):"detail"===e&&this.checkCustomPermission("website/pages","edit")&&this.$router.push({path:"/website/pages/static/"+t.id})}}}}}]);