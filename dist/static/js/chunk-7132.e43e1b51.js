(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-7132"],{"+BEX":function(e,t,a){"use strict";a.d(t,"a",function(){return n}),a.d(t,"b",function(){return s});var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"dd-handle"},[a("div",{staticClass:"flex-container flex-container--wrap"},[e._m(0),e._v(" "),a("div",{staticStyle:{"flex-grow":"1"}},[e._v("\n      "+e._s(e.item.name)+" "),a("span",{staticClass:"grey"},[e._v("("+e._s(e.item.total_product)+")")]),e._v(" "),e.checkCustomPermission("catalog/brands","show")?a("div",[a("small",{staticClass:"grey"},[e._v(e._s(e.$lang[e.langId].comission)+" "+e._s(e.item.comission_pct)+" %")])]):e._e()]),e._v(" "),e.checkCustomPermission("catalog/brands","edit")?a("el-button",{attrs:{type:"text"},on:{click:e.edit}},[e._v("\n      edit\n    ")]):e._e()],1)])},s=[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"hand handle"},[t("i",{staticClass:"el-icon-rank"})])}]},"63rX":function(e,t,a){"use strict";a.r(t);var n=a("BQlo"),s=a("vZwR");for(var r in s)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return s[e]})}(r);var i=a("KHd+"),o=Object(i.a)(s.default,n.a,n.b,!1,null,null,null);o.options.__file="EditItem.vue",t.default=o.exports},"6z6e":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(a("14Xm")),s=o(a("D3Ub")),r=o(a("QbLZ")),i=o(a("DA24"));function o(e){return e&&e.__esModule?e:{default:e}}t.default={props:["isEditing","item","loading"],components:{DeleteButton:i.default},data:function(){return{data:{},showSelectCategory:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{item:{handler:function(e){this.data=(0,r.default)({},e)},deep:!0,immediate:!0}},methods:{close:function(){this.$emit("close"),this.data={},this.showSelectCategory=!1},save:function(){var e=this;return(0,s.default)(n.default.mark(function t(){return n.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$emit("save",e.data);case 2:e.close();case 3:case"end":return t.stop()}},t,e)}))()},handleDelete:function(){var e=this;return(0,s.default)(n.default.mark(function t(){return n.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$emit("delete",e.item);case 2:e.close();case 3:case"end":return t.stop()}},t,e)}))()}}}},BQlo:function(e,t,a){"use strict";a.d(t,"a",function(){return n}),a.d(t,"b",function(){return s});var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.isEditing,"before-close":e.close,width:"360px",title:"Edit"},on:{"update:visible":function(t){e.isEditing=t}}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"dialog-body"},[a("el-form",{attrs:{model:e.data,"label-position":"top"},nativeOn:{submit:function(e){e.preventDefault()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save.apply(null,arguments)}}},[a("el-form-item",{attrs:{label:e.lang.name}},[a("el-input",{model:{value:e.data.name,callback:function(t){e.$set(e.data,"name",t)},expression:"data.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:e.lang.comission}},[a("el-input",{model:{value:e.data.comission_pct,callback:function(t){e.$set(e.data,"comission_pct",t)},expression:"data.comission_pct"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer flex-container",attrs:{slot:"footer"},slot:"footer"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("delete-button",{attrs:{"custom-permission":"catalog/brands"},on:{confirm:e.handleDelete}})],1),e._v(" "),a("el-button",{on:{click:e.close}},[e._v("\n      "+e._s(e.lang.cancel)+"\n    ")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("\n      "+e._s(e.lang.save)+"\n    ")])],1)])},s=[]},DChC:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(a("QbLZ")),s=r(a("Ljqw"));function r(e){return e&&e.__esModule?e:{default:e}}var i={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var e=this.$store.getters.selectedStore;return{role_id:e.role_id,role_name:e.role_name,is_pos_only:e.is_pos_only,is_mobile:e.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var e=this.$store.getters.token;return this.$store.getters.webviewMode&&(e=this.$store.getters.webviewToken),{Authorization:"Bearer "+e.access_token}},baseURL:function(){return s.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var e=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],t=[];return this.$store.getters.stores.map(function(a){t.includes(a.store_id)||a.is_store_active&&(e.push((0,n.default)({},a)),t.push(a.store_id))}),e},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};t.default=i},HJNw:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("6y4V");t.default={props:{item:{type:Object,default:null}},mixins:[n.checkCustomPermission],computed:{langId:function(){return this.$store.state.userStores.langId}},methods:{edit:function(){this.$emit("edit",this.item)}}}},IQps:function(e,t,a){"use strict";a.r(t);var n=a("mAT7"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return n[e]})}(r);t.default=s.a},K7MX:function(e,t,a){"use strict";a.r(t);var n=a("+BEX"),s=a("WYqL");for(var r in s)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return s[e]})}(r);var i=a("KHd+"),o=Object(i.a)(s.default,n.a,n.b,!1,null,null,null);o.options.__file="List.vue",t.default=o.exports},WYqL:function(e,t,a){"use strict";a.r(t);var n=a("HJNw"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return n[e]})}(r);t.default=s.a},XGbJ:function(e,t,a){"use strict";a.r(t);var n=a("xvPN"),s=a("IQps");for(var r in s)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return s[e]})}(r);var i=a("KHd+"),o=Object(i.a)(s.default,n.a,n.b,!1,null,null,null);o.options.__file="Form.vue",t.default=o.exports},a7kV:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=c(a("QbLZ")),s=c(a("t2rG")),r=a("xCek"),i=c(a("vDqi")),o=c(a("XGbJ")),l=c(a("K7MX")),d=c(a("63rX")),u=a("6y4V");function c(e){return e&&e.__esModule?e:{default:e}}t.default={components:{GroupForm:o.default,draggable:s.default,List:l.default,EditItem:d.default},mixins:[u.checkCustomPermission],data:function(){return{loading:!0,loadingItems:!1,saved:!1,data:[],tmpData:[],moreLink:null,disabledSaveSorts:!0,showSaveSorts:!1,managingItems:!1,disabledButton:!1,singleData:null,isEditing:!1,tmp:{data:[]}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()}},methods:{getData:function(){var e=this;this.loading=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"GET",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"brand"),headers:t}).then(function(t){e.data=t.data.data,e.loading=!1,e.moreLink=t.data.links.next}).catch(function(t){e.loading=!1,404!==t.response.data.error.status_code&&e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},sortsChanged:function(e){this.disabledSaveSorts=!1,this.showSaveSorts=!0},save:function(e){var t=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"brand"),headers:a,data:e}).then(function(e){t.$message({message:"Success",type:"success"}),t.getData(),t.saved=!0,t.loading=!1}).catch(function(e){t.saved=!1,t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},saveSorts:function(){var e=this;this.disabledSaveSorts=!0;var t={Authorization:"Bearer "+this.token.access_token},a={per_page:this.data.length},n=this.data.slice(0),s={sorted_ids:n=n.map(function(e){return{id:e.id}})};(0,i.default)({method:"POST",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"brand/sorting"),headers:t,params:a,data:s}).then(function(t){e.data=t.data.data,e.showSaveSorts=!1,e.$message({type:"success",message:"Success"})}).catch(function(t){e.disabledSaveSorts=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},loadMore:function(){var e=this;this.loadingItems=!0;var t={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"GET",url:this.moreLink,headers:t}).then(function(t){e.data=e.data.concat(t.data.data),e.loadingItems=!1,e.moreLink=t.data.links.next}).catch(function(t){e.loadingItems=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})},remove:function(e){var t=this;this.loadingItems=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"DELETE",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"brand/"+e.id),headers:a,params:{name:e.name}}).then(function(a){t.data.map(function(a,n){a.id===e.id&&t.data.splice(n,1)}),t.$message({type:"success",message:a.data.data.message}),t.loadingItems=!1}).catch(function(e){404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error}),t.loadingItems=!1})},handleEditItem:function(e){this.singleData=(0,n.default)({},e),this.isEditing=!0},update:function(e){var t=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"PUT",url:(0,r.baseApi)(this.selectedStore.url_id,this.langId,"brand/"+e.id),headers:a,data:e}).then(function(e){t.$message({message:"Success",type:"success"}),t.getData(),t.saved=!0,t.loading=!1}).catch(function(e){t.saved=!1,t.loading=!1,t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})}},mounted:function(){this.getData()}}},dHhy:function(e,t,a){"use strict";a.r(t);var n=a("a7kV"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return n[e]})}(r);t.default=s.a},kZ8V:function(e,t,a){"use strict";a.d(t,"a",function(){return n}),a.d(t,"b",function(){return s});var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"affix-wrapper flex-container flex-container--start flex-container--desktop"},[e.checkCustomPermission("catalog/brands","store")?a("div",{staticClass:"affix-container mr-16"},[a("group-form",{attrs:{loading:e.loading,saved:e.saved},on:{save:e.save}})],1):e._e(),e._v(" "),a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"box-card flex-grow-1",attrs:{shadow:"never"}},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[e._v(e._s(e.$lang[e.langId].list)+" "+e._s(e.lang.brand))]),e._v(" "),e.showSaveSorts?a("div",[a("button-action-authenticated",{attrs:{permission:["catalog/brands","edit"],disabled:e.disabledSaveSorts,type:"success",icon:"el-icon-check"},on:{click:e.saveSorts}},[e._v("\n            "+e._s(e.lang.save)+"\n          ")])],1):e._e()]),e._v(" "),a("div",{staticClass:"card-body"},[a("draggable",{staticClass:"dd-list dragArea",attrs:{list:e.data,options:{group:{name:"brand"}},handle:".hand"},on:{change:e.sortsChanged},model:{value:e.data,callback:function(t){e.data=t},expression:"data"}},e._l(e.data,function(t){return a("div",{key:t.id,staticClass:"dd-item"},[a("list",{attrs:{item:t},on:{edit:e.handleEditItem}})],1)}),0),e._v(" "),e.moreLink?a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingItems,expression:"loadingItems"}],staticClass:"load-more"},[a("el-button",{staticClass:"btn-block",on:{click:e.loadMore}},[e._v("\n            "+e._s(e.$lang[e.langId].load_more)+"..\n          ")])],1):e._e()],1)])],1),e._v(" "),a("edit-item",{attrs:{"is-editing":e.isEditing,item:e.singleData,loading:e.loading},on:{close:function(t){e.isEditing=!1},save:e.update,delete:e.remove}})],1)},s=[]},mAT7:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(a("P2sY"));t.default={props:["saved","loading"],data:function(){return{disabledSave:!0,data:{}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{data:{handler:function(e){e.name&&""!==e.name?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(e){console.log(e),!0===e&&(this.data={},this.disabledSave=!0)},deep:!0}},methods:{save:function(){this.disabledSave=!0;var e=(0,n.default)({},this.data);this.$emit("save",e)},handleCurrency:function(e){e<0&&(this.data.comission_pct=0)}}}},u7zL:function(e,t,a){"use strict";a.r(t);var n=a("kZ8V"),s=a("dHhy");for(var r in s)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return s[e]})}(r);var i=a("KHd+"),o=Object(i.a)(s.default,n.a,n.b,!1,null,null,null);o.options.__file="Index.vue",t.default=o.exports},vZwR:function(e,t,a){"use strict";a.r(t);var n=a("6z6e"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(e){a.d(t,e,function(){return n[e]})}(r);t.default=s.a},xvPN:function(e,t,a){"use strict";a.d(t,"a",function(){return n}),a.d(t,"b",function(){return s});var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{shadow:"never"}},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[e._v(e._s(e.lang.add_brand))]),e._v(" "),a("div",[a("el-button",{attrs:{disabled:e.disabledSave,type:"primary",icon:"el-icon-check"},on:{click:e.save}},[e._v("\n        "+e._s(e.lang.save)+"\n      ")])],1)]),e._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{staticClass:"form-sidebyside"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:e.lang.name,required:!0}},[a("p",[e._v(e._s(e.lang.info_brand_name))])])],1),e._v(" "),a("el-col",{attrs:{span:13}},[a("el-form-item",[a("el-input",{attrs:{type:"text"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save.apply(null,arguments)}},model:{value:e.data.name,callback:function(t){e.$set(e.data,"name",t)},expression:"data.name"}})],1)],1)],1),e._v(" "),a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:e.$lang[e.langId].comission}},[a("p",[e._v(e._s(e.$lang[e.langId].commission_for_employees))])])],1),e._v(" "),a("el-col",{attrs:{span:13}},[a("el-form-item",[a("el-input",{attrs:{placeholder:e.lang.desc_price_cut_for_reseller,type:"number",min:"0.01"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save.apply(null,arguments)}},model:{value:e.data.comission_pct,callback:function(t){e.$set(e.data,"comission_pct",t)},expression:"data.comission_pct"}},[a("template",{slot:"append"},[e._v("%")])],2)],1)],1)],1)],1)],1)])},s=[]}}]);