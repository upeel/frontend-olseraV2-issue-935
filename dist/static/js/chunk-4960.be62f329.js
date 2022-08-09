(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-4960"],{"0YUF":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=d(a("m1cH")),n=a("xCek"),l=d(a("vDqi")),o=d(a("t2rG")),s=d(a("hioT")),r=d(a("58H6"));function d(t){return t&&t.__esModule?t:{default:t}}e.default={name:"Navigation",components:{draggable:o.default,List:s.default,ItemForm:r.default},data:function(){return{loading:!1,loadingItems:!1,showForm:!1,disabledButton:!1,saved:!1,data:[],tmp:{},labelDialog:"",moreLink:null,params:{per_page:100}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},watch:{"store.getters.selectedStore":function(){this.getData()}},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/"),headers:e,params:this.params}).then(function(e){t.data=e.data.data,t.moreLink=e.data.links.next,t.loading=!1}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},getSingleData:function(t){var e=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"GET",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/detail/"+t),headers:a}).then(function(t){e.tmp=t.data.data,e.loading=!1,e.showForm=!0}).catch(function(t){e.loading=!1,e.showForm=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},loadMore:function(){var t=this;this.disabledButton=!0,this.loadingItems=!0;var e={Authorization:"Bearer "+window.access_token};(0,l.default)({method:"GET",url:this.moreLink,params:this.params,headers:e}).then(function(e){t.data=t.data.concat(e.data.data),t.moreLink=e.data.links.next,t.loadingItems=!1,t.disabledButton=!1}).catch(function(e){t.loadingItems=!1,t.disabledButton=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},saveSorts:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token},a=[].concat((0,i.default)(this.data)),o={sorted_ids:a=a.map(function(t,e){return{id:t.id}})};(0,l.default)({method:"POST",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/sorting"),headers:e,params:{per_page:this.data.length},data:o}).then(function(e){t.data=e.data.data,t.$message({type:"success",message:"Success"}),t.loading=!1}).catch(function(e){t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},add:function(){this.labelDialog=this.lang.add+" "+this.lang.navigation,this.showForm=!0},edit:function(t){this.labelDialog=this.lang.edit+" "+this.lang.navigation;var e=t.id;this.getSingleData(e)},cancel:function(){this.showForm=!1,this.tmp={}},save:function(t){var e=t;t.id&&this.$set(e,"id",t.id),"PGR"===t.link_type_id?this.$set(e,"product_group_id",t.product_group_id):"PCL"===t.link_type_id?this.$set(e,"collection_id",t.collection_id):"PAG"===t.link_type_id?this.$set(e,"page_id",t.page_id):"ATT"===t.link_type_id?this.$set(e,"article_tag_id",t.article_tag_id):"EXL"===t.link_type_id&&this.$set(e,"link_url",t.link_url),this.saveNavigation(e)},saveNavigation:function(t){var e=this;this.loading=!0;var a=t,i="POST",o="",s="store";t.id&&(i="PUT",o=t.id,s="update/");var r={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:i,url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/"+s+o),headers:r,data:a}).then(function(t){e.tmp={},e.saved=!0,e.showForm=!1,e.loading=!1,e.getData(),e.$message({type:"success",message:"saved"})}).catch(function(t){e.saved=!1,e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},remove:function(t){var e=this,a={Authorization:"Bearer "+this.token.access_token};(0,l.default)({method:"DELETE",url:(0,n.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/delete/"+t.id),headers:a}).then(function(t){e.tmp={},e.showForm=!1,e.saved=!0,e.$message({type:"success",message:"saved"}),e.getData()}).catch(function(t){e.saved=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})}},mounted:function(){this.getData()}}},"58H6":function(t,e,a){"use strict";a.r(e);var i=a("FzRf"),n=a("ZLe0");for(var l in n)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return n[t]})}(l);var o=a("KHd+"),s=Object(o.a)(n.default,i.a,i.b,!1,null,null,null);s.options.__file="Form.vue",e.default=s.exports},AAAE:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dd-handle"},[a("div",{staticClass:"flex-container flex-container--wrap"},[t._m(0),t._v(" "),a("div",{staticClass:"mr-8"},[0===t.item.published?a("el-tag",{attrs:{type:"warning"}},[a("i",{staticClass:"el-icon-warning"})]):t._e()],1),t._v(" "),a("div",{staticStyle:{"flex-grow":"1"}},[t._v("\n      "+t._s(t.item.title)+"\n      "),t.item.link_type_name?a("div",[a("svg-icon",{attrs:{"icon-class":"link"}}),t._v(" "+t._s(t.item.link_type_name)+"\n      ")],1):t._e()]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"text",icon:"el-icon-edit-outline"},on:{click:t.edit}},[t._v("\n      "+t._s(t.lang.edit)+"\n    ")])],1)])},n=[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"hand"},[e("i",{staticClass:"el-icon-rank"})])}]},FyfS:function(t,e,a){t.exports={default:a("fUKC"),__esModule:!0}},FzRf:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",[a("el-form",{attrs:{"label-width":"40%"}},[a("el-form-item",{attrs:{label:"Tipe Link"}},[a("el-select",{attrs:{filterable:""},model:{value:t.data.link_type_id,callback:function(e){t.$set(t.data,"link_type_id",e)},expression:"data.link_type_id"}},t._l(t.typeLink,function(t){return a("el-option",{key:t.id,attrs:{label:t.link_type_name,value:t.id}})}),1)],1),t._v(" "),"PGR"===t.data.link_type_id?a("el-form-item",[a("template",{slot:"label"},[a("h5",{staticStyle:{"margin-top":"0","margin-bottom":"0"}},[t._v(t._s(t.lang.product_group))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_auto_complete_product_group))])]),t._v(" "),a("el-autocomplete",{attrs:{"fetch-suggestions":t.searchProductGroup,debounce:t.debounce,placeholder:t.lang.search+" "+t.lang.product},on:{select:function(e){return t.handleSelect("product",e)}},model:{value:t.productValue,callback:function(e){t.productValue=e},expression:"productValue"}},[t.data.product_group_id?a("i",{staticClass:"el-icon-circle-close-outline",attrs:{slot:"suffix"},on:{click:function(e){return t.clearSearch("product",t.data)}},slot:"suffix"}):t._e()])],2):t._e(),t._v(" "),"PCL"===t.data.link_type_id?a("el-form-item",[a("template",{slot:"label"},[a("h5",{staticStyle:{"margin-top":"0","margin-bottom":"0"}},[t._v(t._s(t.lang.collection))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_auto_complete_collection))])]),t._v(" "),a("el-autocomplete",{attrs:{"fetch-suggestions":t.searchCollection,debounce:t.debounce,placeholder:t.lang.search+" "+t.lang.collection},on:{select:function(e){return t.handleSelect("collection",e)}},model:{value:t.collectionValue,callback:function(e){t.collectionValue=e},expression:"collectionValue"}},[t.data.collection_id?a("i",{staticClass:"el-icon-circle-close-outline",attrs:{slot:"suffix"},on:{click:function(e){return t.clearSearch("collection",t.data)}},slot:"suffix"}):t._e()])],2):t._e(),t._v(" "),"PAG"===t.data.link_type_id?a("el-form-item",[a("template",{slot:"label"},[a("h5",{staticStyle:{"margin-top":"0","margin-bottom":"0"}},[t._v(t._s(t.lang.page))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_auto_complete_page))])]),t._v(" "),a("el-autocomplete",{attrs:{"fetch-suggestions":t.searchPageWeb,debounce:t.debounce,placeholder:t.lang.search+" "+t.lang.page},on:{select:function(e){return t.handleSelect("page",e)}},model:{value:t.pageValue,callback:function(e){t.pageValue=e},expression:"pageValue"}},[t.data.page_id?a("i",{staticClass:"el-icon-circle-close-outline",attrs:{slot:"suffix"},on:{click:function(e){return t.clearSearch("page",t.data)}},slot:"suffix"}):t._e()])],2):t._e(),t._v(" "),"ATT"===t.data.link_type_id?a("el-form-item",[a("template",{slot:"label"},[a("h5",{staticStyle:{"margin-top":"0","margin-bottom":"0"}},[t._v(t._s(t.lang.tag))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_auto_complete_tag))])]),t._v(" "),a("el-autocomplete",{attrs:{"fetch-suggestions":t.searchArticle,debounce:t.debounce,placeholder:t.lang.search+" "+t.lang.article},on:{select:function(e){return t.handleSelect("article",e)}},model:{value:t.articleValue,callback:function(e){t.articleValue=e},expression:"articleValue"}},[t.data.article_tag_id?a("i",{staticClass:"el-icon-circle-close-outline",attrs:{slot:"suffix"},on:{click:function(e){return t.clearSearch("article",t.data)}},slot:"suffix"}):t._e()])],2):t._e(),t._v(" "),"EXL"===t.data.link_type_id?a("el-form-item",[a("template",{slot:"label"},[a("h5",{staticStyle:{"margin-top":"0","margin-bottom":"0"}},[t._v(t._s(t.lang.external_url))]),t._v(" "),a("p",{staticClass:"input-desc size-12 oldgrey"},[t._v(t._s(t.lang.info_external_url))])]),t._v(" "),a("el-input",{model:{value:t.data.link_url,callback:function(e){t.$set(t.data,"link_url",e)},expression:"data.link_url"}})],2):t._e(),t._v(" "),a("el-form-item",{attrs:{label:t.lang.link_title}},[a("el-input",{model:{value:t.data.title,callback:function(e){t.$set(t.data,"title",e)},expression:"data.title"}})],1),t._v(" "),t.data.id?a("el-form-item",[a("button-action-authenticated",{staticStyle:{width:"100%",background:"#fff"},attrs:{permission:["settings/mobilenav","destroy"],type:"danger",plain:"",icon:"el-icon-delete"},on:{click:t.remove}},[t._v("\n          "+t._s(t.$lang[t.langId].delete)+"\n        ")])],1):t._e()],1)],1),t._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("el-button",{staticStyle:{"margin-right":"10px"},on:{click:t.cancel}},[t._v(t._s(t.lang.cancel))]),t._v(" "),a("button-action-authenticated",{attrs:{permission:["settings/mobilenav","edit"],disabled:t.disabledSave,type:"success",icon:"el-icon-check"},on:{click:t.save}},[t._v("\n      "+t._s(t.lang.save)+"\n    ")])],1)])},n=[]},S9x6:function(t,e,a){"use strict";a.r(e);var i=a("qpt3"),n=a("jLYr");for(var l in n)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return n[t]})}(l);var o=a("KHd+"),s=Object(o.a)(n.default,i.a,i.b,!1,null,null,null);s.options.__file="Index.vue",e.default=s.exports},ZLe0:function(t,e,a){"use strict";a.r(e);var i=a("ccRW"),n=a.n(i);for(var l in i)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return i[t]})}(l);e.default=n.a},ccRW:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(a("P2sY")),n=r(a("FyfS")),l=r(a("QbLZ")),o=a("xCek"),s=r(a("vDqi"));function r(t){return t&&t.__esModule?t:{default:t}}e.default={props:["saved","loading","formData"],data:function(){return{disabledSave:!0,loadingForm:!1,loadingProduct:!1,loadingCollection:!1,loadingPage:!1,loadingArticle:!1,debounce:300,typeLink:null,productValue:"",collectionValue:"",pageValue:"",articleValue:"",data:{}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},lang:function(){return this.$store.state.userStores.lang},langId:function(){return this.$store.state.userStores.langId}},watch:{data:{handler:function(t){console.log(t),"PGR"===t.link_type_id?t.title&&t.product_group_id?this.disabledSave=!1:this.disabledSave=!0:t.link_type_id&&"PCL"===t.link_type_id?t.title&&""!==t.title&&t.collection_id&&null!==t.collection_id?this.disabledSave=!1:this.disabledSave=!0:"PAG"===t.link_type_id?t.title&&""!==t.title&&t.page_id&&null!==t.page_id?this.disabledSave=!1:this.disabledSave=!0:"ATT"===t.link_type_id?t.title&&""!==t.title&&t.article_tag_id&&null!==t.article_tag_id?this.disabledSave=!1:this.disabledSave=!0:t.link_type_id&&"EXL"===t.link_type_id?t.title&&""!==t.title&&t.link_url&&""!==t.link_url?this.disabledSave=!1:this.disabledSave=!0:t.link_type_id&&""!==t.link_type_id&&t.title&&""!==t.title?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(t){!0===t&&(this.data={},this.disabledSave=!0)},deep:!0},formData:{handler:function(t){this.data=(0,l.default)({},t),t.id&&"PGR"===t.link_type_id?(this.data.product_group_id=t.link_id,delete this.data.link_id,this.productValue=t.link_name):t.id&&"PCL"===t.link_type_id?(this.data.collection_id=t.link_id,delete this.data.link_id,this.collectionValue=t.link_name):t.id&&"PAG"===t.link_type_id?(this.data.page_id=t.link_id,delete this.data.link_id,this.pageValue=t.link_name):t.id&&"ATT"===t.link_type_id&&(this.data.article_tag_id=t.link_id,delete this.data.link_id,this.articleValue=t.link_name)},deep:!0,immediate:!0}},methods:{getTypeLink:function(){var t=this;this.loadingForm=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,s.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"mobilenav/gettypelink"),headers:e}).then(function(e){t.typeLink=e.data.data,t.loadingForm=!1}).catch(function(e){t.loadingForm=!1,t.$notify({tipe:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},searchProductGroup:function(t,e){var a=this;this.loadingProduct=!0;var i={Authorization:"Bearer "+this.token.access_token},l={sort_column:"name",sort_type:"asc",search:t};(0,s.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"productgroup"),headers:i,params:l}).then(function(t){a.loadingProduct=!1;var i=!0,l=!1,o=void 0;try{for(var s,r=(0,n.default)(t.data.data);!(i=(s=r.next()).done);i=!0){var d=s.value;d.value=d.name}}catch(t){l=!0,o=t}finally{try{!i&&r.return&&r.return()}finally{if(l)throw o}}a.searchResultProduct=t.data.data,e(a.searchResultProduct)}).catch(function(t){console.log(t)})},searchCollection:function(t,e){var a=this;this.loadingCollection=!0;var i={Authorization:"Bearer "+this.token.access_token},l={sort_column:"name",sort_type:"asc",search:t};(0,s.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"collection"),headers:i,params:l}).then(function(t){a.loadingCollection=!1;var i=!0,l=!1,o=void 0;try{for(var s,r=(0,n.default)(t.data.data);!(i=(s=r.next()).done);i=!0){var d=s.value;d.value=d.name}}catch(t){l=!0,o=t}finally{try{!i&&r.return&&r.return()}finally{if(l)throw o}}a.searchResultCollection=t.data.data,e(a.searchResultCollection)}).catch(function(t){console.log(t)})},searchPageWeb:function(t,e){var a=this;this.loadingPage=!0;var i={Authorization:"Bearer "+this.token.access_token},l={search:t};(0,s.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"page"),headers:i,params:l}).then(function(t){a.loadingPage=!1;var i=!0,l=!1,o=void 0;try{for(var s,r=(0,n.default)(t.data.data);!(i=(s=r.next()).done);i=!0){var d=s.value;d.value=d.title}}catch(t){l=!0,o=t}finally{try{!i&&r.return&&r.return()}finally{if(l)throw o}}a.searchResultPage=t.data.data,e(a.searchResultPage)}).catch(function(){a.searchResultPage=[]})},searchArticle:function(t,e){var a=this;this.loadingArticle=!0;var i={Authorization:"Bearer "+this.token.access_token},l={search:t};(0,s.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"article"),headers:i,params:l}).then(function(t){a.loadingArticle=!0;var i=!0,l=!1,o=void 0;try{for(var s,r=(0,n.default)(t.data.data);!(i=(s=r.next()).done);i=!0){var d=s.value;d.value=d.title}}catch(t){l=!0,o=t}finally{try{!i&&r.return&&r.return()}finally{if(l)throw o}}a.searchResultArticle=t.data.data,e(a.searchResultArticle)}).catch(function(t){console.log(t)})},handleSelect:function(t,e){"product"===t?this.data.product_group_id=e.id:"collection"===t?this.data.collection_id=e.id:"page"===t?this.data.page_id=e.id:"article"===t&&(this.data.article_tag_id=e.id)},clearSearch:function(t,e){"product"===t?(this.data.product_group_id=null,this.productValue=""):"collection"===t?(this.data.collection_id=null,this.collectionValue=""):"page"===t?(this.data.page_id=null,this.pageValue=""):"article"===t&&(e.article_tag_id=null,this.articleValue="")},cancel:function(){this.data={},this.$emit("cancel")},save:function(){this.disabledSave=!0;var t=(0,i.default)({},this.data);this.$emit("save",t)},remove:function(){this.$emit("remove",{id:this.data.id})}},mounted:function(){this.getTypeLink()}}},fUKC:function(t,e,a){a("ZY/g"),a("C5kU"),t.exports=a("sbOA")},hioT:function(t,e,a){"use strict";a.r(e);var i=a("AAAE"),n=a("kqzy");for(var l in n)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return n[t]})}(l);var o=a("KHd+"),s=Object(o.a)(n.default,i.a,i.b,!1,null,null,null);s.options.__file="List.vue",e.default=s.exports},jLYr:function(t,e,a){"use strict";a.r(e);var i=a("0YUF"),n=a.n(i);for(var l in i)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return i[t]})}(l);e.default=n.a},kqzy:function(t,e,a){"use strict";a.r(e);var i=a("osXq"),n=a.n(i);for(var l in i)["default"].indexOf(l)<0&&function(t){a.d(e,t,function(){return i[t]})}(l);e.default=n.a},osXq:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.__esModule?t:{default:t}}(a("QbLZ"));e.default={props:{item:{type:Object,default:null}},computed:{lang:function(){return this.$store.state.userStores.lang}},methods:{edit:function(){var t=(0,i.default)({},this.item);this.$emit("edit",t)}}}},qpt3:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return n});var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrapper"},[a("section",{staticClass:"content"},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[t._v(t._s(t.lang.navigation))]),t._v(" "),a("button-action-authenticated",{attrs:{permission:["settings/mobilenav","store"],type:"success",icon:"el-icon-plus",size:"small",disabled:t.disabledButton},on:{click:t.add}},[t._v("\n            "+t._s(t.lang.add)+"\n          ")])],1),t._v(" "),a("div",{staticClass:"card-body"},[a("draggable",{staticClass:"dd-list dragArea",attrs:{option:{group:{name:"mobileapp"}}},on:{change:t.saveSorts},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}},t._l(t.data,function(e){return a("div",{key:e.id,staticClass:"dd-item"},[a("list",{attrs:{item:e},on:{edit:t.edit}})],1)}),0),t._v(" "),t.moreLink?a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingItems,expression:"loadingItems"}],staticClass:"load-more"},[a("el-button",{staticClass:"btn-block",attrs:{disabled:t.disabledButton},on:{click:t.loadMore}},[t._v("\n              "+t._s(t.$lang[t.langId].load_more)+"\n            ")])],1):t._e()],1)]),t._v(" "),a("el-dialog",{attrs:{title:t.labelDialog,visible:t.showForm,width:"50%","close-on-click-modal":!1,"show-close":!1},on:{"update:visible":function(e){t.showForm=e}}},[a("div",{staticClass:"dialog-body",staticStyle:{"padding-bottom":"10px"}},[t.showForm?a("item-form",{attrs:{saved:t.saved,"form-data":t.tmp},on:{cancel:t.cancel,save:t.save,remove:t.remove}}):t._e()],1)])],1)])])},n=[]},sbOA:function(t,e,a){var i=a("d+lc"),n=a("I90/");t.exports=a("VSTI").getIterator=function(t){var e=n(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return i(e.call(t))}}}]);