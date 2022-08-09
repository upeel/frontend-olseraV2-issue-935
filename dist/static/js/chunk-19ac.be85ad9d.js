(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-19ac"],{"0iKy":function(t,e,a){"use strict";a.r(e);var n=a("bNAi"),s=a("mWuR");for(var r in s)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return s[t]})}(r);var o=a("KHd+"),i=Object(o.a)(s.default,n.a,n.b,!1,null,null,null);i.options.__file="List.vue",e.default=i.exports},"8FZu":function(t,e,a){"use strict";a.r(e);var n=a("8L1v"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=s.a},"8L1v":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=f(a("QbLZ")),s=f(a("EJiy")),r=f(a("t2rG")),o=a("xCek"),i=f(a("vDqi")),d=f(a("9to0")),l=f(a("0iKy")),u=f(a("ppmK")),c=a("6y4V");function f(t){return t&&t.__esModule?t:{default:t}}e.default={mixins:[c.checkCustomPermission],components:{GroupForm:d.default,draggable:r.default,List:l.default,EditItem:u.default},data:function(){return{loading:!0,loadingItems:!1,saved:!1,data:[],tmpData:[],moreLink:null,disabledSaveSorts:!0,showSaveSorts:!1,managingItems:!1,disabledButton:!1,isEditing:!1,singleData:{},tmp:{data:[]}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{"$store.getters.selectedStore":function(){this.getData()}},mounted:function(){this.getData()},methods:{getData:function(){var t=this;this.loading=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"GET",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"lookbookgroup"),params:this.params,headers:e}).then(function(e){var a=e.data.data.map(function(e){return e.children||t.$set(e,"children",[]),e});t.data=a,t.loading=!1,t.moreLink=e.data.links.next}).catch(function(e){t.loading=!1,404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},sortsChanged:function(t){this.disabledSaveSorts=!1,this.showSaveSorts=!0},save:function(t){var e=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"POST",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"lookbookgroup/store"),headers:a,data:t}).then(function(t){e.getData(),e.saved=!0,e.loading=!1}).catch(function(t){e.saved=!1,e.loading=!1,console.log(t),e.$notify({type:"warning",title:"Error",message:"Error"})})},saveSorts:function(){var t=this;this.disabledSaveSorts=!0;var e={Authorization:"Bearer "+this.token.access_token},a=this.data,n={sorted_ids:a=a.map(function(t,e){var a={id:t.id,children:[]};return t.children&&t.children.length>0&&t.children.map(function(t){a.children.push({id:t.id,name:t.name})}),a})};(0,i.default)({method:"POST",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"lookbookgroup/sorting"),headers:e,params:{per_page:this.data.length},data:n}).then(function(e){var a=e.data.data.map(function(e){return e.children||t.$set(e,"children",[]),e});t.data=a,t.showSaveSorts=!1,t.$message({type:"success",message:"Success"})}).catch(function(e){t.disabledSaveSorts=!1,404!==e.response.data.error.status_code&&t.$notify({type:"warning",title:e.response.data.error.message,message:e.response.data.error.error})})},loadMore:function(){var t=this;this.loadingItems=!0;var e={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"GET",url:this.moreLink,params:this.params,headers:e}).then(function(e){var a=e.data.data.map(function(e){return e.children||t.$set(e,"children",[]),e});t.data=t.data.concat(a),t.loadingItems=!1,t.moreLink=e.data.links.next}).catch(function(e){t.loadingItems=!1,t.$notify({type:"warning",title:"Error",message:e})})},remove:function(t){var e=this;this.loadingItems=!0;var a={Authorization:"Bearer "+this.token.access_token};(0,i.default)({method:"DELETE",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"lookbookgroup/destroy/"+t.id),headers:a}).then(function(a){e.data.map(function(a,n){a.id===t.id&&e.data.splice(n,1)}),e.$message({type:"success",message:a.data.data.message}),e.loadingItems=!1}).catch(function(t){console.log((0,s.default)(t.response.data.error.error)),e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error}),e.loadingItems=!1})},dataChanges:function(t){this.tmp.data.push(t)},handleEditItem:function(t){this.singleData=(0,n.default)({},t),this.isEditing=!0},update:function(t){var e=this;this.loading=!0;var a={Authorization:"Bearer "+this.token.access_token};t.disabled&&this.$delete(t,"disabled"),(0,i.default)({method:"PUT",url:(0,o.baseApi)(this.selectedStore.url_id,this.langId,"lookbookgroup/update/"+t.id),headers:a,data:t}).then(function(){e.getData(),e.isEditing=!1,e.loading=!1}).catch(function(t){e.loading=!1,e.$notify({type:"warning",title:t.response.data.error.message,message:t.response.data.error.error})})}}}},"9to0":function(t,e,a){"use strict";a.r(e);var n=a("gZFk"),s=a("vusD");for(var r in s)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return s[t]})}(r);var o=a("KHd+"),i=Object(o.a)(s.default,n.a,n.b,!1,null,null,null);i.options.__file="Form.vue",e.default=i.exports},AvTY:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return s});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"affix-wrapper flex-container flex-container--start flex-container--desktop"},[t.checkCustomPermission("catalog/lookbookgroups","store")?a("div",{staticClass:"affix-container mr-16"},[a("group-form",{attrs:{loading:t.loading,saved:t.saved},on:{save:t.save}})],1):t._e(),t._v(" "),a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"flex-grow-1",attrs:{shadow:"never"}},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[t._v(t._s(t.$lang[t.langId].list)+" "+t._s(t.lang.look_book))]),t._v(" "),t.showSaveSorts?a("div",[a("button-action-authenticated",{attrs:{permission:["catalog/lookbookgroups","edit"],disabled:t.disabledSaveSorts,type:"success",icon:"el-icon-check"},on:{click:t.saveSorts}},[t._v("\n            "+t._s(t.lang.save)+"\n          ")])],1):t._e()]),t._v(" "),a("div",{staticClass:"card-body"},[a("draggable",{staticClass:"dd-list dragArea",attrs:{options:{group:{name:"lookbookgroups"}},list:t.data,handle:".hand"},on:{change:t.sortsChanged}},t._l(t.data,function(e){return a("div",{key:e.id,staticClass:"dd-item"},[a("list",{attrs:{item:e},on:{edit:t.handleEditItem}}),t._v(" "),a("draggable",{staticClass:"dd-list children dragArea",attrs:{options:{group:{name:"lookbookgroups"}},list:e.children,handle:".hand"},on:{change:t.sortsChanged}},t._l(e.children,function(e){return a("div",{key:e.id,staticClass:"dd-item"},[a("list",{attrs:{item:e},on:{edit:t.handleEditItem}})],1)}),0)],1)}),0),t._v(" "),t.moreLink?a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingItems,expression:"loadingItems"}],staticClass:"load-more"},[a("el-button",{staticClass:"btn-block",on:{click:t.loadMore}},[t._v("\n            "+t._s(t.$lang[t.langId].load_more)+"..\n          ")])],1):t._e()],1)])],1),t._v(" "),a("edit-item",{attrs:{"is-editing":t.isEditing,item:t.singleData,loading:t.loading},on:{close:function(e){t.isEditing=!1},save:t.update,delete:t.remove}})],1)},s=[]},DChC:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(a("QbLZ")),s=r(a("Ljqw"));function r(t){return t&&t.__esModule?t:{default:t}}var o={mixins:[a("6y4V").checkCustomPermission],computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores?this.$store.state.userStores.lang:{}},userRole:function(){var t=this.$store.getters.selectedStore;return{role_id:t.role_id,role_name:t.role_name,is_pos_only:t.is_pos_only,is_mobile:t.is_mobile}},rootLang:function(){return this.$lang[this.langId]},headers:function(){var t=this.$store.getters.token;return this.$store.getters.webviewMode&&(t=this.$store.getters.webviewToken),{Authorization:"Bearer "+t.access_token}},baseURL:function(){return s.default},loggedInUser:function(){return this.$store.state.user.loggedInUser},stageLevel:function(){return"sit"},defaultAccessByStore:function(){return["setdemo1","allinolsera2"]},wejayafoodAccessByStore:function(){return["setdemo1","allinolsera2","ayammrotholpusat","ayammrotholdramaga"]},saveToAllAccessStore:function(){return["setdemo1","allinolsera2","siliwangidutagarden","barokahfrozenfood"]},outlets:function(){var t=[{name:this.$store.state.userStores.lang.all,store_id:0,url_id:"all"}],e=[];return this.$store.getters.stores.map(function(a){e.includes(a.store_id)||a.is_store_active&&(t.push((0,n.default)({},a)),e.push(a.store_id))}),t},tokopediaActiveStore:function(){return this.$store.state.tokopediaActiveStore},shopeeActiveStore:function(){return this.$store.state.shopeeActiveStore}}};e.default=o},QBmP:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return s});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{visible:t.isEditing,"before-close":t.close,width:"360px",title:"Edit"},on:{"update:visible":function(e){t.isEditing=e}}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"dialog-body"},[a("el-form",{attrs:{model:t.data,"label-position":"top"}},[a("el-form-item",{attrs:{label:t.lang.name}},[a("el-input",{model:{value:t.data.name,callback:function(e){t.$set(t.data,"name",e)},expression:"data.name"}})],1)],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer flex-container",attrs:{slot:"footer"},slot:"footer"},[a("div",{staticStyle:{"flex-grow":"1"}},[a("delete-button",{attrs:{"custom-permission":"catalog/lookbookgroups"},on:{confirm:t.handleDelete}})],1),t._v(" "),a("el-button",{on:{click:t.close}},[t._v("\n      "+t._s(t.lang.cancel)+"\n    ")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.save}},[t._v("\n      "+t._s(t.lang.save)+"\n    ")])],1)])},s=[]},Rvcb:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{item:{type:Object,default:null}},computed:{langId:function(){return this.$store.state.userStores.langId}},methods:{edit:function(){this.$emit("edit",this.item)}}}},Xxu1:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(a("14Xm")),s=i(a("D3Ub")),r=i(a("QbLZ")),o=i(a("DA24"));function i(t){return t&&t.__esModule?t:{default:t}}e.default={props:["isEditing","item","loading"],components:{DeleteButton:o.default},data:function(){return{data:{},showSelectCategory:!1}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},token:function(){return this.$store.state.user.token},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{item:{handler:function(t){this.data=(0,r.default)({},t)},deep:!0,immediate:!0}},methods:{close:function(){this.$emit("close"),this.data={},this.showSelectCategory=!1},save:function(){var t=this;return(0,s.default)(n.default.mark(function e(){return n.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$emit("save",t.data);case 2:t.close();case 3:case"end":return e.stop()}},e,t)}))()},handleDelete:function(){var t=this;return(0,s.default)(n.default.mark(function e(){return n.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$emit("delete",t.item);case 2:t.close();case 3:case"end":return e.stop()}},e,t)}))()}}}},YOUp:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t){return t&&t.__esModule?t:{default:t}}(a("P2sY"));e.default={props:["saved","loading"],data:function(){return{disabledSave:!0,data:{}}},computed:{selectedStore:function(){return this.$store.getters.selectedStore},langId:function(){return this.$store.state.userStores.langId},lang:function(){return this.$store.state.userStores.lang}},watch:{data:{handler:function(t){t.name&&""!==t.name?this.disabledSave=!1:this.disabledSave=!0},deep:!0},saved:{handler:function(t){console.log(t),!0===t&&(this.data={},this.disabledSave=!0)},deep:!0}},methods:{save:function(){this.disabledSave=!0;var t=(0,n.default)({},this.data);this.$emit("save",t)}}}},bNAi:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return s});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dd-handle"},[a("div",{staticClass:"flex-container flex-container--wrap"},[t._m(0),t._v(" "),a("div",{staticStyle:{"flex-grow":"1"}},[t._v("\n      "+t._s(t.item.name)+" "),a("span",{staticClass:"grey"},[t._v("("+t._s(t.item.total_product)+")")])]),t._v(" "),a("div",[a("button-action-authenticated",{attrs:{permission:["catalog/lookbookgroups","edit"],type:"text"},on:{click:t.edit}},[t._v("\n        edit\n      ")])],1)])])},s=[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"hand handle"},[e("i",{staticClass:"el-icon-rank"})])}]},gZFk:function(t,e,a){"use strict";a.d(e,"a",function(){return n}),a.d(e,"b",function(){return s});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{shadow:"never"}},[a("div",{staticClass:"table-handler-flex",attrs:{slot:"header"},slot:"header"},[a("h4",{staticStyle:{"flex-grow":"1"}},[t._v(t._s(t.lang.add)+" "+t._s(t.lang.look_book))]),t._v(" "),a("div",[a("el-button",{attrs:{disabled:t.disabledSave,type:"primary",icon:"el-icon-check"},on:{click:t.save}},[t._v("\n        "+t._s(t.lang.save)+"\n      ")])],1)]),t._v(" "),a("div",{staticClass:"card-body"},[a("el-form",{staticClass:"form-sidebyside"},[a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:t.lang.name,required:!0}},[a("p",[t._v(t._s(this.$lang[t.langId].lookbook_name))])])],1),t._v(" "),a("el-col",{attrs:{span:13}},[a("el-form-item",[a("el-input",{attrs:{type:"text"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.save.apply(null,arguments)}},model:{value:t.data.name,callback:function(e){t.$set(t.data,"name",e)},expression:"data.name"}})],1),t._v(" "),a("div",{staticStyle:{position:"relative","z-index":"-10"}},[a("el-form-item",[a("el-input",{attrs:{type:"text"},model:{value:t.data.alamat,callback:function(e){t.$set(t.data,"alamat",e)},expression:"data.alamat"}})],1)],1)],1)],1)],1)],1)])},s=[]},kgmy:function(t,e,a){"use strict";a.r(e);var n=a("Xxu1"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=s.a},mWuR:function(t,e,a){"use strict";a.r(e);var n=a("Rvcb"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=s.a},mai9:function(t,e,a){"use strict";a.r(e);var n=a("AvTY"),s=a("8FZu");for(var r in s)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return s[t]})}(r);var o=a("KHd+"),i=Object(o.a)(s.default,n.a,n.b,!1,null,null,null);i.options.__file="Index.vue",e.default=i.exports},ppmK:function(t,e,a){"use strict";a.r(e);var n=a("QBmP"),s=a("kgmy");for(var r in s)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return s[t]})}(r);var o=a("KHd+"),i=Object(o.a)(s.default,n.a,n.b,!1,null,null,null);i.options.__file="EditItem.vue",e.default=i.exports},vusD:function(t,e,a){"use strict";a.r(e);var n=a("YOUp"),s=a.n(n);for(var r in n)["default"].indexOf(r)<0&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=s.a}}]);